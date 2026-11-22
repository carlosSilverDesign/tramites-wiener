// admin/usuarios.js - Gestión de Personal y Roles Wiener Admin

const ctx = APP.renderShell('usuarios');

// Iconos SVG institucionales
const SVG_ICONS = {
  search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  edit: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  xCircle: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
};

// Parámetros de URL y filtros de consulta
const urlParams = new URLSearchParams(window.location.search);
let FILTER_ROL = urlParams.get('rol') || 'todos'; // 'todos' | 'administrativo' | 'docente' | 'director'
let FILTER_AREA = urlParams.get('area') || 'todas';
let SEARCH_KW = '';

function formatSedeShort(s) {
  if (!s) return 'Sede Principal';
  if (s.includes('-->')) {
    const afterArrow = s.split('-->')[1].trim();
    return afterArrow.split('/')[0].trim();
  }
  return s;
}

function formatSedeOption(s) {
  if (!s) return 'Sede Principal';
  if (s.includes('-->')) {
    return s.split('-->')[1].trim();
  }
  return s;
}

function filtrarRol(r) {
  FILTER_ROL = r;
  render();
}

function filtrarArea(a) {
  FILTER_AREA = a;
  render();
}

function filtrarBuscar() {
  const el = document.getElementById('search-user-input');
  SEARCH_KW = el ? el.value.trim().toLowerCase() : '';
  render();
}

function limpiarFiltros() {
  FILTER_ROL = 'todos';
  FILTER_AREA = 'todas';
  SEARCH_KW = '';
  render();
}

function alCambiarRolForm(nuevoRol) {
  const m = DB.matrizSeguridad();
  const permsRol = (m.permisos && m.permisos[nuevoRol]) || {};
  
  document.querySelectorAll('input[data-perm]').forEach(chk => {
    const permId = chk.dataset.perm;
    const shouldCheck = Boolean(permsRol[permId]);
    chk.checked = shouldCheck;
    const parent = chk.closest('.chip-check');
    if (parent) parent.classList.toggle('checked', shouldCheck);
  });
}

function render() {
  const allUsers = DB.usuarios();
  const allAreas = DB.areas();
  
  // Excluir alumnos del padrón administrativo institucional
  const staffUsers = allUsers.filter(u => u.rol !== 'alumno');
  const countStaff = staffUsers.length;
  const countAdmin = staffUsers.filter(u => u.rol === 'administrativo').length;
  const countDocente = staffUsers.filter(u => u.rol === 'docente').length;
  const countDirector = staffUsers.filter(u => u.rol === 'director').length;

  const filteredStaff = staffUsers.filter(u => {
    if (FILTER_ROL !== 'todos' && u.rol !== FILTER_ROL) return false;
    if (FILTER_AREA !== 'todas' && (u.area || '').toLowerCase() !== FILTER_AREA.toLowerCase()) return false;
    if (SEARCH_KW) {
      const text = (u.nombre + ' ' + (u.codigo || '') + ' ' + (u.email || '') + ' ' + (u.dni || '') + ' ' + (u.area || '')).toLowerCase();
      if (!text.includes(SEARCH_KW)) return false;
    }
    return true;
  });

  const hayFiltrosActivos = (FILTER_ROL !== 'todos' || FILTER_AREA !== 'todas' || Boolean(SEARCH_KW));

  const rows = filteredStaff.map(u => {
    const roleText = u.rol === 'director' ? 'Director' : (u.rol === 'docente' ? 'Docente' : 'Administrativo');
    const sedeText = formatSedeShort(u.sede);

    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-chip"><div class="avatar">${APP.initials(u.nombre)}</div></div>
            <div>
              <span class="strong">${u.nombre}</span>
              <span class="user-email-text">${u.email || '-'}</span>
            </div>
          </div>
        </td>
        <td><span class="mono muted">${u.codigo || '-'}</span></td>
        <td>
          <span class="badge-role-tag ${u.rol}">${roleText}</span>
        </td>
        <td>
          <div class="area-title">${u.area || 'Sin área asignada'}</div>
          ${u.cargo ? `<div class="cargo-sub">${u.cargo}</div>` : ''}
        </td>
        <td><span class="user-sede-text">${sedeText}</span></td>
        <td>${u.estado === 'activo' ? '<span class="pill ok">Activo</span>' : '<span class="pill gray">Inactivo</span>'}</td>
        <td class="actions-cell">
          <div class="row-actions">
            <button type="button" class="btn btn-sm btn-outline btn-action-edit" onclick="editar('${u.id}')">
              ${SVG_ICONS.edit} <span>Editar</span>
            </button>
            <button type="button" class="btn btn-sm btn-outline btn-action-toggle ${u.estado === 'activo' ? 'deactivate' : 'activate'}" onclick="toggle('${u.id}')">
              ${u.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  ctx.mount.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Personal de Gestión</h1>
        <p>Administra los colaboradores institucionales, sus roles operativos (Administrativo, Docente, Director) y áreas de atención.</p>
      </div>
    </div>

    <div class="grid grid-4 user-stats-grid">
      <div class="stat accent">
        <div class="label">Personal de Gestión</div>
        <div class="value">${countStaff}</div>
        <div class="stat-sub">Colaboradores con cuenta de acceso</div>
      </div>
      <div class="stat">
        <div class="label">Administrativos</div>
        <div class="value">${countAdmin}</div>
        <div class="stat-sub">Mesa de partes y registros</div>
      </div>
      <div class="stat">
        <div class="label">Docentes</div>
        <div class="value">${countDocente}</div>
        <div class="stat-sub">Revisores y dictaminadores</div>
      </div>
      <div class="stat">
        <div class="label">Directores</div>
        <div class="value">${countDirector}</div>
        <div class="stat-sub">Escuelas y decanatos</div>
      </div>
    </div>

    <div class="banner-info-users">
      <div class="banner-left-info">
        <span class="banner-icon-svg">${SVG_ICONS.info}</span>
        <div>
          <b>Equipo de Responsables y Personal de Atención:</b>
          Cada colaborador pertenece a un Área oficial de trámites y ejerce facultades según su rol asignado.
        </div>
      </div>
      <a href="seguridad.html" class="btn btn-sm btn-outline btn-sec-link">
        ${SVG_ICONS.lock} <span>Matriz de Permisos en Seguridad</span>
      </a>
    </div>

    <div class="filter-bar-users">
      <div class="search-input-wrap">
        <span class="search-icon">${SVG_ICONS.search}</span>
        <input class="input" id="search-user-input" placeholder="Buscar por nombre, código o correo..." value="${SEARCH_KW}" onkeyup="if(event.key==='Enter') filtrarBuscar()">
      </div>
      
      <div class="custom-select-container filter-select-container rol-select-container">
        <select class="filter-select" id="filter-user-rol" onchange="filtrarRol(this.value)">
          <option value="todos" ${FILTER_ROL === 'todos' ? 'selected' : ''}>Todos los roles (${countStaff})</option>
          <option value="administrativo" ${FILTER_ROL === 'administrativo' ? 'selected' : ''}>Administrativos (${countAdmin})</option>
          <option value="docente" ${FILTER_ROL === 'docente' ? 'selected' : ''}>Docentes (${countDocente})</option>
          <option value="director" ${FILTER_ROL === 'director' ? 'selected' : ''}>Directores (${countDirector})</option>
        </select>
      </div>

      <div class="custom-select-container filter-select-container area-select-container">
        <select class="filter-select" id="filter-user-area" onchange="filtrarArea(this.value)">
          <option value="todas" ${FILTER_AREA === 'todas' ? 'selected' : ''}>Todas las áreas</option>
          ${allAreas.map(a => `<option value="${a.nombre}" ${FILTER_AREA.toLowerCase() === a.nombre.toLowerCase() ? 'selected' : ''}>${a.nombre}</option>`).join('')}
        </select>
      </div>

      <button type="button" class="btn btn-outline btn-search-user" onclick="filtrarBuscar()">
        ${SVG_ICONS.search} <span>Buscar</span>
      </button>

      ${hayFiltrosActivos ? `
        <button type="button" class="btn-reset-filters" onclick="limpiarFiltros()" title="Restablecer filtros">
          ${SVG_ICONS.xCircle} <span>Limpiar</span>
        </button>
      ` : ''}

      <button type="button" class="btn btn-primary btn-new-user" onclick="editar(null)">
        ${SVG_ICONS.plus} <span>Nuevo Personal</span>
      </button>
    </div>

    <div class="table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Código</th>
            <th>Rol</th>
            <th>Área / Cargo</th>
            <th>Sede</th>
            <th>Estado</th>
            <th class="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows : '<tr><td colspan="7" class="user-empty-td">No se encontró personal con los filtros aplicados.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(ctx.mount);
  }
}

function editar(id) {
  const allAreas = DB.areas();
  const allSedes = DB.sedesCatalogo();
  const matriz = DB.matrizSeguridad();
  const modulos = matriz.modulos || [];

  const u = id 
    ? DB.getUsuario(id) 
    : { 
        id: null, 
        rol: 'administrativo', 
        nombre: '', 
        codigo: '', 
        email: '', 
        dni: '', 
        estado: 'activo', 
        area: allAreas[0] ? allAreas[0].nombre : 'Registros Académicos', 
        cargo: 'Responsable de Atención',
        sede: allSedes[0] || '',
        permisos: ['catalogo', 'solicitudes'] 
      };

  const userPerms = u.permisos || (matriz.permisos && matriz.permisos[u.rol] ? Object.keys(matriz.permisos[u.rol]).filter(k => matriz.permisos[u.rol][k]) : ['solicitudes']);

  const permChecks = modulos.map(m => `
    <label class="chip-check ${userPerms.includes(m.id) ? 'checked' : ''}">
      <input type="checkbox" data-perm="${m.id}" ${userPerms.includes(m.id) ? 'checked' : ''} onchange="this.closest('.chip-check').classList.toggle('checked',this.checked)">
      ${m.nombre}
    </label>
  `).join('');

  APP.openModal(`
    <div class="modal-head">
      <div>
        <h3 class="modal-title-text">${id ? 'Editar Personal' : 'Nuevo Colaborador de Atención'}</h3>
        <div class="modal-sub-text">Configura la identidad, área institucional y rol de acceso.</div>
      </div>
      <button type="button" class="modal-close" onclick="APP.closeModal()">${SVG_ICONS.close}</button>
    </div>

    <div class="modal-body modal-body-user">
      <div class="user-modal-grid">
        <div class="field full">
          <label class="field-label">Apellidos y Nombres Completos *</label>
          <input class="input" id="u-nombre" value="${u.nombre}" placeholder="Ej. MENDOZA RÍOS, CARLOS ALBERTO">
        </div>

        <div class="field">
          <label class="field-label">Rol Institucional (Gobierno de Acceso) *</label>
          <div class="custom-select-container">
            <select class="select" id="u-rol" onchange="alCambiarRolForm(this.value)">
              <option value="administrativo" ${u.rol === 'administrativo' ? 'selected' : ''}>Administrativo (Mesa y Registros)</option>
              <option value="docente" ${u.rol === 'docente' ? 'selected' : ''}>Docente (Revisor / Dictamen)</option>
              <option value="director" ${u.rol === 'director' ? 'selected' : ''}>Director (Resolutivo / Escuela)</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Código Personal / Colaborador</label>
          <input class="input" id="u-cod" value="${u.codigo || ''}" placeholder="Ej. ADM-0091">
        </div>

        <div class="field">
          <label class="field-label">Correo Institucional (@uwiener.edu.pe)</label>
          <input class="input" id="u-email" value="${u.email || ''}" placeholder="ejemplo@uwiener.edu.pe">
        </div>

        <div class="field">
          <label class="field-label">Documento Nacional de Identidad (DNI)</label>
          <input class="input" id="u-dni" value="${u.dni || ''}" placeholder="8 dígitos">
        </div>

        <div class="field full">
          <label class="field-label">Área Institucional de Adscripción *</label>
          <div class="custom-select-container">
            <select class="select" id="u-area">
              ${allAreas.map(a => `<option value="${a.nombre}" ${(u.area || '').toLowerCase() === a.nombre.toLowerCase() ? 'selected' : ''}>${a.nombre}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Cargo / Función Específica</label>
          <input class="input" id="u-cargo" value="${u.cargo || ''}" placeholder="Ej. Jefatura, Docente Revisor">
        </div>

        <div class="field">
          <label class="field-label">Sede de Atención</label>
          <div class="custom-select-container">
            <select class="select" id="u-sede">
              ${allSedes.map(s => {
                const sLabel = formatSedeOption(s);
                return `<option value="${s}" ${(u.sede || '').toLowerCase() === s.toLowerCase() ? 'selected' : ''}>${sLabel}</option>`;
              }).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="modal-perm-header">
        <div class="section-label m-0">Módulos Asignados (Permisos Efectivos)</div>
        <a href="seguridad.html" class="btn-sec-link">
          ${SVG_ICONS.lock} <span>Configurar Matriz en Seguridad</span>
        </a>
      </div>
      <div class="chip-row perm-chips-wrap" id="perm-row">
        ${permChecks}
      </div>
    </div>

    <div class="modal-foot modal-foot-user">
      <button type="button" class="btn" onclick="APP.closeModal()">Cancelar</button>
      <button type="button" class="btn btn-primary" onclick="guardar('${id || ''}')">Guardar Personal</button>
    </div>
  `, { wide: true });

  if (APP && APP.initCustomSelects) {
    const m = document.querySelector('.modal');
    if (m) APP.initCustomSelects(m);
  }
}

function guardar(id) {
  const nombre = document.getElementById('u-nombre').value.trim();
  if (!nombre) {
    APP.toast({ title: 'Falta el nombre', body: 'Ingresa los apellidos y nombres del colaborador.' });
    return;
  }
  const base = id ? DB.getUsuario(id) : {};
  const rol = document.getElementById('u-rol').value;
  const area = document.getElementById('u-area').value;
  const cargo = document.getElementById('u-cargo').value.trim();
  const sede = document.getElementById('u-sede').value;
  const permisos = Array.from(document.querySelectorAll('input[data-perm]:checked')).map(i => i.dataset.perm);

  const u = Object.assign({}, base, {
    id: id || null,
    rol,
    nombre,
    codigo: document.getElementById('u-cod').value.trim() || ('PER-' + Math.floor(100000 + Math.random() * 900000)),
    email: document.getElementById('u-email').value.trim(),
    dni: document.getElementById('u-dni').value.trim(),
    area: area,
    cargo: cargo || 'Responsable',
    sede: sede,
    estado: base.estado || 'activo',
    permisos: permisos
  });

  // Guardar usuario
  DB.upsertUsuario(u);

  // Sincronizar con el Área correspondiente en DB.areas()
  if (area && rol !== 'alumno') {
    const a = DB.areas().find(x => x.nombre.toLowerCase() === area.toLowerCase());
    if (a) {
      if (!Array.isArray(a.responsables)) a.responsables = [];
      const codPersonal = u.codigo.replace('PER-', '').replace('ADM-', '').replace('DOC-', '').replace('DIR-', '');
      const existIdx = a.responsables.findIndex(r => r.personal === codPersonal || r.nombre.toLowerCase() === u.nombre.toLowerCase());
      const respObj = {
        id: existIdx >= 0 ? a.responsables[existIdx].id : ('RESP-' + Date.now().toString().slice(-4)),
        personal: codPersonal,
        nombre: u.nombre,
        sede: u.sede || (a.sedes && a.sedes[0] ? a.sedes[0].nombre : ''),
        cargo: u.cargo || (rol === 'director' ? 'Director' : rol === 'docente' ? 'Docente Revisor' : 'Responsable'),
        rol: u.rol,
        activo: u.estado === 'activo'
      };
      if (existIdx >= 0) {
        a.responsables[existIdx] = respObj;
      } else {
        a.responsables.push(respObj);
      }
      DB.upsertArea(a);
    }
  }

  APP.closeModal();
  APP.toast({ title: 'Usuario guardado', body: `«${nombre}» (${rol.toUpperCase()}) fue actualizado exitosamente.` });
  render();
}

function toggle(id) {
  const u = DB.getUsuario(id);
  if (!u) return;
  u.estado = u.estado === 'activo' ? 'inactivo' : 'activo';
  DB.upsertUsuario(u);

  // Sincronizar estado en el Área si es staff
  if (u.area && u.rol !== 'alumno') {
    const a = DB.areas().find(x => x.nombre.toLowerCase() === u.area.toLowerCase());
    if (a && a.responsables) {
      const codPersonal = u.codigo.replace('PER-', '').replace('ADM-', '').replace('DOC-', '').replace('DIR-', '');
      const resp = a.responsables.find(r => r.personal === codPersonal || r.nombre.toLowerCase() === u.nombre.toLowerCase());
      if (resp) {
        resp.activo = (u.estado === 'activo');
        DB.upsertArea(a);
      }
    }
  }

  APP.toast({ title: 'Estado modificado', body: `${u.nombre} ahora está ${u.estado}.` });
  render();
}

// Exposición en window
window.filtrarRol = filtrarRol;
window.filtrarArea = filtrarArea;
window.filtrarBuscar = filtrarBuscar;
window.limpiarFiltros = limpiarFiltros;
window.alCambiarRolForm = alCambiarRolForm;
window.editar = editar;
window.guardar = guardar;
window.toggle = toggle;

render();
