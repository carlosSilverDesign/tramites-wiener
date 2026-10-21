/* ==========================================================================
   CAPA DE DATOS (mock) - persistida en localStorage
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
          id: 'T-001', nombre: 'BECA IMPULSA 30%', tipo: 'Solicitud', modelo: 'oficio',
          descripcion: 'DESCRIPCIÓN:\n\nAplica a estudiantes de pregrado regular que acrediten excelencia académica y solvencia según las bases del programa institucional Impulsa.',
          costo: 0.00, conceptoCodigo: '00000000', conceptoServicio: 'BECA IMPULSA 30% / COSTO CERO',
          tiempoVigenciaHrs: 48, plazoRecojoDias: 3, observacion: '', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2026-07-19',
          pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 3, area: 'Retención y Fidelización',
          requiereAdjunto: true,
          requisitos: [
            { id: 'REQ-001', titulo: 'Certificado de voluntariado', adjuntarArchivo: true, activo: true, orden: 1 },
            { id: 'REQ-002', titulo: 'DNI del paciente / solicitante', adjuntarArchivo: true, activo: true, orden: 2 }
          ],
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'revisa las notas', observacion: '', duracionDias: 2, activo: true },
            { id: 'P-2', orden: 2, area: 'Retención y Fidelización', descripcion: 'evaluación de condiciones socioeconómicas', observacion: '', duracionDias: 3, activo: true },
            { id: 'P-3', orden: 3, area: 'Soluciones Financieras', descripcion: 'aplicar descuento en el sistema', observacion: '', duracionDias: 1, activo: true }
          ],
          cronogramas: [
            { id: 'CR-01', grado: 'Pregrado', modalidad: 'Modalidad Ordinaria', facultad: 'Todas', carrera: 'Todas', periodo: '2026-1', fechaInicio: '2026-10-01', fechaFin: '2026-11-01', activo: true }
          ],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-002', nombre: 'BECA IMPULSA 35%', tipo: 'Solicitud', modelo: 'oficio',
          descripcion: 'DESCRIPCIÓN:\n\nAplica a estudiantes con rendimiento destacado en situación de vulnerabilidad evaluada por Bienestar y Retención.',
          costo: 0.00, conceptoCodigo: '00000000', conceptoServicio: 'BECA IMPULSA 35% / COSTO CERO',
          tiempoVigenciaHrs: 48, plazoRecojoDias: 3, observacion: '', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2026-07-19',
          pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 3, area: 'Retención y Fidelización',
          requiereAdjunto: true,
          requisitos: [
            { id: 'REQ-002', titulo: 'DNI del paciente / solicitante', adjuntarArchivo: true, activo: true, orden: 1 }
          ],
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Validación de récord de notas', observacion: '', duracionDias: 2, activo: true },
            { id: 'P-2', orden: 2, area: 'Retención y Fidelización', descripcion: 'Evaluación de informe social', observacion: '', duracionDias: 2, activo: true }
          ],
          cronogramas: [
            { id: 'CR-02', grado: 'Pregrado', modalidad: 'Modalidad Ordinaria', facultad: 'Todas', carrera: 'Todas', periodo: '2026-1', fechaInicio: '2026-10-01', fechaFin: '2026-11-01', activo: true }
          ],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-003', nombre: 'CAMBIO DE MODALIDAD DE ESTUDIOS A DISTANCIA - POSGRADO', tipo: 'Solicitud', modelo: 'oficio',
          descripcion: 'Procedimiento para traslado interno de modalidad presencial/semipresencial a modalidad a distancia en programas de maestría y posgrado.',
          costo: 0.00, conceptoCodigo: '51040402', conceptoServicio: 'ADECUACIÓN POSGRADO',
          tiempoVigenciaHrs: 72, plazoRecojoDias: 5, observacion: '', tipoActivacion: 'Cronograma',
          envioCorreo: true, activo: true, fechaRegistro: '2023-03-19',
          pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 5, area: 'Registros Académicos',
          requiereAdjunto: false,
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Validación de plan curricular posgrado', observacion: '', duracionDias: 2, activo: true }
          ],
          cronogramas: [
            { id: 'CR-03', grado: 'Posgrado', modalidad: 'Maestría A Distancia', facultad: 'Todas', carrera: 'Todas', periodo: '2026-2', fechaInicio: '2026-08-01', fechaFin: '2026-09-15', activo: true }
          ],
          audiencia: { niveles: ['postgrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-004', nombre: 'CAMBIO DE MODALIDAD DE ESTUDIOS A PRESENCIAL - PREGRADO', tipo: 'Solicitud', modelo: 'oficio',
          descripcion: 'Procedimiento de traslado interno a programas en modalidad presencial de pregrado según disponibilidad de vacantes curriculares.',
          costo: 0.00, conceptoCodigo: '03030104', conceptoServicio: 'ADECUACION CURRICULAR - PREGRADO',
          tiempoVigenciaHrs: 72, plazoRecojoDias: 5, observacion: '', tipoActivacion: 'Cronograma',
          envioCorreo: true, activo: true, fechaRegistro: '2023-07-18',
          pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 5, area: 'Registros Académicos',
          requiereAdjunto: false,
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Validación de vacantes y convalidación', observacion: '', duracionDias: 3, activo: true }
          ],
          cronogramas: [
            { id: 'CR-04', grado: 'Pregrado', modalidad: 'Modalidad Ordinaria', facultad: 'Todas', carrera: 'Todas', periodo: '2026-2', fechaInicio: '2026-08-01', fechaFin: '2026-09-15', activo: true }
          ],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-005', nombre: 'CAMBIO DE MODALIDAD DE ESTUDIOS A PRESENCIAL - SEGUNDA ESPECIALIDAD', tipo: 'Solicitud', modelo: 'oficio',
          descripcion: 'Trámite de adecuación y cambio de modalidad para estudiantes de programas de segunda especialidad profesional.',
          costo: 0.00, conceptoCodigo: '03070322', conceptoServicio: 'ADECUACION CURRICULAR - SEGUNDA ESPECIALIDAD',
          tiempoVigenciaHrs: 72, plazoRecojoDias: 5, observacion: '', tipoActivacion: 'Cronograma',
          envioCorreo: true, activo: true, fechaRegistro: '2023-09-20',
          pagoMomento: 'despues', requiereAprobacion: true, diasEntrega: 5, area: 'Registros Académicos',
          requiereAdjunto: false,
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Validación académica', observacion: '', duracionDias: 2, activo: true }
          ],
          cronogramas: [
            { id: 'CR-05', grado: 'Segunda Especialidad', modalidad: 'Presencial', facultad: 'Todas', carrera: 'Todas', periodo: '2026-2', fechaInicio: '2026-08-01', fechaFin: '2026-09-20', activo: true }
          ],
          audiencia: { niveles: ['postgrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-006', nombre: 'Constancia de Matrícula', tipo: 'Constancia', modelo: 'constancia',
          descripcion: 'Acredita tu condición de matrícula vigente en el periodo académico regular actual.',
          costo: 25.00, conceptoCodigo: '01010025', conceptoServicio: 'CONSTANCIA DE MATRÍCULA',
          tiempoVigenciaHrs: 48, plazoRecojoDias: 2, observacion: 'Emisión con firma digital.', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2022-06-10',
          pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 2, area: 'Registros Académicos',
          requiereAdjunto: false,
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Validación de matrícula y asignaturas registradas', observacion: '', duracionDias: 1, activo: true },
            { id: 'P-2', orden: 2, area: 'Soluciones Financieras', descripcion: 'Validación de pago en caja Niubiz', observacion: '', duracionDias: 1, activo: true }
          ],
          cronogramas: [],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-007', nombre: 'Constancia de Tercio Superior', tipo: 'Constancia', modelo: 'constancia',
          descripcion: 'Acredita tu pertenencia al tercio superior de tu promoción o carrera académica.',
          costo: 40.00, conceptoCodigo: '01010040', conceptoServicio: 'CONSTANCIA DE TERCIO SUPERIOR',
          tiempoVigenciaHrs: 72, plazoRecojoDias: 3, observacion: '', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2022-06-10',
          pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 3, area: 'Registros Académicos',
          requiereAdjunto: false,
          cronogramas: [],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 0, tercioSuperior: true, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-008', nombre: 'Certificado de Estudios', tipo: 'Certificado', modelo: 'certificado',
          descripcion: 'Certificado oficial con el detalle de asignaturas, calificaciones y créditos cursados.',
          costo: 120.00, conceptoCodigo: '01010120', conceptoServicio: 'CERTIFICADO DE ESTUDIOS',
          tiempoVigenciaHrs: 120, plazoRecojoDias: 7, observacion: 'Requiere DNI legible escaneado.', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2022-05-15',
          pagoMomento: 'antes', requiereAprobacion: true, diasEntrega: 7, area: 'Grados y Títulos',
          requiereAdjunto: true,
          requisitos: [
            { id: 'REQ-002', titulo: 'DNI del paciente / solicitante', adjuntarArchivo: true, activo: true, orden: 1 }
          ],
          proceso: [
            { id: 'P-1', orden: 1, area: 'Registros Académicos', descripcion: 'Cierre y consolidación de actas oficiales', observacion: '', duracionDias: 3, activo: true },
            { id: 'P-2', orden: 2, area: 'Grados y Títulos', descripcion: 'Emisión e impresión en papel membretado', observacion: '', duracionDias: 4, activo: true }
          ],
          cronogramas: [],
          audiencia: { niveles: ['pregrado'], ciclos: [], minCreditos: 100, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        },
        {
          id: 'T-009', nombre: 'Carné Universitario (Duplicado)', tipo: 'Carné', modelo: 'carne',
          descripcion: 'Reposición oficial del carné universitario por extravío, robo o deterioro.',
          costo: 35.00, conceptoCodigo: '01010035', conceptoServicio: 'CARNÉ UNIVERSITARIO (DUPLICADO)',
          tiempoVigenciaHrs: 240, plazoRecojoDias: 10, observacion: 'Trámite SUNEDU', tipoActivacion: 'Permanente',
          envioCorreo: true, activo: true, fechaRegistro: '2022-07-01',
          pagoMomento: 'antes', requiereAprobacion: false, diasEntrega: 10, area: 'Dirección de Bienestar Universitario',
          requiereAdjunto: true,
          requisitos: [
            { id: 'REQ-003', titulo: 'Fotografía formal fondo blanco', adjuntarArchivo: true, activo: true, orden: 1 }
          ],
          cronogramas: [],
          audiencia: { niveles: ['pregrado', 'postgrado'], ciclos: [], minCreditos: 0, tercioSuperior: false, quintoSuperior: false, promedioMin: 0 }
        }
      ],

      // ---- Catálogo de Sedes Institucionales ----
      sedesCatalogo: [
        '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
        '7803-1 --> LOCAL 2 / Av. Arequipa 440 Lima Centro',
        '7803-3 --> LOCAL 3 / Av. Arequipa 444 Lima Centro',
        '7803-4 --> CAMPUS VIRTUAL / Ventanilla Digital'
      ],

      // ---- Catálogo de Colaboradores / Personal Administrativo ----
      colaboradores: [
        { personal: '665092', paterno: 'ZORRILLA', materno: 'MORRIS', nombres: 'PAULA MAYRA JACKELINE', gerencia: 'Dirección de Bienestar Universitario', gerCodigo: 'W012', obs: '' },
        { personal: '800251', paterno: 'SANTA CRUZ', materno: 'CCORAHUA', nombres: 'ESTEFANY', gerencia: 'Jefatura De Call Center', gerCodigo: 'W045', obs: '' },
        { personal: '794673', paterno: 'SANTA CRUZ', materno: 'JARA', nombres: 'NAHUM', gerencia: 'Medicina Humana', gerCodigo: 'W093', obs: '' },
        { personal: '712149', paterno: 'SANTA CRUZ', materno: 'SALAZAR', nombres: 'JORGE ALFONSO', gerencia: 'Coord. Escuela De Posgrado', gerCodigo: 'W089', obs: '' },
        { personal: '722486', paterno: 'SANTAMARIA', materno: 'CALDERON', nombres: 'JHAN KARLO', gerencia: 'Project Manager Academico', gerCodigo: 'W157', obs: '' },
        { personal: '634370', paterno: 'CASTILLO', materno: 'DIAZ', nombres: 'YULL ADRIAN', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '494220', paterno: 'CHAVEZ', materno: 'CAPACOILA', nombres: 'CAROLINE MARTHA', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '589340', paterno: 'DOMINGUEZ', materno: 'LOPE', nombres: 'JUAN DAVID', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '543351', paterno: 'DURAND', materno: 'HUAMANI', nombres: 'CRISTIAN ALBERTO', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '611901', paterno: 'FAUSTOR', materno: 'MÜLLER', nombres: 'MIGUEL ANGEL', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '371258', paterno: 'GARAY', materno: 'ORBEGOSO', nombres: 'CARLA ANDREA', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '636671', paterno: 'GARCIA', materno: 'GRANDEZ', nombres: 'GIANELLA MAGDALENA', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '409812', paterno: 'MENDOZA', materno: 'RÍOS', nombres: 'CARLOS ALBERTO', gerencia: 'Registros Académicos', gerCodigo: 'W010', obs: '' },
        { personal: '412236', paterno: 'PAREDES', materno: 'SOTO', nombres: 'LUCÍA MARGARITA', gerencia: 'Grados y Títulos', gerCodigo: 'W014', obs: '' },
        { personal: '512903', paterno: 'QUISPE', materno: 'RODRIGUEZ', nombres: 'ANA MARÍA', gerencia: 'Soluciones Financieras', gerCodigo: 'W018', obs: '' }
      ],

      // ---- Áreas responsables del flujo de atención ----
      areas: [
        {
          id: 'A-001',
          codigo: 'A-001',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Dirección de Bienestar Universitario',
          observacion: 'Gestión de servicios de salud, becas, deporte y acompañamiento estudiantil.',
          activo: true,
          fechaRegistro: '2022-06-10',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: [
            { id: 'RESP-01', personal: '665092', nombre: 'ZORRILLA MORRIS, PAULA MAYRA JACKELINE', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true }
          ]
        },
        {
          id: 'A-002',
          codigo: 'A-002',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Jefatura de Responsabilidad Social',
          observacion: 'Supervisión de actividades de extensión comunitaria y voluntariado.',
          activo: true,
          fechaRegistro: '2022-06-10',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: [
            { id: 'RESP-02', personal: '412236', nombre: 'PAREDES SOTO, LUCÍA MARGARITA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Coordinador', activo: true }
          ]
        },
        {
          id: 'A-003',
          codigo: 'A-003',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Registros Académicos',
          observacion: 'Emisión de documentos oficiales, actas, convalidaciones y constancias.',
          activo: true,
          fechaRegistro: '2023-02-19',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true },
            { id: 'SED-2', nombre: '7803-1 --> LOCAL 2 / Av. Arequipa 440 Lima Centro', activo: true }
          ],
          responsables: [
            { id: 'RESP-03', personal: '634370', nombre: 'CASTILLO DIAZ, YULL ADRIAN', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-04', personal: '494220', nombre: 'CHAVEZ CAPACOILA, CAROLINE MARTHA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-05', personal: '589340', nombre: 'DOMINGUEZ LOPE, JUAN DAVID', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-06', personal: '543351', nombre: 'DURAND HUAMANI, CRISTIAN ALBERTO', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-07', personal: '611901', nombre: 'FAUSTOR MÜLLER, MIGUEL ANGEL', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-08', personal: '371258', nombre: 'GARAY ORBEGOSO, CARLA ANDREA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true },
            { id: 'RESP-09', personal: '636671', nombre: 'GARCIA GRANDEZ, GIANELLA MAGDALENA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true }
          ]
        },
        {
          id: 'A-004',
          codigo: 'A-004',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Representante de Unidades Académicas',
          observacion: 'Validación de planes de estudio, directores de escuela y coordinadores.',
          activo: true,
          fechaRegistro: '2022-08-25',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: []
        },
        {
          id: 'A-005',
          codigo: 'A-005',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Retención y Fidelización',
          observacion: 'Evaluación de beneficios socioeconómicos, becas y continuidad.',
          activo: true,
          fechaRegistro: '2022-06-10',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: [
            { id: 'RESP-10', personal: '722486', nombre: 'SANTAMARIA CALDERON, JHAN KARLO', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true }
          ]
        },
        {
          id: 'A-006',
          codigo: 'A-006',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Soluciones Financieras',
          observacion: 'Validación de estado de cuenta, no adeudo, pasarela y aplicaciones de descuento.',
          activo: true,
          fechaRegistro: '2020-07-25',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: [
            { id: 'RESP-11', personal: '512903', nombre: 'QUISPE RODRIGUEZ, ANA MARÍA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true }
          ]
        },
        {
          id: 'A-007',
          codigo: 'A-007',
          institucion: 'Universidad Privada Norbert Wiener S.A.',
          nombre: 'Grados y Títulos',
          observacion: 'Expedición de certificados integrales, constancias de egreso y títulos profesionales.',
          activo: true,
          fechaRegistro: '2022-05-15',
          sedes: [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ],
          responsables: [
            { id: 'RESP-12', personal: '412236', nombre: 'PAREDES SOTO, LUCÍA MARGARITA', sede: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', cargo: 'Responsable', activo: true }
          ]
        }
      ],

      // ---- Catálogo maestro de requisitos ----
      requisitos: [
        {
          id: 'REQ-001',
          codigo: 'REQ-001',
          titulo: 'Certificado de voluntariado',
          observacion: 'Constancia de horas de voluntariado emitida por la institución correspondiente.',
          requiereAdjunto: true,
          adjuntoNombre: 'Certificado_Voluntariado',
          formato: 'PDF',
          activo: true,
          fechaRegistro: '2026-06-10'
        },
        {
          id: 'REQ-002',
          codigo: 'REQ-002',
          titulo: 'DNI del paciente / solicitante',
          observacion: 'Debe ser nítido. Copia legible de ambas caras del documento de identidad.',
          requiereAdjunto: true,
          adjuntoNombre: 'DNI_Solicitante',
          formato: 'PDF',
          activo: true,
          fechaRegistro: '2026-06-12'
        },
        {
          id: 'REQ-003',
          codigo: 'REQ-003',
          titulo: 'Fotografía formal fondo blanco',
          observacion: 'Fotografía tamaño carné en fondo blanco, vestimenta formal sin accesorios.',
          requiereAdjunto: true,
          adjuntoNombre: 'Foto_Carne',
          formato: 'JPG',
          activo: true,
          fechaRegistro: '2026-06-15'
        },
        {
          id: 'REQ-004',
          codigo: 'REQ-004',
          titulo: 'Declaración jurada de no adeudo',
          observacion: 'Acreditación de solvencia y regularización financiera ante tesorería.',
          requiereAdjunto: false,
          adjuntoNombre: '',
          formato: '',
          activo: true,
          fechaRegistro: '2026-06-18'
        },
        {
          id: 'REQ-005',
          codigo: 'REQ-005',
          titulo: 'Constancia de prácticas preprofesionales',
          observacion: 'Documento acreditativo validado por la dirección de escuela.',
          requiereAdjunto: true,
          adjuntoNombre: 'Constancia_Practicas',
          formato: 'PDF',
          activo: true,
          fechaRegistro: '2026-06-20'
        }
      ],

      // ---- Catálogo de Conceptos de Caja / Facturación ----
      conceptos: [
        { codigo: '01010025', servicio: 'CONSTANCIA DE MATRÍCULA', monto: 25.00, obs: 'Caja regular' },
        { codigo: '01010040', servicio: 'CONSTANCIA DE TERCIO SUPERIOR', monto: 40.00, obs: 'Académico' },
        { codigo: '01010120', servicio: 'CERTIFICADO DE ESTUDIOS', monto: 120.00, obs: 'Por ciclo o global' },
        { codigo: '01010035', servicio: 'CARNÉ UNIVERSITARIO (DUPLICADO)', monto: 35.00, obs: 'Trámite SUNEDU' },
        { codigo: '51040115', servicio: 'ACTA DE SUSTENTACION DE TESIS', monto: 260.00, obs: 'US$ 70 aprox' },
        { codigo: '68010122', servicio: 'ACTUALIZACION EN NUTRICION CLINICA', monto: 0.00, obs: 'Informativo' },
        { codigo: '03030104', servicio: 'ADECUACION CURRICULAR - PREGRADO', monto: 153.00, obs: 'Fact. General' },
        { codigo: '03070322', servicio: 'ADECUACION CURRICULAR - SEGUNDA ESPECIALIDAD', monto: 155.00, obs: 'Fact. Público General' },
        { codigo: '51040402', servicio: 'ADECUACIÓN POSGRADO', monto: 120.00, obs: '' },
        { codigo: '08060120', servicio: 'ADECUACIÓN POSGRADO PRESENCIAL', monto: 120.00, obs: '' },
        { codigo: '07020111', servicio: 'ADMINISTRACIÓN DE LA CARRERA LABORAL', monto: 600.00, obs: '' },
        { codigo: '51020103', servicio: 'ADMISIÓN DOCTORADO', monto: 190.00, obs: 'US$ 50.47' },
        { codigo: '00000000', servicio: 'BECA IMPULSA 30% / COSTO CERO', monto: 0.00, obs: 'Trámite sin costo' }
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
        },
        {
          id: 'U-ADM-3', rol: 'administrativo', nombre: 'Giancarlo Santa María Calderón', codigo: 'ADM-0115',
          email: 'g.santamaria@uwiener.edu.pe', dni: '45678901', estado: 'activo', area: 'Retención y Fidelización',
          permisos: ['tramites', 'solicitudes']
        }
      ],

      // ---- Solicitudes realizadas por alumnos (Catálogo Vista de Trámites) ----
      solicitudes: [
        {
          id: '2026.43532',
          ticket: '2026.43532',
          sedeCodigo: '7808',
          sede: '7808 - Av. Petit Thouars Nº 397 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-008',
          tramiteNombre: 'Certificado de Formación Continua (S1)',
          carrera: 'DRENAJE LINFÁTICO',
          periodo: '2026-2',
          seccion: '4DL12',
          alumnoId: 'C03AE04204',
          alumnoCodigo: 'C03AE04204',
          alumnoNombre: 'RAYME ORE, Karina Anali',
          alumnoDni: '42579879',
          alumnoEmail: 'karyray8@gmail.com',
          alumnoTelefono: '977812174',
          alumnoCelular: '977812174',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 10:15:20 PM',
          costo: 150.00,
          conceptoCodigo: '33020109',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 150.00,
            carrera: 'Drenaje Linfático',
            nroDocumento: '-',
            fechaPago: null,
            fechaObligacion: null
          },
          detalle: 'Solicito la expedición de mi certificado de formación continua del módulo de drenaje linfático.',
          requisitos: [
            {
              id: 'REQ-01',
              orden: 1,
              titulo: 'Fotografía, tamaño pasaporte, papel mate, fondo blanco, con la indumentaria de la especialidad o vestimenta formal, ángulo frontal/normal, no selfi, no lentes, no gorra, no piercing.',
              archivo: 'FOTO.jpg',
              tipoArchivo: 'JPG',
              cumple: false,
              especificacion: 'Tamaño: máximo 1MB, Tipo: JPG, Nombre: FOTO.jpg'
            },
            {
              id: 'REQ-02',
              orden: 2,
              titulo: 'Documento de Identidad Vigente',
              archivo: 'DNI.pdf',
              tipoArchivo: 'PDF',
              cumple: false,
              especificacion: 'Tamaño: máximo 2MB, Tipo: PDF, Nombre: DNI.pdf'
            }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 10:15', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43531',
          ticket: '2026.43531',
          sedeCodigo: '7808',
          sede: '7808 - Av. Petit Thouars Nº 397 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-008',
          tramiteNombre: 'Certificado de Formación Continua (S1)',
          carrera: 'PODOLOGÍA CLÍNICA Y ESTÉTICA AVANZADA',
          periodo: '2026-2',
          seccion: '6ME42',
          alumnoId: 'C03AE04204',
          alumnoCodigo: 'C03AE04204',
          alumnoNombre: 'RAYME ORE, Karina Anali',
          alumnoDni: '42579879',
          alumnoEmail: 'karyray8@gmail.com',
          alumnoTelefono: '977812174',
          alumnoCelular: '977812174',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 10:03:27 PM',
          costo: 150.00,
          conceptoCodigo: '33020109',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 150.00,
            carrera: 'Podología Clínica Y Estética Avanzada',
            nroDocumento: '-',
            fechaPago: null,
            fechaObligacion: null
          },
          detalle: 'Requiere validación de módulos de estética avanzada para convalidación profesional.',
          requisitos: [
            {
              id: 'REQ-01',
              orden: 1,
              titulo: 'Fotografía, tamaño pasaporte, papel mate, fondo blanco, con la indumentaria de la especialidad o vestimenta formal, ángulo frontal/normal, no selfi, no lentes, no gorra, no piercing.',
              archivo: 'FOTO.jpg',
              tipoArchivo: 'JPG',
              cumple: false,
              especificacion: 'Tamaño: máximo 1MB, Tipo: JPG, Nombre: FOTO.jpg'
            },
            {
              id: 'REQ-02',
              orden: 2,
              titulo: 'Documento de Identidad Vigente',
              archivo: 'DNI.pdf',
              tipoArchivo: 'PDF',
              cumple: false,
              especificacion: 'Tamaño: máximo 2MB, Tipo: PDF, Nombre: DNI.pdf'
            }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 10:03', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43530',
          ticket: '2026.43530',
          sedeCodigo: '7818',
          sede: '7818 - Av. Arequipa 440 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-007',
          tramiteNombre: 'Diploma de Egresado Malla Licenciamiento',
          carrera: 'NUTRICIÓN Y DIETÉTICA',
          periodo: '2026-1',
          seccion: '8ND01',
          alumnoId: 'C22AN02246',
          alumnoCodigo: 'C22AN02246',
          alumnoNombre: 'CALDERON ESPINAL, Junior Cesar',
          alumnoDni: '70291845',
          alumnoEmail: 'junior.calderon@carrion.edu.pe',
          alumnoTelefono: '984512390',
          alumnoCelular: '984512390',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 09:45:10 PM',
          costo: 350.00,
          conceptoCodigo: '33020115',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 350.00,
            carrera: 'Nutrición y Dietética',
            nroDocumento: '-',
            fechaPago: null,
            fechaObligacion: null
          },
          detalle: 'Diploma de egresado para trámite de colegiatura y prácticas avanzadas.',
          requisitos: [
            {
              id: 'REQ-02',
              orden: 1,
              titulo: 'Documento de Identidad Vigente',
              archivo: 'DNI_CALDERON.pdf',
              tipoArchivo: 'PDF',
              cumple: true,
              especificacion: 'Formato PDF'
            },
            {
              id: 'REQ-03',
              orden: 2,
              titulo: 'Constancia de no adeudo bibliográfico',
              archivo: 'NO_ADEUDO.pdf',
              tipoArchivo: 'PDF',
              cumple: false,
              especificacion: 'Formato PDF'
            }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null },
            { orden: 2, area: 'Grados y Títulos', plazoHoras: 72, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 09:45', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43529',
          ticket: '2026.43529',
          sedeCodigo: '7818',
          sede: '7818 - Av. Arequipa 440 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-008',
          tramiteNombre: 'Grado de Bachiller Técnico',
          carrera: 'FARMACIA TÉCNICA',
          periodo: '2026-2',
          seccion: '6FT12',
          alumnoId: 'C23BB08206',
          alumnoCodigo: 'C23BB08206',
          alumnoNombre: 'ADRIANZEN PEÑA, Lidia',
          alumnoDni: '46891234',
          alumnoEmail: 'lidia.adrianzen@carrion.edu.pe',
          alumnoTelefono: '912345678',
          alumnoCelular: '912345678',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 09:12:00 PM',
          costo: 600.00,
          conceptoCodigo: '33020112',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 600.00,
            carrera: 'Farmacia Técnica',
            nroDocumento: '-',
            fechaPago: null,
            fechaObligacion: null
          },
          detalle: 'Expediente de bachiller técnico convalidado.',
          requisitos: [
            {
              id: 'REQ-01',
              orden: 1,
              titulo: 'Fotografía formal fondo blanco',
              archivo: 'FOTO_LIDIA.jpg',
              tipoArchivo: 'JPG',
              cumple: true,
              especificacion: 'Fondo blanco'
            }
          ],
          proceso: [
            { orden: 1, area: 'Grados y Títulos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 09:12', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43528',
          ticket: '2026.43528',
          sedeCodigo: '7818',
          sede: '7818 - Av. Arequipa 440 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-009',
          tramiteNombre: 'Título Profesional Técnico (MALLA LICENCIAMIENTO)',
          carrera: 'ENFERMERÍA TÉCNICA',
          periodo: '2026-2',
          seccion: '6ET31',
          alumnoId: 'C23AE02615',
          alumnoCodigo: 'C23AE02615',
          alumnoNombre: 'LARA FABIAN, Jenifer',
          alumnoDni: '74128956',
          alumnoEmail: 'jennifer.lara@carrion.edu.pe',
          alumnoTelefono: '945671234',
          alumnoCelular: '945671234',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 08:30:00 PM',
          costo: 900.00,
          conceptoCodigo: '33020109',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: true,
            monto: 900.00,
            carrera: 'Enfermería Técnica',
            nroDocumento: '-',
            fechaPago: null,
            fechaObligacion: '2026-09-25 08:35:00'
          },
          detalle: 'Trámite de titulación profesional técnica.',
          requisitos: [
            {
              id: 'REQ-01',
              orden: 1,
              titulo: 'Grado de bachiller (ambos lados)',
              archivo: 'BACHILLER_LARA.pdf',
              tipoArchivo: 'PDF',
              cumple: true,
              especificacion: 'Documento escaneado nítido'
            },
            {
              id: 'REQ-02',
              orden: 2,
              titulo: 'Foto con la indumentaria de la especialidad con fondo blanco (nítida y vigente)',
              archivo: 'FOTO_TITULO.jpg',
              tipoArchivo: 'JPG',
              cumple: true,
              especificacion: 'Tamaño pasaporte'
            },
            {
              id: 'REQ-03',
              orden: 3,
              titulo: 'Información Laboral',
              archivo: 'CONSTANCIA_LABORAL.pdf',
              tipoArchivo: 'PDF',
              cumple: true,
              especificacion: 'Constancia de prácticas'
            },
            {
              id: 'REQ-04',
              orden: 4,
              titulo: 'Declaración Jurada para Título Malla Licenciamiento (descargar, completar con firma igual que el DNI y adjuntar)',
              archivo: 'DJ_TITULO.pdf',
              tipoArchivo: 'PDF',
              cumple: true,
              especificacion: 'Formato institucional firmado'
            }
          ],
          proceso: [
            {
              orden: 1,
              area: 'Dirección Académica',
              plazoHoras: 48,
              diasRetraso: 0,
              observacionInterna: 'Pendiente de pago previo para iniciar atención',
              estado: 'Pendiente',
              fechaAtencion: null
            }
          ],
          mensajeSolicitante: 'Una vez aprobada la solicitud, deberá realizar el pago en BCP, BBVA, Interbank o Scotiabank dentro del plazo máximo de 3 días. Puede realizar su pago en los bancos autorizados y yape, opción Trámites académicos con su código de alumno en mayúscula, pasos en el siguiente link: https://www.youtube.com/watch?v=CE2ZASixxYk',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 08:30', nota: 'Solicitud registrada por el alumno' },
            { estado: 'Solicitado', fecha: '2026-09-25 08:35', nota: 'Obligación de pago de S/ 900 generada' }
          ]
        },
        {
          id: '2026.43527',
          ticket: '2026.43527',
          sedeCodigo: '7818',
          sede: '7818 - Av. Arequipa 440 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-008',
          tramiteNombre: 'Grado de Bachiller Técnico',
          carrera: 'FARMACIA TÉCNICA',
          periodo: '2026-2',
          seccion: '6FT12',
          alumnoId: 'C23BB08206',
          alumnoCodigo: 'C23BB08206',
          alumnoNombre: 'ADRIANZEN PEÑA, Lidia',
          alumnoDni: '46891234',
          alumnoEmail: 'lidia.adrianzen@carrion.edu.pe',
          alumnoTelefono: '912345678',
          alumnoCelular: '912345678',
          estado: 'Cancelar',
          activo: false,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 07:15:00 PM',
          costo: 450.00,
          conceptoCodigo: '33020112',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 450.00,
            carrera: 'Farmacia Técnica',
            nroDocumento: '-',
            fechaPago: null
          },
          detalle: 'Cancelado por el alumno.',
          requisitos: [],
          proceso: [],
          mensajeSolicitante: 'Trámite cancelado a solicitud del estudiante.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 07:00', nota: 'Solicitud registrada' },
            { estado: 'Cancelar', fecha: '2026-09-25 07:15', nota: 'Cancelado por el estudiante' }
          ]
        },
        {
          id: '2026.43526',
          ticket: '2026.43526',
          sedeCodigo: '7818',
          sede: '7818 - Av. Arequipa 440 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-007',
          tramiteNombre: 'Diploma de Egresado Malla Licenciamiento',
          carrera: 'FARMACIA TÉCNICA',
          periodo: '2026-1',
          seccion: '6FT01',
          alumnoId: 'C22AF02736',
          alumnoCodigo: 'C22AF02736',
          alumnoNombre: 'LEON REY, Marcelo Francesco',
          alumnoDni: '71928341',
          alumnoEmail: 'marcelo.leon@carrion.edu.pe',
          alumnoTelefono: '984127890',
          alumnoCelular: '984127890',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 06:40:00 PM',
          costo: 350.00,
          conceptoCodigo: '33020115',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 350.00,
            carrera: 'Farmacia Técnica',
            nroDocumento: '-',
            fechaPago: null
          },
          detalle: 'Egresado de la carrera técnica de farmacia.',
          requisitos: [
            { id: 'REQ-02', orden: 1, titulo: 'Documento de Identidad Vigente', archivo: 'DNI_LEON.pdf', tipoArchivo: 'PDF', cumple: true, especificacion: 'Formato PDF' }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 06:40', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43525',
          ticket: '2026.43525',
          sedeCodigo: '7808',
          sede: '7808 - Av. Petit Thouars Nº 397 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-008',
          tramiteNombre: 'Certificado de Formación Continua (S1)',
          carrera: 'PODOLOGÍA CLÍNICA Y ESTÉTICA - F1',
          periodo: '2026-2',
          seccion: '4PC02',
          alumnoId: 'C24S103156',
          alumnoCodigo: 'C24S103156',
          alumnoNombre: 'VASQUEZ CHUQUI, Naomi',
          alumnoDni: '73948512',
          alumnoEmail: 'naomi.vasquez@carrion.edu.pe',
          alumnoTelefono: '934567123',
          alumnoCelular: '934567123',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 05:22:00 PM',
          costo: 150.00,
          conceptoCodigo: '33020109',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 150.00,
            carrera: 'Podología Clínica y Estética',
            nroDocumento: '-',
            fechaPago: null
          },
          detalle: 'Certificado modular formativo.',
          requisitos: [
            { id: 'REQ-01', orden: 1, titulo: 'Fotografía formal fondo blanco', archivo: 'FOTO_VASQUEZ.jpg', tipoArchivo: 'JPG', cumple: false, especificacion: 'Fondo blanco' }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 05:22', nota: 'Solicitud registrada' }
          ]
        },
        {
          id: '2026.43524',
          ticket: '2026.43524',
          sedeCodigo: '7808',
          sede: '7808 - Av. Petit Thouars Nº 397 Lima',
          institucion: 'I.E.S. Particular Daniel Alcides Carrión',
          tramiteId: 'T-006',
          tramiteNombre: 'Constancia de Estudios',
          carrera: 'TÉCNICA EN FISIOTERAPIA Y REHABILITACIÓN',
          periodo: '2026-2',
          seccion: '2FR01',
          alumnoId: 'C26BR08408',
          alumnoCodigo: 'C26BR08408',
          alumnoNombre: 'CUBAS DIAZ, Luselina',
          alumnoDni: '74829103',
          alumnoEmail: 'luselina.cubas@carrion.edu.pe',
          alumnoTelefono: '981234567',
          alumnoCelular: '981234567',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-09-25',
          fechaHora: '2026-09-25 04:10:00 PM',
          costo: 50.00,
          conceptoCodigo: '33020101',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: false,
            monto: 50.00,
            carrera: 'Fisioterapia y Rehabilitación',
            nroDocumento: '-',
            fechaPago: null
          },
          detalle: 'Constancia para presentación de seguro estudiantil.',
          requisitos: [],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: '', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: '',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-25 04:10', nota: 'Solicitud registrada' }
          ]
        },
        {
          id: '2026.43515',
          ticket: '2026.43515',
          sedeCodigo: '7803-2',
          sede: '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
          institucion: 'Universidad Norbert Wiener',
          tramiteId: 'T-009',
          tramiteNombre: 'Título Profesional Técnico (MALLA LICENCIAMIENTO)',
          carrera: 'ENFERMERÍA TÉCNICA',
          periodo: '2026-1',
          seccion: '6ET01',
          alumnoId: 'C22AE01192',
          alumnoCodigo: 'C22AE01192',
          alumnoNombre: 'HUAMAN PAREDES, Rosa María',
          alumnoDni: '72341908',
          alumnoEmail: 'rosa.huaman@uwiener.edu.pe',
          alumnoTelefono: '987654321',
          alumnoCelular: '987654321',
          estado: 'Aprobado',
          activo: true,
          fecha: '2026-09-20',
          fechaHora: '2026-09-20 04:47:00 PM',
          costo: 900.00,
          conceptoCodigo: '33020109',
          pago: {
            estado: 'pagado',
            obligacionGenerada: true,
            monto: 900.00,
            carrera: 'Enfermería Técnica',
            nroDocumento: 'REC-2026-094182',
            fechaPago: '2026-09-20 16:48:15',
            fechaObligacion: '2026-09-20 16:47:00'
          },
          detalle: 'Expediente completo validado para expedición de diploma de título.',
          requisitos: [
            {
              id: 'REQ-01',
              orden: 1,
              titulo: 'Grado de bachiller (ambos lados)',
              archivo: 'BACHILLER_HUAMAN.pdf',
              tipoArchivo: 'PDF',
              cumple: true,
              especificacion: 'Documento escaneado nítido'
            },
            {
              id: 'REQ-02',
              orden: 2,
              titulo: 'Foto con indumentaria reglamentaria',
              archivo: 'FOTO_ROSA.jpg',
              tipoArchivo: 'JPG',
              cumple: true,
              especificacion: 'Fondo blanco'
            }
          ],
          proceso: [
            {
              orden: 1,
              area: 'Grados y Títulos',
              plazoHoras: 48,
              diasRetraso: 0,
              observacionInterna: 'Atendido conforme. Expediente validado y carpetilla completa.',
              estado: 'Atendido',
              fechaAtencion: '2026-09-21 11:20 AM'
            },
            {
              orden: 2,
              area: 'Dirección Académica',
              plazoHoras: 48,
              diasRetraso: 0,
              observacionInterna: 'Procede emisión de título profesional técnico.',
              estado: 'Procede',
              fechaAtencion: '2026-09-22 09:15 AM'
            }
          ],
          mensajeSolicitante: 'Estimada estudiante, su trámite ha procedido satisfactoriamente. Se le notificará la fecha de entrega de diploma oficial.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-20 16:47', nota: 'Solicitud registrada por el alumno' },
            { estado: 'Solicitado', fecha: '2026-09-20 16:48', nota: 'Pago confirmado S/ 900 (REC-2026-094182)' },
            { estado: 'En proceso', fecha: '2026-09-21 11:20', nota: 'Grados y Títulos: Atendido' },
            { estado: 'Aprobado', fecha: '2026-09-22 09:15', nota: 'Dirección Académica: Procede' }
          ]
        },
        {
          id: '2026.43540',
          ticket: '2026.43540',
          sedeCodigo: '7803-2',
          sede: '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
          institucion: 'Universidad Norbert Wiener',
          tramiteId: 'T-004',
          tramiteNombre: 'Constancia de Matrícula',
          carrera: 'INGENIERÍA DE SISTEMAS E INFORMÁTICA',
          periodo: '2026-2',
          seccion: '8SI01',
          alumnoId: 'U-ALU-1',
          alumnoCodigo: '2021100345',
          alumnoNombre: 'María Fernanda Quispe',
          alumnoDni: '72845109',
          alumnoEmail: '2021100345@uwiener.edu.pe',
          alumnoTelefono: '984512390',
          alumnoCelular: '984512390',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-10-18',
          fechaHora: '2026-10-18 09:30:00 AM',
          costo: 25.00,
          conceptoCodigo: '01010025',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: true,
            monto: 25.00,
            carrera: 'Ingeniería de Sistemas e Informática',
            nroDocumento: 'NB-PENDIENTE',
            fechaPago: null
          },
          detalle: 'Constancia oficial de matrícula para trámite administrativo y seguro médico.',
          requisitos: [],
          proceso: [
            {
              orden: 1,
              area: 'Registros Académicos',
              plazoHoras: 24,
              diasRetraso: 0,
              observacionInterna: 'Solicitud recién recibida en cola.',
              estado: 'Pendiente',
              fechaAtencion: null
            }
          ],
          mensajeSolicitante: 'Tu solicitud ha sido registrada exitosamente y se encuentra en estado Solicitado a la espera de inicio de trámite.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-10-18 09:30', nota: 'Solicitud registrada por el alumno' }
          ]
        },
        {
          id: '2026.43510',
          ticket: '2026.43510',
          sedeCodigo: '7803-2',
          sede: '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
          institucion: 'Universidad Norbert Wiener',
          tramiteId: 'T-001',
          tramiteNombre: 'BECA IMPULSA 30%',
          carrera: 'INGENIERÍA DE SISTEMAS E INFORMÁTICA',
          periodo: '2026-2',
          seccion: '8SI01',
          alumnoId: 'U-ALU-1',
          alumnoCodigo: '2021100345',
          alumnoNombre: 'María Fernanda Quispe',
          alumnoDni: '75481920',
          alumnoEmail: '2021100345@uwiener.edu.pe',
          alumnoTelefono: '984512390',
          alumnoCelular: '984512390',
          estado: 'En revisión',
          activo: true,
          fecha: '2026-09-18',
          fechaHora: '2026-09-18 10:20:00 AM',
          costo: 0.00,
          conceptoCodigo: '00000000',
          pago: {
            estado: 'pagado',
            obligacionGenerada: true,
            monto: 0.00,
            carrera: 'Ingeniería de Sistemas e Informática',
            nroDocumento: 'COSTO CERO',
            fechaPago: '2026-09-18 10:20:00'
          },
          detalle: 'Solicitud de beca institucional por excelencia académica en tercio superior.',
          requisitos: [
            { id: 'REQ-01', orden: 1, titulo: 'Certificado de voluntariado', archivo: 'CERT_VOLUNTARIADO.pdf', tipoArchivo: 'PDF', cumple: true, especificacion: 'Formato PDF' },
            { id: 'REQ-02', orden: 2, titulo: 'DNI del solicitante', archivo: 'DNI_QUISPE.pdf', tipoArchivo: 'PDF', cumple: true, especificacion: 'Formato PDF' }
          ],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 48, diasRetraso: 0, observacionInterna: 'Récord de notas validado: promedio ponderado 16.80.', estado: 'Atendido', fechaAtencion: '2026-09-19 14:00' },
            { orden: 2, area: 'Retención y Fidelización', plazoHoras: 72, diasRetraso: 0, observacionInterna: 'Evaluación socioeconómica en curso.', estado: 'Pendiente', fechaAtencion: null }
          ],
          mensajeSolicitante: 'Estimada María Fernanda, tu expediente de Beca Impulsa está siendo evaluado por Retención y Fidelización.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-18 10:20', nota: 'Solicitud registrada por el alumno' },
            { estado: 'En revisión', fecha: '2026-09-19 14:00', nota: 'Registros Académicos: Validación de notas conforme' }
          ]
        },
        {
          id: '2026.43490',
          ticket: '2026.43490',
          sedeCodigo: '7803-1',
          sede: '7803-1 - Av. Arequipa 440 Lima Centro',
          institucion: 'Universidad Norbert Wiener',
          tramiteId: 'T-007',
          tramiteNombre: 'Constancia de Tercio Superior',
          carrera: 'ADMINISTRACIÓN Y DIRECCIÓN DE EMPRESAS',
          periodo: '2026-1',
          seccion: '7AD02',
          alumnoId: 'U-ALU-1',
          alumnoCodigo: '2021100345',
          alumnoNombre: 'María Fernanda Quispe',
          alumnoDni: '72845109',
          alumnoEmail: '2021100345@uwiener.edu.pe',
          alumnoTelefono: '912345678',
          alumnoCelular: '912345678',
          estado: 'Emitido',
          activo: true,
          fecha: '2026-09-15',
          fechaHora: '2026-09-15 08:30:00 AM',
          costo: 40.00,
          conceptoCodigo: '01010040',
          pago: {
            estado: 'pagado',
            obligacionGenerada: true,
            monto: 40.00,
            carrera: 'Administración y Dirección de Empresas',
            nroDocumento: 'NB-90370045',
            fechaPago: '2026-09-15 08:35:10'
          },
          detalle: 'Constancia oficial para trámite de prácticas preprofesionales en entidad financiera.',
          requisitos: [],
          proceso: [
            { orden: 1, area: 'Registros Académicos', plazoHoras: 24, diasRetraso: 0, observacionInterna: 'Verificado cuadro de méritos. Tercio superior confirmado.', estado: 'Atendido', fechaAtencion: '2026-09-15 11:00' },
            { orden: 2, area: 'Dirección Académica', plazoHoras: 24, diasRetraso: 0, observacionInterna: 'Firma digital aplicada. Constancia emitida.', estado: 'Procede', fechaAtencion: '2026-09-15 14:20' }
          ],
          mensajeSolicitante: 'Tu constancia de tercio superior ya se encuentra disponible para su descarga en la intranet con firma digital válida.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-09-15 08:30', nota: 'Solicitud registrada' },
            { estado: 'Solicitado', fecha: '2026-09-15 08:35', nota: 'Pago confirmado vía Niubiz (NB-90370045)' },
            { estado: 'Emitido', fecha: '2026-09-15 14:20', nota: 'Documento emitido con firma digital' }
          ]
        }
      ]
    };
  }

  function load() {
    let raw = localStorage.getItem(KEY);
    let s;
    if (!raw) { s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
    try { s = JSON.parse(raw); } catch (e) { s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
    
    // Auto-migración si faltan áreas, requisitos o conceptos en el almacenamiento existente
    let dirty = false;
    const defaults = seed();
    if (!s.areas || !Array.isArray(s.areas) || s.areas.length === 0) {
      s.areas = defaults.areas;
      dirty = true;
    }
    if (!s.requisitos || !Array.isArray(s.requisitos) || s.requisitos.length === 0) {
      s.requisitos = defaults.requisitos;
      dirty = true;
    }
    if (!s.conceptos || !Array.isArray(s.conceptos)) {
      s.conceptos = defaults.conceptos;
      dirty = true;
    }
    if (!s.sedesCatalogo || !Array.isArray(s.sedesCatalogo)) {
      s.sedesCatalogo = defaults.sedesCatalogo;
      dirty = true;
    }
    if (!s.colaboradores || !Array.isArray(s.colaboradores)) {
      s.colaboradores = defaults.colaboradores;
      dirty = true;
    }

    // Normalizar áreas existentes
    if (s.areas) {
      s.areas.forEach((a, idx) => {
        if (!a.codigo) { a.codigo = a.id; dirty = true; }
        if (!a.institucion) { a.institucion = 'Universidad Privada Norbert Wiener S.A.'; dirty = true; }
        if (!a.fechaRegistro) { a.fechaRegistro = '2022-06-10'; dirty = true; }
        if (!Array.isArray(a.sedes) || a.sedes.length === 0) {
          a.sedes = [
            { id: 'SED-1', nombre: '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima', activo: true }
          ];
          dirty = true;
        } else if (typeof a.sedes[0] === 'string') {
          a.sedes = a.sedes.map((sNom, sIdx) => ({
            id: 'SED-' + (sIdx + 1),
            nombre: sNom.includes('-->') ? sNom : `7803-${sIdx+1} --> ${sNom}`,
            activo: true
          }));
          dirty = true;
        }
        if (!Array.isArray(a.responsables)) {
          a.responsables = [];
          dirty = true;
        } else {
          a.responsables.forEach((r, rIdx) => {
            if (!r.personal) { r.personal = String(600000 + idx * 1000 + rIdx); dirty = true; }
            if (!r.sede) {
              r.sede = a.sedes && a.sedes[0] ? (typeof a.sedes[0] === 'string' ? a.sedes[0] : a.sedes[0].nombre) : '7803-2 --> LOCAL 1 / Jr. Larrabure y Unanue 110 Santa Beatriz, Lima';
              dirty = true;
            }
            if (!r.cargo) { r.cargo = 'Responsable'; dirty = true; }
            if (r.activo === undefined) { r.activo = true; dirty = true; }
          });
        }
      });
    }

    // Asegurar compatibilidad en trámites existentes
    if (s.tramites) {
      // Si no están los trámites de referencia de producción, integrarlos
      const tieneBeca30 = s.tramites.some(t => t.nombre && t.nombre.includes('BECA IMPULSA 30%'));
      if (!tieneBeca30) {
        const seedTs = seed().tramites;
        s.tramites = seedTs;
        dirty = true;
      }

      s.tramites.forEach((t, idx) => {
        if (!t.codigo) { t.codigo = t.id; dirty = true; }
        if (t.tipoActivacion === undefined) { t.tipoActivacion = 'Permanente'; dirty = true; }
        if (t.tiempoVigenciaHrs === undefined) { t.tiempoVigenciaHrs = 72; dirty = true; }
        if (t.plazoRecojoDias === undefined) { t.plazoRecojoDias = t.diasEntrega || 3; dirty = true; }
        if (t.envioCorreo === undefined) { t.envioCorreo = true; dirty = true; }
        if (!t.fechaRegistro) { t.fechaRegistro = '2026-07-' + String(15 + (idx % 10)).padStart(2, '0'); dirty = true; }
        if (t.observacion === undefined) { t.observacion = ''; dirty = true; }
        if (!Array.isArray(t.requisitos)) {
          t.requisitos = t.requiereAdjunto ? [
            { id: 'REQ-002', titulo: 'DNI del paciente / solicitante', adjuntarArchivo: true, formato: 'PDF', activo: true, orden: 1 }
          ] : [];
          dirty = true;
        }
        if (!Array.isArray(t.proceso) || t.proceso.length === 0) {
          t.proceso = [
            { id: 'P-1', orden: 1, area: t.area || 'Registros Académicos', descripcion: 'revisa las notas', observacion: '', duracionDias: t.diasEntrega || 2, activo: true }
          ];
          if (t.area && t.area !== 'Soluciones Financieras') {
            t.proceso.push({
              id: 'P-2', orden: 2, area: 'Soluciones Financieras', descripcion: 'Validación de derechos de trámite y comprobante', observacion: '', duracionDias: 1, activo: true
            });
          }
          dirty = true;
        }
        if (!Array.isArray(t.cronogramas)) {
          t.cronogramas = [
            { id: 'CR-01', grado: 'Pregrado', modalidad: 'Modalidad Ordinaria', facultad: 'Todas', carrera: 'Todas', periodo: '2026-1', fechaInicio: '2026-10-01', fechaFin: '2026-11-01', activo: true }
          ];
          dirty = true;
        } else {
          t.cronogramas.forEach((c, cIdx) => {
            if (!c.id) { c.id = 'CR-' + (cIdx + 1); dirty = true; }
            if (!c.grado) { c.grado = 'Pregrado'; dirty = true; }
            if (!c.modalidad) { c.modalidad = 'Modalidad Ordinaria'; dirty = true; }
            if (!c.facultad) { c.facultad = 'Todas'; dirty = true; }
            if (!c.carrera) { c.carrera = 'Todas'; dirty = true; }
            if (!c.periodo) { c.periodo = '2026-1'; dirty = true; }
            if (!c.fechaInicio) { c.fechaInicio = '2026-10-01'; dirty = true; }
            if (!c.fechaFin) { c.fechaFin = '2026-11-01'; dirty = true; }
            if (c.activo === undefined) { c.activo = true; dirty = true; }
          });
        }
        if (!Array.isArray(t.correos) || !t.correos.length) {
          t.correos = [
            {
              id: 'MAIL-' + (t.id || 'T') + '-1',
              tipoEstado: 'Aprobado',
              remitente: 'cobranzas@uwiener.edu.pe',
              password: '••••••••',
              asunto: `CONFIRMACIÓN TRAMITE ${t.nombre.toUpperCase()}`,
              cc: 'registros@uwiener.edu.pe',
              contenido: `<div>Estimado estudiante:</div><br><div>Agradecemos su atención y le informamos que el trámite de <b>«${t.nombre}»</b> se realizó con éxito. Recuerde que podrá verificar su constancia o estado a través del portal institucional.</div>`,
              activo: true
            },
            {
              id: 'MAIL-' + (t.id || 'T') + '-2',
              tipoEstado: 'Rechazado',
              remitente: 'cobranzas@uwiener.edu.pe',
              password: '••••••••',
              asunto: `CONFIRMACIÓN TRAMITE ${t.nombre.toUpperCase()}`,
              cc: 'registros@uwiener.edu.pe',
              contenido: `<div>Estimado estudiante:</div><br><div>Le informamos que su trámite de <b>«${t.nombre}»</b> no ha cumplido con los requisitos y fue <b>RECHAZADO</b>. Ingrese a la plataforma para conocer las observaciones correspondientes.</div>`,
              activo: true
            },
            {
              id: 'MAIL-' + (t.id || 'T') + '-3',
              tipoEstado: 'Observado',
              remitente: 'cobranzas@uwiener.edu.pe',
              password: '••••••••',
              asunto: `CONFIRMACIÓN TRAMITE ${t.nombre.toUpperCase()}`,
              cc: 'registros@uwiener.edu.pe',
              contenido: `<div>Estimado estudiante:</div><br><div>Su trámite de <b>«${t.nombre}»</b> cuenta con observaciones pendientes. Por favor ingrese a su intranet para regularizar la documentación requerida dentro del plazo.</div>`,
              activo: true
            }
          ];
          dirty = true;
        }
        if (!t.correoConfig) {
          t.correoConfig = {
            remitente: t.correos[0].remitente,
            asunto: t.correos[0].asunto,
            mensaje: t.correos[0].contenido
          };
          dirty = true;
        }
      });
    }

    // Normalizar requisitos existentes
    if (s.requisitos) {
      s.requisitos.forEach((r, idx) => {
        if (!r.codigo) { r.codigo = r.id; dirty = true; }
        if (!r.fechaRegistro) { r.fechaRegistro = '2026-06-' + String(10 + idx).padStart(2, '0'); dirty = true; }
        if (r.formato === 'PDF o JPG' || r.formato === 'ZIP o PDF') { r.formato = 'PDF'; dirty = true; }
        if (r.formato === 'JPG o PNG') { r.formato = 'JPG'; dirty = true; }
        if (!r.formato && r.requiereAdjunto) { r.formato = 'PDF'; dirty = true; }
      });
    }

    // Normalizar solicitudes existentes (actualización a esquema Vista de Trámites)
    if (!s.solicitudes || s.solicitudes.length < 8 || !s.solicitudes.some(x => x.ticket)) {
      s.solicitudes = defaults.solicitudes;
      dirty = true;
    } else {
      s.solicitudes.forEach((sol, idx) => {
        if (!sol.ticket) { sol.ticket = sol.id || ('2026.' + (43530 - idx)); dirty = true; }
        if (!sol.sedeCodigo) { sol.sedeCodigo = sol.sede ? sol.sede.slice(0, 4) : '7803'; dirty = true; }
        if (!sol.sede) { sol.sede = '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima'; dirty = true; }
        if (!sol.institucion) {
          sol.institucion = (sol.carrera && sol.carrera.toUpperCase().includes('TÉCNIC')) ? 'I.E.S. Particular Daniel Alcides Carrión' : 'Universidad Norbert Wiener';
          dirty = true;
        }
        if (sol.activo === undefined) { sol.activo = sol.estado !== 'Cancelar'; dirty = true; }
        if (!sol.pago) {
          sol.pago = { estado: 'pendiente', obligacionGenerada: false, monto: sol.costo || 0, carrera: sol.carrera || '', nroDocumento: '-', fechaPago: null };
          dirty = true;
        }
        if (sol.pago.obligacionGenerada === undefined) { sol.pago.obligacionGenerada = sol.pago.estado === 'pagado'; dirty = true; }
        if (!Array.isArray(sol.requisitos)) { sol.requisitos = []; dirty = true; }
        if (!Array.isArray(sol.proceso)) { sol.proceso = []; dirty = true; }
        if (sol.mensajeSolicitante === undefined) { sol.mensajeSolicitante = sol.observacion || ''; dirty = true; }
        if (!sol.fechaHora) { sol.fechaHora = sol.fecha + ' 10:00:00 AM'; dirty = true; }
      });

      // Asegurar que el trámite 'Solicitado' para María Fernanda Quispe exista en solicitudes
      const tieneSolicitadoAlu1 = s.solicitudes.some(sol => sol.alumnoId === 'U-ALU-1' && (sol.estado === 'Solicitado' || sol.id === '2026.43540'));
      if (!tieneSolicitadoAlu1) {
        const tramiteSolicitado = defaults.solicitudes.find(sol => sol.id === '2026.43540') || {
          id: '2026.43540',
          ticket: '2026.43540',
          sedeCodigo: '7803-2',
          sede: '7803-2 - Jr. Larrabure y Unanue 110 Santa Beatriz, Lima',
          institucion: 'Universidad Norbert Wiener',
          tramiteId: 'T-004',
          tramiteNombre: 'Constancia de Matrícula',
          carrera: 'INGENIERÍA DE SISTEMAS E INFORMÁTICA',
          periodo: '2026-2',
          seccion: '8SI01',
          alumnoId: 'U-ALU-1',
          alumnoCodigo: '2021100345',
          alumnoNombre: 'María Fernanda Quispe',
          alumnoDni: '72845109',
          alumnoEmail: '2021100345@uwiener.edu.pe',
          alumnoTelefono: '984512390',
          alumnoCelular: '984512390',
          estado: 'Solicitado',
          activo: true,
          fecha: '2026-10-18',
          fechaHora: '2026-10-18 09:30:00 AM',
          costo: 25.00,
          conceptoCodigo: '01010025',
          pago: {
            estado: 'pendiente',
            obligacionGenerada: true,
            monto: 25.00,
            carrera: 'Ingeniería de Sistemas e Informática',
            nroDocumento: 'NB-PENDIENTE',
            fechaPago: null
          },
          detalle: 'Constancia oficial de matrícula para trámite administrativo y seguro médico.',
          requisitos: [],
          proceso: [
            {
              orden: 1,
              area: 'Registros Académicos',
              plazoHoras: 24,
              diasRetraso: 0,
              observacionInterna: 'Solicitud recién recibida en cola.',
              estado: 'Pendiente',
              fechaAtencion: null
            }
          ],
          mensajeSolicitante: 'Tu solicitud ha sido registrada exitosamente y se encuentra en estado Solicitado a la espera de inicio de trámite.',
          historial: [
            { estado: 'Solicitado', fecha: '2026-10-18 09:30', nota: 'Solicitud registrada por el alumno' }
          ]
        };
        s.solicitudes.unshift(tramiteSolicitado);
        dirty = true;
      }

      // Asegurar que 2026.43490 pertenezca a U-ALU-1 para completar los 3 trámites
      const solTercio = s.solicitudes.find(sol => sol.id === '2026.43490');
      if (solTercio && solTercio.alumnoId !== 'U-ALU-1') {
        solTercio.alumnoId = 'U-ALU-1';
        solTercio.alumnoCodigo = '2021100345';
        solTercio.alumnoNombre = 'María Fernanda Quispe';
        solTercio.alumnoEmail = '2021100345@uwiener.edu.pe';
        dirty = true;
      }
    }

    if (dirty) save(s);
    return s;
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
    areas() { return load().areas || []; },
    requisitos() { return load().requisitos || []; },
    conceptos() { return load().conceptos || []; },
    sedesCatalogo() { return load().sedesCatalogo || []; },
    colaboradores() { return load().colaboradores || []; },
    getTramite(id) { return load().tramites.find(t => t.id === id); },
    getUsuario(id) { return load().usuarios.find(u => u.id === id); },
    getArea(id) { return (load().areas || []).find(a => a.id === id); },
    getRequisito(id) { return (load().requisitos || []).find(r => r.id === id || r.codigo === id); },
    upsertTramite(t) {
      const db = load();
      const i = db.tramites.findIndex(x => x.id === t.id);
      if (i >= 0) db.tramites[i] = t; else { t.id = 'T-' + String(db.tramites.length + 1).padStart(3, '0'); db.tramites.push(t); }
      save(db); return t;
    },
    deleteTramite(id) { const db = load(); db.tramites = db.tramites.filter(t => t.id !== id); save(db); },
    upsertArea(a) {
      const db = load();
      if (!db.areas) db.areas = [];
      const i = db.areas.findIndex(x => x.id === a.id);
      if (i >= 0) db.areas[i] = a; else { a.id = 'A-' + String(db.areas.length + 1).padStart(3, '0'); db.areas.push(a); }
      save(db); return a;
    },
    deleteArea(id) { const db = load(); db.areas = (db.areas || []).filter(a => a.id !== id); save(db); },
    upsertRequisito(r) {
      const db = load();
      if (!db.requisitos) db.requisitos = [];
      const i = db.requisitos.findIndex(x => x.id === r.id);
      if (i >= 0) db.requisitos[i] = r; else { r.id = 'REQ-' + String(db.requisitos.length + 1).padStart(3, '0'); r.codigo = r.id; db.requisitos.push(r); }
      save(db); return r;
    },
    deleteRequisito(id) { const db = load(); db.requisitos = (db.requisitos || []).filter(r => r.id !== id); save(db); },
    upsertUsuario(u) {
      const db = load();
      const i = db.usuarios.findIndex(x => x.id === u.id);
      if (i >= 0) db.usuarios[i] = u; else { u.id = 'U-' + Date.now(); db.usuarios.push(u); }
      save(db); return u;
    },
    addSolicitud(s) { const db = load(); db.solicitudes.unshift(s); save(db); return s; },
    updateSolicitud(s) { const db = load(); const i = db.solicitudes.findIndex(x => x.id === s.id); if (i >= 0) db.solicitudes[i] = s; save(db); return s; },
    getSolicitud(idOrTicket) { return load().solicitudes.find(s => s.id === idOrTicket || s.ticket === idOrTicket); },
    generarObligacionPago(idOrTicket) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      if (!s.pago) s.pago = { estado: 'pendiente', monto: s.costo };
      s.pago.obligacionGenerada = true;
      const now = new Date();
      s.pago.fechaObligacion = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      if (!s.historial) s.historial = [];
      s.historial.push({
        estado: s.estado,
        fecha: s.pago.fechaObligacion,
        nota: 'Obligación de pago generada por el administrativo (Monto: S/ ' + Number(s.pago.monto || s.costo).toFixed(2) + ')'
      });
      save(db);
      return s;
    },
    simularPagoSolicitud(idOrTicket) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      if (!s.pago) s.pago = { monto: s.costo };
      s.pago.estado = 'pagado';
      s.pago.obligacionGenerada = true;
      const now = new Date();
      s.pago.fechaPago = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 8);
      s.pago.nroDocumento = 'REC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      if (!s.historial) s.historial = [];
      s.historial.push({
        estado: s.estado,
        fecha: s.pago.fechaPago,
        nota: 'Pago confirmado en caja / pasarela (Doc: ' + s.pago.nroDocumento + ')'
      });
      save(db);
      return s;
    },
    cambiarArchivoRequisito(idOrTicket, reqId, nuevoNombreArchivo) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      if (!s.historial) s.historial = [];
      const r = (s.requisitos || []).find(x => x.id === reqId);
      if (r) {
        const anterior = r.archivo;
        r.archivo = nuevoNombreArchivo;
        const now = new Date();
        const fechaStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
        s.historial.push({
          estado: s.estado,
          fecha: fechaStr,
          nota: `Archivo de requisito «${(r.titulo || '').slice(0, 30)}» actualizado de [${anterior}] a [${nuevoNombreArchivo}] por el administrativo`
        });
        save(db);
      }
      return s;
    },
    toggleCumpleRequisito(idOrTicket, reqId, cumple) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      const r = (s.requisitos || []).find(x => x.id === reqId);
      if (r) {
        r.cumple = cumple;
        save(db);
      }
      return s;
    },
    grabarMensajeSolicitante(idOrTicket, mensaje) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      s.mensajeSolicitante = mensaje;
      if (!s.historial) s.historial = [];
      const now = new Date();
      const fechaStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      s.historial.push({
        estado: s.estado,
        fecha: fechaStr,
        nota: 'Mensaje institucional grabado para el estudiante'
      });
      save(db);
      return s;
    },
    actualizarEstadoSolicitud(idOrTicket, nuevoEstado, activo) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      s.estado = nuevoEstado;
      if (activo !== undefined) s.activo = activo;
      if (!s.historial) s.historial = [];
      const now = new Date();
      const fechaStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      s.historial.push({
        estado: s.estado,
        fecha: fechaStr,
        nota: 'Estado actualizado a «' + nuevoEstado + '» (Activo: ' + (s.activo ? 'Sí' : 'No') + ')'
      });
      save(db);
      return s;
    },
    avanzarEtapaProceso(idOrTicket, ordenEtapa, observacionInterna) {
      const db = load();
      const s = db.solicitudes.find(x => x.id === idOrTicket || x.ticket === idOrTicket);
      if (!s) return null;
      const step = (s.proceso || []).find(p => p.orden === ordenEtapa);
      if (step) {
        step.estado = 'Procede';
        if (observacionInterna !== undefined) step.observacionInterna = observacionInterna;
        const now = new Date();
        step.fechaAtencion = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
        const todasAtendidas = s.proceso.every(p => p.estado === 'Atendido' || p.estado === 'Procede');
        if (todasAtendidas) {
          s.estado = 'Aprobado';
        }
        if (!s.historial) s.historial = [];
        s.historial.push({
          estado: s.estado,
          fecha: step.fechaAtencion,
          nota: `Etapa ${ordenEtapa} (${step.area}) atendida: Procede. Obs: ${observacionInterna || 'Conforme'}`
        });
        save(db);
      }
      return s;
    },
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
