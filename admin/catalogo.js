// admin/catalogo.js - Catálogo Informativo de Trámites Wiener Admin

const ctx = APP.renderShell('catalogo');
const session = ctx ? ctx.session : null;

const SVG_ICONS = {
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  attachment: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
  checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  search: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  eye: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
};

let searchTxt = '';
let intencionSel = 'todos';

function setQ(val) {
  searchTxt = (val || '').toLowerCase().trim();
  renderCatalog();
}

function setIntencion(intencion) {
  intencionSel = intencion;
  document.querySelectorAll('.intent-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.intent === intencion);
  });
  renderCatalog();
}

function verModelo(tramiteId) {
  const t = DB.getTramite(tramiteId);
  if (!t) return;
  // Usar perfil modelo demo para renderizar la marca de agua
  const mockAlumno = {
    nombre: 'EJEMPLO DE ESTUDIANTE',
    codigo: '2026100000',
    dni: '00000000',
    perfil: {
      programa: 'CARRERA DE EJEMPLO',
      nivel: 'pregrado',
      ciclo: 8,
      creditos: 160
    }
  };
  DOC.preview(t, mockAlumno, null, { modelo: true });
}

function renderCatalog() {
  const all = DB.tramites();

  const specificIntents = ['beca', 'practicas', 'grado', 'carne'];
  const filtrados = all.filter(t => {
    const matchText = !searchTxt || (t.nombre + ' ' + t.descripcion + ' ' + t.tipo + ' ' + t.area).toLowerCase().includes(searchTxt);
    const matchIntent = (intencionSel === 'todos')
      || (intencionSel === 'otros' && (
        (t.intenciones && (t.intenciones.includes('otros') || t.intenciones.includes('matricula'))) ||
        (!t.intenciones || !t.intenciones.some(i => specificIntents.includes(i)))
      ))
      || (t.intenciones && t.intenciones.includes(intencionSel));
    return matchText && matchIntent;
  });

  const cardsHtml = filtrados.map(t => {
    const slaExacto = APP.calcSLA(t.diasEntrega);
    const tienePlantilla = DOC.getPlantilla(t) && DOC.getPlantilla(t).generaDocumento;
    const reqs = t.requisitos && t.requisitos.length ? t.requisitos : [];

    return `
      <div class="tram-card">
        <!-- Kicker de categoría y área -->
        <div class="tram-header">
          <span class="tram-category-text">${t.tipo} · ${t.area}</span>
          <span class="pill ${t.activo ? 'ok' : 'gray'} tram-status-pill">${t.activo ? 'Catálogo activo' : 'Inactivo'}</span>
        </div>

        <!-- Título con fuerte peso visual -->
        <h3 class="tram-title">${t.nombre}</h3>
        
        <!-- Descripción detallada -->
        <p class="tram-desc">${t.descripcion}</p>

        <!-- Especificaciones de entrega y sustentos solicitados -->
        <div class="tram-specs-line">
          <div class="spec-item">
            <span class="spec-ico">${SVG_ICONS.clock}</span>
            <span>Entrega estimada: <b>${slaExacto}</b> (${t.diasEntrega} días hábiles)</span>
          </div>
          <div class="spec-item">
            <span class="spec-ico">${SVG_ICONS.checkCircle}</span>
            <span>Modalidad de pago: <b>${t.pagoMomento === 'antes' ? 'Pago al momento de solicitar' : 'Pago posterior a la aprobación'}</b></span>
          </div>
          ${t.requiereAdjunto ? `
            <div class="spec-item spec-item-warning">
              <span class="spec-ico">${SVG_ICONS.attachment}</span>
              <span>Requiere que el alumno presente documentos de sustento</span>
            </div>
            ${reqs.length ? `
              <div class="spec-requirements-box">
                <b>Documentos / adjuntos que solicita este trámite:</b>
                <ul>
                  ${reqs.map(r => `<li><b>${r.titulo}</b>${r.condiciones ? `: <span class="spec-cond-text">${r.condiciones}</span>` : ''}</li>`).join('')}
                </ul>
              </div>` : ''}
          ` : `
            <div class="spec-item spec-item-success">
              <span class="spec-ico">${SVG_ICONS.checkCircle}</span>
              <span>Emisión 100% digital sin adjuntos requeridos</span>
            </div>
          `}
        </div>

        <!-- Footer: Precio y botón para ver modelo (SIN botón solicitar) -->
        <div class="tram-foot">
          <div class="tram-price-wrap">
            <div class="tram-price-main">${APP.money(t.costo)}</div>
            <div class="tram-price-sub">Tasa oficial aprobada · Incluye IGV</div>
          </div>
          <div class="tram-actions">
            ${tienePlantilla ? `
              <button class="btn btn-ghost" onclick="verModelo('${t.id}')">
                ${SVG_ICONS.eye} Ver modelo oficial
              </button>
            ` : `
              <span class="pill gray pill-oficio">Formato de oficio</span>
            `}
          </div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('catalog-grid').innerHTML = cardsHtml || `
    <div class="card empty-catalog-card">
      <div class="empty-state">
        <div class="ico">🔍</div>
        <div class="empty-title">No encontramos trámites con esa búsqueda</div>
        <div class="empty-desc">Prueba buscando otra palabra clave o selecciona otra categoría.</div>
        <button class="btn btn-sm" onclick="setQ('');setIntencion('todos');">Ver todos los trámites</button>
      </div>
    </div>`;
}

function initView() {
  const totalTramites = DB.tramites().length;
  const digitales = DB.tramites().filter(t => !t.requiereAdjunto).length;
  const conAdjuntos = DB.tramites().filter(t => t.requiereAdjunto).length;
  const gratuitos = DB.tramites().filter(t => Number(t.costo) === 0).length;

  ctx.mount.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Catálogo informativo de trámites</h1>
        <p>Consulta informativa de costos, descripción oficial, tiempos de entrega y adjuntos requeridos para cada trámite estudiantil.</p>
      </div>
      <a class="btn btn-primary" href="registrar.html">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Registrar trámite para alumno</span>
      </a>
    </div>

    <!-- Banner Informativo del Catálogo para el Administrativo -->
    <div class="catalog-admin-bar">
      <div class="catalog-admin-left">
        <div class="catalog-admin-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="catalog-admin-details">
          <div class="catalog-admin-title-row">
            <h2>Catálogo de Servicios y Trámites Documentarios</h2>
            <span class="pill info pill-mode-info">Modo consulta informativa</span>
          </div>
          <div class="catalog-admin-meta">
            <span>Esta vista permite verificar los requisitos, condiciones y tarifas antes de registrar solicitudes en nombre de los alumnos.</span>
          </div>
        </div>
      </div>

      <div class="catalog-admin-kpis">
        <div class="kpi-box">
          <span class="kpi-label">Total Trámites</span>
          <span class="kpi-val">${totalTramites}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Con Adjuntos</span>
          <span class="kpi-val">${conAdjuntos}</span>
        </div>
        <div class="kpi-box highlight">
          <span class="kpi-label">100% Digital</span>
          <span class="kpi-val">${digitales}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Costo Cero</span>
          <span class="kpi-val">${gratuitos}</span>
        </div>
      </div>
    </div>

    <!-- Buscador e Intenciones idéntico a la vista del alumno -->
    <div class="catalog-search-card catalog-search-card-spaced">
      <div class="input-wrap-icon-left">
        <span class="input-icon-svg" aria-hidden="true">${SVG_ICONS.search}</span>
        <input id="search-input" placeholder="Buscar trámite por nombre (ej. Matrícula, Certificado, Beca, Carné...)" oninput="setQ(this.value)">
      </div>

      <div class="intent-section-title">Filtrar por categoría de trámite</div>
      <div class="intent-bar">
        <button class="intent-btn active" data-intent="todos" onclick="setIntencion('todos')">Todos</button>
        <button class="intent-btn" data-intent="beca" onclick="setIntencion('beca')">Becas y descuentos</button>
        <button class="intent-btn" data-intent="practicas" onclick="setIntencion('practicas')">Prácticas y empleo</button>
        <button class="intent-btn" data-intent="grado" onclick="setIntencion('grado')">Grados y egreso</button>
        <button class="intent-btn" data-intent="carne" onclick="setIntencion('carne')">Carné universitario</button>
        <button class="intent-btn" data-intent="otros" onclick="setIntencion('otros')">Otros</button>
      </div>
    </div>

    <!-- Grid de Cards de Trámites (Sin botón Solicitar) -->
    <div class="tram-grid" id="catalog-grid"></div>
  `;

  renderCatalog();
}

window.setQ = setQ;
window.setIntencion = setIntencion;
window.verModelo = verModelo;

initView();
