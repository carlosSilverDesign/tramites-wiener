// admin/inicio.js - Centro de Mando e Inicio Institucional Wiener Admin

const ctx = APP.renderShell('inicio');

// ==========================================================================
// CATÁLOGO DE ICONOS SVG INSTITUCIONALES CATEGORIZADOS POR COMPONENTE Y TAMAÑO
// ==========================================================================
// Organización semántica de iconos para garantizar tamaños independientes:
// - KPI: 26x26px (Tarjetas de métricas principales en inicio)
// - Radar / Pipeline: 21x21px (Flujos macro del ciclo de vida institucional)
// - Modales: 20x20px (Botones de cerrar y encabezados)
// - Acciones Rápidas: 20x20px (Herramientas y accesos directos)
// - Títulos de Sección: 20x20px (Cabeceras de bloques principales)
// - Tags / SLA: 13x13px (Píldoras, semáforos de plazo y estados compactos)
// - Metadatos / Header: 14x14px (Datos de usuario y estado del sistema)
// - Vacíos / Ilustración: 38x38px (Empty state en tablas de tareas)

const SVG_ICONS = {
  // 1. Tarjetas de Métricas Operativas (KPIs) - Tamaño grande (26x26)
  kpi: {
    inbox: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    clock: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    alert: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    layers: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
  },

  // 2. Radar General de Flujos de Trámites (Pipeline Institucional) - Tamaño mediano-grande (21x21)
  radar: {
    solicitud: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    inbox: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    pago: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    clock: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    revision: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    layers: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    resolucion: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    check: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    emision: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
    fileText: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>'
  },

  // 3. Píldoras de SLA, Estados y Badges Compactos - Tamaño compacto (13x13)
  tags: {
    clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    alert: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
  },

  // 4. Ventanas Modales y Botón Cerrar - Tamaño modal accesible (20x20)
  modal: {
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    fileText: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
    settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
  },

  // 5. Herramientas, Accesos Rápidos y Botones de Acción
  actions: {
    plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
  },

  // 6. Metadatos, Identidad y Cabecera de Inicio - Tamaño meta (14x14)
  meta: {
    user: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    building: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="2"></line><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="16" y1="6" x2="16.01" y2="6"></line><line x1="16" y1="10" x2="16.01" y2="10"></line><line x1="16" y1="14" x2="16.01" y2="14"></line><line x1="16" y1="18" x2="16.01" y2="18"></line></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
  },

  // 7. Ilustración para Estados Vacíos - Tamaño ilustrativo (38x38)
  empty: {
    inbox: '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>'
  },

  // 8. Títulos de Bloque y Secciones - Tamaño título (20x20)
  section: {
    layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    fileText: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>'
  },

  // Propiedades directas heredadas para 100% retrocompatibilidad
  home: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  building: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="2"></line><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="16" y1="6" x2="16.01" y2="6"></line><line x1="16" y1="10" x2="16.01" y2="10"></line><line x1="16" y1="14" x2="16.01" y2="14"></line><line x1="16" y1="18" x2="16.01" y2="18"></line></svg>',
  briefcase: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  user: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  inbox: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  fileText: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};

// --------------------------------------------------------------------------
// 0. GESTIÓN DE ROLES PARA WORKFLOW DE CERTIFICACIONES DE CONOCIMIENTO
// --------------------------------------------------------------------------
function getActorWorkflowCertificaciones(user) {
  if (!user) return null;
  const email = (user.email || '').toLowerCase();
  const nombre = (user.nombre || '').toLowerCase();
  const cargo = (user.cargo || '').toLowerCase();
  const area = (user.area || '').toLowerCase();
  const rol = (user.rol || '').toLowerCase();

  if (email.includes('salcedo') || nombre.includes('salcedo') || cargo.includes('decano') || user.subrol === 'decano') {
    return 'decano';
  }
  if (email.includes('faustor') || nombre.includes('faustor') || cargo.includes('director') || rol === 'director') {
    return 'director';
  }
  if (email.includes('mendoza') || nombre.includes('carlos mendoza') || (rol === 'administrativo' && area.includes('registro'))) {
    return 'administrativo';
  }
  if (rol === 'administrativo') {
    return 'administrativo';
  }
  return null;
}

// --------------------------------------------------------------------------
// 1. BANNER INSTITUCIONAL DEL PRIMER SCROLL (BANNER ESTÁNDAR RESTAURADO)
// --------------------------------------------------------------------------
function renderBanner() {
  const container = document.getElementById('home-banner-slot');
  if (!container) return;

  container.innerHTML = `
    <div class="home-banner-wrapper" style="background-image: url('../img/Banner-Tramites.png'); background-size: cover; background-position: center right; background-repeat: no-repeat;">
      <div class="home-banner-decor"></div>
      <div class="home-banner-content">
        <div class="banner-left">
          <h2 class="banner-title">Cierre de Ciclo Académico 2026-II: Expedientes y Certificaciones</h2>
          <p class="banner-desc">Prioriza la revisión curricular, emisión de resoluciones y validación de actas oficiales para las solicitudes asignadas a tu departamento.</p>
          <div class="banner-actions">
            <button type="button" class="btn-banner-primary" onclick="irATareasArea()">
              <span>Atender Trámites de Mi Área</span> ${SVG_ICONS.arrowRight}
            </button>
            <a href="catalogo.html" class="btn-banner-secondary">
              <span>Catálogo de Trámites</span>
            </a>
          </div>
        </div>
        <div class="banner-custom-image-box">
          <!-- SVG original ocultado (no eliminado) -->
          <svg class="banner-custom-svg" style="display: none;" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="20" y="20" width="140" height="110" rx="10" fill="#FFFFFF" fill-opacity="0.12" stroke="#07C8CC" stroke-width="2"/>
            <rect x="36" y="38" width="70" height="8" rx="4" fill="#07C8CC"/>
            <rect x="36" y="54" width="108" height="6" rx="3" fill="#FFFFFF" fill-opacity="0.7"/>
            <rect x="36" y="68" width="90" height="6" rx="3" fill="#FFFFFF" fill-opacity="0.5"/>
            <rect x="36" y="82" width="98" height="6" rx="3" fill="#FFFFFF" fill-opacity="0.5"/>
            <circle cx="160" cy="95" r="34" fill="#0F848F" stroke="#07C8CC" stroke-width="3"/>
            <path d="M148 95L156 103L174 85" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="48" cy="106" r="6" fill="#07C8CC"/>
            <circle cx="68" cy="106" r="6" fill="#FFFFFF" fill-opacity="0.7"/>
            <circle cx="88" cy="106" r="6" fill="#FFFFFF" fill-opacity="0.4"/>
          </svg>
          <!-- Nueva imagen representativa en prueba -->
          <img src="../img/chica-tramites.png" alt="Trámites Wiener" class="banner-custom-img">
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 1.1 CINTILLO INSTITUCIONAL DE WORKFLOW DE CERTIFICACIONES (FONDO BLANCO / TRAZO GRIS)
// --------------------------------------------------------------------------
function renderCintilloWorkflow() {
  const container = document.getElementById('home-cintillo-slot');
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

  // SVG Icons vectoriales estrictos para el stepper y estados
  const svgCheck = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const svgActive = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  const svgWait = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;
  const svgArrow = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

  container.innerHTML = `
    <div class="home-cintillo-card ${esMiTurno ? 'is-urgent' : (allOk ? 'is-complete' : '')}">
      <div class="home-cintillo-left">
        <!-- Indicador animado en loop (círculo radar pulsante en vivo) -->
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
            <button type="button" class="btn btn-primary btn-cintillo-cta" onclick="abrirModalRefrendoInicio('${actor}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Aprobar y Firmar</span>
            </button>
          ` : (allOk ? `
            <button type="button" class="btn btn-outline btn-cintillo-cta" onclick="abrirModalRefrendoInicio('${actor}')">
              <span>Ver Firmas</span>
            </button>
          ` : `
            <button type="button" class="btn btn-outline btn-cintillo-cta" onclick="abrirModalRefrendoInicio('${actor}')">
              <span>Ver Estado</span>
            </button>
          `)}
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// MODAL EJECUTIVO DE REFRENDO EN 1 CLIC (SOLUCIÓN HÍBRIDA)
// --------------------------------------------------------------------------
function abrirModalRefrendoInicio(rolParam) {
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
        ${SVG_ICONS.modal.close}
      </button>
    </div>

    <div class="modal-body">
      <!-- Barra de simulación interactiva para demo de los 3 usuarios -->
      <div class="modal-refrendo-sim-bar">
        <span style="font-size:11.5px;color:#475569;font-weight:600;">Simular ingreso / firma como:</span>
        <div class="modal-refrendo-sim-btns">
          <button type="button" class="btn btn-sm ${rol === 'administrativo' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoInicio('administrativo')" style="padding:3px 10px;font-size:11.5px;">Administrativo</button>
          <button type="button" class="btn btn-sm ${rol === 'director' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoInicio('director')" style="padding:3px 10px;font-size:11.5px;">Director</button>
          <button type="button" class="btn btn-sm ${rol === 'decano' ? 'btn-primary' : 'btn-outline'}" onclick="abrirModalRefrendoInicio('decano')" style="padding:3px 10px;font-size:11.5px;">Decano</button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="reiniciarWorkflowDesdeInicio()" title="Reiniciar demostración" style="padding:3px 8px;font-size:11px;color:#64748B;">Reiniciar</button>
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
        <button class="btn btn-primary" onclick="ejecutarFirmaDesdeInicio('${rol}')" style="display:inline-flex;align-items:center;gap:6px;font-weight:700;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Aprobar y Refrendar Firma Digital (${rol.toUpperCase()})</span>
        </button>
      ` : (yaFirme ? `
        <span class="pill ok" style="padding:6px 14px;font-size:12px;">Tu firma ya fue registrada con éxito</span>
      ` : `
        <button class="btn btn-outline" disabled style="opacity:0.6;cursor:not-allowed;">Esperando refrendo del paso previo</button>
      `)}
    </div>
  `, { wide: true });
}

function ejecutarFirmaDesdeInicio(rol) {
  const res = DB.aprobarPasoWorkflow(rol);
  if (!res.ok) {
    APP.toast({ icon: 'warn', title: 'Orden Requerido', body: res.error });
    return;
  }
  APP.closeModal();
  APP.toast({
    icon: 'ok',
    title: 'Firma Registrada Exitosamente',
    body: `Tu refrendo digital oficial como ${rol.toUpperCase()} fue acreditado en el lote de emisión masiva 2026-II.`
  });
  render();
}

function reiniciarWorkflowDesdeInicio() {
  DB.reiniciarWorkflowFirmas();
  APP.toast({
    icon: 'info',
    title: 'Proceso de Firmas Reiniciado',
    body: 'El flujo de firmas ha vuelto al Paso 1 (Administrativo).'
  });
  abrirModalRefrendoInicio('administrativo');
}

// --------------------------------------------------------------------------
// 2. ESTADO DE BANDEJA DE TAREAS Y FILTRADO POR ÁREA
// --------------------------------------------------------------------------
let TAB_TAREAS = 'mis-tareas'; // 'mis-tareas' | 'atendidas' | 'urgentes' | 'todas'

function setTabTareas(tab) {
  TAB_TAREAS = tab;
  // Actualización dinámica de clases .active en los botones de pestañas
  const tabBtns = document.querySelectorAll('.home-tab-btn');
  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderTareasTable();
}

function renderTareasTable() {
  const session = APP.getSession() || {};
  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;
  const userArea = (user.area || 'Registros Académicos').trim().toLowerCase();

  const allSolicitudes = DB.solicitudes();

  // Mapeo exhaustivo de cada solicitud con respecto a las etapas del área
  const tasksMapped = allSolicitudes.map(s => {
    const proceso = s.proceso || [];
    const myStep = proceso.find(p => (p.area || '').trim().toLowerCase() === userArea);
    const activeStep = proceso.find(p => p.estado !== 'Atendido' && p.estado !== 'Procede');
    const isAttendedByMe = myStep && (myStep.estado === 'Atendido' || myStep.estado === 'Procede');
    const isPendingForMe = myStep && (myStep.estado !== 'Atendido' && myStep.estado !== 'Procede');
    const isMyStepActive = isPendingForMe && activeStep && (activeStep.area || '').trim().toLowerCase() === userArea;

    const currentStep = activeStep || myStep || proceso[0] || {
      orden: 1,
      area: userArea,
      plazoHoras: 48,
      diasRetraso: 0,
      descripcion: 'Revisión y validación institucional'
    };

    const isOverdue = !isAttendedByMe && s.estado !== 'Aprobado' && s.estado !== 'Emitido' && s.estado !== 'Cancelar' && s.estado !== 'Rechazado' && (
      (currentStep.diasRetraso > 0) ||
      (s.fecha && ((new Date() - new Date(s.fecha + 'T00:00:00')) / (1000 * 3600 * 24) > 3))
    );

    return {
      solicitud: s,
      step: currentStep,
      myStep,
      isAttendedByMe,
      isPendingForMe,
      isMyStepActive,
      activeStep,
      isOverdue
    };
  });

  let displayItems = [];
  if (TAB_TAREAS === 'mis-tareas') {
    // Tareas pendientes activas del área del usuario
    displayItems = tasksMapped.filter(item => item.isMyStepActive && item.solicitud.activo && item.solicitud.estado !== 'Cancelar' && item.solicitud.estado !== 'Rechazado' && item.solicitud.estado !== 'Emitido');
  } else if (TAB_TAREAS === 'atendidas') {
    // Solicitudes donde el área del usuario ya dictaminó y aprobó su etapa
    displayItems = tasksMapped.filter(item => item.isAttendedByMe);
  } else if (TAB_TAREAS === 'urgentes') {
    // Tareas con plazos críticos aún pendientes
    displayItems = tasksMapped.filter(item => item.isOverdue && item.solicitud.activo && item.solicitud.estado !== 'Cancelar' && item.solicitud.estado !== 'Rechazado' && item.solicitud.estado !== 'Emitido');
  } else {
    // Campus global
    displayItems = tasksMapped.filter(item => item.solicitud.activo);
  }

  const tableBody = document.getElementById('home-tasks-tbody');
  if (!tableBody) return;

  if (displayItems.length === 0) {
    let emptyMsg = 'Todos los trámites asignados a este criterio se encuentran al día.';
    if (TAB_TAREAS === 'atendidas') emptyMsg = 'Aún no se registran trámites aprobados y derivados en este turno por tu área.';
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="home-empty-tasks">
          <div class="home-empty-icon">${SVG_ICONS.empty.inbox}</div>
          <b>No hay registros en esta bandeja</b>
          <div>${emptyMsg}</div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = displayItems.map(item => {
    const s = item.solicitud;
    const step = item.step;
    const isAttended = item.isAttendedByMe;

    let estadoPill = '';
    if (s.estado === 'Aprobado') estadoPill = `<span class="pill ok no-dot">Aprobado</span>`;
    else if (s.estado === 'Emitido') estadoPill = `<span class="pill purple no-dot">Emitido</span>`;
    else if (s.estado === 'Observado') estadoPill = `<span class="pill warn no-dot">Observado</span>`;
    else if (s.estado === 'En revisión') estadoPill = `<span class="pill info no-dot">En revisión</span>`;
    else if (s.estado === 'Solicitado') estadoPill = `<span class="pill info no-dot">Solicitado</span>`;
    else if (s.estado === 'Cancelar' || s.estado === 'Rechazado') estadoPill = `<span class="pill err no-dot">${s.estado}</span>`;
    else estadoPill = `<span class="pill gray no-dot">${s.estado}</span>`;

    let slaPill = '';
    if (isAttended) {
      slaPill = `
        <span class="sla-pill green">${SVG_ICONS.tags.check} Atendido y derivado</span>
        <div class="task-step-sub-date">${item.myStep && item.myStep.fechaAtencion ? item.myStep.fechaAtencion : 'Conforme'}</div>
      `;
    } else if (s.estado === 'Aprobado' || s.estado === 'Emitido') {
      slaPill = `<span class="sla-pill green">${SVG_ICONS.tags.check} Concluido</span>`;
    } else if (step.diasRetraso > 0) {
      slaPill = `<span class="sla-pill red">${SVG_ICONS.tags.alert} ${step.diasRetraso}d retraso</span>`;
    } else if (item.isOverdue) {
      slaPill = `<span class="sla-pill amber">${SVG_ICONS.tags.clock} Por vencer</span>`;
    } else {
      slaPill = `<span class="sla-pill green">${SVG_ICONS.tags.check} A tiempo (${step.plazoHoras || 48}h)</span>`;
    }

    let actionBtn = '';
    if (!isAttended && item.isMyStepActive) {
      actionBtn = `
        <button type="button" class="btn btn-primary btn-task-attend" onclick="abrirModalAtencionTarea('${s.id}')">
          <span>Atender</span> ${SVG_ICONS.arrowRight}
        </button>
      `;
    } else {
      actionBtn = `
        <button type="button" class="btn btn-outline btn-task-attend" onclick="abrirModalAtencionTarea('${s.id}')">
          <span>Ver Detalle</span> ${SVG_ICONS.arrowRight}
        </button>
      `;
    }

    const initials = APP.initials(s.alumnoNombre || 'Estudiante');

    let etapaMarkup = '';
    if (isAttended) {
      etapaMarkup = `
        <span class="task-step-tag ok">${SVG_ICONS.tags.check} Paso #${item.myStep.orden} · ${item.myStep.area}</span>
        <div class="task-step-desc">${item.activeStep ? ('Derivado a: <b>' + item.activeStep.area + '</b>') : '<b>Trámite concluido</b>'}</div>
      `;
    } else {
      etapaMarkup = `
        <span class="task-step-tag">Paso #${step.orden || 1} · ${step.area}</span>
        <div class="task-step-desc">${step.descripcion || 'Revisión y validación de expediente'}</div>
      `;
    }

    return `
      <tr>
        <td>
          <span class="vt-ticket-badge">${s.ticket || s.id}</span>
        </td>
        <td>
          <div class="task-student-cell">
            <div class="task-student-avatar">${initials}</div>
            <div>
              <div class="task-student-name">${s.alumnoNombre}</div>
              <div class="task-student-sub">${s.alumnoCodigo} · ${s.carrera || 'Pregrado'}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="task-tramite-title">${s.tramiteNombre}</div>
          <div class="task-tramite-sub">Costo: <b>${APP.money(s.costo)}</b> · Registrado: ${s.fecha}</div>
        </td>
        <td>
          ${estadoPill}
        </td>
        <td>
          ${etapaMarkup}
        </td>
        <td>
          ${slaPill}
        </td>
        <td class="task-actions-cell">
          ${actionBtn}
        </td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 3. MODAL DE RESOLUCIÓN INMEDIATA DE TAREA / ATENCIÓN DE TRÁMITE
// --------------------------------------------------------------------------
function abrirModalAtencionTarea(solId) {
  const session = APP.getSession() || {};
  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;
  const userArea = (user.area || 'Registros Académicos').trim();

  const allSolicitudes = DB.solicitudes();
  const s = allSolicitudes.find(x => x.id === solId || x.ticket === solId);
  if (!s) {
    APP.toast({ icon: 'err', title: 'Error', body: 'No se encontró la solicitud seleccionada.' });
    return;
  }

  const proceso = s.proceso || [];
  const myStep = proceso.find(p => (p.area || '').trim().toLowerCase() === userArea.toLowerCase());
  const isMyStepDone = myStep && (myStep.estado === 'Atendido' || myStep.estado === 'Procede');

  // Si el área ya atendió, mostrar la etapa que resolvió; si no, la etapa pendiente
  let currentStep = isMyStepDone ? myStep : (myStep || proceso.find(p => p.estado !== 'Atendido' && p.estado !== 'Procede') || proceso[0] || {
    orden: 1,
    area: userArea,
    plazoHoras: 48,
    diasRetraso: 0,
    descripcion: 'Revisión y validación de expediente'
  });

  const initials = APP.initials(s.alumnoNombre || 'Estudiante');
  const reqs = s.requisitos || [];

  let plazoBadge = '';
  if (isMyStepDone) {
    plazoBadge = `<span class="pill ok">${SVG_ICONS.check} Atendido y derivado</span>`;
  } else if (currentStep.diasRetraso > 0) {
    plazoBadge = `<span class="pill err">${SVG_ICONS.alert} ${currentStep.diasRetraso} días de retraso</span>`;
  } else {
    plazoBadge = `<span class="pill ok">${SVG_ICONS.check} Dentro del plazo (${currentStep.plazoHoras || 48} hrs)</span>`;
  }

  APP.openModal(`
    <div class="modal-head">
      <div>
        <h3 class="m-0" style="display:flex;align-items:center;gap:8px">
          <span>Atención de Trámite</span>
          <span class="vt-ticket-badge">${s.ticket || s.id}</span>
        </h3>
        <div class="muted" style="font-size:12px;margin-top:2px">
          ${s.tramiteNombre} · Registrado el ${s.fechaHora || s.fecha}
        </div>
      </div>
      <button type="button" class="modal-close" onclick="APP.closeModal()">${SVG_ICONS.modal.close}</button>
    </div>

    <div class="modal-task-body">
      <!-- Ficha rápida del estudiante -->
      <div class="modal-task-student-strip">
        <div class="modal-task-student-left">
          <div class="modal-task-student-avatar">${initials}</div>
          <div>
            <div class="modal-task-student-name">${s.alumnoNombre}</div>
            <div class="modal-task-student-sub">
              Código: <b>${s.alumnoCodigo || '-'}</b> · DNI: <b>${s.alumnoDni || '-'}</b> · Carrera: <b>${s.carrera || 'Pregrado Regular'}</b>
            </div>
          </div>
        </div>
        <div>
          <span class="pill ${s.pago && s.pago.estado === 'pagado' ? 'ok' : 'info'}">
            ${s.costo > 0 ? (s.pago && s.pago.estado === 'pagado' ? 'Pagado ' + APP.money(s.costo) : 'Pago Pendiente') : 'Trámite Gratuito'}
          </span>
        </div>
      </div>

      <!-- Etapa de Atención Asignada a tu Área -->
      <div class="modal-task-stage-card ${isMyStepDone ? 'stage-done' : ''}">
        <div class="modal-task-stage-header">
          <span class="modal-task-stage-badge">Etapa #${currentStep.orden || 1} Asignada: ${currentStep.area} ${isMyStepDone ? '(CONCLUIDA)' : ''}</span>
          ${plazoBadge}
        </div>
        <div class="modal-task-stage-title">${currentStep.descripcion || 'Revisión y dictamen de requisitos académicos'}</div>
        <div class="modal-task-stage-meta">
          <span>Área responsable: <b>${currentStep.area}</b></span>
          <span>•</span>
          <span>Plazo normado: <b>${currentStep.plazoHoras || 48} horas</b></span>
          ${currentStep.fechaAtencion ? `<span>•</span><span>Fecha atención: <b>${currentStep.fechaAtencion}</b></span>` : ''}
        </div>
      </div>

      <!-- Requisitos adjuntos presentados -->
      <div>
        <div class="modal-task-section-label">
          ${SVG_ICONS.fileText} <span>Requisitos y Documentos Adjuntos (${reqs.length})</span>
        </div>
        <div class="modal-task-req-list">
          ${reqs.length > 0 ? reqs.map((r, idx) => `
            <div class="modal-task-req-item">
              <div class="modal-task-req-info">
                ${SVG_ICONS.check}
                <span><b>${r.nombre || ('Requisito #' + (idx + 1))}</b>${r.archivoNombre ? ` (${r.archivoNombre})` : ''}</span>
              </div>
              <span class="pill ok">Presentado</span>
            </div>
          `).join('') : `
            <div class="muted" style="font-size:12.5px;padding:8px 12px;background:#F8FAFC;border-radius:6px;border:1px solid #E2E8F0">
              Este trámite no cuenta con adjuntos documentarios adicionales requeridos.
            </div>
          `}
        </div>
      </div>

      <!-- Observación interna o dictamen del área -->
      <div>
        <label for="obs-tarea-inicio" class="modal-task-section-label">
          ${SVG_ICONS.settings} <span>Dictamen / Observación Interna de ${currentStep.area}:</span>
        </label>
        ${isMyStepDone ? `
          <div class="vt-step-done-obs" style="font-size:13px;padding:12px 14px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;color:#166534">
            <b>Dictamen Registrado:</b> ${currentStep.observacionInterna || 'Expediente revisado y verificado conforme a los lineamientos institucionales.'}
          </div>
        ` : `
          <textarea id="obs-tarea-inicio" class="modal-task-textarea" placeholder="Escribe el dictamen de validación o detalles para la siguiente etapa...">${currentStep.observacionInterna || 'Expediente revisado y verificado conforme a los lineamientos institucionales.'}</textarea>
        `}
      </div>
    </div>

    <div class="modal-task-foot">
      <div>
        <a href="solicitudes.html?ticket=${encodeURIComponent(s.ticket || s.id)}" class="btn btn-outline btn-sm">
          Ver Expediente Completo
        </a>
      </div>
      <div class="modal-task-actions-right">
        ${isMyStepDone ? `
          <span class="pill ok">${SVG_ICONS.check} Etapa atendida por tu área</span>
          <button type="button" class="btn btn-primary btn-sm" onclick="APP.closeModal()">
            Cerrar
          </button>
        ` : `
          <button type="button" class="btn btn-secondary" onclick="observarTareaDesdeInicio('${s.id}', ${currentStep.orden || 1})">
            Observar Trámite
          </button>
          <button type="button" class="btn btn-primary" onclick="aprobarTareaDesdeInicio('${s.id}', ${currentStep.orden || 1})">
            <span>Aprobar y Derivar</span> ${SVG_ICONS.arrowRight}
          </button>
        `}
      </div>
    </div>
  `, { wide: true });
}

function aprobarTareaDesdeInicio(solId, orden) {
  const obsEl = document.getElementById('obs-tarea-inicio');
  const obsVal = obsEl ? obsEl.value.trim() : 'Conforme. Derivado a la siguiente etapa.';

  DB.avanzarEtapaProceso(solId, orden, obsVal);

  APP.toast({
    icon: 'ok',
    title: 'Trámite derivado con éxito',
    body: 'La etapa de tu área ha sido aprobada y la solicitud avanzó a la siguiente fase.'
  });

  APP.closeModal();
  render();
}

function observarTareaDesdeInicio(solId, orden) {
  const obsEl = document.getElementById('obs-tarea-inicio');
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
    body: 'Se registró la observación y se notificó al estudiante para su subsanación.'
  });

  APP.closeModal();
  render();
}

function irATareasArea() {
  const el = document.getElementById('home-tasks-card');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    setTabTareas('mis-tareas');
  }
}

function irASolicitudesPagadas() {
  window.location.href = 'solicitudes.html?estado=Pagados';
}

function irARegistrar() {
  window.location.href = 'registrar.html';
}

// --------------------------------------------------------------------------
// 4. MODAL DE BÚSQUEDA RÁPIDA DE ALUMNO
// --------------------------------------------------------------------------
function abrirBuscadorAlumnoModal() {
  APP.openModal(`
    <div class="modal-head">
      <div>
        <h3 class="m-0">Búsqueda Rápida de Estudiante</h3>
        <div class="muted" style="font-size:12px;margin-top:2px">Consulta inmediata de identidad, carrera, deudas y solicitudes registradas.</div>
      </div>
      <button type="button" class="modal-close" onclick="APP.closeModal()">${SVG_ICONS.modal.close}</button>
    </div>

    <div class="modal-body modal-search-student-box">
      <div class="search-student-input-wrap">
        <span class="search-icon">${SVG_ICONS.search}</span>
        <input class="search-student-input" id="search-student-term" placeholder="Ingresa DNI, código o apellidos del estudiante..." onkeyup="if(event.key==='Enter') ejecutarBusquedaRapidaAlumno()">
      </div>

      <div id="search-student-results-slot">
        <div class="muted text-center" style="padding:24px 10px;font-size:13px">
          Escribe el documento o código institucional para consultar su expediente.
        </div>
      </div>
    </div>

    <div class="modal-foot">
      <button type="button" class="btn" onclick="APP.closeModal()">Cerrar</button>
      <button type="button" class="btn btn-primary" onclick="ejecutarBusquedaRapidaAlumno()">Buscar Alumno</button>
    </div>
  `, { wide: true });

  setTimeout(() => {
    const input = document.getElementById('search-student-term');
    if (input) input.focus();
  }, 100);
}

function ejecutarBusquedaRapidaAlumno() {
  const input = document.getElementById('search-student-term');
  const slot = document.getElementById('search-student-results-slot');
  if (!input || !slot) return;

  const q = input.value.trim().toLowerCase();
  if (!q) {
    slot.innerHTML = '<div class="alert warn" style="margin:0;font-size:12.5px">Ingresa un término de búsqueda válido.</div>';
    return;
  }

  const allUsers = DB.usuarios();
  const students = allUsers.filter(u => u.rol === 'alumno');
  const found = students.filter(s => {
    const text = `${s.nombre} ${s.codigo || ''} ${s.dni || ''} ${s.email || ''}`.toLowerCase();
    return text.includes(q);
  });

  if (found.length === 0) {
    slot.innerHTML = `
      <div class="alert info" style="margin:0;font-size:13px">
        No se encontró ningún estudiante con el criterio «<b>${input.value}</b>».
      </div>
    `;
    return;
  }

  const allSolicitudes = DB.solicitudes();

  slot.innerHTML = found.slice(0, 3).map(st => {
    const userSols = allSolicitudes.filter(x => x.alumnoId === st.id || x.alumnoCodigo === st.codigo);
    const perfil = st.perfil || {};
    const carrera = (st.carreras && st.carreras[0]) || perfil.programa || 'Pregrado Regular';
    const initials = APP.initials(st.nombre);

    return `
      <div class="search-student-result-card" style="margin-bottom:12px">
        <div class="result-card-header">
          <div class="result-avatar">${initials}</div>
          <div>
            <div class="result-name">${st.nombre}</div>
            <div class="result-meta">Código: <b>${st.codigo}</b> · DNI: <b>${st.dni || '-'}</b> · ${st.email || '-'}</div>
          </div>
        </div>

        <div class="result-grid-info">
          <div class="result-info-item">
            <span class="result-info-label">Carrera / Programa</span>
            <span class="result-info-val">${carrera}</span>
          </div>
          <div class="result-info-item">
            <span class="result-info-label">Ciclo / Nivel</span>
            <span class="result-info-val">Ciclo ${perfil.ciclo || 8} · ${perfil.nivel || 'Pregrado'}</span>
          </div>
          <div class="result-info-item">
            <span class="result-info-label">Estado Financiero</span>
            <span class="result-info-val" style="color:${(perfil.deuda > 0) ? '#B91C1C' : '#047857'}">
              ${(perfil.deuda > 0) ? ('Deuda ' + APP.money(perfil.deuda)) : 'Al día (Sin deuda)'}
            </span>
          </div>
        </div>

        <div style="font-size:12px;font-weight:700;margin-bottom:6px;color:var(--text)">
          Trámites Registrados (${userSols.length}):
        </div>
        ${userSols.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:5px">
            ${userSols.map(us => `
              <div style="display:flex;justify-content:space-between;align-items:center;background:#FFF;padding:6px 10px;border-radius:6px;border:1px solid #E2E8F0;font-size:12px">
                <div>
                  <span class="mono bold">${us.ticket || us.id}</span> · <b>${us.tramiteNombre}</b>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="pill ${us.estado === 'Aprobado' || us.estado === 'Emitido' ? 'ok' : 'info'}">${us.estado}</span>
                  <a href="solicitudes.html?ticket=${us.ticket || us.id}" class="btn btn-sm btn-outline" style="padding:2px 8px;font-size:11px">Ver Detalle</a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="muted" style="font-size:12px">Este estudiante no registra solicitudes previas.</div>
        `}
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 5. RENDER PRINCIPAL DE LA PÁGINA HOME
// --------------------------------------------------------------------------
function render() {
  const session = APP.getSession();
  if (!session) {
    window.location.href = '../index.html';
    return;
  }

  const allUsers = DB.usuarios();
  const user = allUsers.find(u => u.id === session.id || u.codigo === session.codigo) || session;

  const actor = getActorWorkflowCertificaciones(user);
  const wf = DB.workflowFirmas();
  const admOk = !!wf.administrativo?.aprobado;
  const dirOk = !!wf.director?.aprobado;
  const decOk = !!wf.decano?.aprobado;
  const currentTurno = !admOk ? 'administrativo' : (!dirOk ? 'director' : (!decOk ? 'decano' : 'completado'));
  const esMiTurno = (actor === currentTurno);
  const certTareasCount = esMiTurno ? 1 : 0;

  const userNombre = user.nombre || 'Colaborador';
  const primerNombre = userNombre.split(' ')[0] || userNombre;
  const userRol = user.subrol === 'decano' ? 'Decano de Facultad' : (user.rol === 'director' ? 'Director Institucional' : user.rol === 'docente' ? 'Docente Revisor' : (user.cargo || 'Administrador de Trámites'));
  const userArea = user.area || 'Registros Académicos';

  const allSolicitudes = DB.solicitudes();

  // Cálculo de KPIs
  // Cálculo preciso de KPIs
  const userAreaNorm = userArea.trim().toLowerCase();
  const misTareasCount = allSolicitudes.filter(s => {
    if (!s.activo || s.estado === 'Cancelar' || s.estado === 'Rechazado' || s.estado === 'Emitido') return false;
    const activeStep = (s.proceso || []).find(x => x.estado !== 'Atendido' && x.estado !== 'Procede');
    return activeStep && (activeStep.area || '').trim().toLowerCase() === userAreaNorm;
  }).length;

  const atendidosAreaCount = allSolicitudes.filter(s => {
    return (s.proceso || []).some(p => (p.area || '').trim().toLowerCase() === userAreaNorm && (p.estado === 'Atendido' || p.estado === 'Procede'));
  }).length;

  const urgentesCount = allSolicitudes.filter(s => {
    if (!s.activo || s.estado === 'Cancelar' || s.estado === 'Rechazado' || s.estado === 'Emitido' || s.estado === 'Aprobado') return false;
    const activeStep = (s.proceso || []).find(x => x.estado !== 'Atendido' && x.estado !== 'Procede');
    if (!activeStep) return false;
    const isOverdue = (activeStep.diasRetraso > 0) || (s.fecha && ((new Date() - new Date(s.fecha + 'T00:00:00')) / (1000 * 3600 * 24) > 3));
    return isOverdue;
  }).length;

  // Pipeline Macro
  const countSolicitados = allSolicitudes.filter(s => s.estado === 'Solicitado' || s.estado === 'En revisión').length;
  const countPagoPend = allSolicitudes.filter(s => s.pago && s.pago.estado === 'pendiente' && s.costo > 0).length;
  const countEnRevision = allSolicitudes.filter(s => s.estado === 'En revisión' || s.estado === 'Solicitado').length;
  const countAprobados = allSolicitudes.filter(s => s.estado === 'Aprobado' || s.estado === 'Procede').length;
  const countEmitidos = allSolicitudes.filter(s => s.estado === 'Emitido').length;

  ctx.mount.innerHTML = `
    <div class="home-container">
      <!-- 0. CINTILLO INSTITUCIONAL DE WORKFLOW (PRIORIDAD TOP, SOBRE EL HERO GREETING) -->
      <div id="home-cintillo-slot"></div>

      <!-- 1. HERO BIENVENIDA & IDENTIDAD OPERATIVA -->
      <div class="home-hero-greeting">
        <div class="hero-left-col">
          <h1 class="hero-greeting-title">Hola, ${primerNombre}</h1>
          <div class="hero-meta-strip">
            <span class="hero-meta-item">
              ${SVG_ICONS.meta.user} <span class="hero-meta-strong">${userRol}</span>
            </span>
            <span class="hero-meta-dot">•</span>
            <span class="hero-meta-item">
              ${SVG_ICONS.meta.building} Área: <span class="hero-meta-strong">${userArea}</span>
            </span>
          </div>
        </div>

        <div class="hero-right-col">
          <div class="hero-clock-box">
            ${SVG_ICONS.meta.clock} <span>Sistema:</span>
            <span class="hero-clock-time">${APP.nowStamp()}</span>
          </div>
          <div class="hero-status-pill">
            ${SVG_ICONS.meta.check} <span>Turno Operativo Activo</span>
          </div>
        </div>
      </div>

      <!-- 2. ESPACIO DE BANNER INSTITUCIONAL (PRIMER SCROLL) -->
      <div id="home-banner-slot"></div>

      <!-- 3. TIRA DE MÉTRICAS OPERATIVAS DE TU ÁREA (KPIS) -->
      <div class="home-kpis-grid">
        <div class="home-kpi-card">
          <div class="home-kpi-top">
            <span class="home-kpi-label">Tareas de tu Área</span>
            <div class="home-kpi-icon kpi-icon-teal">${SVG_ICONS.kpi.inbox}</div>
          </div>
          <div class="home-kpi-value">${misTareasCount}</div>
          <div class="home-kpi-sub">Trámites esperando revisión de ${userArea}</div>
        </div>

        <div class="home-kpi-card">
          <div class="home-kpi-top">
            <span class="home-kpi-label">Atendidos y Derivados</span>
            <div class="home-kpi-icon kpi-icon-emerald">${SVG_ICONS.kpi.check}</div>
          </div>
          <div class="home-kpi-value">${atendidosAreaCount}</div>
          <div class="home-kpi-sub">Expedientes dictaminados y derivados con éxito</div>
        </div>

        <div class="home-kpi-card">
          <div class="home-kpi-top">
            <span class="home-kpi-label">Por Vencer</span>
            <div class="home-kpi-icon kpi-icon-amber">${SVG_ICONS.kpi.clock}</div>
          </div>
          <div class="home-kpi-value">${urgentesCount}</div>
          <div class="home-kpi-sub">Trámites próximos al límite de atención</div>
        </div>

        <div class="home-kpi-card">
          <div class="home-kpi-top">
            <span class="home-kpi-label">Atención a Tiempo</span>
            <div class="home-kpi-icon kpi-icon-blue">${SVG_ICONS.kpi.layers}</div>
          </div>
          <div class="home-kpi-value">96.8%</div>
          <div class="home-kpi-sub">Cumplimiento dentro del plazo institucional normado</div>
        </div>
      </div>

      <!-- 4. BANDEJA DE TAREAS PRIORITARIAS DEL ÁREA (MOTOR DE FLUJO) -->
      <div class="home-section-card" id="home-tasks-card">
        <div class="home-section-header">
          <div class="home-section-title-box">
            <h3 class="home-section-title">
              ${SVG_ICONS.section.layers} <span>Bandeja de Tareas de Área</span>
            </h3>
            <p class="home-section-desc">Solicitudes en revisión, atención de dictámenes y derivación entre áreas académicas.</p>
          </div>

          <div class="home-tabs-group">
            <button type="button" class="home-tab-btn ${TAB_TAREAS === 'mis-tareas' ? 'active' : ''}" data-tab="mis-tareas" onclick="setTabTareas('mis-tareas')">
              <span>Pendientes (${userArea})</span>
              <span class="home-tab-badge">${misTareasCount}</span>
            </button>
            <button type="button" class="home-tab-btn ${TAB_TAREAS === 'atendidas' ? 'active' : ''}" data-tab="atendidas" onclick="setTabTareas('atendidas')">
              <span>Atendidas y Derivadas</span>
              <span class="home-tab-badge">${atendidosAreaCount}</span>
            </button>
            <button type="button" class="home-tab-btn ${TAB_TAREAS === 'urgentes' ? 'active' : ''}" data-tab="urgentes" onclick="setTabTareas('urgentes')">
              <span>Por Vencer</span>
              <span class="home-tab-badge">${urgentesCount}</span>
            </button>
            <button type="button" class="home-tab-btn ${TAB_TAREAS === 'todas' ? 'active' : ''}" data-tab="todas" onclick="setTabTareas('todas')">
              <span>Campus Global</span>
              <span class="home-tab-badge">${allSolicitudes.length}</span>
            </button>
          </div>
        </div>

        <div class="home-table-wrap">
          <table class="home-tasks-table">
            <thead>
              <tr>
                <th style="width:110px">Ticket</th>
                <th>Estudiante</th>
                <th>Trámite Oficial</th>
                <th style="width:120px">Estado</th>
                <th>Etapa Asignada</th>
                <th style="width:160px">Tiempo Límite</th>
                <th style="width:120px;text-align:right">Acción</th>
              </tr>
            </thead>
            <tbody id="home-tasks-tbody">
              <!-- Renderizado dinámico vía renderTareasTable() -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. RADAR DE FLUJOS MACRO (PIPELINE INSTITUCIONAL) -->
      <div class="home-section-card pipeline-card">
        <div class="home-section-title-box">
          <h3 class="home-section-title">
            ${SVG_ICONS.section.fileText} <span>Radar General de Flujos de Trámites</span>
          </h3>
          <p class="home-section-desc">Distribución consolidada de todas las solicitudes activas en el ciclo de vida institucional.</p>
        </div>

        <div class="pipeline-strip">
          <a href="solicitudes.html?estado=Solicitado" class="pipeline-node" title="Ver solicitudes recibidas">
            <div class="pipeline-node-top">
              <span class="pipeline-step-badge">1. SOLICITUD</span>
              ${SVG_ICONS.radar.solicitud}
            </div>
            <div class="pipeline-step-count">${countSolicitados}</div>
            <div class="pipeline-step-name">Nuevos Registros</div>
          </a>

          <a href="solicitudes.html?estado=pago-pendiente" class="pipeline-node" title="Ver órdenes de pago pendientes">
            <div class="pipeline-node-top">
              <span class="pipeline-step-badge">2. PAGO</span>
              ${SVG_ICONS.radar.pago}
            </div>
            <div class="pipeline-step-count">${countPagoPend}</div>
            <div class="pipeline-step-name">En Caja / Niubiz</div>
          </a>

          <a href="solicitudes.html?estado=En revisión" class="pipeline-node" title="Ver trámites en revisión por departamentos">
            <div class="pipeline-node-top">
              <span class="pipeline-step-badge">3. REVISIÓN</span>
              ${SVG_ICONS.radar.revision}
            </div>
            <div class="pipeline-step-count">${countEnRevision}</div>
            <div class="pipeline-step-name">En Áreas Académicas</div>
          </a>

          <a href="solicitudes.html?estado=Aprobado" class="pipeline-node" title="Ver trámites aprobados procedentes">
            <div class="pipeline-node-top">
              <span class="pipeline-step-badge">4. RESOLUCIÓN</span>
              ${SVG_ICONS.radar.resolucion}
            </div>
            <div class="pipeline-step-count">${countAprobados}</div>
            <div class="pipeline-step-name">Dictamen Favorable</div>
          </a>

          <a href="solicitudes.html?estado=Emitido" class="pipeline-node" title="Ver documentos emitidos con firma digital">
            <div class="pipeline-node-top">
              <span class="pipeline-step-badge">5. EMISIÓN</span>
              ${SVG_ICONS.radar.emision}
            </div>
            <div class="pipeline-step-count">${countEmitidos}</div>
            <div class="pipeline-step-name">Documentos Entregados</div>
          </a>
        </div>
      </div>

      <!-- 6. HERRAMIENTAS Y ACCESOS RÁPIDOS OPERATIVOS -->
      <div class="home-quick-actions-grid">
        <a href="registrar.html" class="quick-action-card" title="Registrar un trámite presencial en ventanilla">
          <div class="quick-action-icon qa-icon-teal">${SVG_ICONS.actions.plus}</div>
          <div class="quick-action-info">
            <div class="quick-action-title">Mesa de Partes Virtual</div>
            <div class="quick-action-desc">Registro asistido y radicación de solicitudes en ventanilla.</div>
          </div>
        </a>

        <div class="quick-action-card" onclick="abrirBuscadorAlumnoModal()" title="Consultar expediente de un estudiante">
          <div class="quick-action-icon qa-icon-blue">${SVG_ICONS.actions.search}</div>
          <div class="quick-action-info">
            <div class="quick-action-title">Consulta Rápida de Alumno</div>
            <div class="quick-action-desc">Verifica matrícula, deudas y trámites por DNI o código.</div>
          </div>
        </div>

        <a href="flujos.html" class="quick-action-card" title="Visualizar y editar etapas de flujos">
          <div class="quick-action-icon qa-icon-purple">${SVG_ICONS.actions.settings}</div>
          <div class="quick-action-info">
            <div class="quick-action-title">Flujos y Etapas</div>
            <div class="quick-action-desc">Modelado de etapas, requisitos y derivación de áreas.</div>
          </div>
        </a>

        <a href="seguridad.html" class="quick-action-card" title="Consultar permisos institucionales">
          <div class="quick-action-icon qa-icon-slate">${SVG_ICONS.actions.shield}</div>
          <div class="quick-action-info">
            <div class="quick-action-title">Matriz de Seguridad & Roles</div>
            <div class="quick-action-desc">Gobierno de accesos, permisos y políticas institucionales.</div>
          </div>
        </a>
      </div>
    </div>
  `;

  // Render inicial del banner, cintillo y la tabla
  renderBanner();
  renderCintilloWorkflow();
  renderTareasTable();
}

// Exposición en window para handlers inline
window.setTabTareas = setTabTareas;
window.abrirModalAtencionTarea = abrirModalAtencionTarea;
window.aprobarTareaDesdeInicio = aprobarTareaDesdeInicio;
window.observarTareaDesdeInicio = observarTareaDesdeInicio;
window.irATareasArea = irATareasArea;
window.irASolicitudesPagadas = irASolicitudesPagadas;
window.irARegistrar = irARegistrar;
window.abrirBuscadorAlumnoModal = abrirBuscadorAlumnoModal;
window.ejecutarBusquedaRapidaAlumno = ejecutarBusquedaRapidaAlumno;
window.abrirModalRefrendoInicio = abrirModalRefrendoInicio;
window.ejecutarFirmaDesdeInicio = ejecutarFirmaDesdeInicio;
window.reiniciarWorkflowDesdeInicio = reiniciarWorkflowDesdeInicio;

render();
