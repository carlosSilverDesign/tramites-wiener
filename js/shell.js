/* ==========================================================================
   SHELL — navegación, sesión, helpers de UI compartidos
   ========================================================================== */
(function () {
  const SKEY = 'tw_session';

  // base relativa según profundidad (raíz vs /alumno/ vs /admin/)
  const p = location.pathname.replace(/\\/g, '/');
  const BASE = (/\/(alumno|admin)\//.test(p)) ? '../' : '';

  const ICONS = {
    inicio: 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm9 0h7V11h-7v9zm0-16v5h7V4h-7z',
    solicitar: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    estado: 'M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7v2a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.75-1.23-3.5-2.08V8z',
    revisar: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    tramites: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
    flujos: 'M4 4h6v4H4V4zm10 12h6v4h-6v-4zM7 8v4a2 2 0 0 0 2 2h3M4 16h6v4H4v-4z',
    usuarios: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.7 0-8 1.3-8 4v3h10v-3c0-1 .4-1.9 1-2.6C9.6 13.1 8.5 13 8 13zm8 0c-.3 0-.7 0-1.1.1A5.6 5.6 0 0 1 18 17v3h6v-3c0-2.7-5.3-4-8-4z',
    seguridad: 'M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm0 10.9h7c-.5 4.1-3.3 7.8-7 8.9V12H5V6.3l7-3.1V12z',
    config: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.4 4 1.8 1.4-1.8 3.1-2.2-.7a6.9 6.9 0 0 1-1.5.9l-.3 2.3h-3.6l-.3-2.3c-.5-.2-1-.5-1.5-.9l-2.2.7-1.8-3.1L4.6 12l-.2-.9.2-1.1L2.8 8.6l1.8-3.1 2.2.7c.5-.4 1-.7 1.5-.9l.3-2.3h3.6l.3 2.3c.5.2 1 .5 1.5.9l2.2-.7 1.8 3.1L20.6 12z'
  };

  const NAV = {
    alumno: [
      { group: 'Mis trámites', items: [
        { id: 'solicitar', label: 'Solicitar trámite', href: 'alumno/solicitar.html', icon: 'solicitar' },
        { id: 'mis-tramites', label: 'Estado de trámites', href: 'alumno/mis-tramites.html', icon: 'estado' }
      ]}
    ],
    administrativo: [
      { group: 'Operación', items: [
        { id: 'solicitudes', label: 'Revisar solicitudes', href: 'admin/solicitudes.html', icon: 'revisar', badge: 'pendientes' },
        { id: 'flujos', label: 'Flujos de trámites', href: 'admin/flujos.html', icon: 'flujos' }
      ]},
      { group: 'Configuración', items: [
        { id: 'tramites', label: 'Trámites', href: 'admin/tramites.html', icon: 'tramites' },
        { id: 'usuarios', label: 'Usuarios', href: 'admin/usuarios.html', icon: 'usuarios' },
        { id: 'seguridad', label: 'Seguridad', href: 'admin/seguridad.html', icon: 'seguridad' }
      ]}
    ]
  };

  function icon(name, cls) {
    return `<svg class="${cls || 'ico'}" viewBox="0 0 24 24" fill="currentColor"><path d="${ICONS[name] || ICONS.config}"/></svg>`;
  }

  // -------- Sesión --------
  function getSession() { try { return JSON.parse(localStorage.getItem(SKEY)); } catch (e) { return null; } }
  function setSession(s) { localStorage.setItem(SKEY, JSON.stringify(s)); }
  function logout() { localStorage.removeItem(SKEY); location.href = BASE + 'index.html'; }

  function initials(name) { return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
  function money(n) { return 'S/ ' + Number(n).toFixed(2); }

  // -------- Render del shell --------
  function renderShell(activeId) {
    const s = getSession();
    if (!s) { location.href = BASE + 'index.html'; return null; }

    const pendientes = DB.solicitudes().filter(x => x.estado === 'En revisión' || x.estado === 'Pendiente de pago').length;
    const groups = NAV[s.rol] || [];
    let nav = '';
    groups.forEach(g => {
      nav += `<div class="nav-group-title">${g.group}</div>`;
      g.items.forEach(it => {
        const badge = (it.badge === 'pendientes' && pendientes) ? `<span class="badge-count">${pendientes}</span>` : '';
        nav += `<a class="nav-item ${it.id === activeId ? 'active' : ''}" href="${BASE}${it.href}">${icon(it.icon)}<span>${it.label}</span>${badge}</a>`;
      });
    });

    const rolLabel = s.rol === 'alumno' ? 'Estudiante' : 'Administrativo · ' + (s.area || 'Académico');

    document.body.insertAdjacentHTML('afterbegin', `
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <div class="logo">W</div>
            <div class="brand-text"><b>Wiener Trámites</b><span>Intranet Universitaria</span></div>
          </div>
          <nav style="padding-bottom:12px">${nav}</nav>
          <div class="sidebar-foot">
            Universidad Norbert Wiener<br>Sistema de Trámites Documentarios
          </div>
        </aside>
        <div class="main">
          <header class="topbar">
            <div style="display:flex;align-items:center;gap:14px">
              <button class="menu-toggle" aria-label="Menú" onclick="APP.toggleNav()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div class="crumbs">Inicio / <b id="crumb-here">${activeId || ''}</b></div>
            </div>
            <div class="topbar-right">
              <div class="user-chip">
                <div class="avatar">${initials(s.nombre)}</div>
                <div class="who"><b>${s.nombre}</b><span>${rolLabel}</span></div>
              </div>
              <button class="btn btn-sm btn-ghost" onclick="APP.logout()" title="Cerrar sesión">Salir</button>
            </div>
          </header>
          <main class="content" id="page-content"></main>
        </div>
      </div>
      <div class="sidebar-backdrop" id="nav-backdrop" onclick="APP.toggleNav(false)"></div>
      <div id="modal-host"></div>
      <div id="toast-host"></div>
    `);
    // cerrar el menú móvil al navegar
    document.querySelectorAll('.sidebar .nav-item').forEach(a => a.addEventListener('click', () => toggleNav(false)));
    return { session: s, mount: document.getElementById('page-content') };
  }

  function toggleNav(force) {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('nav-backdrop');
    const open = (force === undefined) ? !sb.classList.contains('open') : force;
    sb.classList.toggle('open', open);
    bd.classList.toggle('show', open);
  }

  // -------- Toast / simulación de correo --------
  function toast({ title, body, icon: ic = '🔔', timeout = 5200 }) {
    const host = document.getElementById('toast-host');
    const el = document.createElement('div');
    el.className = 'toast mail';
    el.innerHTML = `<div class="t-title">${ic} ${title}</div><div class="t-body">${body}</div>`;
    host.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, timeout);
  }

  // Simula el envío de correo al alumno + copia (CC) al administrativo responsable
  function sendMail({ to, cc, subject, lines }) {
    const body = lines.join('<br>');
    toast({ icon: '✉️', title: 'Correo enviado → ' + to, body: `<b>Asunto:</b> ${subject}<br>${body}` });
    if (cc) setTimeout(() => toast({ icon: '📋', title: 'Copia (CC) → ' + cc, body: `<b>Asunto:</b> ${subject}` }), 700);
    // En backend real: POST /api/mail  (nodemailer / API institucional)
    console.log('[MAIL]', { to, cc, subject, lines });
  }

  // -------- Modal con Focus Trap y tecla Escape (AL-04) --------
  let _lastActiveElement = null;
  let _trapHandler = null;

  function openModal(html, opts = {}) {
    _lastActiveElement = document.activeElement;
    const host = document.getElementById('modal-host');
    host.innerHTML = `<div class="modal-overlay open" id="ov" role="dialog" aria-modal="true"><div class="modal ${opts.wide ? 'wide' : ''}">${html}</div></div>`;
    const ov = document.getElementById('ov');
    const modal = ov.querySelector('.modal');

    // Click en overlay exterior para cerrar
    ov.addEventListener('click', e => { if (e.target === ov && !opts.locked) closeModal(); });

    // Focus trap y tecla Escape
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modal.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 30);
    } else {
      modal.setAttribute('tabindex', '-1');
      modal.focus();
    }

    if (_trapHandler) document.removeEventListener('keydown', _trapHandler);
    _trapHandler = function (e) {
      if (e.key === 'Escape' && !opts.locked) {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'Tab') {
        const currentFocusables = Array.from(modal.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
        if (currentFocusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = currentFocusables[0];
        const last = currentFocusables[currentFocusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modal) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', _trapHandler);
  }

  function closeModal() {
    if (_trapHandler) {
      document.removeEventListener('keydown', _trapHandler);
      _trapHandler = null;
    }
    const host = document.getElementById('modal-host');
    if (host) host.innerHTML = '';
    if (_lastActiveElement && typeof _lastActiveElement.focus === 'function') {
      _lastActiveElement.focus();
      _lastActiveElement = null;
    }
  }

  // -------- Pasarela de pago Niubiz (simulada, lista para integrar) --------
  // Integración real: el backend crea una "sesión" con la Security API de Niubiz,
  // y el frontend monta el botón de pago (checkout.js de VisaNet/Niubiz).
  function niubizCheckout({ amount, concepto, onSuccess }) {
    openModal(`
      <div class="niubiz-head">
        <div><div class="nb-logo">niubiz</div><div style="font-size:11px;opacity:.85">Pago seguro · VisaNet</div></div>
        <div class="nb-amount"><b>${money(amount)}</b><span>PEN</span></div>
      </div>
      <div class="modal-body">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">${concepto}</div>
        <div class="card-visual">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="chip"></div><span style="font-size:12px;opacity:.8">CRÉDITO / DÉBITO</span>
          </div>
          <div class="num" id="nb-num">•••• •••• •••• ••••</div>
          <div style="display:flex;justify-content:space-between;font-size:11px;opacity:.85">
            <span id="nb-name">NOMBRE DEL TITULAR</span><span id="nb-exp">MM/AA</span>
          </div>
        </div>
        <div class="form-grid" style="grid-template-columns:1fr 1fr">
          <div class="field full"><label for="f-num">Número de tarjeta</label>
            <input class="input" id="f-num" maxlength="19" placeholder="4111 1111 1111 1111" oninput="APP._nbMask(this)"></div>
          <div class="field full"><label for="f-name">Titular de la tarjeta</label>
            <input class="input" id="f-name" placeholder="Como figura en la tarjeta" oninput="document.getElementById('nb-name').textContent=(this.value||'NOMBRE DEL TITULAR').toUpperCase()"></div>
          <div class="field"><label for="f-exp">Vencimiento</label>
            <input class="input" id="f-exp" maxlength="5" placeholder="MM/AA" oninput="APP._nbExp(this)"></div>
          <div class="field"><label for="f-cvv">CVV</label>
            <input class="input" id="f-cvv" maxlength="4" placeholder="•••" type="password"></div>
        </div>
        <div class="alert info" style="margin-top:16px;font-size:12.5px">🔒 Entorno de demostración. Los datos no se procesan. En producción se usa la pasarela <b>Niubiz</b> (VisaNet) con tokenización.</div>
      </div>
      <div class="modal-foot">
        <button class="btn" onclick="APP.closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="nb-pay">Pagar ${money(amount)}</button>
      </div>
    `, { wide: false });

    document.getElementById('nb-pay').addEventListener('click', function () {
      const num = document.getElementById('f-num').value.replace(/\s/g, '');
      const name = document.getElementById('f-name').value.trim();
      const exp = document.getElementById('f-exp').value;
      const cvv = document.getElementById('f-cvv').value;
      if (num.length < 15 || !name || exp.length < 5 || cvv.length < 3) {
        toast({ icon: '⚠️', title: 'Datos incompletos', body: 'Completa los datos de la tarjeta para continuar.' });
        return;
      }
      this.textContent = 'Procesando...'; this.disabled = true;
      setTimeout(() => {
        const marca = num[0] === '4' ? 'Visa' : num[0] === '5' ? 'Mastercard' : 'Tarjeta';
        const op = 'NB-' + Math.floor(90000000 + Math.random() * 9999999);
        closeModal();
        onSuccess({ metodo: `Niubiz · ${marca} ****${num.slice(-4)}`, operacion: op, monto: amount });
      }, 1300);
    });
  }
  function _nbMask(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 16);
    el.value = v.replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('nb-num').textContent = (el.value || '•••• •••• •••• ••••').padEnd(19, '•');
  }
  function _nbExp(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    el.value = v;
    document.getElementById('nb-exp').textContent = v || 'MM/AA';
  }

  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function nowStamp() { const d = new Date(); return d.toISOString().slice(0, 10) + ' ' + d.toTimeString().slice(0, 5); }

  // Cálculo de SLA exacto en días hábiles (excluye sábados y domingos)
  function calcSLA(diasHabiles, baseDate) {
    const d = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
    let count = 0;
    while (count < (diasHabiles || 1)) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) count++;
    }
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
  }

  function pillFor(estado) {
    const map = {
      'Pendiente de pago': 'warn',
      'En revisión': 'info',
      'Observado': 'warn',
      'Aprobado': 'ok',
      'Rechazado': 'err',
      'Emitido': 'purple'
    };
    const iconMap = {
      'Observado': '⚠️ ',
      'Emitido': '✓ ',
      'Rechazado': '✕ '
    };
    return `<span class="pill ${map[estado] || 'gray'}">${iconMap[estado] || ''}${estado}</span>`;
  }

  window.APP = {
    BASE, getSession, setSession, logout, renderShell, toggleNav, icon, ICONS,
    toast, sendMail, openModal, closeModal,
    niubizCheckout, _nbMask, _nbExp,
    money, initials, todayISO, nowStamp, calcSLA, pillFor
  };
})();
