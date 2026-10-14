/* ==========================================================================
   CAPA DE DATOS (mock) — persistida en localStorage
   En producción esto se reemplaza por llamadas al backend (Node/Express).
   ========================================================================== */
(function () {
  const KEY = 'tw_db_v3';

  const TIPOS = ['Constancia', 'Certificado', 'Carné', 'Solicitud'];
  const MODELOS = ['constancia', 'certificado', 'carne', 'oficio'];
  const ESTADOS = ['Pendiente de pago', 'En revisión', 'Observado', 'Aprobado', 'Rechazado', 'Emitido'];

  function seed() {
    return {
      // ---- Catálogo de trámites configurables ----
      tramites: [
        {
          id: 'T-001', nombre: 'Constancia de Matrícula', tipo: 'Constancia', modelo: 'constancia',
          descripcion: 'Acredita tu condición de matrícula vigente en el periodo académico regular actual.',
          costo: 25.00, pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 2, activo: true,
          area: 'Registros Académicos', requiereAdjunto: false, adjuntoIndicacion: '',
          intenciones: ['todos', 'beca', 'practicas', 'matricula'],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-002', nombre: 'Constancia de Tercio Superior', tipo: 'Constancia', modelo: 'constancia',
          descripcion: 'Acredita tu pertenencia al tercio superior de tu promoción o carrera académica.',
          costo: 40.00, pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 3, activo: true,
          area: 'Registros Académicos', requiereAdjunto: false, adjuntoIndicacion: '',
          intenciones: ['todos', 'beca', 'practicas'],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: true, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-003', nombre: 'Certificado de Estudios', tipo: 'Certificado', modelo: 'certificado',
          descripcion: 'Certificado oficial con el detalle de asignaturas, calificaciones y créditos cursados.',
          costo: 120.00, pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 7, activo: true,
          area: 'Grados y Títulos', requiereAdjunto: true,
          adjuntoIndicacion: 'Adjuntar copia de DNI o documento de identidad escaneado en PDF o JPG (máx. 5MB).',
          intenciones: ['todos', 'practicas', 'grado'],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 100, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-004', nombre: 'Constancia de Quinto Superior', tipo: 'Constancia', modelo: 'constancia',
          descripcion: 'Acredita tu pertenencia al quinto superior de la carrera o promoción.',
          costo: 45.00, pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 3, activo: true,
          area: 'Registros Académicos', requiereAdjunto: false, adjuntoIndicacion: '',
          intenciones: ['todos', 'beca'],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: true, promedioMin: 0 }
        },
        {
          id: 'T-005', nombre: 'Constancia de Egresado', tipo: 'Constancia', modelo: 'oficio',
          descripcion: 'Para estudiantes que han culminado satisfactoriamente el plan de estudios completo.',
          costo: 60.00, pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 5, activo: true,
          area: 'Grados y Títulos', requiereAdjunto: true,
          adjuntoIndicacion: 'Adjuntar constancia de prácticas preprofesionales aprobadas o constancia de no adeudo.',
          intenciones: ['todos', 'grado'],
          audiencia: { niveles: ['pregrado', 'postgrado'], ciclos: [], minCreditos: 200, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-006', nombre: 'Certificado de Postgrado', tipo: 'Certificado', modelo: 'certificado',
          descripcion: 'Certificado de notas para programas oficiales de maestría y doctorado.',
          costo: 150.00, pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 7, activo: true,
          area: 'Escuela de Postgrado', requiereAdjunto: false, adjuntoIndicacion: '',
          intenciones: ['todos', 'grado'],
          audiencia: { niveles: ['postgrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-007', nombre: 'Carné Universitario (Duplicado)', tipo: 'Carné', modelo: 'carne',
          descripcion: 'Reposición oficial del carné universitario por extravío, robo o deterioro.',
          costo: 35.00, pagoMomento: 'antes', requiereAprobacion: false, diasEntrega: 10, activo: true,
          area: 'Bienestar Universitario', requiereAdjunto: true,
          adjuntoIndicacion: 'Adjuntar fotografía formal a color con fondo blanco en JPG o PNG (máx. 5MB).',
          intenciones: ['todos', 'carne'],
          audiencia: { niveles: ['pregrado', 'postgrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        }
      ],

      // ---- Usuarios del sistema ----
      usuarios: [
        {
          id: 'U-ALU-1', rol: 'alumno', nombre: 'María Fernanda Quispe', codigo: '2021100345',
          email: 'mf.quispe@uwiener.edu.pe', dni: '72845109', estado: 'activo',
          perfil: { nivel: 'pregrado', programa: 'Ingeniería de Sistemas', ciclo: 8, creditos: 168, tercioSuperior: true, quintoSuperior: false, promedio: 16.2 }
        },
        {
          id: 'U-ADM-1', rol: 'administrativo', nombre: 'Carlos Mendoza Ríos', codigo: 'ADM-0091',
          email: 'c.mendoza@uwiener.edu.pe', dni: '40981233', estado: 'activo', area: 'Registros Académicos',
          permisos: ['tramites', 'solicitudes', 'flujos', 'usuarios', 'seguridad']
        },
        {
          id: 'U-ALU-2', rol: 'alumno', nombre: 'José Antonio Ramos', codigo: '2019054420',
          email: 'j.ramos@uwiener.edu.pe', dni: '70112458', estado: 'activo',
          perfil: { nivel: 'pregrado', programa: 'Administración', ciclo: 10, creditos: 210, tercioSuperior: false, quintoSuperior: false, promedio: 13.8 }
        },
        {
          id: 'U-ADM-2', rol: 'administrativo', nombre: 'Lucía Paredes Soto', codigo: 'ADM-0102',
          email: 'l.paredes@uwiener.edu.pe', dni: '41223678', estado: 'inactivo', area: 'Grados y Títulos',
          permisos: ['tramites', 'solicitudes']
        }
      ],

      // ---- Solicitudes realizadas por alumnos ----
      solicitudes: [
        {
          id: 'S-2026-0188', tramiteId: 'T-001', tramiteNombre: 'Constancia de Matrícula',
          alumnoId: 'U-ALU-1', alumnoNombre: 'María Fernanda Quispe', alumnoCodigo: '2021100345',
          fecha: '2026-06-22', estado: 'En revisión', costo: 25.00,
          pago: { estado: 'pagado', metodo: 'Niubiz · Visa ****4821', monto: 25.00, fecha: '2026-06-22', operacion: 'NB-90381245' },
          pagoMomento: 'antes', area: 'Registros Académicos',
          observacion: 'En cola de verificación documental.', motivo: 'Trámite bancario',
          adjunto: null,
          historial: [
            { estado: 'Pendiente de pago', fecha: '2026-06-22 09:14', nota: 'Solicitud creada por el alumno' },
            { estado: 'En revisión', fecha: '2026-06-22 09:20', nota: 'Pago confirmado vía Niubiz' }
          ]
        },
        {
          id: 'S-2026-0181', tramiteId: 'T-003', tramiteNombre: 'Certificado de Estudios',
          alumnoId: 'U-ALU-2', alumnoNombre: 'José Antonio Ramos', alumnoCodigo: '2019054420',
          fecha: '2026-06-20', estado: 'Aprobado', costo: 120.00,
          pago: { estado: 'pagado', metodo: 'Niubiz · Mastercard ****1190', monto: 120.00, fecha: '2026-06-20', operacion: 'NB-90377112' },
          pagoMomento: 'antes', area: 'Grados y Títulos',
          observacion: 'Aprobado. Documento en proceso de emisión oficial.', motivo: 'Postulación laboral',
          adjunto: 'dni_jramos.pdf',
          historial: [
            { estado: 'Pendiente de pago', fecha: '2026-06-20 11:02', nota: 'Solicitud creada' },
            { estado: 'En revisión', fecha: '2026-06-20 11:10', nota: 'Pago confirmado vía Niubiz' },
            { estado: 'Aprobado', fecha: '2026-06-21 16:40', nota: 'Validado por C. Mendoza' }
          ]
        },
        {
          id: 'S-2026-0175', tramiteId: 'T-002', tramiteNombre: 'Constancia de Tercio Superior',
          alumnoId: 'U-ALU-1', alumnoNombre: 'María Fernanda Quispe', alumnoCodigo: '2021100345',
          fecha: '2026-06-18', estado: 'Emitido', costo: 40.00,
          pago: { estado: 'pagado', metodo: 'Niubiz · Visa ****4821', monto: 40.00, fecha: '2026-06-18', operacion: 'NB-90370045' },
          pagoMomento: 'antes', area: 'Registros Académicos',
          observacion: 'Documento disponible para descarga.', motivo: 'Beca de estudios',
          adjunto: null,
          historial: [
            { estado: 'Pendiente de pago', fecha: '2026-06-18 08:30', nota: 'Solicitud creada' },
            { estado: 'En revisión', fecha: '2026-06-18 08:35', nota: 'Pago confirmado vía Niubiz' },
            { estado: 'Aprobado', fecha: '2026-06-18 14:00', nota: 'Validado por C. Mendoza' },
            { estado: 'Emitido', fecha: '2026-06-19 10:15', nota: 'Documento emitido y notificado con firma digital' }
          ]
        },
        {
          id: 'S-2026-0168', tramiteId: 'T-007', tramiteNombre: 'Carné Universitario (Duplicado)',
          alumnoId: 'U-ALU-1', alumnoNombre: 'María Fernanda Quispe', alumnoCodigo: '2021100345',
          fecha: '2026-06-15', estado: 'Observado', costo: 35.00,
          pago: { estado: 'pagado', metodo: 'Niubiz · Visa ****4821', monto: 35.00, fecha: '2026-06-15', operacion: 'NB-90365011' },
          pagoMomento: 'antes', area: 'Bienestar Universitario',
          observacion: 'La fotografía adjunta no cuenta con el fondo blanco reglamentario. Favor de adjuntar una foto formal actualizada con fondo blanco.',
          motivo: 'Duplicado por pérdida',
          requiereSubsanacion: true,
          horasRestantesSubsanacion: 48,
          adjunto: 'foto_dni_antigua.jpg',
          historial: [
            { estado: 'Pendiente de pago', fecha: '2026-06-15 10:10', nota: 'Solicitud creada por el alumno' },
            { estado: 'En revisión', fecha: '2026-06-15 10:15', nota: 'Pago confirmado vía Niubiz' },
            { estado: 'Observado', fecha: '2026-06-16 11:30', nota: 'Observación por Bienestar Universitario: Foto no cumple con fondo blanco reglamentario. Se otorgan 48 horas para subsanar.' }
          ]
        },
        {
          id: 'S-2026-0155', tramiteId: 'T-004', tramiteNombre: 'Constancia de Quinto Superior',
          alumnoId: 'U-ALU-1', alumnoNombre: 'María Fernanda Quispe', alumnoCodigo: '2021100345',
          fecha: '2026-06-10', estado: 'Rechazado', costo: 45.00,
          pago: { estado: 'pagado', metodo: 'Niubiz · Visa ****4821', monto: 45.00, fecha: '2026-06-10', operacion: 'NB-90355099' },
          pagoMomento: 'antes', area: 'Registros Académicos',
          motivo: 'Postulación a pasantía internacional',
          observacion: 'Solicitud no procedente: Según el cuadro oficial de méritos 2026-I, el estudiante cuenta con condición de Tercio Superior, no alcanzando el percentil requerido para Quinto Superior (mínimo promedio 17.00, promedio actual: 16.20).',
          adjunto: null,
          historial: [
            { estado: 'Pendiente de pago', fecha: '2026-06-10 14:20', nota: 'Solicitud registrada por el alumno' },
            { estado: 'En revisión', fecha: '2026-06-10 14:25', nota: 'Pago confirmado vía Niubiz (Op. NB-90355099)' },
            { estado: 'Rechazado', fecha: '2026-06-11 11:45', nota: 'Desestimado por Registros Académicos (Lic. Carlos Mendoza): No alcanza el percentil de Quinto Superior. Se iniciará trámite de devolución económica si corresponde.' }
          ]
        }
      ]
    };
  }

  function load() {
    let raw = localStorage.getItem(KEY);
    if (!raw) { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
    try { return JSON.parse(raw); } catch (e) { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
  }
  function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

  // -------- Reglas de elegibilidad (¿a quién se le muestra el trámite?) --------
  function elegible(tramite, perfil) {
    if (!tramite.activo) return false;
    const a = tramite.audiencia || {};
    if (a.niveles && a.niveles.length && !a.niveles.includes(perfil.nivel)) return false;
    if (a.ciclos && a.ciclos.length && !a.ciclos.includes(perfil.ciclo)) return false;
    if (a.minCreditos && perfil.creditos < a.minCreditos) return false;
    if (a.promedioMin && perfil.promedio < a.promedioMin) return false;
    if (a.tercioSuperior && !perfil.tercioSuperior) return false;
    if (a.quintoSuperior && !perfil.quintoSuperior) return false;
    return true;
  }

  // Texto legible de la audiencia configurada
  function audienciaTexto(a) {
    if (!a) return ['Todos los alumnos'];
    const out = [];
    if (a.niveles && a.niveles.length) out.push(a.niveles.map(n => n === 'pregrado' ? 'Pregrado' : 'Postgrado').join(' / '));
    else out.push('Todos los niveles');
    if (a.ciclos && a.ciclos.length) out.push('Ciclos: ' + a.ciclos.join(', '));
    if (a.minCreditos) out.push('≥ ' + a.minCreditos + ' créditos');
    if (a.promedioMin) out.push('Promedio ≥ ' + a.promedioMin);
    if (a.tercioSuperior) out.push('Tercio superior');
    if (a.quintoSuperior) out.push('Quinto superior');
    return out;
  }

  window.DB = {
    KEY, TIPOS, MODELOS, ESTADOS,
    load, save, reset() { const s = seed(); save(s); return s; },
    elegible, audienciaTexto,
    // helpers de acceso
    tramites() { return load().tramites; },
    solicitudes() { return load().solicitudes; },
    usuarios() { return load().usuarios; },
    getTramite(id) { return load().tramites.find(t => t.id === id); },
    getUsuario(id) { return load().usuarios.find(u => u.id === id); },
    upsertTramite(t) {
      const db = load();
      const i = db.tramites.findIndex(x => x.id === t.id);
      if (i >= 0) db.tramites[i] = t; else { t.id = 'T-' + String(db.tramites.length + 1).padStart(3, '0'); db.tramites.push(t); }
      save(db); return t;
    },
    deleteTramite(id) { const db = load(); db.tramites = db.tramites.filter(t => t.id !== id); save(db); },
    upsertUsuario(u) {
      const db = load();
      const i = db.usuarios.findIndex(x => x.id === u.id);
      if (i >= 0) db.usuarios[i] = u; else { u.id = 'U-' + Date.now(); db.usuarios.push(u); }
      save(db); return u;
    },
    addSolicitud(s) { const db = load(); db.solicitudes.unshift(s); save(db); return s; },
    updateSolicitud(s) { const db = load(); const i = db.solicitudes.findIndex(x => x.id === s.id); if (i >= 0) db.solicitudes[i] = s; save(db); return s; },
    getSolicitud(id) { return load().solicitudes.find(s => s.id === id); },
    subsanarSolicitud(id, { nota, adjuntoNombre }) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === id);
      if (!s) return null;
      s.estado = 'En revisión';
      s.requiereSubsanacion = false;
      s.observacion = 'Subsanación ingresada por el alumno. En cola de revisión prioritaria.';
      if (adjuntoNombre) s.adjunto = adjuntoNombre;
      const now = new Date();
      const fechaStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      s.historial.push({
        estado: 'En revisión',
        fecha: fechaStr,
        nota: 'Subsanación enviada: ' + (nota || 'Requisito actualizado por el alumno') + (adjuntoNombre ? ' (Archivo: ' + adjuntoNombre + ')' : '')
      });
      save(db);
      return s;
    }
  };
})();
