// admin/procesar.js - Estadísticas de Procesar Trámites Wiener Admin

const ctx = APP.renderShell('procesar');

// Estado institucional seleccionado
let currentInst = 'Wiener';
let chartType = 'pie'; // 'pie' o 'donut'
let activeSliceId = null;

// Conjunto de datos estadísticos por institución (fuente oficial consolidada)
const DATA_STATS = {
  'Wiener': {
    codigo: 'Wiener',
    nombre: 'Universidad Privada Norbert Wiener S.A.',
    sedePrincipal: 'Campus Central Lima',
    filas: [
      { id: 'vencidos', estado: 'Tramites vencidos, pendientes de eliminacion', nro: 0, color: '#94A3B8', targetEstado: null, accion: 'Auditar', vigente: false },
      { id: 'solicitados', estado: 'Tramites solicitados para iniciar', nro: 833, color: '#F97316', targetEstado: 'Solicitado', accion: 'Ver trámites', vigente: true },
      { id: 'cancelados', estado: 'Tramite Cancelado o No Procede', nro: 16570, color: '#F59E0B', targetEstado: 'Cancelar', accion: 'Ver trámites', vigente: true },
      { id: 'pendientes', estado: 'Pendiente', nro: 12910, color: '#10B981', targetEstado: 'En revisión', accion: 'Ver trámites', vigente: true },
      { id: 'procede', estado: 'Procede', nro: 4620, color: '#8B5CF6', targetEstado: 'Aprobado', accion: 'Ver trámites', vigente: true },
      { id: 'entregado', estado: 'Entregado', nro: 20413, color: '#0F848F', targetEstado: 'Emitido', accion: 'Ver trámites', vigente: true },
      { id: 'observado', estado: 'Observado', nro: 16231, color: '#EC4899', targetEstado: 'Observado', accion: 'Ver trámites', vigente: true }
    ]
  },
  'Carrion': {
    codigo: 'Carrion',
    nombre: 'I.E.S. Particular Daniel Alcides Carrión',
    sedePrincipal: 'Sede Central Av. Brasil',
    filas: [
      { id: 'vencidos', estado: 'Tramites vencidos, pendientes de eliminacion', nro: 0, color: '#94A3B8', targetEstado: null, accion: 'Auditar', vigente: false },
      { id: 'solicitados', estado: 'Tramites solicitados para iniciar', nro: 512, color: '#F97316', targetEstado: 'Solicitado', accion: 'Ver trámites', vigente: true },
      { id: 'cancelados', estado: 'Tramite Cancelado o No Procede', nro: 10840, color: '#F59E0B', targetEstado: 'Cancelar', accion: 'Ver trámites', vigente: true },
      { id: 'pendientes', estado: 'Pendiente', nro: 8490, color: '#10B981', targetEstado: 'En revisión', accion: 'Ver trámites', vigente: true },
      { id: 'procede', estado: 'Procede', nro: 3110, color: '#8B5CF6', targetEstado: 'Aprobado', accion: 'Ver trámites', vigente: true },
      { id: 'entregado', estado: 'Entregado', nro: 13420, color: '#0F848F', targetEstado: 'Emitido', accion: 'Ver trámites', vigente: true },
      { id: 'observado', estado: 'Observado', nro: 10840, color: '#EC4899', targetEstado: 'Observado', accion: 'Ver trámites', vigente: true }
    ]
  }
};

function formatNumber(n) {
  return Number(n || 0).toLocaleString('es-PE');
}

function cambiarInstitucion(val) {
  currentInst = val;
  render();
  APP.toast({
    icon: '🏛️',
    title: 'Institución seleccionada',
    body: 'Cargando estadísticas para ' + (val === 'Wiener' ? 'Universidad Norbert Wiener' : 'Instituto Carrión')
  });
}

function setChartType(type) {
  chartType = type;
  render();
}

function ejecutarAccion(targetEstado, estadoNombre) {
  if (!targetEstado) {
    // Trámites vencidos
    APP.openModal(`
      <div class="modal-head">
        <h3>Depuración y Trámites Vencidos</h3>
        <button class="modal-close" onclick="APP.closeModal()">×</button>
      </div>
      <div class="modal-body modal-body-depuracion">
        <div class="depuracion-center-block">
          <div class="depuracion-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h4 class="depuracion-title">No existen trámites vencidos para depurar</h4>
          <p class="depuracion-desc">
            Los registros institucionales de <b>${DATA_STATS[currentInst].nombre}</b> se encuentran al día. La política de retención reglamentaria de solicitudes inactivas opera de manera automática al término de cada semestre lectivo.
          </p>
        </div>
        <div class="resp-item depuracion-info-card">
          <div>
            <b class="depuracion-period-label">Período de auditoría:</b>
            <div class="depuracion-period-sub">Semestre Regular 2026-I / 2026-II · 0 registros pendientes de eliminación</div>
          </div>
          <span class="pill ok no-dot">Conforme</span>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-primary" onclick="APP.closeModal()">Entendido</button>
      </div>
    `);
    return;
  }

  // Redirige a la vista de trámites con el filtro pre-seleccionado
  const targetUrl = 'solicitudes.html?estado=' + encodeURIComponent(targetEstado) + '&institucion=' + encodeURIComponent(currentInst);
  location.href = targetUrl;
}

function exportarCSV() {
  const instData = DATA_STATS[currentInst];
  const headers = ['Estado', 'Nro. de tramites', 'Porcentaje'];
  const total = instData.filas.reduce((acc, f) => acc + f.nro, 0);
  
  const rows = instData.filas.map(f => {
    const pct = total > 0 ? ((f.nro / total) * 100).toFixed(1) + '%' : '0%';
    return `"${f.estado}",${f.nro},"${pct}"`;
  });
  rows.push(`"TOTAL GENERAL",${total},"100.0%"`);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `reporte_procesar_${currentInst.toLowerCase()}_2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  APP.toast({
    icon: '📥',
    title: 'Reporte descargado',
    body: 'El archivo CSV de estadísticas ha sido generado correctamente.'
  });
}

function imprimirReporte() {
  window.print();
}

// Funciones de interacción entre gráfico, leyenda y tabla
function highlightItem(id) {
  activeSliceId = id;
  document.querySelectorAll('.pie-slice').forEach(el => {
    if (el.dataset.id === id) {
      el.classList.add('highlighted');
    } else {
      el.style.opacity = '0.35';
    }
  });
  document.querySelectorAll('.pie-legend-item').forEach(el => {
    if (el.dataset.id === id) el.classList.add('active');
    else el.classList.remove('active');
  });
  document.querySelectorAll('.procesar-table tbody tr').forEach(el => {
    if (el.dataset.id === id) el.classList.add('row-highlight');
    else el.classList.remove('row-highlight');
  });
}

function clearHighlight() {
  activeSliceId = null;
  document.querySelectorAll('.pie-slice').forEach(el => {
    el.classList.remove('highlighted');
    el.style.opacity = '1';
  });
  document.querySelectorAll('.pie-legend-item').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelectorAll('.procesar-table tbody tr').forEach(el => {
    el.classList.remove('row-highlight');
  });
  hideTooltip();
}

function showTooltip(e, text) {
  const tip = document.getElementById('chart-tooltip');
  if (!tip) return;
  tip.innerHTML = text;
  tip.classList.add('visible');
  const wrap = document.querySelector('.pie-chart-wrapper');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function hideTooltip() {
  const tip = document.getElementById('chart-tooltip');
  if (tip) tip.classList.remove('visible');
}

// Generador geométrico SVG para gráfico de torta / dona
function generatePieChartSVG(slices, totalVigentes) {
  const cx = 180;
  const cy = 180;
  const r = 135;
  const innerR = chartType === 'donut' ? 68 : 0;
  let startAngle = -Math.PI / 2; // Comenzar en la parte superior (12 en punto)

  let pathsHtml = '';
  let labelsHtml = '';

  slices.forEach((s, idx) => {
    if (s.nro <= 0) return;
    const angle = (s.nro / totalVigentes) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    // Puntos exteriores
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    let d = '';

    if (innerR > 0) {
      // Gráfico de dona
      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(endAngle);
      const iy2 = cy + innerR * Math.sin(endAngle);
      d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    } else {
      // Gráfico de torta completo
      d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    const pct = ((s.nro / totalVigentes) * 100).toFixed(1);
    const pctFormatted = pct.endsWith('.0') ? parseInt(pct) + '%' : pct + '%';

    // Etiqueta de porcentaje dentro del sector (si es suficientemente grande)
    if ((s.nro / totalVigentes) >= 0.04) {
      const midAngle = startAngle + (angle / 2);
      const labelR = innerR > 0 ? (innerR + (r - innerR) * 0.55) : (r * 0.65);
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);
      labelsHtml += `
        <text x="${lx}" y="${ly}" class="pie-center-info pie-pct-label" fill="#FFFFFF" font-family="'Lato', sans-serif" font-weight="700" font-size="12px">
          ${pctFormatted}
        </text>
      `;
    }

    pathsHtml += `
      <path d="${d}" fill="${s.color}" data-id="${s.id}" class="pie-slice"
        onmouseenter="highlightItem('${s.id}'); showTooltip(event, '<b>${s.estado}</b><br>${formatNumber(s.nro)} trámites (${pctFormatted})')"
        onmousemove="showTooltip(event, '<b>${s.estado}</b><br>${formatNumber(s.nro)} trámites (${pctFormatted})')"
        onmouseleave="clearHighlight()"
        onclick="ejecutarAccion('${s.targetEstado||''}', '${s.estado}')">
      </path>
    `;

    startAngle = endAngle;
  });

  let centerText = '';
  if (innerR > 0) {
    centerText = `
      <text x="${cx}" y="${cy - 8}" class="pie-center-info" fill="var(--text-muted)" font-size="11px" font-weight="700" letter-spacing="0.05em">VIGENTES</text>
      <text x="${cx}" y="${cy + 12}" class="pie-center-info" fill="var(--brand-dark)" font-size="15px" font-weight="900" font-family="'Lato', sans-serif">${formatNumber(totalVigentes)}</text>
    `;
  }

  return `
    <svg viewBox="0 0 360 360" class="pie-chart-svg" xmlns="http://www.w3.org/2000/svg">
      <g>
        ${pathsHtml}
        ${labelsHtml}
        ${centerText}
      </g>
    </svg>
  `;
}

function render() {
  const instData = DATA_STATS[currentInst];
  const totalGeneral = instData.filas.reduce((acc, f) => acc + f.nro, 0);
  
  // Los trámites vigentes para el gráfico de torta son aquellos activos en gestión (excluyendo vencidos con 0)
  const slices = instData.filas.filter(f => f.vigente && f.nro > 0);
  const totalVigentes = slices.reduce((acc, f) => acc + f.nro, 0);

  // Métricas superiores (KPIs)
  const countSolicitados = instData.filas.find(f => f.id === 'solicitados')?.nro || 0;
  const countPendientes = instData.filas.find(f => f.id === 'pendientes')?.nro || 0;
  const countProcede = instData.filas.find(f => f.id === 'procede')?.nro || 0;
  const countEntregados = instData.filas.find(f => f.id === 'entregado')?.nro || 0;
  const countObservados = instData.filas.find(f => f.id === 'observado')?.nro || 0;
  const countCancelados = instData.filas.find(f => f.id === 'cancelados')?.nro || 0;

  // Generación de filas de la tabla
  const tableRows = instData.filas.map(f => {
    const pct = totalGeneral > 0 ? ((f.nro / totalGeneral) * 100).toFixed(1) : '0';
    return `
      <tr data-id="${f.id}" onmouseenter="highlightItem('${f.id}')" onmouseleave="clearHighlight()">
        <td>
          <div class="procesar-state-cell">
            <span class="procesar-status-dot" style="background:${f.color}"></span>
            <span class="procesar-state-name">${f.estado}</span>
          </div>
        </td>
        <td class="procesar-number-cell">
          ${formatNumber(f.nro)}
          <span class="procesar-pct-sub">(${pct}%)</span>
        </td>
        <td class="procesar-action-cell">
          <button class="btn btn-sm ${f.targetEstado ? 'btn-outline' : 'btn-secondary'} btn-procesar-action" onclick="ejecutarAccion('${f.targetEstado || ''}', '${f.estado}')">
            ${f.accion}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Generación de la leyenda del gráfico
  const legendRows = slices.map(s => {
    const pct = totalVigentes > 0 ? ((s.nro / totalVigentes) * 100).toFixed(1) : '0';
    return `
      <div class="pie-legend-item" data-id="${s.id}"
        onmouseenter="highlightItem('${s.id}')"
        onmouseleave="clearHighlight()"
        onclick="ejecutarAccion('${s.targetEstado||''}', '${s.estado}')">
        <div class="pie-legend-left">
          <span class="pie-legend-dot" style="background:${s.color}"></span>
          <span class="pie-legend-name">${s.estado}</span>
        </div>
        <div class="pie-legend-right">
          <span class="pie-legend-count">${formatNumber(s.nro)}</span>
          <span class="pie-legend-percent">${pct}%</span>
        </div>
      </div>
    `;
  }).join('');

  ctx.mount.innerHTML = `
    <div class="procesar-container">
      <!-- Encabezado estandarizado con el sistema de diseño Wiener -->
      <div class="page-head">
        <div>
          <h1>Procesar Trámites</h1>
          <p>Consolidado estadístico, estados operativos y balance de trámites vigentes por institución.</p>
        </div>
        <div class="page-head-actions-wrap">
          <button class="btn btn-outline" onclick="imprimirReporte()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
            Imprimir
          </button>
          <button class="btn btn-outline" onclick="exportarCSV()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Exportar datos
          </button>
        </div>
      </div>

      <!-- Selector Institucional Contextual -->
      <div class="vt-top-meta">
        <div class="vt-inst-selector">
          <span class="inst-select-label">Institución:</span>
          <div class="custom-select-container inst-select-wrap">
            <select id="sel-inst-procesar" onchange="cambiarInstitucion(this.value)">
              <option value="Wiener" ${currentInst === 'Wiener' ? 'selected' : ''}>Universidad Privada Norbert Wiener S.A.</option>
              <option value="Carrion" ${currentInst === 'Carrion' ? 'selected' : ''}>I.E.S. Particular Daniel Alcides Carrión</option>
            </select>
          </div>
          <span class="vt-role-badge">Perfil: Administrador</span>
        </div>
        <div class="vt-clock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Fecha/Hora del sistema: </span><b>${APP.nowStamp()}</b>
        </div>
      </div>

      <!-- Tarjetas KPI Resumen -->
      <div class="vt-stats-grid vt-stats-grid-spaced">
        <div class="vt-stat-card accent">
          <span class="vt-stat-label">Total Trámites</span>
          <span class="vt-stat-val">${formatNumber(totalGeneral)}</span>
        </div>
        <div class="vt-stat-card">
          <span class="vt-stat-label">Solicitados x Iniciar</span>
          <span class="vt-stat-val">${formatNumber(countSolicitados)}</span>
        </div>
        <div class="vt-stat-card warn">
          <span class="vt-stat-label">En Atención (Pendientes + Procede)</span>
          <span class="vt-stat-val">${formatNumber(countPendientes + countProcede)}</span>
        </div>
        <div class="vt-stat-card ok">
          <span class="vt-stat-label">Entregados</span>
          <span class="vt-stat-val">${formatNumber(countEntregados)}</span>
        </div>
        <div class="vt-stat-card">
          <span class="vt-stat-label">Observados</span>
          <span class="vt-stat-val">${formatNumber(countObservados)}</span>
        </div>
        <div class="vt-stat-card">
          <span class="vt-stat-label">Cancelados / No Procede</span>
          <span class="vt-stat-val">${formatNumber(countCancelados)}</span>
        </div>
      </div>

      <!-- Bloque Maestro de Estadísticas -->
      <div class="procesar-main-card">
        <!-- Barra superior distintiva (look & feel refinado) -->
        <div class="procesar-banner-head">
          <div class="procesar-banner-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
            <span>ESTADÍSTICAS: ${instData.nombre}</span>
          </div>
          <div class="procesar-banner-actions">
            <span class="banner-sede-info">Sede: <b>${instData.sedePrincipal}</b></span>
          </div>
        </div>

        <!-- Cuerpo en cuadrícula: Tabla a la izquierda, Gráfico de Torta a la derecha -->
        <div class="procesar-body-grid">
          
          <!-- Columna Izquierda: Tabla Estadística -->
          <div class="procesar-table-panel">
            <div class="table-panel-header">
              <h3 class="table-panel-title">
                Desglose de Trámites por Estado
              </h3>
              <span class="table-panel-meta">Actualizado al momento</span>
            </div>

            <div class="table-wrap">
              <table class="data procesar-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th class="th-number">Nº de trámites</th>
                    <th class="th-action">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
                <tfoot>
                  <tr class="tfoot-total-row">
                    <td class="tfoot-total-label-cell"><span class="tfoot-total-label">TOTAL GENERAL</span></td>
                    <td class="tfoot-total-number-cell">
                      ${formatNumber(totalGeneral)}
                    </td>
                    <td class="tfoot-total-audit-cell">
                      <span class="pill ok no-dot pill-audit-complete">100% Auditado</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="table-note-bar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="table-note-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <span>Haz clic en <b>'Ver trámites'</b> para consultar el listado detallado filtrado en la Vista de Trámites.</span>
            </div>
          </div>

          <!-- Columna Derecha: Gráfico de Torta de Trámites Vigentes -->
          <div class="procesar-chart-panel">
            <div class="procesar-chart-header">
              <div>
                <h3 class="procesar-chart-title">Trámites vigentes</h3>
                <div class="chart-subtitle">
                  Proporción porcentual sobre <b>${formatNumber(totalVigentes)}</b> registros vigentes
                </div>
              </div>
              <div class="chart-controls">
                <button class="chart-type-btn ${chartType === 'pie' ? 'active' : ''}" onclick="setChartType('pie')" title="Gráfico circular de torta clásico">Torta</button>
                <button class="chart-type-btn ${chartType === 'donut' ? 'active' : ''}" onclick="setChartType('donut')" title="Gráfico de anillo tipo dona">Dona</button>
              </div>
            </div>

            <!-- Contenedor del Gráfico Interactivo con Tooltip -->
            <div class="pie-chart-wrapper">
              <div id="chart-tooltip" class="procesar-tooltip"></div>
              ${generatePieChartSVG(slices, totalVigentes)}
            </div>

            <!-- Leyenda Estructurada con Colores y Porcentajes -->
            <div class="pie-legend-list">
              <div class="legend-title">
                Leyenda de Estados Vigentes
              </div>
              ${legendRows}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  // Inicializa los desplegables personalizados Wiener
  if (APP && APP.initCustomSelects) {
    APP.initCustomSelects(ctx.mount);
  }
}

// Exponer funciones globales
window.cambiarInstitucion = cambiarInstitucion;
window.setChartType = setChartType;
window.ejecutarAccion = ejecutarAccion;
window.exportarCSV = exportarCSV;
window.imprimirReporte = imprimirReporte;
window.highlightItem = highlightItem;
window.clearHighlight = clearHighlight;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;

render();
