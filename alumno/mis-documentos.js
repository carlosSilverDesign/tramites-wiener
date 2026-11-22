/* ==========================================================================
   VISTA: MIS DOCUMENTOS (alumno/mis-documentos.js)
   Universidad Norbert Wiener - Sistema de Trámites
   ========================================================================== */

// Garantizar que la vista de alumno siempre cuente con la sesión del estudiante (auditoría o cambio desde admin)
const urlParams = new URLSearchParams(window.location.search);
const paramCodigo = urlParams.get('codigo') || urlParams.get('alumno');
let curSession = APP.getSession();

if (paramCodigo || !curSession || curSession.rol !== 'alumno') {
  const targetCodigo = paramCodigo || '2021100345';
  const studentUser = (DB.usuarios() || []).find(u => u.codigo === targetCodigo || u.id === targetCodigo)
                   || (DB.usuarios() || []).find(u => u.rol === 'alumno' && u.estado === 'activo');
  if (studentUser) {
    APP.setSession({
      id: studentUser.id,
      nombre: studentUser.nombre,
      rol: studentUser.rol,
      email: studentUser.email,
      area: studentUser.area || '',
      codigo: studentUser.codigo,
      perfil: studentUser.perfil || {}
    });
    curSession = APP.getSession();
  }
}

const ctx = APP.renderShell('mis-documentos');
if (!ctx) throw new Error('Auth required');

const me = ctx.session;
const perfil = me.perfil || {};
let activeTab = 'certificaciones'; // 'certificaciones' | 'todos'
let openAccordions = {};

function volverAAdmin() {
  const adminUser = (DB.usuarios() || []).find(u => u.rol === 'admin' && u.estado === 'activo') || {
    id: 'ADM-0091',
    nombre: 'Carlos Mendoza Ríos',
    rol: 'admin',
    area: 'Registros Académicos',
    email: 'cmendoza@uwiener.edu.pe',
    codigo: 'ADM01'
  };
  APP.setSession({
    id: adminUser.id,
    nombre: adminUser.nombre,
    rol: adminUser.rol,
    email: adminUser.email,
    area: adminUser.area || 'Registros Académicos',
    codigo: adminUser.codigo || 'ADM01'
  });
  window.location.href = '../admin/certificaciones.html';
}

function toggleAccordion(id) {
  openAccordions[id] = !openAccordions[id];
  renderView();
}

function setTab(tab) {
  activeTab = tab;
  renderView();
}

function descargarCertificado(solId) {
  const s = DB.getSolicitud(solId);
  if (!s) return;
  const alumno = DB.getUsuario(s.alumnoId) || me;
  const t = DB.getTramite(s.tramiteId) || {
    id: s.tramiteId || 'T-010',
    nombre: s.tramiteNombre,
    tipo: 'Certificado',
    modelo: 'certificado'
  };
  DOC.preview(t, alumno, s);
}

function renderView() {
  const allCerts = DB.certificacionesProgresivas();
  // El alumno sólo debe ver los Certificados que solicitó o le fueron emitidos institucionalmente
  const certsSolicitadas = allCerts.filter(c => DB.certificacionEmitida(me.id, c.id));

  // Inicializar el primer acordeón abierto por defecto si no hay interacción previa
  if (certsSolicitadas.length > 0 && Object.keys(openAccordions).length === 0) {
    openAccordions[certsSolicitadas[0].id] = true;
  }

  const allMine = DB.solicitudes().filter(s => (s.alumnoId === me.id || s.alumnoCodigo === me.codigo) && s.estado === 'Emitido');

  ctx.mount.innerHTML = `
    <!-- Barra de auditoría y retorno para el Administrador -->
    <div class="demo-audit-bar">
      <div class="demo-audit-left">
        <div class="demo-audit-icon">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div>
          <div class="demo-audit-title">Vista de Demostración: Perfil del Estudiante</div>
          <div class="demo-audit-desc">
            <b>${me.nombre}</b> (Cód: <span class="demo-audit-code">${me.codigo}</span>) &nbsp;·&nbsp; ${perfil.programa || 'Ingeniería de Sistemas e Informática'} &nbsp;·&nbsp; Ciclo ${perfil.ciclo || 8}
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-outline btn-sm btn-back-admin" onclick="volverAAdmin()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Volver al Panel de Emisión Masiva (Admin)</span>
      </button>
    </div>

    <!-- Cabecera consistente con las otras secciones (.page-head sin icono) -->
    <div class="page-head">
      <div>
        <h1>Mis documentos</h1>
        <p>Historial y descarga de certificaciones progresivas, constancias y documentos oficiales emitidos con firma digital.</p>
      </div>
      <a class="btn btn-primary" href="solicitar.html">+ Solicitar nuevo trámite</a>
    </div>

    <!-- Aviso de reglas -->
    <div class="rules-banner-wiener">
      <div class="rules-banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#fff"><path d="M12.71,16.71Q13,16.43 13,16V12q0-0.43-0.29-0.71T12,11t-0.71,0.29T11,12v4q0,0.43 0.29,0.71T12,17t0.71-0.29Zm0-8Q13,8.42 13,8q0-0.43-0.29-0.71T12,7T11.29,7.29T11,8q0,0.42 0.29,0.71T12,9t0.71-0.29ZM12,22q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-2q3.35,0 5.68-2.32T20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20Zm0-8Z"/></svg>
      </div>
      <div class="rules-banner-content">
        <div class="rules-banner-title">
          Requisitos para Certificaciones Progresivas
        </div>
        <div class="rules-banner-desc">
          Debes alcanzar la <b>nota mínima de 14 en todos los cursos correspondientes</b> del módulo formativo para obtener el certificado y <b>no contar con deuda pendiente</b> en pensiones o aranceles universitarios.
        </div>
        <div class="rules-pills-row">
          <span class="rules-check-pill">
            <svg class="svg-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Regla 1: Nota mínima 14 cumplida (Tu promedio ponderado: <b>${perfil.promedio || '16.20'}</b>)
          </span>
          <span class="rules-check-pill">
            <svg class="svg-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Regla 2: Sin deuda (Estado financiero al día · <b>S/ 0.00</b> de deuda)
          </span>
        </div>
      </div>
    </div>

    <!-- Pestañas de navegación -->
    <div class="tabs-bar">
      <div class="tab-item ${activeTab === 'certificaciones' ? 'active' : ''}" onclick="setTab('certificaciones')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        Certificaciones progresivas <span class="tab-count">${certsSolicitadas.length}</span>
      </div>
      <div class="tab-item ${activeTab === 'todos' ? 'active' : ''}" onclick="setTab('todos')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        Todos los documentos emitidos <span class="tab-count">${allMine.length}</span>
      </div>
    </div>

    <!-- Contenedor Principal de Vistas -->
    <div id="docs-content-area">
      ${activeTab === 'certificaciones' ? renderCertificacionesTab(certsSolicitadas) : renderTodosDocsTab(allMine)}
    </div>
  `;
}

function renderCertificacionesTab(certs) {
  if (!certs || certs.length === 0) {
    return `
      <div class="empty-state-box">
        <div class="empty-state-icon-wrap">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <h3 class="empty-state-title">No tienes certificaciones emitidas aún</h3>
        <p class="empty-state-desc">Una vez que solicites y pagues una Certificación Progresiva, aparecerá listada aquí para su consulta, descarga e impresión en cualquier momento.</p>
        <a href="solicitar.html" class="btn btn-primary btn-empty-solicitar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Solicitar Certificación Progresiva
        </a>
      </div>
    `;
  }

  return certs.map(cert => {
    const emitidoSol = DB.certificacionEmitida(me.id, cert.id);
    const isOpen = !!openAccordions[cert.id];

    // Obtener detalle de cursos y notas del alumno
    const cursosDetalle = (cert.cursos || []).map(c => {
      const historial = me.historialCursos && (me.historialCursos[c.codigo] || me.historialCursos[c.nombre]);
      const nota = (historial && historial.nota != null) ? historial.nota : (c.nota || 16);
      return {
        codigo: c.codigo || '',
        nombre: c.nombre,
        ciclo: c.ciclo || '',
        creditaje: c.creditaje || 4,
        nota: nota,
        cumple: nota >= 14.0
      };
    });

    const notasList = cursosDetalle.map(c => c.nota);
    const promCalc = notasList.length ? (notasList.reduce((a, b) => a + b, 0) / notasList.length).toFixed(1) : (cert.promedio || '16.0');

    return `
      <div class="cert-accordion-card ${isOpen ? 'is-open' : ''}">
        <div class="cert-accordion-head" onclick="toggleAccordion('${cert.id}')">
          <div class="cert-accordion-head-left">
            <div class="cert-doc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 15 11 17 15 13"></polyline>
              </svg>
            </div>
            <div class="cert-title-wrap">
              <h3>${cert.titulo}</h3>
              <div class="cert-sub">${cert.area || cert.competencia || 'Tecnologías de la Información'} · ${cursosDetalle.length} asignaturas validadas · Nota prom: <b>${promCalc}</b></div>
            </div>
          </div>

          <div class="cert-header-right">
            <span class="pill ok cert-header-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Emitido · Disponible
            </span>
            <div class="cert-accordion-chevron">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div class="cert-accordion-body">
          <div class="courses-table">
            ${cursosDetalle.map(c => `
              <div class="courses-table-row">
                <div class="course-title-sub">
                  ${c.codigo ? `<span class="course-code-tag">[${c.codigo}]</span> ` : ''}
                  <b>${c.nombre}</b>
                  ${c.ciclo ? `<span class="course-ciclo-tag"> · Ciclo ${c.ciclo}</span>` : ''}
                </div>
                <div class="course-status-side">
                  <span class="course-grade-badge">Nota: ${Number(c.nota).toFixed(1)}</span>
                  <span class="course-check-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Cumple requisito (≥ 14.00)
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Mensaje simple y botones de Imprimir y Descargar con iconos SVG -->
          <div class="cert-completion-callout">
            <div class="cert-completion-text">
              Certificado oficial emitido con firma digital institucional y enviado a tu correo institucional (<b>${me.email}</b>).
              ${emitidoSol && emitidoSol.origen ? `
                <div class="cert-callout-badge-wrap">
                  <span class="pill ok cert-free-pill">
                    🎁 Emisión Masiva Institucional Gratuita (${emitidoSol.periodo || 'Cierre de Ciclo'})
                  </span>
                </div>
              ` : ''}
            </div>

            <div class="cert-actions-btns">
              <button class="btn btn-ghost btn-sm btn-inline-icon" onclick="DOC._pr('T-010', '${me.id}', '${emitidoSol ? emitidoSol.id : ''}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span>Imprimir</span>
              </button>

              <button class="btn btn-primary btn-sm btn-inline-icon" onclick="descargarCertificado('${emitidoSol ? emitidoSol.id : ''}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Descargar certificado</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTodosDocsTab(docs) {
  if (!docs || docs.length === 0) {
    return `
      <div class="empty-state-box">
        <div class="empty-state-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <h3 class="empty-state-title-sm">No hay documentos emitidos</h3>
        <p class="empty-state-desc-sm">Los documentos y certificaciones que solicites y pagues aparecerán listados aquí para descarga permanente.</p>
      </div>
    `;
  }

  return docs.map(s => {
    const codigoDoc = 'DOC-' + s.id.replace('S-', '');
    return `
      <div class="doc-issued-card">
        <div class="doc-issued-left">
          <div class="doc-issued-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div class="doc-issued-details">
            <h3>${s.tramiteNombre}</h3>
            <div class="doc-issued-meta">
              <span class="doc-code-pill">
                ${codigoDoc}
              </span>
              <span class="sep">·</span>
              <span>Emitido el ${s.fecha}</span>
              <span class="sep">·</span>
              <span class="doc-signature-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Firma digital institucional
              </span>
            </div>
          </div>
        </div>

        <div class="doc-actions-row">
          <button class="btn btn-ghost btn-sm btn-inline-icon" onclick="DOC._pr('${s.tramiteId}', '${me.id}', '${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Imprimir</span>
          </button>

          <button class="btn btn-primary btn-sm btn-inline-icon" onclick="descargarCertificado('${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Descargar</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

renderView();
