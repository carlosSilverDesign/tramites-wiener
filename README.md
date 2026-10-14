# Sistema de Trámites — Universidad Norbert Wiener (Diseño / Prototipo HTML)

Prototipo navegable del módulo de trámites documentarios. Reutiliza las fuentes
(`Lato` + `Roboto`) y la paleta (teal `#0F848F`) del *Skeleton de Asistencias*.

> Esta entrega es **el diseño en HTML/CSS/JS** (sin backend). Los datos viven en
> `localStorage`; el correo y la pasarela **Niubiz** están **simulados** pero
> aislados en funciones, listos para conectar al backend real.

## Cómo verlo
Abre `index.html` en el navegador, o sirve la carpeta:
```
npx serve .      # o:  python -m http.server 5500
```
En el login elige **Alumno** o **Administrativo** y presiona *Ingresar* (demo).

## Estructura
```
index.html              Login con selección de perfil
css/styles.css          Design system (tokens del skeleton)
js/data.js              Datos mock + reglas de elegibilidad (localStorage)
js/shell.js             Sidebar/topbar por rol, sesión, toast/correo, modal, checkout Niubiz
alumno/
  solicitar.html        Catálogo de trámites filtrado por perfil + pago Niubiz
  mis-tramites.html     Estado de solicitudes (stepper) + pago diferido
admin/
  solicitudes.html      Revisar/aprobar/rechazar → notifica al alumno + CC administrativo
  tramites.html         CRUD de trámites (todas las variables de configuración)
  flujos.html           Flujos por trámite (solicitud→pago→revisión→aprobación→emisión)
  usuarios.html         Administrador de usuarios y permisos
  seguridad.html        Roles/permisos, políticas y auditoría
```

## Variables configurables del trámite (admin → Trámites)
Nombre · tipo (Constancia/Certificado/Carné/Solicitud) · modelo/plantilla ·
costo · **pago antes/después** · días de entrega · área · requiere aprobación ·
activo, y la **audiencia**: nivel (pregrado/postgrado), ciclos, créditos mínimos,
promedio mínimo, tercio superior, quinto superior.

## Perfiles
- **Alumno:** solicitar trámite (solo los habilitados para su perfil) y estado.
- **Administrativo:** revisar/aprobar solicitudes, flujos, CRUD de trámites,
  usuarios y seguridad.

## Puntos de integración real (al pasar a backend)
| Función (en `js/shell.js`)        | Reemplazar por |
|-----------------------------------|----------------|
| `APP.niubizCheckout(...)`         | Sesión de pago con la **Security/Authorization API de Niubiz** (botón checkout.js) + confirmación server-side |
| `APP.sendMail(...)`               | `POST /api/mail` (nodemailer o API de correo institucional) — envía al alumno con **CC** al administrativo |
| `window.DB` (localStorage)        | API REST (Node/Express + SQLite/MySQL) |
| Login demo (`index.html`)         | Autenticación institucional (SSO/LDAP) + sesión/JWT |

Credenciales de Niubiz y SMTP se cargarán desde un `.env`; si no están
configuradas, el sistema mantiene el modo simulación para la demo.
