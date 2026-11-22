// admin/registrar.js - Registrar Trámite Wiener Admin

const ctx = APP.renderShell('registrar');
const session = ctx ? ctx.session : null;

// Constantes institucionales completas
const INST_WIENER = 'Universidad Privada Norbert Wiener';
const INST_CARRION = 'Instituto de Educación Superior Daniel Alcides Carrión';

// Estado local de la vista
let instSeleccionada = INST_WIENER;
let queryBusqueda = '';
let alumnoSeleccionado = null;
let carreraSeleccionada = '';
let tramiteSeleccionadoId = '';
let tramitesHabilitados = [];

// Archivos adjuntos para el modal
let MODAL_FILES = {};

// Comprobar si el administrativo cuenta con permiso para registrar
function tienePermisoRegistro() {
  if (!session) return false;
  const u = DB.getUsuario(session.id);
  if (!u) return false;
  if (u.rol !== 'administrativo') return false;
  return (u.permisos || []).includes('registrar');
}

// Formateador de fecha/hora en vivo
function obtenerFechaHoraTexto() {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const now = new Date();
  const diaSemana = dias[now.getDay()];
  const dia = now.getDate();
  const mes = meses[now.getMonth()];
  const anio = now.getFullYear();
  let horas = now.getHours();
  const minutos = String(now.getMinutes()).padStart(2, '0');
  const segundos = String(now.getSeconds()).padStart(2, '0');
  const ampm = horas >= 12 ? 'pm' : 'am';
  horas = horas % 12 || 12;
  const horasStr = String(horas).padStart(2, '0');
  return `${diaSemana} ${dia} de ${mes} del ${anio}, ${horasStr}:${minutos}:${segundos} ${ampm}`;
}

function iniciarReloj() {
  setInterval(() => {
    const el = document.getElementById('live-clock-text');
    if (el) el.textContent = obtenerFechaHoraTexto();
  }, 1000);
}

// Cambio de institución
function cambiarInstitucion(nombreInst) {
  instSeleccionada = nombreInst;
  alumnoSeleccionado = null;
  carreraSeleccionada = '';
  tramiteSeleccionadoId = '';
  queryBusqueda = '';
  renderizarVista();
}

// Ejecutar búsqueda de alumnos
function ejecutarBusqueda() {
  const input = document.getElementById('search-alumno-input');
  queryBusqueda = (input ? input.value : '').trim();
  renderizarResultadosBusqueda();
}

function renderizarResultadosBusqueda() {
  const contenedor = document.getElementById('search-results-area');
  if (!contenedor) return;

  if (!queryBusqueda) {
    contenedor.innerHTML = '';
    return;
  }

  const resultados = DB.buscarAlumnos(queryBusqueda, instSeleccionada);

  if (!resultados.length) {
    contenedor.innerHTML = `
      <div class="alert warn alert-warn-reg">
        ⚠️ No se encontraron alumnos con el término «<b>${queryBusqueda}</b>» en <b>${instSeleccionada}</b>.
        Verifica el código, número de DNI o nombres e intenta nuevamente.
      </div>`;
    return;
  }

  contenedor.innerHTML = `
    <div class="reg-results-wrap">
      <table class="reg-results-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombres y Apellidos</th>
            <th>DNI</th>
            <th>Institución</th>
            <th>Carrera(s)</th>
            <th class="th-action-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          ${resultados.map(alu => {
            const carreras = alu.carreras || [alu.perfil ? alu.perfil.programa : 'Carrera regular'];
            return `
              <tr>
                <td><b class="code-badge">${alu.codigo}</b></td>
                <td><b>${alu.nombre}</b></td>
                <td>${alu.dni}</td>
                <td><span class="pill gray pill-student-inst">${alu.institucion || instSeleccionada}</span></td>
                <td>${carreras.join(' · ')}</td>
                <td class="td-action-right">
                  <button class="btn-add-student" onclick="seleccionarAlumno('${alu.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Agregar</span>
                  </button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// Seleccionar y setear alumno en pantalla
function seleccionarAlumno(aluId) {
  const alu = DB.getUsuario(aluId);
  if (!alu) return;

  alumnoSeleccionado = alu;
  const carreras = alu.carreras && alu.carreras.length ? alu.carreras : [alu.perfil ? alu.perfil.programa : 'Carrera general'];
  carreraSeleccionada = carreras[0];
  tramiteSeleccionadoId = '';

  // Ocultar resultados de búsqueda
  queryBusqueda = '';
  const contenedor = document.getElementById('search-results-area');
  if (contenedor) contenedor.innerHTML = '';
  const input = document.getElementById('search-alumno-input');
  if (input) input.value = '';

  actualizarTramitesDisponibles();
  renderizarVista();

  APP.toast({
    icon: '👤',
    title: 'Alumno seleccionado',
    body: `${alu.nombre} (${alu.codigo}) listo para registro de trámite.`
  });
}

// Actualiza lista de trámites que tiene habilitados el alumno según elegibilidad
function actualizarTramitesDisponibles() {
  if (!alumnoSeleccionado) {
    tramitesHabilitados = [];
    return;
  }

  const all = DB.tramites().filter(t => t.activo);
  const perfilMock = Object.assign({}, alumnoSeleccionado.perfil || {
    nivel: 'pregrado',
    ciclo: 4,
    creditos: 80,
    tercioSuperior: false,
    quintoSuperior: false,
    promedio: 14.5
  }, {
    programa: carreraSeleccionada
  });

  // Filtra por elegibilidad
  tramitesHabilitados = all.filter(t => DB.elegible(t, perfilMock));
  if (!tramitesHabilitados.some(t => t.id === tramiteSeleccionadoId)) {
    tramiteSeleccionadoId = tramitesHabilitados.length ? tramitesHabilitados[0].id : '';
  }
}

function cambiarCarrera(carrera) {
  carreraSeleccionada = carrera;
  actualizarTramitesDisponibles();
  renderizarBloqueTramites();
}

function cambiarTramite(tId) {
  tramiteSeleccionadoId = tId;
  renderizarPreviewTramite();
}

function limpiarFormulario() {
  alumnoSeleccionado = null;
  carreraSeleccionada = '';
  tramiteSeleccionadoId = '';
  queryBusqueda = '';
  renderizarVista();
}

function salirModulo() {
  location.href = 'solicitudes.html';
}

// =========================================================================
// MODAL DE REGISTRO ASISTIDO DEL TRÁMITE
// =========================================================================
function abrirModalSolicitud() {
  if (!alumnoSeleccionado || !tramiteSeleccionadoId) {
    APP.toast({
      icon: '⚠️',
      title: 'Selección incompleta',
      body: 'Debes seleccionar un alumno y un trámite disponible para continuar.'
    });
    return;
  }

  const t = DB.getTramite(tramiteSeleccionadoId);
  if (!t) return;

  MODAL_FILES = {};
  const reqs = t.requisitos || [];
  const slaExacto = APP.calcSLA(t.diasEntrega);

  const requisitosHtml = reqs.length ? reqs.map((r, idx) => `
    <div class="req-upload-block" id="req-block-${r.id}">
      <div class="req-title-line">
        <b>${idx + 1}. ${r.titulo}</b>
        <span class="pill warn pill-warn-sm">Obligatorio</span>
      </div>
      ${r.condiciones ? `
        <div class="req-condition-box">
          📌 <b>Especificaciones requeridas:</b> ${r.condiciones}
        </div>` : ''}
      <div class="req-file-dropzone" onclick="document.getElementById('file-input-${r.id}').click()">
        <input type="file" id="file-input-${r.id}" class="dropzone-input" accept=".pdf,.jpg,.jpeg,.png" onchange="handleModalFileSelect('${r.id}', event)">
        <div class="dropzone-icon">📎</div>
        <div class="dropzone-main-text">Haz clic para adjuntar archivo o arrástralo aquí</div>
        <div class="dropzone-sub-text">Formatos permitidos: ${r.tipoArchivo || 'PDF, JPG o PNG'} (máx. ${r.tamanoMax || '5 MB'})</div>
      </div>
      <div id="req-preview-${r.id}"></div>
    </div>
  `).join('') : `
    <div class="alert info alert-info-reg">
      ✓ Este trámite es 100% digital y no requiere que el alumno presente documentos de sustento previos.
    </div>`;

  APP.openModal(`
    <div class="modal-head">
      <div>
        <h3>Registrar trámite para alumno</h3>
        <span class="modal-sub-meta">Expediente institucional a nombre del estudiante</span>
      </div>
      <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
    </div>

    <div class="modal-body">
      <!-- Ficha rápida del alumno -->
      <div class="student-summary-box">
        <div class="student-summary-name">${alumnoSeleccionado.nombre}</div>
        <div class="student-summary-meta">
          <span>Código: <b>${alumnoSeleccionado.codigo}</b></span>
          <span>·</span>
          <span>DNI: <b>${alumnoSeleccionado.dni}</b></span>
          <span>·</span>
          <span>Carrera: <b>${carreraSeleccionada}</b></span>
          <span>·</span>
          <span>Institución: <b>${instSeleccionada}</b></span>
        </div>
      </div>

      <!-- Resumen de costos y plazo -->
      <dl class="kv kv-margin-sm">
        <dt>Trámite</dt><dd><b>${t.nombre}</b></dd>
        <dt>Costo oficial</dt><dd><b class="cost-val-bold">${APP.money(t.costo)}</b></dd>
        <dt>Plazo de atención</dt><dd>${slaExacto} (${t.diasEntrega} días hábiles)</dd>
        <dt>Área responsable</dt><dd>${t.area || 'Registros Académicos'}</dd>
      </dl>

      <!-- Formulario administrativo -->
      <div class="field full field-mb-14">
        <label for="sol-motivo">Motivo de la solicitud *</label>
        <select class="select" id="sol-motivo">
          <option value="Trámite laboral" selected>Trámite laboral</option>
          <option value="Trámite bancario">Trámite bancario</option>
          <option value="Beca de estudios">Beca de estudios</option>
          <option value="Trámite migratorio / Visa">Trámite migratorio / Visa</option>
          <option value="Continuidad de estudios">Continuidad de estudios</option>
          <option value="Trámite de Grado y Título">Trámite de Grado y Título</option>
          <option value="Personal / Otro">Personal / Otro</option>
        </select>
      </div>

      <div class="field full field-mb-16">
        <label for="sol-coment">Observación / Nota administrativa (opcional)</label>
        <textarea class="input" id="sol-coment" rows="2" placeholder="Notas internas para el área de atención..."></textarea>
      </div>

      <div class="field full field-mb-16">
        <label for="sol-pago-modo">Estado de pago del trámite *</label>
        <select class="select" id="sol-pago-modo" onchange="togglePagoVentanilla(this.value)">
          ${Number(t.costo) === 0 ? `
            <option value="exonerado" selected>Exonerado / Trámite costo cero (S/ 0.00)</option>
          ` : `
            <option value="caja" selected>Pago ya abonado en caja / banco institucional</option>
            <option value="pendiente">Pago pendiente en cuenta corriente del alumno</option>
          `}
        </select>
      </div>

      <div id="campo-nro-operacion" class="field full field-mb-16 ${Number(t.costo) === 0 ? 'field-operacion-hidden' : ''}">
        <label for="sol-nro-recibo">N° de Operación / Recibo de caja</label>
        <input class="input" id="sol-nro-recibo" placeholder="Ej. REC-2026-88192 o código de operación bancaria" value="REC-2026-${Math.floor(100000 + Math.random() * 900000)}">
      </div>

      <!-- Sección de requisitos y adjuntos -->
      <div class="section-label section-label-adjuntos">Documentos y adjuntos requeridos</div>
      ${requisitosHtml}
    </div>

    <div class="modal-foot">
      <button class="btn" onclick="APP.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarRegistroTramite('${t.id}')">
        Confirmar y registrar trámite
      </button>
    </div>
  `, { wide: true });
}

function togglePagoVentanilla(val) {
  const campo = document.getElementById('campo-nro-operacion');
  if (campo) {
    campo.style.display = val === 'caja' ? 'block' : 'none';
  }
}

function handleModalFileSelect(reqId, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  MODAL_FILES[reqId] = file.name;
  const preview = document.getElementById('req-preview-' + reqId);
  if (preview) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    preview.innerHTML = `
      <div class="req-file-preview">
        <div class="req-file-preview-info">
          <span class="file-preview-icon">📄</span>
          <div>
            <b>${file.name}</b>
            <span>${sizeMb > 0 ? sizeMb : '0.4'} MB · Documento adjuntado correctamente</span>
          </div>
        </div>
        <button class="btn btn-sm btn-ghost btn-remove-file" type="button" onclick="removeModalFile('${reqId}', event)">✕ Quitar</button>
      </div>`;
  }
}

function removeModalFile(reqId, event) {
  if (event) event.stopPropagation();
  delete MODAL_FILES[reqId];
  const input = document.getElementById('file-input-' + reqId);
  if (input) input.value = '';
  const preview = document.getElementById('req-preview-' + reqId);
  if (preview) preview.innerHTML = '';
}

// Confirmación final del trámite en DB
function confirmarRegistroTramite(tramiteId) {
  const t = DB.getTramite(tramiteId);
  if (!t || !alumnoSeleccionado) return;

  const reqs = t.requisitos || [];
  // Validar que todos los requisitos tengan archivo
  for (const r of reqs) {
    if (!MODAL_FILES[r.id]) {
      APP.toast({
        icon: '⚠️',
        title: 'Falta adjunto obligatorio',
        body: `Debes adjuntar el documento para «${r.titulo}».`
      });
      return;
    }
  }

  const motivoEl = document.getElementById('sol-motivo');
  const motivo = motivoEl ? motivoEl.value : 'Trámite laboral';
  const comentEl = document.getElementById('sol-coment');
  const comentario = comentEl ? comentEl.value.trim() : '';
  const pagoModoEl = document.getElementById('sol-pago-modo');
  const pagoModo = pagoModoEl ? pagoModoEl.value : 'caja';
  const reciboEl = document.getElementById('sol-nro-recibo');
  const nroRecibo = reciboEl ? reciboEl.value.trim() : '';

  const esGratis = Number(t.costo) === 0;
  const esPagado = pagoModo === 'caja' || esGratis;

  // Generar correlativo de expediente
  const ticketNum = '2026.' + (43545 + DB.solicitudes().length);
  const adminNombre = session ? session.nombre : 'Personal Administrativo';
  const adminCodigo = session ? session.codigo : 'ADM';

  // Estructurar array de requisitos con los archivos reales cargados
  const requisitosRegistrados = reqs.map((r, idx) => ({
    id: r.id || ('REQ-0' + (idx + 1)),
    orden: idx + 1,
    titulo: r.titulo,
    condiciones: r.condiciones || '',
    archivo: MODAL_FILES[r.id] || 'DOCUMENTO.pdf',
    tipoArchivo: (MODAL_FILES[r.id] && MODAL_FILES[r.id].toUpperCase().endsWith('.JPG')) ? 'JPG' : 'PDF',
    cumple: true,
    especificacion: r.condiciones || 'Documento presentado'
  }));

  const nuevaSolicitud = {
    id: ticketNum,
    ticket: ticketNum,
    sedeCodigo: '7803-2',
    sede: '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
    institucion: instSeleccionada,
    tramiteId: t.id,
    tramiteNombre: t.nombre,
    carrera: carreraSeleccionada,
    periodo: '2026-2',
    seccion: 'REG-ADM',
    alumnoId: alumnoSeleccionado.id,
    alumnoCodigo: alumnoSeleccionado.codigo,
    alumnoNombre: alumnoSeleccionado.nombre,
    alumnoDni: alumnoSeleccionado.dni,
    alumnoEmail: alumnoSeleccionado.email,
    alumnoTelefono: alumnoSeleccionado.telefono || alumnoSeleccionado.celular || '976220435',
    alumnoCelular: alumnoSeleccionado.celular || alumnoSeleccionado.telefono || '51970530682',
    estado: 'Solicitado',
    activo: true,
    fecha: APP.todayISO(),
    fechaHora: APP.nowStamp(),
    costo: t.costo,
    conceptoCodigo: t.conceptoCodigo || '01010000',
    pago: {
      estado: esPagado ? 'pagado' : 'pendiente',
      obligacionGenerada: true,
      monto: t.costo,
      carrera: carreraSeleccionada,
      nroDocumento: esPagado ? (nroRecibo || 'REC-CAJA-001') : 'NB-PENDIENTE',
      fechaPago: esPagado ? APP.todayISO() : null
    },
    detalle: comentario ? `Trámite registrado por ${adminNombre}. Motivo: ${motivo}. Detalle: ${comentario}` : `Trámite registrado por ${adminNombre}. Motivo: ${motivo}.`,
    requisitos: requisitosRegistrados,
    proceso: [
      {
        orden: 1,
        area: t.area || 'Registros Académicos',
        plazoHoras: (t.diasEntrega || 3) * 24,
        diasRetraso: 0,
        observacionInterna: `Trámite ingresado por mesa administrativa (${adminNombre} - ${adminCodigo}).`,
        estado: 'Pendiente',
        fechaAtencion: null
      }
    ],
    mensajeSolicitante: `Estimado(a) ${alumnoSeleccionado.nombre}, tu trámite de ${t.nombre} ha sido registrado por la oficina de Registros Académicos.`,
    historial: [
      {
        estado: 'Solicitado',
        fecha: APP.nowStamp(),
        nota: `Trámite registrado por el personal administrativo ${adminNombre} (${adminCodigo}) a solicitud del alumno.`
      }
    ]
  };

  if (esPagado && !esGratis) {
    nuevaSolicitud.historial.push({
      estado: 'Solicitado',
      fecha: APP.nowStamp(),
      nota: `Pago confirmado en caja/banco. Comprobante N°: ${nroRecibo || 'REC-CAJA'}`
    });
  }

  DB.addSolicitud(nuevaSolicitud);

  // Envío de correo simulado
  APP.sendMail({
    to: alumnoSeleccionado.email,
    cc: 'mesadepartes@uwiener.edu.pe',
    subject: `Expediente ${ticketNum} registrado - ${t.nombre}`,
    lines: [
      `Estimado(a) <b>${alumnoSeleccionado.nombre}</b>,`,
      `La administración de <b>${instSeleccionada}</b> ha registrado satisfactoriamente tu trámite de <b>${t.nombre}</b>.`,
      `N° de Expediente: <b>${ticketNum}</b>.`,
      `Carrera: <b>${carreraSeleccionada}</b>.`,
      `Fecha estimada de resolución: <b>${APP.calcSLA(t.diasEntrega)}</b>.`,
      esPagado ? `Estado de pago: Abonado (${APP.money(t.costo)}).` : `Pago pendiente de regularización: ${APP.money(t.costo)}.`
    ]
  });

  APP.closeModal();

  APP.toast({
    icon: '✅',
    title: '¡Trámite registrado con éxito!',
    body: `Expediente ${ticketNum} generado para ${alumnoSeleccionado.nombre}.`
  });

  // Confirmación modal con opciones de navegación
  setTimeout(() => {
    APP.openModal(`
      <div class="modal-head">
        <h3>¡Trámite Registrado Exitosamente!</h3>
        <button class="modal-close" onclick="APP.closeModal()">×</button>
      </div>
      <div class="modal-body modal-body-success">
        <div class="success-icon-big">🎉</div>
        <h2 class="success-title-ticket">Expediente N° ${ticketNum}</h2>
        <p class="success-desc-text">
          Se ha generado con éxito la solicitud de <b>${t.nombre}</b> para el alumno <b>${alumnoSeleccionado.nombre}</b> en <b>${instSeleccionada}</b>.
        </p>
        <div class="success-actions-row">
          <button class="btn btn-ghost" onclick="APP.closeModal();limpiarFormulario();">
            Registrar otro trámite
          </button>
          <a class="btn btn-primary" href="solicitudes.html">
            Ir a Vista de Trámites
          </a>
        </div>
      </div>
    `, { wide: false });
  }, 500);
}

// =========================================================================
// RENDERIZADO PRINCIPAL DE LA VISTA
// =========================================================================
function renderizarPreviewTramite() {
  const contenedor = document.getElementById('reg-tram-preview-area');
  const btnSolicitar = document.getElementById('btn-solicitar');
  if (!contenedor) return;

  if (!tramiteSeleccionadoId) {
    contenedor.innerHTML = '';
    if (btnSolicitar) btnSolicitar.disabled = true;
    return;
  }

  const t = DB.getTramite(tramiteSeleccionadoId);
  if (!t) {
    contenedor.innerHTML = '';
    if (btnSolicitar) btnSolicitar.disabled = true;
    return;
  }

  const reqs = t.requisitos || [];
  const slaExacto = APP.calcSLA(t.diasEntrega);

  contenedor.innerHTML = `
    <div class="reg-tram-preview-card">
      <div class="reg-tram-preview-info">
        <b>${t.nombre} (${t.tipo})</b>
        <span>Área gestora: <b>${t.area}</b> · Plazo de entrega: <b>${slaExacto}</b> (${t.diasEntrega} días hábiles) · Modalidad: <b>${t.pagoMomento === 'antes' ? 'Pago al solicitar' : 'Pago tras aprobación'}</b></span>
        ${t.requiereAdjunto ? `
          <div class="tram-preview-warn">
            ⚠️ Requiere que se adjunten documentos: ${reqs.map(r => r.titulo).join(', ')}
          </div>` : `
          <div class="tram-preview-success">
            ✓ Trámite 100% digital, no requiere adjuntos de sustento.
          </div>`}
      </div>
      <div class="tram-preview-price-box">
        <div class="tram-preview-price-val">${APP.money(t.costo)}</div>
        <div class="tram-preview-price-sub">Tasa institucional oficial</div>
      </div>
    </div>`;

  if (btnSolicitar) btnSolicitar.disabled = false;
}

function renderizarBloqueTramites() {
  const selectTramites = document.getElementById('sel-tramite');
  if (!selectTramites) return;

  if (!tramitesHabilitados.length) {
    selectTramites.innerHTML = `<option value="">-- No tiene Trámites disponibles. --</option>`;
    selectTramites.disabled = true;
    tramiteSeleccionadoId = '';
  } else {
    selectTramites.disabled = false;
    selectTramites.innerHTML = tramitesHabilitados.map(t => `
      <option value="${t.id}" ${t.id === tramiteSeleccionadoId ? 'selected' : ''}>
        ${t.nombre} · ${APP.money(t.costo)} · (${t.diasEntrega} días hábiles)
      </option>
    `).join('');
    if (!tramiteSeleccionadoId && tramitesHabilitados.length) {
      tramiteSeleccionadoId = tramitesHabilitados[0].id;
    }
  }

  if (APP && APP.enhanceSelect) {
    APP.enhanceSelect(selectTramites, (newVal) => {
      cambiarTramite(newVal);
    });
  }

  renderizarPreviewTramite();
}

function renderizarVista() {
  const tienePermiso = tienePermisoRegistro();

  ctx.mount.innerHTML = `
    <!-- Cabecera de la página con reloj en vivo -->
    <div class="reg-top-bar">
      <div>
        <h1>Registrar trámite</h1>
        <p>Atención asistida: Búsqueda de alumnos y registro oficial de trámites documentarios por personal administrativo autorizado.</p>
      </div>
      <div class="reg-live-clock">
        <span class="clock-dot"></span>
        <span id="live-clock-text">${obtenerFechaHoraTexto()}</span>
      </div>
    </div>

    ${!tienePermiso ? `
      <div class="alert warn alert-restricted">
        <div class="restricted-title">⚠️ Acceso Restringido</div>
        Tu cuenta administrativa no cuenta con el permiso <b>«Registrar trámites»</b> asignado. Solicita al administrador de seguridad la habilitación de este módulo para gestionar trámites en nombre de estudiantes.
      </div>
    ` : ''}

    <div class="${!tienePermiso ? 'disabled-wrapper' : ''}">
      <!-- Paso 1: Selección de Institución (con nombres completos) -->
      <div class="reg-inst-card">
        <div class="reg-inst-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 3h12l3 4H3l3-4zM9 10v4M15 10v4M9 17v4M15 17v4"/></svg>
          <span>1. Selecciona la Institución Educativa</span>
        </div>
        <div class="reg-inst-grid">
          <div class="reg-inst-option ${instSeleccionada === INST_WIENER ? 'selected' : ''}" onclick="cambiarInstitucion('${INST_WIENER}')">
            <div class="reg-inst-radio"></div>
            <div class="reg-inst-info">
              <b>${INST_WIENER}</b>
              <span>Programas de Pregrado, Posgrado y Segundas Especialidades</span>
            </div>
          </div>

          <div class="reg-inst-option ${instSeleccionada === INST_CARRION ? 'selected' : ''}" onclick="cambiarInstitucion('${INST_CARRION}')">
            <div class="reg-inst-radio"></div>
            <div class="reg-inst-info">
              <b>${INST_CARRION}</b>
              <span>Carreras Técnicas y Programas de Formación Continua</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paso 2: Buscador de alumno (por código, nombres o DNI) -->
      <div class="reg-search-card">
        <div class="reg-inst-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>2. Búsqueda de Alumno en ${instSeleccionada}</span>
        </div>
        <div class="reg-search-row">
          <div class="reg-search-input-wrap">
            <span class="search-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input id="search-alumno-input" placeholder="Buscar alumno por código (ej. 2025101851), DNI o nombres y apellidos..." value="${queryBusqueda}" onkeydown="if(event.key==='Enter') ejecutarBusqueda()">
          </div>
          <button class="reg-search-btn" type="button" onclick="ejecutarBusqueda()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Buscar</span>
          </button>
        </div>

        <!-- Área de resultados de búsqueda -->
        <div id="search-results-area"></div>
      </div>

      <!-- Paso 3: Formulario seteado del alumno -->
      ${alumnoSeleccionado ? `
        <div class="reg-student-form-card">
          <!-- Sección Datos Personales -->
          <div class="reg-section-title">Datos Personales:</div>

          <!-- Fila 1: Alumnos / Código y Botón Buscar -->
          <div class="reg-form-row">
            <div class="reg-form-field field-max-380">
              <label for="f-alumno-cod">Alumnos:</label>
              <div class="reg-student-search-inline">
                <input class="reg-form-input" id="f-alumno-cod" readonly value="${alumnoSeleccionado.codigo}">
                <button class="btn-inline-search" type="button" onclick="document.getElementById('search-alumno-input').focus();">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span>Buscar</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Fila 2: Nombres completos -->
          <div class="reg-form-row">
            <div class="reg-form-field">
              <label for="f-alumno-nom">Nombres:</label>
              <input class="reg-form-input" id="f-alumno-nom" readonly value="${alumnoSeleccionado.nombre}">
            </div>
          </div>

          <!-- Fila 3: DNI, E-mail y Teléfono -->
          <div class="reg-form-row">
            <div class="reg-form-field">
              <label for="f-alumno-dni">DNI:</label>
              <input class="reg-form-input" id="f-alumno-dni" readonly value="${alumnoSeleccionado.dni}">
            </div>
            <div class="reg-form-field field-flex-16">
              <label for="f-alumno-email">E-mail:</label>
              <input class="reg-form-input" id="f-alumno-email" readonly value="${alumnoSeleccionado.email}">
            </div>
            <div class="reg-form-field">
              <label for="f-alumno-tel">Teléfono:</label>
              <input class="reg-form-input" id="f-alumno-tel" readonly value="${alumnoSeleccionado.telefono || '976220435'}">
            </div>
          </div>

          <!-- Fila 4: Celular -->
          <div class="reg-form-row">
            <div class="reg-form-field field-max-380">
              <label for="f-alumno-cel">Celular:</label>
              <input class="reg-form-input" id="f-alumno-cel" readonly value="${alumnoSeleccionado.celular || '51970530682'}">
            </div>
          </div>

          <!-- Fila 5: Select de Carrera (admite múltiples carreras) -->
          <div class="reg-form-row">
            <div class="reg-form-field">
              <label for="f-alumno-carrera">Carrera:</label>
              <div class="custom-select-container">
                <select class="reg-form-select" id="f-alumno-carrera" onchange="cambiarCarrera(this.value)">
                  ${(alumnoSeleccionado.carreras || [carreraSeleccionada]).map(c => `
                    <option value="${c}" ${c === carreraSeleccionada ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Sección Trámite(s) Disponible(s) -->
          <div class="reg-section-title section-title-mt28">Trámite(s) Disponible(s):</div>

          <div class="reg-form-row">
            <div class="reg-form-field">
              <label for="sel-tramite">Tramites:</label>
              <div class="custom-select-container">
                <select class="reg-form-select" id="sel-tramite" onchange="cambiarTramite(this.value)">
                  <!-- Se inyecta dinámicamente -->
                </select>
              </div>
            </div>
          </div>

          <!-- Previsualización del trámite seleccionado -->
          <div id="reg-tram-preview-area"></div>

          <!-- Botones de Acción: Nuevo, Salir y Solicitar Trámite -->
          <div class="reg-footer-actions">
            <button class="btn-nuevo" type="button" onclick="limpiarFormulario()">
              <span>Nuevo</span>
            </button>
            <button class="btn-salir" type="button" onclick="salirModulo()">
              <span>Salir</span>
            </button>
            <button class="btn-solicitar-tramite" id="btn-solicitar" type="button" onclick="abrirModalSolicitud()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              <span>Solicitar trámite</span>
            </button>
          </div>
        </div>
      ` : `
        <div class="card card-no-student">
          <div class="no-student-icon">👥</div>
          <div class="no-student-title">No hay ningún alumno seleccionado</div>
          <div class="no-student-desc">
            Utiliza el buscador superior para buscar un alumno por código, nombres o DNI y haz clic en <b>«+ Agregar»</b> para cargar sus datos y trámites disponibles.
          </div>
        </div>
      `}
    </div>
  `;

  if (alumnoSeleccionado) {
    renderizarBloqueTramites();
  }

  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(ctx.mount);
  }
}

// Exponer globalmente
window.cambiarInstitucion = cambiarInstitucion;
window.ejecutarBusqueda = ejecutarBusqueda;
window.seleccionarAlumno = seleccionarAlumno;
window.cambiarCarrera = cambiarCarrera;
window.cambiarTramite = cambiarTramite;
window.limpiarFormulario = limpiarFormulario;
window.salirModulo = salirModulo;
window.abrirModalSolicitud = abrirModalSolicitud;
window.togglePagoVentanilla = togglePagoVentanilla;
window.handleModalFileSelect = handleModalFileSelect;
window.removeModalFile = removeModalFile;
window.confirmarRegistroTramite = confirmarRegistroTramite;

iniciarReloj();
renderizarVista();
