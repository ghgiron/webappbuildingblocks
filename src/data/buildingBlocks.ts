import { BuildingBlock, SimulationStepData } from '../types';

export const BUILDING_BLOCKS: BuildingBlock[] = [
  // =========================================================================
  // CAPA 1: TECHO Y ÁTICO (COBERTURA, CANALES Y MONITOREO - 5 BLOQUES)
  // =========================================================================
  {
    id: 'mensajeria',
    number: 8,
    name: 'Mensajería',
    shortName: 'Mensajería',
    category: 'ciudadania',
    categoryLabel: 'Canal Multicanal',
    color: '#CA8A04',
    borderColor: '#A16207',
    bgLight: '#FEFCE8',
    iconName: 'BellRing',
    description: 'Canal automatizado para enviar notificaciones masivas o individuales por correo y SMS a la ciudadanía.',
    example: 'Enviar un mensaje de texto al ciudadano confirmando que su cupo escolar ha sido asignado.',
    shape: {
      pathD: 'M 275,35 L 325,35 L 295,215 L 195,215 Z',
      centerX: 255,
      centerY: 145,
      shapeClass: 'clip-trapezoid-left-roof',
      clipPathCss: 'polygon(40% 0%, 100% 0%, 80% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 7,
      stepTitle: '7. Notificación de pago habilitado',
      actionDescription: 'El ciudadano recibe un mensaje de texto/correo indicando que la solicitud fue aprobada y está lista para pagar en línea.'
    }
  },
  {
    id: 'observabilidad',
    number: 6,
    name: 'Observabilidad y analítica',
    shortName: 'Observabilidad y analítica',
    category: 'analitica',
    categoryLabel: 'Monitoreo e IA',
    color: '#65A30D',
    borderColor: '#4D7C0F',
    bgLight: '#F7FEE7',
    iconName: 'Activity',
    description: 'Monitorea en tiempo real el rendimiento del sistema, el registro de eventos y funcionamiento de los modelos de IA.',
    example: 'Si miles de personas ingresan al tiempo el último día de pago de impuestos, el sistema detecta el alto tráfico y reasigna recursos para evitar que la página se ponga lenta o se caiga.',
    shape: {
      pathD: 'M 325,35 L 385,35 L 425,215 L 295,215 Z',
      centerX: 355,
      centerY: 145,
      shapeClass: 'clip-trapezoid-top',
      clipPathCss: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
    }
  },
  {
    id: 'programacion',
    number: 7,
    name: 'Programación',
    shortName: 'Programación',
    category: 'orquestacion',
    categoryLabel: 'Tareas Programadas',
    color: '#EA580C',
    borderColor: '#C2410C',
    bgLight: '#FFF7ED',
    iconName: 'Clock',
    description: 'Ejecuta tareas recurrentes o en fechas y horas específicas de forma automática.',
    example: 'Programar la tarea de notificar a las personas que declararon renta en la vigencia anterior.',
    shape: {
      pathD: 'M 385,35 L 435,35 L 545,215 L 425,215 Z',
      centerX: 450,
      centerY: 145,
      shapeClass: 'clip-slope-right-top',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 25% 100%)',
    }
  },
  {
    id: 'sig_gis',
    number: 12,
    name: 'Bloque SIG / GIS',
    shortName: 'Bloque SIG / GIS',
    category: 'datos',
    categoryLabel: 'Mapas y Territorio',
    color: '#0284C7',
    borderColor: '#0369A1',
    bgLight: '#F0F9FF',
    iconName: 'MapPin',
    description: 'Permite integrar rápidamente datos geoespaciales, mapas y puntos de interés relacionados con la oferta de servicios del Distrito.',
    example: 'Consultar en un mapa la ubicación de las comisarías de familia más cercanas y los servicios a los que puede acceder la ciudadanía.',
    shape: {
      pathD: 'M 195,215 L 360,215 L 360,430 L 105,430 Z',
      centerX: 250,
      centerY: 325,
      shapeClass: 'clip-slope-left',
      clipPathCss: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)',
    }
  },
  {
    id: 'satisfaccion',
    number: 4,
    name: 'Satisfacción ciudadana',
    shortName: 'Satisfacción ciudadana',
    category: 'ciudadania',
    categoryLabel: 'Voz Ciudadana',
    color: '#E11D48',
    borderColor: '#BE123C',
    bgLight: '#FFF1F2',
    iconName: 'HeartHandshake',
    description: 'Permite medir la percepción tras realizar un trámite o acceder a un servicio digital.',
    example: 'Al terminar la generación del Certificado de Industria y Comercio, aparece una breve encuesta de 3 preguntas para calificar la experiencia.',
    shape: {
      pathD: 'M 360,215 L 545,215 L 675,430 L 360,430 Z',
      centerX: 495,
      centerY: 325,
      shapeClass: 'clip-slope-right',
      clipPathCss: 'polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 10,
      stepTitle: '10. Recibo y calificación',
      actionDescription: 'El ciudadano descarga su comprobante y califica su experiencia con el servicio en una breve encuesta.'
    }
  },

  // =========================================================================
  // CAPA 2: CUERPO MEDIO / MUROS, PUERTA Y VENTANAS (6 BLOQUES)
  // =========================================================================
  {
    id: 'firma',
    number: 9,
    name: 'Firma electrónica',
    shortName: 'Firma electrónica',
    category: 'transaccional',
    categoryLabel: 'Validez Jurídica',
    color: '#DB2777',
    borderColor: '#BE185D',
    bgLight: '#FDF2F8',
    iconName: 'FileSignature',
    description: 'Permite la firma electrónica de documentos y verificación de integridad.',
    example: 'Cuando el ciudadano solicita un subsidio de vivienda o un acuerdo de pago con la Alcaldía, puede firmar la solicitud directamente desde su celular usando una clave segura o su correo, sin tener que imprimir el formulario, ni desplazarse a una oficina.',
    shape: {
      pathD: 'M 105,430 L 275,430 L 275,625 L 105,625 Z',
      centerX: 190,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    }
  },
  {
    id: 'workflow',
    number: 13,
    name: 'Flujo de trabajo (Workflow)',
    shortName: 'Flujo de trabajo (Workflow)',
    category: 'orquestacion',
    categoryLabel: 'Orquestación de Procesos',
    color: '#4F46E5',
    borderColor: '#4338CA',
    bgLight: '#EEF2FF',
    iconName: 'GitBranch',
    description: 'Motor que modela, automatiza y orquesta los procesos y aprobaciones internas entre entidades frente a un trámite o servicio.',
    example: 'Enviar automáticamente una solicitud de licencia de construcción para que la revise primero un área técnica, luego la jurídica y finalmente se emita la respuesta.',
    shape: {
      pathD: 'M 275,430 L 505,430 L 505,625 L 275,625 Z',
      centerX: 390,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 4,
      stepTitle: '4. Orquestación del proceso',
      actionDescription: 'El motor de procesos coordina las revisiones y validaciones internas entre las entidades/áreas competentes.'
    }
  },
  {
    id: 'consentimiento',
    number: 10,
    name: 'Consentimiento',
    shortName: 'Consentimiento',
    category: 'seguridad',
    categoryLabel: 'Soberanía de Datos',
    color: '#7C3AED',
    borderColor: '#6D28D9',
    bgLight: '#F5F3FF',
    iconName: 'ShieldCheck',
    description: 'El ciudadano autoriza, administra y controla de manera transparente cómo las entidades del Distrito pueden utilizar y compartir sus datos personales para fines misionales.',
    example: 'Al inscribirse en un programa de la Secretaría de Integración Social, el ciudadano autoriza consultar sus datos también por la Secretaría de Educación o Secretaría de Salud para ser focalizado en otros beneficios o servicios distritales.',
    shape: {
      pathD: 'M 505,430 L 675,430 L 675,625 L 505,625 Z',
      centerX: 590,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 8,
      stepTitle: '8. Autorización de datos',
      actionDescription: 'El ciudadano ingresa información complementaria y autoriza el uso transparente de sus datos personales.'
    }
  },
  {
    id: 'registro',
    number: 14,
    name: 'Registro',
    shortName: 'Registro',
    category: 'transaccional',
    categoryLabel: 'Gestión Documental',
    color: '#059669',
    borderColor: '#047857',
    bgLight: '#ECFDF5',
    iconName: 'FileText',
    description: 'Encargado de registrar una solicitud y asignar un número de caso, validar información y emitir notificaciones.',
    example: 'Al radicar una solicitud, el sistema recibe los documentos, valida datos y entrega de inmediato un número de radicado para seguimiento en tiempo real del ciudadano.',
    shape: {
      pathD: 'M 105,625 L 275,625 L 275,820 L 105,820 Z',
      centerX: 190,
      centerY: 722,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 3,
      stepTitle: '3. Radicación de solicitud',
      actionDescription: 'Se radica el trámite y se genera un número de radicado.'
    }
  },
  {
    id: 'identidad',
    number: 2,
    name: 'Identidad y acceso',
    shortName: 'Identidad y acceso',
    category: 'seguridad',
    categoryLabel: 'Puerta Principal / Acceso',
    color: '#2563EB',
    borderColor: '#1D4ED8',
    bgLight: '#EFF6FF',
    iconName: 'Fingerprint',
    description: 'Permite al ciudadano acceder a los servicios digitales de Bogotá, usando credenciales verificables emitidas por el Portal Bogotá y entidades distritales, así mismo mediante el uso de autenticación federada. Se utilizan estándares como Keycloak, OIDC y OAuth2.',
    example: 'Iniciar sesión una sola vez en el Portal para consultar desde citas médicas en la Secretaría de Salud hasta obligaciones tributarias con la Secretaría de Hacienda.',
    shape: {
      pathD: 'M 275,625 L 505,625 L 505,820 L 275,820 Z',
      centerX: 390,
      centerY: 722,
      shapeClass: 'clip-rect-door',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 1,
      stepTitle: '1. Ingreso seguro',
      actionDescription: 'El ciudadano inicia sesión una sola vez en el Portal para realizar trámites y servicios Distritales.'
    }
  },
  {
    id: 'pagos',
    number: 3,
    name: 'Pagos',
    shortName: 'Pagos',
    category: 'transaccional',
    categoryLabel: 'Recaudo Seguro',
    color: '#0D9488',
    borderColor: '#0F766E',
    bgLight: '#F0FDFA',
    iconName: 'CreditCard',
    description: 'Permite que cualquier Entidad Distrital lo use para habilitar pagos virtuales en sus plataformas de manera segura, validando las obligaciones pendientes del ciudadano, el pago y verificación de la transacción.',
    example: 'Pagar los impuestos distritales o el permiso para usar el estadio Nemesio Camacho El Campín.',
    shape: {
      pathD: 'M 505,625 L 675,625 L 675,820 L 505,820 Z',
      centerX: 590,
      centerY: 722,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 9,
      stepTitle: '9. Pago virtual y recaudo por SDH',
      actionDescription: 'Se procesa y confirma la transacción electrónica para saldar las obligaciones del trámite.'
    }
  },

  // =========================================================================
  // CAPA 3: CIMIENTOS / PISO BASE INFERIOR (DATOS E INFRAESTRUCTURA - 4 BLOQUES)
  // =========================================================================
  {
    id: 'dwh',
    number: 15,
    name: 'Integración DWH (Data Warehouse)',
    shortName: 'Integración DWH',
    category: 'analitica',
    categoryLabel: 'Inteligencia Distrital',
    color: '#B45309',
    borderColor: '#92400E',
    bgLight: '#FFFBEB',
    iconName: 'BarChart3',
    description: 'Sincroniza y centraliza la información transaccional de múltiples secretarías en un repositorio analítico unificado del Distrito.',
    example: 'Habilitación de tableros analíticos para cruzar datos de sectores Educación, Social y Movilidad, permitiendo identificar con precisión qué zonas de la ciudad necesitan con urgencia nuevos colegios o centros médicos.',
    shape: {
      pathD: 'M 105,820 L 247.5,820 L 247.5,960 L 125,960 Q 105,960 105,940 Z',
      centerX: 176,
      centerY: 890,
      shapeClass: 'clip-foundation-left',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 2,
      stepTitle: '2. Consulta de Huella Ciudadana',
      actionDescription: 'El sistema consulta el historial de interacciones del ciudadano.'
    }
  },
  {
    id: 'eventstore',
    number: 5,
    name: 'EventStore',
    shortName: 'EventStore',
    category: 'datos',
    categoryLabel: 'Trazabilidad Inmutable',
    color: '#D97706',
    borderColor: '#B45309',
    bgLight: '#FFFBEB',
    iconName: 'Layers',
    description: 'Es la “caja negra” del Portal Bogotá. Registra de forma segura e inmutable cada evento o transacción que genera el ciudadano.',
    example: 'Cuando el ciudadano solicita un subsidio, el sistema guarda en orden cronológico exacto cada etapa del trámite para que nunca se pierda la trazabilidad.',
    shape: {
      pathD: 'M 247.5,820 L 390,820 L 390,960 L 247.5,960 Z',
      centerX: 318,
      centerY: 890,
      shapeClass: 'clip-foundation-mid-left',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 5,
      stepTitle: '5. Trazabilidad inmutable',
      actionDescription: 'Se registran en orden cronológico exacto los eventos del trámite en la "caja negra" del Portal.'
    }
  },
  {
    id: 'registros_digitales',
    number: 11,
    name: 'Registros Digitales',
    shortName: 'Registros Digitales',
    category: 'datos',
    categoryLabel: 'Base Maestra',
    color: '#7C3AED',
    borderColor: '#5B21B6',
    bgLight: '#F5F3FF',
    iconName: 'Database',
    description: 'Mantiene registros únicos de personas, organizaciones y servicios para asegurar la consistencia de datos maestros.',
    example: 'Si el ciudadano actualiza su dirección en la Secretaría de Planeación, el cambio se refleja en la base maestra para que la Secretaría de Salud y la Secretaría de Hacienda consulten el dato actualizado sin pedirlo de nuevo.',
    shape: {
      pathD: 'M 390,820 L 532.5,820 L 532.5,960 L 390,960 Z',
      centerX: 461,
      centerY: 890,
      shapeClass: 'clip-foundation-mid-right',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 6,
      stepTitle: '6. Actualización distrital',
      actionDescription: 'Se actualizan/consultan los datos maestros, por ejemplo del Registro Social de Bogotá mediante interoperabilidad entre entidades.'
    }
  },
  {
    id: 'interoperabilidad',
    number: 1,
    name: 'Interoperabilidad',
    shortName: 'Interoperabilidad',
    category: 'orquestacion',
    categoryLabel: 'Conectividad Distrital',
    color: '#0891B2',
    borderColor: '#0E7490',
    bgLight: '#ECFEFF',
    iconName: 'Network',
    description: 'El habilitante que permite a entidades del Distrito compartir información entre sí de forma segura.',
    example: 'Si la Secretaría de Educación necesita verificar un dato sobre la residencia de un estudiante y su nivel socioeconómico para el proceso de matrícula, este bloque permite conectarse con la Secretaría de Planeación para validarlo.',
    shape: {
      pathD: 'M 532.5,820 L 675,820 L 675,940 Q 675,960 655,960 L 532.5,960 Z',
      centerX: 603,
      centerY: 890,
      shapeClass: 'clip-foundation-right',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    }
  },
];

// =========================================================================
// SECUENCIA OFICIAL DE PASOS EN LA SIMULACIÓN DE TRÁMITE
// (2 ➔ 15 ➔ 14 ➔ 13 ➔ 5 ➔ 11 + 1 ➔ 8 ➔ 10 ➔ 3 ➔ 4)
// =========================================================================
export const SIMULATION_STEPS: SimulationStepData[] = [
  {
    order: 1,
    blockId: 'identidad',
    title: '1. Ingreso seguro',
    description: 'El ciudadano inicia sesión una sola vez en el Portal para realizar trámites y servicios Distritales.',
    entity: 'Portal Bogotá / Acceso Seguro'
  },
  {
    order: 2,
    blockId: 'dwh',
    title: '2. Consulta de Huella Ciudadana',
    description: 'El sistema consulta el historial de interacciones del ciudadano.',
    entity: 'Analítica / Huella Ciudadana'
  },
  {
    order: 3,
    blockId: 'registro',
    title: '3. Radicación de solicitud',
    description: 'Se radica el trámite y se genera un número de radicado.',
    entity: 'Ventanilla Única Distrital'
  },
  {
    order: 4,
    blockId: 'workflow',
    title: '4. Orquestación del proceso',
    description: 'El motor de procesos coordina las revisiones y validaciones internas entre las entidades/áreas competentes.',
    entity: 'Motor de Procesos Distrital'
  },
  {
    order: 5,
    blockId: 'eventstore',
    title: '5. Trazabilidad inmutable',
    description: 'Se registran en orden cronológico exacto los eventos del trámite en la "caja negra" del Portal.',
    entity: 'Caja Negra del Portal Bogotá'
  },
  {
    order: 6,
    blockId: 'registros_digitales',
    relatedBlockIds: ['interoperabilidad'],
    title: '6. Actualización distrital',
    description: 'Se actualizan/consultan los datos maestros, por ejemplo del Registro Social de Bogotá mediante interoperabilidad entre entidades.',
    entity: 'Registro Social y Malla de Interoperabilidad'
  },
  {
    order: 7,
    blockId: 'mensajeria',
    title: '7. Notificación de pago habilitado',
    description: 'El ciudadano recibe un mensaje de texto/correo indicando que la solicitud fue aprobada y está lista para pagar en línea.',
    entity: 'Canal Multicanal Distrital'
  },
  {
    order: 8,
    blockId: 'consentimiento',
    title: '8. Autorización de datos',
    description: 'El ciudadano ingresa información complementaria y autoriza el uso transparente de sus datos personales.',
    entity: 'Soberanía y Gestión de Datos'
  },
  {
    order: 9,
    blockId: 'pagos',
    title: '9. Pago virtual y recaudo por SDH',
    description: 'Se procesa y confirma la transacción electrónica para saldar las obligaciones del trámite.',
    entity: 'Pasarela de Pagos Distrital / SDH'
  },
  {
    order: 10,
    blockId: 'satisfaccion',
    title: '10. Recibo y calificación',
    description: 'El ciudadano descarga su comprobante y califica su experiencia con el servicio en una breve encuesta.',
    entity: 'Medición de Percepción Ciudadana'
  }
];
