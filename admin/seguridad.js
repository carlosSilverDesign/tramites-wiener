// admin/seguridad.js - Seguridad, Roles y Políticas Wiener Admin

const ctx = APP.renderShell('seguridad');
let tab = 'roles';

const SVG_ICONS = {
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
  user: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  docente: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
  director: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  arrowRight: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  arrowLeft: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
  lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
};

function setTab(t, el) {
  tab = t;
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  paint();
}

const AUDIT = [
  ['2026-11-21 11:45', 'm.faustor', 'Director', 'Aprobó Visto Bueno Resolutivo en expediente S-2026-0192', '192.168.10.15'],
  ['2026-11-21 10:20', 'j.santacruz', 'Docente', 'Emitió Dictamen Favorable en convalidación S-2026-0185', '192.168.10.38'],
  ['2026-11-21 09:20', 'c.mendoza', 'Administrativo', 'Aprobó y emitió constancia para solicitud S-2026-0181', '192.168.10.24'],
  ['2026-11-21 09:14', 'p.zorrilla', 'Administrativo', 'Registró atención presencial asistida S-2026-0188', '192.168.10.12'],
  ['2026-11-20 18:02', 'm.faustor', 'Director', 'Editó parámetros en Trámite Studio (T-003 Certificado)', '192.168.10.15'],
  ['2026-11-20 16:40', 'n.santacruz', 'Docente', 'Inicio de sesión en panel de revisión académica', '192.168.10.42'],
  ['2026-11-20 11:10', 'sistema', 'Sistema', 'Confirmación pasarela Niubiz · Op. NB-90377112', '10.0.0.1']
];

function togglePerm(rol, modId) {
  const m = DB.matrizSeguridad();
  if (!m.permisos[rol]) m.permisos[rol] = {};
  m.permisos[rol][modId] = !m.permisos[rol][modId];
  DB.saveMatrizSeguridad(m);
  
  const modObj = (m.modulos || []).find(x => x.id === modId);
  const nombreMod = modObj ? modObj.nombre : modId;
  const estadoStr = m.permisos[rol][modId] ? 'Habilitado' : 'Deshabilitado';
  
  APP.toast({
    title: 'Permiso actualizado',
    body: `${estadoStr} «${nombreMod}» para el rol ${rol.toUpperCase()}.`
  });
  paint();
}

function resetMatriz() {
  if (confirm('¿Deseas restablecer la matriz de roles y permisos a los valores institucionales por defecto?')) {
    const def = {
      administrativo: {
        catalogo: true, registrar: true, solicitudes: true, flujos: true,
        procesar: true, reportes: true, tramites: true, certificaciones: true,
        usuarios: false, seguridad: false
      },
      docente: {
        catalogo: true, registrar: false, solicitudes: true, flujos: false,
        procesar: false, reportes: false, tramites: false, certificaciones: false,
        usuarios: false, seguridad: false
      },
      director: {
        catalogo: true, registrar: true, solicitudes: true, flujos: true,
        procesar: true, reportes: true, tramites: true, certificaciones: true,
        usuarios: true, seguridad: true
      }
    };
    const m = DB.matrizSeguridad();
    m.permisos = def;
    DB.saveMatrizSeguridad(m);
    APP.toast({ title: 'Matriz restablecida', body: 'Se restauraron los permisos estándar de Wiener.' });
    paint();
  }
}

function paint() {
  const host = document.getElementById('sec-body');
  if (tab === 'roles') {
    const mat = DB.matrizSeguridad();
    const modulos = mat.modulos || [];
    const perms = mat.permisos || {};

    const countAdmin = DB.usuarios().filter(u => u.rol === 'administrativo' && u.estado === 'activo').length;
    const countDocente = DB.usuarios().filter(u => u.rol === 'docente' && u.estado === 'activo').length;
    const countDirector = DB.usuarios().filter(u => u.rol === 'director' && u.estado === 'activo').length;

    host.innerHTML = `
      <div class="info-banner-roles">
        <span class="info-banner-icon">${SVG_ICONS.info}</span>
        <div>
          <b>Arquitectura de Accesos y Gobierno de Roles:</b><br>
          Los <b>Alumnos</b> gestionan sus trámites exclusivamente mediante el Portal del Estudiante (Autoservicio) y no cuentan con acceso al panel administrativo.
          El backoffice institucional se gobierna mediante los 3 roles operativos: <b>Administrativo</b> (operación y mesa de partes), <b>Docente</b> (dictamen y revisión académica de su especialidad) y <b>Director</b> (aprobación resolutiva, supervisión y configuración).
        </div>
      </div>

      <div class="card">
        <div class="matrix-header-wrap">
          <div>
            <div class="card-title m-0">Matriz de Roles y Permisos Institucionales</div>
            <div class="card-sub matrix-sub-desc">Control granular de módulos por perfil. Los cambios se aplican en tiempo real a todo el personal.</div>
          </div>
          <button type="button" class="btn btn-sm btn-outline btn-reset-matrix" onclick="resetMatriz()">
            ${SVG_ICONS.refresh} <span>Restablecer Valores por Defecto</span>
          </button>
        </div>

        <div class="table-wrap-seguridad">
          <table class="data perm-table">
            <thead>
              <tr>
                <th class="th-modulo">Módulo / Sección del Sistema</th>
                <th class="role-th-header">
                  <span class="role-title">Administrativo</span>
                  <div class="role-desc-sub">Mesa y Registros</div>
                  <a href="usuarios.html?rol=administrativo" class="role-count-badge" title="Ver personal administrativo asignado">
                    ${SVG_ICONS.user} <span>${countAdmin} usuarios</span> ${SVG_ICONS.arrowRight}
                  </a>
                </th>
                <th class="role-th-header">
                  <span class="role-title">Docente</span>
                  <div class="role-desc-sub">Revisor Académico</div>
                  <a href="usuarios.html?rol=docente" class="role-count-badge" title="Ver docentes evaluadores asignados">
                    ${SVG_ICONS.docente} <span>${countDocente} docentes</span> ${SVG_ICONS.arrowRight}
                  </a>
                </th>
                <th class="role-th-header">
                  <span class="role-title">Director</span>
                  <div class="role-desc-sub">Resolutivo / Escuela</div>
                  <a href="usuarios.html?rol=director" class="role-count-badge" title="Ver directores de escuela y decanos">
                    ${SVG_ICONS.director} <span>${countDirector} directores</span> ${SVG_ICONS.arrowRight}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              ${modulos.map(m => {
                const isAdmin = Boolean(perms.administrativo && perms.administrativo[m.id]);
                const isDocente = Boolean(perms.docente && perms.docente[m.id]);
                const isDirector = Boolean(perms.director && perms.director[m.id]);
                return `
                  <tr>
                    <td class="strong">
                      <div>${m.nombre}</div>
                      <span class="mono muted perm-id-tag">id: ${m.id}</span>
                    </td>
                    <td class="chk">
                      <label class="perm-toggle-label" title="Alternar permiso para Administrativo">
                        <input type="checkbox" class="perm-checkbox" ${isAdmin ? 'checked' : ''} onchange="togglePerm('administrativo', '${m.id}')">
                      </label>
                    </td>
                    <td class="chk">
                      <label class="perm-toggle-label" title="Alternar permiso para Docente">
                        <input type="checkbox" class="perm-checkbox" ${isDocente ? 'checked' : ''} onchange="togglePerm('docente', '${m.id}')">
                      </label>
                    </td>
                    <td class="chk">
                      <label class="perm-toggle-label" title="Alternar permiso para Director">
                        <input type="checkbox" class="perm-checkbox" ${isDirector ? 'checked' : ''} onchange="togglePerm('director', '${m.id}')">
                      </label>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (tab === 'politicas') {
    host.innerHTML = `
      <div class="card">
        <div class="card-title">Políticas de seguridad</div>
        <div class="card-sub">Parámetros de acceso y contraseñas.</div>
        <div class="resp-list policy-list">
          ${policy('Longitud mínima de contraseña', '8 caracteres', true)}
          ${policy('Requerir mayúsculas, números y símbolos', '', true)}
          ${policy('Caducidad de contraseña (90 días)', '', true)}
          ${policy('Autenticación en dos pasos (2FA) para administrativos', '', true)}
          ${policy('Bloqueo tras 5 intentos fallidos', '', true)}
          ${policy('Cierre de sesión por inactividad (15 min)', '', false)}
        </div>
      </div>`;
  } else {
    host.innerHTML = `
      <div class="card">
        <div class="card-title">Registro de auditoría</div>
        <div class="card-sub">Acciones realizadas en el sistema por administrativos, docentes y directores.</div>
        <div class="table-wrap-seguridad"><table class="data">
          <thead><tr><th>Fecha / Hora</th><th>Usuario</th><th>Rol</th><th>Acción Registrada</th><th>Dirección IP</th></tr></thead>
          <tbody>${AUDIT.map(a => `
            <tr>
              <td class="muted audit-date">${a[0]}</td>
              <td class="strong">${a[1]}</td>
              <td><span class="badge-role-tag ${a[2].toLowerCase()}">${a[2]}</span></td>
              <td>${a[3]}</td>
              <td class="mono muted">${a[4]}</td>
            </tr>`).join('')}</tbody>
        </table></div>
      </div>`;
  }
}

function policy(label, val, on) {
  return `<label class="resp-item policy-item">
    <div><b class="policy-label-text">${label}</b>${val ? `<br><span class="muted">${val}</span>` : ''}</div>
    <span class="switch"><input type="checkbox" ${on ? 'checked' : ''}><span class="slider"></span></span></label>`;
}

ctx.mount.innerHTML = `
  <div class="page-head page-head-seguridad">
    <div>
      <div class="back-nav-bar">
        <a href="usuarios.html" class="btn btn-sm btn-outline btn-back-users">
          ${SVG_ICONS.arrowLeft} <span>Volver a Personal de Gestión</span>
        </a>
      </div>
      <h1>Seguridad y Permisos</h1>
      <p>Roles institucionales, permisos de acceso a módulos, políticas y auditoría del sistema.</p>
    </div>
  </div>
  <div class="tabs">
    <div class="tab active" onclick="setTab('roles',this)">Roles y permisos</div>
    <div class="tab" onclick="setTab('politicas',this)">Políticas</div>
    <div class="tab" onclick="setTab('audit',this)">Auditoría</div>
  </div>
  <div id="sec-body"></div>`;

window.setTab = setTab;
window.togglePerm = togglePerm;
window.resetMatriz = resetMatriz;
paint();
