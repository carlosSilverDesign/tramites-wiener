/* ==========================================================================
   VISTA: SOLICITAR TRÁMITE (alumno/solicitar.js)
   Universidad Norbert Wiener - Sistema de Trámites
   ========================================================================== */

const ctx = APP.renderShell('solicitar');
const me = DB.getUsuario(ctx.session.id);
const perfil = me.perfil;

const SVG_ICONS = {
  arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="btn-arrow btn-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowLeft: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="btn-arrow btn-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  attachment: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
  checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="spec-ico"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  search: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
};

let searchTxt = '';
let intencionSel = 'todos';
let CURRENT_FILE = null;

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

function renderCatalog() {
  const all = DB.tramites();
  const elegibles = all.filter(t => DB.elegible(t, perfil));
  const noEleg = all.filter(t => t.activo && !DB.elegible(t, perfil));

  // Filtro reactivo por búsqueda y por categoría de intención
  const specificIntents = ['beca', 'certificaciones', 'practicas', 'grado', 'carne'];
  let filtrados = elegibles.filter(t => {
    const fullTxt = (t.nombre + ' ' + t.descripcion + ' ' + t.tipo + ' ' + t.area).toLowerCase();
    const matchText = !searchTxt || fullTxt.includes(searchTxt);

    const tNombre = (t.nombre || '').toLowerCase();
    const tTipo = (t.tipo || '').toLowerCase();
    const tArea = (t.area || '').toLowerCase();
    const tIntenciones = Array.isArray(t.intenciones) ? t.intenciones : [];

    let matchIntent = false;
    if (intencionSel === 'todos') {
      matchIntent = true;
    } else if (intencionSel === 'beca') {
      matchIntent = tIntenciones.includes('beca') || tNombre.includes('beca') || tNombre.includes('descuento');
    } else if (intencionSel === 'certificaciones') {
      matchIntent = tIntenciones.includes('certificaciones') || tTipo === 'certificado' || tNombre.includes('certific');
    } else if (intencionSel === 'practicas') {
      matchIntent = tIntenciones.includes('practicas') || tNombre.includes('práctica') || tNombre.includes('tercio') || tNombre.includes('estudios') || tNombre.includes('certific');
    } else if (intencionSel === 'grado') {
      matchIntent = tIntenciones.includes('grado') || tArea.includes('grados') || tNombre.includes('grado') || tNombre.includes('egreso') || tNombre.includes('estudios');
    } else if (intencionSel === 'carne') {
      matchIntent = tIntenciones.includes('carne') || tTipo.includes('carné') || tTipo.includes('carne') || tNombre.includes('carné') || tNombre.includes('carne');
    } else if (intencionSel === 'otros') {
      matchIntent = tIntenciones.includes('otros') || tIntenciones.includes('matricula') || (!tIntenciones.some(i => specificIntents.includes(i)) && !tNombre.includes('beca') && !tNombre.includes('carné') && !tNombre.includes('certific'));
    }

    return matchText && matchIntent;
  });

  const cardsHtml = filtrados.map(t => {
    const slaExacto = APP.calcSLA(t.diasEntrega);
    const esCambioModalidad = t.id === 'T-004' || (t.nombre && t.nombre.toLowerCase().includes('cambio de modalidad'));

    let specsHtml = '';
    if (esCambioModalidad) {
      specsHtml = `
        <span class="spec-item spec-item-success">
          <span class="spec-ico">${SVG_ICONS.checkCircle}</span>
          <span>Trámite automático</span>
        </span>
        <span class="spec-item spec-item-info">
          <svg class="spec-svg-fixed" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Aprobación con consentimiento</span>
        </span>`;
    } else {
      specsHtml = `
        <span class="spec-item">
          <span class="spec-ico">${SVG_ICONS.clock}</span>
          <span>Entrega estimada: ${(t.id === 'T-010' || (t.nombre && t.nombre.toLowerCase().includes('certificación')) || t.diasEntrega === 0) ? '<b>Inmediata</b>' : `<b>${slaExacto}</b> (${t.diasEntrega} días hábiles)`}</span>
        </span>
        ${t.requiereAdjunto ? `
          <span class="spec-item spec-item-warn">
            <span class="spec-ico">${SVG_ICONS.attachment}</span>
            <span>Requiere adjuntar sustento</span>
          </span>` : `
          <span class="spec-item spec-item-success-light">
            <span class="spec-ico">${SVG_ICONS.checkCircle}</span>
            <span>Emisión 100% digital</span>
          </span>`}`;
    }

    let priceHtml = '';
    if (esCambioModalidad || !(t.costo > 0)) {
      priceHtml = `
        <div class="tram-price-main tram-price-free">Gratuito</div>
        <div class="tram-price-sub">Trámite sin costo</div>`;
    } else {
      priceHtml = `
        <div class="tram-price-main">${APP.money(t.costo)}</div>
        <div class="tram-price-sub">Tasa oficial · Incluye IGV</div>`;
    }

    return `
      <div class="tram-card">
        <!-- Kicker de categoría -->
        <div class="tram-header">
          <span class="tram-category-text">${t.tipo} · ${t.area}</span>
        </div>

        <!-- Título -->
        <h3 class="tram-title">${t.nombre}</h3>
        
        <!-- Descripción -->
        <p class="tram-desc">${t.descripcion}</p>

        <!-- Especificaciones -->
        <div class="tram-specs-line">
          ${specsHtml}
        </div>

        <!-- Footer: Precio y acciones -->
        <div class="tram-foot">
          <div class="tram-price-wrap">
            ${priceHtml}
          </div>
          <div class="tram-actions">
            ${DOC.getPlantilla(t).generaDocumento ? `<button class="btn btn-ghost" onclick="DOC.preview(DB.getTramite('${t.id}'), me, null, {modelo:true})">Ver modelo</button>` : ''}
            <button class="btn btn-primary" onclick="abrirSolicitud('${t.id}')">Solicitar trámite ${SVG_ICONS.arrowRight}</button>
          </div>
        </div>
      </div>`;
  }).join('');

  const noElegHtml = noEleg.length ? `
    <div class="section-label section-label-no-eleg">
      Trámites no habilitados para tu ciclo o carrera
    </div>
    <div class="card no-eleg-card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th class="table-pad-col">Trámite</th>
              <th>Tipo</th>
              <th>Requisitos que solicita</th>
              <th class="table-right-col">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${noEleg.map(t => `
              <tr>
                <td class="table-pad-col"><b class="no-eleg-title">${t.nombre}</b></td>
                <td class="muted">${t.tipo}</td>
                <td class="muted">${DB.audienciaTexto(t.audiencia).join(' · ')}</td>
                <td class="table-right-col"><span class="pill gray">No habilitado</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : '';

  document.getElementById('catalog-grid').innerHTML = cardsHtml || `
    <div class="card card-span-all">
      <div class="empty-state">
        <div class="ico empty-catalog-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="empty-catalog-title">No encontramos trámites con esa búsqueda</div>
        <div class="empty-catalog-sub">Prueba buscando otra palabra clave o selecciona otra categoría.</div>
        <button class="btn btn-sm" onclick="setQ('');setIntencion('todos');">Ver todos los trámites</button>
      </div>
    </div>`;

  document.getElementById('catalog-no-eleg').innerHTML = noElegHtml;
}

function initView() {
  ctx.mount.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Catálogo de trámites estudiantiles</h1>
        <p>Emisión de constancias y certificados oficiales con código de verificación QR y firma digital.</p>
      </div>
      <a class="btn" href="mis-tramites.html">Ver mis trámites
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#404040"><path d="M664.46-450H210q-12.77 0-21.38-8.62Q180-467.23 180-480t8.62-21.38Q197.23-510 210-510h454.46L532.77-641.69q-8.92-8.93-8.81-20.89.12-11.96 8.81-21.27 9.31-9.3 21.38-9.61 12.08-.31 21.39 9l179.15 179.15q5.62 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.3 6.23-7.92 11.85L575.54-275.54q-8.93 8.92-21.19 8.81-12.27-.12-21.58-9.42-8.69-9.31-9-21.08-.31-11.77 9-21.08L664.46-450Z"/></svg>
      </a>
    </div>

    <!-- Banner de Perfil del Estudiante Rediseñado y Despejado -->
    <div class="student-profile-bar">
      <div class="student-profile-left">
        <div class="student-profile-avatar">${APP.initials(me.nombre)}</div>
        <div class="student-profile-details">
          <div class="profile-name-row">
            <h2>${me.nombre}</h2>
            <span class="pill ok pill-regular">Alumno regular</span>
          </div>
          <div class="student-career-text">
            <b>${perfil.programa}</b> · ${perfil.nivel === 'pregrado' ? 'Pregrado' : 'Postgrado'} (Ciclo ${perfil.ciclo})
          </div>
          <div class="student-code-meta">
            <span>Código: <b>${me.codigo}</b></span>
            <span class="sep">·</span>
            <span>DNI: <b>${me.dni}</b></span>
            <span class="sep">·</span>
            <span>${me.email}</span>
          </div>
        </div>
      </div>

      <div class="student-profile-kpis">
        <div class="kpi-box">
          <span class="kpi-label">Créditos</span>
          <span class="kpi-val">${perfil.creditos}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-label">Promedio</span>
          <span class="kpi-val">${perfil.promedio}</span>
        </div>
        <div class="kpi-box highlight">
          <span class="kpi-label">Mérito</span>
          <span class="kpi-val">${perfil.tercioSuperior ? 'Tercio superior' : perfil.quintoSuperior ? 'Quinto superior' : 'Regular'}</span>
        </div>
      </div>
    </div>

    <!-- Buscador e Intenciones -->
    <div class="catalog-search-card search-card-mb-20">
      <div class="input-wrap-icon-left">
        <span class="input-icon-svg" aria-hidden="true">${SVG_ICONS.search}</span>
        <input id="search-input" placeholder="Buscar trámite por nombre (ej. Matrícula, Certificado, Tercio, Carné...)" oninput="setQ(this.value)">
      </div>

      <div class="intent-section-title">¿Qué trámite deseas realizar?</div>
      <div class="intent-bar">
        <button class="intent-btn active" data-intent="todos" onclick="setIntencion('todos')">Todos</button>
        <button class="intent-btn" data-intent="beca" onclick="setIntencion('beca')">Becas y descuentos</button>
        <button class="intent-btn" data-intent="certificaciones" onclick="setIntencion('certificaciones')">Certificaciones</button>
        <button class="intent-btn" data-intent="practicas" onclick="setIntencion('practicas')">Prácticas y empleo</button>
        <button class="intent-btn" data-intent="grado" onclick="setIntencion('grado')">Grados y egreso</button>
        <button class="intent-btn" data-intent="carne" onclick="setIntencion('carne')">Carné universitario</button>
        <button class="intent-btn" data-intent="otros" onclick="setIntencion('otros')">Otros</button>
      </div>
    </div>

    <div class="tram-grid" id="catalog-grid"></div>
    <div id="catalog-no-eleg"></div>
  `;

  renderCatalog();
}

// =========================================================================
// MODAL DE SOLICITUD (FORMULARIO ÁGIL + PASARELA NIUBIZ)
// =========================================================================
let CURRENT_ATTACHMENT = null;

function renderCertCoursesChecklist(certId) {
  const cert = DB.getCertificacion(certId);
  if (!cert || !cert.cursos) return '';
  return `
    <div class="cert-checklist-box">
      <div class="cert-checklist-header">
        Cursos del módulo formativo (${cert.cursos.length} asignaturas requeridas)
      </div>
      <div class="cert-checklist-list">
        ${cert.cursos.map(c => `
          <div class="cert-checklist-row">
            <span class="cert-course-name">${c.nombre}</span>
            <span class="cert-course-right">
              <span class="cert-course-grade">Nota: ${c.nota}</span>
              <span class="cert-course-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Cumple requisito
              </span>
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.onCertSelectChange = function (certId) {
  const previewEl = document.getElementById('cert-courses-preview');
  const avisoEmitido = document.getElementById('cert-already-emitted-alert');
  const niubizBox = document.getElementById('cert-niubiz-box');
  const submitBtn = document.getElementById('btn-solicitar-submit');

  if (!certId) {
    if (previewEl) { previewEl.style.display = 'none'; previewEl.innerHTML = ''; }
    if (avisoEmitido) avisoEmitido.style.display = 'none';
    if (niubizBox) niubizBox.style.display = 'none';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('btn-submit-disabled'); submitBtn.innerText = 'Continuar al pago'; }
    return;
  }

  // Mostrar cursos del módulo formativo recién al seleccionar
  if (previewEl) {
    previewEl.style.display = 'block';
    previewEl.innerHTML = renderCertCoursesChecklist(certId);
  }

  const cert = DB.getCertificacion(certId);
  const isEmitido = cert && DB.certificacionEmitida(me.id, cert.id);

  if (isEmitido) {
    if (avisoEmitido) {
      avisoEmitido.style.display = 'flex';
    }
    if (niubizBox) {
      niubizBox.style.display = 'none';
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-submit-disabled');
      submitBtn.classList.add('btn-submit-enabled');
      submitBtn.innerText = 'Ir a Mis documentos';
      submitBtn.onclick = () => { location.href = 'mis-documentos.html'; };
    }
  } else {
    if (avisoEmitido) {
      avisoEmitido.style.display = 'none';
    }
    if (niubizBox) {
      niubizBox.style.display = 'flex';
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-submit-disabled');
      submitBtn.classList.add('btn-submit-enabled');
      submitBtn.innerText = 'Continuar al pago';
      submitBtn.onclick = () => { confirmarSolicitud('T-010'); };
    }
  }
};

function abrirModalConsentimientoModalidad(t) {
  APP.openModal(`
    <div class="modal-head">
      <div class="modal-head-row">
        <div class="modal-head-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="m9 15 2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <span class="modal-head-kicker">Registro de Trámite · Alumno</span>
          <h3 class="modal-head-h3-main">Consentimiento para Cambio de Modalidad</h3>
        </div>
      </div>
      <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
    </div>

    <div class="modal-body modal-body-consent">
      <div class="consent-doc-card">
        <div class="consent-doc-head">
          <div class="consent-doc-title">CONSENTIMIENTO PARA CAMBIO DE MODALIDAD DE ESTUDIOS</div>
        </div>

        <p class="consent-doc-p">
          Yo, <b>${(me && me.nombre) ? me.nombre : 'María Fernanda Quispe'}</b> identificado (a) con DNI/CE N° <b>${(me && me.dni) ? me.dni : '72845109'}</b> domiciliado (a) en <b>Pasaje Olaya 139</b>, en mi calidad de estudiante de la carrera profesional <b>${(perfil && perfil.programa) ? perfil.programa : 'Ingeniería de Sistemas e Informática'}</b> de la Escuela Académico Profesional de <b>${(perfil && perfil.programa) ? perfil.programa : 'Ingeniería de Sistemas e Informática'}</b>
        </p>

        <div class="consent-doc-subhead">
          DECLARO BAJO JURAMENTO
        </div>

        <p class="consent-doc-p">
          Que he recibido información adecuada por parte de la Universidad Norbert Wiener sobre las modalidades presencial y semipresencial de las carreras profesionales y el impacto que tiene la migración entre estas.
        </p>

        <p class="consent-doc-p">
          En ese sentido, <b>DOY MI CONSENTIMIENTO</b> para la migración a la modalidad semipresencial el que se desarrollará de acuerdo con el Plan Curricular en la modalidad seleccionada, me comprometo a respetarlo de tal manera que en adelante mi modalidad de estudios será semipresencial con resolución aprobada.
        </p>

        <p class="consent-doc-p">
          Con la suscripción del presente documento, manifiesto plena conformidad con los contenidos virtuales a desarrollar y el impacto que tiene el cambio de modalidad en la información de egreso y en el diploma del grados y títulos.
        </p>

        <div class="consent-doc-legal">
          Suscribo el presente documento en calidad de Declaración Jurada, en virtud del principio de veracidad establecido por el artículo IV del Título Preliminar de la Ley N° 27444, Ley del Procedimiento Administrativo General.
        </div>
      </div>
    </div>

    <div class="modal-foot">
      <button class="btn" onclick="APP.closeModal()">Declinar</button>
      <button class="btn btn-primary" id="btn-aprobar-consentimiento" onclick="aprobarConsentimientoModalidad('${t.id}')">Aceptar</button>
    </div>
  `, { wide: false });
}

function aprobarConsentimientoModalidad(tramiteId) {
  const t = DB.getTramite(tramiteId);
  if (!t) return;

  const btn = document.getElementById('btn-aprobar-consentimiento');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Procesando...';
  }

  // Actualizar la modalidad a Semipresencial en el perfil del alumno activo
  if (me && me.perfil) {
    me.perfil.modalidad = 'Semipresencial';
  }
  try {
    const dbRaw = localStorage.getItem('tw_db_v3');
    if (dbRaw) {
      const dbParsed = JSON.parse(dbRaw);
      if (dbParsed && dbParsed.usuarios) {
        const u = dbParsed.usuarios.find(x => x.id === me.id);
        if (u && u.perfil) {
          u.perfil.modalidad = 'Semipresencial';
          localStorage.setItem('tw_db_v3', JSON.stringify(dbParsed));
        }
      }
    }
  } catch (e) {
    console.error('Error actualizando modalidad:', e);
  }

  const num = DB.solicitudes().length + 201;
  const s = {
    id: 'S-2026-0' + num,
    ticket: '2026.' + (43600 + num),
    tramiteId: t.id,
    tramiteNombre: t.nombre,
    alumnoId: me.id,
    alumnoNombre: me.nombre,
    alumnoCodigo: me.codigo,
    alumnoEmail: me.email,
    fecha: APP.todayISO(),
    fechaHora: APP.todayISO() + ' ' + (new Date().toLocaleTimeString('es-PE')),
    estado: 'Aprobado',
    costo: 0.00,
    area: t.area || 'Registros Académicos',
    pagoMomento: 'despues',
    motivo: 'Consentimiento para migración a modalidad semipresencial',
    observacion: 'Declaración jurada y consentimiento suscrito digitalmente por el estudiante bajo la Ley N° 27444. Trámite de aprobación automática.',
    adjunto: null,
    pago: {
      estado: 'pagado',
      obligacionGenerada: false,
      metodo: 'Trámite Gratuito (Sin costo)',
      monto: 0.00,
      fecha: APP.todayISO(),
      operacion: 'AUT-' + Math.floor(100000 + Math.random() * 900000)
    },
    historial: [
      {
        estado: 'Solicitado',
        fecha: APP.nowStamp(),
        nota: 'Consentimiento para cambio de modalidad firmado digitalmente en calidad de Declaración Jurada'
      },
      {
        estado: 'Aprobado',
        fecha: APP.nowStamp(),
        nota: 'Aprobación automática de cambio de modalidad presencial a semipresencial'
      }
    ]
  };

  DB.addSolicitud(s);

  APP.sendMail({
    to: me.email,
    cc: 'registros.academicos@uwiener.edu.pe',
    subject: `Resolución aprobada · ${t.nombre} (Expediente ${s.id})`,
    lines: [
      `Estimado(a) ${me.nombre},`,
      `Tu trámite de <b>${t.nombre}</b> (Expediente <b>${s.id}</b>) ha sido <b>aprobado automáticamente</b>.`,
      `Conforme a tu Declaración Jurada y consentimiento suscrito digitalmente bajo la Ley N° 27444, en adelante tu modalidad de estudios queda registrada como <b>Semipresencial</b> de acuerdo con el Plan Curricular correspondiente.`,
      `El trámite ha sido procesado de forma automática y no genera costo ni arancel alguno.`
    ]
  });

  APP.closeModal();

  APP.toast({
    icon: 'ok',
    title: '¡Cambio de modalidad aprobado!',
    body: `Tu consentimiento ha sido registrado y aprobado automáticamente. Redirigiendo a tus trámites...`
  });

  setTimeout(() => {
    location.href = 'mis-tramites.html';
  }, 1200);
}

function abrirSolicitud(tramiteId) {
  CURRENT_ATTACHMENT = null;
  const t = DB.getTramite(tramiteId);
  if (!t) return;

  const esCambioModalidad = t.id === 'T-004' || (t.nombre && t.nombre.toLowerCase().includes('cambio de modalidad'));
  if (esCambioModalidad) {
    abrirModalConsentimientoModalidad(t);
    return;
  }

  const esCertProgresiva = t.id === 'T-010' || t.nombre.toLowerCase().includes('certificación progresiva');
  const diasTexto = esCertProgresiva ? 'Inmediato' : (t.diasEntrega === 1 ? '1 día hábil' : `${t.diasEntrega} días hábiles`);
  const modalidadTexto = t.pagoMomento === 'antes' ? 'Pago en línea con tarjeta vía Niubiz' : 'Pago posterior a la aprobación';
  const modeloTexto = t.modelo || t.plantilla || (t.tipo ? t.tipo.toLowerCase() : 'trámite');

  if (esCertProgresiva) {
    const certs = DB.certificacionesProgresivas();

    APP.openModal(`
      <div class="modal-head">
        <div class="modal-head-row">
          <div class="modal-head-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 15 11 17 15 13"></polyline>
            </svg>
          </div>
          <div>
            <span class="modal-head-kicker">Registros Académicos · Emisión Digital</span>
            <h3 class="modal-head-h3-cert">Solicitar: Certificación Progresiva</h3>
          </div>
        </div>
        <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
      </div>

      <div class="modal-body">
        <dl class="kv kv-mb-16">
          <dt>Tipo</dt><dd>Certificado Modular Oficial con firma digital</dd>
          <dt>Costo</dt><dd><b class="cost-cert-val">${APP.money(t.costo)}</b></dd>
          <dt>Entrega estimada</dt><dd><b class="delivery-immediate">Inmediata</b> (al correo y en Mis documentos)</dd>
          <dt>Modalidad de pago</dt><dd>Pasarela Niubiz (Tarjeta Crédito / Débito)</dd>
        </dl>

        <div class="field full field-mb-14">
          <label for="sol-cert-select">Selecciona la Certificación Progresiva a solicitar</label>
          <div class="custom-select-container">
            <select class="select" id="sol-cert-select" onchange="onCertSelectChange(this.value)">
              <option value="" disabled selected>Selecciona la certificación</option>
              ${certs.map(c => `<option value="${c.id}">${c.titulo}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Previsualización dinámica de los cursos del módulo -->
        <div id="cert-courses-preview"></div>

        <!-- Alerta amarilla si el documento ya está emitido -->
        <div id="cert-already-emitted-alert" class="alert warn cert-emitted-alert">
          <svg class="spec-svg-fixed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div class="alert-flex-text">
            <b>Esta certificación ya fue emitida anteriormente.</b><br>
            Ya cuentas con este documento oficial emitido con firma digital. Puedes consultarlo y descargarlo directamente en la sección <a href="mis-documentos.html" class="alert-link-docs">Mis documentos</a> sin necesidad de realizar un nuevo pago.
          </div>
        </div>

        <div class="field full field-mb-14">
          <label for="sol-motivo">Motivo de la solicitud</label>
          <div class="custom-select-container">
            <select class="select" id="sol-motivo">
              <option value="Acreditación curricular y competencias" selected>Acreditación curricular y competencias</option>
              <option value="Postulación e inserción laboral">Postulación e inserción laboral</option>
              <option value="Convocatoria de tutoría / docencia">Convocatoria de tutoría / docencia</option>
              <option value="Beca o pasantía profesional">Beca o pasantía profesional</option>
              <option value="Trámite bancario / laboral">Trámite bancario / laboral</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div class="field full field-mb-14">
          <label for="sol-coment">Comentario u observación (opcional)</label>
          <textarea class="input" id="sol-coment" rows="2" placeholder="Información adicional relevante..."></textarea>
        </div>

        <!-- Mensaje Niubiz formateado de forma impecable -->
        <div id="cert-niubiz-box" class="alert info alert-niubiz-banner niubiz-alert-box">
          <svg class="spec-svg-fixed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div class="niubiz-text-content">
            Al continuar serás dirigido a la pasarela de pago <strong class="niubiz-accent-text">Niubiz</strong> para abonar <strong class="niubiz-accent-text">${APP.money(t.costo)}</strong>.
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn" onclick="APP.closeModal()">Cancelar</button>
        <button class="btn btn-primary btn-submit-disabled" id="btn-solicitar-submit" disabled onclick="confirmarSolicitud('${t.id}')">
          Continuar al pago
        </button>
      </div>
    `, { wide: false });
  } else {
    // Modal estándar para trámites regulares
    APP.openModal(`
      <div class="modal-head">
        <h3>Solicitar: ${t.nombre}</h3>
        <button class="modal-close" aria-label="Cerrar modal" onclick="APP.closeModal()">×</button>
      </div>

      <div class="modal-body">
        <dl class="kv kv-mb-18">
          <dt>Tipo</dt><dd>${t.tipo} · modelo «${modeloTexto}»</dd>
          <dt>Costo</dt><dd><b class="cost-standard-val">${APP.money(t.costo)}</b></dd>
          <dt>Entrega estimada</dt><dd>${diasTexto}</dd>
          <dt>Modalidad de pago</dt><dd>${modalidadTexto}</dd>
        </dl>

        <div class="field full field-mb-14">
          <label for="sol-motivo">Motivo de la solicitud</label>
          <div class="custom-select-container">
            <select class="select" id="sol-motivo">
              <option value="Trámite bancario" selected>Trámite bancario</option>
              <option value="Postulación laboral">Postulación laboral</option>
              <option value="Beca de estudios">Beca de estudios</option>
              <option value="Trámite migratorio / Visa">Trámite migratorio / Visa</option>
              <option value="Continuidad de estudios">Continuidad de estudios</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div class="field full field-mb-16">
          <label for="sol-coment">Comentario (opcional)</label>
          <textarea class="input" id="sol-coment" rows="3" placeholder="Información adicional para el área responsable..."></textarea>
        </div>

        ${t.requiereAdjunto ? `
          <div class="field full field-mb-16">
            <label>
              Documento de sustento
              <span class="req-star">* (Obligatorio)</span>
            </label>
            ${t.adjuntoIndicacion ? `
              <div class="alert warn alert-area-note">
                <span class="inline-ico-span"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span><b>Indicación del área:</b> ${t.adjuntoIndicacion}
              </div>` : ''}
            <div class="file-dropzone" id="dropzone" onclick="document.getElementById('file-input').click()">
              <input type="file" id="file-input" accept=".pdf,.jpg,.jpeg,.png" onchange="handleFileSelect(event)">
              <div class="dropzone-cloud-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
              <div class="dropzone-main-text">Haz clic para seleccionar o arrastra tu archivo aquí</div>
              <div class="dropzone-sub-text">Formatos permitidos: PDF, JPG o PNG (máx. 5 MB)</div>
            </div>
            <div id="file-preview-area"></div>
          </div>` : ''}

        <!-- Mensaje Niubiz -->
        <div class="alert info alert-niubiz-banner niubiz-alert-regular">
          <svg class="spec-svg-fixed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div class="niubiz-text-content">
            ${t.pagoMomento === 'antes'
        ? 'Al continuar serás dirigido a la pasarela de pago <strong class="niubiz-accent-text">Niubiz</strong> para abonar <strong class="niubiz-accent-text">' + APP.money(t.costo) + '</strong>.'
        : 'Tu solicitud entrará a revisión por ' + t.area + '. El pago de <strong class="niubiz-accent-text">' + APP.money(t.costo) + '</strong> se realizará una vez que sea aprobada.'}
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn" onclick="APP.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarSolicitud('${t.id}')">
          ${t.pagoMomento === 'antes' ? 'Continuar al pago' : 'Enviar solicitud'}
        </button>
      </div>
    `, { wide: false });
  }

  if (APP && APP.initCustomSelects) {
    const m = document.querySelector('.modal');
    if (m) APP.initCustomSelects(m);
  }
}

function handleFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  CURRENT_ATTACHMENT = file.name;
  const preview = document.getElementById('file-preview-area');
  if (preview) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    preview.innerHTML = `
      <div class="file-preview-card">
        <div class="file-meta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <div>
            <div class="file-name">${file.name}</div>
            <div class="file-size">${sizeMb > 0 ? sizeMb : '0.5'} MB · Archivo adjunto listo</div>
          </div>
        </div>
        <button class="btn btn-sm btn-ghost btn-remove-attachment" type="button" onclick="removeFile(event)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Quitar</button>
      </div>`;
  }
}

function removeFile(event) {
  if (event) event.stopPropagation();
  CURRENT_ATTACHMENT = null;
  const input = document.getElementById('file-input');
  if (input) input.value = '';
  const preview = document.getElementById('file-preview-area');
  if (preview) preview.innerHTML = '';
}

function confirmarSolicitud(id) {
  const t = DB.getTramite(id);
  if (!t) return;

  const esCertProgresiva = t.id === 'T-010' || t.nombre.toLowerCase().includes('certificación progresiva');

  if (!esCertProgresiva && t.requiereAdjunto && !CURRENT_ATTACHMENT) {
    APP.toast({
      icon: 'warn',
      title: 'Falta documento de sustento',
      body: t.adjuntoIndicacion || 'Debes adjuntar el archivo solicitado para continuar este trámite.'
    });
    return;
  }

  const motivoEl = document.getElementById('sol-motivo');
  const motivo = motivoEl ? motivoEl.value : 'Trámite bancario';
  const comentEl = document.getElementById('sol-coment');
  const comentario = comentEl ? comentEl.value.trim() : '';

  if (esCertProgresiva) {
    const certSelect = document.getElementById('sol-cert-select');
    const certId = certSelect ? certSelect.value : '';
    if (!certId) {
      APP.toast({
        icon: 'bell',
        title: 'Selecciona una certificación',
        body: 'Debes seleccionar una certificación progresiva antes de continuar al pago.'
      });
      return;
    }

    const cert = DB.getCertificacion(certId) || { id: certId, titulo: 'Tutor STEM Matemática', promedio: 15.0 };

    const yaEmitido = DB.certificacionEmitida(me.id, cert.id);
    if (yaEmitido) {
      location.href = 'mis-documentos.html';
      return;
    }

    // Simulación de pasarela Niubiz para Certificación Progresiva
    APP.niubizCheckout({
      amount: t.costo,
      concepto: `Certificación Progresiva: ${cert.titulo} - ${me.nombre}`,
      onSuccess: (pago) => procesarCreacion(t, pago, motivo, comentario, null, cert)
    });
    return;
  }

  if (t.pagoMomento === 'antes') {
    APP.niubizCheckout({
      amount: t.costo,
      concepto: `${t.nombre} · ${me.nombre} (${me.codigo})`,
      onSuccess: (pago) => procesarCreacion(t, pago, motivo, comentario, CURRENT_ATTACHMENT, null)
    });
  } else {
    procesarCreacion(t, null, motivo, comentario, CURRENT_ATTACHMENT, null);
  }
}

function procesarCreacion(t, pago, motivo, comentario, adjunto, cert) {
  const num = DB.solicitudes().length + 201;
  const pagado = !!pago;
  const esCertProgresiva = !!cert || t.id === 'T-010' || t.nombre.toLowerCase().includes('certificación progresiva');
  const estado = (esCertProgresiva && pagado) ? 'Emitido' : 'En revisión';

  const s = {
    id: 'S-2026-0' + num,
    ticket: '2026.' + (43600 + num),
    tramiteId: t.id,
    tramiteNombre: cert ? `Certificación Progresiva: ${cert.titulo}` : t.nombre,
    certificacionId: cert ? cert.id : null,
    certificacionTitulo: cert ? cert.titulo : null,
    alumnoId: me.id,
    alumnoNombre: me.nombre,
    alumnoCodigo: me.codigo,
    alumnoEmail: me.email,
    fecha: APP.todayISO(),
    fechaHora: APP.todayISO() + ' ' + (new Date().toLocaleTimeString('es-PE')),
    estado,
    costo: t.costo,
    area: t.area,
    pagoMomento: t.pagoMomento,
    motivo: motivo || 'Trámite bancario',
    observacion: esCertProgresiva
      ? `Certificado oficial generado con firma digital tras confirmación de pago y validación de notas (promedio modular: ${cert ? cert.promedio : '15.0'}).`
      : (comentario ? 'Comentario del alumno: ' + comentario : ''),
    adjunto: adjunto || null,
    pago: pagado
      ? { estado: 'pagado', obligacionGenerada: true, metodo: pago.metodo || 'Tarjeta de Crédito / Débito (Niubiz)', monto: pago.monto || t.costo, fecha: APP.todayISO(), operacion: pago.operacion || ('NB-' + Math.floor(100000 + Math.random() * 900000)) }
      : { estado: 'pendiente', obligacionGenerada: false, metodo: '-', monto: t.costo, fecha: '', operacion: '' },
    historial: [
      { estado: 'Pendiente de pago', fecha: APP.nowStamp(), nota: esCertProgresiva ? `Solicitud iniciada para ${cert ? cert.titulo : 'Certificación Progresiva'}` : 'Solicitud creada con expediente digital' }
    ]
  };

  if (pagado) {
    s.historial.push({
      estado: 'En revisión',
      fecha: APP.nowStamp(),
      nota: 'Pago confirmado vía ' + s.pago.metodo + ' (Op. ' + s.pago.operacion + ')'
    });
  }

  if (esCertProgresiva && pagado) {
    s.historial.push({
      estado: 'Emitido',
      fecha: APP.nowStamp(),
      nota: 'Certificado oficial generado con firma digital y remitido a ' + me.email
    });
  }

  DB.addSolicitud(s);

  if (esCertProgresiva && pagado) {
    const primerNombre = (me.nombre || 'estudiante').split(' ')[0];
    const studentEmail = (me.email && me.email.startsWith('a')) ? me.email : ('a' + (me.codigo || '2021100345') + '@uwiener.edu.pe');
    const codigoDoc = 'DOC-' + s.id.replace('S-', '');

    APP.openModal(`
      <div class="modal-head modal-head-success-noborder">
        <div class="modal-head-row">
          <div class="modal-success-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div>
            <span class="modal-success-kicker">Trámite completado</span>
            <h3 class="modal-success-h3">¡Certificación emitida con éxito!</h3>
          </div>
        </div>
        <button class="modal-close" aria-label="Cerrar modal" onclick="location.href='mis-documentos.html'">×</button>
      </div>

      <div class="modal-body modal-body-success">
        <p class="modal-success-p">
          Hola <b>${primerNombre}</b>, tu <b>Certificación Progresiva: ${cert.titulo}</b> ha sido emitida con firma digital. Te enviamos una copia a tu correo institucional (<b>${studentEmail}</b>) y ya se encuentra disponible para su consulta y descarga en <b>Mis documentos</b>.
        </p>

        <div class="modal-success-summary-box">
          <div class="modal-summary-item">
            <span class="summary-label-muted">Documento:</span>
            <span class="summary-val-title">${cert.titulo}</span>
          </div>
          <div class="modal-summary-item">
            <span class="summary-label-muted">Código digital:</span>
            <span class="summary-val-code">${codigoDoc}</span>
          </div>
          <div class="modal-summary-item-last">
            <span class="summary-label-muted">Pago Niubiz:</span>
            <span class="summary-val-pay">${APP.money(t.costo)} (Confirmado)</span>
          </div>
        </div>
      </div>

      <div class="modal-foot">
        <button class="btn btn-ghost" onclick="location.href='mis-documentos.html'">Cerrar</button>
        <button class="btn btn-primary btn-success-goto-docs" onclick="location.href='mis-documentos.html'">
          <span>Ir a Mis documentos</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    `, { wide: false });
  } else {
    // Flujo regular
    APP.sendMail({
      to: me.email,
      cc: 'mesadepartes@uwiener.edu.pe',
      subject: `Expediente ${s.id} registrado - ${t.nombre}`,
      lines: [
        `Hola ${me.nombre}, hemos registrado con éxito tu solicitud de <b>${t.nombre}</b>.`,
        `N° de Expediente: <b>${s.id}</b>.`,
        `Fecha estimada de resolución: <b>${APP.calcSLA(t.diasEntrega)}</b>.`,
        pagado ? `Pago confirmado: ${APP.money(pago.monto)}.` : `Pago de ${APP.money(t.costo)} pendiente de abono tras aprobación.`
      ]
    });

    APP.closeModal();
    APP.toast({
      icon: 'ok',
      title: '¡Solicitud registrada!',
      body: `Expediente ${s.id} generado. Redirigiendo a mis trámites...`
    });

    setTimeout(() => {
      location.href = 'mis-tramites.html';
    }, 1200);
  }
}

// Alias de compatibilidad global
window.abrirSolicitud = abrirSolicitud;
window.abrirWizard = abrirSolicitud;

initView();
