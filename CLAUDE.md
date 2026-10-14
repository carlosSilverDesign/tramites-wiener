# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Navigable **HTML/CSS/JS prototype** (no build step, no backend, no dependencies) of the *Sistema de Trámites* for Universidad Norbert Wiener: students request documents (constancias/certificados), pay via Niubiz, and track status; administrative staff configure trámites, review/approve requests, and manage users/security. Backend (email, payments, persistence) is **simulated** and isolated behind seams meant to be swapped for a real API later.

Design tokens (fonts `Lato`/`Roboto`, teal `#0F848F`) are borrowed from the separate *Skeleton Asistencia* intranet page; keep new UI consistent with the CSS variables in `:root` of `css/styles.css`.

## Resumen (lo esencial)
- **Sin build/test/lint.** Abrir `index.html` o `npx serve .`. Estado en `localStorage`; reseed con `DB.reset()`.
- **No romper bajo `file://`:** nada de `toDataURL`, `window.open`+`document.write`, ni `fetch` local (origen único de seguridad). Usar canvas vivo, `@media print` y `Blob` para descarga.
- **Tres globales:** `DB` (datos + elegibilidad), `APP` (shell/sesión/modal/toast/`sendMail`/`niubizCheckout`), `DOC` (documentos).
- **Patrón de página:** cargar `data.js → shell.js → doc.js`, llamar `APP.renderShell(activeId)`, pintar en `ctx.mount.innerHTML`. Sin router ni framework.
- **Dos roles:** `alumno` y `administrativo` (sidebar en `NAV` de `shell.js`).
- **Reglas clave del modelo:** `audiencia` (visibilidad por perfil vía `DB.elegible`) y `pagoMomento` (`antes`/`despues`) cambian flujo y stepper.
- **Documentos:** modelo = canvas con marca de agua incrustada (no descargable); oficial emitido = `sheetHTML` con descarga/impresión.
- **Convención:** cero em-dashes (`—`/`–`) en texto visible; usar `-`. UI en español.

## Cuentas demo
El login en `index.html` no pide contraseña real: se elige perfil y entra como el **primer usuario activo** de ese rol (definidos en `data.js`).
- **Alumno:** María Fernanda Quispe · código `2021100345` (pregrado, Ingeniería de Sistemas, ciclo 8, 168 créditos, tercio superior). Segundo alumno activo: José Antonio Ramos · `2019054420`.
- **Administrativo:** Carlos Mendoza Ríos · `ADM-0091` (área Registros Académicos). Lucía Paredes (`ADM-0102`) está **inactiva** a propósito.

## Variables de plantilla de documento
Disponibles en el cuerpo/título de un trámite (sustituidas por `DOC.fill`): `{nombre}`, `{dni}`, `{codigo}`, `{programa}`, `{nivel}`, `{ciclo}`, `{creditos}`, `{fecha}` (formato largo "Lima, d de mes de aaaa"), `{periodo}`, `{tramite}`, `{codigoDoc}`, `{operacion}` (Niubiz). En el modelo se rellenan con datos de ejemplo; al emitir, con los datos reales del alumno.

## Running

There is no test/lint/build tooling. To run, open `index.html` in a browser, or serve the folder:

```
npx serve .          # node is available; python is only a Store stub on this machine
```

Syntax-check the JS after edits (the only automated check available):

```
node --check js/data.js && node --check js/shell.js && node --check js/doc.js
```

State lives in `localStorage`. To reseed mock data, run `DB.reset()` in the browser console (keys: `tw_db_v1` data, `tw_session` login).

## `file://` constraints (important)

Pages are normally opened directly from disk, where Chrome treats each file as a **unique security origin**. Do **not** introduce `canvas.toDataURL()`, `getImageData()`, `window.open(...).document.write(...)`, or `fetch()` of local files — they throw "unsafe attempt to load URL" / tainted-canvas errors. Established workarounds in the code: render watermarked models onto a **live `<canvas>` in the DOM** (not exported to a data URL); print via an `@media print` stylesheet (not a popup); download via `Blob` + `URL.createObjectURL` (this is allowed).

## Architecture

### Page bootstrap pattern
Every page is a thin HTML shell that loads, in order, `js/data.js` → `js/shell.js` → (`js/doc.js` where documents are needed), then an inline `<script>` that:
1. calls `APP.renderShell('<activeNavId>')` which injects the sidebar/topbar, enforces the session guard, and returns `{ session, mount }`;
2. renders the page by assigning a template-string to `ctx.mount.innerHTML`;
3. wires interactions via inline `onclick="..."` handlers calling page-local functions and the global helpers.

There is no router and no component framework — navigation is plain `<a href>` between HTML files. Re-rendering a view = rebuild its `innerHTML`.

### Three global namespaces
- **`window.DB`** (`js/data.js`) — data layer over `localStorage`. Owns the seed data and the **eligibility engine** `DB.elegible(tramite, perfil)` plus `DB.audienciaTexto(...)`. CRUD helpers (`tramites()`, `solicitudes()`, `upsertTramite`, `addSolicitud`, `updateSolicitud`, etc.) read-modify-write the whole DB object each call.
- **`window.APP`** (`js/shell.js`) — shell + cross-page UI. Session (`tw_session`), `renderShell`, `NAV` map (per-role sidebar), `openModal`/`closeModal` (single `#modal-host`), `toast`, **`sendMail`** (simulated: shows toasts for the student mail + CC copy), **`niubizCheckout`** (simulated card lightbox), and formatters (`money`, `nowStamp`, `pillFor`). `BASE` is computed from the path (`''` at root, `'../'` under `/alumno/` or `/admin/`) — use it for any cross-folder link built in JS.
- **`window.DOC`** (`js/doc.js`) — document engine. `getPlantilla(t)` merges a trámite's saved `plantilla` over a per-`modelo` default; `fill(text, vars)` substitutes `{nombre}`, `{codigo}`, `{programa}`, `{ciclo}`, `{creditos}`, `{fecha}`, etc. **Two render paths that must stay distinct:** the **model preview** (`DOC.modelo`/`DOC.preview(...,{modelo:true})`) draws onto a canvas with the diagonal "DOCUMENTO SIN VALIDEZ LEGAL" watermark baked into the pixels and exposes no download/print; the **official emitted document** (`DOC.preview(t, alumno, sol)` with no opts) renders `sheetHTML` and offers real download/print.

### Roles & flows
Two profiles, selected at the demo login and stored in the session: **`alumno`** (sees `alumno/solicitar.html`, `alumno/mis-tramites.html`) and **`administrativo`** (sees `admin/solicitudes.html`, `flujos`, `tramites`, `usuarios`, `seguridad`). The sidebar for each is driven by the `NAV` object in `shell.js`.

A trámite carries a configurable **`audiencia`** (niveles, ciclos, `minCreditos`, `promedioMin`, `tercioSuperior`, `quintoSuperior`) that `DB.elegible` matches against a student's `perfil` to decide visibility. It also carries **`pagoMomento`** (`'antes'` = pay at request via Niubiz, `'despues'` = pay after approval) which changes both the request flow in `solicitar.html` and the stepper stages in `mis-tramites.html`. Request state machine: `Pendiente de pago → En revisión → Aprobado → Emitido` (or `Rechazado`); approval/rejection in `admin/solicitudes.html` appends to `historial` and calls `APP.sendMail` to the student with CC to the admin.

## Conventions
- **No em-dashes (`—`) or en-dashes (`–`) in any user-visible string** (titles, headings, email subjects, placeholders, history notes). Use a regular hyphen `-`. This is enforced across the UI.
- Spanish UI copy throughout.
- Currency via `APP.money(n)` → `S/ x.xx`. Status pills via `APP.pillFor(estado)`.
- When adding admin-configurable fields to a trámite, thread them through `admin/tramites.html` (`editar` modal + `guardar`), the seed shape in `data.js`, and any consumer (eligibility, flow, or document template).

## Backend seams (when wiring a real backend)
Replace these in place; the rest of the UI stays: `APP.niubizCheckout` → Niubiz Security/Authorization API + server-side confirmation; `APP.sendMail` → `POST /api/mail` (student + CC admin); `window.DB` (localStorage) → REST API; demo login in `index.html` → institutional auth/session. `README.md` has the integration table.
