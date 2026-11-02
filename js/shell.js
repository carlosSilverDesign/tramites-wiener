/* ==========================================================================
   SHELL - navegación, sesión, helpers de UI compartidos
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

    // revisar: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    revisar: 'M4,21q-0.82,0-1.41-0.59T2,19V5Q2,4.17 2.59,3.59T4,3H20q0.83,0 1.41,0.59T22,5V19q0,0.82-0.59,1.41T20,21H4Zm0-2H20V5H4V19Zm5-2q0.43,0 0.71-0.29Q10,16.43 10,16T9.71,15.29T9,15H6q-0.42,0-0.71,0.29T5,16t0.29,0.71T6,17H9Zm5.55-4.83l-0.72-0.72q-0.3-0.3-0.7-0.29t-0.7,0.31q-0.28,0.3-0.29,0.7t0.29,0.7l1.43,1.42q0.3,0.3 0.7,0.3t0.7-0.3l3.55-3.55q0.3-0.3 0.3-0.7t-0.3-0.7t-0.71-0.3t-0.71,0.3l-2.82,2.82ZM9,13q0.43,0 0.71-0.29Q10,12.43 10,12T9.71,11.29T9,11H6q-0.42,0-0.71,0.29T5,12t0.29,0.71T6,13H9ZM9,9Q9.43,9 9.71,8.71T10,8q0-0.43-0.29-0.71T9,7H6Q5.58,7 5.29,7.29T5,8Q5,8.42 5.29,8.71T6,9H9ZM4,19V5V19Z',

    // tramites: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
    tramites: 'M10.83,22q-0.68,0-1.16-0.45t-0.59-1.1L8.85,18.8q-0.32-0.13-0.61-0.3T7.68,18.13L6.13,18.77Q5.5,19.05 4.88,18.83T3.9,18.02L2.73,15.98q-0.35-0.57-0.2-1.22T3.2,13.68l1.33-1Q4.5,12.5 4.5,12.34q0-0.16 0-0.34t0-0.34t0.03-0.34l-1.33-1Q2.68,9.9 2.53,9.25t0.2-1.23L3.9,5.97Q4.25,5.4 4.88,5.18T6.13,5.22L7.68,5.88Q7.95,5.68 8.25,5.5t0.6-0.3L9.08,3.55q0.1-0.65 0.59-1.1T10.83,2h2.35q0.68,0 1.16,0.45t0.59,1.1L15.15,5.2q0.33,0.13 0.61,0.3t0.56,0.38l1.55-0.65q0.63-0.27 1.25-0.05t0.98,0.8l1.18,2.05q0.35,0.58 0.2,1.23T20.8,10.33l-1.32,1q0.02,0.18 0.02,0.34t0,0.34t0,0.34t-0.05,0.34l1.32,1q0.52,0.43 0.68,1.08t-0.2,1.22l-1.2,2.05q-0.35,0.58-0.98,0.8t-1.25-0.05l-1.5-0.65q-0.27,0.2-0.57,0.38t-0.6,0.3l-0.22,1.65q-0.1,0.65-0.59,1.1T13.18,22H10.83ZM11,20h1.98l0.35-2.65q0.78-0.2 1.44-0.59t1.21-0.94l2.47,1.03l0.98-1.7l-2.15-1.63q0.13-0.35 0.17-0.74T17.5,12t-0.05-0.79q-0.05-0.39-0.17-0.74l2.15-1.63l-0.98-1.7L15.98,8.2q-0.55-0.57-1.21-0.96T13.33,6.65L13,4H11.03L10.68,6.65Q9.9,6.85 9.24,7.24T8.03,8.17L5.55,7.15L4.58,8.85l2.15,1.6Q6.6,10.83 6.55,11.2T6.5,12q0,0.4 0.05,0.77t0.17,0.75L4.58,15.15l0.98,1.7L8.03,15.8q0.55,0.58 1.21,0.96t1.44,0.59L11,20Zm1.05-4.5q1.45,0 2.47-1.03T15.55,12T14.53,9.52T12.05,8.5q-1.47,0-2.49,1.02T8.55,12t1.01,2.47t2.49,1.03ZM12,12Z',

    // flujos: 'M4 4h6v4H4V4zm10 12h6v4h-6v-4zM7 8v4a2 2 0 0 0 2 2h3M4 16h6v4H4v-4z',
    flujos: 'M15,19V18H13q-0.82,0-1.41-0.59T11,16V8H9V9q0,0.82-0.59,1.41Q7.83,11 7,11H4q-0.82,0-1.41-0.59T2,9V5Q2,4.17 2.59,3.59T4,3H7Q7.83,3 8.41,3.59T9,5V6h6V5q0-0.83 0.59-1.41T17,3h3q0.83,0 1.41,0.59T22,5V9q0,0.82-0.59,1.41T20,11H17q-0.82,0-1.41-0.59T15,9V8H13v8h2V15q0-0.83 0.59-1.41T17,13h3q0.83,0 1.41,0.59Q22,14.18 22,15v4q0,0.82-0.59,1.41T20,21H17q-0.82,0-1.41-0.59T15,19ZM4,5V9V5ZM17,15v4V15ZM17,5V9V5Zm0,4h3V5H17V9Zm0,10h3V15H17v4ZM4,9H7V5H4V9Z',


    // usuarios: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.7 0-8 1.3-8 4v3h10v-3c0-1 .4-1.9 1-2.6C9.6 13.1 8.5 13 8 13zm8 0c-.3 0-.7 0-1.1.1A5.6 5.6 0 0 1 18 17v3h6v-3c0-2.7-5.3-4-8-4z',
    usuarios: 'M7.18,10.83Q6,9.65 6,8T7.18,5.18T10,4t2.83,1.18T14,8t-1.17,2.82T10,12T7.18,10.83ZM2,18V17.2q0-0.82 0.43-1.55t1.17-1.1q1.45-0.72 3-1.14T9.78,13q0.43,0 0.71,0.3t0.29,0.72t-0.29,0.71q-0.29,0.29-0.71,0.29q-1.4,0-2.71,0.35T4.5,16.35Q4.25,16.48 4.13,16.7Q4,16.93 4,17.2V18H9.78q0.43,0 0.71,0.29T10.78,19t-0.29,0.71T9.78,20H4q-0.82,0-1.41-0.59T2,18Zm13.85,2.2L15.7,19.5q-0.3-0.13-0.56-0.26T14.6,18.9l-0.73,0.23q-0.32,0.1-0.64-0.02t-0.49-0.4l-0.2-0.35q-0.18-0.3-0.13-0.65t0.32-0.57l0.55-0.48Q13.25,16.3 13.25,16t0.05-0.65l-0.55-0.47q-0.27-0.22-0.32-0.56t0.13-0.64l0.22-0.38q0.18-0.28 0.47-0.4t0.63-0.02L14.6,13.1q0.27-0.2 0.54-0.34T15.7,12.5l0.15-0.73q0.07-0.35 0.34-0.56T16.8,11h0.4q0.35,0 0.61,0.22t0.34,0.57l0.15,0.7q0.3,0.13 0.56,0.27q0.26,0.15 0.54,0.38l0.68-0.22q0.35-0.13 0.67,0t0.5,0.43l0.2,0.35q0.17,0.3 0.13,0.65t-0.33,0.57L20.7,15.4q0.05,0.3 0.05,0.62T20.7,16.65l0.55,0.48q0.28,0.23 0.33,0.56t-0.13,0.64L21.23,18.7q-0.18,0.28-0.48,0.4t-0.63,0.02L19.4,18.9q-0.28,0.2-0.54,0.34T18.3,19.5l-0.15,0.73q-0.08,0.35-0.34,0.56T17.2,21H16.8q-0.35,0-0.61-0.23T15.85,20.2Zm2.56-2.79Q19,16.83 19,16t-0.59-1.41T17,14t-1.41,0.59T15,16t0.59,1.41T17,18t1.41-0.59Zm-7-8Q12,8.82 12,8T11.41,6.59T10,6Q9.18,6 8.59,6.59Q8,7.18 8,8T8.59,9.41T10,10t1.41-0.59ZM10,8Zm0.3,10Z',

    // seguridad: 'M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm0 10.9h7c-.5 4.1-3.3 7.8-7 8.9V12H5V6.3l7-3.1V12z',
    seguridad: 'M12,19.9q2.43-0.75 4.05-2.96T17.95,12H12V4.13L6,6.38V11.1q0,0.28 0,0.45Q6,11.73 6.05,12H12v7.9Zm-0.32,1.98q-0.15-0.02-0.3-0.07Q8,20.68 6,17.64T4,11.1V6.38Q4,5.75 4.36,5.25Q4.73,4.75 5.3,4.52l6-2.25Q11.65,2.15 12,2.15t0.7,0.13l6,2.25q0.58,0.23 0.94,0.73T20,6.38V11.1q0,3.5-2,6.54q-2,3.04-5.38,4.16q-0.15,0.05-0.3,0.07T12,21.9t-0.32-0.02Z',

    // procesar: 'M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z',
    procesar: 'M13,11h6.95q-0.38-2.75-2.29-4.66T13,4.05V11Zm-2,8.95V4.05Q7.98,4.42 5.99,6.69T4,12t1.99,5.31T11,19.95Zm2,0q2.75-0.35 4.68-2.27T19.95,13H13v6.95ZM12,12Zm0,10q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.89,0.79t3.17,2.15t2.15,3.17T22,12q0,2.05-0.79,3.88t-2.14,3.19q-1.35,1.36-3.17,2.15T12,22Z',

    // reportes: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    reportes: 'M7.29,12.29Q7,12.58 7,13v3q0,0.43 0.29,0.71T8,17t0.71-0.29Q9,16.43 9,16V13q0-0.43-0.29-0.71T8,12q-0.42,0-0.71,0.29Zm8-5Q15,7.57 15,8v8q0,0.43 0.29,0.71T16,17q0.43,0 0.71-0.29Q17,16.43 17,16V8q0-0.43-0.29-0.71T16,7T15.29,7.29Zm-4,7Q11,14.58 11,15v1q0,0.43 0.29,0.71T12,17t0.71-0.29Q13,16.43 13,16V15q0-0.43-0.29-0.71T12,14t-0.71,0.29ZM5,21q-0.83,0-1.41-0.59T3,19V5Q3,4.17 3.59,3.59T5,3H19q0.83,0 1.41,0.59T21,5V19q0,0.82-0.59,1.41T19,21H5Zm0-2H19V5H5V19ZM5,5V19V5Zm7.71,6.71Q13,11.43 13,11t-0.29-0.71T12,10t-0.71,0.29T11,11t0.29,0.71T12,12t0.71-0.29Z',

    catalogo: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z',

    // registrar: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
    registrar: 'M11,13v3q0,0.43 0.29,0.71T12,17t0.71-0.29Q13,16.43 13,16V13h3q0.43,0 0.71-0.29Q17,12.43 17,12t-0.29-0.71T16,11H13V8q0-0.43-0.29-0.71T12,7T11.29,7.29T11,8v3H8q-0.42,0-0.71,0.29T7,12t0.29,0.71T8,13h3ZM5,21q-0.83,0-1.41-0.59T3,19V5Q3,4.17 3.59,3.59T5,3H19q0.83,0 1.41,0.59T21,5V19q0,0.82-0.59,1.41T19,21H5Zm0-2H19V5H5V19ZM5,5V19V5Z',

    config: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.4 4 1.8 1.4-1.8 3.1-2.2-.7a6.9 6.9 0 0 1-1.5.9l-.3 2.3h-3.6l-.3-2.3c-.5-.2-1-.5-1.5-.9l-2.2.7-1.8-3.1L4.6 12l-.2-.9.2-1.1L2.8 8.6l1.8-3.1 2.2.7c.5-.4 1-.7 1.5-.9l.3-2.3h3.6l.3 2.3c.5.2 1 .5 1.5.9l2.2-.7 1.8 3.1L20.6 12z'
  };

  const NAV = {
    alumno: [
      {
        group: 'Mis trámites', items: [
          { id: 'solicitar', label: 'Solicitar trámite', href: 'alumno/solicitar.html', icon: 'solicitar' },
          { id: 'mis-tramites', label: 'Estado de trámites', href: 'alumno/mis-tramites.html', icon: 'estado' }
        ]
      }
    ],
    administrativo: [
      {
        group: 'Atención al Estudiante', items: [
          { id: 'catalogo', label: 'Catálogo de trámites', href: 'admin/catalogo.html', icon: 'catalogo' },
          { id: 'registrar', label: 'Registrar', href: 'admin/registrar.html', icon: 'registrar' }
        ]
      },
      {
        group: 'Operación', items: [
          { id: 'solicitudes', label: 'Vista de trámites', href: 'admin/solicitudes.html', icon: 'revisar', badge: 'pendientes' },
          { id: 'flujos', label: 'Flujos de trámites', href: 'admin/flujos.html', icon: 'flujos' }
        ]
      },
      {
        group: 'Reportes y Estadísticas', items: [
          { id: 'procesar', label: 'Procesar', href: 'admin/procesar.html', icon: 'procesar' },
          { id: 'reportes', label: 'Reportes', href: 'admin/reportes.html', icon: 'reportes' }
        ]
      },
      {
        group: 'Configuración', items: [
          { id: 'tramites', label: 'Trámites', href: 'admin/tramites.html', icon: 'tramites' },
          { id: 'usuarios', label: 'Usuarios', href: 'admin/usuarios.html', icon: 'usuarios' },
          { id: 'seguridad', label: 'Seguridad', href: 'admin/seguridad.html', icon: 'seguridad' }
        ]
      }
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
    let activeLabel = activeId || '';
    groups.forEach(g => {
      nav += `<div class="nav-group-title">${g.group}</div>`;
      g.items.forEach(it => {
        if (it.id === activeId) activeLabel = it.label;
        const badge = (it.badge === 'pendientes' && pendientes) ? `<span class="badge-count">${pendientes}</span>` : '';
        nav += `<a class="nav-item ${it.id === activeId ? 'active' : ''}" href="${BASE}${it.href}">${icon(it.icon)}<span>${it.label}</span>${badge}</a>`;
      });
    });

    const rolLabel = s.rol === 'alumno' ? 'Estudiante' : 'Administrativo · ' + (s.area || 'Académico');

    document.body.insertAdjacentHTML('afterbegin', `
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="132" height="97" viewBox="0 0 132 97" fill="none">
              <path d="M2.93794 29.8107C3.08939 29.8758 3.34903 29.9555 3.65915 29.9627C4.05582 29.9627 4.53904 29.8469 4.9862 29.3907L17.5859 16.727L2.25278 1.38424C2.06526 1.19598 1.74792 1.32631 1.74792 1.59421V26.8638L1.76956 28.044C1.76956 29.1952 2.59175 29.6586 2.94515 29.8034" fill="#07C8CC"/>
              <path d="M46.2472 34.4012C44.0331 33.0762 42.706 30.7375 42.706 28.0729V3.88947C42.706 2.73823 41.8838 2.27483 41.5304 2.13002C41.379 2.06485 41.1194 1.98521 40.8092 1.97797C40.4126 1.97797 39.9293 2.09382 39.475 2.54997L8.8881 33.2862C7.46008 34.727 5.61376 35.48 3.70975 35.48C3.66647 35.48 3.61599 35.48 3.57272 35.48C3.52223 35.48 3.47896 35.48 3.42847 35.48C3.30586 35.48 3.19047 35.4656 3.06786 35.4583C2.96689 35.4511 2.86592 35.4366 2.76495 35.4221C2.70725 35.4149 2.64234 35.4076 2.58465 35.3932C2.48367 35.3787 2.37549 35.357 2.27452 35.3425C2.27452 35.3425 2.27452 35.3425 2.26731 35.3425C1.78409 35.2483 1.30088 35.1035 0.824872 34.908C0.615719 34.8211 0.42099 34.727 0.226261 34.6257C0.0675925 34.546 -0.0766512 34.7487 0.045956 34.8791L17.8817 52.785C20.7377 55.6522 25.3679 55.6522 28.2168 52.785C28.2168 52.785 46.24 34.6908 46.3049 34.6257C46.3698 34.5605 46.3482 34.4664 46.2544 34.4084" fill="#07C8CC"/>
              <path d="M48.1869 3.88947V20.6948L48.2086 21.0858V27.9788C48.2086 29.1518 49.0452 29.6297 49.4058 29.7745C49.7231 29.9048 50.466 30.1148 51.1944 29.6224C51.2738 29.5645 51.3531 29.4993 51.4324 29.4197L63.9672 16.8356C64.0177 16.7849 64.0177 16.7125 63.9672 16.6618L47.4225 0.0374922C47.3215 -0.0638757 47.1556 0.0592138 47.2277 0.182303C47.848 1.27563 48.1869 2.53549 48.1869 3.88223" fill="#07C8CC"/>
              <path d="M88.1783 1.3408C87.897 1.05842 87.4354 1.05842 87.147 1.3408L55.8893 32.7214L55.3917 33.2427C55.1898 33.4454 54.9806 33.6265 54.7642 33.8002C54.7498 33.8147 54.7282 33.8292 54.7065 33.8437C54.6344 33.9016 54.5695 33.9523 54.4974 34.0102C53.2136 34.9877 51.6919 35.4945 50.1268 35.4945C49.1676 35.4945 48.1939 35.3063 47.2564 34.9153C47.0472 34.8284 46.8741 34.7487 46.6794 34.6401C46.5351 34.5605 46.3981 34.727 46.5568 34.8791C46.7082 35.0311 64.3925 52.7777 64.3925 52.7777C67.2413 55.6378 71.8643 55.6378 74.7131 52.7777L101.831 25.5532C104.723 22.6498 104.723 17.9506 101.831 15.0472L88.1783 1.3408Z" fill="#07C8CC"/>
              <path d="M5.51309 78.4104C8.58254 78.4104 11.0441 76.9623 11.0441 73.103V64.9354H9.20835V73.1389C9.20835 75.634 7.89117 76.8726 5.51309 76.8726C3.13501 76.8726 1.85955 75.634 1.85955 73.1149V64.9354H0V73.097C0 76.9564 2.44364 78.4044 5.51309 78.4044" fill="white"/>
              <path d="M14.9063 72.8876C14.9063 71.2062 16.0327 70.1172 17.4572 70.1172C18.8817 70.1172 19.7042 71.0805 19.7042 72.6123V78.1531H21.4982V72.4627C21.4982 70.3206 20.5028 68.729 18.0413 68.729C16.6347 68.729 15.3593 69.5069 14.9063 70.6198V68.9803H13.1123V78.1531H14.9063V72.8876Z" fill="white"/>
              <path d="M25.2828 64.9354H23.4232V66.91H25.2828V64.9354Z" fill="white"/>
              <path d="M25.259 68.9863H23.465V78.1591H25.259V68.9863Z" fill="white"/>
              <path d="M31.8569 78.1531L35.7488 68.9863H33.9965L31.1238 76.0349H31.0344L28.096 68.9863H26.2126L30.1046 78.1531H31.8569Z" fill="white"/>
              <path d="M40.5888 78.4104C42.943 78.4104 44.5225 77.1478 44.9993 75.0716L43.5093 74.904C43.1218 76.3102 42.1921 77.0461 40.6126 77.0461C38.9259 77.0461 37.6088 75.7896 37.5194 74.0005H45.041V73.3064C45.041 70.8113 43.5092 68.729 40.5054 68.729C37.7816 68.729 35.7313 70.8053 35.7313 73.7013C35.7313 76.5974 37.7876 78.4044 40.5948 78.4044M40.4994 70.0573C42.2934 70.0573 43.1338 71.4036 43.1993 72.8696H37.5611C37.7756 71.3618 38.7948 70.0573 40.4994 70.0573Z" fill="white"/>
              <path d="M48.3842 73.3064C48.3842 71.5413 49.3974 70.3446 50.7623 70.3446C51.3464 70.3446 51.7159 70.4523 52.2344 70.7215L52.4073 69.1479C52.0854 68.8726 51.6503 68.729 51.0662 68.729C49.7073 68.729 48.7299 69.8001 48.3842 70.8472V68.9803H46.5902V78.1531H48.3842V73.3064Z" fill="white"/>
              <path d="M57.1094 77.1299C55.4883 77.1299 54.475 76.376 54.3022 74.9698L52.7883 75.0715C52.9612 77.3393 54.7552 78.4104 57.1094 78.4104C59.3146 78.4104 60.9775 77.4231 60.9775 75.5981C60.9775 73.9407 59.851 73.2466 57.9498 72.9354L56.1796 72.6602C55.2081 72.4926 54.7313 72.1157 54.7313 71.3797C54.7313 70.542 55.5061 70.0154 56.6982 70.0154C58.2955 70.0154 59.1835 70.6677 59.3981 72.0738L60.8464 71.99C60.6735 69.8718 59.2014 68.735 56.6982 68.735C54.5168 68.735 53.0685 69.8659 53.0685 71.5472C53.0685 73.1209 54.1294 73.8569 55.8995 74.1261L57.4968 74.4014C58.665 74.6108 59.2908 74.904 59.2908 75.7656C59.2908 76.6871 58.361 77.1299 57.1094 77.1299Z" fill="white"/>
              <path d="M64.3398 68.9863H62.5458V78.1591H64.3398V68.9863Z" fill="white"/>
              <path d="M64.3635 64.9354H62.5039V66.91H64.3635V64.9354Z" fill="white"/>
              <path d="M73.5417 76.2443V78.1531H75.3357V64.9354H73.5417V70.919C73.1066 69.7881 71.9206 68.735 70.1504 68.735C67.3432 68.735 65.8293 70.8771 65.8293 73.5816C65.8293 76.2862 67.3432 78.4104 70.1504 78.4104C71.9206 78.4104 73.1126 77.3812 73.5417 76.2503M67.665 73.5816C67.665 71.4814 68.7021 70.1411 70.5617 70.1411C72.2722 70.1411 73.5656 71.3139 73.5656 73.3124V73.8389C73.5656 75.8554 72.2722 77.0282 70.5617 77.0282C68.7021 77.0282 67.665 75.6878 67.665 73.5876" fill="white"/>
              <path d="M80.7116 72.9713C78.4408 73.4141 76.9091 74.1262 76.9091 75.8674C76.9091 77.441 78.0951 78.4044 79.9368 78.4044C81.4685 78.4044 82.8095 77.6086 83.3281 76.5375C83.4354 77.6265 84.1267 78.3446 85.0982 78.3446C85.8313 78.3446 86.2247 78.1112 86.5465 77.8001V76.8547C86.2903 77.0042 85.9386 77.0641 85.724 77.0641C85.2711 77.0641 84.9909 76.8307 84.9909 76.352V72.2354C84.9909 69.9078 83.5844 68.729 81.2063 68.729C78.9772 68.729 77.5766 69.9915 77.2071 71.7088L78.8044 71.9182C79.0845 70.8472 79.8176 70.0693 81.1825 70.0693C82.5473 70.0693 83.2566 70.8472 83.2566 72.1037V72.4627L80.7056 72.9654L80.7116 72.9713ZM83.2625 74.0663C83.2625 75.9152 81.9871 77.1299 80.3242 77.1299C79.2454 77.1299 78.7031 76.5435 78.7031 75.7657C78.7031 74.6527 79.6507 74.3775 81.1467 74.0663L83.2625 73.6235V74.0663Z" fill="white"/>
              <path d="M91.2018 78.4104C92.972 78.4104 94.164 77.3812 94.5931 76.2503V78.1591H96.3871V64.9354H94.5931V70.919C94.164 69.7881 92.972 68.735 91.2018 68.735C88.3946 68.735 86.8807 70.8771 86.8807 73.5816C86.8807 76.2862 88.3946 78.4104 91.2018 78.4104ZM91.6131 70.1411C93.3176 70.1411 94.6169 71.3139 94.6169 73.3124V73.8389C94.6169 75.8554 93.3176 77.0282 91.6131 77.0282C89.7535 77.0282 88.7164 75.6878 88.7164 73.5876C88.7164 71.4874 89.7535 70.1471 91.6131 70.1471" fill="white"/>
              <path d="M9.0415 92.2802L2.68803 83.4665H0.041748V96.6841H2.51518V87.3677L9.38122 96.6841H11.5149V83.4665H9.0415V92.2802Z" fill="white"/>
              <path d="M17.9878 87.1762C15.0852 87.1762 13.0409 89.1927 13.0409 92.0648C13.0409 94.9369 15.0852 96.9354 17.9878 96.9354C20.8903 96.9354 22.9585 94.9429 22.9585 92.0648C22.9585 89.1867 20.9142 87.1762 17.9878 87.1762ZM17.9878 95.0267C16.4322 95.0267 15.6216 93.812 15.6216 92.0648C15.6216 90.3176 16.4322 89.085 17.9878 89.085C19.5434 89.085 20.3778 90.2997 20.3778 92.0648C20.3778 93.8299 19.5672 95.0267 17.9878 95.0267Z" fill="white"/>
              <path d="M30.5633 89.9047L30.7541 87.5532C30.4799 87.3199 30.009 87.1762 29.4309 87.1762C28.1316 87.1762 27.1482 88.1396 26.8085 89.1927V87.4276H24.2516V96.6841H26.8085V92.1067C26.8085 90.4253 27.7025 89.5038 29.0256 89.5038C29.6455 89.5038 30.0686 89.6295 30.5633 89.9047Z" fill="white"/>
              <path d="M37.3762 87.1763C35.6895 87.1763 34.563 88.0798 34.1339 89.2107V83.4605H31.577V96.6841H33.5379L34.0087 94.901C34.4975 96.0558 35.6955 96.9354 37.3345 96.9354C40.1476 96.9354 41.6198 94.7933 41.6198 92.0648C41.6198 89.3363 40.1476 87.1763 37.3762 87.1763ZM36.5835 94.9668C35.1352 94.9668 34.1101 93.9377 34.1101 92.2383V91.8793C34.1101 90.198 35.1352 89.1508 36.5835 89.1508C38.2047 89.1508 39.0331 90.3057 39.0331 92.0708C39.0331 93.8359 38.1987 94.9668 36.5835 94.9668Z" fill="white"/>
              <path d="M49.8861 93.453C49.5225 94.5001 48.7775 95.0267 47.5199 95.0267C46.1312 95.0267 45.0465 94.0633 44.963 92.6991H52.0198V91.7955C52.0198 89.2765 50.4404 87.1762 47.3709 87.1762C44.5578 87.1762 42.4479 89.2765 42.4479 92.1905C42.4479 95.1044 44.5399 96.9354 47.4365 96.9354C49.8444 96.9354 51.4655 95.7207 51.9602 93.6624L49.892 93.453H49.8861ZM47.3471 89.0252C48.7775 89.0252 49.4391 90.0543 49.5225 91.1254H44.9988C45.2312 89.9706 45.9405 89.0252 47.3471 89.0252Z" fill="white"/>
              <path d="M58.1649 89.5098C58.7848 89.5098 59.2079 89.6355 59.7026 89.9107L59.8933 87.5592C59.6192 87.3258 59.1483 87.1822 58.5702 87.1822C57.2709 87.1822 56.2875 88.1456 55.9478 89.1987V87.4335H53.3909V96.6901H55.9478V92.1127C55.9478 90.4313 56.8418 89.5098 58.1649 89.5098Z" fill="white"/>
              <path d="M64.1304 93.7701V89.1927H66.6873V87.4276H64.1304V84.8666H62.5748L62.2768 86.1232C62.0623 86.9848 61.806 87.4455 60.8881 87.5951L60.2504 87.7028V89.1927H61.5914V94.3326C61.5914 96.3071 62.8072 96.9354 64.2556 96.9354C65.4059 96.9354 66.1747 96.6422 66.8601 96.1396V94.4822C66.3058 94.7335 65.7694 94.9249 65.2628 94.9249C64.494 94.9249 64.1304 94.5659 64.1304 93.7701Z" fill="white"/>
              <path d="M85.7541 83.4665L83.2986 93.2017H83.2151L80.5927 83.4665H78.1371L75.5385 93.1838H75.4551L72.9817 83.4665H70.3115L73.7922 96.6841H76.7127L79.2695 87.1583H79.353L81.892 96.6841H84.8363L88.311 83.4665H85.7541Z" fill="white"/>
              <path d="M91.8033 83.4605H89.1809V85.9137H91.8033V83.4605Z" fill="white"/>
              <path d="M91.7853 87.4276H89.2284V96.6841H91.7853V87.4276Z" fill="white"/>
              <path d="M97.9781 87.1762C95.1649 87.1762 93.0551 89.2765 93.0551 92.1905C93.0551 95.1044 95.147 96.9354 98.0437 96.9354C100.452 96.9354 102.073 95.7207 102.561 93.6624L100.493 93.453C100.13 94.5001 99.3847 95.0267 98.1271 95.0267C96.7384 95.0267 95.6537 94.0633 95.5702 92.6991H102.627V91.7955C102.627 89.2765 101.048 87.1762 97.9781 87.1762ZM95.6119 91.1254C95.8444 89.9706 96.5477 89.0252 97.9602 89.0252C99.3728 89.0252 100.052 90.0543 100.136 91.1254H95.6179H95.6119Z" fill="white"/>
              <path d="M106.555 91.7357C106.555 90.18 107.366 89.1748 108.665 89.1748C109.964 89.1748 110.501 89.9945 110.501 91.4186V96.6841H113.058V90.91C113.058 88.8516 112.14 87.1762 109.625 87.1762C108.218 87.1762 107.026 87.8883 106.555 88.9414V87.4276H103.998V96.6841H106.555V91.7297V91.7357Z" fill="white"/>
              <path d="M119.243 96.9354C121.651 96.9354 123.273 95.7207 123.767 93.6624L121.699 93.453C121.335 94.5001 120.59 95.0267 119.333 95.0267C117.95 95.0267 116.859 94.0633 116.776 92.6991H123.833V91.7955C123.833 89.2765 122.253 87.1762 119.184 87.1762C116.371 87.1762 114.261 89.2765 114.261 92.1905C114.261 95.1044 116.353 96.9354 119.249 96.9354M119.16 89.0252C120.59 89.0252 121.252 90.0543 121.335 91.1254H116.812C117.044 89.9706 117.753 89.0252 119.16 89.0252Z" fill="white"/>
              <path d="M127.755 92.1127C127.755 90.4313 128.649 89.5098 129.972 89.5098C130.592 89.5098 131.015 89.6355 131.51 89.9107L131.701 87.5592C131.427 87.3258 130.956 87.1822 130.378 87.1822C129.078 87.1822 128.095 88.1456 127.755 89.1987V87.4335H125.198V96.6901H127.755V92.1127Z" fill="white"/>
            </svg>
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
              <div class="crumbs">Inicio / <b id="crumb-here">${activeLabel}</b></div>
            </div>
            <div class="topbar-right">
              <div class="user-chip">
                <div class="avatar">${initials(s.nombre)}</div>
                <div class="who"><b>${s.nombre}</b><span>${rolLabel}</span></div>
              </div>
              <div class="topbar-divider" aria-hidden="true"></div>
              <button class="btn btn-sm btn-ghost btn-logout" onclick="APP.logout()" title="Cerrar sesión">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Salir</span>
              </button>
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
    let host = document.getElementById('toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      document.body.appendChild(host);
    }
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
    let host = document.getElementById('modal-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'modal-host';
      document.body.appendChild(host);
    }
    const cls = [opts.extraWide ? 'extra-wide' : (opts.wide ? 'wide' : ''), opts.className || ''].filter(Boolean).join(' ');
    host.innerHTML = `<div class="modal-overlay open" id="ov" role="dialog" aria-modal="true"><div class="modal ${cls}">${html}</div></div>`;
    const ov = document.getElementById('ov');
    const modal = ov.querySelector('.modal');

    // Click en overlay exterior para cerrar
    ov.addEventListener('click', e => { if (e.target === ov && !opts.locked) closeModal(); });

    // Inicializar selects y datepickers personalizados en el modal
    setTimeout(() => {
      initCustomSelects(modal);
      initDatePickers(modal);
    }, 10);

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
        <div class="alert info" style="margin-top:16px;font-size:12.5px;display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div style="flex:1">🔒 Entorno de demostración. Los datos no se procesan. En producción se usa la pasarela</div>
          <div style="text-align:right;white-space:nowrap"><b style="color:var(--brand-dark)">Niubiz</b> <span style="font-size:11.5px">(VisaNet) con tokenización.</span></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn" onclick="APP.closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="nb-pay">Pagar ${money(amount)}</button>
      </div>
    `, { wide: false });

    document.getElementById('nb-pay').addEventListener('click', function () {
      let num = document.getElementById('f-num').value.replace(/\s/g, '');
      let name = document.getElementById('f-name').value.trim();
      let exp = document.getElementById('f-exp').value.trim();
      let cvv = document.getElementById('f-cvv').value.trim();

      // En el entorno de demostración: si el usuario no tipea datos, se asumen los de prueba
      if (!num && !name && !exp && !cvv) {
        num = '4111111111111111';
        name = (getSession() ? getSession().nombre : 'ESTUDIANTE').toUpperCase();
        exp = '12/28';
        cvv = '123';
      } else if (num.length < 15 || !name || exp.length < 5 || cvv.length < 3) {
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
      'Solicitado': 'info',
      'Pendiente de pago': 'warn',
      'En revisión': 'info',
      'Observado': 'warn',
      'Aprobado': 'ok',
      'Rechazado': 'err',
      'Emitido': 'purple',
      'Cancelar': 'err',
      'Cancelado': 'err'
    };
    const iconMap = {
      'Observado': '⚠️ ',
      'Emitido': '✓ ',
      'Rechazado': '✕ ',
      'Cancelar': '✕ ',
      'Cancelado': '✕ '
    };
    return `<span class="pill ${map[estado] || 'gray'}">${iconMap[estado] || ''}${estado}</span>`;
  }

  // =========================================================================
  // SISTEMA ESTANDARIZADO DE INPUTS, SELECTS Y DATEPICKERS (Wiener Design System)
  // =========================================================================

  const MESES_NOMBRES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function closeAllDropdowns() {
    document.querySelectorAll('.custom-select-container.is-open, .custom-select-wrap.is-open').forEach(c => {
      c.classList.remove('is-open');
      const trig = c.querySelector('.custom-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });

    document.querySelectorAll('.custom-date-container.is-open').forEach(c => {
      c.classList.remove('is-open');
    });

    document.querySelectorAll('.custom-search-container.is-open').forEach(c => {
      c.classList.remove('is-open');
    });
  }

  // Helper para formatear fechas a DD/MM/AAAA
  function formatDDMMYYYY(val) {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('/')) return val; // Ya en formato DD/MM/AAAA
    if (typeof val === 'string' && val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3) return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  // Helper para convertir DD/MM/AAAA a YYYY-MM-DD (ISO)
  function formatYYYYMMDD(val) {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('-') && val.split('-')[0].length === 4) return val;
    if (typeof val === 'string' && val.includes('/')) {
      const p = val.split('/');
      if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
    }
    return '';
  }

  // -------- 1. DATEPICKER PERSONALIZADO FLOTANTE --------
  function initDatePicker(containerOrId, inputOrId, defaultDateStr, onSelect) {
    const container = typeof containerOrId === 'string' ? document.getElementById(containerOrId) : containerOrId;
    const input = typeof inputOrId === 'string' ? document.getElementById(inputOrId) : inputOrId;
    if (!container || !input) return;

    let popup = container.querySelector('.custom-calendar-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'custom-calendar-popup';
      container.appendChild(popup);
    }

    let initialStr = defaultDateStr || input.value || input.getAttribute('data-iso-value') || '';
    let curDay = 1, curMonth = 0, curYear = 2026;

    if (initialStr.includes('/')) {
      const p = initialStr.split('/');
      curDay = parseInt(p[0], 10) || 1;
      curMonth = (parseInt(p[1], 10) || 1) - 1;
      curYear = parseInt(p[2], 10) || 2026;
    } else if (initialStr.includes('-')) {
      const p = initialStr.split('-');
      curYear = parseInt(p[0], 10) || 2026;
      curMonth = (parseInt(p[1], 10) || 1) - 1;
      curDay = parseInt(p[2], 10) || 1;
    } else {
      const now = new Date();
      curDay = now.getDate();
      curMonth = now.getMonth();
      curYear = now.getFullYear();
    }

    input.value = `${String(curDay).padStart(2, '0')}/${String(curMonth + 1).padStart(2, '0')}/${curYear}`;
    const isoVal = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(curDay).padStart(2, '0')}`;
    input.setAttribute('data-iso-value', isoVal);

    let viewMonth = curMonth;
    let viewYear = curYear;

    function renderCalendar() {
      popup.innerHTML = `
        <div class="cal-header">
          <span class="cal-month-title">${MESES_NOMBRES[viewMonth]} ${viewYear}</span>
          <div class="cal-nav-group">
            <button type="button" class="cal-nav-btn prev-month" aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="cal-nav-btn next-month" aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
        <div class="cal-weekdays-grid">
          <span class="cal-weekday">DO</span>
          <span class="cal-weekday">LU</span>
          <span class="cal-weekday">MA</span>
          <span class="cal-weekday">MI</span>
          <span class="cal-weekday">JU</span>
          <span class="cal-weekday">VI</span>
          <span class="cal-weekday">SÁ</span>
        </div>
        <div class="cal-days-grid" id="calDaysGrid_${input.id || Math.random().toString(36).substr(2, 5)}"></div>
      `;

      const grid = popup.querySelector('.cal-days-grid');
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

      // Días previos
      for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell other-month';
        cell.textContent = d;
        grid.appendChild(cell);
      }

      // Días del mes
      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        cell.textContent = day;

        if (day === curDay && viewMonth === curMonth && viewYear === curYear) {
          cell.classList.add('selected');
        }

        if (day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
          cell.classList.add('today');
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          curDay = day;
          curMonth = viewMonth;
          curYear = viewYear;

          const dd = String(curDay).padStart(2, '0');
          const mm = String(curMonth + 1).padStart(2, '0');
          const displayStr = `${dd}/${mm}/${curYear}`;
          const newIso = `${curYear}-${mm}-${dd}`;

          input.value = displayStr;
          input.setAttribute('data-iso-value', newIso);
          container.classList.remove('is-open');

          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
          if (typeof onSelect === 'function') onSelect(newIso, displayStr);
        });

        grid.appendChild(cell);
      }

      popup.querySelector('.prev-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });

      popup.querySelector('.next-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });
    }

    renderCalendar();

    // Toggle de apertura con posicionamiento inteligente y detección de pantalla
    const toggleTarget = container.querySelector('.custom-date-trigger') || input;
    toggleTarget.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');
      closeAllDropdowns();

      if (!isOpen) {
        const triggerRect = toggleTarget.getBoundingClientRect();
        const popupHeight = 310;
        const popupWidth = 285;
        const viewportSpaceBelow = window.innerHeight - triggerRect.bottom;
        const viewportSpaceAbove = triggerRect.top;

        // Solo abrir hacia arriba si abajo queda menos de 180px Y arriba hay claramente más espacio que abajo.
        // En todos los demás casos, abrir siempre hacia abajo (espacioso y natural).
        const shouldFlipUp = (viewportSpaceBelow < 180 && viewportSpaceAbove > viewportSpaceBelow);

        popup.classList.remove('popup-above', 'popup-below', 'align-right');
        popup.classList.add(shouldFlipUp ? 'popup-above' : 'popup-below');

        // Posicionamiento flotante fijo para evitar que tarjetas o modales con overflow lo enmascaren
        popup.style.position = 'fixed';
        popup.style.zIndex = '999999';

        if (shouldFlipUp) {
          popup.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`;
          popup.style.top = 'auto';
        } else {
          popup.style.top = `${triggerRect.bottom + 4}px`;
          popup.style.bottom = 'auto';
        }

        let leftPos = triggerRect.left;
        if (leftPos + popupWidth > window.innerWidth - 12) {
          leftPos = triggerRect.right - popupWidth;
        }
        if (leftPos < 12) leftPos = 12;
        popup.style.left = `${leftPos}px`;
        popup.style.width = `${popupWidth}px`;

        container.classList.add('is-open');
      }
    });

    return {
      getISO: () => input.getAttribute('data-iso-value') || formatYYYYMMDD(input.value),
      getDisplay: () => input.value,
      setDate: (isoOrDisplay) => {
        initDatePicker(container, input, isoOrDisplay, onSelect);
      }
    };
  }

  // Wrapper automático para inputs de fecha existentes
  function enhanceDateInput(inputEl, onSelect) {
    if (!inputEl) return;
    if (inputEl.getAttribute('data-enhanced-date') === 'true') {
      const container = inputEl.closest('.custom-date-container');
      if (container) {
        const displayInput = container.querySelector('.date-display-input');
        if (displayInput && inputEl.value) {
          displayInput.value = formatDDMMYYYY(inputEl.value);
        }
      }
      return;
    }

    const originalParent = inputEl.parentNode;
    if (!originalParent) return;
    const initialVal = inputEl.value;

    const container = document.createElement('div');
    container.className = 'custom-date-container';

    const trigger = document.createElement('div');
    trigger.className = 'custom-date-trigger';

    // Input visual
    const displayInput = document.createElement('input');
    displayInput.type = 'text';
    displayInput.className = 'date-display-input';
    displayInput.readOnly = true;
    displayInput.id = inputEl.id ? inputEl.id + '_display' : 'date_' + Math.random().toString(36).substr(2, 5);

    // Icono SVG de calendario con margen derecho estricto de 12px
    const iconSpan = document.createElement('span');
    iconSpan.className = 'date-calendar-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    `;

    trigger.appendChild(displayInput);
    trigger.appendChild(iconSpan);
    container.appendChild(trigger);

    // Ocultar input original de forma irreversible para que no se duplique
    inputEl.style.setProperty('display', 'none', 'important');
    inputEl.setAttribute('data-enhanced-date', 'true');
    inputEl.setAttribute('tabindex', '-1');
    inputEl.setAttribute('aria-hidden', 'true');

    originalParent.insertBefore(container, inputEl);
    container.appendChild(inputEl);

    initDatePicker(container, displayInput, initialVal, (newIso, displayStr) => {
      inputEl.value = newIso;
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      if (typeof onSelect === 'function') onSelect(newIso, displayStr);
    });
  }

  // -------- 2. CUSTOM SELECT CON ROTACIÓN DE FLECHA SVG --------
  function enhanceSelect(selectEl, onSelectCallback) {
    if (!selectEl) return null;

    // Si ya fue mejorado previamente, solo sincronizamos sus opciones si cambiaron
    if (selectEl.getAttribute('data-enhanced-select') === 'true' && selectEl._wienerCustomSelect) {
      selectEl._wienerCustomSelect.update();
      return selectEl._wienerCustomSelect;
    }

    // Contenedor principal: reutilizar o crear nuevo
    let parent = selectEl.closest('.custom-select-container') || selectEl.closest('.select-wrap');
    if (!parent) {
      parent = document.createElement('div');
      parent.className = 'custom-select-container';
      if (selectEl.parentNode) {
        selectEl.parentNode.insertBefore(parent, selectEl);
        parent.appendChild(selectEl);
      }
    } else {
      parent.classList.add('custom-select-container');
      parent.classList.remove('select-wrap');
    }

    // Si ya tiene un trigger previo dentro del parent, removerlo para reconstruir limpio
    const oldTrigger = parent.querySelector('.custom-select-trigger');
    const oldMenu = parent.querySelector('.custom-dropdown-menu, .custom-select-menu');
    if (oldTrigger) oldTrigger.remove();
    if (oldMenu) oldMenu.remove();

    // Ocultar el select nativo de forma total y accesible
    selectEl.style.setProperty('display', 'none', 'important');
    selectEl.setAttribute('data-enhanced-select', 'true');
    selectEl.setAttribute('tabindex', '-1');
    selectEl.setAttribute('aria-hidden', 'true');

    // Construir trigger con flecha SVG
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    if (selectEl.disabled) trigger.disabled = true;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'custom-select-label';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'custom-select-arrow');
    arrowSvg.setAttribute('width', '16');
    arrowSvg.setAttribute('height', '16');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2');
    arrowSvg.setAttribute('stroke-linecap', 'round');
    arrowSvg.setAttribute('stroke-linejoin', 'round');
    arrowSvg.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';

    trigger.appendChild(labelSpan);
    trigger.appendChild(arrowSvg);

    // Menú desplegable
    const menu = document.createElement('div');
    menu.className = 'custom-dropdown-menu';
    menu.setAttribute('role', 'listbox');

    function syncOptions() {
      menu.innerHTML = '';
      const selectedIndex = selectEl.selectedIndex >= 0 ? selectEl.selectedIndex : 0;
      const curOpt = selectEl.options[selectedIndex];
      labelSpan.textContent = curOpt ? curOpt.text : '--- Seleccione ---';
      parent.setAttribute('data-current-value', curOpt ? curOpt.value : '');

      Array.from(selectEl.options).forEach((opt, idx) => {
        const optDiv = document.createElement('div');
        const isSelected = (idx === selectedIndex);
        optDiv.className = 'custom-option' + (isSelected ? ' selected' : '');
        optDiv.setAttribute('data-value', opt.value);

        const spanText = document.createElement('span');
        spanText.textContent = opt.text;
        optDiv.appendChild(spanText);

        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('class', 'option-check');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('width', '16');
        checkSvg.setAttribute('height', '16');
        checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        optDiv.appendChild(checkSvg);

        optDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEl.selectedIndex = idx;
          selectEl.value = opt.value;
          labelSpan.textContent = opt.text;
          parent.setAttribute('data-current-value', opt.value);

          menu.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
          optDiv.classList.add('selected');

          // Cerrar inmediatamente para rotar la flecha a 0°
          parent.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');

          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
          selectEl.dispatchEvent(new Event('input', { bubbles: true }));
          if (typeof onSelectCallback === 'function') onSelectCallback(opt.value, opt.text);
        });

        menu.appendChild(optDiv);
      });
    }

    syncOptions();

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectEl.disabled) return;
      const isOpen = parent.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        // Detección de pantalla en tiempo real
        const triggerRect = trigger.getBoundingClientRect();
        const viewportSpaceBelow = window.innerHeight - triggerRect.bottom;
        const viewportSpaceAbove = triggerRect.top;

        // Solo abrir hacia arriba si abajo queda muy poco espacio (< 160px) Y arriba hay claramente más espacio.
        // En todos los demás casos, desplegar siempre hacia abajo.
        const shouldFlipUp = (viewportSpaceBelow < 160 && viewportSpaceAbove > viewportSpaceBelow);

        menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');
        menu.classList.add(shouldFlipUp ? 'dropdown-above' : 'dropdown-below');

        // Posicionamiento flotante fijo para evitar enmascaramiento por overflow:hidden o overflow-y:auto
        menu.style.position = 'fixed';
        menu.style.zIndex = '999999';

        // Ancho adaptado al trigger, mínimo 160px
        const menuWidth = Math.max(triggerRect.width, 160);
        let leftPos = triggerRect.left;
        if (leftPos + menuWidth > window.innerWidth - 12) {
          leftPos = triggerRect.right - menuWidth;
        }
        if (leftPos < 12) leftPos = 12;
        menu.style.left = `${leftPos}px`;
        menu.style.width = `${menuWidth}px`;

        // Control de altura máxima inteligente: se adapta al espacio visible en pantalla sin provocar scroll innecesario
        if (shouldFlipUp) {
          menu.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`;
          menu.style.top = 'auto';
          const maxAvailH = Math.min(260, viewportSpaceAbove - 16);
          menu.style.maxHeight = `${Math.max(100, maxAvailH)}px`;
        } else {
          menu.style.top = `${triggerRect.bottom + 4}px`;
          menu.style.bottom = 'auto';
          const maxAvailH = Math.min(260, viewportSpaceBelow - 16);
          menu.style.maxHeight = `${Math.max(100, maxAvailH)}px`;
        }
        menu.style.overflowY = 'auto';

        parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    parent.appendChild(trigger);
    parent.appendChild(menu);

    const api = {
      update: syncOptions,
      getValue: () => selectEl.value,
      setValue: (val) => {
        selectEl.value = val;
        syncOptions();
      }
    };
    selectEl._wienerCustomSelect = api;
    return api;
  }

  // Inicializador global para buscar y mejorar todos los selects del contenedor
  function initCustomSelects(root) {
    const container = root || document;
    // 1. Mejorar selects nativos en el contenedor (vistas, modales, etc.)
    const selects = container.querySelectorAll('select:not([data-native="true"]):not(.swal2-select)');
    selects.forEach(sel => enhanceSelect(sel));

    // 2. Gestionar contenedores que ya tengan la estructura HTML fija de Referencia-inputs
    const staticContainers = container.querySelectorAll('.custom-select-container:not(:has(select))');
    staticContainers.forEach(c => {
      const trigger = c.querySelector('.custom-select-trigger');
      const menu = c.querySelector('.custom-dropdown-menu');
      const label = c.querySelector('.custom-select-label');
      const options = c.querySelectorAll('.custom-option');

      if (!trigger || !menu) return;

      trigger.onclick = (e) => {
        e.stopPropagation();
        const isOpen = c.classList.contains('is-open');
        closeAllDropdowns();

        if (!isOpen) {
          const triggerRect = trigger.getBoundingClientRect();
          const viewportSpaceBelow = window.innerHeight - triggerRect.bottom;
          const viewportSpaceAbove = triggerRect.top;

          const shouldFlipUp = (viewportSpaceBelow < 160 && viewportSpaceAbove > viewportSpaceBelow);

          menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');
          menu.classList.add(shouldFlipUp ? 'dropdown-above' : 'dropdown-below');

          menu.style.position = 'fixed';
          menu.style.zIndex = '999999';

          const menuWidth = Math.max(triggerRect.width, 160);
          let leftPos = triggerRect.left;
          if (leftPos + menuWidth > window.innerWidth - 12) {
            leftPos = triggerRect.right - menuWidth;
          }
          if (leftPos < 12) leftPos = 12;
          menu.style.left = `${leftPos}px`;
          menu.style.width = `${menuWidth}px`;

          if (shouldFlipUp) {
            menu.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`;
            menu.style.top = 'auto';
            const maxAvailH = Math.min(260, viewportSpaceAbove - 16);
            menu.style.maxHeight = `${Math.max(100, maxAvailH)}px`;
          } else {
            menu.style.top = `${triggerRect.bottom + 4}px`;
            menu.style.bottom = 'auto';
            const maxAvailH = Math.min(260, viewportSpaceBelow - 16);
            menu.style.maxHeight = `${Math.max(100, maxAvailH)}px`;
          }
          menu.style.overflowY = 'auto';

          c.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      };

      options.forEach(opt => {
        opt.onclick = (e) => {
          e.stopPropagation();
          options.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');

          const text = opt.querySelector('span') ? opt.querySelector('span').textContent.trim() : opt.textContent.trim();
          const val = opt.getAttribute('data-value') || text;

          if (label) label.textContent = text;
          c.setAttribute('data-current-value', val);

          c.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');

          c.dispatchEvent(new CustomEvent('custom-change', { detail: { value: val, text: text }, bubbles: true }));
        };
      });
    });
  }

  // Inicializador global para buscar y mejorar inputs de fecha
  function initDatePickers(root) {
    const container = root || document;
    // 1. Contenedores con estructura fija .custom-date-container
    const dateContainers = container.querySelectorAll('.custom-date-container');
    dateContainers.forEach(c => {
      const input = c.querySelector('.date-display-input, input:not([type="date"])');
      if (input && !c.querySelector('.custom-calendar-popup')) {
        initDatePicker(c, input, input.value);
      }
    });

    // 2. Inputs de tipo date que no estén mejorados todavía
    const dateInputs = container.querySelectorAll('input[type="date"]:not([data-enhanced-date="true"])');
    dateInputs.forEach(inp => enhanceDateInput(inp));
  }

  // Listeners globales en documento para cerrar menús al hacer click afuera, presionar Escape o redimensionar
  if (typeof document !== 'undefined') {
    document.addEventListener('click', () => {
      closeAllDropdowns();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    window.addEventListener('scroll', (e) => {
      // Si el usuario hace scroll dentro del menú desplegable o calendario mismo para ver más opciones, NO cerrar
      if (e.target && (
        (e.target.classList && (
          e.target.classList.contains('custom-dropdown-menu') ||
          e.target.classList.contains('custom-calendar-popup') ||
          e.target.classList.contains('cal-days-grid')
        )) ||
        (e.target.closest && (
          e.target.closest('.custom-dropdown-menu') ||
          e.target.closest('.custom-calendar-popup')
        ))
      )) {
        return;
      }
      closeAllDropdowns();
    }, true);

    window.addEventListener('resize', () => {
      closeAllDropdowns();
    });
  }

  window.APP = {
    BASE, getSession, setSession, logout, renderShell, toggleNav, icon, ICONS,
    toast, sendMail, openModal, closeModal,
    initCustomSelects, enhanceSelect,
    initDatePickers, enhanceDateInput, initDatePicker,
    closeAllDropdowns, formatDDMMYYYY, formatYYYYMMDD,
    niubizCheckout, _nbMask, _nbExp,
    money, initials, todayISO, nowStamp, calcSLA, pillFor
  };
})();

