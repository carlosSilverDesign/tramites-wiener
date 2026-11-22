// admin/flujos.js - Flujos de trámites Wiener Admin

const ctx = APP.renderShell('flujos');

const SVG_ICONS = {
  settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  catalog: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
};

function nodes(t) {
  const tienePago = (t.costo > 0 || (t.requierePago && t.costo > 0));
  const pago = `<div class="flow-node flow-stage-pay" title="Pago por pasarela Niubiz"><b>Pago (Niubiz)</b><span>${APP.money(t.costo || 0)}</span></div>`;
  const arrow = `<div class="flow-arrow" title="Siguiente etapa">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#5f6368"><path d="M16.61,12.75H5.25q-0.32,0-0.53-0.22T4.5,12t0.22-0.53t0.53-0.22H16.61L13.32,7.96Q13.1,7.73 13.1,7.44T13.32,6.9q0.23-0.23 0.53-0.24t0.53,0.22l4.48,4.48q0.14,0.14 0.2,0.3T19.12,12t-0.06,0.34t-0.2,0.3l-4.48,4.48q-0.22,0.22-0.53,0.22T13.32,17.1q-0.22-0.23-0.22-0.53t0.22-0.53l3.29-3.29Z"/></svg>
  </div>`;
  const sol = `<div class="flow-node start" title="Solicitud del Alumno"><b>Solicitud</b><span>Alumno · ${(t.requisitos || []).length} req.</span></div>`;

  let rev = '';
  if (Array.isArray(t.proceso) && t.proceso.length > 1) {
    rev = t.proceso.map((p, idx) => `
      <div class="flow-node" title="Etapa ${idx + 1}: ${p.area} (${p.duracionDias || 2} días háb.)">
        <b>Rev. ${idx + 1}: ${p.area}</b>
        <span>${p.duracionDias || 2} días háb.</span>
      </div>
    `).join(arrow);
  } else {
    rev = `<div class="flow-node" title="Revisión por área institucional"><b>Revisión</b><span>${t.area || 'Registros Académicos'}</span></div>`;
  }

  const apr = t.requiereAprobacion ? `${arrow}<div class="flow-node" title="Aprobación administrativa requerida"><b>Aprobación</b><span>Administrativo</span></div>` : '';
  const fin = `<div class="flow-node end" title="Emisión y entrega"><b>Emisión</b><span>${t.diasEntrega || 3} días háb.</span></div>`;

  let inner = '';
  if (tienePago) {
    if (t.pagoMomento === 'antes') {
      inner = `${sol}${arrow}${pago}${arrow}${rev}${apr}${arrow}${fin}`;
    } else {
      inner = `${sol}${arrow}${rev}${apr}${arrow}${pago}${arrow}${fin}`;
    }
  } else {
    inner = `${sol}${arrow}${rev}${apr}${arrow}${fin}`;
  }

  return `
    <a href="tramite-studio.html?id=${encodeURIComponent(t.id)}" class="flow-card-link" title="Clic para configurar este trámite en Trámite Studio">
      <div class="flow">${inner}</div>
    </a>
  `;
}

function render() {
  const ts = DB.tramites();
  const cards = ts.map(t => `
    <div class="card tramite-flow-card">
      <div class="tramite-flow-card-header">
        <div>
          <div class="card-title">${t.nombre}</div>
          <div class="card-sub tramite-flow-card-sub">${t.tipo || 'Trámite'} · ${t.costo > 0 ? ('pago ' + (t.pagoMomento || 'despues')) : 'gratuito'} · ${t.requiereAprobacion ? 'con aprobación' : 'automático'}</div>
        </div>
        <div class="tramite-flow-card-actions">
          <span class="pill ${t.activo ? 'ok' : 'gray'}">${t.activo ? 'Activo' : 'Inactivo'}</span>
          <a href="tramite-studio.html?id=${encodeURIComponent(t.id)}" class="btn btn-sm btn-outline btn-config-flow" title="Configurar flujo del trámite">
            ${SVG_ICONS.settings} <span>Configurar Flujo</span>
          </a>
        </div>
      </div>
      ${nodes(t)}
    </div>`).join('');

  ctx.mount.innerHTML = `
    <div class="page-head page-head-flex">
      <div>
        <h1>Flujos de trámites</h1>
        <p>Visualiza y administra las etapas de cada trámite: solicitud, pago, revisión, aprobación y emisión.</p>
      </div>
      <div class="page-head-actions">
        <a href="catalogo.html" class="btn btn-outline btn-page-head" title="Ver catálogo de trámites oficiales">
          ${SVG_ICONS.catalog} <span>Catálogo de Trámites</span>
        </a>
        <a href="tramite-studio.html" class="btn btn-primary btn-page-head" title="Diseñar nuevo trámite institucional">
          ${SVG_ICONS.plus} <span>Nuevo Trámite</span>
        </a>
      </div>
    </div>

    <div class="section-label">Flujo por trámite</div>
    ${cards}
  `;
}

render();
