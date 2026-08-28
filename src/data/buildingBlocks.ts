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
    example: 'Enviar un mensaje de texto a una persona de la ciudadanía confirmando que su cupo escolar ha sido asignado.',
    shape: {
      pathD: 'M 260,20 L 320,20 L 290,210 L 180,210 Z',
      centerX: 255,
      centerY: 115,
      shapeClass: 'clip-trapezoid-left-roof',
      clipPathCss: 'polygon(40% 0%, 100% 0%, 80% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 8,
      stepTitle: 'Paso 8: Notificación Inmediata',
      actionDescription: 'Se notifica formalmente el resultado del trámite a la ciudadanía.'
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
      pathD: 'M 320,20 L 400,20 L 450,210 L 290,210 Z',
      centerX: 365,
      centerY: 115,
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
    example: 'Programar la tarea de notificar a las personas de la ciudadanía que declararon renta en la vigencia anterior.',
    shape: {
      pathD: 'M 400,20 L 460,20 L 580,210 L 450,210 Z',
      centerX: 475,
      centerY: 115,
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
      pathD: 'M 180,210 L 380,210 L 380,430 L 90,430 Z',
      centerX: 255,
      centerY: 320,
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
    description: 'Permite medir la percepción de la ciudadanía tras realizar un trámite o acceder a un servicio digital.',
    example: 'Al terminar la generación del Certificado de Industria y Comercio, aparece una breve encuesta de 3 preguntas para calificar la experiencia.',
    shape: {
      pathD: 'M 380,210 L 580,210 L 710,430 L 380,430 Z',
      centerX: 515,
      centerY: 320,
      shapeClass: 'clip-slope-right',
      clipPathCss: 'polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)',
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
    example: 'Cuando una persona de la ciudadanía solicita un subsidio de vivienda o un acuerdo de pago con la Alcaldía, puede firmar la solicitud directamente desde su celular usando una clave segura o su correo, sin tener que imprimir el formulario, ni desplazarse a una oficina.',
    shape: {
      pathD: 'M 90,430 L 280,430 L 280,625 L 90,625 Z',
      centerX: 185,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 6,
      stepTitle: 'Paso 6: Suscripción Jurídica Digital',
      actionDescription: 'La ciudadanía suscribe el trámite digitalmente con plena validez legal.'
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
    example: 'Enviar automáticamente una solicitud de licencia de construcción para que la revise primero un área técnica, luego la jurídica y finalmente se emita la respuesta a la ciudadanía.',
    shape: {
      pathD: 'M 280,430 L 520,430 L 520,625 L 280,625 Z',
      centerX: 400,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 3,
      stepTitle: 'Paso 3: Enrutamiento Automático',
      actionDescription: 'El motor de workflow orquesta las revisiones y aprobaciones distritales.'
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
    description: 'La ciudadanía autoriza, administra y controla de manera transparente cómo las entidades del Distrito pueden utilizar y compartir sus datos personales para fines misionales.',
    example: 'Al inscribirse en un programa de la Secretaría de Integración Social, la persona de la ciudadanía autoriza consultar sus datos también por la Secretaría de Educación o Secretaría de Salud para ser focalizada en otros beneficios o servicios distritales.',
    shape: {
      pathD: 'M 520,430 L 710,430 L 710,625 L 520,625 Z',
      centerX: 615,
      centerY: 528,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
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
    example: 'Al radicar una solicitud, el sistema recibe los documentos, valida datos y entrega de inmediato un número de radicado para seguimiento en tiempo real de la ciudadanía.',
    shape: {
      pathD: 'M 90,625 L 280,625 L 280,820 L 90,820 Z',
      centerX: 185,
      centerY: 722,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 2,
      stepTitle: 'Paso 2: Radicación y Asignación de Caso',
      actionDescription: 'Se genera número oficial de radicado para seguimiento continuo de la ciudadanía.'
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
    description: 'Permite a la ciudadanía acceder a los servicios digitales de Bogotá, usando credenciales verificables emitidas por el Portal Bogotá y entidades distritales, así mismo mediante el uso de autenticación federada. Se utilizan estándares como Keycloak, OIDC y OAuth2.',
    example: 'Iniciar sesión una sola vez en el Portal y para consultar desde citas médicas en la Secretaría de Salud hasta obligaciones tributarias con la Secretaría de Hacienda.',
    shape: {
      pathD: 'M 280,625 L 520,625 L 520,820 L 280,820 Z',
      centerX: 400,
      centerY: 722,
      shapeClass: 'clip-rect-door',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 1,
      stepTitle: 'Paso 1: Autenticación de la Ciudadanía',
      actionDescription: 'La ciudadanía inicia sesión con autenticación federada y credenciales seguras.'
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
    description: 'Permite que cualquier Entidad Distrital lo use para habilitar pagos virtuales en sus plataformas de manera segura, validando las obligaciones pendientes de la ciudadanía, el pago y verificación de la transacción.',
    example: 'Pagar los impuestos distritales o el permiso para usar el estadio Nemesio Camacho El Campín.',
    shape: {
      pathD: 'M 520,625 L 710,625 L 710,820 L 520,820 Z',
      centerX: 615,
      centerY: 722,
      shapeClass: 'clip-rect-room',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 5,
      stepTitle: 'Paso 5: Pago Virtual Seguro',
      actionDescription: 'La ciudadanía liquida y cancela obligaciones con verificación instantánea.'
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
    example: 'Habilitación de tableros analíticos para cruzar datos de sectores Educación, Social y Movilidad, permitiendo identificar con precisión qué zonas de la ciudad necesitan con urgencia nuevos colegios o centros médicos para la ciudadanía.',
    shape: {
      pathD: 'M 90,820 L 245,820 L 245,975 L 115,975 Q 90,975 90,950 Z',
      centerX: 167,
      centerY: 898,
      shapeClass: 'clip-foundation-left',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
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
    description: 'Es la “caja negra” del Portal Bogotá. Registra de forma segura e inmutable cada evento o transacción que genera la ciudadanía.',
    example: 'Cuando una persona de la ciudadanía solicita un subsidio, el sistema guarda en orden cronológico exacto cada etapa del trámite para que nunca se pierda la trazabilidad.',
    shape: {
      pathD: 'M 245,820 L 400,820 L 400,975 L 245,975 Z',
      centerX: 322,
      centerY: 898,
      shapeClass: 'clip-foundation-mid-left',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 7,
      stepTitle: 'Paso 7: Registro en Bitácora Inmutable',
      actionDescription: 'La transacción queda sellada de forma inmutable para la ciudadanía.'
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
    example: 'Si la ciudadanía actualiza su dirección en la Secretaría de Planeación, el cambio se refleja en la base maestra para que la Secretaría de Salud y la Secretaría de Hacienda consulten el dato actualizado sin pedirlo de nuevo.',
    shape: {
      pathD: 'M 400,820 L 555,820 L 555,975 L 400,975 Z',
      centerX: 478,
      centerY: 898,
      shapeClass: 'clip-foundation-mid-right',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
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
      pathD: 'M 555,820 L 710,820 L 710,950 Q 710,975 685,975 L 555,975 Z',
      centerX: 633,
      centerY: 898,
      shapeClass: 'clip-foundation-right',
      clipPathCss: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    simulationStep: {
      order: 4,
      stepTitle: 'Paso 4: Intercambio Seguro de Información',
      actionDescription: 'Las entidades distritales consultan y validan datos internamente de forma segura.'
    }
  },
];

export const SIMULATION_STEPS: SimulationStepData[] = [
  {
    order: 1,
    blockId: 'identidad',
    title: '1. Identidad y acceso',
    description: 'La ciudadanía accede al Portal Bogotá mediante autenticación federada y credenciales verificables con Keycloak/OAuth2.',
    entity: 'Portal Bogotá / Autenticación Distrital',
    citizenBenefit: 'Acceso unificado y seguro a todos los trámites distritales con una sola cuenta.'
  },
  {
    order: 2,
    blockId: 'registro',
    title: '2. Registro',
    description: 'El sistema radica la solicitud, valida los documentos y asigna un número de radicado oficial para seguimiento.',
    entity: 'Ventanilla Única Distrital',
    citizenBenefit: 'Número de radicado inmediato para seguimiento en tiempo real de la ciudadanía.'
  },
  {
    order: 3,
    blockId: 'workflow',
    title: '3. Flujo de trabajo (Workflow)',
    description: 'El motor orquesta y distribuye la solicitud entre las áreas técnicas y jurídicas competentes del Distrito.',
    entity: 'Secretaría Distrital de Planeación',
    citizenBenefit: 'Agilidad en la respuesta gracias a la orquestación y aprobaciones sin demoras.'
  },
  {
    order: 4,
    blockId: 'interoperabilidad',
    title: '4. Interoperabilidad',
    description: 'Las entidades distritales comparten y validan la información de la solicitud de forma segura sin pedir papeles.',
    entity: 'Malla de Interoperabilidad Distrital',
    citizenBenefit: 'Cero trámites duplicados: las entidades validan datos internamente sin pedir fotocopias a la ciudadanía.'
  },
  {
    order: 5,
    blockId: 'pagos',
    title: '5. Pagos',
    description: 'La pasarela virtual liquida y procesa el pago seguro de las obligaciones pendientes de la ciudadanía.',
    entity: 'Secretaría Distrital de Hacienda',
    citizenBenefit: 'Pagos virtuales 100% seguros con confirmación instantánea de la transacción.'
  },
  {
    order: 6,
    blockId: 'firma',
    title: '6. Firma electrónica',
    description: 'La ciudadanía suscribe digitalmente los documentos oficiales con verificación de integridad y plena validez legal.',
    entity: 'Infraestructura de Firma Digital Distrital',
    citizenBenefit: 'Firma válida desde el teléfono móvil sin desplazamientos a oficinas físicas.'
  },
  {
    order: 7,
    blockId: 'eventstore',
    title: '7. EventStore',
    description: 'La "caja negra" registra de manera segura e inmutable cada evento y solicitud que genera la ciudadanía.',
    entity: 'EventStore Distrital de Auditoría',
    citizenBenefit: 'Trazabilidad total e inalterable para garantizar transparencia a la ciudadanía.'
  },
  {
    order: 8,
    blockId: 'mensajeria',
    title: '8. Mensajería',
    description: 'Canal automatizado que envía de inmediato la notificación del trámite resuelto por SMS y correo electrónico a la ciudadanía.',
    entity: 'Central de Notificaciones Distritales',
    citizenBenefit: 'Notificación oficial directa al celular o correo de la ciudadanía al instante.'
  }
];
