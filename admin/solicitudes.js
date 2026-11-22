/* ==========================================================================
   VISTA: VISTA DE TRÁMITES / SOLICITUDES (admin/solicitudes.js)
   Universidad Norbert Wiener - Sistema de Trámites
   ========================================================================== */

const ctx = APP.renderShell('solicitudes');
const adminUser = (ctx && ctx.session && DB.getUsuario(ctx.session.id)) || { nombre: 'Administrador Académico', email: 'admin@uwiener.edu.pe' };

// Iconos SVG institucionales
const SVG_ICONS = {
  inbox: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  fileEdit: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  clock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  creditCard: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
  checkCircle: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  xCircle: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  clockSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  checkSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  xSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  searchLarge: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  attachment: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>',
  refresh: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
  alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  alertSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  userLarge: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  docLarge: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  building: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="2"></line><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="16" y1="6" x2="16.01" y2="6"></line><line x1="16" y1="10" x2="16.01" y2="10"></line><line x1="16" y1="14" x2="16.01" y2="14"></line><line x1="16" y1="18" x2="16.01" y2="18"></line></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

// Estado global de filtros
let filtroInstitucion = 'Todas';
let filtroTicket = '';
let filtroDni = '';
let filtroAlumno = '';
let filtroTramite = 'Todos';
let filtroEstado = 'Todos';
let filtroActivo = 'Todos';
let filtroDesde = '2026-09-01';
let filtroHasta = APP.todayISO();

// Carga de parámetros URL (por ejemplo desde Procesar o enlaces externos)
try {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('institucion')) filtroInstitucion = urlParams.get('institucion');
  if (urlParams.get('estado')) filtroEstado = urlParams.get('estado');
  if (urlParams.get('ticket')) filtroTicket = urlParams.get('ticket');
} catch (e) {}

// Paginación
let paginaActual = 1;
const registrosPorPagina = 8;

function cambiarPagina(p) {
  paginaActual = p;
  render();
}

function generarBotonesPaginacion(curr, total) {
  if (total <= 1) {
    return `<button class="vt-page-btn active" disabled>1</button>`;
  }
  let html = '';
  for (let p = 1; p <= total; p++) {
    if (total > 6) {
      if (p > 1 && p < curr - 1 && p === 2) { html += '<span class="vt-ellipsis-page">...</span>'; continue; }
      if (p > 1 && p < curr - 1) continue;
      if (p < total && p > curr + 1 && p === total - 1) { html += '<span class="vt-ellipsis-page">...</span>'; continue; }
      if (p < total && p > curr + 1) continue;
    }
    html += `<button class="vt-page-btn ${p === curr ? 'active' : ''}" onclick="cambiarPagina(${p})">${p}</button>`;
  }
  return html;
}

// Formateador de moneda y fechas
function formatMoney(n) { return 'S/ ' + Number(n || 0).toFixed(2); }

function resetFilters() {
  filtroInstitucion = 'Todas';
  filtroTicket = '';
  filtroDni = '';
  filtroAlumno = '';
  filtroTramite = 'Todos';
  filtroEstado = 'Todos';
  filtroActivo = 'Todos';
  filtroDesde = '2026-09-01';
  filtroHasta = APP.todayISO();
  paginaActual = 1;

  // Limpiar parámetros en la URL para evitar que persistan en recargas
  try {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (e) {}

  render(true);
  APP.toast({ icon: 'ok', title: 'Filtros restablecidos', body: 'Mostrando todos los registros sin filtros.' });
}

function setTabRapido(tab) {
  if (tab === 'todos') filtroEstado = 'Todos';
  else if (tab === 'solicitado') filtroEstado = 'Solicitado';
  else if (tab === 'pago-pendiente') filtroEstado = 'Todos';
  else if (tab === 'pagados') filtroEstado = 'Todos';
  else if (tab === 'aprobados') filtroEstado = 'Aprobado';
  else if (tab === 'cancelados') filtroEstado = 'Cancelar';
  render();
}

function render(fromReset) {
  if (!ctx || !ctx.mount) return;

  if (!fromReset) {
    // Sincronizar inputs si ya existen en el DOM
    const elTicket = document.getElementById('f-ticket');
    if (elTicket) filtroTicket = elTicket.value;
    const elDni = document.getElementById('f-dni');
    if (elDni) filtroDni = elDni.value;
    const elAlumno = document.getElementById('f-alumno');
    if (elAlumno) filtroAlumno = elAlumno.value;
    const elTramite = document.getElementById('f-tramite');
    if (elTramite) filtroTramite = elTramite.value;
    const elEstado = document.getElementById('f-estado');
    if (elEstado) filtroEstado = elEstado.value;
    const elActivo = document.getElementById('f-activo');
    if (elActivo) filtroActivo = elActivo.value;
    const elDesde = document.getElementById('f-desde');
    if (elDesde) filtroDesde = elDesde.value;
    const elHasta = document.getElementById('f-hasta');
    if (elHasta) filtroHasta = elHasta.value;
  }

  const all = DB.solicitudes();

  // Métricas
  const countTotal = all.length;
  const countSolicitados = all.filter(s => s.estado === 'Solicitado' || s.estado === 'En revisión').length;
  const countPagoPendiente = all.filter(s => s.pago && s.pago.estado === 'pendiente' && s.costo > 0).length;
  const countPagados = all.filter(s => s.pago && s.pago.estado === 'pagado').length;
  const countAprobados = all.filter(s => s.estado === 'Aprobado' || s.estado === 'Emitido').length;
  const countCancelados = all.filter(s => s.estado === 'Cancelar' || s.estado === 'Rechazado').length;

  // Filtrado
  let filtered = all.filter(s => {
    if (filtroInstitucion !== 'Todas' && s.institucion && !s.institucion.toLowerCase().includes(filtroInstitucion.toLowerCase())) return false;
    if (filtroTicket && !(s.ticket || s.id || '').toLowerCase().includes(filtroTicket.toLowerCase())) return false;
    if (filtroDni && !(s.alumnoDni || '').toLowerCase().includes(filtroDni.toLowerCase())) return false;
    if (filtroAlumno) {
      const q = filtroAlumno.toLowerCase();
      const match = (s.alumnoNombre || '').toLowerCase().includes(q) || (s.alumnoCodigo || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filtroTramite !== 'Todos' && s.tramiteNombre !== filtroTramite) return false;
    if (filtroEstado !== 'Todos' && s.estado !== filtroEstado) return false;
    if (filtroActivo !== 'Todos') {
      const isAct = filtroActivo === 'Si';
      if (Boolean(s.activo) !== isAct) return false;
    }
    if (filtroDesde && s.fecha && s.fecha < filtroDesde) return false;
    if (filtroHasta && s.fecha && s.fecha > filtroHasta) return false;

    return true;
  });

  // Opciones dinámicas de trámites para el select
  const tramiteNombres = Array.from(new Set(all.map(s => s.tramiteNombre).filter(Boolean))).sort();
  const tramiteOptions = ['<option value="Todos">Todos los trámites</option>']
    .concat(tramiteNombres.map(tn => `<option value="${tn}" ${filtroTramite === tn ? 'selected' : ''}>${tn}</option>`))
    .join('');

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(filtered.length / registrosPorPagina));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  if (paginaActual < 1) paginaActual = 1;

  const startIdx = (paginaActual - 1) * registrosPorPagina;
  const endIdx = startIdx + registrosPorPagina;
  const paginatedItems = filtered.slice(startIdx, endIdx);

  // Construcción del cuerpo de la tabla
  const rowsHtml = paginatedItems.map((s, idx) => {
    const isPaid = s.pago && s.pago.estado === 'pagado';
    const isFree = Number(s.costo) === 0;
    const pagoBadge = isPaid || isFree
      ? `<span class="vt-payment-pill paid"><span class="vt-pago-icon">${SVG_ICONS.checkSm}</span> Sí</span>`
      : `<span class="vt-payment-pill pending" title="El alumno aún no realiza el pago"><span class="vt-pago-icon">${SVG_ICONS.xSm}</span> No</span>`;

    let estadoPill = '';
    if (s.estado === 'Solicitado') estadoPill = `<span class="pill info no-dot">Solicitado</span>`;
    else if (s.estado === 'En revisión') estadoPill = `<span class="pill info no-dot">En revisión</span>`;
    else if (s.estado === 'Aprobado') estadoPill = `<span class="pill ok no-dot">Aprobado</span>`;
    else if (s.estado === 'Emitido') estadoPill = `<span class="pill purple no-dot">Emitido</span>`;
    else if (s.estado === 'Observado') estadoPill = `<span class="pill warn no-dot">Observado</span>`;
    else if (s.estado === 'Cancelar') estadoPill = `<span class="pill err no-dot">Cancelar</span>`;
    else if (s.estado === 'Rechazado') estadoPill = `<span class="pill err no-dot">Rechazado</span>`;
    else estadoPill = `<span class="pill gray no-dot">${s.estado}</span>`;

    const activoBadge = s.activo
      ? `<span class="pill ok no-dot pill-pad-sm">Sí</span>`
      : `<span class="pill gray no-dot pill-pad-sm">No</span>`;

    const itemNro = startIdx + idx + 1;

    return `
      <tr onclick="abrirDetalle('${s.id}')">
        <td class="cell-center-muted">${itemNro}</td>
        <td><span class="vt-ticket-badge">${s.ticket || s.id}</span></td>
        <td><span class="vt-sede-text">${s.sedeCodigo || '7808'}</span></td>
        <td><div class="vt-tramite-title">${s.tramiteNombre}</div></td>
        <td><span class="carrera-cell">${s.carrera || '-'}</span></td>
        <td><span class="mono alumno-code-cell">${s.alumnoCodigo || '-'}</span></td>
        <td><span class="alumno-name-cell">${s.alumnoNombre}</span></td>
        <td class="cell-center">${estadoPill}</td>
        <td class="cell-center">${pagoBadge}</td>
        <td class="cell-center">${activoBadge}</td>
        <td class="date-nowrap">${s.fecha}</td>
        <td class="cell-right" onclick="event.stopPropagation()">
          <button class="btn btn-primary btn-sm" onclick="abrirDetalle('${s.id}')" title="Detalle completo del trámite">
            Detalle
          </button>
        </td>
      </tr>
    `;
  }).join('');

  ctx.mount.innerHTML = `
    <div class="vt-container">
      <!-- Encabezado estandarizado -->
      <div class="page-head">
        <div>
          <h1>Vista de Trámites</h1>
          <p>Panel maestro de administración, revisión y atención de trámites solicitados por estudiantes.</p>
        </div>
        <a class="btn btn-primary" href="registrar.html">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Registrar trámite</span>
        </a>
      </div>

      <!-- Barra institucional contextual -->
      <div class="vt-top-meta">
        <div class="vt-inst-selector">
          <span class="inst-label">Institución:</span>
          <div class="custom-select-container inst-select-wrap">
            <select id="sel-institucion" onchange="filtroInstitucion=this.value;paginaActual=1;render()">
              <option value="Todas" ${filtroInstitucion === 'Todas' ? 'selected' : ''}>Todas las instituciones</option>
              <option value="Carrión" ${filtroInstitucion === 'Carrión' ? 'selected' : ''}>I.E.S. Particular Daniel Alcides Carrión</option>
              <option value="Wiener" ${filtroInstitucion === 'Wiener' ? 'selected' : ''}>Universidad Norbert Wiener</option>
            </select>
          </div>
          <span class="vt-role-badge">Perfil: Administrador</span>
        </div>
        <div class="vt-clock">
          <span class="vt-clock-icon">${SVG_ICONS.clockSm}</span>
          <span>Fecha/Hora del sistema: </span><b>${APP.nowStamp()}</b>
        </div>
      </div>

      <!-- Métricas Resumen Categorizadas en 1 sola línea (Desktop) -->
      <div class="vt-stats-strip">
        <div class="vt-stat-tile tile-general">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-teal">GENERAL</span>
            <span class="vt-tile-icon icon-teal">${SVG_ICONS.inbox}</span>
          </div>
          <div class="vt-tile-num">${countTotal}</div>
          <div class="vt-tile-label">Total Registros</div>
        </div>

        <div class="vt-stat-tile tile-bandeja">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-blue">BANDEJA</span>
            <span class="vt-tile-icon icon-blue">${SVG_ICONS.fileEdit}</span>
          </div>
          <div class="vt-tile-num">${countSolicitados}</div>
          <div class="vt-tile-label">Solicitados</div>
        </div>

        <div class="vt-stat-tile tile-cobranza">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-amber">COBRANZA</span>
            <span class="vt-tile-icon icon-amber">${SVG_ICONS.clock}</span>
          </div>
          <div class="vt-tile-num">${countPagoPendiente}</div>
          <div class="vt-tile-label">Pago Pendiente</div>
        </div>

        <div class="vt-stat-tile tile-finanzas">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-emerald">FINANZAS</span>
            <span class="vt-tile-icon icon-emerald">${SVG_ICONS.creditCard}</span>
          </div>
          <div class="vt-tile-num">${countPagados}</div>
          <div class="vt-tile-label">Pagados</div>
        </div>

        <div class="vt-stat-tile tile-resolucion">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-cyan">RESOLUCIÓN</span>
            <span class="vt-tile-icon icon-cyan">${SVG_ICONS.checkCircle}</span>
          </div>
          <div class="vt-tile-num">${countAprobados}</div>
          <div class="vt-tile-label">Aprobados / Procede</div>
        </div>

        <div class="vt-stat-tile tile-cerrados">
          <div class="vt-tile-top">
            <span class="vt-tile-badge badge-slate">CERRADOS</span>
            <span class="vt-tile-icon icon-slate">${SVG_ICONS.xCircle}</span>
          </div>
          <div class="vt-tile-num">${countCancelados}</div>
          <div class="vt-tile-label">Cancelados</div>
        </div>
      </div>

      <!-- Caja de Filtros -->
      <div class="listado-filters-card" id="cardFiltrosSolicitudes">
        <div class="vt-filter-head">
          <div class="vt-filter-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filtros de Búsqueda de Trámites
          </div>
          <span class="filter-card-sub">Todos los campos son opcionales</span>
        </div>

        <div class="vt-filter-grid">
          <div class="vt-field">
            <label for="f-ticket">Ticket N°:</label>
            <div class="input-wrap-icon-left">
              <span class="input-icon-svg" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path></svg>
              </span>
              <input class="input" id="f-ticket" placeholder="Ej. 2026.43531" value="${filtroTicket}" oninput="filtroTicket=this.value" onkeydown="if(event.key==='Enter')render()">
            </div>
          </div>

          <div class="vt-field">
            <label for="f-dni">DNI:</label>
            <div class="input-wrap-icon-left">
              <span class="input-icon-svg" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><line x1="15" y1="8" x2="17" y2="8"></line><line x1="15" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>
              </span>
              <input class="input" id="f-dni" placeholder="Ej. 42579879" value="${filtroDni}" oninput="filtroDni=this.value" onkeydown="if(event.key==='Enter')render()">
            </div>
          </div>

          <div class="vt-field">
            <label for="f-alumno">Alumno (código o nombres):</label>
            <div class="input-wrap-icon-left">
              <span class="input-icon-svg" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input class="input" id="f-alumno" placeholder="Ej. Rayme o C03AE04204" value="${filtroAlumno}" oninput="filtroAlumno=this.value" onkeydown="if(event.key==='Enter')render()">
            </div>
          </div>

          <div class="vt-field">
            <label for="f-tramite">Trámite:</label>
            <div class="custom-select-container">
              <select id="f-tramite" onchange="filtroTramite=this.value;paginaActual=1">
                ${tramiteOptions}
              </select>
            </div>
          </div>

          <div class="vt-field">
            <label for="f-estado">Estado:</label>
            <div class="custom-select-container">
              <select id="f-estado" onchange="filtroEstado=this.value;paginaActual=1">
                <option value="Todos" ${filtroEstado === 'Todos' ? 'selected' : ''}>Todos</option>
                <option value="Solicitado" ${filtroEstado === 'Solicitado' ? 'selected' : ''}>Solicitado</option>
                <option value="En revisión" ${filtroEstado === 'En revisión' ? 'selected' : ''}>En revisión</option>
                <option value="Aprobado" ${filtroEstado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                <option value="Emitido" ${filtroEstado === 'Emitido' ? 'selected' : ''}>Emitido</option>
                <option value="Observado" ${filtroEstado === 'Observado' ? 'selected' : ''}>Observado</option>
                <option value="Cancelar" ${filtroEstado === 'Cancelar' ? 'selected' : ''}>Cancelar</option>
                <option value="Rechazado" ${filtroEstado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
              </select>
            </div>
          </div>

          <div class="vt-field">
            <label for="f-activo">Activo:</label>
            <div class="custom-select-container">
              <select id="f-activo" onchange="filtroActivo=this.value;paginaActual=1">
                <option value="Todos" ${filtroActivo === 'Todos' ? 'selected' : ''}>Todos</option>
                <option value="Si" ${filtroActivo === 'Si' ? 'selected' : ''}>Sí</option>
                <option value="No" ${filtroActivo === 'No' ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>

          <div class="vt-field">
            <label for="f-desde">Desde:</label>
            <input type="date" id="f-desde" value="${filtroDesde}" onchange="filtroDesde=this.value;paginaActual=1">
          </div>

          <div class="vt-field">
            <label for="f-hasta">Hasta:</label>
            <input type="date" id="f-hasta" value="${filtroHasta}" onchange="filtroHasta=this.value;paginaActual=1">
          </div>
        </div>

        <div class="vt-filter-actions filter-actions-bar">
          <button class="btn btn-outline" type="button" onclick="resetFilters()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
            <span>Limpiar filtros</span>
          </button>
          <button class="btn-filter-search btn-search-min" type="button" onclick="paginaActual=1;render()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Buscar</span>
          </button>
        </div>
      </div>

      <!-- Tabla de Resultados -->
      <div class="vt-table-card">
        <div class="vt-table-top">
          <div class="vt-counter-text">
            <b>${filtered.length}</b> Registro(s) encontrado(s)
            ${filtered.length > 0 ? `<span class="page-info-sub">(Página <b>${paginaActual}</b> de <b>${totalPaginas}</b> · Registros ${startIdx + 1} - ${Math.min(endIdx, filtered.length)})</span>` : ''}
          </div>
          <div class="vt-pagination">
            <button class="vt-page-btn" ${paginaActual <= 1 ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual - 1})" title="Página anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Anterior</span>
            </button>
            ${generarBotonesPaginacion(paginaActual, totalPaginas)}
            <button class="vt-page-btn" ${paginaActual >= totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual + 1})" title="Página siguiente">
              <span>Siguiente</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div class="vt-mobile-scroll-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          <span>Desliza horizontalmente la tabla para ver todos los datos y acciones</span>
        </div>

        <div class="vt-table-wrapper">
          <table class="vt-table">
            <thead>
              <tr>
                <th class="col-nro">N°</th>
                <th>Ticket</th>
                <th>Sede</th>
                <th>Trámite</th>
                <th>Carrera</th>
                <th>Alumno</th>
                <th>Apellidos y Nombres</th>
                <th>Estado</th>
                <th class="cell-center">Pago</th>
                <th class="cell-center">Activo</th>
                <th>Fecha Registro</th>
                <th class="cell-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `
                <tr>
                  <td colspan="12" class="empty-table-cell">
                    <div class="empty-table-icon">${SVG_ICONS.searchLarge}</div>
                    <div class="empty-table-title">No se encontraron trámites con los filtros especificados</div>
                    <div class="empty-table-desc">Intenta ajustando el rango de fechas, seleccionando otra institución o limpiando los filtros.</div>
                    <button class="btn btn-outline btn-reset-filters" onclick="resetFilters()">Restablecer filtros</button>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Inicializa los desplegables personalizados y datepickers Wiener
  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(ctx.mount);
  }
  if (APP && APP.initDatePickers) {
    APP.initDatePickers(ctx.mount);
  }
}

// =========================================================================
// MODAL DETALLE DE TRÁMITE
// =========================================================================
function abrirDetalle(idOrTicket) {
  const s = DB.getSolicitud(idOrTicket);
  if (!s) {
    APP.toast({ icon: 'warn', title: 'Error', body: 'No se encontró el trámite seleccionado.' });
    return;
  }

  const isPaid = s.pago && s.pago.estado === 'pagado';
  const isFree = Number(s.costo) === 0;

  // Requisitos HTML
  const reqList = s.requisitos || [];
  const reqRows = reqList.length > 0 ? reqList.map((r, i) => {
    return `
      <tr>
        <td class="cell-center-muted">${i + 1}</td>
        <td>
          <div class="vt-req-desc">${r.titulo}</div>
          <div class="vt-req-spec"><span class="vt-req-ico">${SVG_ICONS.attachment}</span> Archivo actual: <b class="file-req-color">${r.archivo || 'Sin archivo'}</b> (${r.tipoArchivo || 'JPG/PDF'})</div>
        </td>
        <td class="cell-center">
          <button type="button" class="btn btn-outline btn-sm" onclick="verArchivoAdjunto('${s.id}','${r.id}','${r.archivo}')" title="Ver archivo adjunto del alumno">
            ${SVG_ICONS.search} <span>Ver Archivo</span>
          </button>
        </td>
        <td class="cell-center">
          <label class="chk-cumple-wrap">
            <input type="checkbox" class="chk-cumple-input" ${r.cumple ? 'checked' : ''} onchange="toggleCumple('${s.id}','${r.id}',this.checked)">
            <span class="chk-cumple-text" style="color:${r.cumple ? 'var(--ok-fg)' : 'var(--text-muted)'}">${r.cumple ? 'Cumple' : 'Revisar'}</span>
          </label>
        </td>
        <td class="cell-center">
          <button type="button" class="btn btn-sm btn-change-file" onclick="togglePanelCambiarArchivo('${r.id}')" title="Reemplazar archivo si el estudiante subió uno incorrecto">
            ${SVG_ICONS.refresh} <span>Cambiar</span>
          </button>
        </td>
      </tr>
      <tr id="panel-cambiar-${r.id}" class="panel-cambiar-tr">
        <td colspan="5" class="panel-cambiar-td">
          <div class="vt-cambiar-archivo-box">
            <h5>Reemplazar archivo del requisito #${i + 1}</h5>
            <p class="panel-cambiar-desc">El archivo debe cumplir las siguientes características:</p>
            <ul class="vt-spec-list">
              <li>Tamaño: máximo 2MB</li>
              <li>Tipo: ${r.tipoArchivo || 'JPG o PDF'}</li>
              <li>Nombre esperado del sistema: <b>${r.archivo || 'documento.pdf'}</b></li>
            </ul>
            <div class="vt-upload-row">
              <input type="file" id="input-file-${r.id}" class="input file-input-compact">
              <button type="button" class="btn btn-primary btn-sm" onclick="subirArchivoReemplazo('${s.id}','${r.id}')">
                Subir Archivo
              </button>
              <button type="button" class="btn btn-ghost btn-sm" onclick="togglePanelCambiarArchivo('${r.id}')">
                Cancelar
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('') : `
    <tr>
      <td colspan="5" class="empty-req-td">
        Este trámite no tiene requisitos documentarios adjuntos.
      </td>
    </tr>
  `;

  // Identificación del usuario en sesión y sus facultades
  const session = APP.getSession() || {};
  const allUsers = DB.usuarios ? DB.usuarios() : [];
  const currentUser = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;
  const myArea = (currentUser.area || '').trim().toLowerCase();
  const isSuperAdmin = currentUser.rol === 'director' || (currentUser.email || '').includes('admin');

  // Proceso / Áreas
  const procesoList = s.proceso || [];
  const totalSteps = procesoList.length;
  const currentStepObj = procesoList.find(p => p.estado !== 'Atendido' && p.estado !== 'Procede');
  let etapaProgresoTexto = '';
  if (totalSteps > 0) {
    if (currentStepObj) {
      etapaProgresoTexto = `Paso ${currentStepObj.orden || 1} de ${totalSteps}: ${currentStepObj.area}`;
    } else {
      etapaProgresoTexto = `Todas las etapas concluidas (${totalSteps}/${totalSteps})`;
    }
  } else {
    etapaProgresoTexto = 'Resolución automática directa';
  }

  const procesoHtml = (!isPaid && !isFree) ? `
    <div class="wait-pay-box">
      <span class="wait-pay-ico">${SVG_ICONS.alert}</span>
      <div>
        <b class="wait-pay-title">Atención en espera de pago:</b>
        <div class="wait-pay-sub">Este trámite cuenta con arancel institucional pendiente. El estudiante debe confirmar el pago mediante Niubiz o ventanilla bancaria para iniciar la atención por las áreas correspondientes.</div>
      </div>
    </div>
  ` : (procesoList.length > 0 ? `
    <div class="vt-process-timeline">
      ${procesoList.map((p, idx) => {
    const isDone = p.estado === 'Atendido' || p.estado === 'Procede';
    const isPriorPending = procesoList.slice(0, idx).some(prev => prev.estado !== 'Atendido' && prev.estado !== 'Procede');
    const isCurrentActive = !isDone && !isPriorPending;
    const stepArea = (p.area || '').trim();
    const isMyArea = myArea && (
      stepArea.toLowerCase() === myArea ||
      (myArea.includes('registros') && stepArea.toLowerCase().includes('registros')) ||
      (myArea.includes('grados') && stepArea.toLowerCase().includes('grados')) ||
      (myArea.includes('ingenier') && stepArea.toLowerCase().includes('ingenier'))
    );
    const canApprove = (isMyArea || isSuperAdmin) && (isPaid || isFree);

    const respList = DB.getResponsablesByArea ? DB.getResponsablesByArea(p.area) : [];
    const respNombres = respList.length > 0 ? respList.map(r => r.nombre.split(',')[0].trim()).slice(0, 2).join(' · ') : '';

    if (isDone) {
      return `
        <div class="vt-step-card step-done">
          <div class="vt-step-info">
            <div class="vt-step-num">
              Área #${p.orden || (idx + 1)} · <b>${p.area}</b>
              ${respNombres ? `<span class="muted vt-step-team">(Equipo: ${respNombres})</span>` : ''}
            </div>
            <div class="vt-step-title">${p.descripcion || 'Revisión y validación institucional'}</div>
            <div class="vt-step-meta">
              Plazo asignado: <b>${p.plazoHoras || 48} hrs</b> · 
              <span class="pill ok pill-retraso">${SVG_ICONS.checkSm} Concluido</span>
              ${p.fechaAtencion ? ` · Atendido el: <b>${p.fechaAtencion}</b>` : ''}
            </div>
            ${p.observacionInterna ? `
              <div class="vt-step-done-obs">
                <b>Dictamen registrado:</b> ${p.observacionInterna}
              </div>
            ` : ''}
          </div>
          <div class="vt-step-right-box">
            <span class="pill ok">${p.estado || 'Atendido'}</span>
          </div>
        </div>
      `;
    }

    if (isPriorPending) {
      return `
        <div class="vt-step-card step-waiting">
          <div class="vt-step-info">
            <div class="vt-step-num">
              Área #${p.orden || (idx + 1)} · <b>${p.area}</b>
              ${respNombres ? `<span class="muted vt-step-team">(Equipo: ${respNombres})</span>` : ''}
            </div>
            <div class="vt-step-title">${p.descripcion || 'Revisión y validación institucional'}</div>
            <div class="vt-step-meta">
              Plazo asignado: <b>${p.plazoHoras || 48} hrs</b> · 
              <span class="pill gray pill-retraso">En espera del paso #${idx} (${procesoList[idx - 1].area})</span>
            </div>
          </div>
          <div class="vt-step-right-box">
            <span class="pill gray">Paso Bloqueado</span>
          </div>
        </div>
      `;
    }

    // Etapa activa actual
    return `
      <div class="vt-step-card active-step ${canApprove ? 'active-my-step' : 'active-other-step'}">
        <div class="vt-step-info">
          <div class="vt-step-num">
            Área #${p.orden || (idx + 1)} · <b>${p.area}</b>
            ${respNombres ? `<span class="muted vt-step-team">(Equipo: ${respNombres})</span>` : ''}
            ${canApprove ? `<span class="pill ok vt-badge-turn">${SVG_ICONS.checkSm} En tu Despacho (${currentUser.nombre ? currentUser.nombre.split(' ')[0] : 'Tú'})</span>` : `<span class="pill warn vt-badge-turn">Asignado a: ${p.area}</span>`}
          </div>
          <div class="vt-step-title">${p.descripcion || 'Revisión y validación institucional'}</div>
          <div class="vt-step-meta">
            Plazo asignado: <b>${p.plazoHoras || 48} hrs</b> · 
            ${p.diasRetraso > 0 ? `<span class="pill err pill-retraso">${SVG_ICONS.alertSm} ${p.diasRetraso} días de retraso</span>` : `<span class="pill ok pill-retraso">Dentro del plazo normado</span>`}
          </div>
          ${canApprove ? `
            <div class="vt-step-input-wrap">
              <label for="obs-step-${p.orden}" class="vt-step-label">Dictamen / Observación Interna de ${p.area}:</label>
              <textarea class="vt-step-obs-input" id="obs-step-${p.orden}" placeholder="Escribe el dictamen o sustento de resolución de tu área...">${p.observacionInterna || 'Expediente revisado y verificado conforme a los lineamientos institucionales.'}</textarea>
            </div>
          ` : `
            <div class="vt-step-waiting-note">
              ${SVG_ICONS.clockSm} Esperando resolución y firma por el personal autorizado de <b>${p.area}</b>.
            </div>
          `}
        </div>
        <div class="vt-step-right-box">
          <span class="pill warn">${p.estado || 'Pendiente'}</span>
          ${canApprove ? `
            <div class="vt-step-btns-row">
              <button type="button" class="btn btn-secondary btn-sm" onclick="observarPasoDesdeDetalle('${s.id}', ${p.orden})">
                Observar
              </button>
              <button type="button" class="btn btn-primary btn-sm" onclick="procederPaso('${s.id}', ${p.orden})">
                <span>Aprobar y Derivar</span>
              </button>
            </div>
          ` : `
            <button type="button" class="btn btn-outline btn-sm" disabled title="Solo el personal autorizado de ${p.area} puede dictaminar esta etapa">
              Requiere aprobación de ${p.area}
            </button>
          `}
        </div>
      </div>
    `;
  }).join('')}
    </div>
  ` : `
    <div class="auto-resolution-box">
      Este trámite cuenta con resolución automática interna y no requiere derivación a áreas adicionales.
    </div>
  `);

  const modalHtml = `
    <div class="vt-modal-header">
      <div class="vt-modal-title-box">
        <div class="vt-modal-title-row">
          <h3 class="vt-modal-title">${s.tramiteNombre}</h3>
          <span class="vt-ticket-badge">Ticket N° ${s.ticket || s.id}</span>
        </div>
        <div class="vt-modal-subtitle">
          <span class="vt-modal-meta-item">
            Institución: <b>${s.institucion || 'I.E.S. Daniel Alcides Carrión'}</b>
          </span>
          <span class="vt-modal-meta-dot">•</span>
          <span class="vt-modal-meta-item">
            Fecha Registro: <b>${s.fechaHora || s.fecha}</b>
          </span>
          <span class="vt-modal-meta-dot">•</span>
          <span class="vt-modal-meta-item">
            Costo: <b>${formatMoney(s.costo)}</b>
          </span>
        </div>
      </div>

      <div class="modal-top-right">
        <div class="vt-modal-status-badge-box">
          <span class="pill ${s.estado === 'Aprobado' || s.estado === 'Emitido' ? 'ok' : s.estado === 'Observado' ? 'warn' : s.estado === 'Rechazado' || s.estado === 'Cancelar' ? 'err' : 'info'} no-dot modal-header-pill">
            ${s.estado}
          </span>
          <span class="modal-header-stage-hint">${etapaProgresoTexto}</span>
        </div>
        <button type="button" class="modal-close modal-close-btn" onclick="APP.closeModal()" title="Cerrar expediente" aria-label="Cerrar">
          ${SVG_ICONS.close}
        </button>
      </div>
    </div>

    <div class="vt-modal-body modal-body">
      <!-- Datos del Solicitante -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Datos del Solicitante
        </div>
        <div class="vt-info-grid-3">
          <div class="vt-info-item"><span class="vt-info-label">Código:</span><div class="vt-info-value mono">${s.alumnoCodigo || '-'}</div></div>
          <div class="vt-info-item vt-info-col-2"><span class="vt-info-label">Nombres y Apellidos:</span><div class="vt-info-value"><b>${s.alumnoNombre}</b></div></div>
          <div class="vt-info-item"><span class="vt-info-label">DNI:</span><div class="vt-info-value mono">${s.alumnoDni || '-'}</div></div>
          <div class="vt-info-item"><span class="vt-info-label">E-mail:</span><div class="vt-info-value">${s.alumnoEmail || '-'}</div></div>
          <div class="vt-info-item"><span class="vt-info-label">Teléfono / Celular:</span><div class="vt-info-value">${s.alumnoTelefono || s.alumnoCelular || '-'}</div></div>
        </div>
      </div>

      <!-- Datos Académicos -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
          Datos Académicos
        </div>
        <div class="vt-info-grid-3">
          <div class="vt-info-item"><span class="vt-info-label">Carrera:</span><div class="vt-info-value"><b>${s.carrera || '-'}</b></div></div>
          <div class="vt-info-item"><span class="vt-info-label">Periodo Académico:</span><div class="vt-info-value">${s.periodo || '2026-2'}</div></div>
          <div class="vt-info-item"><span class="vt-info-label">Sección:</span><div class="vt-info-value">${s.seccion || '6ME42'}</div></div>
        </div>
      </div>

      <!-- Recepción de Documentos -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Recepción de Documentos / Sede
        </div>
        <div class="vt-info-item">
          <span class="vt-info-label">Sede Designada:</span>
          <div class="vt-info-value"><b>${s.sede || '7808 - Av. Petit Thouars Nº 397 Lima'}</b></div>
        </div>
      </div>

      <!-- Detalle del Solicitante -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          Detalle de la Solicitud
        </div>
        <div class="vt-info-value vt-detail-content">
          ${s.detalle || 'Sin observaciones adicionales registradas por el alumno.'}
        </div>
      </div>

      <!-- Requisitos Documentarios -->
      <div class="vt-card-section">
        <div class="vt-card-section-title vt-section-title-between">
          <div class="vt-section-title-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Requisitos Exigidos para el Trámite
          </div>
          <span class="vt-section-title-sub">Verifica los adjuntos o reemplaza archivos erróneos</span>
        </div>
        <div class="vt-table-scroll">
          <table class="vt-req-table">
            <thead>
              <tr>
                <th class="col-nro">N°</th>
                <th>Requisitos</th>
                <th class="vt-col-w140">Ver Archivo Adjunto</th>
                <th class="vt-col-w110">¿Cumple?</th>
                <th class="vt-col-w120">Cambiar Archivo</th>
              </tr>
            </thead>
            <tbody>
              ${reqRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sección Pago Replaneada -->
      <div class="vt-card-section vt-pago-section-highlight">
        <div class="vt-card-section-title vt-section-title-between">
          <div class="vt-section-title-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
            Estado y Control de Pago del Trámite
          </div>
          <span class="pill ${isPaid || isFree ? 'ok' : 'warn'}">
            ${isPaid ? 'Abono confirmado' : (isFree ? 'Costo Cero / Gratuito' : 'Pendiente de Pago')}
          </span>
        </div>

        <!-- Banner aclaratorio -->
        <div class="vt-pago-clarification-banner">
          <span class="clarification-icon-svg">${SVG_ICONS.info}</span>
          <div>
            <b>Aclaración de Interfaz:</b> El indicador de la columna Pago indica si el estudiante ha completado el pago en banco/caja. 
            El ícono <b>No</b> significa que el alumno <u>aún no realiza el pago</u> (no es una acción para eliminar ni borrar el trámite).
          </div>
        </div>

        <div class="vt-table-scroll">
          <table class="vt-pago-table">
            <thead>
              <tr>
                <th class="vt-col-w190">Estado de Pago</th>
                <th>Nro. Documento</th>
                <th>Monto</th>
                <th>Carrera</th>
                <th>Fecha de Pago</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="vt-pago-status-cell">
                    <div class="vt-pago-indicator ${isPaid || isFree ? 'paid' : 'pending'}">
                      ${isPaid || isFree ? SVG_ICONS.checkSm : SVG_ICONS.xSm}
                    </div>
                    <div class="vt-pago-text-status">
                      <span class="${isPaid || isFree ? 'vt-pago-tag-ok' : 'vt-pago-tag-warn'}">
                        ${isPaid ? 'PAGADO' : (isFree ? 'COSTO CERO' : 'NO PAGADO')}
                      </span>
                      <span class="vt-pago-subtext">
                        ${isPaid ? 'Abonado en bancos/caja' : (isFree ? 'Exonerado institucional' : 'Alumno aún no paga')}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="mono vt-nro-doc-mono">${(s.pago && s.pago.nroDocumento) || (isPaid ? 'REC-2026-90412' : '-')}</span>
                </td>
                <td>
                  <b class="vt-cost-text">${formatMoney(s.costo || (s.pago && s.pago.monto))}</b>
                </td>
                <td>
                  <span class="vt-carrera-font">${s.carrera || (s.pago && s.pago.carrera) || '-'}</span>
                </td>
                <td>
                  <span class="vt-fecha-pago-text">
                    ${(s.pago && s.pago.fechaPago) || (isPaid ? '2026-09-25 10:48' : '<span class="pill warn pill-pad-xs">Pendiente</span>')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Botones de Acción de Pago -->
        <div class="vt-pago-actions">
          <button type="button" class="btn btn-warning-pay" onclick="ejecutarGenerarObligacion('${s.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Generar Obligación de Pago
          </button>
          ${(s.pago && s.pago.obligacionGenerada) ? `
            <span class="vt-obligacion-ok">
              ${SVG_ICONS.checkSm} Obligación registrada en sistema académico (Concepto: <b>${s.conceptoCodigo || '33020109'}</b>)
            </span>
          ` : `
            <span class="vt-obligacion-hint">
              Presiona el botón para habilitar la orden de pago en bancos y banca por internet al estudiante.
            </span>
          `}

          ${!isPaid && !isFree ? `
            <button type="button" class="btn btn-outline btn-sm vt-btn-sim-pago" onclick="simularPago('${s.id}')" title="Simula que el alumno pagó en ventanilla bancaria">
              ${SVG_ICONS.creditCard} <span>Simular Pago Bancario (Demo)</span>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Proceso / Derivación a Áreas -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 15v4H5v-4h14m1-2H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          Proceso y Flujo de Atención de Áreas
        </div>
        ${procesoHtml}
      </div>

      <!-- Mensaje para el Solicitante -->
      <div class="vt-card-section">
        <div class="vt-card-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          Mensaje para el Solicitante
        </div>
        <p class="vt-msg-desc">
          Esta información será notificada al estudiante y se reflejará en su módulo de Seguimiento de Trámites.
        </p>
        <textarea class="vt-message-box" id="modal-msg-solicitante" maxlength="1000" placeholder="Escribe aquí las indicaciones, enlaces de pago o resoluciones institucionales para el estudiante..." oninput="actualizarContadorCaracteres(this)">${s.mensajeSolicitante || ''}</textarea>
        <div class="vt-char-count">
          <span id="char-counter">${(s.mensajeSolicitante || '').length} / 1000 caracteres</span>
        </div>
        <div class="vt-msg-submit-wrap">
          <button type="button" class="btn btn-secondary" onclick="guardarMensajeSolicitante('${s.id}')">
            Grabar Mensaje
          </button>
        </div>
      </div>

      <!-- Diagnóstico Técnico Inferior -->
      <div class="vt-meta-footer">
        <div>Concepto del Trámite: <b>${s.conceptoCodigo || '33020109'}</b></div>
        <div>Monto del Trámite: <b>${formatMoney(s.costo)}</b></div>
        <div>Realizó el Pago: <b class="${isPaid || isFree ? 'pay-stat-green' : 'pay-stat-red'}">${isPaid || isFree ? 'SÍ' : 'NO'}</b></div>
        <div>Días transcurridos: <b>${calcularDiasTranscurridos(s.fecha)} días</b></div>
      </div>
    </div>

    <div class="modal-foot modal-foot-styled">
      <button type="button" class="btn btn-outline" onclick="APP.closeModal()">Cerrar</button>
      <div class="modal-foot-right-btns">
        <button type="button" class="btn btn-danger btn-sm" onclick="marcarRechazado('${s.id}')">Desestimar Trámite</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="marcarAprobadoFinal('${s.id}')">Aprobar y Emitir Trámite</button>
      </div>
    </div>
  `;

  APP.openModal(modalHtml, { extraWide: true });
  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(document.getElementById('modal-host'));
  }
}

// Funciones del Modal
function actualizarContadorCaracteres(el) {
  const cnt = document.getElementById('char-counter');
  if (cnt) cnt.textContent = `${el.value.length} / 1000 caracteres`;
}

function togglePanelCambiarArchivo(reqId) {
  const p = document.getElementById(`panel-cambiar-${reqId}`);
  if (p) p.style.display = p.style.display === 'none' ? 'table-row' : 'none';
}

function subirArchivoReemplazo(solId, reqId) {
  const input = document.getElementById(`input-file-${reqId}`);
  let fileName = 'FOTO_REEMPLAZO.jpg';
  if (input && input.files && input.files.length > 0) {
    fileName = input.files[0].name;
  }
  DB.cambiarArchivoRequisito(solId, reqId, fileName);
  APP.toast({
    icon: 'ok',
    title: 'Archivo reemplazado',
    body: `Se actualizó el archivo adjunto a <b>${fileName}</b> correctamente.`
  });
  abrirDetalle(solId);
  render();
}

function toggleCumple(solId, reqId, cumple) {
  DB.toggleCumpleRequisito(solId, reqId, cumple);
  APP.toast({
    icon: cumple ? 'ok' : 'info',
    title: cumple ? 'Requisito validado' : 'Requisito pendiente',
    body: `El requisito fue marcado como ${cumple ? 'conforme' : 'por subsanar'}.`
  });
  render();
}

function verArchivoAdjunto(solId, reqId, archivo) {
  const isImg = /\.(jpg|jpeg|png)$/i.test(archivo);
  APP.openModal(`
    <div class="modal-head">
      <h3>Visualizador de Requisito: ${archivo || 'Documento'}</h3>
      <button class="modal-close" onclick="abrirDetalle('${solId}')">×</button>
    </div>
    <div class="modal-body modal-viewer-body">
      ${isImg ? `
        <div class="viewer-card-img">
          <div class="viewer-img-placeholder">
            ${SVG_ICONS.userLarge}
          </div>
          <div class="viewer-img-title">${archivo}</div>
          <div class="viewer-img-sub">Fotografía pasaporte formal fondo blanco</div>
        </div>
      ` : `
        <div class="viewer-card-doc">
          <div class="viewer-doc-icon">${SVG_ICONS.docLarge}</div>
          <div class="viewer-doc-title">${archivo}</div>
          <div class="viewer-doc-sub">Documento digital verificado con firma institucional</div>
          <div class="viewer-doc-pill-wrap">
            <span class="pill ok">Documento legible (100% verificado)</span>
          </div>
        </div>
      `}
    </div>
    <div class="modal-foot">
      <button class="btn btn-primary" onclick="abrirDetalle('${solId}')">Volver al Trámite</button>
    </div>
  `, { wide: false });
}

function ejecutarGenerarObligacion(solId) {
  const s = DB.generarObligacionPago(solId);
  APP.toast({
    icon: 'info',
    title: 'Obligación de pago generada',
    body: `Se habilitó la orden de pago por ${formatMoney(s.costo)} en bancos autorizados para el alumno.`
  });
  abrirDetalle(solId);
  render();
}

function simularPago(solId) {
  const s = DB.simularPagoSolicitud(solId);
  APP.toast({
    icon: 'ok',
    title: 'Pago simulado con éxito',
    body: `El trámite pasó a estado PAGADO con el comprobante ${s.pago.nroDocumento}.`
  });
  abrirDetalle(solId);
  render();
}

function procederPaso(solId, orden) {
  const obs = document.getElementById(`obs-step-${orden}`) ? document.getElementById(`obs-step-${orden}`).value : '';
  DB.avanzarEtapaProceso(solId, orden, obs);
  APP.toast({
    icon: 'ok',
    title: 'Etapa atendida: Procede',
    body: 'El trámite avanzó de fase satisfactoriamente.'
  });
  abrirDetalle(solId);
  render();
}

function observarPasoDesdeDetalle(solId, orden) {
  const obsEl = document.getElementById(`obs-step-${orden}`);
  const obsVal = obsEl ? obsEl.value.trim() : '';
  if (!obsVal) {
    APP.toast({
      icon: 'warn',
      title: 'Observación requerida',
      body: 'Por favor ingresa el motivo o sustento de la observación en el campo de texto.'
    });
    if (obsEl) obsEl.focus();
    return;
  }
  DB.actualizarEstadoSolicitud(solId, 'Observado');
  APP.toast({
    icon: 'warn',
    title: 'Trámite marcado como Observado',
    body: 'Se registró la observación institucional y se notificó al estudiante para su subsanación.'
  });
  abrirDetalle(solId);
  render();
}

function guardarMensajeSolicitante(solId) {
  const val = document.getElementById('modal-msg-solicitante').value;
  const s = DB.grabarMensajeSolicitante(solId, val);
  const alumno = DB.getUsuario(s.alumnoId);
  const toMail = alumno ? alumno.email : (s.alumnoCodigo + '@uwiener.edu.pe');

  APP.sendMail({
    to: toMail,
    cc: adminUser.email,
    subject: `Notificación Trámite Ticket N° ${s.ticket || s.id} - ${s.tramiteNombre}`,
    lines: [
      `Estimado(a) <b>${s.alumnoNombre}</b>:`,
      val || 'Se ha actualizado la información de tu trámite.',
      'Puedes ingresar a la intranet para consultar el estado detallado.'
    ]
  });

  APP.toast({
    icon: 'mail',
    title: 'Mensaje grabado y notificado',
    body: 'El mensaje se guardó en el historial y se envió al correo del estudiante.'
  });
  render();
}

function cambiarEstadoDesdeModal(solId, nuevoEstado) {
  DB.actualizarEstadoSolicitud(solId, nuevoEstado);
  APP.toast({
    icon: 'info',
    title: 'Estado actualizado',
    body: `El trámite ahora figura como <b>${nuevoEstado}</b>.`
  });
  render();
}

function cambiarActivoDesdeModal(solId, activo) {
  DB.actualizarEstadoSolicitud(solId, DB.getSolicitud(solId).estado, activo);
  APP.toast({
    icon: 'info',
    title: 'Vigencia actualizada',
    body: `El trámite fue marcado como <b>${activo ? 'Activo' : 'Inactivo'}</b>.`
  });
  render();
}

function marcarAprobadoFinal(solId) {
  const s = DB.actualizarEstadoSolicitud(solId, 'Aprobado', true);
  APP.toast({
    icon: 'ok',
    title: 'Trámite Aprobado',
    body: `El trámite ${s.ticket || s.id} fue aprobado definitivamente.`
  });
  APP.closeModal();
  render();
}

function marcarRechazado(solId) {
  const s = DB.actualizarEstadoSolicitud(solId, 'Rechazado', false);
  APP.toast({
    icon: 'warn',
    title: 'Trámite Desestimado',
    body: `El trámite ${s.ticket || s.id} fue marcado como no procedente.`
  });
  APP.closeModal();
  render();
}

function calcularDiasTranscurridos(fechaStr) {
  if (!fechaStr) return 0;
  const f = new Date(fechaStr + 'T00:00:00');
  const now = new Date();
  const diff = Math.floor((now - f) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

// Exposición en window
window.procederPaso = procederPaso;
window.observarPasoDesdeDetalle = observarPasoDesdeDetalle;
window.guardarMensajeSolicitante = guardarMensajeSolicitante;
window.marcarAprobadoFinal = marcarAprobadoFinal;
window.marcarRechazado = marcarRechazado;
window.simularPago = simularPago;
window.ejecutarGenerarObligacion = ejecutarGenerarObligacion;
window.togglePanelCambiarArchivo = togglePanelCambiarArchivo;
window.subirArchivoReemplazo = subirArchivoReemplazo;
window.toggleCumple = toggleCumple;
window.verArchivoAdjunto = verArchivoAdjunto;
window.abrirDetalle = abrirDetalle;

// Inicialización
render();
