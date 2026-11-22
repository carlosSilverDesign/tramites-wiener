/* ==========================================================================
   VISTA: ESTADO DE TRÁMITES (alumno/mis-tramites.js)
   Universidad Norbert Wiener - Sistema de Trámites
   ========================================================================== */

const ctx = APP.renderShell('mis-tramites');
const me = ctx.session;

let filtroEstado = 'todos';
let busqueda = '';

// Generador de Stepper Cronológico Corregido y Accesible
function renderStepper(s) {
  const t = DB.getTramite(s.tramiteId);
  const esCambioModalidad = s.tramiteId === 'T-004' || (s.tramiteNombre && s.tramiteNombre.toLowerCase().includes('cambio de modalidad'));
  const esEmisionInmediata = (t && (t.diasEntrega === 0 || t.requiereAprobacion === false)) ||
    (s.tramiteId === 'T-010') ||
    (s.tramiteNombre && s.tramiteNombre.toLowerCase().includes('certificación progresiva')) ||
    (s.certificacionId);

  const pagoAntes = s.pagoMomento === 'antes' || (t && t.pagoMomento === 'antes');

  // Iconos SVG limpios para los estados del stepper
  const svgCheck = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  const svgErr = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  const svgWarn = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  let steps = [];

  if (esCambioModalidad) {
    steps = [
      { id: 'solicitud', label: 'Consentimiento suscrito' },
      { id: 'aprobacion', label: 'Cambio de modalidad aprobado' }
    ];
  } else if (esEmisionInmediata) {
    // Flujo directo automatizado (3 pasos: Validación -> Pago -> Emisión Inmediata)
    steps = [
      { id: 'solicitud', label: 'Solicitud y requisitos' },
      { id: 'pago', label: 'Pago Niubiz' },
      { id: 'emision', label: 'Emisión digital' }
    ];
  } else if (pagoAntes) {
    // Flujo estándar con pago previo (5 pasos)
    steps = [
      { id: 'solicitud', label: 'Solicitud' },
      { id: 'pago', label: 'Pago Niubiz' },
      { id: 'revision', label: 'En revisión' },
      { id: 'aprobacion', label: 'Aprobación' },
      { id: 'emision', label: 'Emisión final' }
    ];
  } else {
    // Flujo estándar con pago posterior a aprobación (5 pasos)
    steps = [
      { id: 'solicitud', label: 'Solicitud' },
      { id: 'revision', label: 'En revisión' },
      { id: 'aprobacion', label: 'Aprobación' },
      { id: 'pago', label: 'Pago Niubiz' },
      { id: 'emision', label: 'Emisión final' }
    ];
  }

  // Mapear cada paso con su estado visual exacto
  const stepItems = steps.map((st, i) => {
    let cls = '';
    let dotContent = i + 1;
    let subText = '';

    if (s.estado === 'Emitido') {
      cls = 'done';
      dotContent = svgCheck;
    } else if (s.estado === 'Rechazado' || s.estado === 'Cancelar' || s.estado === 'Cancelado') {
      if (st.id === 'solicitud') {
        cls = 'err';
        dotContent = svgErr;
        subText = s.estado === 'Rechazado' ? 'Rechazado' : 'Cancelado';
      }
    } else if (s.estado === 'Solicitado') {
      if (st.id === 'solicitud') {
        cls = 'current';
        dotContent = '1';
        subText = 'Registrado';
      }
    } else if (s.estado === 'Observado') {
      if (st.id === 'solicitud' || (st.id === 'pago' && s.pago.estado === 'pagado')) {
        cls = 'done';
        dotContent = svgCheck;
      } else if (st.id === 'revision') {
        cls = 'warn';
        dotContent = svgWarn;
        subText = 'Observación';
      }
    } else if (s.estado === 'Aprobado') {
      if (esCambioModalidad) {
        cls = 'done';
        dotContent = svgCheck;
        subText = 'Aprobado';
      } else if (pagoAntes) {
        if (['solicitud', 'pago', 'revision', 'aprobacion'].includes(st.id)) {
          cls = 'done'; dotContent = svgCheck;
        }
      } else {
        if (['solicitud', 'revision', 'aprobacion'].includes(st.id)) {
          cls = 'done'; dotContent = svgCheck;
        }
        if (st.id === 'pago') {
          cls = s.pago.estado === 'pagado' ? 'done' : 'current';
          dotContent = s.pago.estado === 'pagado' ? svgCheck : (i + 1);
        }
      }
    } else if (s.estado === 'En revisión') {
      if (st.id === 'solicitud' || (st.id === 'pago' && (pagoAntes || esEmisionInmediata))) {
        cls = 'done'; dotContent = svgCheck;
      } else if (st.id === 'revision' || (st.id === 'emision' && esEmisionInmediata)) {
        cls = 'current';
      }
    } else if (s.estado === 'Pendiente de pago') {
      if (st.id === 'solicitud') {
        cls = 'done'; dotContent = svgCheck;
      } else if (st.id === 'pago') {
        cls = 'current';
      }
    }

    return `
      <div class="step ${cls}">
        <div class="dot">${dotContent}</div>
        <div class="step-label">${st.label}</div>
        ${subText ? `<div class="step-date ${cls === 'err' ? 'step-date-err' : 'step-date-warn'}">${subText}</div>` : ''}
      </div>`;
  }).join('');

  return `<div class="stepper" role="progressbar" aria-label="Progreso del trámite">${stepItems}</div>`;
}

function setFiltro(f, el) {
  filtroEstado = f;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  render();
}

function setBusqueda(val) {
  busqueda = (val || '').toLowerCase().trim();
  render();
}

function render() {
  const allMine = DB.solicitudes().filter(s => s.alumnoId === me.id);

  // Priorizar el trámite en estado 'Solicitado' para que siempre aparezca primero en la lista
  allMine.sort((a, b) => {
    if (a.estado === 'Solicitado' && b.estado !== 'Solicitado') return -1;
    if (b.estado === 'Solicitado' && a.estado !== 'Solicitado') return 1;
    return (b.fecha || '').localeCompare(a.fecha || '');
  });

  const counts = {
    todos: allMine.length,
    proceso: allMine.filter(s => ['Solicitado', 'Pendiente de pago', 'En revisión'].includes(s.estado)).length,
    observados: allMine.filter(s => s.estado === 'Observado').length,
    emitidos: allMine.filter(s => s.estado === 'Emitido').length,
    rechazados: allMine.filter(s => ['Rechazado', 'Cancelar', 'Cancelado'].includes(s.estado)).length
  };

  let filtradas = allMine.filter(s => {
    if (filtroEstado === 'proceso') return ['Solicitado', 'Pendiente de pago', 'En revisión'].includes(s.estado);
    if (filtroEstado === 'observados') return s.estado === 'Observado';
    if (filtroEstado === 'emitidos') return s.estado === 'Emitido';
    if (filtroEstado === 'rechazados') return ['Rechazado', 'Cancelar', 'Cancelado'].includes(s.estado);
    return true;
  });

  if (busqueda) {
    filtradas = filtradas.filter(s =>
      (s.id + ' ' + s.tramiteNombre + ' ' + s.area + ' ' + (s.motivo || '')).toLowerCase().includes(busqueda)
    );
  }

  const cardsHtml = filtradas.map(s => {
    const esObservado = s.estado === 'Observado';
    const esRechazado = s.estado === 'Rechazado';
    const esCancelado = s.estado === 'Cancelar' || s.estado === 'Cancelado';
    const esSolicitado = s.estado === 'Solicitado';
    const pagoPendiente = (s.estado === 'Aprobado' || s.estado === 'Pendiente de pago') && s.pago.estado !== 'pagado';
    const esEmitido = s.estado === 'Emitido';

    return `
      <div class="tracking-card ${esObservado ? 'is-observado' : esRechazado || esCancelado ? 'is-rechazado' : ''}">
        <div class="tracking-head">
          <div class="tracking-title-wrap">
            <div class="tracking-super-line">
              <span class="tracking-id-badge">${s.id}</span>
              <span>Registrado el <b>${s.fecha}</b></span>
              <span class="sep">·</span>
              <span>${s.area}</span>
            </div>
            <h3>${s.tramiteNombre}</h3>
            <div class="tracking-meta">
              <span>Tasa: <b>${s.costo > 0 ? APP.money(s.costo) : 'Gratuito'}</b></span>
              <span class="sep">·</span>
              <span class="${s.costo === 0 || s.pago.estado === 'pagado' ? 'payment-status-ok' : 'payment-status-warn'}">
                ${s.costo === 0 ? '<span class="inline-svg-text"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Trámite sin costo</span>' : (s.pago.estado === 'pagado' ? '<span class="inline-svg-text"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Pago confirmado</span>' : '<span class="inline-svg-text">● Pendiente de pago</span>')}
              </span>
              ${s.motivo ? `<span class="sep">·</span><span>Motivo: <i>${s.motivo}</i></span>` : ''}
              ${s.adjunto ? `<span class="sep">·</span><span class="inline-svg-text"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg> Adjunto: ${s.adjunto}</span>` : ''}
            </div>
          </div>

          <div class="tracking-right-col">
            <div>${APP.pillFor(s.estado)}</div>
            <div class="row-actions">
              ${esSolicitado ? `
                <button class="btn btn-danger btn-sm" onclick="confirmarCancelacion('${s.id}')" title="Cancelar esta solicitud">
                  Cancelar
                </button>
              ` : ''}
              ${pagoPendiente ? `<button class="btn btn-primary btn-sm btn-action-inline" onclick="pagar('${s.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg> Pagar ahora</button>` : ''}
              ${esEmitido ? `<button class="btn btn-primary btn-sm btn-action-inline" onclick="verDoc('${s.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> Ver documento oficial</button>` : ''}
              <button class="btn btn-sm" onclick="detalle('${s.id}')">Ver expediente</button>
            </div>
          </div>
        </div>

        <hr class="divider divider-tracking">
        ${renderStepper(s)}

        <!-- Callout de Subsanación con Temporizador de 48h -->
        ${esObservado ? `
          <div class="subsanacion-callout">
            <div class="subsanacion-text">
              <b class="subsanacion-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Atención requerida: Tu solicitud tiene una observación</b>
              <p>${s.observacion || 'El área responsable requiere que actualices o corrijas un documento de sustento.'}</p>
              <div class="subsanacion-pill"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 48 horas restantes para subsanar sin reiniciar trámite</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="abrirSubsanacion('${s.id}')">
              <span class="subsanacion-btn-text"><span>Subsanar observación ahora</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
            </button>
          </div>` : ''}

        ${esCancelado ? `
          <div class="alert err alert-cancel-box">
            <div class="alert-header-line"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> <b>Solicitud cancelada por el alumno:</b> ${s.observacion || 'El trámite fue dado de baja a petición del titular.'}</div>
            <div class="alert-subtext">
              <span class="inline-svg-text"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Este trámite ha finalizado por desistimiento. Si necesitas realizar este trámite nuevamente, puedes generar una nueva solicitud desde el portal.</span>
            </div>
          </div>` : esRechazado ? `
          <div class="alert err alert-cancel-box">
            <div class="alert-header-line"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> <b>Solicitud desestimada por ${s.area}:</b> ${s.observacion}</div>
            <div class="alert-subtext">
              <span class="inline-svg-text"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Si requieres apelar la resolución o consultar sobre la devolución de derechos abonados, comunícate con <b>mesadepartes@uwiener.edu.pe</b> indicando tu N° de expediente <b>${s.id}</b>.</span>
            </div>
          </div>` : s.observacion && !esObservado ? `
          <div class="alert info alert-info-box">
            <span class="subsanacion-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <b>Detalle del área:</b> ${s.observacion}</span>
          </div>` : ''}
      </div>`;
  }).join('');

  ctx.mount.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Estado y seguimiento de trámites</h1>
        <p>Consulta en tiempo real el avance de tus solicitudes y resuelve observaciones pendientes.</p>
      </div>
      <a class="btn btn-primary" href="solicitar.html">+ Solicitar nuevo trámite</a>
    </div>

    <!-- Métricas resumidas -->
    <div class="grid grid-3 kpi-tracking-grid">
      <div class="stat accent">
        <div class="label">Total de trámites</div>
        <div class="value">${counts.todos}</div>
      </div>
      <div class="stat">
        <div class="label">En revisión / proceso</div>
        <div class="value">${counts.proceso}</div>
      </div>
      <div class="stat ${counts.observados > 0 ? 'stat-observado' : ''}">
        <div class="label ${counts.observados > 0 ? 'stat-label-observado' : ''}">
          ${counts.observados > 0 ? '<span class="inline-svg-text"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Con observación</span>' : 'Observados'}
        </div>
        <div class="value ${counts.observados > 0 ? 'stat-value-observado' : ''}">${counts.observados}</div>
      </div>
    </div>

    <!-- Barra de búsqueda y pestañas de filtrado -->
    <div class="card tracking-filter-card">
      <div class="tabs tracking-tabs">
        <div class="tab ${filtroEstado === 'todos' ? 'active' : ''}" onclick="setFiltro('todos', this)">
          Todos <span class="tab-count-muted">(${counts.todos})</span>
        </div>
        <div class="tab ${filtroEstado === 'proceso' ? 'active' : ''}" onclick="setFiltro('proceso', this)">
          En proceso <span class="tab-count-muted">(${counts.proceso})</span>
        </div>
        <div class="tab ${filtroEstado === 'observados' ? 'active' : ''} ${counts.observados > 0 ? 'tab-observados' : ''}" onclick="setFiltro('observados', this)">
          Observados <span class="tab-badge-observados">${counts.observados}</span>
        </div>
        <div class="tab ${filtroEstado === 'emitidos' ? 'active' : ''}" onclick="setFiltro('emitidos', this)">
          Emitidos <span class="tab-count-muted">(${counts.emitidos})</span>
        </div>
        <div class="tab ${filtroEstado === 'rechazados' ? 'active' : ''}" onclick="setFiltro('rechazados', this)">
          Rechazados <span class="tab-count-muted">(${counts.rechazados})</span>
        </div>
      </div>

      <div class="input-wrap-icon-left search-wrap-tracking">
        <span class="input-icon-svg" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input class="input" placeholder="Buscar por número de solicitud (ej. S-2026-0188) o nombre del trámite..." oninput="setBusqueda(this.value)">
      </div>
    </div>

    <!-- Listado de solicitudes -->
    <div>
      ${cardsHtml || `
        <div class="card">
          <div class="empty-state">
            <div class="ico empty-state-ico-center"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg></div>
            No tienes solicitudes en esta categoría o no coinciden con la búsqueda.<br>
            <a class="btn btn-primary btn-empty-solicitar" href="solicitar.html">Solicitar un nuevo trámite</a>
          </div>
        </div>`}
    </div>
  `;
}

// =========================================================================
// MODAL DE SUBSANACIÓN DE OBSERVACIONES (CIRCUITO 48 HORAS)
// =========================================================================
let SUB_TEMP = { file: null, nota: '' };

function abrirSubsanacion(id) {
  const s = DB.getSolicitud(id);
  SUB_TEMP = { file: null, nota: '' };

  APP.openModal(`
    <div class="modal-head">
      <h3>Subsanar observación · ${s.id}</h3>
      <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="alert warn modal-warn-alert">
        <b>Observación indicada por ${s.area}:</b><br>
        ${s.observacion}
      </div>

      <div class="subsanacion-info-text">
        Cuentas con <b>48 horas</b> desde la notificación para subsanar los requisitos sin costo adicional.
      </div>

      <!-- Componente para adjuntar nuevo archivo -->
      <div class="field full field-mb-16">
        <label>Adjuntar documento o archivo corregido (PDF o JPG)</label>
        <div class="file-dropzone" id="sub-dropzone" onclick="document.getElementById('sub-file-input').click()">
          <input type="file" id="sub-file-input" accept=".pdf,.jpg,.jpeg,.png" onchange="handleSubFile(event)">
          <div class="dropzone-icon-center"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
          <div class="dropzone-title">Seleccionar archivo corregido</div>
          <div class="dropzone-sub">PDF, JPG o PNG (máximo 5 MB)</div>
        </div>
        <div id="sub-file-preview"></div>
      </div>

      <div class="field full">
        <label for="sub-nota">Explicación o aclaración para el evaluador</label>
        <textarea class="input" id="sub-nota" placeholder="Describe los cambios realizados o documento adjunto..." oninput="SUB_TEMP.nota=this.value"></textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="APP.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="enviarSubsanacion('${s.id}')">Enviar subsanación <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="icon-vertical-middle"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
    </div>
  `, { wide: false });
}

function handleSubFile(event) {
  const f = event.target.files && event.target.files[0];
  if (!f) return;
  SUB_TEMP.file = f.name;
  document.getElementById('sub-file-preview').innerHTML = `
    <div class="file-preview-card">
      <div class="file-meta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        <div class="file-name">${f.name}</div>
      </div>
      <button class="btn btn-sm btn-ghost btn-sub-remove" type="button" onclick="SUB_TEMP.file=null;document.getElementById('sub-file-preview').innerHTML=''"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
    </div>`;
}

function enviarSubsanacion(id) {
  const nota = SUB_TEMP.nota.trim();
  const s = DB.subsanarSolicitud(id, { nota, adjuntoNombre: SUB_TEMP.file });
  if (!s) return;

  APP.sendMail({
    to: me.email,
    cc: 'mesadepartes@uwiener.edu.pe',
    subject: `Subsanación recibida - Expediente ${s.id}`,
    lines: [
      `Hola ${me.nombre}, hemos recibido tu subsanación para el trámite <b>${s.tramiteNombre}</b>.`,
      `Tu expediente volvió a la cola de <b>En revisión</b> con prioridad.`,
      SUB_TEMP.file ? `Archivo adjuntado: ${SUB_TEMP.file}` : ''
    ].filter(Boolean)
  });

  APP.closeModal();
  APP.toast({
    icon: 'ok',
    title: 'Subsanación enviada',
    body: `El expediente ${s.id} fue devuelto a revisión prioritaria.`
  });

  render();
}

// =========================================================================
// MODAL DE EXPEDIENTE / HISTORIAL DETALLADO
// =========================================================================
function detalle(id) {
  const s = DB.getSolicitud(id);
  APP.openModal(`
    <div class="modal-head">
      <h3>Expediente ${s.id} · ${s.tramiteNombre}</h3>
      <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
    </div>
    <div class="modal-body">
      <dl class="kv kv-mb-18">
        <dt>Trámite</dt><dd>${s.tramiteNombre}</dd>
        <dt>Estado actual</dt><dd>${APP.pillFor(s.estado)}</dd>
        <dt>Fecha de registro</dt><dd>${s.fecha}</dd>
        <dt>Motivo</dt><dd>${s.motivo || 'No especificado'}</dd>
        <dt>Costo</dt><dd><b>${s.costo > 0 ? APP.money(s.costo) : 'Gratuito'}</b></dd>
        <dt>Pago</dt><dd>${s.costo === 0 ? 'Trámite sin costo (Gratuito)' : (s.pago.estado === 'pagado' ? s.pago.metodo + ' (Op. ' + s.pago.operacion + ')' : '<span class="pill warn">Pendiente</span>')}</dd>
        <dt>Área responsable</dt><dd>${s.area}</dd>
        <dt>Archivo adjunto</dt><dd>${s.adjunto ? '<span class="inline-svg-text"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg> ' + s.adjunto + '</span>' : 'Ninguno'}</dd>
      </dl>

      <div class="section-label section-label-mt-20">Trazabilidad cronológica del expediente</div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha y hora</th>
              <th>Detalle / Nota</th>
            </tr>
          </thead>
          <tbody>
            ${s.historial.map(h => `
              <tr>
                <td class="nowrap-cell">${APP.pillFor(h.estado)}</td>
                <td class="muted nowrap-cell">${h.fecha}</td>
                <td>${h.nota}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="APP.closeModal()">Cerrar</button>
    </div>
  `, { wide: true });
}

function pagar(id) {
  const s = DB.getSolicitud(id);
  APP.niubizCheckout({
    amount: s.costo,
    concepto: `${s.tramiteNombre} · ${s.alumnoNombre}`,
    onSuccess: (pago) => {
      s.pago = { estado: 'pagado', metodo: pago.metodo, monto: pago.monto, fecha: APP.todayISO(), operacion: pago.operacion };
      s.estado = 'Emitido';
      s.observacion = 'Pago recibido. Documento emitido y disponible para descarga.';
      s.historial.push({
        estado: 'Emitido',
        fecha: APP.nowStamp(),
        nota: 'Pago confirmado vía ' + pago.metodo + '. Documento emitido con firma digital.'
      });
      DB.updateSolicitud(s);
      APP.sendMail({
        to: me.email,
        cc: 'mesadepartes@uwiener.edu.pe',
        subject: `Pago confirmado - ${s.tramiteNombre} (${s.id})`,
        lines: [
          `Tu pago de ${APP.money(pago.monto)} fue procesado por Niubiz (Op. ${pago.operacion}).`,
          'Tu documento oficial ya está disponible para descarga en tu intranet.'
        ]
      });
      render();
    }
  });
}

function verDoc(id) {
  const s = DB.getSolicitud(id);
  const alumno = DB.getUsuario(s.alumnoId);
  const t = DB.getTramite(s.tramiteId) || { nombre: s.tramiteNombre, tipo: 'Constancia', modelo: 'constancia' };
  DOC.preview(t, alumno, s);
}

// =========================================================================
// MODAL DE CONFIRMACIÓN DE CANCELACIÓN (Solo disponible en estado 'Solicitado')
// =========================================================================
function confirmarCancelacion(id) {
  const s = DB.getSolicitud(id);
  if (!s) return;

  APP.openModal(`
    <div class="modal-head">
      <h3>Confirmar cancelación de solicitud</h3>
      <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
    </div>
    <div class="modal-body">
      <p class="cancel-confirm-msg">
        ¿Estás seguro de que deseas cancelar la solicitud de «${s.tramiteNombre}»?
      </p>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="APP.closeModal()">Cancelar</button>
      <button class="btn btn-danger" id="btn-confirmar-cancelar" onclick="ejecutarCancelacion('${s.id}')">
        Confirmar cancelación
      </button>
    </div>
  `);
}

function ejecutarCancelacion(id) {
  const s = DB.getSolicitud(id);
  if (!s) return;

  s.estado = 'Cancelar';
  s.activo = false;
  s.observacion = 'Cancelado a solicitud del estudiante.';
  if (!Array.isArray(s.historial)) s.historial = [];
  s.historial.push({
    estado: 'Cancelar',
    fecha: APP.nowStamp ? APP.nowStamp() : (new Date().toLocaleString('es-PE')),
    nota: `Cancelación confirmada por el estudiante (${me.nombre})`
  });

  DB.updateSolicitud(s);

  APP.closeModal();

  APP.toast({
    icon: 'trash',
    title: 'Solicitud cancelada',
    body: `La solicitud ${s.id} (${s.tramiteNombre}) ha sido cancelada exitosamente.`
  });

  render();
}

render();
