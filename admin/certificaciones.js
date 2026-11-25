// admin/certificaciones.js - Emisión Masiva de Certificaciones de Conocimiento Wiener Admin

const ctx = APP.renderShell('certificaciones');
if (!ctx) throw new Error('Auth required');

// Vector SVG oficial solicitado para botones 'Ejecutar Emisión Masiva' y 'Ejecutar ahora'
function getSvgExecIcon(size = 18, fill = 'currentColor') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="${size}px" width="${size}px" fill="${fill}" class="cert-icon-svg"><path d="M10.55,18.2L15.73,12h-4l0.72-5.68L7.83,13H11.3l-0.75,5.2ZM9.58,14.5H6.53q-0.5,0-0.74-0.45t0.06-0.86l6.55-9.45q0.2-0.28 0.52-0.39t0.65,0.02t0.5,0.41t0.12,0.63L13.43,10.5h3.73q0.53,0 0.75,0.48t-0.13,0.89l-7.24,8.68q-0.22,0.26-0.53,0.33T9.4,20.82T8.94,20.4T8.82,19.78L9.58,14.5Zm2.2-2.25Z"/></svg>`;
}

// Estado local de la vista
let activeTab = 'configurador'; // 'configurador' | 'programacion'
let selectedProgramId = 'PROG-ISI';
let selectedCertId = 'CP-ISI-01';
let selectedPeriodo = '2026-II';
let selectedModalidad = 'todas';
let selectedCiclo = 'todos';

// Workflow de Aprobación Institucional y Firmas Digitales (Administrativo -> Director -> Decano)
let workflowFirmas = DB.workflowFirmas();
let activeWorkflowRole = workflowFirmas.director?.aprobado ? 'decano' : (workflowFirmas.administrativo?.aprobado ? 'director' : 'administrativo');

function setWorkflowRole(rol) {
  activeWorkflowRole = rol;
  renderPage();
}

function aprobarPasoWorkflow(rol) {
  const res = DB.aprobarPasoWorkflow(rol);
  if (!res.ok) {
    APP.toast({
      icon: 'warn',
      title: 'Orden de Refrendo Requerido',
      body: res.error
    });
    return;
  }

  workflowFirmas = DB.workflowFirmas();
  if (rol === 'administrativo') activeWorkflowRole = 'director';
  else if (rol === 'director') activeWorkflowRole = 'decano';

  const cargoMap = {
    administrativo: 'Administrativo (Registros Académicos)',
    director: 'Director de Escuela y Registros',
    decano: 'Decano de la Facultad'
  };

  APP.toast({
    icon: 'ok',
    title: 'Firma Digital Registrada',
    body: `Firma de ${cargoMap[rol]} refrendada para la emisión masiva.`
  });

  renderPage();
}

function reiniciarWorkflowFirmas() {
  workflowFirmas = DB.reiniciarWorkflowFirmas();
  activeWorkflowRole = 'administrativo';
  APP.toast({
    icon: 'info',
    title: 'Proceso de Firmas Reiniciado',
    body: 'El flujo de firmas ahora requiere la aprobación secuencial desde el Administrativo (Paso 1).'
  });
  renderPage();
}

// Reglas institucionales configurables
let configNotaMin = 14.0;
let configExigirSinDeuda = true;
let configOmitirYaEmitidos = true;
let configDespachoCorreo = true;

// Estado del banner desplegable de Reglas (Carga oculto por defecto según requerimiento)
let isRulesExpanded = false;
let isMallaExpanded = true;

// Filtros de búsqueda en tablas
let searchQueryHistorial = '';
let filterPeriodoHistorial = 'todos';
let filterDateDesde = '';
let filterDateHasta = '';
let filterEstadoProgramacion = 'todos';
let filterPeriodoProg = 'todos';

function setMainTab(tab) {
  activeTab = tab;
  renderPage();
}

function toggleRules() {
  isRulesExpanded = !isRulesExpanded;
  const body = document.getElementById('rules-collapsible-body');
  const arrow = document.getElementById('rules-toggle-arrow');
  const label = document.getElementById('rules-toggle-label');
  if (body && arrow && label) {
    if (isRulesExpanded) {
      body.style.display = 'block';
      arrow.style.transform = 'rotate(180deg)';
      label.textContent = 'Ocultar reglas';
    } else {
      body.style.display = 'none';
      arrow.style.transform = 'rotate(0deg)';
      label.textContent = 'Revisar reglas del sistema';
    }
  } else {
    renderPage();
  }
}

function toggleMalla() {
  isMallaExpanded = !isMallaExpanded;
  renderPage();
}

function quitarCursoCertificacion(codigoCurso) {
  const cert = DB.getCertificacion(selectedCertId);
  if (!cert) return;

  if ((cert.cursos || []).length <= 1) {
    APP.toast({
      icon: 'warn',
      title: 'Validación Curricular',
      body: 'La certificación debe contener al menos una asignatura vinculada.'
    });
    return;
  }

  const nuevoCursos = (cert.cursos || []).filter(c => c.codigo !== codigoCurso);
  DB.actualizarCursosCertificacion(cert.id, nuevoCursos);
  APP.toast({
    icon: 'ok',
    title: 'Asignatura Retirada',
    body: `La asignatura ${codigoCurso} fue quitada de la certificación.`
  });
  renderPage();
}

function abrirModalAgregarCurso() {
  const cert = DB.getCertificacion(selectedCertId);
  if (!cert) return;

  const cursosActuales = (cert.cursos || []).map(c => c.codigo);
  const catalogoCompleto = DB.cursosDisponiblesMalla ? DB.cursosDisponiblesMalla(selectedProgramId) : [];
  const disponibles = catalogoCompleto.filter(c => !cursosActuales.includes(c.codigo));

  APP.openModal(`
    <div class="modal-head">
      <div class="audit-header-row">
        <div class="audit-header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div>
          <span class="audit-header-tag">Malla Curricular Institucional</span>
          <h3 class="audit-header-title">Agregar Asignatura a la Certificación</h3>
        </div>
      </div>
      <button class="modal-close" onclick="APP.closeModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <p style="font-size:13px;color:#475569;margin:0 0 12px 0;">
        Selecciona una asignatura del plan curricular para vincularla a <b>${cert.titulo}</b>.
      </p>

      <div class="modal-courses-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="input-buscar-curso-modal" class="form-control" placeholder="Buscar asignatura por nombre o código..." oninput="filtrarCursosDisponibles(this.value)">
      </div>

      <div class="modal-courses-list" id="modal-courses-container">
        ${disponibles.length === 0 ? `
          <div style="padding:24px;text-align:center;color:#64748B;font-size:13px;">
            Todas las asignaturas del plan curricular ya se encuentran vinculadas a esta certificación.
          </div>
        ` : disponibles.map(c => `
          <div class="modal-course-item" data-code="${c.codigo}" data-name="${c.nombre.toLowerCase()}">
            <div>
              <span class="modal-course-cod">${c.codigo}</span>
              <div class="modal-course-nom">${c.nombre}</div>
              <div class="modal-course-sub">Ciclo ${c.ciclo} · ${c.creditaje} créditos · Carácter Obligatorio</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="agregarCursoCertificacion('${c.codigo}')" style="display:inline-flex;align-items:center;gap:5px;flex-shrink:0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Agregar</span>
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="modal-foot">
      <button class="btn btn-outline" onclick="APP.closeModal()">Cerrar</button>
    </div>
  `, { wide: false });
}

function filtrarCursosDisponibles(query) {
  const q = (query || '').toLowerCase().trim();
  const items = document.querySelectorAll('#modal-courses-container .modal-course-item');
  items.forEach(it => {
    const code = (it.getAttribute('data-code') || '').toLowerCase();
    const name = (it.getAttribute('data-name') || '').toLowerCase();
    if (!q || code.includes(q) || name.includes(q)) {
      it.style.display = 'flex';
    } else {
      it.style.display = 'none';
    }
  });
}

function agregarCursoCertificacion(codigoCurso) {
  const cert = DB.getCertificacion(selectedCertId);
  if (!cert) return;

  const catalogo = DB.cursosDisponiblesMalla ? DB.cursosDisponiblesMalla(selectedProgramId) : [];
  const cursoToAdd = catalogo.find(c => c.codigo === codigoCurso);
  if (!cursoToAdd) return;

  const nuevoCursos = [...(cert.cursos || [])];
  if (!nuevoCursos.some(c => c.codigo === codigoCurso)) {
    nuevoCursos.push({
      codigo: cursoToAdd.codigo,
      nombre: cursoToAdd.nombre,
      ciclo: cursoToAdd.ciclo,
      tipo: cursoToAdd.tipo || 'O',
      creditaje: cursoToAdd.creditaje || 4,
      nota: 16,
      cumple: true
    });
    DB.actualizarCursosCertificacion(cert.id, nuevoCursos);
  }

  APP.closeModal();
  APP.toast({
    icon: 'ok',
    title: 'Asignatura Vinculada',
    body: `${cursoToAdd.nombre} fue agregado a ${cert.titulo}.`
  });
  renderPage();
}

function onProgramChange(progId) {
  selectedProgramId = progId;
  const prog = (DB.programasCertificaciones() || []).find(p => p.id === progId);
  if (prog && prog.certificacionesIds && prog.certificacionesIds.length > 0) {
    selectedCertId = prog.certificacionesIds[0];
  } else {
    selectedCertId = 'CP-ISI-01';
  }
  renderPage();
}

function onCertChange(certId) {
  selectedCertId = certId;
  renderPage();
}

function onParamRuleChange() {
  const inputNota = document.getElementById('cfg-nota');
  const chkDeuda = document.getElementById('cfg-deuda');
  const chkEmitidos = document.getElementById('cfg-emitidos');
  const chkCorreo = document.getElementById('cfg-correo');
  const selMod = document.getElementById('cfg-modalidad');
  const selCiclo = document.getElementById('cfg-ciclo');
  const selPeriodo = document.getElementById('cfg-periodo');

  if (inputNota) configNotaMin = Number(inputNota.value) || 14.0;
  if (chkDeuda) configExigirSinDeuda = chkDeuda.checked;
  if (chkEmitidos) configOmitirYaEmitidos = chkEmitidos.checked;
  if (chkCorreo) configDespachoCorreo = chkCorreo.checked;
  if (selMod) selectedModalidad = selMod.value;
  if (selCiclo) selectedCiclo = selCiclo.value;
  if (selPeriodo) selectedPeriodo = selPeriodo.value;

  renderPage();
}

function limpiarFiltrosHistorial() {
  searchQueryHistorial = '';
  filterPeriodoHistorial = 'todos';
  filterDateDesde = '';
  filterDateHasta = '';
  renderPage();
}

// Hidratación de componentes personalizados Wiener (Custom Selects & DatePickers)
function hydrateInteractiveControls(root = ctx.mount) {
  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(root);
  }
  if (APP && APP.initDatePickers) {
    APP.initDatePickers(root);
  }
}

// Navegación segura hacia el perfil del alumno con sincronización de sesión
function irAPerfilAlumno(codigo = '2021100345') {
  const alumno = (DB.usuarios() || []).find(u => u.codigo === codigo || u.id === codigo)
              || (DB.usuarios() || []).find(u => u.rol === 'alumno' && u.estado === 'activo');
  if (alumno) {
    APP.setSession({
      id: alumno.id,
      nombre: alumno.nombre,
      rol: alumno.rol,
      email: alumno.email,
      area: alumno.area || '',
      codigo: alumno.codigo,
      perfil: alumno.perfil || {}
    });
  }
  window.location.href = `../alumno/mis-documentos.html?codigo=${codigo}`;
}

// Modal: Detalle completo de un Lote de Emisión Masiva
function verDetalleLote(loteId) {
  const lote = DB.getLoteEmision(loteId);
  if (!lote) {
    APP.toast({ icon: 'warn', title: 'Aviso del sistema', body: 'Lote no encontrado' });
    return;
  }

  const alumnos = lote.alumnosEmitidos || [];
  const rawFecha = lote.fechaFormato || lote.fecha || '24/11/2026 17:45 hrs';
  const fechaFmt = rawFecha.includes(' · ')
    ? rawFecha
    : (rawFecha.includes(' ') ? rawFecha.replace(' ', ' · ') : rawFecha);

  APP.openModal(`
    <div class="modal-head">
      <div class="audit-header-row">
        <div class="audit-header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <path d="M12 11h4"></path>
            <path d="M12 16h4"></path>
            <path d="M8 11h.01"></path>
            <path d="M8 16h.01"></path>
          </svg>
        </div>
        <div>
          <span class="audit-header-tag">Auditoría de Lote Masivo</span>
          <h3 class="audit-header-title">${lote.id}</h3>
        </div>
      </div>
      <button class="modal-close" onclick="APP.closeModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <div class="audit-meta-grid">
        <div>
          <div class="audit-meta-lbl">Programa Académico</div>
          <div class="audit-meta-val">${lote.programa}</div>
        </div>
        <div>
          <div class="audit-meta-lbl">Certificación</div>
          <div class="audit-meta-val-cert">${lote.certificacionTitulo}</div>
        </div>
        <div>
          <div class="audit-meta-lbl">Periodo / Fecha</div>
          <div class="audit-meta-val">${lote.periodo} &nbsp;·&nbsp; ${lote.fechaFormato || lote.fecha}</div>
        </div>
        <div>
          <div class="audit-meta-lbl">Total Emitidos / Despacho</div>
          <div class="audit-meta-val-success">${lote.totalAlumnos} alumnos · ${lote.tasaEntrega || '100%'}</div>
        </div>
      </div>

      <!-- Firmas Institucionales Registradas en este Lote (Circuito Oficial de 3 Instancias) -->
      <div class="audit-signatures-box">
        <div class="audit-signatures-title">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
          <span>Firmas Institucionales Registradas en este Lote (Circuito Oficial de 3 Instancias)</span>
        </div>
        <div class="audit-signatures-grid">
          <div class="audit-signature-item">
            <div class="audit-sig-top">
              <span class="audit-sig-step">Paso 1 · Operador</span>
              <span class="audit-sig-badge ok">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Firmado</span>
              </span>
            </div>
            <div class="audit-sig-name">Carlos Mendoza Ríos</div>
            <div class="audit-sig-cargo">Jefatura Operativa de Registros Académicos</div>
            <div class="audit-sig-meta">
              <span class="audit-sig-id mono">ID: FDM-ADM-0091</span>
              <span class="audit-sig-date">Refrendado el ${fechaFmt}</span>
            </div>
          </div>
          <div class="audit-signature-item">
            <div class="audit-sig-top">
              <span class="audit-sig-step">Paso 2 · Dirección</span>
              <span class="audit-sig-badge ok">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Firmado</span>
              </span>
            </div>
            <div class="audit-sig-name">Dr. Miguel Angel Faustor Müller</div>
            <div class="audit-sig-cargo">Director de Registros y Asuntos Académicos</div>
            <div class="audit-sig-meta">
              <span class="audit-sig-id mono">ID: FDM-DIR-6119</span>
              <span class="audit-sig-date">Refrendado el ${fechaFmt}</span>
            </div>
          </div>
          <div class="audit-signature-item">
            <div class="audit-sig-top">
              <span class="audit-sig-step">Paso 3 · Decanato</span>
              <span class="audit-sig-badge ok">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Firmado</span>
              </span>
            </div>
            <div class="audit-sig-name">Dr. Augusto Salcedo Vílchez</div>
            <div class="audit-sig-cargo">Decano de la Facultad de Ingeniería y Negocios</div>
            <div class="audit-sig-meta">
              <span class="audit-sig-id mono">ID: FDM-DEC-3302</span>
              <span class="audit-sig-date">Refrendado el ${fechaFmt}</span>
            </div>
          </div>
        </div>
      </div>

      <h4 class="audit-section-title">
        <span>Estudiantes acreditados con firma electrónica en este lote:</span>
        <span class="pill ok pill-free-cert">Trámite Gratuito (S/ 0.00)</span>
      </h4>

      <!-- Contenedor con Scroll Horizontal Garantizado en Modal Wide -->
      <div class="modal-table-wrap modal-table-scroll">
        <table class="vt-table modal-vt-table">
          <thead>
            <tr>
              <th class="th-folio">N° Folio / Sol.</th>
              <th class="th-student">Estudiante Acreditado</th>
              <th class="th-email">Correo Institucional</th>
              <th class="th-center-fixed">Fecha y Firma</th>
              <th class="th-status-fixed">Estado Emisión</th>
              <th class="th-profile-fixed">Perfil Alumno</th>
            </tr>
          </thead>
          <tbody>
            ${alumnos.length === 0 ? `
              <tr>
                <td colspan="6" class="td-empty-table">
                  No se encontraron registros individuales en el detalle de este lote.
                </td>
              </tr>
            ` : alumnos.map((alu, idx) => {
              const cod = alu.codigo || ('202' + (idx + 1) + '100' + (idx + 120));
              const nom = alu.nombre || (typeof alu === 'string' ? alu : 'Estudiante Regular');
              const mail = alu.email || ('a' + cod + '@uwiener.edu.pe');
              const fol = alu.folio || ('2026.' + (11024 + idx));
              const fch = alu.fecha || lote.fechaFormato || lote.fecha;
              return `
                <tr>
                  <td class="td-folio-val">${fol}</td>
                  <td><b>${nom}</b><div class="student-cod-sub">Cód: ${cod}</div></td>
                  <td><span class="email-mono-text">${mail}</span></td>
                  <td class="date-muted-center">${fch}</td>
                  <td class="td-center-nowrap">
                    <span class="pill ok pill-emitido-sm">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Notificado
                    </span>
                  </td>
                  <td class="td-center-nowrap">
                    <button type="button" class="btn btn-ghost btn-sm btn-student-profile" onclick="APP.closeModal(); irAPerfilAlumno('${cod}')" title="Ver documentos de ${nom}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      <span>Ver alumno</span>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="audit-footer-callout">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
        <div><b>Auditoría de Registros Académicos:</b> Los documentos de este lote fueron firmados digitalmente con certificado institucional oficial y quedaron archivados en el repositorio de Registros Académicos.</div>
      </div>
    </div>

    <div class="modal-foot" style="display:flex;justify-content:space-between;align-items:center;">
      <button type="button" class="btn btn-primary" onclick="descargarReporteLote('${lote.id}')" style="display:inline-flex;align-items:center;gap:8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Descargar Reporte</span>
      </button>
      <button class="btn btn-outline" onclick="APP.closeModal()">Cerrar</button>
    </div>
  `, { wide: true });
}

// Descarga oficial del reporte de lote en formato CSV con BOM UTF-8
function descargarReporteLote(loteId) {
  const lote = DB.getLoteEmision(loteId);
  if (!lote) {
    APP.toast({ icon: 'warn', title: 'Error del sistema', body: 'Lote no encontrado para descarga.' });
    return;
  }

  const alumnos = lote.alumnosEmitidos || [];

  let csv = '\uFEFF';
  csv += '========================================================================\r\n';
  csv += 'UNIVERSIDAD PRIVADA NORBERT WIENER - REPORTE DE AUDITORÍA DE LOTE MASIVO\r\n';
  csv += 'SISTEMA DE TRÁMITES - CERTIFICACIONES DE CONOCIMIENTO\r\n';
  csv += '========================================================================\r\n\r\n';
  csv += `ID de Lote:,"${lote.id}"\r\n`;
  csv += `Programa Académico:,"${lote.programa}"\r\n`;
  csv += `Certificación de Conocimiento:,"${lote.certificacionTitulo}"\r\n`;
  csv += `Periodo Lectivo:,"${lote.periodo}"\r\n`;
  csv += `Fecha y Hora de Emisión:,"${lote.fechaFormato || lote.fecha}"\r\n`;
  csv += `Total Estudiantes Acreditados:,"${lote.totalAlumnos}"\r\n`;
  csv += `Tasa de Despacho Digital:,"${lote.tasaEntrega || '100%'}"\r\n`;
  csv += `Canal de Notificación:,"${lote.canalDespacho || 'Correo Institucional @uwiener.edu.pe'}"\r\n\r\n`;

  csv += 'FIRMANTES INSTITUCIONALES DEL WORKFLOW (3 ESTAMENTOS):\r\n';
  csv += '1. Administrativo:,"Carlos Mendoza Ríos - Jefatura Operativa de Registros Académicos (FDM-ADM-0091)"\r\n';
  csv += '2. Director:,"Dr. Miguel Angel Faustor Müller - Director de Registros y Escuela (FDM-DIR-6119)"\r\n';
  csv += '3. Decano:,"Dr. Augusto Salcedo Vílchez - Decano de la Facultad de Ingeniería y Negocios (FDM-DEC-0001)"\r\n\r\n';

  csv += 'DETALLE DE ESTUDIANTES ACREDITADOS:\r\n';
  csv += 'N° Folio/Solicitud,Código Alumno,Nombre del Estudiante,Correo Institucional,Fecha Emisión,Estado,Firmas\r\n';

  alumnos.forEach((alu, idx) => {
    const cod = alu.codigo || ('202' + (idx + 1) + '100' + (idx + 120));
    const nom = alu.nombre || (typeof alu === 'string' ? alu : 'Estudiante Regular');
    const mail = alu.email || ('a' + cod + '@uwiener.edu.pe');
    const fol = alu.folio || ('2026.' + (11024 + idx));
    const fch = alu.fecha || lote.fechaFormato || lote.fecha;
    csv += `"${fol}","${cod}","${nom}","${mail}","${fch}","Emitido con Firma Digital","3/3 (Adm, Dir, Dec)"\r\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Auditoria_${lote.id}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  APP.toast({
    icon: 'ok',
    title: 'Descarga Completada',
    body: `Reporte oficial del lote ${lote.id} descargado exitosamente.`
  });
}

// Controladores interactivos para el selector de hora personalizada en modales
function toggleCustomTime(selectVal, wrapperId, prefix) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  if (selectVal === 'custom') {
    wrapper.style.display = 'block';
    updateCustomTimePreview(prefix);
  } else {
    wrapper.style.display = 'none';
  }
}

function stepHour(inputId, delta, prefix) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  let val = parseInt(inp.value, 10);
  if (isNaN(val)) val = 21;
  val = (val + delta + 24) % 24;
  inp.value = String(val).padStart(2, '0');
  updateCustomTimePreview(prefix);
}

function stepMin(inputId, delta, prefix) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  let val = parseInt(inp.value, 10);
  if (isNaN(val)) val = 30;
  val = (val + delta + 60) % 60;
  inp.value = String(val).padStart(2, '0');
  updateCustomTimePreview(prefix);
}

function validateTimeDigits(input, max, prefix) {
  let val = parseInt(input.value, 10);
  if (isNaN(val) || val < 0) val = 0;
  if (val > max) val = max;
  input.value = String(val);
  updateCustomTimePreview(prefix);
}

function formatTimeBlur(input) {
  let val = parseInt(input.value, 10);
  if (isNaN(val)) val = 0;
  input.value = String(val).padStart(2, '0');
}

function updateCustomTimePreview(prefix) {
  const hInp = document.getElementById(prefix + '-time-h');
  const mInp = document.getElementById(prefix + '-time-m');
  const pill = document.getElementById(prefix + '-time-preview-pill');
  const container = document.getElementById(prefix + '-custom-time-wrapper');
  if (!hInp || !mInp) return;

  const h = String(parseInt(hInp.value, 10) || 0).padStart(2, '0');
  const m = String(parseInt(mInp.value, 10) || 0).padStart(2, '0');
  const curTimeStr = `${h}:${m}`;

  let hasMatch = false;
  if (container) {
    container.querySelectorAll('.wtp-preset-chip').forEach(c => {
      const match = c.textContent.trim().startsWith(curTimeStr);
      c.classList.toggle('active', match);
      if (match) hasMatch = true;
    });

    const box = container.querySelector('.wtp-time-display-box');
    if (box) {
      box.classList.toggle('custom-active', !hasMatch);
    }
  }

  if (pill) {
    pill.textContent = !hasMatch ? `${curTimeStr} hrs (Personalizada)` : `${curTimeStr} hrs`;
  }
}

function setTimePreset(prefix, timeStr) {
  const parts = timeStr.split(':');
  const h = (parts[0] || '20').padStart(2, '0');
  const m = (parts[1] || '00').padStart(2, '0');
  const hInp = document.getElementById(prefix + '-time-h');
  const mInp = document.getElementById(prefix + '-time-m');
  if (hInp) hInp.value = h;
  if (mInp) mInp.value = m;

  updateCustomTimePreview(prefix);
}

// Modal: Nueva Programación de Cierre
function abrirModalNuevaProgramacion() {
  const programas = DB.programasCertificaciones() || [];
  const certs = (DB.certificacionesProgresivas() || []).filter(c => {
    const prog = (c.programa || c.carrera || '').toLowerCase();
    return prog.includes('sistemas');
  });

  APP.openModal(`
    <div class="modal-head">
      <div class="audit-header-row">
        <div class="audit-header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div>
          <span class="audit-header-tag">Automatización de Cierre</span>
          <h3 class="audit-header-title">Nueva Programación de Emisión Masiva</h3>
        </div>
      </div>
      <button class="modal-close" onclick="APP.closeModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <p style="font-size:13px;color:#475569;margin:0 0 16px 0;line-height:1.5;">
        Configura una tarea automatizada para que el sistema evalúe a los alumnos y emita de forma gratuita las certificaciones de conocimiento en la fecha y hora exacta del cierre lectivo.
      </p>

      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-field">
          <label for="modal-prog-nombre">Nombre Identificador del Proceso / Lote</label>
          <input type="text" id="modal-prog-nombre" class="form-control" value="Cierre Académico 2026-II - Sistemas Módulo I" placeholder="Ej. Cierre Académico 2026-II...">
        </div>

        <div class="modal-form-grid-2">
          <div class="form-field">
            <label for="modal-prog-programa">Programa Académico</label>
            <div class="custom-select-container">
              <select id="modal-prog-programa">
                <option value="TODOS">Todos los programas académicos</option>
                ${programas.map(p => `
                  <option value="${p.id}" ${p.id === selectedProgramId ? 'selected' : ''}>${p.nombre}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="modal-prog-cert">Certificación de Conocimiento</label>
            <div class="custom-select-container">
              <select id="modal-prog-cert">
                <option value="TODOS">Todas las Certificaciones de Conocimiento (Todos)</option>
                ${certs.map(c => `
                  <option value="${c.id}">[${c.cicloOtorgamiento}] ${c.titulo}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="modal-form-grid-2">
          <div class="form-field">
            <label for="modal-prog-periodo">Periodo Lectivo</label>
            <div class="custom-select-container">
              <select id="modal-prog-periodo">
                <option value="2026-II" selected>2026-II (Cierre Ordinario)</option>
                <option value="2026-II-EXT">2026-II (Extemporáneo / Subsanaciones)</option>
                <option value="2027-I">2027-I</option>
              </select>
            </div>
          </div>

          <div class="modal-form-grid-2 subgrid-time">
            <div class="form-field">
              <label for="modal-prog-fecha">Fecha Programada</label>
              <div class="custom-date-container">
                <input type="date" id="modal-prog-fecha" class="form-control" value="2026-12-15">
              </div>
            </div>
            <div class="form-field">
              <label for="modal-prog-hora">Hora de Cierre</label>
              <div class="custom-select-container">
                <select id="modal-prog-hora" onchange="toggleCustomTime(this.value, 'modal-custom-time-wrapper', 'modal')">
                  <option value="23:59" selected>23:59 hrs (Fin de día)</option>
                  <option value="18:00">18:00 hrs (Tarde)</option>
                  <option value="12:00">12:00 hrs (Mediodía)</option>
                  <option value="08:00">08:00 hrs (Mañana)</option>
                  <option value="custom">Hora personalizada...</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Personalizado de Hora Desplegable -->
        <div id="modal-custom-time-wrapper" class="wiener-time-picker-panel" style="display:none;">
          <div class="wtp-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style="font-size:12px;font-weight:700;color:#0F172A;text-transform:uppercase;letter-spacing:0.03em;">Configurar Hora Exacta de Cierre</span>
            </div>
            <span class="pill ok" style="font-size:11px;font-weight:700;padding:2px 10px;" id="modal-time-preview-pill">21:30 hrs</span>
          </div>

          <div class="wtp-body">
            <div class="wtp-time-display-box">
              <div class="wtp-unit-col">
                <span class="wtp-unit-lbl">Hora (00 - 23)</span>
                <div class="wtp-stepper-wrap">
                  <button type="button" class="wtp-step-btn" onclick="stepHour('modal-time-h', 1, 'modal')" title="Sumar hora">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <input type="number" id="modal-time-h" class="wtp-digit-input" min="0" max="23" value="21" oninput="validateTimeDigits(this, 23, 'modal');" onblur="formatTimeBlur(this); updateCustomTimePreview('modal');">
                  <button type="button" class="wtp-step-btn" onclick="stepHour('modal-time-h', -1, 'modal')" title="Restar hora">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>

              <div class="wtp-colon">:</div>

              <div class="wtp-unit-col">
                <span class="wtp-unit-lbl">Minutos (00 - 59)</span>
                <div class="wtp-stepper-wrap">
                  <button type="button" class="wtp-step-btn" onclick="stepMin('modal-time-m', 5, 'modal')" title="Sumar 5 minutos">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <input type="number" id="modal-time-m" class="wtp-digit-input" min="0" max="59" value="30" oninput="validateTimeDigits(this, 59, 'modal');" onblur="formatTimeBlur(this); updateCustomTimePreview('modal');">
                  <button type="button" class="wtp-step-btn" onclick="stepMin('modal-time-m', -5, 'modal')" title="Restar 5 minutos">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="wtp-presets-col">
              <div class="wtp-presets-title">Horarios Frecuentes de Cierre:</div>
              <div class="wtp-presets-chips">
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '20:00')">20:00 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '21:30')">21:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '22:00')">22:00 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '22:30')">22:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '23:30')">23:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('modal', '23:45')">23:45 hrs</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rule-checkbox-box" style="margin:6px 0;">
          <div class="rule-checkbox-title">Reglas del Sistema a Validar Automáticamente</div>
          <div class="rule-chips-row">
            <label class="rule-chip-label">
              <input type="checkbox" id="modal-prog-chk-nota" checked>
              <span><b>Regla 1:</b> Nota mínima ≥ 14.00</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="modal-prog-chk-deuda" checked>
              <span><b>Regla 2:</b> Sin Deuda (S/ 0.00)</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="modal-prog-chk-dup" checked>
              <span><b>Regla 3:</b> No duplicidad</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="modal-prog-chk-mail" checked>
              <span>Despacho a @uwiener.edu.pe</span>
            </label>
          </div>
        </div>

        <div class="form-field">
          <label for="modal-prog-obs">Observación / Nota Interna (Opcional)</label>
          <input type="text" id="modal-prog-obs" class="form-control" placeholder="Ej. Emisión programada de cierre regular tras consolidación de actas...">
        </div>
      </div>
    </div>

    <div class="modal-foot">
      <button class="btn btn-outline" onclick="APP.closeModal()">Cancelar</button>
      <button class="btn btn-primary btn-action-icon" onclick="guardarNuevaProgramacion()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        <span>Guardar y Activar Programación</span>
      </button>
    </div>
  `, { wide: true });

  setTimeout(() => {
    const modalHost = document.getElementById('modal-host');
    if (modalHost) hydrateInteractiveControls(modalHost);
    updateCustomTimePreview('modal');
  }, 30);
}

function guardarNuevaProgramacion() {
  const nombre = document.getElementById('modal-prog-nombre').value.trim();
  const progId = document.getElementById('modal-prog-programa').value;
  const certId = document.getElementById('modal-prog-cert').value;
  const periodo = document.getElementById('modal-prog-periodo').value;
  const fecha = document.getElementById('modal-prog-fecha').value;
  const selHora = (document.getElementById('modal-prog-hora') && document.getElementById('modal-prog-hora').value) || '23:59';
  let hora = selHora;
  if (selHora === 'custom') {
    const h = String(parseInt(document.getElementById('modal-time-h').value, 10) || 0).padStart(2, '0');
    const m = String(parseInt(document.getElementById('modal-time-m').value, 10) || 0).padStart(2, '0');
    hora = `${h}:${m}`;
  }
  const obs = document.getElementById('modal-prog-obs').value.trim();

  const chkNota = document.getElementById('modal-prog-chk-nota').checked;
  const chkDeuda = document.getElementById('modal-prog-chk-deuda').checked;
  const chkDup = document.getElementById('modal-prog-chk-dup').checked;
  const chkMail = document.getElementById('modal-prog-chk-mail') ? document.getElementById('modal-prog-chk-mail').checked : true;

  if (!nombre) {
    APP.toast({ icon: 'warn', title: 'Campo obligatorio', body: 'Ingresa un nombre para la programación.' });
    return;
  }
  if (!fecha) {
    APP.toast({ icon: 'warn', title: 'Campo obligatorio', body: 'Selecciona la fecha de ejecución programada.' });
    return;
  }

  const certObj = DB.getCertificacion(certId);
  const progObj = (DB.programasCertificaciones() || []).find(p => p.id === progId);
  const fechaCompleta = fecha + 'T' + hora;

  DB.programarEmisionMasiva({
    nombre: nombre,
    programaId: progId,
    programaNombre: progObj ? progObj.nombre : (progId === 'TODOS' ? 'Todos los programas académicos' : 'Ingeniería de Sistemas e Informática'),
    certificacionId: certId,
    certificacionTitulo: certObj ? certObj.titulo : 'Todas las Certificaciones de Conocimiento',
    cicloOtorgamiento: certObj ? certObj.cicloOtorgamiento : 'Todos los ciclos',
    periodo: periodo,
    fechaEjecucion: fechaCompleta,
    alumnosEstimados: 40,
    reglas: {
      notaMinima: chkNota ? 14.0 : 11.0,
      exigirSinDeuda: chkDeuda,
      omitirYaEmitidos: chkDup,
      despachoCorreo: chkMail
    },
    observacion: obs || 'Programación automática por cierre de periodo lectivo.'
  });

  APP.closeModal();
  APP.toast({ icon: 'ok', title: 'Programación registrada', body: 'La tarea masiva se incorporó activamente al cronograma institucional.' });
  setMainTab('programacion');
}

// Modal: Editar Programación existente
function abrirModalEditarProgramacion(progId) {
  const progs = DB.programacionesEmision() || [];
  const item = progs.find(p => p.id === progId);
  if (!item) {
    APP.toast({ icon: 'warn', title: 'Aviso del sistema', body: 'Programación no encontrada' });
    return;
  }

  const programas = DB.programasCertificaciones() || [];
  const certs = (DB.certificacionesProgresivas() || []).filter(c => {
    const prog = (c.programa || c.carrera || '').toLowerCase();
    return prog.includes('sistemas');
  });

  const parts = (item.fechaEjecucion || '2026-12-15T23:59').split('T');
  const curDate = parts[0] || '2026-12-15';
  const curHour = parts[1] || '23:59';

  const standardHours = ['23:59', '18:00', '12:00', '08:00'];
  const isCustomHour = !standardHours.includes(curHour);
  const customH = (curHour.split(':')[0] || '21').padStart(2, '0');
  const customM = (curHour.split(':')[1] || '30').padStart(2, '0');

  APP.openModal(`
    <div class="modal-head">
      <div class="audit-header-row">
        <div style="width:40px;height:40px;border-radius:8px;background:#1E293B;color:#FFFFFF;display:flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
          </svg>
        </div>
        <div>
          <span class="audit-header-tag">Modificar Automatización</span>
          <h3 class="audit-header-title">Editar Programación · ${item.id}</h3>
        </div>
      </div>
      <button class="modal-close" onclick="APP.closeModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-field">
          <label for="edit-prog-nombre">Nombre Identificador</label>
          <input type="text" id="edit-prog-nombre" class="form-control" value="${item.nombre}">
        </div>

        <div class="modal-form-grid-2">
          <div class="form-field">
            <label for="edit-prog-programa">Programa Académico</label>
            <div class="custom-select-container">
              <select id="edit-prog-programa">
                <option value="TODOS" ${item.programaId === 'TODOS' ? 'selected' : ''}>Todos los programas académicos</option>
                ${programas.map(p => `
                  <option value="${p.id}" ${p.id === item.programaId ? 'selected' : ''}>${p.nombre}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="edit-prog-cert">Certificación de Conocimiento Objetivo</label>
            <div class="custom-select-container">
              <select id="edit-prog-cert">
                <option value="TODOS" ${item.certificacionId === 'TODOS' || item.certificacionId === 'TODAS' ? 'selected' : ''}>Todas las Certificaciones de Conocimiento (Todos)</option>
                ${certs.map(c => `
                  <option value="${c.id}" ${c.id === item.certificacionId ? 'selected' : ''}>[${c.cicloOtorgamiento}] ${c.titulo}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="modal-form-grid-2">
          <div class="form-field">
            <label for="edit-prog-periodo">Periodo Lectivo</label>
            <div class="custom-select-container">
              <select id="edit-prog-periodo">
                <option value="2026-II" ${item.periodo === '2026-II' ? 'selected' : ''}>2026-II (Cierre Ordinario)</option>
                <option value="2026-II-EXT" ${item.periodo === '2026-II-EXT' ? 'selected' : ''}>2026-II (Extemporáneo / Subsanaciones)</option>
                <option value="2027-I" ${item.periodo === '2027-I' ? 'selected' : ''}>2027-I</option>
              </select>
            </div>
          </div>

          <div class="modal-form-grid-2 subgrid-time">
            <div class="form-field">
              <label for="edit-prog-fecha">Fecha Programada</label>
              <div class="custom-date-container">
                <input type="date" id="edit-prog-fecha" class="form-control" value="${curDate}">
              </div>
            </div>
            <div class="form-field">
              <label for="edit-prog-hora">Hora de Cierre</label>
              <div class="custom-select-container">
                <select id="edit-prog-hora" onchange="toggleCustomTime(this.value, 'edit-custom-time-wrapper', 'edit')">
                  <option value="23:59" ${curHour === '23:59' ? 'selected' : ''}>23:59 hrs (Fin de día)</option>
                  <option value="18:00" ${curHour === '18:00' ? 'selected' : ''}>18:00 hrs (Tarde)</option>
                  <option value="12:00" ${curHour === '12:00' ? 'selected' : ''}>12:00 hrs (Mediodía)</option>
                  <option value="08:00" ${curHour === '08:00' ? 'selected' : ''}>08:00 hrs (Mañana)</option>
                  <option value="custom" ${isCustomHour ? 'selected' : ''}>${isCustomHour ? `Hora personalizada (${curHour} hrs)` : 'Hora personalizada...'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Personalizado de Hora Desplegable -->
        <div id="edit-custom-time-wrapper" class="wiener-time-picker-panel" style="display:${isCustomHour ? 'block' : 'none'};">
          <div class="wtp-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style="font-size:12px;font-weight:700;color:#0F172A;text-transform:uppercase;letter-spacing:0.03em;">Configurar Hora Exacta de Cierre</span>
            </div>
            <span class="pill ok" style="font-size:11px;font-weight:700;padding:2px 10px;" id="edit-time-preview-pill">${curHour} hrs</span>
          </div>

          <div class="wtp-body">
            <div class="wtp-time-display-box">
              <div class="wtp-unit-col">
                <span class="wtp-unit-lbl">Hora (00 - 23)</span>
                <div class="wtp-stepper-wrap">
                  <button type="button" class="wtp-step-btn" onclick="stepHour('edit-time-h', 1, 'edit')" title="Sumar hora">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <input type="number" id="edit-time-h" class="wtp-digit-input" min="0" max="23" value="${customH}" oninput="validateTimeDigits(this, 23, 'edit');" onblur="formatTimeBlur(this); updateCustomTimePreview('edit');">
                  <button type="button" class="wtp-step-btn" onclick="stepHour('edit-time-h', -1, 'edit')" title="Restar hora">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>

              <div class="wtp-colon">:</div>

              <div class="wtp-unit-col">
                <span class="wtp-unit-lbl">Minutos (00 - 59)</span>
                <div class="wtp-stepper-wrap">
                  <button type="button" class="wtp-step-btn" onclick="stepMin('edit-time-m', 5, 'edit')" title="Sumar 5 minutos">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <input type="number" id="edit-time-m" class="wtp-digit-input" min="0" max="59" value="${customM}" oninput="validateTimeDigits(this, 59, 'edit');" onblur="formatTimeBlur(this); updateCustomTimePreview('edit');">
                  <button type="button" class="wtp-step-btn" onclick="stepMin('edit-time-m', -5, 'edit')" title="Restar 5 minutos">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="wtp-presets-col">
              <div class="wtp-presets-title">Horarios Frecuentes de Cierre:</div>
              <div class="wtp-presets-chips">
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '20:00')">20:00 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '21:30')">21:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '22:00')">22:00 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '22:30')">22:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '23:30')">23:30 hrs</button>
                <button type="button" class="wtp-preset-chip" onclick="setTimePreset('edit', '23:45')">23:45 hrs</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rule-checkbox-box" style="margin:6px 0;">
          <div class="rule-checkbox-title">Reglas del Sistema a Validar</div>
          <div class="rule-chips-row">
            <label class="rule-chip-label">
              <input type="checkbox" id="edit-prog-chk-nota" ${item.reglas?.notaMinima >= 14 ? 'checked' : ''}>
              <span><b>Regla 1:</b> Nota mínima ≥ 14.00</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="edit-prog-chk-deuda" ${item.reglas?.exigirSinDeuda !== false ? 'checked' : ''}>
              <span><b>Regla 2:</b> Sin Deuda (S/ 0.00)</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="edit-prog-chk-dup" ${item.reglas?.omitirYaEmitidos !== false ? 'checked' : ''}>
              <span><b>Regla 3:</b> No duplicidad</span>
            </label>
            <label class="rule-chip-label">
              <input type="checkbox" id="edit-prog-chk-mail" ${item.reglas?.despachoCorreo !== false ? 'checked' : ''}>
              <span>Despacho a @uwiener.edu.pe</span>
            </label>
          </div>
        </div>

        <div class="form-field">
          <label for="edit-prog-obs">Observación / Nota Interna</label>
          <input type="text" id="edit-prog-obs" class="form-control" value="${item.observacion || ''}">
        </div>
      </div>
    </div>

    <div class="modal-foot">
      <button class="btn btn-outline" onclick="APP.closeModal()">Cancelar</button>
      <button class="btn btn-primary btn-action-icon" onclick="guardarEdicionProgramacion('${item.id}')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Guardar Cambios</span>
      </button>
    </div>
  `, { wide: true });

  setTimeout(() => {
    const modalHost = document.getElementById('modal-host');
    if (modalHost) hydrateInteractiveControls(modalHost);
    updateCustomTimePreview('edit');
  }, 30);
}

function guardarEdicionProgramacion(id) {
  const nombre = document.getElementById('edit-prog-nombre').value.trim();
  const progId = document.getElementById('edit-prog-programa').value;
  const certId = document.getElementById('edit-prog-cert').value;
  const periodo = document.getElementById('edit-prog-periodo').value;
  const fecha = document.getElementById('edit-prog-fecha').value;
  const selHora = (document.getElementById('edit-prog-hora') && document.getElementById('edit-prog-hora').value) || '23:59';
  let hora = selHora;
  if (selHora === 'custom') {
    const h = String(parseInt(document.getElementById('edit-time-h').value, 10) || 0).padStart(2, '0');
    const m = String(parseInt(document.getElementById('edit-time-m').value, 10) || 0).padStart(2, '0');
    hora = `${h}:${m}`;
  }
  const obs = document.getElementById('edit-prog-obs').value.trim();

  const chkNota = document.getElementById('edit-prog-chk-nota').checked;
  const chkDeuda = document.getElementById('edit-prog-chk-deuda').checked;
  const chkDup = document.getElementById('edit-prog-chk-dup').checked;
  const chkMail = document.getElementById('edit-prog-chk-mail') ? document.getElementById('edit-prog-chk-mail').checked : true;

  const certObj = DB.getCertificacion(certId);
  const progObj = (DB.programasCertificaciones() || []).find(p => p.id === progId);
  const fechaCompleta = fecha + 'T' + hora;

  DB.actualizarProgramacionEmision(id, {
    nombre: nombre,
    programaId: progId,
    programaNombre: progObj ? progObj.nombre : (progId === 'TODOS' ? 'Todos los programas académicos' : 'Ingeniería de Sistemas e Informática'),
    certificacionId: certId,
    certificacionTitulo: certObj ? certObj.titulo : 'Todas las Certificaciones de Conocimiento',
    cicloOtorgamiento: certObj ? certObj.cicloOtorgamiento : 'Todos los ciclos',
    periodo: periodo,
    fechaEjecucion: fechaCompleta,
    reglas: {
      notaMinima: chkNota ? 14.0 : 11.0,
      exigirSinDeuda: chkDeuda,
      omitirYaEmitidos: chkDup,
      despachoCorreo: chkMail
    },
    observacion: obs
  });

  APP.closeModal();
  APP.toast({ icon: 'ok', title: 'Programación actualizada', body: 'Los cambios fueron guardados exitosamente.' });
  renderPage();
}

function eliminarProgramacion(id) {
  if (confirm('¿Estás seguro de eliminar esta programación de cierre?')) {
    DB.eliminarProgramacionEmision(id);
    APP.toast({ icon: 'ok', title: 'Programación eliminada', body: 'La tarea masiva fue retirada del cronograma.' });
    renderPage();
  }
}

function togglePausa(id) {
  const res = DB.togglePausaProgramacion(id);
  if (res) {
    const estadoTxt = res.estado === 'Pausado' ? 'pausada temporalmente' : 'reactivada con éxito';
    APP.toast({ icon: 'ok', title: 'Estado actualizado', body: `La programación fue ${estadoTxt}.` });
    renderPage();
  }
}

// Ejecución Masiva Interactiva con Animación y Cierre de Flujo
function ejecutarEmisionMasiva(targetCertId = null) {
  const certId = targetCertId || selectedCertId;
  const cert = DB.getCertificacion(certId);
  if (!cert) return;

  const evalData = DB.evaluarAlumnosCertificacion(cert.id, {
    notaMinima: configNotaMin,
    exigirSinDeuda: configExigirSinDeuda,
    omitirYaEmitidos: configOmitirYaEmitidos,
    modalidad: selectedModalidad,
    ciclo: selectedCiclo
  });

  const targets = evalData.filter(e => e.apto);

  APP.openModal(`
    <div class="modal-head">
      <div class="audit-header-row">
        <div class="audit-header-icon">
          ${getSvgExecIcon(22, '#FFFFFF')}
        </div>
        <div>
          <span class="audit-header-tag">Motor de Emisión Masiva Institucional</span>
          <h3 class="audit-header-title">Ejecutando Lote Automatizado</h3>
        </div>
      </div>
    </div>

    <div class="modal-body" id="modal-sim-body">
      <p style="font-size:13.5px;color:#475569;margin:0 0 14px 0;line-height:1.5;">
        Procesando emisión gratuita de <b>${cert.titulo}</b> para estudiantes regulares con cumplimiento integral de requisitos.
      </p>

      <div class="progress-track">
        <div class="progress-fill" id="sim-progress-bar"></div>
      </div>

      <div class="sim-stepper">
        <div class="sim-step-item active" id="sim-step-1">
          <div class="sim-step-circle">1</div>
          <div>Validando asignaturas aprobadas con nota mínima de <b>${configNotaMin.toFixed(2)}</b>...</div>
        </div>
        <div class="sim-step-item" id="sim-step-2">
          <div class="sim-step-circle">2</div>
          <div>Verificando solvencia económica y condición de <b>No Deuda (S/ 0.00)</b>...</div>
        </div>
        <div class="sim-step-item" id="sim-step-3">
          <div class="sim-step-circle">3</div>
          <div>Comprobando regla de <b>no duplicidad</b> de certificaciones previamente emitidas...</div>
        </div>
        <div class="sim-step-item" id="sim-step-4">
          <div class="sim-step-circle">4</div>
          <div>Generando documentos digitales oficiales con las firmas refrendadas de <b>Administrativo, Director y Decano</b>...</div>
        </div>
        <div class="sim-step-item" id="sim-step-5">
          <div class="sim-step-circle">5</div>
          <div>Despachando notificaciones automáticas y constancias a correos institucionales (<b>@uwiener.edu.pe</b>)...</div>
        </div>
      </div>
    </div>
  `, { wide: false });

  const progressBar = document.getElementById('sim-progress-bar');
  const step1 = document.getElementById('sim-step-1');
  const step2 = document.getElementById('sim-step-2');
  const step3 = document.getElementById('sim-step-3');
  const step4 = document.getElementById('sim-step-4');
  const step5 = document.getElementById('sim-step-5');

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '25%';
    if (step1) { step1.classList.remove('active'); step1.classList.add('done'); }
    if (step2) step2.classList.add('active');
  }, 700);

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '50%';
    if (step2) { step2.classList.remove('active'); step2.classList.add('done'); }
    if (step3) step3.classList.add('active');
  }, 1400);

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '75%';
    if (step3) { step3.classList.remove('active'); step3.classList.add('done'); }
    if (step4) step4.classList.add('active');
  }, 2100);

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '95%';
    if (step4) { step4.classList.remove('active'); step4.classList.add('done'); }
    if (step5) step5.classList.add('active');

    // Preparar firmas refrendadas de los 3 estamentos
    const nowStr = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    workflowFirmas.administrativo.aprobado = true;
    workflowFirmas.director.aprobado = true;
    workflowFirmas.decano.aprobado = true;
    if (!workflowFirmas.decano.fecha) workflowFirmas.decano.fecha = nowStr;

    const firmasLote = [
      { orden: 1, rol: 'Administrativo', nombre: workflowFirmas.administrativo.usuario, cargo: workflowFirmas.administrativo.cargo, fecha: workflowFirmas.administrativo.fecha || nowStr, firmaId: workflowFirmas.administrativo.firmaId },
      { orden: 2, rol: 'Director', nombre: workflowFirmas.director.usuario, cargo: workflowFirmas.director.cargo, fecha: workflowFirmas.director.fecha || nowStr, firmaId: workflowFirmas.director.firmaId },
      { orden: 3, rol: 'Decano', nombre: workflowFirmas.decano.usuario, cargo: workflowFirmas.decano.cargo, fecha: workflowFirmas.decano.fecha || nowStr, firmaId: workflowFirmas.decano.firmaId }
    ];

    // Ejecución real en base de datos
    const alumnoIdsList = targets.map(t => t.alumnoId);
    const resultado = DB.emitirCertificacionesMasivas(alumnoIdsList, cert.id, {
      periodo: selectedPeriodo,
      notaMinima: configNotaMin,
      exigirSinDeuda: configExigirSinDeuda,
      omitirYaEmitidos: configOmitirYaEmitidos,
      firmas: firmasLote
    });

    // Enviar correos institucionales simulados
    resultado.emitidos.forEach(item => {
      APP.sendMail({
        to: item.alumnoEmail,
        subject: `Emisión Oficial de Certificación de Conocimiento - ${cert.titulo}`,
        lines: [
          `Estimado(a) estudiante ${item.alumnoNombre}:`,
          `Nos complace informarte que, al haber culminado el módulo correspondiente con nota mínima aprobatoria y encontrándote al día en tus obligaciones económicas al cierre del periodo ${selectedPeriodo}, se ha emitido tu "${cert.titulo}" con firma digital refrendada por Administrativo, Director y Decano.`,
          `Puedes acceder de manera gratuita a tu documento oficial desde tu intranet en la sección "Mis documentos" para su descarga e impresión con valor oficial.`,
          `Atentamente,<br>Dirección de Registros y Asuntos Académicos<br>Universidad Norbert Wiener`
        ],
        cc: 'registros.academicos@uwiener.edu.pe'
      });
    });

    window._ultimoLoteGenerado = resultado;
  }, 2800);

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '100%';
    if (step5) { step5.classList.remove('active'); step5.classList.add('done'); }

    const res = window._ultimoLoteGenerado;
    const total = res ? res.total : targets.length;
    const loteId = res ? res.loteId : 'LOTE-2026-II-01';

    const modalBody = document.getElementById('modal-sim-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="text-align:center;padding:12px 0;">
          <div style="width:58px;height:58px;border-radius:50%;background:#DCFCE7;color:#16A34A;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-family:'Lato',sans-serif;font-size:20px;font-weight:900;color:#0F172A;margin:0 0 8px 0;">
            ¡Lote de Emisión Masiva Completado!
          </h3>
          <p style="font-size:14px;color:#475569;margin:0 0 18px 0;line-height:1.5;">
            Se ha generado el lote <b>${loteId}</b> con <b>${total} Certificación(es) de Conocimiento</b> refrendadas digitalmente por Administrativo, Director y Decano y notificadas a los correos institucionales correspondientes.
          </p>

          <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:8px;padding:14px;text-align:left;font-size:13px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-weight:700;color:#0F848F;">Estudiantes acreditados en este lote:</span>
              <span class="pill ok" style="font-size:11px;display:inline-flex;align-items:center;gap:4px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                100% Notificado
              </span>
            </div>
            ${targets.length > 0 ? targets.map(t => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #E2E8F0;font-size:12.5px;">
                <span><b>${t.codigo}</b> - ${t.nombre}</span>
                <span style="color:#16A34A;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Notificado a ${t.email}
                </span>
              </div>
            `).join('') : `
              <div style="color:#64748B;font-size:12.5px;padding:4px 0;">
                Lote registrado en el histórico institucional.
              </div>
            `}
          </div>

          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" onclick="APP.closeModal(); irAPerfilAlumno('2021100345');" style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Ver en perfil Alumno (Mis documentos)</span>
            </button>
            <button class="btn btn-outline" onclick="APP.closeModal(); renderPage();">
              Ver en Histórico de Lotes
            </button>
          </div>
        </div>
      `;
    }
  }, 3600);
}

// Ejecutar tarea programada de forma anticipada
function ejecutarProgramacionAhora(id) {
  if (confirm('¿Deseas adelantar la ejecución de esta programación masiva ahora mismo?')) {
    const item = (DB.programacionesEmision() || []).find(p => p.id === id);
    const certId = item ? (item.certificacionId === 'TODAS' ? 'CP-ISI-01' : item.certificacionId) : selectedCertId;
    ejecutarEmisionMasiva(certId);
  }
}

// Reinicio de datos de simulación
function reiniciarDataDemo() {
  if (confirm('¿Deseas reiniciar la data de prueba de emisión de certificaciones para volver a realizar la demostración completa?')) {
    DB.resetCertificaciones();
    APP.toast({ icon: 'ok', title: 'Data restablecida', body: 'Data de prueba de certificaciones reiniciada a valores base.' });
    renderPage();
  }
}

// --------------------------------------------------------------------------
// CINTILLO Y WORKFLOW DE FIRMAS OFICIALES EN CERTIFICACIONES (REUTILIZADO DE INICIO)
// --------------------------------------------------------------------------
function getActorWorkflowCertificaciones(user) {
  if (!user) return 'administrativo';
  const subrol = (user.subrol || '').toLowerCase();
  const rol = (user.rol || '').toLowerCase();
  const cargo = (user.cargo || '').toLowerCase();

  if (subrol === 'decano' || cargo.includes('decano')) return 'decano';
  if (rol === 'director' || subrol === 'director' || cargo.includes('director')) return 'director';
  return 'administrativo';
}

function renderCintilloWorkflowCertificaciones() {
  const container = document.getElementById('certificaciones-cintillo-slot');
  if (!container) return;

  const session = APP.getSession() || {};
  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;
  const actor = getActorWorkflowCertificaciones(user);

  if (!actor) {
    container.innerHTML = '';
    return;
  }

  const wf = DB.workflowFirmas();
  const admOk = !!wf.administrativo?.aprobado;
  const dirOk = !!wf.director?.aprobado;
  const decOk = !!wf.decano?.aprobado;
  const allOk = admOk && dirOk && decOk;

  const currentTurno = !admOk ? 'administrativo' : (!dirOk ? 'director' : (!decOk ? 'decano' : 'completado'));
  const esMiTurno = (actor === currentTurno);

  const cargoMap = {
    administrativo: 'Jefatura Operativa de Registros Académicos',
    director: 'Director de Registros y Asuntos Académicos',
    decano: 'Decano de la Facultad de Ingeniería y Negocios'
  };

  const pasoEsperado = !admOk ? 'Administrativo' : 'Director de Registros';

  const svgCheck = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const svgActive = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  const svgWait = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;
  const svgArrow = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

  container.innerHTML = `
    <div class="home-cintillo-card ${esMiTurno ? 'is-urgent' : (allOk ? 'is-complete' : '')}">
      <div class="home-cintillo-left">
        <!-- Radar Pulse Indicator animado en loop -->
        <div class="cintillo-radar-pulse" title="Atención Prioritaria en Vivo">
          <span class="crp-ring"></span>
          <span class="crp-dot"></span>
        </div>
        <div class="home-cintillo-icon" title="Tarea de Refrendo Oficial Pendiente">
          <!-- Icono de Task Pendiente con check y acción CTA -->
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="m9 14 2 2 4-4"></path>
          </svg>
        </div>
        <div class="home-cintillo-info">
          <div class="home-cintillo-title">
            <span class="cintillo-title-main">Refrendo Oficial: Certificaciones de Conocimiento</span>
            <span class="cintillo-title-lot-wrap">
              <span class="cintillo-title-lot">(Lote 2026-II)</span>
              ${esMiTurno ? '<span class="cintillo-urgent-pill">Firma Requerida</span>' : (allOk ? '<span class="cintillo-ok-pill">100% Emitido</span>' : '')}
            </span>
          </div>
          <div class="home-cintillo-sub">
            ${allOk
              ? 'Lote completado con las 3 firmas refrendadas (Administrativo, Director y Decano). 42 diplomas emitidos.'
              : (esMiTurno
                ? `Su firma digital como <b>${cargoMap[actor]}</b> es requerida para refrendar el lote de 42 estudiantes aptos.`
                : `En espera del refrendo de <b>${pasoEsperado}</b> para continuar el flujo secuencial oficial.`
              )
            }
          </div>
        </div>
      </div>

      <div class="home-cintillo-right">
        <div class="home-cintillo-stepper">
          <div class="hc-step ${admOk ? 'done' : (currentTurno === 'administrativo' ? 'active' : '')}">
            <span class="hc-step-icon">${admOk ? svgCheck : (currentTurno === 'administrativo' ? svgActive : svgWait)}</span>
            <span>1. Administrativo</span>
          </div>
          <span class="hc-step-sep">${svgArrow}</span>
          <div class="hc-step ${dirOk ? 'done' : (currentTurno === 'director' ? 'active' : '')}">
            <span class="hc-step-icon">${dirOk ? svgCheck : (currentTurno === 'director' ? svgActive : svgWait)}</span>
            <span>2. Director</span>
          </div>
          <span class="hc-step-sep">${svgArrow}</span>
          <div class="hc-step ${decOk ? 'done' : (currentTurno === 'decano' ? 'active' : '')}">
            <span class="hc-step-icon">${decOk ? svgCheck : (currentTurno === 'decano' ? svgActive : svgWait)}</span>
            <span>3. Decano</span>
          </div>
        </div>

        <div class="home-cintillo-actions">
          ${esMiTurno ? `
            <button type="button" class="btn btn-primary btn-cintillo-cta" onclick="abrirModalRefrendoCertificaciones('${actor}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Aprobar y Firmar</span>
            </button>
          ` : (allOk ? `
            <button type="button" class="btn btn-outline btn-cintillo-cta" onclick="abrirModalRefrendoCertificaciones('${actor}')">
              <span>Ver Firmas</span>
            </button>
          ` : `
            <button type="button" class="btn btn-outline btn-cintillo-cta" onclick="abrirModalRefrendoCertificaciones('${actor}')">
              <span>Ver Estado</span>
            </button>
          `)}
        </div>
      </div>
    </div>
  `;
}

function abrirModalRefrendoCertificaciones(rolParam) {
  const session = APP.getSession() || {};
  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;
  let rol = rolParam || getActorWorkflowCertificaciones(user) || 'director';

  const wf = DB.workflowFirmas();
  const admOk = !!wf.administrativo?.aprobado;
  const dirOk = !!wf.director?.aprobado;
  const decOk = !!wf.decano?.aprobado;
  const currentTurno = !admOk ? 'administrativo' : (!dirOk ? 'director' : (!decOk ? 'decano' : 'completado'));
  const esMiTurno = (rol === currentTurno);
  const yaFirme = (rol === 'administrativo' && admOk) || (rol === 'director' && dirOk) || (rol === 'decano' && decOk);

  const cargoMap = {
    administrativo: 'Jefatura Operativa de Registros Académicos',
    director: 'Director de Registros y Asuntos Académicos',
    decano: 'Decano de la Facultad de Ingeniería y Negocios'
  };

  APP.openModal(`
    <div class="modal-head">
      <div class="modal-refrendo-header">
        <div class="modal-refrendo-icon" title="Tarea de Refrendo Oficial Pendiente">
          <!-- Icono de Task Pendiente Oficial -->
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="m9 14 2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <span style="font-size:11px;font-weight:700;color:#0F848F;text-transform:uppercase;letter-spacing:0.04em;">Aprobación Oficial y Refrendo Digital</span>
          <h3 style="font-family:'Lato',sans-serif;font-size:16.5px;font-weight:700;color:#0F172A;margin:2px 0 0 0;">
            Certificaciones de Conocimiento · Periodo 2026-II
          </h3>
        </div>
      </div>
      <button class="modal-close" onclick="APP.closeModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- Barra de simulación interactiva para demo de los 3 usuarios -->
      <div class="modal-refrendo-sim-bar">
        <span style="font-size:11.5px;color:#475569;font-weight:600;">Simular ingreso / firma como:</span>
        <div class="modal-refrendo-sim-btns">
          <button type="button" class="btn btn-sm ${rol === 'administrativo' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoCertificaciones('administrativo')" style="padding:3px 10px;font-size:11.5px;">Administrativo</button>
          <button type="button" class="btn btn-sm ${rol === 'director' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoCertificaciones('director')" style="padding:3px 10px;font-size:11.5px;">Director</button>
          <button type="button" class="btn btn-sm ${rol === 'decano' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoCertificaciones('decano')" style="padding:3px 10px;font-size:11.5px;">Decano</button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="reiniciarWorkflowDesdeCertificaciones()" title="Reiniciar demostración" style="padding:3px 8px;font-size:11px;color:#64748B;">Reiniciar</button>
        </div>
      </div>

      <!-- Resumen Ejecutivo del Lote -->
      <div class="modal-refrendo-summary-grid">
        <div class="modal-refrendo-summary-card">
          <div class="modal-refrendo-summary-lbl">Estudiantes Aptos</div>
          <div class="modal-refrendo-summary-val" style="color:#0F848F;">42 egresados</div>
        </div>
        <div class="modal-refrendo-summary-card">
          <div class="modal-refrendo-summary-lbl">Arancel / Costo</div>
          <div class="modal-refrendo-summary-val" style="color:#166534;">S/ 0.00 (Gratuito)</div>
        </div>
        <div class="modal-refrendo-summary-card">
          <div class="modal-refrendo-summary-lbl">Periodo Lectivo</div>
          <div class="modal-refrendo-summary-val">2026-II (Ordinario)</div>
        </div>
        <div class="modal-refrendo-summary-card">
          <div class="modal-refrendo-summary-lbl">Programa Académico</div>
          <div class="modal-refrendo-summary-val" style="font-size:12.5px;">Ing. de Sistemas</div>
        </div>
      </div>

      <!-- Stepper de 3 actores -->
      <div style="font-size:12px;font-weight:700;color:#0F172A;margin:12px 0 6px 0;">Flujo Secuencial de Refrendos Oficiales:</div>
      <div class="modal-refrendo-stepper">
        <!-- Paso 1 -->
        <div class="modal-refrendo-step-box ${admOk ? 'done' : (currentTurno === 'administrativo' ? 'active' : 'locked')}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;font-weight:700;color:#64748B;">PASO 1 · OPERADOR</span>
            <span class="pill ${admOk ? 'ok' : 'info'}" style="font-size:10px;">${admOk ? 'Refrendado' : 'Pendiente'}</span>
          </div>
          <div>
            <div style="font-size:12.5px;font-weight:700;color:#0F172A;">Carlos Mendoza Ríos</div>
            <div style="font-size:10.5px;color:#64748B;">Jefatura Operativa de Registros</div>
          </div>
          ${admOk ? `
            <div style="font-size:10px;color:#166534;background:#DCFCE7;padding:5px 8px;border-radius:4px;line-height:1.4;">
              <b>Firma Digital Registrada</b><br>Refrendado el ${wf.administrativo.fecha} · ID: ${wf.administrativo.firmaId}
            </div>
          ` : `
            <div style="font-size:10.5px;color:#64748B;">Esperando validación de registros</div>
          `}
        </div>

        <!-- Paso 2 -->
        <div class="modal-refrendo-step-box ${dirOk ? 'done' : (currentTurno === 'director' ? 'active' : 'locked')}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;font-weight:700;color:#64748B;">PASO 2 · DIRECCIÓN</span>
            <span class="pill ${dirOk ? 'ok' : (currentTurno === 'director' ? 'warn' : 'gray')}" style="font-size:10px;">${dirOk ? 'Refrendado' : (admOk ? 'Tu Turno' : 'En Espera')}</span>
          </div>
          <div>
            <div style="font-size:12.5px;font-weight:700;color:#0F172A;">Dr. Miguel Angel Faustor</div>
            <div style="font-size:10.5px;color:#64748B;">Director de Registros Académicos</div>
          </div>
          ${dirOk ? `
            <div style="font-size:10px;color:#166534;background:#DCFCE7;padding:5px 8px;border-radius:4px;line-height:1.4;">
              <b>Firma Digital Registrada</b><br>Refrendado el ${wf.director.fecha} · ID: ${wf.director.firmaId}
            </div>
          ` : `
            <div style="font-size:10.5px;color:${admOk ? '#0F848F' : '#64748B'};font-weight:${admOk ? '600' : '400'};">
              ${admOk ? 'Habilitado para refrendar firma digital' : 'Requiere Paso 1 completado'}
            </div>
          `}
        </div>

        <!-- Paso 3 -->
        <div class="modal-refrendo-step-box ${decOk ? 'done' : (currentTurno === 'decano' ? 'active' : 'locked')}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;font-weight:700;color:#64748B;">PASO 3 · DECANATO</span>
            <span class="pill ${decOk ? 'ok' : (currentTurno === 'decano' ? 'warn' : 'gray')}" style="font-size:10px;">${decOk ? 'Refrendado' : (dirOk ? 'Tu Turno' : 'En Espera')}</span>
          </div>
          <div>
            <div style="font-size:12.5px;font-weight:700;color:#0F172A;">Dr. Augusto Salcedo Vílchez</div>
            <div style="font-size:10.5px;color:#64748B;">Decano de la Facultad de Ingeniería</div>
          </div>
          ${decOk ? `
            <div style="font-size:10px;color:#166534;background:#DCFCE7;padding:5px 8px;border-radius:4px;line-height:1.4;">
              <b>Firma Digital Registrada</b><br>Refrendado el ${wf.decano.fecha} · ID: ${wf.decano.firmaId}
            </div>
          ` : `
            <div style="font-size:10.5px;color:${dirOk ? '#0F848F' : '#64748B'};font-weight:${dirOk ? '600' : '400'};">
              ${dirOk ? 'Habilitado para firma decanal final' : 'Requiere Paso 2 completado'}
            </div>
          `}
        </div>
      </div>

      <!-- Preview del documento oficial con los 3 bloques de firmas -->
      <div class="modal-refrendo-doc-preview">
        <div class="mrdp-header">
          <div>
            <div style="font-size:11px;font-weight:700;color:#0F848F;text-transform:uppercase;">Resolución Decanal y Certificado Oficial</div>
            <div class="mrdp-title">Certificación en "Gestión de Procesos y Datos Digitales" (Ciclo VI)</div>
          </div>
          <span class="pill ok" style="font-size:11px;">Aprobación Académica</span>
        </div>
        <p style="font-size:11.5px;color:#475569;margin:0 0 10px 0;line-height:1.45;">
          Por cuanto los 42 egresados han acreditado la aprobación integral de los cursos correspondientes al módulo formativo, se expide el refrendo oficial de acuerdo al Reglamento General de Certificaciones de Conocimiento de la Universidad Privada Norbert Wiener.
        </p>
        <div class="mrdp-firmas-row">
          <div class="mrdp-firma-slot">
            <div style="font-size:10px;color:${admOk ? '#166534' : '#94A3B8'};font-weight:700;">
              ${admOk ? '✓ FIRMA REGISTRADA' : '○ PENDIENTE'}
            </div>
            <div class="mrdp-firma-line"></div>
            <div class="mrdp-firma-nom">Carlos Mendoza Ríos</div>
            <div class="mrdp-firma-cargo">Jefatura de Registros</div>
          </div>

          <div class="mrdp-firma-slot">
            <div style="font-size:10px;color:${dirOk ? '#166534' : '#94A3B8'};font-weight:700;">
              ${dirOk ? '✓ FIRMA REGISTRADA' : '○ PENDIENTE'}
            </div>
            <div class="mrdp-firma-line"></div>
            <div class="mrdp-firma-nom">Dr. Miguel Angel Faustor</div>
            <div class="mrdp-firma-cargo">Director de Registros</div>
          </div>

          <div class="mrdp-firma-slot">
            <div style="font-size:10px;color:${decOk ? '#166534' : '#94A3B8'};font-weight:700;">
              ${decOk ? '✓ FIRMA REGISTRADA' : '○ PENDIENTE'}
            </div>
            <div class="mrdp-firma-line"></div>
            <div class="mrdp-firma-nom">Dr. Augusto Salcedo</div>
            <div class="mrdp-firma-cargo">Decano de Facultad</div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-foot">
      <button class="btn btn-outline" onclick="APP.closeModal()">Cerrar</button>
      ${esMiTurno ? `
        <button class="btn btn-primary" onclick="ejecutarFirmaDesdeCertificaciones('${rol}')" style="display:inline-flex;align-items:center;gap:6px;font-weight:700;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Aprobar y Refrendar Firma Digital (${rol.toUpperCase()})</span>
        </button>
      ` : (yaFirme ? `
        <span class="pill ok" style="font-size:12px;padding:6px 14px;">✓ Tu firma se encuentra registrada</span>
      ` : `
        <span class="pill info" style="font-size:12px;padding:6px 14px;">Esperando paso secuencial anterior</span>
      `)}
    </div>
  `, { wide: true });
}

function ejecutarFirmaDesdeCertificaciones(rol) {
  const session = APP.getSession() || {};
  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;

  const cargoMap = {
    administrativo: 'Jefatura Operativa de Registros Académicos',
    director: 'Director de Registros y Asuntos Académicos',
    decano: 'Decano de la Facultad de Ingeniería y Negocios'
  };

  const res = DB.aprobarPasoWorkflow(rol, {
    usuario: user.nombre || 'Autoridad Institucional',
    cargo: cargoMap[rol] || user.cargo || 'Funcionario Académico'
  });

  if (!res.ok) {
    APP.toast({ icon: 'err', title: 'Error en firma', body: res.error });
    return;
  }

  APP.toast({
    icon: 'ok',
    title: 'Firma Registrada con Éxito',
    body: `Se ha registrado el refrendo oficial de ${cargoMap[rol]}. Los documentos del lote 2026-II han sido actualizados.`
  });

  APP.closeModal();
  renderPage();
}

function reiniciarWorkflowDesdeCertificaciones() {
  DB.reiniciarWorkflowFirmas();
  APP.toast({
    icon: 'ok',
    title: 'Proceso de Firmas Reiniciado',
    body: 'El flujo secuencial de 3 firmas se ha restablecido para nueva simulación.'
  });
  APP.closeModal();
  renderPage();
}

function renderPage() {
  const activeInputId = document.activeElement ? document.activeElement.id : null;
  const cursorPos = (document.activeElement && typeof document.activeElement.selectionStart === 'number') ? document.activeElement.selectionStart : null;

  const programas = DB.programasCertificaciones() || [];
  const currentProgram = programas.find(p => p.id === selectedProgramId) || programas[0] || {
    id: 'PROG-ISI',
    nombre: 'Ingeniería de Sistemas e Informática',
    codigoPresencial: '59',
    codigoSemipresencial: '2120'
  };

  const certsDisponibles = (DB.certificacionesProgresivas() || []).filter(c => {
    if (!c.programa && !c.carrera) return false;
    const cProg = (c.programa || c.carrera || '').toLowerCase();
    return cProg.includes('sistemas') || cProg.includes(currentProgram.nombre.toLowerCase());
  });

  const currentCert = certsDisponibles.find(c => c.id === selectedCertId) || certsDisponibles[0] || {
    id: 'CP-ISI-01',
    titulo: 'Certificación en "Gestión de Procesos y Datos Digitales"',
    competencia: 'Gestión de Procesos, Datos y Recursos Informáticos',
    cicloOtorgamiento: 'Ciclo VI',
    cursos: []
  };

  const lotes = DB.lotesEmision() || [];
  const programaciones = DB.programacionesEmision() || [];

  // Conteo dinámico de métricas ejecutivas masivas
  const totalLotesCount = lotes.length + 15;
  const totalCertificadosAcumulados = 1114 + lotes.reduce((acc, l) => acc + (Number(l.totalAlumnos) || 0), 0);

  // Evaluación previa silenciosa para mostrar resumen en el configurador
  const evalData = DB.evaluarAlumnosCertificacion(currentCert.id, {
    notaMinima: configNotaMin,
    exigirSinDeuda: configExigirSinDeuda,
    omitirYaEmitidos: configOmitirYaEmitidos,
    modalidad: selectedModalidad,
    ciclo: selectedCiclo
  });

  const countAptos = evalData.filter(e => e.apto).length;

  ctx.mount.innerHTML = `
    <!-- Cintillo Institucional de Workflow de Certificaciones (Posición Top, justo debajo de topbar) -->
    <div id="certificaciones-cintillo-slot"></div>

    <!-- Cabecera de Página (.page-head) -->
    <div class="page-head">
      <div>
        <h1>Emisión Masiva de Certificaciones de Conocimiento</h1>
        <p>Configuración de reglas del sistema, workflow de aprobación (Administrativo, Director, Decano), automatización de lotes de cierre de ciclo y auditoría histórica de despachos oficiales sin costo.</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="reiniciarDataDemo()" title="Restablece la data de simulación para hacer una nueva demostración" style="display:inline-flex;align-items:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <span>Reiniciar data demo</span>
        </button>
        <button type="button" class="btn btn-secondary" onclick="irAPerfilAlumno('2021100345')" style="display:inline-flex;align-items:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Ver perfil Alumno</span>
        </button>
      </div>
    </div>

    <!-- Banner de Reglas del Sistema (Wiener Teal #F0F9FA) - DESPLEGABLE (Carga Oculto) -->
    <div class="rules-banner-wiener">
      <div class="rules-banner-head-row">
        <div class="rules-banner-left">
          <div class="rules-banner-top-title-row">
            <div class="rules-banner-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div class="rules-banner-title">
              <span>Reglas Institucionales de Emisión Automática y Gratuita (Cierre de Ciclo)</span>
              <span class="pill ok" style="font-size:11px;font-weight:700;">Sin costo · Gratuito</span>
            </div>
          </div>
          <div class="rules-banner-sub">
            Validación algorítmica desatendida del sistema (Promedio mínimo ≥ 14.00, Solvencia Sin Deuda S/ 0.00 y no duplicidad).
          </div>
        </div>

        <!-- Botón Desplegable para revisar las reglas -->
        <button type="button" class="rules-toggle-btn" id="rules-toggle-btn" onclick="toggleRules()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span id="rules-toggle-label">${isRulesExpanded ? 'Ocultar reglas' : 'Revisar reglas del sistema'}</span>
          <svg class="rules-toggle-arrow" id="rules-toggle-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform:${isRulesExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      <!-- Contenido Desplegable -->
      <div class="rules-collapsible-body" id="rules-collapsible-body" style="display:${isRulesExpanded ? 'block' : 'none'};">
        <div class="rules-banner-desc">
          Las Certificaciones de Conocimiento se generan de forma masiva y gratuita para los alumnos que culminan los módulos formativos de su plan curricular, validando las reglas internas del sistema y despachando de oficio las constancias digitales con firmas refrendadas por Administrativo, Director y Decano a las cuentas de correo institucional.
        </div>
        <div class="rules-pills-grid">
          <div class="rules-check-pill highlight">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:#16A34A;"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
            <div><b>Regla 1 (Académica):</b> Aprobación del 100% de cursos del módulo con nota mínima de <b>14.00</b>.</div>
          </div>
          <div class="rules-check-pill highlight">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:#16A34A;"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
            <div><b>Regla 2 (Financiera):</b> Condición de <b>Sin Deuda</b> (S/ 0.00 pendiente en aranceles o cuotas).</div>
          </div>
          <div class="rules-check-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:#0F848F;"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            <div><b>Regla 3 (No Duplicidad):</b> Exclusión si el alumno ya cuenta con la certificación emitida previamente.</div>
          </div>
          <div class="rules-check-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:#0F848F;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <div><b>Despacho Electrónico:</b> Envío automático con firmas refrendadas de Administrativo, Director y Decano a <b>@uwiener.edu.pe</b>.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjetas de KPIs Ejecutivos -->
    <div class="kpi-mass-grid">
      <div class="kpi-mass-card">
        <div class="kpi-mass-head">
          <span class="kpi-mass-lbl">Certificados Emitidos</span>
          <div class="kpi-mass-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
        </div>
        <div class="kpi-mass-val">${totalCertificadosAcumulados.toLocaleString('es-PE')}</div>
        <div class="kpi-mass-sub">
          <span class="pill ok" style="font-size:10.5px;padding:2px 8px;">100% Gratuito</span>
          <span>Acumulado institucional</span>
        </div>
      </div>

      <div class="kpi-mass-card">
        <div class="kpi-mass-head">
          <span class="kpi-mass-lbl">Lotes Masivos Procesados</span>
          <div class="kpi-mass-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
        </div>
        <div class="kpi-mass-val">${totalLotesCount}</div>
        <div class="kpi-mass-sub">
          <span class="pill ok" style="font-size:10.5px;padding:2px 8px;">100% Exitoso</span>
          <span>Sin incidencias operativas</span>
        </div>
      </div>

      <div class="kpi-mass-card">
        <div class="kpi-mass-head">
          <span class="kpi-mass-lbl">Tasa de Despacho Digital</span>
          <div class="kpi-mass-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
        </div>
        <div class="kpi-mass-val" style="color:#0F848F;">100%</div>
        <div class="kpi-mass-sub">
          <span>Entrega inmediata a cuentas @uwiener.edu.pe</span>
        </div>
      </div>

      <div class="kpi-mass-card">
        <div class="kpi-mass-head">
          <span class="kpi-mass-lbl">Próxima Automatización</span>
          <div class="kpi-mass-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
              <circle cx="12" cy="15" r="2"></circle>
            </svg>
          </div>
        </div>
        <div class="kpi-mass-val" style="font-size:22px;color:#1E293B;">15 Dic 2026</div>
        <div class="kpi-mass-sub">
          <span class="pill info" style="font-size:10.5px;padding:2px 8px;">Cierre 2026-II</span>
          <span>Emisión programada</span>
        </div>
      </div>
    </div>

    <!-- Pestañas de Navegación -->
    <div class="tabs-bar">
      <div class="tab-item ${activeTab === 'configurador' ? 'active' : ''}" onclick="setMainTab('configurador')">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        Configurador y Emisión Masiva
      </div>
      <div class="tab-item ${activeTab === 'programacion' ? 'active' : ''}" onclick="setMainTab('programacion')">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Programación de Ejecuciones y Cierres <span class="tab-count">${programaciones.length} activas</span>
      </div>
    </div>

    ${activeTab === 'configurador' ? renderTabConfigurador(currentProgram, currentCert, certsDisponibles, countAptos, lotes) : ''}
    ${activeTab === 'programacion' ? renderTabProgramacion(programaciones) : ''}
  `;

  // Hidratar desplegables personalizados y datepickers con rotación de flecha
  hydrateInteractiveControls(ctx.mount);

  // Render del Cintillo Institucional de Workflow
  renderCintilloWorkflowCertificaciones();

  if (activeInputId) {
    const el = document.getElementById(activeInputId);
    if (el) {
      el.focus();
      if (cursorPos !== null && typeof el.setSelectionRange === 'function') {
        el.setSelectionRange(cursorPos, cursorPos);
      }
    }
  }
}

function renderTabConfigurador(currentProgram, currentCert, certsDisponibles, countAptos, lotes) {
  const programas = DB.programasCertificaciones() || [];

  // Filtrado del Histórico de Lotes
  const filteredLotes = lotes.filter(l => {
    if (filterPeriodoHistorial !== 'todos' && l.periodo !== filterPeriodoHistorial) return false;
    if (filterDateDesde && (l.fecha || '').slice(0, 10) < filterDateDesde) return false;
    if (filterDateHasta && (l.fecha || '').slice(0, 10) > filterDateHasta) return false;
    if (searchQueryHistorial) {
      const q = searchQueryHistorial.toLowerCase();
      const matchId = (l.id || '').toLowerCase().includes(q);
      const matchProg = (l.programa || '').toLowerCase().includes(q);
      const matchCert = (l.certificacionTitulo || '').toLowerCase().includes(q);
      if (!matchId && !matchProg && !matchCert) return false;
    }
    return true;
  });

  const hayFiltrosActivos = searchQueryHistorial || filterPeriodoHistorial !== 'todos' || filterDateDesde || filterDateHasta;

  return `
    <!-- TARJETA DEL CONFIGURADOR PREVIO -->
    <div class="config-card">
      <div class="config-card-head">
        <h2>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:#0F848F;flex-shrink:0;">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Configurador Previo de Emisión Masiva
        </h2>
        <div style="font-size:12.5px;color:#64748B;">
          Facultad: <b>${currentProgram.facultad || 'Ingeniería y Negocios'}</b> &nbsp;·&nbsp;
          Nivel: <b>Pregrado Universitario</b>
        </div>
      </div>

      <!-- Grid Unificado de los 6 Parámetros Configurables (Adaptación 3 / 2 / 1 columnas) -->
      <div class="form-grid-config">
        <!-- Programa Académico (Custom Select Personalizado Wiener) -->
        <div class="form-field">
          <label for="cfg-programa">Programa Académico</label>
          <div class="custom-select-container">
            <select id="cfg-programa" onchange="onProgramChange(this.value)">
              ${programas.map(p => `
                <option value="${p.id}" ${p.id === selectedProgramId ? 'selected' : ''}>
                  ${p.nombre}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Certificación de Conocimiento Objetivo (Custom Select Personalizado Wiener) -->
        <div class="form-field">
          <label for="cfg-cert">Certificación de Conocimiento a Emitir</label>
          <div class="custom-select-container">
            <select id="cfg-cert" onchange="onCertChange(this.value)">
              ${certsDisponibles.map(c => `
                <option value="${c.id}" ${c.id === selectedCertId ? 'selected' : ''}>
                  [${c.cicloOtorgamiento}] ${c.titulo}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Periodo / Cierre de Ciclo (Custom Select Personalizado Wiener) -->
        <div class="form-field">
          <label for="cfg-periodo">Periodo de Cierre Académico</label>
          <div class="custom-select-container">
            <select id="cfg-periodo" onchange="onParamRuleChange()">
              <option value="2026-II" ${selectedPeriodo === '2026-II' ? 'selected' : ''}>2026-II (Cierre de Ciclo Vigente)</option>
              <option value="2026-I" ${selectedPeriodo === '2026-I' ? 'selected' : ''}>2026-I (Ciclo Anterior)</option>
              <option value="2025-II" ${selectedPeriodo === '2025-II' ? 'selected' : ''}>2025-II</option>
            </select>
          </div>
        </div>

        <!-- Modalidad de Estudios -->
        <div class="form-field">
          <label for="cfg-modalidad">Modalidad de Estudios</label>
          <div class="custom-select-container">
            <select id="cfg-modalidad" onchange="onParamRuleChange()">
              <option value="todas" ${selectedModalidad === 'todas' ? 'selected' : ''}>Todas las modalidades (Presencial y Semipresencial)</option>
              <option value="Presencial" ${selectedModalidad === 'Presencial' ? 'selected' : ''}>Presencial (Cód. 59)</option>
              <option value="Semipresencial" ${selectedModalidad === 'Semipresencial' ? 'selected' : ''}>Semipresencial (Cód. 2120)</option>
            </select>
          </div>
        </div>

        <!-- Ciclo de Otorgamiento -->
        <div class="form-field">
          <label for="cfg-ciclo">Ciclo de Otorgamiento</label>
          <div class="custom-select-container">
            <select id="cfg-ciclo" onchange="onParamRuleChange()">
              <option value="todos" ${selectedCiclo === 'todos' ? 'selected' : ''}>Todos los ciclos matriculados (Filtro abierto)</option>
              <option value="6" ${selectedCiclo === '6' ? 'selected' : ''}>Ciclo VI</option>
              <option value="7" ${selectedCiclo === '7' ? 'selected' : ''}>Ciclo VII</option>
              <option value="8" ${selectedCiclo === '8' ? 'selected' : ''}>Ciclo VIII</option>
              <option value="9" ${selectedCiclo === '9' ? 'selected' : ''}>Ciclo IX</option>
              <option value="10" ${selectedCiclo === '10' ? 'selected' : ''}>Ciclo X</option>
            </select>
          </div>
        </div>

        <!-- Regla 1: Nota Mínima -->
        <div class="form-field">
          <label for="cfg-nota">Regla 1: Nota Mínima Requerida</label>
          <input type="number" id="cfg-nota" step="0.5" min="11" max="20" value="${configNotaMin}" onchange="onParamRuleChange()" title="Por reglamento institucional la nota aprobatoria en cada asignatura debe ser mínimo 14.00">
        </div>
      </div>

      <!-- Reglas Institucionales de Validación Automática -->
      <div class="rule-checkbox-box">
        <div class="rule-checkbox-title">Reglas del Sistema Validadas por el Motor Masivo</div>
        <div class="rule-chips-row">
          <label class="rule-chip-label">
            <input type="checkbox" id="cfg-deuda" ${configExigirSinDeuda ? 'checked' : ''} onchange="onParamRuleChange()">
            <span><b>Regla 2:</b> Exigir condición de <b>No Deuda (S/ 0.00)</b></span>
          </label>

          <label class="rule-chip-label">
            <input type="checkbox" id="cfg-emitidos" ${configOmitirYaEmitidos ? 'checked' : ''} onchange="onParamRuleChange()">
            <span><b>Regla 3:</b> Excluir alumnos con certificación ya emitida</span>
          </label>

          <label class="rule-chip-label">
            <input type="checkbox" id="cfg-correo" ${configDespachoCorreo ? 'checked' : ''} onchange="onParamRuleChange()">
            <span>Despacho automático a cuentas <b>@uwiener.edu.pe</b></span>
          </label>
        </div>
      </div>

      <!-- Malla Curricular Desplegable -->
      <div class="malla-collapsible">
        <div class="malla-header-toggle" onclick="toggleMalla()">
          <div class="malla-toggle-left">
            <div class="malla-toggle-title-group">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span class="malla-toggle-title">Malla Formativa de la Certificación: <b>${currentCert.titulo}</b> <span class="malla-toggle-count">(${currentCert.cursos?.length || 0} asignaturas vinculadas)</span></span>
            </div>
            <span class="pill ok malla-toggle-pill">Otorga en: ${currentCert.cicloOtorgamiento}</span>
          </div>
          <div class="malla-toggle-btn">
            <span>${isMallaExpanded ? 'Ocultar Cursos' : 'Ver Cursos'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform:${isMallaExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};transition:transform 0.25s ease;">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        ${isMallaExpanded ? `
          <div class="malla-body-table">
            <div class="malla-table-scroll">
              <table class="table-courses">
                <thead>
                  <tr>
                    <th style="width:100px;">Cód. Curso</th>
                    <th>Cursos Vinculados (Asignatura)</th>
                    <th style="width:95px;text-align:center;">Ciclo Curso</th>
                    <th style="width:75px;text-align:center;">Tipo</th>
                    <th style="width:85px;text-align:center;">Creditaje</th>
                    <th style="width:190px;text-align:center;">Condición Requerida</th>
                    <th style="width:70px;text-align:center;">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  ${(currentCert.cursos || []).map(c => `
                    <tr>
                      <td style="font-family:monospace;font-weight:700;color:#0F848F;">${c.codigo}</td>
                      <td><b>${c.nombre}</b></td>
                      <td style="text-align:center;">Ciclo ${c.ciclo}</td>
                      <td style="text-align:center;"><span class="pill" style="font-size:11px;padding:2px 8px;background:#F1F5F9;color:#475569;">${c.creditaje || 4} cr.</span></td>
                      <td style="text-align:center;">${c.tipo || 'O'}</td>
                      <td style="text-align:center;">
                        <span style="font-size:12px;color:#166534;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          Aprobado con Nota ≥ ${configNotaMin.toFixed(2)}
                        </span>
                      </td>
                      <td style="text-align:center;">
                        <button type="button" class="btn-remove-course" onclick="quitarCursoCertificacion('${c.codigo}')" title="Quitar curso de esta certificación">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="malla-table-footer">
              <button type="button" class="btn btn-secondary btn-sm" onclick="abrirModalAgregarCurso()" style="display:inline-flex;align-items:center;gap:6px;font-weight:600;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Agregar Curso a la Malla</span>
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- WORKFLOW INSTITUCIONAL DE APROBACIÓN Y FIRMAS DIGITALES (ADMINISTRATIVO -> DIRECTOR -> DECANO) -->
      <div class="workflow-card">
        <div class="workflow-card-head">
          <div class="workflow-card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            <div>
              <span>Circuito Oficial de Refrendos y Firmas Institucionales para Emisión Masiva</span>
              <div style="font-size:12px;font-weight:400;color:#64748B;margin-top:2px;">
                Aprobación y refrendo secuencial requerido: <b>1. Administrativo</b> → <b>2. Director</b> → <b>3. Decano</b>
              </div>
            </div>
          </div>

          <div class="workflow-actions-wrap">
            <div class="workflow-profile-bar">
              <span class="workflow-profile-lbl">Ingresar/Firmar como:</span>
              <button type="button" class="btn-workflow-role ${activeWorkflowRole === 'administrativo' ? 'active' : ''}" onclick="setWorkflowRole('administrativo')">Administrativo</button>
              <button type="button" class="btn-workflow-role ${activeWorkflowRole === 'director' ? 'active' : ''}" onclick="setWorkflowRole('director')">Director</button>
              <button type="button" class="btn-workflow-role ${activeWorkflowRole === 'decano' ? 'active' : ''}" onclick="setWorkflowRole('decano')">Decano</button>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" onclick="reiniciarWorkflowFirmas()" title="Reiniciar proceso de firmas a estado inicial" style="font-size:11.5px;color:#64748B;display:inline-flex;align-items:center;gap:4px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        <div class="workflow-steps-grid">
          <!-- Paso 1: Administrativo -->
          <div class="workflow-step-card ${workflowFirmas.administrativo.aprobado ? 'approved' : (activeWorkflowRole === 'administrativo' ? 'active' : '')}">
            <div class="workflow-step-head">
              <div class="workflow-step-num">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                <span>Paso 1 · Operador</span>
              </div>
              <span class="pill ${workflowFirmas.administrativo.aprobado ? 'ok' : 'info'}" style="font-size:10.5px;">
                ${workflowFirmas.administrativo.aprobado ? `
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aprobado
                ` : 'Pendiente'}
              </span>
            </div>
            <div>
              <div class="workflow-step-role">Perfil Administrativo</div>
              <div class="workflow-step-user">${workflowFirmas.administrativo.usuario}</div>
              <div class="workflow-step-cargo">${workflowFirmas.administrativo.cargo}</div>
            </div>
            <div>
              ${workflowFirmas.administrativo.aprobado ? `
                <div class="workflow-signature-stamp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <div>
                    <b>Firma Digital Registrada</b><br>
                    <span style="font-size:10px;color:#166534;">Refrendado el ${workflowFirmas.administrativo.fecha} · ID: ${workflowFirmas.administrativo.firmaId}</span>
                  </div>
                </div>
                <button type="button" class="btn btn-ghost btn-sm workflow-step-btn" style="color:#166534;background:#DCFCE7;cursor:default;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Firma Administrativa Acreditada</span>
                </button>
              ` : `
                <button type="button" class="btn btn-primary workflow-step-btn" onclick="aprobarPasoWorkflow('administrativo')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                  <span>Aprobar y Firmar (Administrativo)</span>
                </button>
              `}
            </div>
          </div>

          <!-- Paso 2: Director -->
          <div class="workflow-step-card ${workflowFirmas.director.aprobado ? 'approved' : (!workflowFirmas.administrativo.aprobado ? 'locked' : (activeWorkflowRole === 'director' ? 'active' : ''))}">
            <div class="workflow-step-head">
              <div class="workflow-step-num">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                <span>Paso 2 · Escuela</span>
              </div>
              <span class="pill ${workflowFirmas.director.aprobado ? 'ok' : (!workflowFirmas.administrativo.aprobado ? '' : 'info')}" style="font-size:10.5px;">
                ${workflowFirmas.director.aprobado ? `
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aprobado
                ` : (!workflowFirmas.administrativo.aprobado ? 'En espera del Paso 1' : 'Listo para firmar')}
              </span>
            </div>
            <div>
              <div class="workflow-step-role">Perfil Director de Escuela</div>
              <div class="workflow-step-user">${workflowFirmas.director.usuario}</div>
              <div class="workflow-step-cargo">${workflowFirmas.director.cargo}</div>
            </div>
            <div>
              ${workflowFirmas.director.aprobado ? `
                <div class="workflow-signature-stamp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <div>
                    <b>Firma Digital Registrada</b><br>
                    <span style="font-size:10px;color:#166534;">Refrendado el ${workflowFirmas.director.fecha} · ID: ${workflowFirmas.director.firmaId}</span>
                  </div>
                </div>
                <button type="button" class="btn btn-ghost btn-sm workflow-step-btn" style="color:#166534;background:#DCFCE7;cursor:default;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Firma de Dirección Acreditada</span>
                </button>
              ` : (
                !workflowFirmas.administrativo.aprobado ? `
                  <button type="button" class="btn btn-outline workflow-step-btn" disabled title="Requiere previa aprobación del Administrativo" style="opacity:0.6;cursor:not-allowed;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>Esperando V°B° Administrativo</span>
                  </button>
                ` : `
                  <button type="button" class="btn btn-primary workflow-step-btn" onclick="aprobarPasoWorkflow('director')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                    <span>Aprobar y Firmar (Director)</span>
                  </button>
                `
              )}
            </div>
          </div>

          <!-- Paso 3: Decano -->
          <div class="workflow-step-card ${workflowFirmas.decano.aprobado ? 'approved' : (!workflowFirmas.director.aprobado ? 'locked' : (activeWorkflowRole === 'decano' ? 'active' : ''))}">
            <div class="workflow-step-head">
              <div class="workflow-step-num">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                <span>Paso 3 · Facultad</span>
              </div>
              <span class="pill ${workflowFirmas.decano.aprobado ? 'ok' : (!workflowFirmas.director.aprobado ? '' : 'warn')}" style="font-size:10.5px;">
                ${workflowFirmas.decano.aprobado ? `
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aprobado
                ` : (!workflowFirmas.director.aprobado ? 'En espera del Paso 2' : 'Firma final pendiente')}
              </span>
            </div>
            <div>
              <div class="workflow-step-role">Perfil Decano de Facultad</div>
              <div class="workflow-step-user">${workflowFirmas.decano.usuario}</div>
              <div class="workflow-step-cargo">${workflowFirmas.decano.cargo}</div>
            </div>
            <div>
              ${workflowFirmas.decano.aprobado ? `
                <div class="workflow-signature-stamp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <div>
                    <b>Firma Digital Registrada</b><br>
                    <span style="font-size:10px;color:#166534;">Refrendado el ${workflowFirmas.decano.fecha} · ID: ${workflowFirmas.decano.firmaId}</span>
                  </div>
                </div>
                <button type="button" class="btn btn-ghost btn-sm workflow-step-btn" style="color:#166534;background:#DCFCE7;cursor:default;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Firma Decanal Acreditada</span>
                </button>
              ` : (
                !workflowFirmas.director.aprobado ? `
                  <button type="button" class="btn btn-outline workflow-step-btn" disabled title="Requiere previa aprobación del Director de Escuela" style="opacity:0.6;cursor:not-allowed;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>Esperando V°B° Director</span>
                  </button>
                ` : `
                  <button type="button" class="btn btn-primary workflow-step-btn" onclick="aprobarPasoWorkflow('decano')" style="background:#0F848F;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                    <span>Refrendar y Firmar (Decano)</span>
                  </button>
                `
              )}
            </div>
          </div>
        </div>

        <div class="workflow-summary-banner">
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>
              ${workflowFirmas.administrativo.aprobado && workflowFirmas.director.aprobado && workflowFirmas.decano.aprobado ? `
                <b>Circuito completado al 100%:</b> Las 3 firmas oficiales (Administrativo, Director y Decano) figurarán con certificado digital en los documentos que se emitirán de forma masiva.
              ` : `
                <b>Proceso en curso (${(workflowFirmas.administrativo.aprobado ? 1 : 0) + (workflowFirmas.director.aprobado ? 1 : 0) + (workflowFirmas.decano.aprobado ? 1 : 0)} de 3 firmas registradas):</b> Se refrendará la firma de cada autoridad en orden secuencial obligatorio antes de la emisión final del lote.
              `}
            </span>
          </div>
        </div>
      </div>

      <!-- BANNER DE RESUMEN DE EJECUCIÓN Y BOTÓN SOLICITADO 'Ejecutar Emisión Masiva' -->
      <div class="config-action-banner">
        <div class="config-action-info">
          <div class="config-action-icon">
            ${getSvgExecIcon(24, '#FFFFFF')}
          </div>
          <div class="config-action-details">
            <div class="config-action-title">
              Emisión Masiva de Oficio al Cierre de Periodo ${selectedPeriodo}
            </div>
            <div class="config-action-meta">
              <span class="config-meta-item">Certificación: <b>${currentCert.titulo}</b></span>
              <span class="config-meta-sep">·</span>
              <span class="config-meta-item config-meta-free">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Trámite Gratuito Institucional (S/ 0.00)
              </span>
              <span class="config-meta-sep">·</span>
              <span class="config-meta-item config-meta-aptos">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                ${countAptos} estudiante(s) apto(s) en este lote
              </span>
            </div>
          </div>
        </div>

        <div class="config-action-buttons">
          <button class="btn btn-secondary" onclick="abrirModalNuevaProgramacion()" style="display:inline-flex;align-items:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
              <line x1="12" x2="12" y1="14" y2="18"></line>
              <line x1="10" x2="14" y1="16" y2="16"></line>
            </svg>
            <span>Programar al Cierre</span>
          </button>

          <!-- Botón oficial solicitado con SVG del usuario -->
          <button class="btn btn-primary" onclick="ejecutarEmisionMasiva()" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;padding:12px 24px;">
            ${getSvgExecIcon(20, '#FFFFFF')}
            <span>Ejecutar Emisión Masiva</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TABLA PRINCIPAL: HISTÓRICO DE EMISIONES MASIVAS EJECUTADAS (LOTES) -->
    <div class="vt-table-card">
      <div class="vt-table-toolbar">
        <div style="display:flex;align-items:center;gap:10px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <polyline points="3 3 3 8 8 8"></polyline>
            <polyline points="12 7 12 12 15 15"></polyline>
          </svg>
          <div>
            <h3 style="margin:0;font-size:15.5px;font-family:'Lato',sans-serif;color:#0F172A;font-weight:700;">
              Histórico de Emisiones Masivas Ejecutadas (Lotes Procesados)
            </h3>
            <div style="font-size:12px;color:#64748B;">
              Trazabilidad de certificaciones generadas por sistema y despachadas de forma masiva a las cuentas de correo institucional.
            </div>
          </div>
        </div>

        <!-- Filtros de búsqueda sobre la tabla (Custom Selects & DatePickers) -->
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <div class="input-wrap-icon-left" style="width:200px;">
            <svg class="input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="filter-search-historial" placeholder="Buscar lote..." value="${searchQueryHistorial}" oninput="searchQueryHistorial=this.value; renderPage();">
          </div>

          <!-- Select Personalizado de Periodo Wiener -->
          <div class="custom-select-container select-container-170">
            <select id="filter-periodo-historial" onchange="filterPeriodoHistorial=this.value; renderPage();">
              <option value="todos" ${filterPeriodoHistorial === 'todos' ? 'selected' : ''}>Todos los periodos</option>
              <option value="2026-II" ${filterPeriodoHistorial === '2026-II' ? 'selected' : ''}>Periodo 2026-II</option>
              <option value="2026-I" ${filterPeriodoHistorial === '2026-I' ? 'selected' : ''}>Periodo 2026-I</option>
              <option value="2025-II" ${filterPeriodoHistorial === '2025-II' ? 'selected' : ''}>Periodo 2025-II</option>
            </select>
          </div>

          <!-- Rango de Fechas (Desde / Hasta) adaptado a 1 sola línea en mobile -->
          <div class="filter-dates-row">
            <div class="custom-date-container" style="width:145px;" title="Fecha inicio de lote">
              <input type="date" id="filter-date-desde" class="form-control" value="${filterDateDesde}" onchange="filterDateDesde=this.value; renderPage();">
            </div>
            <div class="custom-date-container" style="width:145px;" title="Fecha fin de lote">
              <input type="date" id="filter-date-hasta" class="form-control" value="${filterDateHasta}" onchange="filterDateHasta=this.value; renderPage();">
            </div>
          </div>

          ${hayFiltrosActivos ? `
            <button type="button" class="btn btn-outline btn-sm" onclick="limpiarFiltrosHistorial()" title="Limpiar todos los filtros" style="display:inline-flex;align-items:center;gap:4px;height:40px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18M6 6l12 12"></path></svg>
              <span>Limpiar</span>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="vt-table-wrapper">
        <table class="vt-table">
          <thead>
            <tr>
              <th style="width:140px;">Lote ID</th>
              <th style="width:140px;">Fecha y Hora</th>
              <th>Programa Académico</th>
              <th>Certificación de Conocimiento</th>
              <th style="width:90px;text-align:center;">Periodo</th>
              <th style="width:120px;text-align:center;">Total Emitidos</th>
              <th>Canal de Despacho</th>
              <th style="width:110px;text-align:center;">Estado</th>
              <th style="width:130px;text-align:center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${filteredLotes.length === 0 ? `
              <tr>
                <td colspan="9" style="text-align:center;padding:36px;color:#64748B;">
                  No se encontraron lotes de emisión masiva para los filtros seleccionados.
                </td>
              </tr>
            ` : filteredLotes.map(l => `
              <tr>
                <td style="font-family:monospace;font-weight:700;color:#0F848F;white-space:nowrap;">
                  ${l.id}
                </td>
                <td style="white-space:nowrap;font-size:12.5px;color:#475569;">
                  ${l.fechaFormato || l.fecha}
                </td>
                <td>
                  <b>${l.programa}</b>
                </td>
                <td>
                  <div style="font-weight:600;color:#0F172A;">${l.certificacionTitulo}</div>
                  <div style="font-size:11.5px;color:#64748B;">${l.cicloOtorgamiento || 'Ciclo VI'} · Trámite gratuito</div>
                </td>
                <td style="text-align:center;">
                  <span class="pill" style="font-size:11.5px;padding:2px 8px;background:#F1F5F9;color:#334155;">
                    ${l.periodo}
                  </span>
                </td>
                <td style="text-align:center;font-weight:700;color:#16A34A;font-size:13.5px;">
                  ${l.totalAlumnos} alumnos
                </td>
                <td>
                  <span class="pill ok" style="font-size:11px;padding:3px 8px;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Correo Institucional
                  </span>
                </td>
                <td style="text-align:center;">
                  <span class="pill ok" style="font-size:11px;">
                    Despachado
                  </span>
                </td>
                <td style="text-align:center;white-space:nowrap;">
                  <button class="btn btn-outline btn-sm" onclick="verDetalleLote('${l.id}')" title="Ver auditoría de alumnos beneficiados en este lote" style="display:inline-flex;align-items:center;gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Detalle del Lote</span>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTabProgramacion(programaciones) {
  const filteredProgs = programaciones.filter(p => {
    if (filterEstadoProgramacion !== 'todos' && p.estado !== filterEstadoProgramacion) return false;
    if (filterPeriodoProg !== 'todos' && p.periodo !== filterPeriodoProg) return false;
    return true;
  });

  return `
    <!-- PANEL DE PROFUNDIZACIÓN: CAPACIDAD Y GESTIÓN DE PROGRAMACIONES -->
    <div class="schedule-info-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h2 style="font-family:'Lato',sans-serif;font-size:17.5px;font-weight:700;color:#0F172A;margin:0;">
              Gestión y Monitoreo de Automatizaciones de Cierre Lectivo
            </h2>
          </div>
          <p style="font-size:13.5px;color:#475569;margin:6px 0 0 0;line-height:1.5;">
            Configura ejecuciones automáticas desatendidas para el cierre de semestre por escuela profesional, ciclo o certificación.
          </p>
        </div>

        <button class="btn btn-primary" onclick="abrirModalNuevaProgramacion()" style="display:inline-flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Nueva Programación de Cierre</span>
        </button>
      </div>

      <!-- Cuadrícula explicativa de reglas de negocio para programaciones -->
      <div class="schedule-qa-grid">
        <div class="schedule-qa-item">
          <div class="schedule-qa-q">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.178-8-12.356-8-5.096 0-5.096 8 0 8 5.178 0 7.26-8 12.356-8Z"></path></svg>
            ¿Cuántas programaciones podemos tener?
          </div>
          <div class="schedule-qa-a">
            <b>Capacidad ilimitada:</b> Puedes registrar tantas programaciones como requiera la universidad, organizadas por escuela profesional, modalidad, ciclo o tipo de cierre (cierre ordinario, sustitutorios o subsanaciones extemporáneas).
          </div>
        </div>

        <div class="schedule-qa-item">
          <div class="schedule-qa-q">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            ¿Dónde las podemos ver y auditar?
          </div>
          <div class="schedule-qa-a">
            En esta tabla centralizada con seguimiento en tiempo real de estados (<b>Programado</b>, <b>Pausado</b>, <b>Completado</b>), fecha exacta de ejecución y población de estudiantes proyectada.
          </div>
        </div>

        <div class="schedule-qa-item">
          <div class="schedule-qa-q">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
            Siempre editables y controlables
          </div>
          <div class="schedule-qa-a">
            Cualquier tarea programada puede <b>editarse</b> en cualquier momento antes de su ejecución, <b>pausarse</b> temporalmente o <b>ejecutarse anticipadamente</b> con un clic si la consolidación de actas concluye antes de tiempo.
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA DE PROGRAMACIONES ACTIVAS (CUSTOM SELECTS EN BARRA) -->
    <div class="vt-table-card">
      <div class="vt-table-toolbar">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:14.5px;font-weight:700;color:#0F172A;font-family:'Lato',sans-serif;">
            Cronograma de Ejecuciones Programadas (${filteredProgs.length})
          </span>
        </div>

        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:11px;color:#5B6E80;text-transform:uppercase;font-weight:700;">Estado:</span>
          <div class="custom-select-container select-container-170">
            <select id="filter-estado-programacion" onchange="filterEstadoProgramacion=this.value; renderPage();">
              <option value="todos" ${filterEstadoProgramacion === 'todos' ? 'selected' : ''}>Todos los estados</option>
              <option value="Programado" ${filterEstadoProgramacion === 'Programado' ? 'selected' : ''}>Programadas</option>
              <option value="Pausado" ${filterEstadoProgramacion === 'Pausado' ? 'selected' : ''}>Pausadas</option>
              <option value="Completado" ${filterEstadoProgramacion === 'Completado' ? 'selected' : ''}>Completadas</option>
            </select>
          </div>

          <span style="font-size:11px;color:#5B6E80;text-transform:uppercase;font-weight:700;">Periodo:</span>
          <div class="custom-select-container select-container-170">
            <select id="filter-periodo-prog" onchange="filterPeriodoProg=this.value; renderPage();">
              <option value="todos" ${filterPeriodoProg === 'todos' ? 'selected' : ''}>Todos los periodos</option>
              <option value="2026-II" ${filterPeriodoProg === '2026-II' ? 'selected' : ''}>Periodo 2026-II</option>
              <option value="2026-I" ${filterPeriodoProg === '2026-I' ? 'selected' : ''}>Periodo 2026-I</option>
              <option value="2025-II" ${filterPeriodoProg === '2025-II' ? 'selected' : ''}>Periodo 2025-II</option>
            </select>
          </div>
        </div>
      </div>

      <div class="vt-table-wrapper">
        <table class="vt-table">
          <thead>
            <tr>
              <th>Proceso / Identificador</th>
              <th>Programa Académico</th>
              <th>Certificación Objetivo</th>
              <th style="width:90px;text-align:center;">Periodo</th>
              <th style="width:150px;">Fecha Programada</th>
              <th style="width:130px;text-align:center;">Población Estimada</th>
              <th style="width:110px;text-align:center;">Estado</th>
              <th style="width:230px;text-align:center;">Acciones (Editables)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProgs.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align:center;padding:36px;color:#64748B;">
                  No hay programaciones registradas para el filtro seleccionado.
                </td>
              </tr>
            ` : filteredProgs.map(p => `
              <tr>
                <td>
                  <b>${p.nombre}</b>
                  <div style="font-size:11.5px;color:#64748B;">ID: ${p.id} · Creado: ${p.fechaCreacion}</div>
                </td>
                <td>${p.programaNombre}</td>
                <td>
                  <b>${p.certificacionTitulo}</b>
                  <div style="font-size:11.5px;color:#64748B;">${p.cicloOtorgamiento || 'Ciclos VI al X'}</div>
                </td>
                <td style="text-align:center;">
                  <span class="pill" style="font-size:11.5px;padding:2px 8px;background:#F1F5F9;color:#334155;">
                    ${p.periodo}
                  </span>
                </td>
                <td style="white-space:nowrap;font-size:13px;font-weight:600;color:#0F172A;">
                  ${p.fechaEjecucion.replace('T', ' ')} hrs
                </td>
                <td style="text-align:center;color:#475569;font-weight:600;">
                  ${p.alumnosEstimados} alumnos
                </td>
                <td style="text-align:center;">
                  <span class="pill ${p.estado === 'Programado' ? 'ok' : (p.estado === 'Pausado' ? 'paused' : 'info')}">
                    ${p.estado}
                  </span>
                </td>
                <td style="text-align:center;white-space:nowrap;">
                  <div style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-outline btn-sm btn-action-icon" onclick="abrirModalEditarProgramacion('${p.id}')" title="Modificar fecha, carrera o reglas de esta programación">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                      <span>Editar</span>
                    </button>

                    ${p.estado === 'Programado' ? `
                      <!-- Botón solicitado 'Ejecutar ahora' con SVG oficial del usuario -->
                      <button class="btn btn-primary btn-sm btn-action-icon" onclick="ejecutarProgramacionAhora('${p.id}')" title="Adelantar y ejecutar este lote masivo inmediatamente">
                        ${getSvgExecIcon(16, '#FFFFFF')}
                        <span>Ejecutar ahora</span>
                      </button>
                      <button class="btn btn-ghost btn-sm btn-action-icon" onclick="togglePausa('${p.id}')" title="Pausar temporalmente esta programación">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="4" height="16" x="6" y="4" rx="1"></rect><rect width="4" height="16" x="14" y="4" rx="1"></rect></svg>
                        <span>Pausar</span>
                      </button>
                    ` : (p.estado === 'Pausado' ? `
                      <button class="btn btn-secondary btn-sm btn-action-icon" onclick="togglePausa('${p.id}')" title="Reactivar programación">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        <span>Reanudar</span>
                      </button>
                    ` : '')}

                    <button class="btn btn-ghost btn-sm btn-action-danger" onclick="eliminarProgramacion('${p.id}')" title="Eliminar programación">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Exponer globalmente
window.setMainTab = setMainTab;
window.toggleRules = toggleRules;
window.toggleMalla = toggleMalla;
window.onProgramChange = onProgramChange;
window.onCertChange = onCertChange;
window.onParamRuleChange = onParamRuleChange;
window.limpiarFiltrosHistorial = limpiarFiltrosHistorial;
window.verDetalleLote = verDetalleLote;
window.irAPerfilAlumno = irAPerfilAlumno;
window.toggleCustomTime = toggleCustomTime;
window.stepHour = stepHour;
window.stepMin = stepMin;
window.validateTimeDigits = validateTimeDigits;
window.formatTimeBlur = formatTimeBlur;
window.setTimePreset = setTimePreset;
window.abrirModalNuevaProgramacion = abrirModalNuevaProgramacion;
window.guardarNuevaProgramacion = guardarNuevaProgramacion;
window.abrirModalEditarProgramacion = abrirModalEditarProgramacion;
window.guardarEdicionProgramacion = guardarEdicionProgramacion;
window.eliminarProgramacion = eliminarProgramacion;
window.togglePausa = togglePausa;
window.ejecutarEmisionMasiva = ejecutarEmisionMasiva;
window.ejecutarProgramacionAhora = ejecutarProgramacionAhora;
window.reiniciarDataDemo = reiniciarDataDemo;
window.descargarReporteLote = descargarReporteLote;
window.quitarCursoCertificacion = quitarCursoCertificacion;
window.abrirModalAgregarCurso = abrirModalAgregarCurso;
window.filtrarCursosDisponibles = filtrarCursosDisponibles;
window.agregarCursoCertificacion = agregarCursoCertificacion;
window.setWorkflowRole = setWorkflowRole;
window.aprobarPasoWorkflow = aprobarPasoWorkflow;
window.reiniciarWorkflowFirmas = reiniciarWorkflowFirmas;
window.renderCintilloWorkflowCertificaciones = renderCintilloWorkflowCertificaciones;
window.abrirModalRefrendoCertificaciones = abrirModalRefrendoCertificaciones;
window.ejecutarFirmaDesdeCertificaciones = ejecutarFirmaDesdeCertificaciones;
window.reiniciarWorkflowDesdeCertificaciones = reiniciarWorkflowDesdeCertificaciones;
window.renderPage = renderPage;

// Inicialización de la vista
renderPage();
