/* ==========================================================================
   MOTOR DE DOCUMENTOS — previsualización y descarga de constancias/certificados
   La plantilla de cada trámite es configurable desde el administrador.
   ========================================================================== */
(function () {
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function fechaLarga(iso) {
    const d = iso ? new Date(iso + 'T00:00:00') : new Date();
    return `Lima, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  }

  // Plantillas por defecto según el modelo (si el admin no definió una propia)
  function plantillaPorDefecto(t) {
    const base = {
      generaDocumento: t.tipo !== 'Solicitud',
      emisor: 'Secretaría General',
      firmante: 'Dr. Augusto Salcedo Vílchez',
      cargo: 'Secretario General',
      titulo: t.nombre.toUpperCase(),
      cuerpo: ''
    };
    switch (t.modelo) {
      case 'certificado':
        base.cuerpo = 'Que, {nombre}, identificado(a) con DNI N° {dni} y código de matrícula {codigo}, '
          + 'cursó estudios en el programa de {programa} ({nivel}), habiendo aprobado un total de {creditos} créditos. '
          + 'Se expide el presente CERTIFICADO a solicitud del interesado(a) para los fines que estime conveniente.';
        break;
      case 'carne':
        base.cuerpo = 'Que, {nombre}, con código {codigo}, es estudiante regular del programa de {programa}. '
          + 'El presente documento acredita su condición de estudiante para el trámite del carné universitario.';
        break;
      case 'oficio':
        base.cuerpo = 'Que, {nombre}, identificado(a) con código {codigo}, ha concluido satisfactoriamente el plan de estudios '
          + 'del programa de {programa}, ostentando la condición de egresado(a). Se expide a su solicitud.';
        break;
      default: // constancia
        base.cuerpo = 'Que, {nombre}, identificado(a) con DNI N° {dni}, código de matrícula {codigo}, es estudiante del programa de '
          + '{programa} ({nivel}), matriculado(a) en el ciclo {ciclo} del periodo académico {periodo}. '
          + 'Se expide la presente constancia a solicitud del interesado(a).';
    }
    return base;
  }

  function getPlantilla(t) { return Object.assign(plantillaPorDefecto(t), t.plantilla || {}); }

  function fill(text, vars) {
    return (text || '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null && vars[k] !== '') ? vars[k] : m);
  }

  // Alumno de ejemplo para la previsualización del administrador
  const ALUMNO_DEMO = { nombre: 'María Fernanda Quispe', dni: '72845109', codigo: '2021100345',
    perfil: { programa: 'Ingeniería de Sistemas', nivel: 'Pregrado', ciclo: 8, creditos: 168 } };

  function vars(t, alumno, sol) {
    const p = (alumno && alumno.perfil) || {};
    return {
      nombre: alumno ? alumno.nombre : ALUMNO_DEMO.nombre,
      dni: (alumno && alumno.dni) || ALUMNO_DEMO.dni,
      codigo: (alumno && alumno.codigo) || ALUMNO_DEMO.codigo,
      programa: p.programa || ALUMNO_DEMO.perfil.programa,
      nivel: (p.nivel === 'postgrado' ? 'Postgrado' : 'Pregrado'),
      ciclo: p.ciclo || ALUMNO_DEMO.perfil.ciclo,
      creditos: p.creditos != null ? p.creditos : ALUMNO_DEMO.perfil.creditos,
      fecha: fechaLarga(sol ? sol.fecha : null),
      periodo: '2026 - I',
      tramite: t.nombre,
      codigoDoc: sol ? sol.id.replace('S-', 'DOC-') : 'DOC-2026-XXXX',
      operacion: sol && sol.pago ? sol.pago.operacion : ''
    };
  }

  function sheetHTML(t, alumno, sol) {
    const pl = getPlantilla(t);
    const v = vars(t, alumno, sol);
    const cuerpo = fill(pl.cuerpo, v);
    const tipoLabel = (t.tipo || 'Documento').toUpperCase();
    return `
      <div class="doc-sheet" id="doc-sheet">
        <div class="doc-watermark">WIENER</div>
        <header class="doc-head">
          <div class="doc-logo">W</div>
          <div class="doc-org">
            <b>UNIVERSIDAD PRIVADA NORBERT WIENER</b>
            <span>${pl.emisor}</span>
          </div>
          <div class="doc-code">${v.codigoDoc}</div>
        </header>
        <div class="doc-rule"></div>
        <h2 class="doc-title">${pl.titulo}</h2>
        <p class="doc-lead">${pl.emisor} de la Universidad Privada Norbert Wiener, que suscribe, hace constar:</p>
        <p class="doc-body">${cuerpo}</p>
        <p class="doc-date">${v.fecha}</p>
        <div class="doc-sign">
          <div class="doc-sign-line"></div>
          <b>${pl.firmante}</b>
          <span>${pl.cargo}</span>
        </div>
        <footer class="doc-foot">
          Documento electrónico. Verifique su autenticidad en constancias.uwiener.edu.pe con el código ${v.codigoDoc}.
          ${v.operacion ? ' · Pago Niubiz Op. ' + v.operacion : ''}
        </footer>
      </div>`;
  }

  // ----- Render del MODELO como imagen rasterizada (marca de agua incrustada) -----
  // Al ser un canvas aplanado, la marca de agua no se puede quitar desde el HTML/DevTools
  // (no existe un elemento o capa separable: documento y marca son los mismos píxeles).
  function roundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrapLines(ctx, text, maxW) {
    const words = (text || '').split(/\s+/); const lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line); return lines;
  }

  function drawModel(canvas, t, alumno, sol) {
    const pl = getPlantilla(t); const v = vars(t, alumno, sol);
    const W = 760, M = 64;
    const leadText = pl.emisor + ' de la Universidad Privada Norbert Wiener, que suscribe, hace constar:';
    const body = fill(pl.cuerpo, v);

    const meas = document.createElement('canvas').getContext('2d');
    meas.font = '15px Georgia'; const leadLines = wrapLines(meas, leadText, W - 2 * M);
    meas.font = '16px Georgia'; const bodyLines = wrapLines(meas, body, W - 2 * M);

    let H = 70 + 34 + 44 + 40 + leadLines.length * 24 + 14 + bodyLines.length * 30 + 24 + 90 + 70 + 80;
    H = Math.max(H, 880);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

    let y = 64;
    // Logo
    ctx.fillStyle = '#0F848F'; roundRect(ctx, M, y - 30, 50, 50, 10); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '900 26px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('W', M + 25, y - 4);
    // Organización
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#0B636B'; ctx.font = 'bold 14px Arial';
    ctx.fillText('UNIVERSIDAD PRIVADA NORBERT WIENER', M + 64, y - 10);
    ctx.fillStyle = '#5B6E80'; ctx.font = '12px Arial'; ctx.fillText(pl.emisor, M + 64, y + 9);
    ctx.textAlign = 'right'; ctx.fillStyle = '#5B6E80'; ctx.font = '11px Arial'; ctx.fillText(v.codigoDoc, W - M, y - 4);
    ctx.textAlign = 'left';
    y += 34;
    ctx.fillStyle = '#0F848F'; ctx.fillRect(M, y, W - 2 * M, 3); y += 44;
    // Título
    ctx.fillStyle = '#222'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.fillText(pl.titulo, W / 2, y);
    ctx.textAlign = 'left'; y += 40;
    // Lead
    ctx.fillStyle = '#333'; ctx.font = '15px Georgia';
    leadLines.forEach(l => { ctx.fillText(l, M, y); y += 24; }); y += 14;
    // Cuerpo
    ctx.fillStyle = '#1f2937'; ctx.font = '16px Georgia';
    bodyLines.forEach(l => { ctx.fillText(l, M, y); y += 30; }); y += 24;
    // Fecha
    ctx.fillStyle = '#333'; ctx.font = '15px Georgia'; ctx.fillText(v.fecha, M, y); y += 90;
    // Firma
    const cx = W / 2; ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 115, y); ctx.lineTo(cx + 115, y); ctx.stroke(); y += 22;
    ctx.textAlign = 'center'; ctx.fillStyle = '#222'; ctx.font = 'bold 14px Arial'; ctx.fillText(pl.firmante, cx, y); y += 18;
    ctx.fillStyle = '#5B6E80'; ctx.font = '12px Arial'; ctx.fillText(pl.cargo, cx, y);
    // Pie
    ctx.fillStyle = '#94A3B8'; ctx.font = '10px Arial';
    ctx.fillText('Documento electrónico. Verifique en constancias.uwiener.edu.pe con el código ' + v.codigoDoc, W / 2, H - 40);
    ctx.textAlign = 'left';

    // Marca de agua diagonal incrustada
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 6);
    ctx.font = '900 30px Arial'; ctx.fillStyle = 'rgba(192,57,43,0.20)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const phrase = 'DOCUMENTO SIN VALIDEZ LEGAL';
    const stepX = ctx.measureText(phrase).width + 90, stepY = 118;
    const reach = Math.max(W, H);
    for (let gy = -reach, row = 0; gy < reach; gy += stepY, row++)
      for (let gx = -reach + (row % 2 ? stepX / 2 : 0); gx < reach; gx += stepX)
        ctx.fillText(phrase, gx, gy);
    ctx.restore();
  }

  // Overlay propio (no usa #modal-host) para no tapar el modal de edición del admin.
  // Dibuja sobre un <canvas> vivo: la marca de agua queda incrustada en los píxeles y
  // no hay capa separable que quitar desde el HTML. No usa toDataURL ni window.open
  // (ambos bloqueados bajo file:// por origen único de seguridad).
  function showModelOverlay(t, alumno, sol) {
    if (!getPlantilla(t).generaDocumento) {
      APP.toast({ icon: 'ℹ️', title: 'Sin documento', body: 'Este trámite no genera un documento descargable.' });
      return;
    }
    const host = document.createElement('div');
    host.className = 'modal-overlay open';
    host.style.zIndex = '300';
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    host.setAttribute('aria-label', 'Modelo del documento: ' + t.nombre);

    const canSolicitar = typeof window.abrirWizard === 'function';

    host.innerHTML =
      '<div class="modal wide modal-doc-preview">'
      + '<div class="modal-head">'
      + '  <div style="display:flex;align-items:center;gap:12px">'
      + '    <div class="doc-modal-icon">'
      + '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>'
      + '        <polyline points="14 2 14 8 20 8"></polyline>'
      + '        <line x1="16" y1="13" x2="8" y2="13"></line>'
      + '        <line x1="16" y1="17" x2="8" y2="17"></line>'
      + '        <polyline points="10 9 9 9 8 9"></polyline>'
      + '      </svg>'
      + '    </div>'
      + '    <div>'
      + '      <span class="doc-modal-kicker">Modelo de documento oficial</span>'
      + '      <h3 class="doc-modal-title">' + t.nombre + '</h3>'
      + '    </div>'
      + '  </div>'
      + '  <button class="btn-close-modal" aria-label="Cerrar vista">'
      + '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
      + '      <line x1="18" y1="6" x2="6" y2="18"></line>'
      + '      <line x1="6" y1="6" x2="18" y2="18"></line>'
      + '    </svg>'
      + '  </button>'
      + '</div>'
      + '<div class="modal-body doc-preview-body" id="doc-modal-body">'
      + '  <div class="doc-preview-wrapper">'
      + '    <canvas class="doc-raster" oncontextmenu="return false" ondragstart="return false"></canvas>'
      + '  </div>'
      + '</div>'
      + '<div class="modal-foot doc-modal-foot">'
      + '  <div class="doc-foot-info">'
      + '    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">'
      + '      <circle cx="12" cy="12" r="10"></circle>'
      + '      <line x1="12" y1="16" x2="12" y2="12"></line>'
      + '      <line x1="12" y1="8" x2="12.01" y2="8"></line>'
      + '    </svg>'
      + '    <span>Vista con marca de agua referencial. El documento oficial se emitirá con firma digital y código QR.</span>'
      + '  </div>'
      + '  <div class="doc-foot-actions">'
      + '    <button class="btn btn-ghost close-x">Cerrar</button>'
      + (canSolicitar
          ? '    <button class="btn btn-primary btn-solicitar-desde-modelo">Solicitar trámite <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>'
          : '')
      + '  </div>'
      + '</div>'
      + '</div>';

    document.body.appendChild(host);

    const modalBody = host.querySelector('#doc-modal-body');
    const modalElem = host.querySelector('.modal-doc-preview');
    if (modalBody) modalBody.scrollTop = 0;
    if (modalElem) modalElem.scrollTop = 0;

    drawModel(host.querySelector('canvas'), t, alumno, sol);

    // Asegurar posición al inicio (top) sin desplazamiento involuntario
    requestAnimationFrame(() => {
      if (modalBody) modalBody.scrollTop = 0;
      if (modalElem) modalElem.scrollTop = 0;
    });

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    const close = () => {
      document.removeEventListener('keydown', escHandler);
      host.remove();
    };
    document.addEventListener('keydown', escHandler);
    host.querySelector('.btn-close-modal').onclick = close;
    host.querySelector('.close-x').onclick = close;
    host.addEventListener('click', e => { if (e.target === host) close(); });

    const btnSolicitar = host.querySelector('.btn-solicitar-desde-modelo');
    if (btnSolicitar) {
      btnSolicitar.onclick = () => {
        close();
        if (typeof window.abrirWizard === 'function') {
          window.abrirWizard(t.id);
        }
      };
    }

    // Foco en botón de cerrar del header sin hacer scroll hacia abajo
    setTimeout(() => {
      const closeBtn = host.querySelector('.btn-close-modal');
      if (closeBtn && typeof closeBtn.focus === 'function') {
        closeBtn.focus({ preventScroll: true });
      }
      if (modalBody) modalBody.scrollTop = 0;
      if (modalElem) modalElem.scrollTop = 0;
    }, 40);
  }

  function standaloneHTML(t, alumno, sol) {
    const css = `
      *{box-sizing:border-box} body{margin:0;background:#475569;padding:24px;font-family:Georgia,'Times New Roman',serif}
      .doc-sheet{background:#fff;max-width:760px;margin:0 auto;padding:64px 72px;position:relative;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.3)}
      .doc-watermark{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%) rotate(-24deg);font-family:Arial;font-weight:900;font-size:120px;color:rgba(15,132,143,.05);letter-spacing:8px;pointer-events:none}
      .doc-head{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
      .doc-logo{width:54px;height:54px;border-radius:10px;background:#0F848F;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Arial;font-weight:900;font-size:28px}
      .doc-org b{font-family:Arial;font-size:15px;color:#0B636B;display:block;letter-spacing:.5px}
      .doc-org span{font-family:Arial;font-size:12px;color:#5B6E80}
      .doc-code{margin-left:auto;font-family:Arial;font-size:11px;color:#5B6E80;border:1px solid #C6CFD7;border-radius:6px;padding:4px 10px}
      .doc-rule{height:3px;background:#0F848F;margin:18px 0 34px;border-radius:2px}
      .doc-title{font-family:Arial;text-align:center;font-size:20px;letter-spacing:2px;color:#222;margin:0 0 30px}
      .doc-lead{font-size:15px;color:#333;margin-bottom:18px}
      .doc-body{font-size:16px;line-height:2;color:#1f2937;text-align:justify;text-indent:40px}
      .doc-date{margin-top:40px;font-size:15px;color:#333}
      .doc-sign{margin-top:70px;text-align:center}
      .doc-sign-line{width:260px;height:1px;background:#333;margin:0 auto 8px}
      .doc-sign b{font-family:Arial;font-size:14px;display:block}
      .doc-sign span{font-family:Arial;font-size:12px;color:#5B6E80}
      .doc-foot{margin-top:54px;border-top:1px solid #E2E8F0;padding-top:12px;font-family:Arial;font-size:10.5px;color:#94A3B8;text-align:center}
      @media print{body{background:#fff;padding:0}.doc-sheet{box-shadow:none;max-width:none}}
    `;
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${t.nombre}</title><style>${css}</style></head><body>${sheetHTML(t, alumno, sol)}</body></html>`;
  }

  // El documento oficial ya está renderizado en el modal abierto; se imprime con
  // una hoja de estilos @media print (sin window.open, que file:// bloquea).
  function imprimir() { window.print(); }

  function descargar(t, alumno, sol) {
    const blob = new Blob([standaloneHTML(t, alumno, sol)], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nombre = (sol ? sol.id + '_' : '') + t.nombre.replace(/\s+/g, '_') + '.html';
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    APP.toast({ icon: '⬇️', title: 'Documento descargado', body: nombre });
  }

  // Modal de previsualización (usado por alumno y por admin)
  function preview(t, alumno, sol, opts = {}) {
    // Modelo / vista previa no oficial -> overlay con canvas y marca de agua
    if (opts.modelo || opts.adminPreview) { showModelOverlay(t, alumno, sol); return; }

    // Documento oficial emitido (válido y descargable)
    const noGenera = !getPlantilla(t).generaDocumento;
    APP.openModal(`
      <div class="modal-head">
        <h3>Documento emitido</h3>
        <button class="modal-close" onclick="APP.closeModal()">×</button>
      </div>
      <div class="modal-body doc-preview-body">
        ${noGenera
          ? '<div class="alert warn">Este trámite no genera un documento descargable (es una solicitud/gestión).</div>'
          : sheetHTML(t, alumno, sol)}
      </div>
      <div class="modal-foot">
        <button class="btn" onclick="APP.closeModal()">Cerrar</button>
        ${!noGenera ? `<button class="btn" onclick="DOC._dl('${t.id}','${alumno ? alumno.id : ''}','${sol ? sol.id : ''}')">⬇ Descargar</button>
        <button class="btn btn-primary" onclick="DOC._pr('${t.id}','${alumno ? alumno.id : ''}','${sol ? sol.id : ''}')">🖨 Imprimir / PDF</button>` : ''}
      </div>
    `, { wide: true });
  }

  function _resolve(tId, aId, sId) {
    const t = DB.getTramite(tId);
    const alumno = aId ? DB.getUsuario(aId) : null;
    const sol = sId ? DB.getSolicitud(sId) : null;
    return { t, alumno, sol };
  }

  window.DOC = {
    getPlantilla, sheetHTML, preview, drawModel,
    modelo: showModelOverlay, abrir: showModelOverlay, imprimir, descargar, fill, vars, ALUMNO_DEMO,
    _dl(tId, aId, sId) { const r = _resolve(tId, aId, sId); descargar(r.t, r.alumno, r.sol); },
    _pr(tId, aId, sId) { const r = _resolve(tId, aId, sId); imprimir(r.t, r.alumno, r.sol); }
  };
})();
