/* admin/tramite-studio.js - Lógica y Motor de Estudio de Trámites */
    // =========================================================================
    // CATÁLOGO DE ICONOS SVG INSTITUCIONALES (Consistencia Total Feather / Wiener)
    // =========================================================================
    const SVG_ICONS = {
      backArrow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
      close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      warning: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      checkCircle: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      alertOctagon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
      error: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      eye: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      save: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
      flujo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
      requisitos: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="12" x2="15" y2="12"></line><line x1="9" y1="16" x2="15" y2="16"></line></svg>',
      audiencia: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      documento: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      notificaciones: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      cronograma: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      recipe: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
      plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
      solicitud: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      pago: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
      revision: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2l10 5H2l10-5z"></path></svg>',
      aprobacion: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>',
      entrega: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
      preflight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>',
      chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
      paperclip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>',
      download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
      edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      fileWord: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="10" y2="15"></line><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
      fileExcel: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><line x1="12" y1="9" x2="12" y2="21"></line></svg>',
      filePdf: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>'
    };

    // 1. Inicializar Shell de la Intranet Wiener
    const ctx = APP.renderShell('tramites');

    // 2. Función de escape HTML segura
    function E(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // 2.1 Editor de texto enriquecido (RTE) y contador
    function rteCommand(textareaId, cmd) {
      const ta = document.getElementById(textareaId);
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const sel = ta.value.substring(start, end);
      let rep = '';
      if (cmd === 'bold') rep = `<b>${sel || 'texto en negrita'}</b>`;
      else if (cmd === 'italic') rep = `<i>${sel || 'texto en cursiva'}</i>`;
      else if (cmd === 'underline') rep = `<u>${sel || 'texto subrayado'}</u>`;
      else if (cmd === 'strike') rep = `<s>${sel || 'texto tachado'}</s>`;
      else if (cmd === 'list-ul') rep = `\n• ${sel || 'elemento de lista'}\n`;
      else if (cmd === 'list-ol') rep = `\n1. ${sel || 'elemento numerado'}\n`;
      else if (cmd === 'link') {
        const url = prompt('Ingrese URL del enlace:', 'https://');
        if (url) rep = `<a href="${url}" target="_blank">${sel || 'Enlace'}</a>`;
        else return;
      }
      ta.setRangeText(rep, start, end, 'end');
      ta.focus();
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function updateCharCounter(elId, len, max = 500) {
      const el = document.getElementById(elId);
      if (el) el.textContent = `${len} / ${max} caracteres (máx. ${max})`;
    }

    // 2.2 Catálogos institucionales para cronograma académico
    const GRADOS_ESTUDIO = [
      'Todos',
      'CEPRE - Pre Wiener',
      'Diplomatura',
      'Extensión Universitaria',
      'Idiomas',
      'Posgrado',
      'Pregrado',
      'Programa de Especialización',
      'Segunda Especialidad'
    ];

    const MODALIDADES_POR_GRADO = {
      'Todos': ['Todas', 'Presencial', 'Semipresencial', 'A distancia'],
      'Pregrado': [
        'Todas',
        'Modalidad EPEX',
        'Modalidad Ordinaria',
        'Pregrado Semipresencial',
        'Revalidación de Título Profesional Presencial'
      ],
      'Posgrado': [
        'Todas',
        'Maestría Presencial',
        'Maestría Semipresencial',
        'Maestría A Distancia',
        'Doctorado Presencial',
        'Segunda Especialidad Médica'
      ],
      'CEPRE - Pre Wiener': [
        'Todas',
        'Ciclo Regular Presencial',
        'Ciclo Regular Virtual',
        'Ciclo Intensivo',
        'Ciclo Repaso'
      ],
      'Idiomas': [
        'Todas',
        'Inglés Regular Virtual',
        'Inglés Intensivo',
        'Portugués Regular',
        'Portugués Intensivo'
      ],
      'Diplomatura': [
        'Todas',
        'Presencial',
        'Semipresencial',
        'A Distancia (Virtual)'
      ],
      'Extensión Universitaria': [
        'Todas',
        'Presencial',
        'Virtual'
      ],
      'Programa de Especialización': [
        'Todas',
        'Presencial',
        'Semipresencial',
        'Virtual'
      ],
      'Segunda Especialidad': [
        'Todas',
        'Presencial',
        'Semipresencial'
      ]
    };

    const FACULTADES_CATALOGO = [
      'Todas',
      'Facultad de Ciencias de la Salud',
      'Facultad de Farmacia y Bioquímica',
      'Facultad de Ingeniería y Negocios',
      'Facultad de Derecho y Ciencia Política'
    ];

    const CARRERAS_CATALOGO = [
      'Todas',
      'Medicina Humana',
      'Enfermería',
      'Obstetricia',
      'Odontología',
      'Tecnología Médica - Terapia Física',
      'Tecnología Médica - Laboratorio Clínico',
      'Psicología',
      'Farmacia y Bioquímica',
      'Derecho',
      'Administración y Negocios Internacionales',
      'Contabilidad y Auditoría',
      'Ingeniería de Sistemas e Informática',
      'Ingeniería Industrial'
    ];

    const PERIODOS_CATALOGO = [
      'Todos',
      '2026-1',
      '2026-2',
      '2027-0',
      '2027-1'
    ];

    // 2.3 Paleta de colores institucionales para tags de notificaciones
    const COLORES_TAG = [
      { id: 'red', label: 'Rojo (Rechazado)', bg: '#FEE2E2', border: '#FCA5A5', color: '#991B1B' },
      { id: 'green', label: 'Verde (Aprobado)', bg: '#D1FAE5', border: '#6EE7B7', color: '#065F46' },
      { id: 'amber', label: 'Ámbar (Observado)', bg: '#FEF3C7', border: '#FCD34D', color: '#92400E' },
      { id: 'blue', label: 'Azul (En revisión)', bg: '#DBEAFE', border: '#93C5FD', color: '#1E40AF' },
      { id: 'teal', label: 'Teal (Institucional)', bg: '#CCFBF1', border: '#5EEAD4', color: '#0F766E' },
      { id: 'purple', label: 'Púrpura (Especial)', bg: '#F3E8FF', border: '#D8B4FE', color: '#6B21A8' },
      { id: 'gray', label: 'Gris (Informativo)', bg: '#F1F5F9', border: '#CBD5E1', color: '#475569' }
    ];

    // 3. Helper para obtener perfiles curados de alumnos demo para simulación
    function obtenerAlumnosMock() {
      return [
        {
          nombre: 'María Fernanda Quispe',
          codigo: '2021100345',
          dni: '72845109',
          perfil: {
            nivel: 'pregrado',
            programa: 'Ingeniería de Sistemas e Informática',
            ciclo: 8,
            creditos: 168,
            tercioSuperior: true,
            quintoSuperior: false
          }
        },
        {
          nombre: 'José Antonio Ramos',
          codigo: '2019054420',
          dni: '71234567',
          perfil: {
            nivel: 'pregrado',
            programa: 'Administración y Negocios',
            ciclo: 10,
            creditos: 210,
            tercioSuperior: false,
            quintoSuperior: false
          }
        },
        {
          nombre: 'Dra. Carmen Rosa Benavides',
          codigo: '2024200891',
          dni: '41982354',
          perfil: {
            nivel: 'posgrado',
            programa: 'Maestría en Gestión en Salud',
            ciclo: 3,
            creditos: 48,
            tercioSuperior: true,
            quintoSuperior: true
          }
        },
        {
          nombre: 'Lic. Walter Flores Mendoza',
          codigo: '2023150042',
          dni: '44521098',
          perfil: {
            nivel: 'segunda-especialidad',
            programa: 'Segunda Especialidad en Enfermería',
            ciclo: 2,
            creditos: 36,
            tercioSuperior: false,
            quintoSuperior: false
          }
        },
        {
          nombre: 'Ing. David Mendoza Rojas',
          codigo: '2025010112',
          dni: '46871234',
          perfil: {
            nivel: 'formacion-continua',
            programa: 'Diplomado en Auditoría Médica',
            ciclo: 1,
            creditos: 18,
            tercioSuperior: false,
            quintoSuperior: false
          }
        }
      ];
    }

    // =========================================================================
    // MODAL DE CONFIRMACIÓN ESTILIZADO (Reemplazo total de confirm() nativo)
    // =========================================================================
    function mostrarModalConfirmacion({ titulo, mensaje, textoConfirmar, textoCancelar, onConfirm, onCancel }) {
      APP.openModal(`
        <div class="modal-head" style="border-bottom:1px solid var(--border-soft);padding:18px 22px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:#FEF3C7;color:#D97706;display:grid;place-items:center;flex-shrink:0">
              ${SVG_ICONS.warning}
            </div>
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:900;color:var(--text);font-family:'Lato',sans-serif">${E(titulo || 'Atención')}</h3>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Confirmación requerida</div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="cerrarModalConfirmacion(false)" style="border:none;background:transparent;cursor:pointer;color:var(--text-muted);display:grid;place-items:center;width:32px;height:32px;border-radius:8px">
            ${SVG_ICONS.close}
          </button>
        </div>
        <div class="modal-body" style="padding:22px;font-size:13.5px;color:var(--text);line-height:1.55">
          ${mensaje}
        </div>
        <div class="modal-foot" style="padding:14px 22px;background:var(--surface-2);border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn-studio-secondary" style="height:38px;padding:0 16px" onclick="cerrarModalConfirmacion(false)">
            ${E(textoCancelar || 'Cancelar')}
          </button>
          <button type="button" class="btn-studio-primary" style="height:38px;padding:0 18px;background:#222222;border-color:#222222;color:#FFFFFF" onclick="cerrarModalConfirmacion(true)">
            ${E(textoConfirmar || 'Descartar y Salir')}
          </button>
        </div>
      `);

      window._modalConfirmCallback = onConfirm;
      window._modalCancelCallback = onCancel;
    }

    function cerrarModalConfirmacion(confirmado) {
      APP.closeModal();
      if (confirmado && typeof window._modalConfirmCallback === 'function') {
        const cb = window._modalConfirmCallback;
        window._modalConfirmCallback = null;
        window._modalCancelCallback = null;
        cb();
      } else if (!confirmado && typeof window._modalCancelCallback === 'function') {
        const cb = window._modalCancelCallback;
        window._modalConfirmCallback = null;
        window._modalCancelCallback = null;
        cb();
      }
    }

    // =========================================================================
    // PLANTILLAS / RECETAS INTELIGENTES (STARTER RECIPES 2026)
    // =========================================================================
    const STUDIO_RECIPES = [
      {
        id: 'inmediata',
        titulo: 'Emisión Inmediata (100% Digital)',
        badge: 'Automático',
        resumen: 'El alumno paga en línea y recibe su documento oficial al instante, sin revisión manual.',
        ejemplos: 'Constancia de Matrícula, Tercio Superior, Egresado.',
        datos: {
          tipo: 'Constancia', modelo: 'constancia', costo: 25.00, pagoMomento: 'antes',
          requiereAprobacion: false, diasEntrega: 0, plazoRecojoDias: 0,
          observacion: 'Emisión electrónica 100% digital e inmediata.',
          proceso: []
        }
      },
      {
        id: 'con-revision',
        titulo: 'Revisión Académica + Pago Previo',
        badge: 'Frecuente',
        resumen: 'El alumno paga al solicitar y adjunta sustentos. Registros Académicos valida y emite.',
        ejemplos: 'Certificado de Estudios, Sílabos Visados.',
        datos: {
          tipo: 'Certificado', modelo: 'certificado', costo: 120.00, pagoMomento: 'antes',
          requiereAprobacion: true, diasEntrega: 5, plazoRecojoDias: 5,
          observacion: 'Requiere validación de actas y notas.',
          requisitos: [
            { id: 'REQ-001', titulo: 'Documento Nacional de Identidad (DNI) vigente', condiciones: 'Copia legible de ambas caras en formato PDF.', adjuntarArchivo: true }
          ],
          proceso: [
            { id: 'P-1', area: 'Registros Académicos', descripcion: 'Validar historial académico y generar firmas oficiales.', duracionDias: 3, activo: true }
          ]
        }
      },
      {
        id: 'pago-condicionado',
        titulo: 'Evaluación Previa con Pago Condicionado',
        badge: 'Avanzado',
        resumen: 'El alumno sustenta sin pagar. Solo si el área aprueba la solicitud, se habilita el botón de pago.',
        ejemplos: 'Convalidación de Asignaturas, Rectificación de Matrícula, Bachiller.',
        datos: {
          tipo: 'Solicitud', modelo: 'oficio', costo: 45.00, pagoMomento: 'despues',
          requiereAprobacion: true, diasEntrega: 7, plazoRecojoDias: 7,
          observacion: 'El pago se habilita únicamente tras resolución favorable del área académica.',
          requisitos: [
            { id: 'REQ-003', titulo: 'Formato Único de Trámite (FUT) con exposición de motivos', condiciones: 'Detallar asignaturas a convalidar y adjuntar sílabos.', adjuntarArchivo: true }
          ],
          proceso: [
            { id: 'P-1', area: 'Dirección de Escuela', descripcion: 'Evaluación curricular y dictamen favorable.', duracionDias: 4, activo: true }
          ]
        }
      },
      {
        id: 'gratuito-evaluado',
        titulo: 'Trámite Gratuito con Evaluación Colegiada',
        badge: 'Costo Cero',
        resumen: 'Sin costo monetario. Pasa por 2 áreas académicas antes de emitir respuesta resolutiva.',
        ejemplos: 'Beca Impulsa, Reserva de Matrícula, Licencia de Estudios.',
        datos: {
          tipo: 'Solicitud', modelo: 'oficio', costo: 0.00, pagoMomento: 'despues',
          requiereAprobacion: true, diasEntrega: 8, plazoRecojoDias: 8,
          observacion: 'Trámite sin costo arancelario institucional.',
          requisitos: [
            { id: 'REQ-004', titulo: 'Sustento socioeconómico o constancia médica certificada', condiciones: 'Documento original escaneado en PDF legible.', adjuntarArchivo: true }
          ],
          proceso: [
            { id: 'P-1', area: 'Bienestar Universitario', descripcion: 'Revisión socioeconómica y validación documental.', duracionDias: 4, activo: true },
            { id: 'P-2', area: 'Registros Académicos', descripcion: 'Registro de resolución en el sistema ERP.', duracionDias: 3, activo: true }
          ]
        }
      },
      {
        id: 'en-blanco',
        titulo: 'Personalizado desde Cero',
        badge: 'En Blanco',
        resumen: 'Lienzo vacío para configurar manualmente cada paso, regla y plantilla.',
        ejemplos: 'Trámites especiales o convenios interinstitucionales.',
        datos: {
          tipo: 'Constancia', modelo: 'constancia', costo: 0.00, pagoMomento: 'antes',
          requiereAprobacion: true, diasEntrega: 3, plazoRecojoDias: 3,
          observacion: '', requisitos: [], proceso: []
        }
      }
    ];

    // =========================================================================
    // ESTADO LOCAL DEL STUDIO
    // =========================================================================
    let CURRENT_T = null;          // Objeto trámite en edición
    let ORIGINAL_JSON = '';        // Para dirty-checking
    let ACTIVE_TAB = 'flujo';      // 'flujo', 'requisitos', 'audiencia', 'documento', 'notificaciones', 'cronograma'
    let SELECTED_STEP_KEY = 'sol'; // Paso seleccionado en el inspector
    let SIMULATOR_OPEN = false;
    let SIMULATOR_STUDENT_CODE = '2021100345'; // María Fernanda por defecto
    let ACTIVE_CORREO_EDIT_IDX = null; // null: lista, -1: nuevo, >=0: editando
    let CONCEPTO_SEARCH_KW = '';

    // Cargar o crear trámite
    function initStudio() {
      const urlParams = new URLSearchParams(window.location.search);
      const tramiteId = urlParams.get('id');
      const plantillaParam = urlParams.get('plantilla');
      const tabParam = urlParams.get('tab');
      if (tabParam && ['flujo', 'requisitos', 'audiencia', 'documento', 'notificaciones', 'cronograma'].includes(tabParam)) {
        ACTIVE_TAB = tabParam;
      }

      if (tramiteId) {
        const loaded = DB.getTramite(tramiteId);
        if (loaded) {
          CURRENT_T = normalizarTramite(JSON.parse(JSON.stringify(loaded)));
        } else {
          APP.toast('Trámite no encontrado. Se creará uno nuevo.', 'warn');
          CURRENT_T = crearTramiteDesdeReceta('inmediata', false);
        }
      } else if (plantillaParam) {
        CURRENT_T = crearTramiteDesdeReceta(plantillaParam, true);
      } else {
        // Al entrar por primera vez para crear un trámite nuevo, iniciamos con nombre limpio listo para escribir
        CURRENT_T = crearTramiteDesdeReceta('inmediata', false);
      }

      ORIGINAL_JSON = JSON.stringify(CURRENT_T);
      renderStudioUI();
    }

    function normalizarTramite(t) {
      t.audiencia = Object.assign({ niveles: ['pregrado'], ciclos: [], minCreditos: 0, promedioMin: 0, tercioSuperior: false, quintoSuperior: false }, t.audiencia || {});
      if (!Array.isArray(t.requisitos)) t.requisitos = [];
      if (!Array.isArray(t.proceso)) t.proceso = [];
      if (!Array.isArray(t.cronogramas)) t.cronogramas = [];
      if (!Array.isArray(t.intenciones)) t.intenciones = [];
      if (!Array.isArray(t.correos) || !t.correos.length) {
        t.correos = [
          {
            id: 'MAIL-' + (t.id || 'T') + '-1',
            tipoEstado: 'Aprobado',
            colorTag: 'green',
            remitente: 'cobranzas@uwiener.edu.pe',
            password: '••••••••',
            asunto: `CONFIRMACIÓN TRÁMITE ${(t.nombre || '').toUpperCase()}`,
            cc: 'registros@uwiener.edu.pe',
            contenido: `Estimado(a) estudiante:\n\nAgradecemos su atención y le informamos que el trámite de «${t.nombre || 'este trámite'}» se realizó con éxito. Recuerde que podrá verificar su constancia o estado a través del portal institucional.`,
            activo: true
          },
          {
            id: 'MAIL-' + (t.id || 'T') + '-2',
            tipoEstado: 'Rechazado',
            colorTag: 'red',
            remitente: 'cobranzas@uwiener.edu.pe',
            password: '••••••••',
            asunto: `NOTIFICACIÓN TRÁMITE ${(t.nombre || '').toUpperCase()}`,
            cc: 'registros@uwiener.edu.pe',
            contenido: `Estimado(a) estudiante:\n\nLe informamos que su trámite de «${t.nombre || 'este trámite'}» no ha cumplido con los requisitos necesarios y fue RECHAZADO. Ingrese a la plataforma para conocer las observaciones correspondientes.`,
            activo: true
          },
          {
            id: 'MAIL-' + (t.id || 'T') + '-3',
            tipoEstado: 'Observado',
            colorTag: 'amber',
            remitente: 'cobranzas@uwiener.edu.pe',
            password: '••••••••',
            asunto: `OBSERVACIÓN TRÁMITE ${(t.nombre || '').toUpperCase()}`,
            cc: 'registros@uwiener.edu.pe',
            contenido: `Estimado(a) estudiante:\n\nSu trámite de «${t.nombre || 'este trámite'}» cuenta con observaciones pendientes. Por favor ingrese a su intranet para regularizar la documentación requerida dentro del plazo establecido.`,
            activo: true
          }
        ];
      }
      if (Array.isArray(t.correos)) {
        const defaultColors = {
          'Aprobado': 'green',
          'Rechazado': 'red',
          'Observado': 'amber',
          'En revisión': 'blue',
          'Pendiente de pago': 'purple',
          'Finalizado': 'teal'
        };
        t.correos.forEach(c => {
          if (!c.colorTag) {
            c.colorTag = defaultColors[c.tipoEstado] || 'teal';
          }
        });
      }
      if (t.envioCorreo === undefined) t.envioCorreo = true;
      if (!t.tipoActivacion) t.tipoActivacion = 'Permanente';
      if (t.requiereAprobacion === undefined) t.requiereAprobacion = true;
      if (!t.pagoMomento) t.pagoMomento = 'antes';
      t.costo = Number(t.costo) || 0;
      t.diasEntrega = t.diasEntrega !== undefined ? Number(t.diasEntrega) : (Number(t.plazoRecojoDias) || 3);
      t.plazoRecojoDias = t.diasEntrega;
      t.tiempoVigenciaHrs = Number(t.tiempoVigenciaHrs) || 48;
      if (!t.area) t.area = 'Registros Académicos';
      if (!t.observacion) t.observacion = '';
      if (!t.conceptoServicio) t.conceptoServicio = t.nombre || '';
      if (t.activo === undefined) t.activo = true;
      if (t.permiteEmisionMasiva === undefined) t.permiteEmisionMasiva = false;
      if (!t.plantilla) t.plantilla = {};
      if (t.plantilla.generaDocumento === undefined) {
        t.plantilla.generaDocumento = t.tipo !== 'Solicitud';
      }
      return t;
    }

    function esTramiteConDocumento(t) {
      if (!t) return false;
      const pl = t.plantilla || {};
      if (pl.generaDocumento !== undefined) return Boolean(pl.generaDocumento);
      return t.tipo !== 'Solicitud';
    }

    function setGeneraDocumento(val) {
      if (!CURRENT_T.plantilla) CURRENT_T.plantilla = {};
      CURRENT_T.plantilla.generaDocumento = Boolean(val);
      if (!val) {
        CURRENT_T.permiteEmisionMasiva = false;
      }
      renderStudioUI();
      APP.toast(val ? 'Se activó la emisión de documento oficial con firma digital.' : 'Trámite configurado como resolución administrativa sin documento descargable.', 'info');
    }

    function setEmisionMasiva(val) {
      CURRENT_T.permiteEmisionMasiva = Boolean(val);
      renderStudioUI();
      APP.toast(val ? 'Emisión masiva institucional habilitada.' : 'Emisión configurada únicamente para solicitud individual.', 'ok');
    }

    function crearTramiteDesdeReceta(recetaId, usarNombrePlantilla = true) {
      const rec = STUDIO_RECIPES.find(r => r.id === recetaId) || STUDIO_RECIPES[0];
      const d = JSON.parse(JSON.stringify(rec.datos));
      const nextNum = DB.tramites().length + 1;
      const t = Object.assign({
        id: null,
        codigo: 'T-0' + String(nextNum).padStart(2, '0'),
        nombre: usarNombrePlantilla ? (rec.id === 'en-blanco' ? '' : rec.titulo.toUpperCase()) : '',
        descripcion: rec.resumen,
        area: 'Registros Académicos',
        conceptoCodigo: d.costo > 0 ? '010100' + Math.floor(d.costo) : '00000000',
        conceptoServicio: rec.titulo.toUpperCase(),
        tiempoVigenciaHrs: 48,
        tipoActivacion: 'Permanente',
        envioCorreo: true,
        activo: true,
        audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, promedioMin: 0, tercioSuperior: false, quintoSuperior: false },
        requisitos: [],
        proceso: [],
        cronogramas: []
      }, d);
      return normalizarTramite(t);
    }

    function isDirty() {
      return JSON.stringify(CURRENT_T) !== ORIGINAL_JSON;
    }

    // =========================================================================
    // LÓGICA DE PROCESO & PASOS (TIMELINE)
    // =========================================================================
    function obtenerParadasTimeline() {
      const out = [{ k: 'sol', tipo: 'solicitud', titulo: 'El alumno solicita', icono: 'solicitud' }];
      const tienePago = CURRENT_T.costo > 0;
      const pagoAntes = CURRENT_T.pagoMomento === 'antes';
      const pagoTrasEtapa = CURRENT_T.pagoTrasEtapa || '';

      if (tienePago && pagoAntes) {
        out.push({ k: 'pago', tipo: 'pago', titulo: 'El alumno paga en línea', icono: 'pago' });
      }

      CURRENT_T.proceso.forEach((p, idx) => {
        out.push({
          k: 'rev_' + idx,
          tipo: 'revision',
          idx: idx,
          titulo: (p.area || 'Área Académica') + ' evalúa',
          subtitulo: (p.duracionDias || 1) + ' días hábiles · ' + (p.descripcion || 'Revisión reglamentaria'),
          icono: 'revision'
        });

        if (tienePago && !pagoAntes && pagoTrasEtapa === p.id) {
          out.push({ k: 'pago', tipo: 'pago', titulo: 'El alumno paga tras evaluación', icono: 'pago' });
        }
      });

      if (CURRENT_T.requiereAprobacion) {
        out.push({ k: 'apr', tipo: 'aprobacion', titulo: 'Aprobación y Firma Oficial', subtitulo: CURRENT_T.area || 'Registros Académicos', icono: 'aprobacion' });
      }

      if (tienePago && !pagoAntes && !pagoTrasEtapa && !CURRENT_T.proceso.some(p => p.id === pagoTrasEtapa)) {
        out.push({ k: 'pago', tipo: 'pago', titulo: 'El alumno paga arancel final', icono: 'pago' });
      }

      const esDoc = esTramiteConDocumento(CURRENT_T);
      out.push({
        k: 'ent',
        tipo: 'entrega',
        titulo: esDoc ? (CURRENT_T.diasEntrega === 0 ? 'Emisión Digital Inmediata' : 'Entrega del Documento Oficial') : 'Respuesta al Estudiante y Cierre',
        subtitulo: esDoc ? (CURRENT_T.diasEntrega === 0 ? 'Descarga instantánea con QR de verificación' : 'Plazo estimado: ' + CURRENT_T.diasEntrega + ' días hábiles') : 'Notificación por correo institucional y estado en portal',
        icono: 'entrega'
      });

      return out;
    }

    function generarFraseResumen() {
      const t = CURRENT_T;
      const partes = [];
      const numReq = (t.requisitos || []).filter(r => r.activo !== false).length;

      partes.push('solicita ' + (numReq > 0 ? 'con ' + numReq + ' requisito' + (numReq > 1 ? 's' : '') : 'sin requisitos previos'));

      if (t.costo > 0 && t.pagoMomento === 'antes') {
        partes.push('paga ' + APP.money(t.costo) + ' vía Niubiz');
      }

      const areas = (t.proceso || []).filter(p => p.activo !== false).map(p => p.area || 'Área');
      if (areas.length > 0) {
        partes.push('espera la revisión de ' + (areas.length > 1 ? areas.slice(0, -1).join(', ') + ' y ' + areas[areas.length - 1] : areas[0]));
      }

      if (t.costo > 0 && t.pagoMomento === 'despues') {
        partes.push('abona ' + APP.money(t.costo) + ' tras aprobación');
      }

      const esDoc = esTramiteConDocumento(t);
      if (esDoc) {
        if (t.diasEntrega === 0) {
          partes.push('recibe su constancia al instante' + (t.permiteEmisionMasiva ? ' (con emisión masiva habilitada)' : ''));
        } else {
          partes.push('recibe su documento en ' + t.diasEntrega + ' días hábiles' + (t.permiteEmisionMasiva ? ' (o emisión en lote)' : ''));
        }
      } else {
        partes.push('recibe la respuesta administrativa en ' + (t.diasEntrega === 0 ? 'tiempo real' : t.diasEntrega + ' días hábiles'));
      }

      return 'El alumno ' + partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1] + '.';
    }

    // =========================================================================
    // MOTOR DE DIAGNÓSTICO / CONTROL DE CALIDAD (PREFLIGHT CHECK)
    // =========================================================================
    function diagnosticoPreflight() {
      const t = CURRENT_T;
      const issues = [];

      if (!t.nombre || t.nombre.trim().length < 5) {
        issues.push({ tipo: 'error', campo: 'nombre', tab: 'flujo', msg: 'El nombre del trámite es obligatorio y debe ser descriptivo.' });
      }
      if (!t.descripcion || t.descripcion.trim().length < 10) {
        issues.push({ tipo: 'aviso', campo: 'descripcion', tab: 'flujo', msg: 'La descripción es muy breve; conviene orientar al alumno sobre el propósito del trámite.' });
      }
      if (t.costo > 0 && (!t.conceptoCodigo || t.conceptoCodigo === '00000000')) {
        issues.push({ tipo: 'error', campo: 'conceptoCodigo', tab: 'flujo', msg: 'El trámite tiene costo arancelario pero no tiene vinculado un código de concepto de Caja/Niubiz.' });
      }
      if (t.proceso.length === 0 && t.diasEntrega > 0) {
        issues.push({ tipo: 'aviso', campo: 'proceso', tab: 'flujo', msg: 'No hay áreas de revisión asignadas. Si el trámite no requiere evaluación, marque entrega inmediata (0 días).' });
      }

      const totalDiasAreas = (t.proceso || []).reduce((acc, p) => acc + (Number(p.duracionDias) || 0), 0);
      if (totalDiasAreas > t.diasEntrega && t.diasEntrega > 0) {
        issues.push({ tipo: 'aviso', campo: 'diasEntrega', tab: 'flujo', msg: 'La suma de días de las áreas (' + totalDiasAreas + ' días) supera los días de entrega prometidos al alumno (' + t.diasEntrega + ' días).' });
      }

      const plant = DOC.getPlantilla(t);
      const esDoc = esTramiteConDocumento(t);
      if (esDoc && (!plant.cuerpo || plant.cuerpo.trim().length < 20)) {
        issues.push({ tipo: 'error', campo: 'plantilla', tab: 'documento', msg: 'El cuerpo de la plantilla oficial de emisión está vacío.' });
      }
      if (t.permiteEmisionMasiva && !esDoc) {
        issues.push({ tipo: 'aviso', campo: 'permiteEmisionMasiva', tab: 'documento', msg: 'La emisión masiva está habilitada pero el trámite está configurado sin emisión de documento.' });
      }
      if (t.tipoActivacion === 'Cronograma' && (!t.cronogramas || !t.cronogramas.some(c => c.activo !== false))) {
        issues.push({ tipo: 'aviso', campo: 'cronograma', tab: 'cronograma', msg: 'El trámite está configurado por cronograma pero no tiene ningún rango activo en la pestaña Cronograma.' });
      }
      if (t.observacion && t.observacion.length > 500) {
        issues.push({ tipo: 'error', campo: 'observacion', tab: 'flujo', msg: 'La observación institucional supera el límite de 500 caracteres.' });
      }

      return issues;
    }

    // =========================================================================
    // RENDERIZADO PRINCIPAL DE LA VISTA EN CTX.MOUNT
    // =========================================================================
    function renderStudioUI() {
      const mount = ctx && ctx.mount ? ctx.mount : document.getElementById('page-content');
      if (!mount) return;

      // Preservar la posición de scroll horizontal de la barra de navegación de pestañas
      const prevNavInner = document.querySelector('.studio-nav-inner');
      const prevScrollLeft = prevNavInner ? prevNavInner.scrollLeft : 0;

      const t = CURRENT_T;
      const paradas = obtenerParadasTimeline();
      const frase = generarFraseResumen();
      const issues = diagnosticoPreflight();
      const errCount = issues.filter(i => i.tipo === 'error').length;

      mount.innerHTML = `
        <!-- Barra Superior de Retorno (Fuera de la tarjeta de configuración) -->
        <div class="studio-top-nav-bar">
          <a href="tramites.html" class="studio-back-btn" onclick="return verificarSalirSinGuardar(event)">
            ${SVG_ICONS.backArrow}
            <span>Volver a Catálogo de Trámites</span>
          </a>
        </div>

        <!-- Top Studio Header Wrap - Barra de Configuración Unificada (Opción A: 2 Filas Jerárquicas) -->
        <div class="studio-header-wrap">
          <!-- Fila 1: Identificación del Trámite y Estado de Publicación -->
          <div class="studio-header-top-row">
            <!-- Bloque Izquierdo: Nombre del Trámite y Código Institucional -->
            <div class="studio-header-field-col flex-1">
              <label class="studio-field-label" for="studio-title-field">Nombre del Trámite Institucional:</label>
              <div class="studio-title-input-wrap">
                <input type="text" class="studio-title-input" id="studio-title-field" value="${E(t.nombre)}" placeholder="Ej. Certificado de Estudios Oficial..." oninput="actualizarTitulo(this.value)" title="Haga clic para editar el nombre público visible para los estudiantes">
                <span class="studio-code-chip" title="Código oficial del trámite">${E(t.codigo || 'T-NUEVO')}</span>
              </div>
            </div>

            <!-- Bloque Derecho: Control Interactivo de Publicación (Segmented Switch) -->
            <div class="studio-header-field-col">
              <label class="studio-field-label">Estado de Publicación en Catálogo:</label>
              <div class="studio-state-segmented" role="radiogroup" aria-label="Estado de publicación en catálogo">
                <button type="button" class="studio-seg-btn ${!t.activo ? 'selected draft' : ''}" onclick="cambiarEstadoActivo(false)" title="Solo visible para administradores. Oculto para estudiantes.">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                  <span>Borrador (Oculto)</span>
                </button>
                <button type="button" class="studio-seg-btn ${t.activo ? 'selected active' : ''}" onclick="cambiarEstadoActivo(true)" title="Visible para que los estudiantes puedan solicitarlo en el portal.">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Activo en Catálogo</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Fila 2: Selector de Trámite en Edición y Herramientas / Acciones -->
          <div class="studio-header-bottom-row">
            <!-- Selector Rápido de Trámite Existente Personalizado Wiener -->
            <div class="studio-header-field-col">
              <label class="studio-field-label" for="studio-select-tramite">Trámite en Edición:</label>
              <div class="custom-select-container">
                <select id="studio-select-tramite" onchange="cambiarTramiteEnEdicion(this.value)">
                  <option value="">+ Crear Nuevo Trámite</option>
                  ${DB.tramites().map(item => `
                    <option value="${item.id}" ${t.id === item.id ? 'selected' : ''}>${item.codigo || item.id} - ${E(item.nombre.length > 28 ? item.nombre.substring(0, 27) + '…' : item.nombre)}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Bloque de Diagnóstico, Simulación y Guardado -->
            <div class="studio-header-field-col studio-actions-col">
              <label class="studio-field-label" style="text-align:right">Control de Calidad y Acciones:</label>
              <div class="studio-bottom-actions">
                <!-- Botón Preflight Diagnostics -->
                <button type="button" class="preflight-pill-btn ${errCount > 0 ? 'has-errors' : 'is-valid'}" onclick="abrirPreflightModal()" title="Control de Calidad: Ver diagnóstico del trámite">
                  ${errCount > 0 ? SVG_ICONS.warning : SVG_ICONS.checkCircle}
                  <span>${errCount > 0 ? `${errCount} Observación${errCount > 1 ? 'es' : ''}` : `Trámite Válido`}</span>
                </button>

                <!-- Botón Digital Twin Simulator -->
                <button type="button" class="btn-studio-secondary" onclick="toggleSimulador(true)" title="Ver cómo experimenta este trámite el estudiante">
                  ${SVG_ICONS.eye}
                  <span>Simular Alumno</span>
                </button>

                <!-- Divisor Vertical -->
                <div class="studio-actions-divider" aria-hidden="true"></div>

                <!-- Botón Guardar Trámite -->
                <button type="button" class="btn-studio-primary" onclick="guardarTramiteStudio()" title="Guardar todos los cambios del trámite">
                  ${SVG_ICONS.save}
                  <span>Guardar Trámite</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Summary Sentence Banner -->
        <div class="studio-summary-bar">
          <div class="studio-summary-content">
            <div class="studio-summary-text">
              <b>Síntesis del Flujo:</b> <span id="studio-live-frase">${E(frase)}</span>
            </div>
            <div class="studio-summary-pill" title="Plazo máximo de resolución y entrega comprometido con el estudiante">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.9"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Plazo de Atención Prometido:</span>
              <b>${t.diasEntrega === 0 ? 'Entrega Inmediata' : t.diasEntrega + (t.diasEntrega === 1 ? ' día hábil' : ' días hábiles')}</b>
            </div>
          </div>
        </div>

        <!-- Studio Main Navigation Tabs con Iconos SVG -->
        <nav class="studio-nav-bar">
          <div class="studio-nav-inner">
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'flujo' ? 'active' : ''}" onclick="cambiarTab('flujo')">
              ${SVG_ICONS.flujo}
              <span>1. Flujo & Proceso</span>
              <span class="tab-count">${paradas.length} pasos</span>
            </button>
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'requisitos' ? 'active' : ''}" onclick="cambiarTab('requisitos')">
              ${SVG_ICONS.requisitos}
              <span>2. Requisitos</span>
              <span class="tab-count">${(t.requisitos || []).length}</span>
            </button>
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'audiencia' ? 'active' : ''}" onclick="cambiarTab('audiencia')">
              ${SVG_ICONS.audiencia}
              <span>3. Audiencia & Elegibilidad</span>
              <span class="tab-count">${(t.audiencia.niveles || []).length} niv</span>
            </button>
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'documento' ? 'active' : ''}" onclick="cambiarTab('documento')">
              ${SVG_ICONS.documento}
              <span>4. Documento & Certificación</span>
              <span class="tab-count" style="${!esTramiteConDocumento(t) ? 'background:#E2E8F0;color:#64748B' : ''}">${!esTramiteConDocumento(t) ? 'No aplica' : t.tipo}</span>
            </button>
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'notificaciones' ? 'active' : ''}" onclick="cambiarTab('notificaciones')">
              ${SVG_ICONS.notificaciones}
              <span>5. Notificaciones</span>
              <span class="tab-count">${(t.correos || []).length} plantillas</span>
            </button>
            <button type="button" class="studio-tab-btn ${ACTIVE_TAB === 'cronograma' ? 'active' : ''}" onclick="cambiarTab('cronograma')">
              ${SVG_ICONS.cronograma}
              <span>6. Cronograma</span>
              <span class="tab-count">${(t.cronogramas || []).length} rangos</span>
            </button>
          </div>
        </nav>

        <!-- Contenedor Principal de la Pestaña Activa -->
        <div class="studio-content-body">
          <!-- TAB 1: FLUJO & PROCESO -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'flujo' ? 'active' : ''}" id="panel-tab-flujo">
            <div class="studio-split">
              <!-- Columna Izquierda: Timeline Visual -->
              <div class="timeline-card">
                <div class="timeline-header">
                  <h3>
                    ${SVG_ICONS.flujo}
                    <span>Línea de Proceso del Estudiante</span>
                  </h3>
                  <button type="button" class="btn-studio-secondary" style="height:32px;padding:0 10px;font-size:12px" onclick="abrirSelectorRecetas()">
                    ${SVG_ICONS.recipe}
                    <span>Cambiar Plantilla Base</span>
                  </button>
                </div>

                <ul class="timeline-tree">
                  ${renderTimelineNodesHTML(paradas)}
                </ul>

                <div style="margin-top:20px;padding-top:14px;border-top:1px dashed var(--border-soft);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
                  <span style="font-size:12.5px;color:var(--text-muted)">Haz clic en cualquier paso para editar sus propiedades.</span>
                  <button type="button" class="btn-studio-secondary" style="height:34px;padding:0 12px;font-size:12.5px" onclick="agregarAreaAlFinal()">
                    ${SVG_ICONS.plus}
                    <span>Agregar Área de Revisión</span>
                  </button>
                </div>
              </div>

              <!-- Columna Derecha: Inspector Contextual -->
              <div class="inspector-card" id="studio-inspector-slot">
                ${renderInspectorPanelHTML()}
              </div>
            </div>
          </section>

          <!-- TAB 2: REQUISITOS -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'requisitos' ? 'active' : ''}" id="panel-tab-requisitos">
            ${renderRequisitosTabHTML()}
          </section>

          <!-- TAB 3: AUDIENCIA -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'audiencia' ? 'active' : ''}" id="panel-tab-audiencia">
            ${renderAudienciaTabHTML()}
          </section>

          <!-- TAB 4: DOCUMENTO & CERTIFICACIÓN -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'documento' ? 'active' : ''}" id="panel-tab-documento">
            ${renderDocumentoTabHTML()}
          </section>

          <!-- TAB 5: NOTIFICACIONES -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'notificaciones' ? 'active' : ''}" id="panel-tab-notificaciones">
            ${renderNotificacionesTabHTML()}
          </section>

          <!-- TAB 6: CRONOGRAMA -->
          <section class="studio-tab-panel ${ACTIVE_TAB === 'cronograma' ? 'active' : ''}" id="panel-tab-cronograma">
            ${renderCronogramaTabHTML()}
          </section>
        </div>

        <!-- SIMULADOR DIGITAL TWIN (DRAWER LATERAL) -->
        <div class="simulator-overlay ${SIMULATOR_OPEN ? 'open' : ''}" id="studio-simulator-drawer">
          ${renderSimulatorContentHTML()}
        </div>
      `;

      // Centrar suavemente la pestaña activa en la barra de navegación (especialmente en móviles)
      const newNavInner = document.querySelector('.studio-nav-inner');
      if (newNavInner) {
        newNavInner.scrollLeft = prevScrollLeft;
        const activeTabBtn = newNavInner.querySelector('.studio-tab-btn.active');
        if (activeTabBtn) {
          activeTabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      // Hidratar automáticamente todos los selects personalizados Wiener en toda la vista
      if (window.APP && window.APP.initCustomSelects) {
        window.APP.initCustomSelects(mount);
      }

      // Hidratar automáticamente todos los datepickers personalizados Wiener en toda la vista (reutilizando js/shell.js)
      if (window.APP && window.APP.initDatePickers) {
        window.APP.initDatePickers(mount);
      }

      // Si está en el tab de documento, actualizar el canvas oficial
      if (ACTIVE_TAB === 'documento') {
        setTimeout(dibujarCanvasModelo, 50);
      }
    }

    // =========================================================================
    // RENDERS DE SECCIONES ESPECÍFICAS
    // =========================================================================
    function renderTimelineNodesHTML(paradas) {
      const tienePago = (Number(CURRENT_T.costo) || 0) > 0;
      const pagoAntes = tienePago && CURRENT_T.pagoMomento === 'antes';
      let html = '';

      paradas.forEach((s) => {
        const isSelected = SELECTED_STEP_KEY === s.k;
        const iconSvg = SVG_ICONS[s.icono] || SVG_ICONS.solicitud;
        const isRevision = s.tipo === 'revision';

        // Lógica precisa para el botón (+): solo se muestra donde cronológicamente tiene sentido insertar revisiones
        let mostrarGap = false;
        let posInsercion = 0;

        if (s.tipo === 'solicitud') {
          // Si el pago es previo (antes de revisión), la solicitud conecta directo con el pago (NO hay botón [+] aquí).
          // Si no hay pago previo, la primera revisión se inserta directamente aquí (pos = 0).
          if (!pagoAntes) {
            mostrarGap = true;
            posInsercion = 0;
          }
        } else if (s.tipo === 'pago') {
          // Si el pago es previo, el botón [+] debe ir justo debajo del pago (pos = 0) para iniciar la primera revisión.
          if (pagoAntes) {
            mostrarGap = true;
            posInsercion = 0;
          }
        } else if (s.tipo === 'revision') {
          // Debajo de cada revisión se puede insertar otra etapa intermedia (pos = s.idx + 1).
          mostrarGap = true;
          posInsercion = s.idx + 1;
        }

        // Atributos Drag & Drop exclusivos para etapas de revisión dinámica
        const dragAttrs = isRevision ? `
          draggable="true"
          data-drag-idx="${s.idx}"
          ondragstart="onRevisionDragStart(event, ${s.idx})"
          ondragover="onRevisionDragOver(event, ${s.idx})"
          ondragleave="onRevisionDragLeave(event, ${s.idx})"
          ondrop="onRevisionDrop(event, ${s.idx})"
          ondragend="onRevisionDragEnd(event)"
        ` : '';

        // Icono de arrastre: sin color de fondo, solo las líneas verticales en gris claro (#94A3B8)
        const dragHandleHtml = isRevision ? `
          <div class="node-drag-handle" title="Arrastrar para reordenar etapa" aria-label="Reordenar etapa">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round">
              <line x1="3" y1="3" x2="3" y2="15"></line>
              <line x1="7" y1="3" x2="7" y2="15"></line>
            </svg>
          </div>
        ` : '';

        html += `
          <li class="timeline-item">
            <div class="timeline-node-card node-type-${s.tipo} ${isSelected ? 'selected' : ''}" 
                 onclick="seleccionarPaso('${s.k}')" 
                 ${dragAttrs}>
              ${dragHandleHtml}
              <div class="node-icon-circle">${iconSvg}</div>
              <div class="node-text-box">
                <h4>${E(s.titulo)}</h4>
                <p>${E(s.subtitulo || obtenerSubtituloPorDefecto(s))}</p>
              </div>
              <div class="node-badges">
                ${s.tipo === 'pago' ? `<span class="node-badge-chip pago">${APP.money(CURRENT_T.costo)}</span>` : ''}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--text-muted)"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>

            ${mostrarGap ? `
              <div class="timeline-gap">
                <button type="button" class="btn-gap-add" title="Insertar revisión de área aquí" onclick="insertarPasoIntermedio(${posInsercion})">
                  ${SVG_ICONS.plus}
                </button>
                <span class="gap-hint" onclick="insertarPasoIntermedio(${posInsercion})">Insertar revisión de área aquí</span>
              </div>
            ` : ''}
          </li>
        `;
      });
      return html;
    }

    function obtenerSubtituloPorDefecto(s) {
      const t = CURRENT_T;
      if (s.tipo === 'solicitud') {
        const reqs = (t.requisitos || []).filter(r => r.activo !== false);
        return reqs.length ? reqs.length + ' requisito(s) adjunto(s)' : '100% digital, sin adjuntos';
      }
      if (s.tipo === 'pago') {
        return t.pagoMomento === 'antes' ? 'Al registrar la solicitud (antes de revisión)' : 'Tras aprobación favorable';
      }
      if (s.tipo === 'aprobacion') {
        return 'Revisión y firma institucional';
      }
      return '';
    }

    // =========================================================================
    // INSPECTOR CONTEXTUAL SEGÚN EL PASO SELECCIONADO (Custom Selects Wiener)
    // =========================================================================
    function renderInspectorPanelHTML() {
      const t = CURRENT_T;
      const k = SELECTED_STEP_KEY;

      if (k === 'sol') {
        const esDoc = esTramiteConDocumento(t);
        return `
          <div class="inspector-header">
            <h3>
              ${SVG_ICONS.solicitud}
              <span>Paso 1: Solicitud del Alumno</span>
            </h3>
          </div>

          <div class="inspector-form-group">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <label style="margin:0;font-weight:700">Descripción del trámite para el alumno:</label>
              <span class="muted" style="font-size:11px">Formato enriquecido HTML</span>
            </div>
            <div class="rte-box">
              <div class="rte-bar">
                <button type="button" class="rte-tool-btn" title="Negrita" onclick="rteCommand('inspector-desc-field','bold')"><b>B</b></button>
                <button type="button" class="rte-tool-btn" title="Cursiva" onclick="rteCommand('inspector-desc-field','italic')"><i>I</i></button>
                <button type="button" class="rte-tool-btn" title="Subrayado" onclick="rteCommand('inspector-desc-field','underline')"><u>U</u></button>
                <button type="button" class="rte-tool-btn" title="Tachado" onclick="rteCommand('inspector-desc-field','strike')"><s>S</s></button>
                <span style="width:1px;height:16px;background:#CBD5E1;margin:0 4px"></span>
                <button type="button" class="rte-tool-btn" title="Lista con viñetas" onclick="rteCommand('inspector-desc-field','list-ul')">•≡</button>
                <button type="button" class="rte-tool-btn" title="Lista numerada" onclick="rteCommand('inspector-desc-field','list-ol')">1≡</button>
                <button type="button" class="rte-tool-btn" title="Enlace" onclick="rteCommand('inspector-desc-field','link')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
              </div>
              <textarea class="rte-editor-area" id="inspector-desc-field" rows="4" placeholder="Explique con claridad el alcance, requisitos y propósito de este trámite..." onchange="actualizarCampo('descripcion', this.value)">${E(t.descripcion || '')}</textarea>
            </div>
          </div>

          <div class="inspector-form-group">
            <label>Tipo de Documento / Trámite:</label>
            <div class="custom-select-container">
              <select id="sel-tipo-doc" onchange="actualizarCampo('tipo', this.value); actualizarCampo('modelo', this.value.toLowerCase()); setGeneraDocumento(this.value !== 'Solicitud');">
                <option value="Constancia" ${t.tipo === 'Constancia' ? 'selected' : ''}>Constancia Académica</option>
                <option value="Certificado" ${t.tipo === 'Certificado' ? 'selected' : ''}>Certificado Oficial</option>
                <option value="Solicitud" ${t.tipo === 'Solicitud' ? 'selected' : ''}>Solicitud General / Trámite Administrativo</option>
              </select>
            </div>
          </div>

          <!-- Selector explícito de emisión de documento -->
          <div class="inspector-form-group" style="margin-top:14px;padding:12px;background:#F8FAFC;border:1px solid var(--border-soft);border-radius:8px">
            <label style="font-size:12.5px;font-weight:700;color:var(--brand-dark);margin-bottom:4px;display:block">¿Emite Documento Oficial Descargable?</label>
            <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:10px;line-height:1.35">
              Si se desactiva, el trámite finaliza con resolución y notificación al estudiante, sin generar constancia ni certificado con QR.
            </div>
            <div class="studio-state-segmented" style="height:32px">
              <button type="button" class="studio-seg-btn ${!esDoc ? 'selected draft' : ''}" style="font-size:12px" onclick="setGeneraDocumento(false)" title="Finaliza con resolución administrativa sin documento">
                <span>No emite documento</span>
              </button>
              <button type="button" class="studio-seg-btn ${esDoc ? 'selected active' : ''}" style="font-size:12px" onclick="setGeneraDocumento(true)" title="Genera constancia o certificado oficial con firma y QR">
                <span>Sí, emite documento</span>
              </button>
            </div>
          </div>

          <!-- Desplegable de Opciones Institucionales y Avanzadas -->
          <details class="studio-advanced-box" ${t.observacion || t.tipoActivacion === 'Cronograma' ? 'open' : ''}>
            <summary>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Opciones Institucionales y Avanzadas</span>
            </summary>
            <div class="studio-advanced-content">
              <!-- Área Responsable Principal -->
              <div class="inspector-form-group" style="margin:0">
                <label>Área Responsable Principal:</label>
                <div class="custom-select-container">
                  <select onchange="actualizarCampo('area', this.value)">
                    ${(DB.areas() || []).map(a => `<option value="${E(a.nombre)}" ${t.area === a.nombre ? 'selected' : ''}>${E(a.nombre)}</option>`).join('')}
                  </select>
                </div>
                <small style="color:var(--text-muted);font-size:11.5px;margin-top:3px;display:block">Área institucional dueña de la gestión de este trámite.</small>
              </div>

              <!-- Tipo de Activación -->
              <div class="inspector-form-group" style="margin:0">
                <label>Tipo de Activación:</label>
                <div class="studio-state-segmented" style="height:32px;margin-top:2px">
                  <button type="button" class="studio-seg-btn ${t.tipoActivacion !== 'Cronograma' ? 'selected active' : ''}" style="font-size:12px;display:inline-flex;align-items:center;gap:6px" onclick="cambiarTipoActivacionStudio('Permanente')">
                    ${SVG_ICONS.check} <span>Permanente (Todo el año)</span>
                  </button>
                  <button type="button" class="studio-seg-btn ${t.tipoActivacion === 'Cronograma' ? 'selected active' : ''}" style="font-size:12px;display:inline-flex;align-items:center;gap:6px" onclick="cambiarTipoActivacionStudio('Cronograma')">
                    ${SVG_ICONS.warning} <span>Por Cronograma</span>
                  </button>
                </div>
                ${t.tipoActivacion === 'Cronograma' ? `
                  <div style="margin-top:6px;font-size:11.5px;color:var(--brand-dark);display:flex;align-items:center;justify-content:space-between">
                    <span>${(t.cronogramas || []).length} rango(s) en cronograma.</span>
                    <button type="button" class="btn-studio-secondary" style="height:24px;padding:0 8px;font-size:11px" onclick="cambiarTab('cronograma')">Ir a Cronograma →</button>
                  </div>
                ` : ''}
              </div>

              <!-- Observación Institucional -->
              <div class="inspector-form-group" style="margin:0">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                  <label style="margin:0">Observación Institucional:</label>
                  <span style="font-size:11px;color:var(--text-muted)" id="lbl-obs-len">${(t.observacion || '').length} / 500</span>
                </div>
                <textarea class="inspector-textarea" rows="2" maxlength="500" placeholder="Notas internas para administración o reportes institucionales..." oninput="updateCharCounter('lbl-obs-len', this.value.length, 500)" onchange="actualizarCampo('observacion', this.value)">${E(t.observacion || '')}</textarea>
              </div>

              <!-- Plazo y Vigencia General -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:11.5px">Vigencia (Horas):</label>
                  <input type="number" min="1" class="inspector-input" value="${t.tiempoVigenciaHrs || 48}" onchange="actualizarCampo('tiempoVigenciaHrs', Number(this.value))">
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:11.5px">Plazo Entrega (Días):</label>
                  <input type="number" min="0" class="inspector-input" value="${t.diasEntrega || 3}" onchange="actualizarCampo('diasEntrega', Number(this.value)); actualizarCampo('plazoRecojoDias', Number(this.value))">
                </div>
              </div>
            </div>
          </details>

          <div style="background:var(--brand-soft);border:1px solid var(--border-soft);border-radius:8px;padding:12px;margin-top:14px">
            <div style="font-size:12.5px;color:var(--brand-dark);font-weight:700">Requisitos asociados (${(t.requisitos || []).length}):</div>
            <div style="font-size:12px;color:var(--text-muted);margin:4px 0 8px">Puedes agregar DNI, solicitudes, pagos o certificados específicos.</div>
            <button type="button" class="btn-studio-secondary" style="width:100%;justify-content:center" onclick="cambiarTab('requisitos')">
              Configurar Requisitos Detallados →
            </button>
          </div>
        `;
      }

      if (k === 'pago') {
        const conceptos = DB.conceptos() || [];
        return `
          <div class="inspector-header">
            <h3>
              ${SVG_ICONS.pago}
              <span>Configuración de Pago y Arancel</span>
            </h3>
          </div>
          <div class="inspector-form-group">
            <label>Costo del Trámite en Soles (S/):</label>
            <input type="number" step="0.50" min="0" class="inspector-input" value="${t.costo}" onchange="actualizarCosto(this.value)">
            <small style="color:var(--text-muted);font-size:11.5px;display:block;margin-top:4px">Si ingresa S/ 0.00, el trámite se considerará sin costo arancelario.</small>
          </div>
          <div class="inspector-form-group">
            <label>¿En qué momento debe pagar el estudiante?</label>
            <div class="custom-select-container">
              <select id="sel-pago-momento" onchange="actualizarMomentoPago(this.value)">
                <option value="antes" ${t.pagoMomento === 'antes' ? 'selected' : ''}>Al solicitar (Pago previo obligatorio)</option>
                <option value="despues" ${t.pagoMomento === 'despues' ? 'selected' : ''}>Después de revisión favorable (Pago posterior)</option>
              </select>
            </div>
          </div>
          <div class="inspector-form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px">
              <label style="margin:0;font-weight:700">Concepto de Facturación / Caja Wiener:</label>
              <button type="button" class="btn-studio-secondary" style="height:28px;padding:0 10px;font-size:11.5px;font-weight:700;gap:6px" onclick="abrirModalCatalogoConceptos()" title="Explorar catálogo contable con buscador">
                ${SVG_ICONS.search} <span>Explorar Catálogo de Caja</span>
              </button>
            </div>
            ${t.conceptoCodigo ? `
              <div style="background:#F0FAFA;border:1.5px solid #BFE6E9;border-radius:8px;padding:10px 12px;margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
                  <span class="mono" style="font-weight:800;color:var(--brand-dark);font-size:12px;background:#E0F2FE;padding:2px 6px;border-radius:4px">${E(t.conceptoCodigo)}</span>
                  <b style="font-size:12.5px;color:var(--text);line-height:1.3">${E(t.conceptoServicio || 'Servicio contable')}</b>
                </div>
                <div style="font-size:11.5px;color:var(--text-muted)">Arancel contable oficial: <b>${APP.money(t.costo || 0)}</b></div>
              </div>
            ` : ''}
            <div class="custom-select-container">
              <select id="sel-concepto-caja" onchange="actualizarConceptoCaja(this.value)">
                <option value="">-- Seleccione concepto contable --</option>
                ${conceptos.map(c => `
                  <option value="${c.codigo}" ${t.conceptoCodigo === c.codigo ? 'selected' : ''}>${c.codigo} - ${c.servicio || c.descripcion} (${APP.money(c.monto)})</option>
                `).join('')}
              </select>
            </div>
          </div>
        `;
      }

      if (k.startsWith('rev_')) {
        const idx = Number(k.split('_')[1]);
        const p = t.proceso[idx];
        if (!p) return '<p>Etapa no encontrada.</p>';
        const areas = DB.areas() || [];

        return `
          <div class="inspector-header">
            <h3>
              ${SVG_ICONS.revision}
              <span>Revisión de Área (Etapa ${idx + 1})</span>
            </h3>
            <button type="button" class="btn-studio-secondary" style="color:var(--err-fg);padding:0 8px;font-size:11px;height:28px" onclick="eliminarArea(${idx})">Eliminar Etapa</button>
          </div>
          <div class="inspector-form-group">
            <label>Área Responsable de la Revisión:</label>
            <div class="custom-select-container">
              <select id="sel-area-revision" onchange="actualizarEtapa(${idx}, 'area', this.value)">
                ${areas.map(a => `<option value="${E(a.nombre)}" ${p.area === a.nombre ? 'selected' : ''}>${E(a.nombre)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="inspector-form-group">
            <label>Plazo Máximo de Atención (Días Hábiles):</label>
            <input type="number" min="1" max="30" class="inspector-input" value="${p.duracionDias || 1}" onchange="actualizarEtapa(${idx}, 'duracionDias', Number(this.value))">
          </div>
          <div class="inspector-form-group">
            <label>Instrucciones o Tarea para el Evaluador:</label>
            <textarea class="inspector-textarea" rows="3" placeholder="Ej. Validar notas, actas y antecedentes disciplinarios..." onchange="actualizarEtapa(${idx}, 'descripcion', this.value)">${E(p.descripcion || '')}</textarea>
          </div>
          <div class="inspector-form-group">
            <label>Observación de la Etapa:</label>
            <textarea class="inspector-textarea" rows="2" maxlength="500" placeholder="Criterios o normativas institucionales específicas para esta área..." onchange="actualizarEtapa(${idx}, 'observacion', this.value)">${E(p.observacion || '')}</textarea>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#F8FAFC;border:1px solid var(--border-soft);border-radius:8px">
            <span style="font-size:12px;font-weight:600;color:var(--text)">Estado de la Etapa:</span>
            <label class="studio-checkbox-inline" style="cursor:pointer">
              <input type="checkbox" ${p.activo !== false ? 'checked' : ''} onchange="actualizarEtapa(${idx}, 'activo', this.checked)">
              <span>Etapa Activa</span>
            </label>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button type="button" class="btn-studio-secondary" style="flex:1;height:34px;justify-content:center" onclick="moverArea(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>↑ Mover antes</button>
            <button type="button" class="btn-studio-secondary" style="flex:1;height:34px;justify-content:center" onclick="moverArea(${idx}, 1)" ${idx === t.proceso.length - 1 ? 'disabled' : ''}>↓ Mover después</button>
          </div>
        `;
      }

      if (k === 'apr') {
        return `
          <div class="inspector-header">
            <h3>
              ${SVG_ICONS.aprobacion}
              <span>Aprobación y Firma Final</span>
            </h3>
          </div>
          <div class="inspector-form-group">
            <label>¿Requiere firma/aprobación final de un área?</label>
            <div class="custom-select-container">
              <select id="sel-req-aprobacion" onchange="actualizarCampo('requiereAprobacion', this.value === 'true')">
                <option value="true" ${t.requiereAprobacion ? 'selected' : ''}>Sí, requiere aprobación formal</option>
                <option value="false" ${!t.requiereAprobacion ? 'selected' : ''}>No, pasa directo a entrega</option>
              </select>
            </div>
          </div>
          <div class="inspector-form-group">
            <label>Área firmante / emisora:</label>
            <div class="custom-select-container">
              <select id="sel-area-firmante" onchange="actualizarCampo('area', this.value)">
                ${(DB.areas() || []).map(a => `<option value="${E(a.nombre)}" ${t.area === a.nombre ? 'selected' : ''}>${E(a.nombre)}</option>`).join('')}
              </select>
            </div>
          </div>
        `;
      }

      if (k === 'ent') {
        const esDoc = esTramiteConDocumento(t);
        return `
          <div class="inspector-header">
            <h3>
              ${SVG_ICONS.entrega}
              <span>${esDoc ? 'Entrega y Emisión al Alumno' : 'Respuesta y Cierre de Trámite'}</span>
            </h3>
          </div>
          <div class="inspector-form-group">
            <label>${esDoc ? 'Días hábiles prometidos para la entrega:' : 'Plazo prometido para emitir respuesta:'}</label>
            <input type="number" min="0" max="60" class="inspector-input" value="${t.diasEntrega}" onchange="actualizarCampo('diasEntrega', Number(this.value))">
            <small style="color:var(--text-muted);font-size:11.5px;display:block;margin-top:4px">${esDoc ? (t.diasEntrega === 0 ? 'Entrega inmediata en línea con firma digital.' : 'El alumno podrá descargar el documento tras este plazo.') : 'El estudiante recibirá la notificación formal en este plazo.'}</small>
          </div>
          ${esDoc ? `
            <div class="inspector-form-group">
              <label>Tiempo de vigencia de la constancia emitida (Horas):</label>
              <input type="number" min="24" step="24" class="inspector-input" value="${t.tiempoVigenciaHrs || 48}" onchange="actualizarCampo('tiempoVigenciaHrs', Number(this.value))">
            </div>
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px;margin-top:14px">
              <b style="color:#166534;font-size:12.5px">Plantilla oficial con código de verificación QR:</b>
              <p style="margin:4px 0 8px;font-size:12px;color:#15803D">El documento se emite con firma digital y sello oficial de la Universidad Norbert Wiener.</p>
              <button type="button" class="btn-studio-secondary" style="width:100%;justify-content:center" onclick="cambiarTab('documento')">
                Editar Texto de la Plantilla →
              </button>
            </div>
            ${t.permiteEmisionMasiva ? `
              <div style="margin-top:10px;padding:8px 12px;background:#FAF5FF;border:1px solid #E9D5FF;border-radius:6px;font-size:12px;color:#6B21A8;display:flex;align-items:center;gap:6px">
                <span style="font-weight:700">🎁 Emisión Masiva:</span> Habilitado para generación en lote institucional.
              </div>
            ` : ''}
          ` : `
            <div style="background:#F8FAFC;border:1px solid var(--border-soft);border-radius:8px;padding:14px;margin-top:14px">
              <b style="color:var(--brand-dark);font-size:12.5px;display:block;margin-bottom:4px">Resolución Administrativa Final:</b>
              <p style="margin:0;font-size:12px;color:var(--text-muted);line-height:1.4">
                Este trámite concluye notificando al estudiante la decisión del área por correo institucional y actualizando su expediente en el portal, sin generar documento impreso ni descargable.
              </p>
            </div>
          `}
        `;
      }

      return '<p>Seleccione un paso para ver sus detalles.</p>';
    }

    // =========================================================================
    // TAB 2: REQUISITOS DEL ESTUDIANTE
    // =========================================================================
    function renderRequisitosTabHTML() {
      const t = CURRENT_T;
      const currentReqs = t.requisitos || [];

      return `
        <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border-soft);flex-wrap:wrap;gap:12px">
            <div>
              <h3 style="margin:0;font-family:'Lato',sans-serif;font-size:17px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
                ${SVG_ICONS.requisitos}
                <span>Requisitos del Trámite</span>
              </h3>
              <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted)">
                Documentos o condiciones que el estudiante debe presentar al iniciar la solicitud.
              </p>
            </div>
            <button type="button" class="btn-studio-primary" onclick="abrirModalCatalogoRequisitos()">
              ${SVG_ICONS.plus}
              <span>Agregar desde Catálogo Maestro</span>
            </button>
          </div>

          <div id="studio-reqs-list">
            ${currentReqs.length === 0 ? `
              <div style="text-align:center;padding:40px 20px;border:2px dashed var(--border-soft);border-radius:10px">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--surface-2);color:var(--text-muted);display:grid;place-items:center;margin:0 auto 10px">
                  ${SVG_ICONS.requisitos}
                </div>
                <b style="font-size:15px;color:var(--text)">Este trámite no exige requisitos previos</b>
                <p style="font-size:13px;color:var(--text-muted);max-width:400px;margin:6px auto 14px">
                  El alumno podrá solicitarlo de forma 100% digital sin adjuntar archivos adicionales.
                </p>
                <button type="button" class="btn-studio-secondary" onclick="abrirModalCatalogoRequisitos()">
                  ${SVG_ICONS.plus}
                  <span>Seleccionar requisitos del catálogo</span>
                </button>
              </div>
            ` : currentReqs.map((r, i) => {
        const allReqs = DB.requisitos() || [];
        const masterReq = allReqs.find(x => x.id === r.id) || {};
        const plantilla = r.plantillaDoc || masterReq.plantillaDoc;
        return `
              <div class="req-item-card" style="display:flex;flex-direction:column;gap:10px;padding:16px;background:#FFFFFF;border:1.5px solid var(--border-soft);border-radius:10px;margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;width:100%">
                  <div>
                    <div style="display:flex;align-items:center;gap:8px">
                      <span class="req-badge-type">${r.adjuntarArchivo ? 'Archivo Requerido' : 'Declaración'}</span>
                      <b style="font-size:14.5px;color:var(--text)">${E(r.titulo)}</b>
                    </div>
                    <p style="margin:4px 0 0;font-size:12.5px;color:var(--text-muted)">${E(r.condiciones || 'Presentación en formato digital PDF/JPG.')}</p>
                  </div>
                  <div style="display:flex;align-items:center;gap:10px">
                    <label class="studio-checkbox-inline" style="font-size:12.5px;cursor:pointer">
                      <input type="checkbox" ${r.activo !== false ? 'checked' : ''} onchange="toggleRequisitoActivo(${i}, this.checked)">
                      <span>Obligatorio</span>
                    </label>
                    <button type="button" class="btn-studio-secondary" style="color:var(--err-fg);padding:0 10px;font-size:12px;height:30px" onclick="quitarRequisito(${i})">
                      Quitar
                    </button>
                  </div>
                </div>

                <!-- Bloque de Formato / Plantilla descargable (Word, Excel o PDF) -->
                ${plantilla ? `
                  <div class="req-plantilla-box">
                    <div style="display:flex;align-items:center;gap:8px">
                      <span class="file-tag-badge ${plantilla.tipo.toLowerCase()}">${plantilla.tipo}</span>
                      <b style="font-size:13px;color:var(--text)">${E(plantilla.nombre)}</b>
                      <span style="font-size:11.5px;color:var(--text-muted)">(${E(plantilla.peso || '40 KB')})</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <button type="button" class="btn-studio-secondary" style="height:30px;padding:0 10px;font-size:12px;gap:5px" onclick="descargarPlantillaSimulada('${r.id}')">
                        ${SVG_ICONS.download} <span>Descargar plantilla</span>
                      </button>
                      <button type="button" class="btn-file-mini" onclick="abrirFileUploaderRequisito('${r.id}', 'tab')" title="Cambiar archivo plantilla (Word, Excel o PDF)">
                        ${SVG_ICONS.edit}
                      </button>
                      <button type="button" class="btn-file-mini danger" onclick="eliminarPlantillaRequisito('${r.id}', 'tab')" title="Quitar archivo adjunto">
                        ${SVG_ICONS.trash}
                      </button>
                    </div>
                  </div>
                ` : `
                  <div style="margin-top:2px">
                    <button type="button" class="btn-adjuntar-inline" onclick="abrirFileUploaderRequisito('${r.id}', 'tab')">
                      ${SVG_ICONS.paperclip} <span>Adjuntar formato / plantilla descargable (Word, Excel o PDF)</span>
                    </button>
                  </div>
                `}
              </div>
            `;
      }).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TAB 3: AUDIENCIA Y ELEGIBILIDAD
    // =========================================================================
    function renderAudienciaTabHTML() {
      const t = CURRENT_T;
      const a = t.audiencia || {};
      const NIVELES = ['pregrado', 'posgrado', 'formacion-continua', 'segunda-especialidad'];
      const CICLOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      return `
        <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
          <div style="margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border-soft)">
            <h3 style="margin:0;font-family:'Lato',sans-serif;font-size:17px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
              ${SVG_ICONS.audiencia}
              <span>Público y Reglas de Elegibilidad</span>
            </h3>
            <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted)">
              Define qué estudiantes pueden visualizar y solicitar este trámite en su portal.
            </p>
          </div>

          <div class="audiencia-grid">
            <!-- Nivel Académico -->
            <div style="background:#F8FAFC;border:1px solid var(--border-soft);border-radius:10px;padding:16px;display:flex;flex-direction:column;min-width:0">
              <label style="font-weight:700;font-size:13px;display:block;margin-bottom:12px;color:var(--brand-dark)">Nivel Académico Habilitado:</label>
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                ${NIVELES.map(n => `
                  <label class="chip-check ${(a.niveles || []).includes(n) ? 'checked' : ''}" style="cursor:pointer;padding:7px 14px;font-size:12.5px;border-radius:8px">
                    <input type="checkbox" onchange="toggleAudienciaArray('niveles', '${n}')" ${(a.niveles || []).includes(n) ? 'checked' : ''}>
                    ${n.replace('-', ' ').toUpperCase()}
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Ciclos Permitidos (Wrap corregido sin desborde) -->
            <div style="background:#F8FAFC;border:1px solid var(--border-soft);border-radius:10px;padding:16px;display:flex;flex-direction:column;min-width:0">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px;flex-wrap:wrap">
                <label style="font-weight:700;font-size:13px;color:var(--brand-dark);margin:0">Ciclos Académicos:</label>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 10px;font-size:11.5px;font-weight:700" onclick="toggleTodosCiclos()">
                  ${(a.ciclos || []).length === CICLOS.length ? 'Desmarcar todos' : 'Marcar todos'}
                </button>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${CICLOS.map(c => `
                  <label class="chip-check ${(a.ciclos || []).includes(c) ? 'checked' : ''}" style="cursor:pointer;padding:6px 11px;font-size:12px;border-radius:6px">
                    <input type="checkbox" onchange="toggleAudienciaCiclo(${c})" ${(a.ciclos || []).includes(c) ? 'checked' : ''}>
                    ${c}° Ciclo
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Mérito y Créditos Estilizados -->
            <div style="background:#F8FAFC;border:1px solid var(--border-soft);border-radius:10px;padding:16px;display:flex;flex-direction:column;min-width:0">
              <label style="font-weight:700;font-size:13px;display:block;margin-bottom:12px;color:var(--brand-dark)">Mérito Académico y Créditos:</label>
              <div style="display:flex;flex-direction:column;gap:10px">
                <label class="studio-custom-checkbox">
                  <input type="checkbox" ${a.tercioSuperior ? 'checked' : ''} onchange="actualizarAudiencia('tercioSuperior', this.checked)">
                  <span>Exigir pertenecer al <b>Tercio Superior</b></span>
                </label>
                <label class="studio-custom-checkbox">
                  <input type="checkbox" ${a.quintoSuperior ? 'checked' : ''} onchange="actualizarAudiencia('quintoSuperior', this.checked)">
                  <span>Exigir pertenecer al <b>Quinto Superior</b></span>
                </label>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:4px;padding:10px 14px;background:#FFFFFF;border:1px solid var(--border-soft);border-radius:8px">
                  <label style="font-size:12.5px;color:var(--text);font-weight:600">Mínimo de Créditos Aprobados:</label>
                  <input type="number" min="0" max="300" style="width:85px;height:34px;padding:0 8px;font-size:13px;font-weight:700;text-align:center;border:1.5px solid var(--border-soft);border-radius:6px;outline:none" value="${a.minCreditos || 0}" onchange="actualizarAudiencia('minCreditos', Number(this.value))">
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TAB 4: DOCUMENTO & CERTIFICACIÓN
    // =========================================================================
    function renderDocumentoTabHTML() {
      const t = CURRENT_T;
      const esDoc = esTramiteConDocumento(t);

      if (!esDoc) {
        return `
          <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:44px 24px;text-align:center;box-shadow:var(--studio-shadow);max-width:720px;margin:20px auto">
            <div style="width:56px;height:56px;border-radius:14px;background:var(--surface-2);color:var(--text-muted);display:grid;place-items:center;margin:0 auto 16px">
              ${SVG_ICONS.documento}
            </div>
            <h3 style="margin:0 0 8px;font-family:'Lato',sans-serif;font-size:19px;font-weight:900;color:var(--brand-dark)">
              Trámite sin emisión de documento oficial
            </h3>
            <p style="margin:0 auto 22px;font-size:13.5px;color:var(--text-muted);line-height:1.55;max-width:540px">
              Este trámite está configurado como una <b>Solicitud o Trámite Administrativo</b> que finaliza con una resolución interna y notificación formal al estudiante por correo institucional y portal, sin generar una constancia ni certificado con firma digital y QR.
            </p>
            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
              <button type="button" class="btn-studio-primary" onclick="setGeneraDocumento(true)">
                ${SVG_ICONS.plus} Activar Emisión de Documento Oficial
              </button>
              <button type="button" class="btn-studio-secondary" onclick="cambiarTab('flujo')">
                Volver a Flujo & Proceso
              </button>
            </div>
          </div>
        `;
      }

      const pl = DOC.getPlantilla(t);

      return `
        <div style="display:grid;grid-template-columns:minmax(340px, 1.15fr) minmax(320px, 1fr);gap:20px">
          <!-- Formulario de Configuración de la Plantilla -->
          <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
            <h3 style="margin:0 0 16px;font-family:'Lato',sans-serif;font-size:17px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
              ${SVG_ICONS.documento}
              <span>Configuración de la Plantilla Oficial</span>
            </h3>

            <div class="inspector-form-group">
              <label>Título del Documento Oficial:</label>
              <input type="text" class="inspector-input" value="${E(pl.titulo || '')}" oninput="actualizarPlantilla('titulo', this.value); actualizarCanvasEnVivo()">
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div class="inspector-form-group">
                <label>Autoridad Firmante:</label>
                <input type="text" class="inspector-input" value="${E(pl.firmante || '')}" oninput="actualizarPlantilla('firmante', this.value); actualizarCanvasEnVivo()">
              </div>
              <div class="inspector-form-group">
                <label>Cargo de la Autoridad:</label>
                <input type="text" class="inspector-input" value="${E(pl.cargo || '')}" oninput="actualizarPlantilla('cargo', this.value); actualizarCanvasEnVivo()">
              </div>
            </div>

            <div class="inspector-form-group">
              <label>Cuerpo de la Certificación (Soporta variables dinámicas):</label>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{nombre}')">{nombre}</button>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{codigo}')">{codigo}</button>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{programa}')">{programa}</button>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{ciclo}')">{ciclo}</button>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{creditos}')">{creditos}</button>
                <button type="button" class="btn-studio-secondary" style="height:26px;padding:0 8px;font-size:11px" onclick="insertarTag('{fecha}')">{fecha}</button>
              </div>
              <textarea class="inspector-textarea" id="textarea-plantilla-cuerpo" rows="8" oninput="actualizarPlantilla('cuerpo', this.value); actualizarCanvasEnVivo()">${E(pl.cuerpo || '')}</textarea>
            </div>

            <!-- MODALIDAD DE EMISIÓN: EMISIÓN MASIVA INSTITUCIONAL -->
            <div style="margin-top:16px;padding:16px;background:#F8FAFC;border:1px solid var(--border-soft);border-radius:10px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
                <div style="flex:1;min-width:240px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:13.5px;font-weight:700;color:var(--brand-dark)">Emisión Masiva Institucional (En lote)</span>
                    ${t.permiteEmisionMasiva ? '<span class="pill purple" style="font-size:10.5px;padding:2px 8px;font-weight:700">Habilitado</span>' : '<span class="pill gray" style="font-size:10.5px;padding:2px 8px">Solo individual</span>'}
                  </div>
                  <p style="margin:6px 0 0;font-size:12px;color:var(--text-muted);line-height:1.4">
                    Permite a la universidad emitir y firmar este documento en lotes masivos por cierre de ciclo o graduación para todos los estudiantes elegibles según la audiencia, sin requerir solicitud individual.
                  </p>
                </div>
                <div class="studio-state-segmented" style="height:32px;align-self:center">
                  <button type="button" class="studio-seg-btn ${!t.permiteEmisionMasiva ? 'selected draft' : ''}" style="font-size:12px;padding:0 12px" onclick="setEmisionMasiva(false)" title="Solo el estudiante puede solicitarlo individualmente">
                    <span>Individual</span>
                  </button>
                  <button type="button" class="studio-seg-btn ${t.permiteEmisionMasiva ? 'selected active' : ''}" style="font-size:12px;padding:0 12px" onclick="setEmisionMasiva(true)" title="Habilita la emisión institucional en lote">
                    <span>Lote Masivo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Previa Canvas Oficial (Marca de Agua) -->
          <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
              <h3 style="margin:0;font-family:'Lato',sans-serif;font-size:16px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
                ${SVG_ICONS.eye}
                <span>Vista Previa del Documento</span>
              </h3>
              <button type="button" class="btn-studio-secondary" style="height:32px;padding:0 10px;font-size:12px" onclick="DOC.modelo(CURRENT_T, DOC.ALUMNO_DEMO)">
                Pantalla Completa
              </button>
            </div>
            <div class="canvas-preview-container">
              <div id="studio-canvas-mount" style="display:flex;justify-content:center;width:100%"></div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px">
              ${SVG_ICONS.lock}
              <span>Vista previa con marca de agua diagonal institucional ("DOCUMENTO SIN VALIDEZ LEGAL").</span>
            </p>
          </div>
        </div>
      `;
    }

    function dibujarCanvasModelo() {
      const mount = document.getElementById('studio-canvas-mount');
      if (!mount) return;
      mount.innerHTML = '<canvas id="studio-preview-canvas" style="max-width:100%;height:auto;background:#FFF;box-shadow:0 8px 30px rgba(0,0,0,0.3);border-radius:4px" oncontextmenu="return false"></canvas>';
      try {
        const canvas = document.getElementById('studio-preview-canvas');
        if (canvas && typeof DOC.drawModel === 'function') {
          DOC.drawModel(canvas, CURRENT_T, DOC.ALUMNO_DEMO, null);
        }
      } catch (err) {
        console.warn('Canvas preview error:', err);
      }
    }

    function actualizarCanvasEnVivo() {
      dibujarCanvasModelo();
    }

    function insertarTag(tag) {
      const area = document.getElementById('textarea-plantilla-cuerpo');
      if (!area) return;
      const start = area.selectionStart;
      const end = area.selectionEnd;
      const text = area.value;
      area.value = text.substring(0, start) + tag + text.substring(end);
      actualizarPlantilla('cuerpo', area.value);
      actualizarCanvasEnVivo();
      area.focus();
    }

    // =========================================================================
    // TAB 5: NOTIFICACIONES POR CORREO (100% FUNCIONAL Y PERSISTENTE CON SELECTOR DE COLOR)
    // =========================================================================
    function renderNotificacionesTabHTML() {
      const t = CURRENT_T;
      if (!Array.isArray(t.correos)) t.correos = [];
      const correos = t.correos;

      // Subformulario interactivo de Registrar / Editar plantilla
      let subformHTML = '';
      if (ACTIVE_CORREO_EDIT_IDX !== null) {
        const isEdit = ACTIVE_CORREO_EDIT_IDX >= 0;
        const item = isEdit ? correos[ACTIVE_CORREO_EDIT_IDX] : {
          tipoEstado: 'Aprobado',
          colorTag: 'green',
          remitente: 'cobranzas@uwiener.edu.pe',
          password: '••••••••',
          asunto: `CONFIRMACIÓN TRÁMITE ${(t.nombre || '').toUpperCase()}`,
          cc: '',
          contenido: `Estimado(a) estudiante:\n\nAgradecemos su atención y le informamos sobre la resolución de su trámite...`,
          activo: true
        };

        const itemColor = item.colorTag || (item.tipoEstado === 'Aprobado' ? 'green' : item.tipoEstado === 'Rechazado' ? 'red' : item.tipoEstado === 'Observado' ? 'amber' : item.tipoEstado === 'En revisión' ? 'blue' : item.tipoEstado === 'Pendiente de pago' ? 'purple' : 'teal');

        subformHTML = `
          <div style="background:#F8FAFC;border:1.5px solid var(--brand);border-radius:10px;padding:18px 20px;margin-bottom:20px;box-shadow:0 4px 12px rgba(15,132,143,0.08)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border-soft)">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="color:var(--brand);display:inline-flex">${SVG_ICONS.notificaciones}</span>
                <b style="font-size:14px;color:var(--brand-dark)">${isEdit ? 'Editar Plantilla de Notificación' : 'Registrar Nueva Plantilla de Notificación'}</b>
              </div>
              <button type="button" class="btn-studio-secondary" style="height:28px;padding:0 8px;font-size:11px" onclick="cerrarSubformCorreoStudio()">${SVG_ICONS.close}</button>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px;margin-bottom:12px">
              <div class="inspector-form-group" style="margin:0">
                <label style="font-weight:700">Tipo de Estado Disparador: *</label>
                <div class="custom-select-container">
                  <select id="mail-studio-estado" onchange="alCambiarEstadoMailSubform(this.value)">
                    <option value="Aprobado" ${item.tipoEstado === 'Aprobado' ? 'selected' : ''}>Aprobado (Resolución favorable)</option>
                    <option value="Rechazado" ${item.tipoEstado === 'Rechazado' ? 'selected' : ''}>Rechazado (No cumple requisitos)</option>
                    <option value="Observado" ${item.tipoEstado === 'Observado' ? 'selected' : ''}>Observado (Requiere subsanación)</option>
                    <option value="En revisión" ${item.tipoEstado === 'En revisión' ? 'selected' : ''}>En revisión (En evaluación por área)</option>
                    <option value="Pendiente de pago" ${item.tipoEstado === 'Pendiente de pago' ? 'selected' : ''}>Pendiente de pago (Arancel pendiente)</option>
                    <option value="Finalizado" ${item.tipoEstado === 'Finalizado' ? 'selected' : ''}>Finalizado (Cierre de expediente)</option>
                  </select>
                </div>
              </div>

              <div class="inspector-form-group" style="margin:0">
                <label style="font-weight:700">Correo Remitente Institucional: *</label>
                <input class="inspector-input" id="mail-studio-remitente" value="${E(item.remitente || 'cobranzas@uwiener.edu.pe')}" placeholder="ej. cobranzas@uwiener.edu.pe">
              </div>

              <div class="inspector-form-group" style="margin:0">
                <label style="font-weight:700">Contraseña SMTP / Credencial:</label>
                <input class="inspector-input" type="password" id="mail-studio-pass" value="${E(item.password || '')}" placeholder="••••••••">
              </div>
            </div>

            <!-- PERSONALIZADOR DE COLOR DE TAG / DISTINTIVO DEL ESTADO -->
            <div style="background:#FFFFFF;border:1px solid var(--border-soft);border-radius:8px;padding:12px 14px;margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">
                <div>
                  <label style="font-weight:700;font-size:12.5px;color:var(--brand-dark);margin:0;display:block">Color del Tag / Distintivo del Estado:</label>
                  <div style="color:var(--text-muted);font-size:11px;margin-top:2px">Personaliza el color visual para identificar este estado en el sistema.</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:11px;color:var(--text-muted);font-weight:600">Vista previa:</span>
                  <span id="preview-mail-tag" class="studio-badge ${itemColor}" style="font-weight:800;font-size:11.5px;height:26px;padding:0 10px">Estado: ${E(item.tipoEstado)}</span>
                </div>
              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center" id="color-picker-chips">
                ${COLORES_TAG.map(col => `
                  <label class="color-swatch-chip ${itemColor === col.id ? 'selected' : ''}" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:20px;border:1.5px solid ${col.border};background:${col.bg};color:${col.color};font-size:11.5px;font-weight:700;transition:all 0.15s ease">
                    <input type="radio" name="mail-tag-color" value="${col.id}" ${itemColor === col.id ? 'checked' : ''} onchange="actualizarColorTagPreview('${col.id}')" style="display:none">
                    <span style="width:10px;height:10px;border-radius:50%;background:${col.color};display:inline-block"></span>
                    <span>${col.label.split(' ')[0]}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:12px">
              <div class="inspector-form-group" style="margin:0">
                <label style="font-weight:700">Asunto del Correo: *</label>
                <input class="inspector-input" id="mail-studio-asunto" value="${E(item.asunto || '')}" placeholder="Asunto oficial de notificación">
              </div>

              <div class="inspector-form-group" style="margin:0">
                <label style="font-weight:700">Con Copia (CC):</label>
                <input class="inspector-input" id="mail-studio-cc" value="${E(item.cc || '')}" placeholder="separar múltiples correos con comas (,)">
                <small style="color:var(--text-muted);font-size:11px;margin-top:2px;display:block">Opcional. Recibirá una copia informativa del correo emitido al alumno.</small>
              </div>
            </div>

            <div class="inspector-form-group" style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:6px">
                <label style="margin:0;font-weight:700">Cuerpo del Mensaje / Contenido:</label>
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  <button type="button" class="btn-studio-secondary" style="height:22px;padding:0 6px;font-size:10px" onclick="insertarTagCorreo('{nombre}')">{nombre}</button>
                  <button type="button" class="btn-studio-secondary" style="height:22px;padding:0 6px;font-size:10px" onclick="insertarTagCorreo('{codigo}')">{codigo}</button>
                  <button type="button" class="btn-studio-secondary" style="height:22px;padding:0 6px;font-size:10px" onclick="insertarTagCorreo('{tramite}')">{tramite}</button>
                  <button type="button" class="btn-studio-secondary" style="height:22px;padding:0 6px;font-size:10px" onclick="insertarTagCorreo('{fecha}')">{fecha}</button>
                </div>
              </div>
              <div class="rte-box">
                <div class="rte-bar">
                  <button type="button" class="rte-tool-btn" title="Negrita" onclick="rteCommand('mail-studio-contenido','bold')"><b>B</b></button>
                  <button type="button" class="rte-tool-btn" title="Cursiva" onclick="rteCommand('mail-studio-contenido','italic')"><i>I</i></button>
                  <button type="button" class="rte-tool-btn" title="Subrayado" onclick="rteCommand('mail-studio-contenido','underline')"><u>U</u></button>
                  <span style="width:1px;height:16px;background:#CBD5E1;margin:0 4px"></span>
                  <button type="button" class="rte-tool-btn" title="Lista con viñetas" onclick="rteCommand('mail-studio-contenido','list-ul')">•≡</button>
                  <button type="button" class="rte-tool-btn" title="Lista numerada" onclick="rteCommand('mail-studio-contenido','list-ol')">1≡</button>
                </div>
                <textarea class="rte-editor-area" id="mail-studio-contenido" rows="5" placeholder="Redacte el texto o cuerpo institucional de la notificación...">${E(item.contenido || '')}</textarea>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border-soft);flex-wrap:wrap;gap:10px">
              <div style="display:flex;align-items:center;gap:8px">
                <label class="studio-checkbox-inline" style="cursor:pointer">
                  <input type="checkbox" id="mail-studio-activo" ${item.activo !== false ? 'checked' : ''}>
                  <span>Plantilla activa y operativa</span>
                </label>
              </div>
              <div style="display:flex;gap:8px">
                <button type="button" class="btn-studio-secondary" onclick="cerrarSubformCorreoStudio()">Cancelar</button>
                <button type="button" class="btn-studio-primary" onclick="guardarSubformCorreoStudio()" style="gap:6px">
                  ${SVG_ICONS.check} <span>${isEdit ? 'Actualizar Plantilla' : 'Guardar Plantilla'}</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // Tabla / Lista de Plantillas configuradas
      const rowsHTML = correos.map((c, idx) => {
        const colorTag = c.colorTag || (c.tipoEstado === 'Aprobado' ? 'green' : c.tipoEstado === 'Rechazado' ? 'red' : c.tipoEstado === 'Observado' ? 'amber' : c.tipoEstado === 'En revisión' ? 'blue' : c.tipoEstado === 'Pendiente de pago' ? 'purple' : 'teal');

        return `
          <div class="mail-card-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="studio-badge ${colorTag}" style="font-weight:800;font-size:11.5px">Estado: ${E(c.tipoEstado)}</span>
                <span style="font-size:12px;color:var(--brand-dark);font-weight:700">${E(c.remitente)}</span>
                ${c.cc ? `<span style="font-size:11px;color:var(--text-muted);background:#F1F5F9;padding:2px 6px;border-radius:4px">CC: ${E(c.cc)}</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <label class="studio-checkbox-inline" style="font-size:11.5px;cursor:pointer">
                  <input type="checkbox" ${c.activo !== false ? 'checked' : ''} onchange="toggleCorreoActivoStudio(${idx}, this.checked)">
                  <span>${c.activo !== false ? 'Activo' : 'Inactivo'}</span>
                </label>
                <button type="button" class="btn-studio-secondary" style="height:28px;padding:0 8px;font-size:11.5px;gap:4px" onclick="abrirSubformCorreoStudio(${idx})" title="Editar plantilla">
                  ${SVG_ICONS.edit} <span>Editar</span>
                </button>
                <button type="button" class="btn-studio-secondary" style="height:28px;padding:0 8px;font-size:11.5px;color:var(--err-fg)" onclick="confirmarQuitarCorreoStudio(${idx})" title="Quitar plantilla">
                  ${SVG_ICONS.trash}
                </button>
              </div>
            </div>

            <div style="font-size:13px;font-weight:700;color:var(--text);margin-top:2px">
              ${E(c.asunto)}
            </div>

            <div style="font-size:12px;color:var(--text-soft);line-height:1.45;background:#FAFCFD;padding:8px 12px;border-radius:6px;border:1px solid var(--border-soft);white-space:pre-line">
              ${E(c.contenido ? (c.contenido.length > 180 ? c.contenido.slice(0, 180) + '...' : c.contenido) : 'Sin contenido redactado.')}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border-soft);flex-wrap:wrap;gap:12px">
            <div>
              <h3 style="margin:0;font-family:'Lato',sans-serif;font-size:17px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
                ${SVG_ICONS.notificaciones}
                <span>Avisos Automatizados por Correo</span>
              </h3>
              <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted)">
                Plantillas de notificación enviadas automáticamente al correo institucional del estudiante según el estado del trámite.
              </p>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <label class="studio-checkbox-inline" style="cursor:pointer;font-weight:700">
                <input type="checkbox" ${t.envioCorreo ? 'checked' : ''} onchange="actualizarCampo('envioCorreo', this.checked)">
                <span>Habilitar notificaciones por correo</span>
              </label>
              <button type="button" class="btn-studio-primary" onclick="abrirSubformCorreoStudio(-1)">
                ${SVG_ICONS.plus} <span>Agregar Plantilla</span>
              </button>
            </div>
          </div>

          ${subformHTML}

          <div style="display:flex;flex-direction:column;gap:12px">
            ${correos.length ? rowsHTML : `
              <div style="text-align:center;padding:36px 20px;border:2px dashed var(--border-soft);border-radius:10px">
                <b style="font-size:14px;color:var(--text)">No hay plantillas de correo configuradas</b>
                <p style="font-size:12.5px;color:var(--text-muted);margin:6px 0 14px">Presione «Agregar Plantilla» para redactar un aviso personalizado.</p>
                <button type="button" class="btn-studio-primary" onclick="abrirSubformCorreoStudio(-1)">
                  ${SVG_ICONS.plus} <span>Agregar Plantilla</span>
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    }

    function abrirSubformCorreoStudio(idx) {
      ACTIVE_CORREO_EDIT_IDX = idx;
      renderStudioUI();
    }

    function cerrarSubformCorreoStudio() {
      ACTIVE_CORREO_EDIT_IDX = null;
      renderStudioUI();
    }

    function alCambiarEstadoMailSubform(nuevoEstado) {
      const defaultColors = {
        'Aprobado': 'green',
        'Rechazado': 'red',
        'Observado': 'amber',
        'En revisión': 'blue',
        'Pendiente de pago': 'purple',
        'Finalizado': 'teal'
      };
      const sug = defaultColors[nuevoEstado] || 'teal';
      actualizarColorTagPreview(sug);
      const radio = document.querySelector(`input[name="mail-tag-color"][value="${sug}"]`);
      if (radio) {
        radio.checked = true;
        document.querySelectorAll('.color-swatch-chip').forEach(ch => ch.classList.remove('selected'));
        const parentLabel = radio.closest('.color-swatch-chip');
        if (parentLabel) parentLabel.classList.add('selected');
      }
    }

    function actualizarColorTagPreview(colorId) {
      const tagEl = document.getElementById('preview-mail-tag');
      const estadoEl = document.getElementById('mail-studio-estado');
      if (tagEl) {
        tagEl.className = `studio-badge ${colorId}`;
        tagEl.textContent = `Estado: ${estadoEl ? estadoEl.value : 'Personalizado'}`;
      }
      document.querySelectorAll('.color-swatch-chip').forEach(ch => {
        const input = ch.querySelector('input');
        if (input && input.value === colorId) {
          ch.classList.add('selected');
        } else {
          ch.classList.remove('selected');
        }
      });
    }

    function guardarSubformCorreoStudio() {
      const estadoEl = document.getElementById('mail-studio-estado');
      const remEl = document.getElementById('mail-studio-remitente');
      const passEl = document.getElementById('mail-studio-pass');
      const asuEl = document.getElementById('mail-studio-asunto');
      const ccEl = document.getElementById('mail-studio-cc');
      const contEl = document.getElementById('mail-studio-contenido');
      const actEl = document.getElementById('mail-studio-activo');

      if (!remEl || !remEl.value.includes('@')) {
        APP.toast('Por favor ingrese un correo remitente institucional válido (@uwiener.edu.pe).', 'warn');
        return;
      }
      if (!asuEl || !asuEl.value.trim()) {
        APP.toast('El asunto del correo es obligatorio.', 'warn');
        return;
      }

      const colorRadio = document.querySelector('input[name="mail-tag-color"]:checked');
      const defaultColors = {
        'Aprobado': 'green',
        'Rechazado': 'red',
        'Observado': 'amber',
        'En revisión': 'blue',
        'Pendiente de pago': 'purple',
        'Finalizado': 'teal'
      };
      const colorTag = colorRadio ? colorRadio.value : (defaultColors[estadoEl.value] || 'teal');

      const itemData = {
        id: (ACTIVE_CORREO_EDIT_IDX >= 0 && CURRENT_T.correos[ACTIVE_CORREO_EDIT_IDX] && CURRENT_T.correos[ACTIVE_CORREO_EDIT_IDX].id) ? CURRENT_T.correos[ACTIVE_CORREO_EDIT_IDX].id : ('MAIL-' + (CURRENT_T.id || 'T') + '-' + Date.now()),
        tipoEstado: estadoEl.value,
        colorTag: colorTag,
        remitente: remEl.value.trim(),
        password: passEl.value,
        asunto: asuEl.value.trim(),
        cc: ccEl ? ccEl.value.trim() : '',
        contenido: contEl ? contEl.value.trim() : '',
        activo: actEl ? actEl.checked : true
      };

      if (ACTIVE_CORREO_EDIT_IDX >= 0) {
        CURRENT_T.correos[ACTIVE_CORREO_EDIT_IDX] = itemData;
        APP.toast('Plantilla de correo actualizada.', 'ok');
      } else {
        CURRENT_T.correos.push(itemData);
        APP.toast('Nueva plantilla de correo agregada.', 'ok');
      }

      ACTIVE_CORREO_EDIT_IDX = null;
      renderStudioUI();
    }

    function toggleCorreoActivoStudio(idx, activo) {
      if (CURRENT_T.correos && CURRENT_T.correos[idx]) {
        CURRENT_T.correos[idx].activo = activo;
        APP.toast(activo ? 'Plantilla habilitada.' : 'Plantilla desactivada.', 'info');
      }
    }

    function confirmarQuitarCorreoStudio(idx) {
      const item = CURRENT_T.correos[idx];
      mostrarModalConfirmacion({
        titulo: 'Quitar Plantilla de Correo',
        mensaje: `¿Deseas eliminar la plantilla de notificación para el estado <b>«${E(item.tipoEstado)}»</b>?`,
        textoConfirmar: 'Eliminar Plantilla',
        textoCancelar: 'Cancelar',
        onConfirm: () => {
          CURRENT_T.correos.splice(idx, 1);
          APP.toast('Plantilla de notificación eliminada.', 'info');
          renderStudioUI();
        }
      });
    }

    function insertarTagCorreo(tag) {
      const ta = document.getElementById('mail-studio-contenido');
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const text = ta.value;
      ta.value = text.substring(0, start) + tag + text.substring(end);
      ta.focus();
    }

    // =========================================================================
    // TAB 6: CRONOGRAMA ACADÉMICO (100% FUNCIONAL Y PERSISTENTE)
    // =========================================================================
    function renderCronogramaTabHTML() {
      const t = CURRENT_T;
      if (!Array.isArray(t.cronogramas)) t.cronogramas = [];
      const cronogs = t.cronogramas;
      const esCronogActivo = t.tipoActivacion === 'Cronograma';

      const itemsHTML = cronogs.map((c, idx) => {
        const modsList = MODALIDADES_POR_GRADO[c.grado] || ['Todas'];
        const gradoOpts = GRADOS_ESTUDIO.map(g => `<option value="${g}" ${g === c.grado ? 'selected' : ''}>${g}</option>`).join('');
        const modOpts = modsList.map(m => `<option value="${m}" ${m === c.modalidad ? 'selected' : ''}>${m}</option>`).join('');
        const facOpts = FACULTADES_CATALOGO.map(f => `<option value="${f}" ${f === c.facultad ? 'selected' : ''}>${f}</option>`).join('');
        const carOpts = CARRERAS_CATALOGO.map(cr => `<option value="${cr}" ${cr === c.carrera ? 'selected' : ''}>${cr}</option>`).join('');
        const perOpts = PERIODOS_CATALOGO.map(p => `<option value="${p}" ${p === c.periodo ? 'selected' : ''}>${p}</option>`).join('');

        return `
          <div class="cronog-card-wiener">
            <div class="cronog-card-head">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="mono strong" style="font-size:13px;color:var(--brand-dark)">Rango N° ${idx + 1}</span>
                <span class="tag teal" style="font-size:11px;font-weight:700">${E(c.grado)}</span>
                <span class="tag" style="font-size:11px">${E(c.modalidad)}</span>
                <span class="tag purple" style="font-size:11px">${E(c.periodo || 'Periodo')}</span>
                ${c.activo !== false ? `<span class="pill ok" style="font-size:10.5px;display:inline-flex;align-items:center;gap:4px">${SVG_ICONS.check} Activo</span>` : '<span class="pill gray" style="font-size:10.5px">Inactivo</span>'}
              </div>
              <button type="button" class="btn btn-sm" style="background:#FEE2E2;border:1px solid #FCA5A5;color:#DC2626;padding:4px 10px;font-size:12px;display:inline-flex;align-items:center;gap:5px" title="Quitar este rango" onclick="confirmarQuitarRangoStudio(${idx})">
                ${SVG_ICONS.trash} <span>Quitar</span>
              </button>
            </div>

            <div style="padding:16px">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:12px;margin-bottom:14px">
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Grado Estudio *</label>
                  <select class="inspector-input" id="cr-grd-${idx}" style="font-size:13px;width:100%" onchange="cronogCambiarGradoStudio(${idx}, this.value)">
                    ${gradoOpts}
                  </select>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Modalidad de Estudio *</label>
                  <select class="inspector-input" id="cr-mod-${idx}" style="font-size:13px;width:100%" onchange="cronogActualizarCampoStudio(${idx}, 'modalidad', this.value)">
                    ${modOpts}
                  </select>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Facultad</label>
                  <select class="inspector-input" id="cr-fac-${idx}" style="font-size:13px;width:100%" onchange="cronogActualizarCampoStudio(${idx}, 'facultad', this.value)">
                    ${facOpts}
                  </select>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Escuela / Carrera</label>
                  <select class="inspector-input" id="cr-car-${idx}" style="font-size:13px;width:100%" onchange="cronogActualizarCampoStudio(${idx}, 'carrera', this.value)">
                    ${carOpts}
                  </select>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(170px, 1fr));gap:12px">
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Periodo Académico</label>
                  <select class="inspector-input" id="cr-per-${idx}" style="font-size:13px;width:100%" onchange="cronogActualizarCampoStudio(${idx}, 'periodo', this.value)">
                    ${perOpts}
                  </select>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Fecha Inicio</label>
                  <div class="custom-date-container" style="width:100%" title="Fecha de inicio del rango">
                    <input type="date" id="cr-ini-${idx}" value="${c.fechaInicio || '2026-10-01'}" onchange="cronogActualizarCampoStudio(${idx}, 'fechaInicio', this.value)">
                  </div>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Fecha Fin</label>
                  <div class="custom-date-container" style="width:100%" title="Fecha de fin del rango">
                    <input type="date" id="cr-fin-${idx}" value="${c.fechaFin || '2026-11-01'}" onchange="cronogActualizarCampoStudio(${idx}, 'fechaFin', this.value)">
                  </div>
                </div>
                <div class="inspector-form-group" style="margin:0">
                  <label style="font-size:12px;font-weight:700;color:var(--text-soft);margin-bottom:4px;display:block">Estado</label>
                  <select class="inspector-input" id="cr-act-${idx}" style="font-size:13px;width:100%" onchange="cronogActualizarCampoStudio(${idx}, 'activo', this.value === 'si')">
                    <option value="si" ${c.activo !== false ? 'selected' : ''}>Activo</option>
                    <option value="no" ${c.activo === false ? 'selected' : ''}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div style="background:#FFFFFF;border:1px solid var(--studio-border);border-radius:12px;padding:22px;box-shadow:var(--studio-shadow)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-soft);flex-wrap:wrap;gap:14px">
            <div>
              <div style="display:flex;align-items:center;gap:10px">
                <h3 style="margin:0;font-family:'Lato',sans-serif;font-size:17px;font-weight:900;color:var(--brand-dark);display:flex;align-items:center;gap:8px">
                  ${SVG_ICONS.cronograma}
                  <span>Cronograma y Ventanas de Disponibilidad</span>
                </h3>
                <span class="pill ${esCronogActivo ? 'teal' : 'gray'}" style="font-size:11px;font-weight:700">
                  ${esCronogActivo ? 'Modo: Por Cronograma' : 'Modo: Permanente'}
                </span>
              </div>
              <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted)">
                Configura la disponibilidad académica por grado, modalidad, facultad, carrera y periodo.
              </p>
            </div>
            <button type="button" class="btn-studio-primary" onclick="cronogAgregarRangoStudio()">
              ${SVG_ICONS.plus} <span>Agregar Rango de Cronograma</span>
            </button>
          </div>

          <!-- Selector de Modo de Activación -->
          <div style="background:#F8FAFC;border:1.5px solid var(--border-soft);border-radius:10px;padding:16px;margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
              <div>
                <b style="font-size:13.5px;color:var(--brand-dark);display:block;margin-bottom:2px">Tipo de Activación del Trámite:</b>
                <div style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;margin-top:4px">
                  ${esCronogActivo 
                    ? `<span style="color:#D97706;display:inline-flex;align-items:center">${SVG_ICONS.warning}</span><span>El trámite solo se habilitará a los estudiantes cuando la fecha actual coincida con alguno de los rangos configurados abajo.</span>` 
                    : `<span style="color:#059669;display:inline-flex;align-items:center">${SVG_ICONS.checkCircle}</span><span>El trámite está habilitado de forma continua para todos los estudiantes elegibles según la pestaña de Audiencia.</span>`}
                </div>
              </div>
              <div class="studio-state-segmented" style="height:34px">
                <button type="button" class="studio-seg-btn ${!esCronogActivo ? 'selected active' : ''}" style="font-size:12px;padding:0 14px;display:inline-flex;align-items:center;gap:6px" onclick="cambiarTipoActivacionStudio('Permanente')">
                  ${SVG_ICONS.check} <span>Permanente (Todo el año)</span>
                </button>
                <button type="button" class="studio-seg-btn ${esCronogActivo ? 'selected active' : ''}" style="font-size:12px;padding:0 14px;display:inline-flex;align-items:center;gap:6px" onclick="cambiarTipoActivacionStudio('Cronograma')">
                  ${SVG_ICONS.warning} <span>Por Cronograma</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Contenedor de Rangos -->
          <div id="cronograma-items-container">
            ${cronogs.length ? itemsHTML : `
              <div style="text-align:center;padding:38px 20px;border:2px dashed var(--border-soft);border-radius:10px">
                <div style="width:48px;height:48px;margin:0 auto 12px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;color:var(--brand)">
                  ${SVG_ICONS.cronograma}
                </div>
                <b style="font-size:14px;color:var(--text)">No hay rangos de cronograma configurados</b>
                <p style="font-size:12.5px;color:var(--text-muted);margin:6px 0 16px">
                  ${esCronogActivo ? 'Debe registrar al menos un rango de fechas para que el trámite pueda ser solicitado.' : 'Puede agregar rangos por grado y modalidad para calendarizar la disponibilidad futura.'}
                </p>
                <button type="button" class="btn-studio-primary" onclick="cronogAgregarRangoStudio()">
                  ${SVG_ICONS.plus} <span>Agregar Rango de Cronograma</span>
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    }

    function cambiarTipoActivacionStudio(tipo) {
      CURRENT_T.tipoActivacion = tipo;
      renderStudioUI();
      APP.toast(tipo === 'Cronograma' ? 'Trámite condicionado por cronograma de fechas.' : 'Trámite activo de forma permanente.', 'info');
    }

    function cronogAgregarRangoStudio() {
      if (!Array.isArray(CURRENT_T.cronogramas)) CURRENT_T.cronogramas = [];
      const defaultGrado = 'Pregrado';
      const defaultMod = (MODALIDADES_POR_GRADO[defaultGrado] || ['Todas'])[1] || 'Modalidad Ordinaria';

      CURRENT_T.cronogramas.push({
        id: 'CR-' + Date.now(),
        grado: defaultGrado,
        modalidad: defaultMod,
        facultad: 'Todas',
        carrera: 'Todas',
        periodo: '2026-1',
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        activo: true
      });

      renderStudioUI();
      APP.toast('Nuevo rango de cronograma agregado.', 'ok');
    }

    function cronogCambiarGradoStudio(idx, nuevoGrado) {
      if (!CURRENT_T.cronogramas || !CURRENT_T.cronogramas[idx]) return;
      CURRENT_T.cronogramas[idx].grado = nuevoGrado;
      const mods = MODALIDADES_POR_GRADO[nuevoGrado] || ['Todas'];
      CURRENT_T.cronogramas[idx].modalidad = mods[0] || 'Todas';
      renderStudioUI();
    }

    function cronogActualizarCampoStudio(idx, campo, val) {
      if (!CURRENT_T.cronogramas || !CURRENT_T.cronogramas[idx]) return;
      CURRENT_T.cronogramas[idx][campo] = val;
    }

    function confirmarQuitarRangoStudio(idx) {
      const c = CURRENT_T.cronogramas[idx];
      mostrarModalConfirmacion({
        titulo: 'Quitar Rango de Cronograma',
        mensaje: `¿Deseas remover el rango <b>Ítem N° ${idx + 1}</b> (${E(c.grado)} - ${E(c.modalidad)}) del cronograma?`,
        textoConfirmar: 'Quitar Rango',
        textoCancelar: 'Cancelar',
        onConfirm: () => {
          CURRENT_T.cronogramas.splice(idx, 1);
          renderStudioUI();
          APP.toast('Rango removido del cronograma.', 'info');
        }
      });
    }

    // =========================================================================
    // MODAL MAESTRO: CATÁLOGO DE CONCEPTOS DE CAJA (Mejor UX-Writing)
    // =========================================================================
    function abrirModalCatalogoConceptos() {
      CONCEPTO_SEARCH_KW = '';
      APP.openModal(renderContentConceptosModal(''), { wide: true, className: 'modal-conceptos-wrap' });
    }

    function renderContentConceptosModal(kw = '') {
      let concs = DB.conceptos() || [];
      if (kw) {
        const q = kw.toLowerCase();
        concs = concs.filter(c => (c.codigo && c.codigo.toLowerCase().includes(q)) || (c.servicio && c.servicio.toLowerCase().includes(q)) || (c.descripcion && c.descripcion.toLowerCase().includes(q)));
      }

      const rows = concs.map(c => `
        <tr style="border-bottom:1px solid var(--border-soft)">
          <td style="text-align:center;padding:10px 12px">
            <button type="button" class="btn-studio-primary" style="padding:4px 10px;font-size:11.5px;gap:4px" onclick="seleccionarConceptoStudio('${c.codigo}', '${(c.servicio || c.descripcion || '').replace(/'/g, "\\'")}', ${c.monto || 0})">
              ${SVG_ICONS.plus} <span>Seleccionar</span>
            </button>
          </td>
          <td style="padding:10px 12px"><span class="mono strong" style="color:var(--brand-dark);font-size:12.5px">${c.codigo}</span></td>
          <td style="padding:10px 12px"><b>${E(c.servicio || c.descripcion)}</b></td>
          <td style="padding:10px 12px;font-weight:700;color:var(--text);white-space:nowrap">${APP.money(c.monto)}</td>
        </tr>
      `).join('');

      return `
        <div class="modal-head" style="border-bottom:1px solid var(--border-soft);padding:18px 22px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center;flex-shrink:0">
              ${SVG_ICONS.pago}
            </div>
            <div>
              <h3 style="margin:0;font-size:16.5px;font-weight:900;color:var(--text);font-family:'Lato',sans-serif">Catálogo de Conceptos de Caja Wiener</h3>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Servicios y aranceles contables oficiales para cobro en línea o ventanilla</div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="APP.closeModal()" style="border:none;background:transparent;cursor:pointer;color:var(--text-muted);display:grid;place-items:center;width:32px;height:32px;border-radius:8px">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="modal-body" style="padding:20px">
          <div style="margin-bottom:14px;position:relative">
            <input type="text" id="kw-modal-concepto" class="inspector-input" placeholder="Buscar por código (ej. 010100...) o descripción del servicio..." value="${E(kw)}" oninput="filtrarConceptosModal(this.value)" style="padding-left:36px;height:40px;font-size:13.5px">
            <span style="position:absolute;left:12px;top:12px;color:var(--text-muted)">${SVG_ICONS.search}</span>
          </div>

          <div style="max-height:340px;overflow-y:auto;border:1px solid var(--border-soft);border-radius:8px;background:#FFFFFF">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--surface-2);border-bottom:1.5px solid var(--border-soft);text-align:left">
                  <th style="width:120px;text-align:center;padding:10px 12px">Acción</th>
                  <th style="width:110px;padding:10px 12px">Código</th>
                  <th style="padding:10px 12px">Servicio / Concepto Contable</th>
                  <th style="width:100px;padding:10px 12px">Monto Oficial</th>
                </tr>
              </thead>
              <tbody id="tbody-conceptos-modal">
                ${rows.length ? rows : `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text-muted)">No se encontraron conceptos contables con el criterio buscado.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-foot" style="padding:14px 22px;background:var(--surface-2);border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end">
          <button type="button" class="btn-studio-secondary" onclick="APP.closeModal()">Cerrar</button>
        </div>
      `;
    }

    function filtrarConceptosModal(kw) {
      CONCEPTO_SEARCH_KW = kw;
      const tbody = document.getElementById('tbody-conceptos-modal');
      if (!tbody) return;

      let concs = DB.conceptos() || [];
      if (kw) {
        const q = kw.toLowerCase();
        concs = concs.filter(c => (c.codigo && c.codigo.toLowerCase().includes(q)) || (c.servicio && c.servicio.toLowerCase().includes(q)) || (c.descripcion && c.descripcion.toLowerCase().includes(q)));
      }

      const rows = concs.map(c => `
        <tr style="border-bottom:1px solid var(--border-soft)">
          <td style="text-align:center;padding:10px 12px">
            <button type="button" class="btn-studio-primary" style="padding:4px 10px;font-size:11.5px;gap:4px" onclick="seleccionarConceptoStudio('${c.codigo}', '${(c.servicio || c.descripcion || '').replace(/'/g, "\\'")}', ${c.monto || 0})">
              ${SVG_ICONS.plus} <span>Seleccionar</span>
            </button>
          </td>
          <td style="padding:10px 12px"><span class="mono strong" style="color:var(--brand-dark);font-size:12.5px">${c.codigo}</span></td>
          <td style="padding:10px 12px"><b>${E(c.servicio || c.descripcion)}</b></td>
          <td style="padding:10px 12px;font-weight:700;color:var(--text);white-space:nowrap">${APP.money(c.monto)}</td>
        </tr>
      `).join('');

      tbody.innerHTML = rows.length ? rows : `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text-muted)">No se encontraron conceptos contables con el criterio buscado.</td></tr>`;
    }

    function seleccionarConceptoStudio(codigo, servicio, monto) {
      CURRENT_T.conceptoCodigo = codigo;
      CURRENT_T.conceptoServicio = servicio;
      if (monto > 0) CURRENT_T.costo = monto;

      APP.closeModal();
      renderStudioUI();
      APP.toast(`Concepto vinculado: «${codigo} - ${servicio}» (S/ ${monto.toFixed(2)})`, 'ok');
    }

    // =========================================================================
    // SIMULADOR DIGITAL TWIN (Con Custom Select Wiener)
    // =========================================================================
    function renderSimulatorContentHTML() {
      const t = CURRENT_T;
      const alumnos = obtenerAlumnosMock();
      const currentAlumno = alumnos.find(a => a.codigo === SIMULATOR_STUDENT_CODE) || alumnos[0];
      const elegible = DB.elegible(t, currentAlumno.perfil);

      return `
        <div class="simulator-header">
          <h3>
            ${SVG_ICONS.eye}
            <span>Simulador Alumno en Vivo</span>
          </h3>
          <button type="button" class="modal-close" style="color:#FFF;border:none;background:transparent;cursor:pointer" onclick="toggleSimulador(false)">
            ${SVG_ICONS.close}
          </button>
        </div>
        <div class="simulator-body">
          <!-- Selector Interactivo de Alumnos Demo (Tarjetas directas sin dropdown colapsado) -->
          <div style="background:#FFFFFF;border:1px solid var(--border-soft);border-radius:10px;padding:14px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,0.02)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <label style="font-size:11.5px;font-weight:800;color:var(--text-muted);letter-spacing:0.5px">ESTUDIANTE DE PRUEBA (DEMO):</label>
              <span style="font-size:11px;color:var(--brand);font-weight:700">Seleccione para probar</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px">
              ${alumnos.map(a => {
        const isSelected = a.codigo === currentAlumno.codigo;
        const isEleg = DB.elegible(t, a.perfil);
        return `
                  <div onclick="cambiarAlumnoSimulador('${a.codigo}')" style="cursor:pointer;padding:10px 12px;border-radius:8px;border:1.5px solid ${isSelected ? 'var(--brand)' : 'var(--border-soft)'};background:${isSelected ? '#F0FAFA' : '#FAFCFD'};transition:all 0.15s ease;display:flex;align-items:center;gap:10px;box-shadow:${isSelected ? '0 0 0 2px rgba(15,132,143,0.15)' : 'none'}">
                    <div style="width:34px;height:34px;border-radius:50%;background:${isSelected ? 'var(--brand)' : '#E2E8F0'};color:${isSelected ? '#FFFFFF' : '#475569'};display:grid;place-items:center;font-weight:800;font-size:13px;flex-shrink:0">
                      ${a.nombre.charAt(0)}
                    </div>
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
                        <b style="font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(a.nombre)}</b>
                        <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;${isEleg ? 'background:#D1FAE5;color:#065F46' : 'background:#FEE2E2;color:#991B1B'}">
                          ${isEleg ? 'APTO' : 'NO APTO'}
                        </span>
                      </div>
                      <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">
                        ${(a.perfil.nivel || 'pregrado').replace('-', ' ').toUpperCase()} · Ciclo ${a.perfil.ciclo || 1} · ${a.perfil.creditos || 0} cred. · ${a.perfil.tercioSuperior ? 'Tercio Sup.' : 'Regular'}
                      </div>
                    </div>
                  </div>
                `;
      }).join('')}
            </div>
          </div>

          <!-- Veredicto de Elegibilidad -->
          <div style="border-radius:10px;padding:14px;margin-bottom:18px;border:1.5px solid ${elegible ? '#A7F3D0' : '#FCA5A5'};background:${elegible ? '#ECFDF5' : '#FEF2F2'}">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="display:flex;color:${elegible ? '#047857' : '#DC2626'}">
                ${elegible ? SVG_ICONS.checkCircle : SVG_ICONS.alertOctagon}
              </span>
              <b style="font-size:13.5px;color:${elegible ? '#065F46' : '#991B1B'}">
                ${elegible ? 'El estudiante ES ELEGIBLE para solicitar' : 'El estudiante NO ES ELEGIBLE'}
              </b>
            </div>
            ${!elegible ? `
              <p style="margin:6px 0 0;font-size:12.5px;color:#991B1B">
                No cumple con los requisitos configurados en la pestaña de Audiencia (nivel, ciclo, créditos o mérito).
              </p>
            ` : `
              <p style="margin:6px 0 0;font-size:12.5px;color:#065F46">
                Este trámite se mostrará habilitado en su portal de Trámites.
              </p>
            `}
          </div>

          <!-- Stepper Preview del Estudiante -->
          <div style="background:#FFFFFF;border:1px solid var(--border-soft);border-radius:10px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,0.02)">
            <b style="font-size:13px;color:var(--brand-dark)">¿Cómo verá el proceso de atención?</b>
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;align-items:center;gap:10px;font-size:13px">
                <span style="width:24px;height:24px;border-radius:50%;background:var(--brand);color:#FFF;display:grid;place-items:center;font-size:11px;font-weight:700">1</span>
                <span>Registro de Solicitud ${t.costo > 0 && t.pagoMomento === 'antes' ? `+ Pago (${APP.money(t.costo)})` : ''}</span>
              </div>
              ${t.proceso.map((p, i) => `
                <div style="display:flex;align-items:center;gap:10px;font-size:13px">
                  <span style="width:24px;height:24px;border-radius:50%;background:var(--surface-2);color:var(--text-soft);display:grid;place-items:center;font-size:11px;font-weight:700">${i + 2}</span>
                  <span>Revisión: ${p.area} (${p.duracionDias}d)</span>
                </div>
              `).join('')}
              <div style="display:flex;align-items:center;gap:10px;font-size:13px">
                <span style="width:24px;height:24px;border-radius:50%;background:var(--brand-tint);color:var(--brand-dark);display:grid;place-items:center;font-size:11px;font-weight:700">
                  ${SVG_ICONS.check}
                </span>
                <span>${t.diasEntrega === 0 ? 'Emisión Electrónica Inmediata' : 'Entrega del Documento'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // MODAL DE RECETAS INTELIGENTES
    // =========================================================================
    function abrirSelectorRecetas() {
      APP.openModal(`
        <div class="modal-head" style="border-bottom:1px solid var(--border-soft);padding:18px 24px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center">
              ${SVG_ICONS.recipe}
            </div>
            <div>
              <h3 style="margin:0;font-size:17px;font-weight:900;color:var(--brand-dark);font-family:'Lato',sans-serif">Elegir Plantilla de Trámite Base</h3>
              <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">Seleccione una receta pre-configurada para acelerar el diseño</div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="APP.closeModal()" style="border:none;background:transparent;cursor:pointer;color:var(--text-muted);display:grid;place-items:center;width:32px;height:32px;border-radius:8px">
            ${SVG_ICONS.close}
          </button>
        </div>
        <div class="modal-body" style="padding:20px 24px">
          <div class="recipe-grid">
            ${STUDIO_RECIPES.map(r => `
              <div class="recipe-card" onclick="aplicarReceta('${r.id}')">
                <div class="recipe-icon">${SVG_ICONS[r.id === 'inmediata' ? 'entrega' : r.id === 'con-revision' ? 'solicitud' : 'aprobacion'] || SVG_ICONS.recipe}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                  <h4>${E(r.titulo)}</h4>
                  <span class="studio-badge active" style="height:24px;padding:0 8px;font-size:11px">${E(r.badge)}</span>
                </div>
                <p>${E(r.resumen)}</p>
                <div style="margin-top:10px;font-size:11.5px;color:var(--brand);font-weight:700">Ejemplos: ${E(r.ejemplos)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `, { wide: true });
    }

    function aplicarReceta(recetaId) {
      APP.closeModal();
      const nuevaBase = crearTramiteDesdeReceta(recetaId);
      if (CURRENT_T.nombre && CURRENT_T.nombre !== 'NUEVO TRÁMITE INSTITUCIONAL') {
        nuevaBase.nombre = CURRENT_T.nombre;
      }
      CURRENT_T = nuevaBase;
      renderStudioUI();
      APP.toast('Plantilla aplicada correctamente.', 'ok');
    }

    // =========================================================================
    // MODAL DEL CATÁLOGO DE REQUISITOS (Permite selección múltiple sin cerrarse)
    // =========================================================================
    let _filtroReqModal = '';

    function renderContentRequisitosModal(filtro = '') {
      _filtroReqModal = filtro;
      const allReqs = DB.requisitos() || [];
      const currentIds = (CURRENT_T.requisitos || []).map(r => r.id);
      const filtered = allReqs.filter(r => {
        if (!filtro) return true;
        const f = filtro.toLowerCase();
        return (r.titulo || '').toLowerCase().includes(f) || (r.id || '').toLowerCase().includes(f) || (r.formato || '').toLowerCase().includes(f);
      });

      return `
        <div class="modal-head" style="border-bottom:1px solid var(--border-soft);padding:18px 24px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center">
              ${SVG_ICONS.requisitos}
            </div>
            <div>
              <h3 style="margin:0;font-size:17px;font-weight:900;color:var(--brand-dark);font-family:'Lato',sans-serif">Catálogo Maestro de Requisitos</h3>
              <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">Seleccione uno o más requisitos para asignarlos al trámite</div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="APP.closeModal(); renderStudioUI();" style="border:none;background:transparent;cursor:pointer;color:var(--text-muted);display:grid;place-items:center;width:32px;height:32px;border-radius:8px">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="modal-body" style="padding:20px 24px;max-height:460px;overflow-y:auto">
          <!-- Buscador en tiempo real con icono SVG -->
          <div style="position:relative;margin-bottom:14px">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none;display:flex">
              ${SVG_ICONS.search}
            </span>
            <input type="text" id="req-modal-search" class="studio-input" style="padding-left:36px;height:38px;font-size:13px" placeholder="Buscar por nombre de requisito o formato (ej. DNI, PDF, Carta)..." value="${E(filtro)}" oninput="filtrarRequisitosModal(this.value)">
          </div>

          <div class="req-table-scroll-container">
            <table class="req-modal-table" style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--surface-2);border-bottom:1px solid var(--border-soft)">
                  <th style="width:60px;text-align:center;padding:10px 12px;font-weight:700;color:var(--text-soft);font-size:12px">Estado</th>
                  <th style="text-align:left;padding:10px 14px;font-weight:700;color:var(--text-soft);font-size:12px">Requisito Institucional</th>
                  <th style="width:90px;text-align:center;padding:10px 12px;font-weight:700;color:var(--text-soft);font-size:12px">Formato</th>
                  <th class="col-accion" style="font-weight:700;color:var(--text-soft);font-size:12px">Acción</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr><td colspan="4" style="text-align:center;padding:30px;color:var(--text-muted)">No se encontraron requisitos que coincidan con la búsqueda.</td></tr>
                ` : filtered.map(r => {
        const isSelected = currentIds.includes(r.id);
        return `
                    <tr style="border-bottom:1px solid var(--border-soft);background:${isSelected ? '#F0FAFA' : '#FFFFFF'};transition:background 0.15s ease">
                      <td class="col-estado" style="text-align:center;padding:10px 12px">
                        <span style="display:inline-flex;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;background:${isSelected ? 'var(--brand)' : 'var(--surface-2)'};color:${isSelected ? '#FFFFFF' : 'var(--text-muted)'};font-size:11px;font-weight:700">
                          ${isSelected ? SVG_ICONS.check : ''}
                        </span>
                      </td>
                      <td class="col-req" style="padding:10px 14px">
                        <b style="color:var(--text);font-size:13.5px">${E(r.titulo)}</b>
                        <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">Código: <span style="font-family:monospace">${E(r.id)}</span> · ${r.requiereAdjunto !== false ? 'Requiere adjuntar archivo digital' : 'Declaración en línea'}</div>
                        <!-- Plantilla / Documento descargable asociado (Word, Excel o PDF) -->
                        ${r.plantillaDoc ? `
                          <div class="modal-req-plantilla-row">
                            <span class="file-tag-badge ${r.plantillaDoc.tipo.toLowerCase()}">${r.plantillaDoc.tipo}</span>
                            <span class="file-name" title="${E(r.plantillaDoc.nombre)}">${E(r.plantillaDoc.nombre)}</span>
                            <span class="file-meta">(${E(r.plantillaDoc.peso || '40 KB')})</span>
                            <div style="margin-left:auto;display:flex;align-items:center;gap:5px">
                              <button type="button" class="btn-file-mini" onclick="descargarPlantillaSimulada('${r.id}')" title="Descargar documento plantilla">
                                ${SVG_ICONS.download}
                              </button>
                              <button type="button" class="btn-file-mini" onclick="abrirFileUploaderRequisito('${r.id}', 'modal')" title="Cambiar archivo plantilla (Word, Excel o PDF)">
                                ${SVG_ICONS.edit}
                              </button>
                              <button type="button" class="btn-file-mini danger" onclick="eliminarPlantillaRequisito('${r.id}', 'modal')" title="Eliminar documento adjunto">
                                ${SVG_ICONS.trash}
                              </button>
                            </div>
                          </div>
                        ` : `
                          <div style="margin-top:6px">
                            <button type="button" class="btn-adjuntar-mini" onclick="abrirFileUploaderRequisito('${r.id}', 'modal')" title="Adjuntar plantilla Word, Excel o PDF para este requisito">
                              ${SVG_ICONS.paperclip} <span>Adjuntar documento plantilla (Word, Excel o PDF)</span>
                            </button>
                          </div>
                        `}
                      </td>
                      <td class="col-formato" style="text-align:center;padding:10px 12px">
                        <span class="node-badge-chip" style="font-weight:700;text-transform:uppercase">${E(r.formato || 'PDF')}</span>
                      </td>
                      <td class="col-accion" style="text-align:center;padding:10px 14px">
                        <button type="button" class="btn-studio-secondary" style="padding:0 12px;font-size:12px;height:32px;width:100%;justify-content:center;${isSelected ? 'background:#ECFDF5;border-color:#A7F3D0;color:#065F46' : ''}" onclick="toggleRequisitoDesdeCatalogo('${r.id}')">
                          ${isSelected ? `${SVG_ICONS.check} <span>Asignado</span>` : `${SVG_ICONS.plus} <span>Agregar</span>`}
                        </button>
                      </td>
                    </tr>
                  `;
      }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-foot" style="padding:14px 24px;background:var(--surface-2);border-top:1px solid var(--border-soft);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div style="font-size:13px;color:var(--text-soft);display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--brand)"></span>
            <span><b>${(CURRENT_T.requisitos || []).length}</b> requisito(s) asignado(s)</span>
          </div>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn-studio-primary" style="background:#222222;border-color:#222222;height:38px;padding:0 22px;color:#FFFFFF" onclick="APP.closeModal(); renderStudioUI();">
              Listo / Guardar Selección
            </button>
          </div>
        </div>
      `;
    }

    function abrirModalCatalogoRequisitos() {
      _filtroReqModal = '';
      APP.openModal(renderContentRequisitosModal(''), { wide: true, className: 'modal-req-catalog-wrap' });
    }

    function filtrarRequisitosModal(valor) {
      _filtroReqModal = valor;
      const modalEl = document.querySelector('#ov .modal');
      if (modalEl) {
        modalEl.innerHTML = renderContentRequisitosModal(valor);
        const searchInput = document.getElementById('req-modal-search');
        if (searchInput) {
          searchInput.value = valor;
          searchInput.focus();
        }
      }
    }

    function toggleRequisitoDesdeCatalogo(reqId) {
      if (!CURRENT_T.requisitos) CURRENT_T.requisitos = [];
      const idx = CURRENT_T.requisitos.findIndex(r => r.id === reqId);
      const allReqs = DB.requisitos() || [];
      const req = allReqs.find(r => r.id === reqId);

      if (idx >= 0) {
        CURRENT_T.requisitos.splice(idx, 1);
        APP.toast('Requisito removido de la selección.', 'info');
      } else if (req) {
        CURRENT_T.requisitos.push({
          id: req.id,
          titulo: req.titulo,
          condiciones: 'Formato ' + (req.formato || 'PDF') + ' no mayor a 10MB.',
          adjuntarArchivo: req.requiereAdjunto !== false,
          activo: true
        });
        APP.toast('Requisito «' + req.titulo + '» agregado.', 'ok');
      }

      // Refrescar el cuerpo del modal sin cerrarlo
      const modalEl = document.querySelector('#ov .modal');
      if (modalEl) {
        modalEl.innerHTML = renderContentRequisitosModal(_filtroReqModal);
        const searchInput = document.getElementById('req-modal-search');
        if (searchInput && _filtroReqModal) {
          searchInput.value = _filtroReqModal;
          searchInput.focus();
        }
      }
    }

    function toggleRequisitoActivo(idx, activo) {
      if (CURRENT_T.requisitos && CURRENT_T.requisitos[idx]) {
        CURRENT_T.requisitos[idx].activo = activo;
        renderStudioUI();
      }
    }

    function quitarRequisito(idx) {
      if (CURRENT_T.requisitos && CURRENT_T.requisitos[idx]) {
        CURRENT_T.requisitos.splice(idx, 1);
        renderStudioUI();
        APP.toast('Requisito removido.', 'ok');
      }
    }

    // =========================================================================
    // GESTIÓN DE PLANTILLAS Y FORMATOS ADJUNTOS (Word, Excel, PDF)
    // =========================================================================
    window._reqIdParaAdjuntar = null;
    window._origenParaAdjuntar = null; // 'modal' | 'tab'

    function abrirFileUploaderRequisito(reqId, desde) {
      window._reqIdParaAdjuntar = reqId;
      window._origenParaAdjuntar = desde || 'tab';
      let fileInput = document.getElementById('studio-plantilla-file-input');
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'studio-plantilla-file-input';
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx';
        fileInput.style.display = 'none';
        fileInput.onchange = handleArchivoPlantillaSubido;
        document.body.appendChild(fileInput);
      }
      fileInput.value = '';
      fileInput.click();
    }

    function handleArchivoPlantillaSubido(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reqId = window._reqIdParaAdjuntar;
      const desde = window._origenParaAdjuntar;
      if (!reqId) return;

      const ext = file.name.split('.').pop().toLowerCase();
      let tipo = 'PDF';
      if (ext === 'doc' || ext === 'docx') tipo = 'WORD';
      else if (ext === 'xls' || ext === 'xlsx') tipo = 'EXCEL';
      else if (ext === 'pdf') tipo = 'PDF';

      const sizeKb = Math.round(file.size / 1024);
      const peso = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : (sizeKb || 14) + ' KB';

      const plantillaDoc = {
        nombre: file.name,
        tipo: tipo,
        peso: peso,
        fecha: new Date().toISOString().slice(0, 10)
      };

      DB.adjuntarPlantillaRequisito(reqId, plantillaDoc);

      // Si el requisito está asignado al trámite actual, sincronizar
      if (CURRENT_T && CURRENT_T.requisitos) {
        const rInT = CURRENT_T.requisitos.find(x => x.id === reqId);
        if (rInT) {
          rInT.plantillaDoc = plantillaDoc;
        }
      }

      APP.toast(`Documento «${file.name}» adjuntado correctamente.`, 'ok');
      e.target.value = '';

      if (desde === 'modal') {
        const modalEl = document.querySelector('#ov .modal');
        if (modalEl) {
          modalEl.innerHTML = renderContentRequisitosModal(_filtroReqModal);
        }
      } else {
        renderStudioUI();
      }
    }

    function descargarPlantillaSimulada(reqId) {
      const allReqs = DB.requisitos() || [];
      const req = allReqs.find(r => r.id === reqId);
      const p = req ? req.plantillaDoc : null;
      if (!p) {
        APP.toast('Este requisito no tiene documento adjunto.', 'err');
        return;
      }

      const contenido = `UNIVERSIDAD PRIVADA NORBERT WIENER\n` +
        `FORMATO INSTITUCIONAL DE TRÁMITES ACADÉMICOS\n` +
        `------------------------------------------------------------\n` +
        `Requisito: ${req.titulo} (Código: ${req.id})\n` +
        `Documento Base: ${p.nombre}\n` +
        `Tipo de Formato: ${p.tipo}\n` +
        `Fecha de Registro: ${p.fecha || '2026-06-10'}\n` +
        `------------------------------------------------------------\n` +
        `Indicaciones para el estudiante:\n` +
        `Descargue este formato oficial, complete la información solicitada\n` +
        `con sus datos institucionales y adjúntelo firmado digitalmente al portal.\n`;

      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = p.nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      APP.toast(`Descargando plantilla «${p.nombre}»...`, 'ok');
    }

    function eliminarPlantillaRequisito(reqId, desde) {
      DB.adjuntarPlantillaRequisito(reqId, null);
      if (CURRENT_T && CURRENT_T.requisitos) {
        const rInT = CURRENT_T.requisitos.find(x => x.id === reqId);
        if (rInT) rInT.plantillaDoc = null;
      }
      APP.toast('Plantilla adjunta retirada.', 'info');
      if (desde === 'modal') {
        const modalEl = document.querySelector('#ov .modal');
        if (modalEl) {
          modalEl.innerHTML = renderContentRequisitosModal(_filtroReqModal);
        }
      } else {
        renderStudioUI();
      }
    }

    // =========================================================================
    // MODAL DE CONTROL DE CALIDAD PREFLIGHT
    // =========================================================================
    function abrirPreflightModal() {
      const issues = diagnosticoPreflight();
      APP.openModal(`
        <div class="modal-head" style="border-bottom:1px solid var(--border-soft);padding:18px 24px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center">
              ${SVG_ICONS.preflight}
            </div>
            <div>
              <h3 style="margin:0;font-size:17px;font-weight:900;color:var(--brand-dark);font-family:'Lato',sans-serif">Control de Calidad (Preflight)</h3>
              <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">Diagnóstico de reglas, plazos y plantillas antes de publicar</div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="APP.closeModal()" style="border:none;background:transparent;cursor:pointer;color:var(--text-muted);display:grid;place-items:center;width:32px;height:32px;border-radius:8px">
            ${SVG_ICONS.close}
          </button>
        </div>
        <div class="modal-body" style="padding:20px 24px">
          ${issues.length === 0 ? `
            <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:24px;text-align:center">
              <div style="width:48px;height:48px;border-radius:50%;background:#D1FAE5;color:#047857;display:grid;place-items:center;margin:0 auto 10px">
                ${SVG_ICONS.checkCircle}
              </div>
              <h4 style="margin:8px 0 4px;color:#065F46;font-size:16px;font-weight:900">¡Trámite 100% Coherente y Listo!</h4>
              <p style="margin:0;font-size:13px;color:#047857">No se detectaron inconsistencias en las reglas ni en los plazos de atención.</p>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:12px">
              ${issues.map(iss => `
                <div style="padding:14px;border-radius:10px;border:1px solid ${iss.tipo === 'error' ? '#FCA5A5' : '#FDE68A'};background:${iss.tipo === 'error' ? '#FEF2F2' : '#FFFBEB'};display:flex;gap:12px;align-items:start">
                  <span style="display:flex;margin-top:2px;color:${iss.tipo === 'error' ? '#DC2626' : '#D97706'}">
                    ${iss.tipo === 'error' ? SVG_ICONS.error : SVG_ICONS.warning}
                  </span>
                  <div>
                    <b style="font-size:13.5px;color:${iss.tipo === 'error' ? '#991B1B' : '#92400E'}">${iss.tipo === 'error' ? 'Error Bloqueante' : 'Sugerencia Institucional'}</b>
                    <p style="margin:3px 0 0;font-size:13px;color:var(--text);line-height:1.45">${E(iss.msg)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="modal-foot" style="padding:14px 24px;background:var(--surface-2);border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end">
          <button type="button" class="btn-studio-primary" style="background:#222222;border-color:#222222;height:38px;padding:0 22px" onclick="APP.closeModal()">
            Entendido
          </button>
        </div>
      `, { wide: true });
    }

    // =========================================================================
    // ACCIONES DEL PROCESO Y NAVEGACIÓN
    // =========================================================================
    function cambiarTab(tab) {
      ACTIVE_TAB = tab;
      const navInner = document.querySelector('.studio-nav-inner');
      const scrollBefore = navInner ? navInner.scrollLeft : 0;
      renderStudioUI();
      const navInnerAfter = document.querySelector('.studio-nav-inner');
      if (navInnerAfter) {
        navInnerAfter.scrollLeft = scrollBefore;
        const activeBtn = navInnerAfter.querySelector('.studio-tab-btn.active');
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }

    function seleccionarPaso(k) {
      SELECTED_STEP_KEY = k;
      const slot = document.getElementById('studio-inspector-slot');
      if (slot) {
        slot.innerHTML = renderInspectorPanelHTML();
        // Hidratar selects personalizados del inspector
        if (window.APP && window.APP.initCustomSelects) {
          window.APP.initCustomSelects(slot);
        }
      }
      document.querySelectorAll('.timeline-node-card').forEach(c => c.classList.remove('selected'));
      const activeCard = document.querySelector(`[onclick="seleccionarPaso('${k}')"]`);
      if (activeCard) activeCard.classList.add('selected');
    }

    function cambiarEstadoActivo(activo) {
      if (CURRENT_T.activo === activo) return;
      CURRENT_T.activo = activo;
      renderStudioUI();
      APP.toast(CURRENT_T.activo ? 'Trámite marcado como ACTIVO en catálogo.' : 'Trámite cambiado a modo BORRADOR (Oculto).', 'ok');
    }

    function toggleEstadoActivo() {
      cambiarEstadoActivo(!CURRENT_T.activo);
    }

    function actualizarTitulo(v) {
      CURRENT_T.nombre = v;
      const fraseEl = document.getElementById('studio-live-frase');
      if (fraseEl) fraseEl.innerText = generarFraseResumen();
    }

    function actualizarCampo(campo, val) {
      CURRENT_T[campo] = val;
      renderStudioUI();
    }

    function actualizarCosto(val) {
      CURRENT_T.costo = Number(val) || 0;
      renderStudioUI();
    }

    function actualizarMomentoPago(val) {
      CURRENT_T.pagoMomento = val;
      renderStudioUI();
    }

    function actualizarConceptoCaja(val) {
      CURRENT_T.conceptoCodigo = val;
      const conceptos = DB.conceptos() || [];
      const match = conceptos.find(c => c.codigo === val);
      if (match) {
        CURRENT_T.conceptoServicio = match.descripcion;
        if (CURRENT_T.costo === 0) CURRENT_T.costo = match.monto;
      }
      renderStudioUI();
    }

    function actualizarEtapa(idx, campo, val) {
      if (CURRENT_T.proceso[idx]) {
        CURRENT_T.proceso[idx][campo] = val;
        renderStudioUI();
      }
    }

    function moverArea(idx, delta) {
      const arr = CURRENT_T.proceso;
      const target = idx + delta;
      if (target < 0 || target >= arr.length) return;
      const temp = arr[idx];
      arr[idx] = arr[target];
      arr[target] = temp;
      SELECTED_STEP_KEY = 'rev_' + target;
      renderStudioUI();
    }

    // =========================================================================
    // DRAG & DROP INTUITIVO Y ROBUSTO PARA ETAPAS DE REVISIÓN EN TIMELINE
    // =========================================================================
    let _draggedRevIdx = null;
    let _dropTargetIdx = null;
    let _dropPlacement = null; // 'before' | 'after'

    function onRevisionDragStart(e, idx) {
      _draggedRevIdx = idx;
      _dropTargetIdx = null;
      _dropPlacement = null;

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(idx));
      }

      document.body.classList.add('timeline-is-dragging');
      const card = e.currentTarget;
      setTimeout(() => {
        if (card) card.classList.add('is-dragging');
      }, 0);
    }

    function onRevisionDragOver(e, targetIdx) {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      if (_draggedRevIdx === null || _draggedRevIdx === targetIdx) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const relY = e.clientY - rect.top;

      // Umbrales generosos e intuitivos según dirección del arrastre
      let isBefore = false;
      if (_draggedRevIdx < targetIdx) {
        // Arrastrando hacia abajo: favorecer inserción posterior salvo si está bien arriba
        isBefore = relY < (rect.height * 0.35);
      } else {
        // Arrastrando hacia arriba: favorecer inserción anterior salvo si está bien abajo
        isBefore = relY < (rect.height * 0.65);
      }

      _dropTargetIdx = targetIdx;
      _dropPlacement = isBefore ? 'before' : 'after';

      document.querySelectorAll('.timeline-node-card').forEach(c => {
        if (c !== card) c.classList.remove('drop-indicator-top', 'drop-indicator-bottom');
      });

      card.classList.toggle('drop-indicator-top', isBefore);
      card.classList.toggle('drop-indicator-bottom', !isBefore);
    }

    function onRevisionDragLeave(e, targetIdx) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
        card.classList.remove('drop-indicator-top', 'drop-indicator-bottom');
        if (_dropTargetIdx === targetIdx) {
          _dropTargetIdx = null;
          _dropPlacement = null;
        }
      }
    }

    function onRevisionDrop(e, targetIdx) {
      e.preventDefault();
      const fromIdx = _draggedRevIdx;
      const target = _dropTargetIdx !== null ? _dropTargetIdx : targetIdx;
      const isBefore = _dropPlacement ? (_dropPlacement === 'before') : (fromIdx > target);

      document.body.classList.remove('timeline-is-dragging');
      document.querySelectorAll('.timeline-node-card').forEach(c => {
        c.classList.remove('is-dragging', 'drop-indicator-top', 'drop-indicator-bottom');
      });

      _draggedRevIdx = null;
      _dropTargetIdx = null;
      _dropPlacement = null;

      if (fromIdx === null || target === null || fromIdx === target) return;

      reordenarRevisionDesdeDrag(fromIdx, target, isBefore);
    }

    function onRevisionDragEnd(e) {
      document.body.classList.remove('timeline-is-dragging');
      _draggedRevIdx = null;
      _dropTargetIdx = null;
      _dropPlacement = null;
      document.querySelectorAll('.timeline-node-card').forEach(c => {
        c.classList.remove('is-dragging', 'drop-indicator-top', 'drop-indicator-bottom');
      });
    }

    function reordenarRevisionDesdeDrag(fromIdx, targetIdx, insertBefore) {
      const arr = CURRENT_T.proceso;
      if (!arr || fromIdx < 0 || fromIdx >= arr.length) return;
      if (targetIdx < 0 || targetIdx >= arr.length) return;
      if (fromIdx === targetIdx) return;

      const [movedItem] = arr.splice(fromIdx, 1);
      let finalIdx;

      if (fromIdx < targetIdx) {
        // Al mover hacia abajo, el target original redujo en 1 su índice tras el splice
        finalIdx = insertBefore ? (targetIdx - 1) : targetIdx;
      } else {
        // Al mover hacia arriba, los elementos subsiguientes se mantienen
        finalIdx = insertBefore ? targetIdx : (targetIdx + 1);
      }

      if (finalIdx < 0) finalIdx = 0;
      if (finalIdx > arr.length) finalIdx = arr.length;

      arr.splice(finalIdx, 0, movedItem);
      SELECTED_STEP_KEY = 'rev_' + finalIdx;
      renderStudioUI();
      APP.toast(`Etapa «${movedItem.area}» reordenada al paso ${finalIdx + 1}.`, 'ok');
    }

    function eliminarArea(idx) {
      CURRENT_T.proceso.splice(idx, 1);
      SELECTED_STEP_KEY = 'sol';
      renderStudioUI();
      APP.toast('Etapa eliminada del flujo.', 'ok');
    }

    function agregarAreaAlFinal() {
      const areas = DB.areas() || [];
      const defaultArea = areas[0] ? areas[0].nombre : 'Registros Académicos';
      CURRENT_T.proceso.push({
        id: 'P-' + Date.now().toString().slice(-4),
        area: defaultArea,
        descripcion: 'Revisión y validación institucional',
        duracionDias: 2,
        activo: true
      });
      SELECTED_STEP_KEY = 'rev_' + (CURRENT_T.proceso.length - 1);
      renderStudioUI();
      APP.toast('Nueva área de revisión añadida.', 'ok');
    }

    function insertarPasoIntermedio(pos) {
      const areas = DB.areas() || [];
      const defaultArea = areas[0] ? areas[0].nombre : 'Registros Académicos';
      CURRENT_T.proceso.splice(pos, 0, {
        id: 'P-' + Date.now().toString().slice(-4),
        area: defaultArea,
        descripcion: 'Revisión intermedia',
        duracionDias: 2,
        activo: true
      });
      SELECTED_STEP_KEY = 'rev_' + pos;
      renderStudioUI();
      APP.toast('Paso insertado en la posición elegida.', 'ok');
    }

    function toggleAudienciaArray(campo, valor) {
      const arr = CURRENT_T.audiencia[campo] || [];
      const idx = arr.indexOf(valor);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(valor);
      CURRENT_T.audiencia[campo] = arr;
      renderStudioUI();
    }

    function toggleAudienciaCiclo(ciclo) {
      const arr = CURRENT_T.audiencia.ciclos || [];
      const idx = arr.indexOf(ciclo);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(ciclo);
      CURRENT_T.audiencia.ciclos = arr;
      renderStudioUI();
    }

    function toggleTodosCiclos() {
      const CICLOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      if (!CURRENT_T.audiencia) CURRENT_T.audiencia = {};
      const arr = CURRENT_T.audiencia.ciclos || [];
      if (arr.length === CICLOS.length) {
        CURRENT_T.audiencia.ciclos = [];
        APP.toast('Ciclos desmarcados (aplica a todos los ciclos por defecto).', 'info');
      } else {
        CURRENT_T.audiencia.ciclos = [...CICLOS];
        APP.toast('Se marcaron todos los ciclos académicos.', 'ok');
      }
      renderStudioUI();
    }

    function actualizarAudiencia(campo, val) {
      CURRENT_T.audiencia[campo] = val;
      renderStudioUI();
    }

    function actualizarPlantilla(campo, val) {
      if (!CURRENT_T.plantilla) CURRENT_T.plantilla = {};
      CURRENT_T.plantilla[campo] = val;
    }

    function toggleSimulador(abrir) {
      SIMULATOR_OPEN = abrir;
      const el = document.getElementById('studio-simulator-drawer');
      if (el) {
        if (abrir) {
          el.classList.add('open');
          if (window.APP && window.APP.initCustomSelects) {
            window.APP.initCustomSelects(el);
          }
        } else {
          el.classList.remove('open');
        }
      }
    }

    function cambiarAlumnoSimulador(codigo) {
      SIMULATOR_STUDENT_CODE = codigo;
      const el = document.getElementById('studio-simulator-drawer');
      if (el) {
        el.innerHTML = renderSimulatorContentHTML();
        if (window.APP && window.APP.initCustomSelects) {
          window.APP.initCustomSelects(el);
        }
      }
    }

    function cambiarTramiteEnEdicion(tramiteId) {
      if (isDirty()) {
        mostrarModalConfirmacion({
          titulo: 'Cambios sin guardar',
          mensaje: 'Tiene modificaciones sin guardar en el trámite actual. ¿Desea descartarlas y cargar otro trámite?',
          textoConfirmar: 'Descartar y Cargar',
          textoCancelar: 'Continuar Editando',
          onConfirm: () => {
            ORIGINAL_JSON = JSON.stringify(CURRENT_T);
            if (tramiteId) window.location.search = '?id=' + encodeURIComponent(tramiteId);
            else window.location.search = '';
          },
          onCancel: () => {
            const sel = document.getElementById('studio-select-tramite');
            if (sel) {
              if (sel._wienerCustomSelect) {
                sel._wienerCustomSelect.setValue(CURRENT_T.id || '');
              } else {
                sel.value = CURRENT_T.id || '';
              }
            }
          }
        });
        return;
      }

      if (tramiteId) {
        window.location.search = '?id=' + encodeURIComponent(tramiteId);
      } else {
        window.location.search = '';
      }
    }

    function verificarSalirSinGuardar(e) {
      if (isDirty()) {
        if (e && e.preventDefault) e.preventDefault();
        mostrarModalConfirmacion({
          titulo: 'Cambios sin guardar',
          mensaje: 'Tiene modificaciones sin guardar en Trámite Studio. Si vuelve al catálogo ahora, se perderán todos los cambios no guardados.',
          textoConfirmar: 'Descartar y Volver',
          textoCancelar: 'Continuar Editando',
          onConfirm: () => {
            ORIGINAL_JSON = JSON.stringify(CURRENT_T);
            window.location.href = 'tramites.html';
          }
        });
        return false;
      }
      return true;
    }

    // =========================================================================
    // GUARDAR TRÁMITE EN BASE DE DATOS LOCAL
    // =========================================================================
    function guardarTramiteStudio() {
      const t = CURRENT_T;
      if (!t.nombre || t.nombre.trim().length < 3) {
        APP.toast('Por favor ingrese un nombre descriptivo para el trámite.', 'error');
        return;
      }

      if (!t.id) {
        t.id = 'T-' + String(DB.tramites().length + 1).padStart(3, '0');
        if (!t.codigo) t.codigo = t.id;
      }

      t.proceso.forEach((p, i) => {
        p.orden = i + 1;
        if (!p.id) p.id = 'P-' + (i + 1);
        if (p.activo === undefined) p.activo = true;
      });

      if (!Array.isArray(t.cronogramas)) t.cronogramas = [];
      if (!Array.isArray(t.correos)) t.correos = [];
      t.permiteEmisionMasiva = Boolean(t.permiteEmisionMasiva);
      t.plazoRecojoDias = t.diasEntrega || 3;
      t.tiempoVigenciaHrs = Number(t.tiempoVigenciaHrs) || 48;
      if (!t.observacion) t.observacion = '';
      if (!t.tipoActivacion) t.tipoActivacion = 'Permanente';
      if (!t.conceptoServicio) t.conceptoServicio = t.nombre || '';

      DB.upsertTramite(t);
      ORIGINAL_JSON = JSON.stringify(t);

      APP.toast('¡Trámite «' + t.nombre + '» guardado exitosamente!', 'ok');
      renderStudioUI();
    }

    // Arrancar la aplicación
    initStudio();


// Exposición explícita en window para compatibilidad con templates dinámicos
window.E = E;
window.rteCommand = rteCommand;
window.updateCharCounter = updateCharCounter;
window.obtenerAlumnosMock = obtenerAlumnosMock;
window.mostrarModalConfirmacion = mostrarModalConfirmacion;
window.cerrarModalConfirmacion = cerrarModalConfirmacion;
window.initStudio = initStudio;
window.normalizarTramite = normalizarTramite;
window.esTramiteConDocumento = esTramiteConDocumento;
window.setGeneraDocumento = setGeneraDocumento;
window.setEmisionMasiva = setEmisionMasiva;
window.crearTramiteDesdeReceta = crearTramiteDesdeReceta;
window.isDirty = isDirty;
window.obtenerParadasTimeline = obtenerParadasTimeline;
window.generarFraseResumen = generarFraseResumen;
window.diagnosticoPreflight = diagnosticoPreflight;
window.renderStudioUI = renderStudioUI;
window.renderTimelineNodesHTML = renderTimelineNodesHTML;
window.obtenerSubtituloPorDefecto = obtenerSubtituloPorDefecto;
window.renderInspectorPanelHTML = renderInspectorPanelHTML;
window.renderRequisitosTabHTML = renderRequisitosTabHTML;
window.renderAudienciaTabHTML = renderAudienciaTabHTML;
window.renderDocumentoTabHTML = renderDocumentoTabHTML;
window.dibujarCanvasModelo = dibujarCanvasModelo;
window.actualizarCanvasEnVivo = actualizarCanvasEnVivo;
window.insertarTag = insertarTag;
window.renderNotificacionesTabHTML = renderNotificacionesTabHTML;
window.abrirSubformCorreoStudio = abrirSubformCorreoStudio;
window.cerrarSubformCorreoStudio = cerrarSubformCorreoStudio;
window.alCambiarEstadoMailSubform = alCambiarEstadoMailSubform;
window.actualizarColorTagPreview = actualizarColorTagPreview;
window.guardarSubformCorreoStudio = guardarSubformCorreoStudio;
window.toggleCorreoActivoStudio = toggleCorreoActivoStudio;
window.confirmarQuitarCorreoStudio = confirmarQuitarCorreoStudio;
window.insertarTagCorreo = insertarTagCorreo;
window.renderCronogramaTabHTML = renderCronogramaTabHTML;
window.cambiarTipoActivacionStudio = cambiarTipoActivacionStudio;
window.cronogAgregarRangoStudio = cronogAgregarRangoStudio;
window.cronogCambiarGradoStudio = cronogCambiarGradoStudio;
window.cronogActualizarCampoStudio = cronogActualizarCampoStudio;
window.confirmarQuitarRangoStudio = confirmarQuitarRangoStudio;
window.abrirModalCatalogoConceptos = abrirModalCatalogoConceptos;
window.renderContentConceptosModal = renderContentConceptosModal;
window.filtrarConceptosModal = filtrarConceptosModal;
window.seleccionarConceptoStudio = seleccionarConceptoStudio;
window.renderSimulatorContentHTML = renderSimulatorContentHTML;
window.abrirSelectorRecetas = abrirSelectorRecetas;
window.aplicarReceta = aplicarReceta;
window.renderContentRequisitosModal = renderContentRequisitosModal;
window.abrirModalCatalogoRequisitos = abrirModalCatalogoRequisitos;
window.filtrarRequisitosModal = filtrarRequisitosModal;
window.toggleRequisitoDesdeCatalogo = toggleRequisitoDesdeCatalogo;
window.toggleRequisitoActivo = toggleRequisitoActivo;
window.quitarRequisito = quitarRequisito;
window.abrirFileUploaderRequisito = abrirFileUploaderRequisito;
window.handleArchivoPlantillaSubido = handleArchivoPlantillaSubido;
window.descargarPlantillaSimulada = descargarPlantillaSimulada;
window.eliminarPlantillaRequisito = eliminarPlantillaRequisito;
window.abrirPreflightModal = abrirPreflightModal;
window.cambiarTab = cambiarTab;
window.seleccionarPaso = seleccionarPaso;
window.cambiarEstadoActivo = cambiarEstadoActivo;
window.toggleEstadoActivo = toggleEstadoActivo;
window.actualizarTitulo = actualizarTitulo;
window.actualizarCampo = actualizarCampo;
window.actualizarCosto = actualizarCosto;
window.actualizarMomentoPago = actualizarMomentoPago;
window.actualizarConceptoCaja = actualizarConceptoCaja;
window.actualizarEtapa = actualizarEtapa;
window.moverArea = moverArea;
window.onRevisionDragStart = onRevisionDragStart;
window.onRevisionDragOver = onRevisionDragOver;
window.onRevisionDragLeave = onRevisionDragLeave;
window.onRevisionDrop = onRevisionDrop;
window.onRevisionDragEnd = onRevisionDragEnd;
window.reordenarRevisionDesdeDrag = reordenarRevisionDesdeDrag;
window.eliminarArea = eliminarArea;
window.agregarAreaAlFinal = agregarAreaAlFinal;
window.insertarPasoIntermedio = insertarPasoIntermedio;
window.toggleAudienciaArray = toggleAudienciaArray;
window.toggleAudienciaCiclo = toggleAudienciaCiclo;
window.toggleTodosCiclos = toggleTodosCiclos;
window.actualizarAudiencia = actualizarAudiencia;
window.actualizarPlantilla = actualizarPlantilla;
window.toggleSimulador = toggleSimulador;
window.cambiarAlumnoSimulador = cambiarAlumnoSimulador;
window.cambiarTramiteEnEdicion = cambiarTramiteEnEdicion;
window.verificarSalirSinGuardar = verificarSalirSinGuardar;
window.guardarTramiteStudio = guardarTramiteStudio;
