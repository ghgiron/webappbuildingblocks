import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Fingerprint,
  ShieldCheck,
  FileSignature,
  Network,
  Layers,
  FileText,
  GitBranch,
  CreditCard,
  BellRing,
  Activity,
  Clock,
  MapPin,
  HeartHandshake,
  Database,
  BarChart3,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Trophy,
  Check
} from 'lucide-react';
import { BUILDING_BLOCKS, SIMULATION_STEPS } from './data/buildingBlocks';
import { DragState } from './types';
import { soundFx } from './utils/audio';

// Helper icon component for building blocks
const BlockIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Fingerprint': return <Fingerprint className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'FileSignature': return <FileSignature className={className} />;
    case 'Network': return <Network className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'GitBranch': return <GitBranch className={className} />;
    case 'CreditCard': return <CreditCard className={className} />;
    case 'BellRing': return <BellRing className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'Database': return <Database className={className} />;
    case 'BarChart3': return <BarChart3 className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function App() {
  // Game State
  const [placedBlockIds, setPlacedBlockIds] = useState<string[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string>('eventstore');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [currentSimStep, setCurrentSimStep] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Kiosk scale container
  const [scale, setScale] = useState<number>(1);
  const kioskRef = useRef<HTMLDivElement>(null);
  const svgHouseRef = useRef<SVGSVGElement>(null);

  // Drag and Drop pointer state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    blockId: null,
    pointerX: 0,
    pointerY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // Calculate Responsive Scale for 1080x1920
  const updateScale = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const targetWidth = 1080;
    const targetHeight = 1920;

    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Derived state
  const progressCount = placedBlockIds.length;
  const score = progressCount * 100;
  const isCompleted = progressCount === BUILDING_BLOCKS.length;

  const activeBlock = useMemo(() => {
    return BUILDING_BLOCKS.find(b => b.id === activeBlockId) || BUILDING_BLOCKS[0];
  }, [activeBlockId]);

  // Handle victory fanfare & confetti
  useEffect(() => {
    if (isCompleted && !isSimulationMode) {
      soundFx.playFanfare();
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.65 },
          colors: ['#D31424', '#FFD100', '#FFFFFF', '#B3001B']
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.65 },
          colors: ['#D31424', '#FFD100', '#FFFFFF', '#0EA5E9']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isCompleted, isSimulationMode]);

  // Simulation step timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulationMode && isSimPlaying) {
      timer = setInterval(() => {
        setCurrentSimStep(prev => {
          if (prev >= SIMULATION_STEPS.length - 1) {
            setIsSimPlaying(false);
            return prev;
          }
          const next = prev + 1;
          soundFx.playSimStep();
          setActiveBlockId(SIMULATION_STEPS[next].blockId);
          return next;
        });
      }, 3600);
    }
    return () => clearInterval(timer);
  }, [isSimulationMode, isSimPlaying]);

  // Sound toggle
  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Reset Game
  const handleReset = () => {
    soundFx.playTap();
    setPlacedBlockIds([]);
    setActiveBlockId('identidad');
    setIsSimulationMode(false);
    setIsSimPlaying(false);
    setCurrentSimStep(0);
  };

  // Auto-complete (Demo feature for quick exhibit presentations)
  const handleAutoComplete = () => {
    soundFx.playSnap();
    setPlacedBlockIds(BUILDING_BLOCKS.map(b => b.id));
    setActiveBlockId('identidad');
  };

  // Place a block
  const handlePlaceBlock = useCallback((blockId: string) => {
    if (placedBlockIds.includes(blockId)) return;

    soundFx.playSnap();
    setPlacedBlockIds(prev => [...prev, blockId]);
    setActiveBlockId(blockId);

    // Micro confetti puff on snap
    confetti({
      particleCount: 18,
      spread: 55,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#FFD100', '#D31424', '#FFFFFF']
    });

    // Auto select next unplaced block for a fluid kiosk experience
    const remaining = BUILDING_BLOCKS.filter(b => b.id !== blockId && !placedBlockIds.includes(b.id));
    if (remaining.length > 0) {
      setTimeout(() => {
        setActiveBlockId(remaining[0].id);
      }, 850);
    }
  }, [placedBlockIds]);

  // Pointer coordinate converter to 1080x1920 space
  const getKioskCoords = useCallback((clientX: number, clientY: number) => {
    if (!kioskRef.current) return { x: clientX, y: clientY };
    const rect = kioskRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;
    return { x, y };
  }, [scale]);

  // Pointer Down on Dock Piece (Start Drag / Tap)
  const handlePointerDownPiece = (e: React.PointerEvent, blockId: string) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    soundFx.playSelect();
    setActiveBlockId(blockId);

    const coords = getKioskCoords(e.clientX, e.clientY);
    setDragState({
      isDragging: true,
      blockId,
      pointerX: coords.x,
      pointerY: coords.y,
      offsetX: 0,
      offsetY: 0,
    });
  };

  // Pointer Move (Dragging)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.isDragging || !dragState.blockId) return;

    const coords = getKioskCoords(e.clientX, e.clientY);
    setDragState(prev => ({
      ...prev,
      pointerX: coords.x,
      pointerY: coords.y,
    }));
  };

  // Pointer Up (Drop / End Tap)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.isDragging || !dragState.blockId) return;

    const blockId = dragState.blockId;
    const block = BUILDING_BLOCKS.find(b => b.id === blockId);

    if (block && svgHouseRef.current) {
      const svgRect = svgHouseRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - svgRect.left) / (svgRect.width / 800);
      const relativeY = (e.clientY - svgRect.top) / (svgRect.height / 1000);

      // Distance threshold in SVG coordinate space
      const distance = Math.hypot(relativeX - block.shape.centerX, relativeY - block.shape.centerY);

      if (distance < 190) {
        handlePlaceBlock(blockId);
      }
    }

    setDragState({
      isDragging: false,
      blockId: null,
      pointerX: 0,
      pointerY: 0,
      offsetX: 0,
      offsetY: 0,
    });
  };

  // Start Transaction Simulation
  const startSimulation = () => {
    soundFx.playFanfare();
    setIsSimulationMode(true);
    setCurrentSimStep(0);
    setIsSimPlaying(true);
    setActiveBlockId(SIMULATION_STEPS[0].blockId);
  };

  // Filtered blocks for dock
  const filteredBlocks = useMemo(() => {
    if (categoryFilter === 'all') return BUILDING_BLOCKS;
    if (categoryFilter === 'unplaced') return BUILDING_BLOCKS.filter(b => !placedBlockIds.includes(b.id));
    return BUILDING_BLOCKS.filter(b => b.category === categoryFilter);
  }, [categoryFilter, placedBlockIds]);

  // Current simulation step data
  const currentSimData = SIMULATION_STEPS[currentSimStep] || SIMULATION_STEPS[0];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#070B14] overflow-hidden select-none touch-none">
      {/* 1080x1920 Kiosk Canvas with Dynamic Viewport Scaling */}
      <div
        ref={kioskRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: '1080px',
          height: '1920px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
        className="relative bg-gradient-to-b from-[#FFFDFD] via-[#F8FAFC] to-[#F1F5F9] text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between"
      >
        {/* ========================================================================= */}
        {/* NIVEL 1: HEADER INSTITUCIONAL Y TARJETA PEDAGÓGICA (Top: 0 a 480px)       */}
        {/* ========================================================================= */}
        <header className="w-full px-8 pt-6 pb-4 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm z-20 flex flex-col gap-3">
          {/* Top Bar: Official Logos & Quick Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Official Alcaldía Mayor de Bogotá Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo-bogota.png"
                alt="Alcaldía Mayor de Bogotá"
                className="h-14 w-auto object-contain drop-shadow-xs"
              />
              <div className="h-10 w-px bg-slate-200 mx-1"></div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-bogota-red uppercase tracking-wider leading-none">
                  Portal Transaccional
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                  Alcaldía Mayor de Bogotá
                </span>
              </div>
            </div>

            {/* Official Campaign Slogan Logo + Quick Controls */}
            <div className="flex items-center gap-4">
              <img
                src="/assets/logo-campana.png"
                alt="Aquí Sí Pasa - Bogotá Mi Ciudad, Mi Casa"
                className="h-14 w-auto object-contain drop-shadow-xs"
              />

              {/* Mute Button */}
              <button
                onClick={handleToggleSound}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-xs"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-6 h-6 text-red-500" /> : <Volume2 className="w-6 h-6 text-slate-700" />}
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-red-50 active:scale-95 text-slate-700 hover:text-bogota-red border border-slate-200 hover:border-red-300 font-bold text-sm transition-all shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          {/* Slogan Banner */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Entre todos construimos la Bogotá
              </h2>
              <p className="text-sm font-medium text-slate-600">
                Soluciones compartidas (Building Blocks) que transforman los servicios para <span className="font-black text-bogota-red">la ciudadanía</span>
              </p>
            </div>
            {/* Quick Demo Mode Complete trigger */}
            {progressCount < 15 && (
              <button
                onClick={handleAutoComplete}
                className="text-xs font-bold text-slate-400 hover:text-bogota-red transition-colors underline"
              >
                Modo Demostración (15/15)
              </button>
            )}
          </div>

          {/* Dynamic Pedagogical Card (Active Block Concept - Literal & Strict) */}
          <div className="w-full bg-gradient-to-br from-white to-red-50/50 border-2 border-bogota-red rounded-3xl p-5 shadow-kiosk-card relative overflow-hidden transition-all duration-300">
            {/* Background watermark badge */}
            <div className="absolute -right-6 -bottom-6 text-red-100/50 pointer-events-none select-none">
              <BlockIcon name={activeBlock.iconName} className="w-44 h-44" />
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              {/* Header row: Icon, Category & Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: activeBlock.color }}
                  >
                    <BlockIcon name={activeBlock.iconName} className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 inline-block mb-1">
                      {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                      {activeBlock.name}
                    </h3>
                  </div>
                </div>

                {/* Status indicator badge */}
                {placedBlockIds.includes(activeBlock.id) ? (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ensamblado en la Casa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs shadow-xs animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Toca o arrastra hacia la casa</span>
                  </div>
                )}
              </div>

              {/* Description & Citizen Real World Example */}
              <div className="grid grid-cols-12 gap-4 pt-0.5 text-slate-700">
                <div className="col-span-7 bg-white/95 p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                  <p className="text-[11px] font-black text-bogota-red uppercase tracking-wider mb-0.5">
                    ¿Qué es?
                  </p>
                  <p className="text-sm leading-snug font-medium text-slate-800">
                    {activeBlock.description}
                  </p>
                </div>
                <div className="col-span-5 bg-amber-50/90 p-3.5 rounded-2xl border border-amber-100 shadow-xs">
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider mb-0.5">
                    Ejemplo tangible en la vida real:
                  </p>
                  <p className="text-xs leading-snug font-semibold text-slate-800">
                    {activeBlock.example}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification & Guidance Sub-bar */}
          <div className="flex items-center justify-between px-2 pt-0.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-bogota-yellow text-slate-900 flex items-center justify-center font-black text-sm shadow-xs">
                ★
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {isSimulationMode
                  ? 'Simulación activa: observa en tiempo real cómo viaja la solicitud de la ciudadanía a través de cada bloque.'
                  : isCompleted
                  ? '¡Excelente trabajo! Has completado la Casa de Bogotá. Inicia la simulación interactiva.'
                  : 'Toca un bloque en el inventario o arrástralo hacia la ranura iluminada en la casa.'}
              </p>
            </div>

            {/* Score & Progress */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 font-bold text-sm">
                <span className="text-slate-500">Progreso:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-bogota-red text-white text-sm font-black">
                  {progressCount} / 15
                </span>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl border border-amber-200 font-black text-sm shadow-xs">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>{score} pts</span>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* NIVEL 2: ESCENARIO CENTRAL - LA CASA TANGRAM (Centro: 480px a 1400px)     */}
        {/* ========================================================================= */}
        <main className="relative flex-1 w-full flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Subtle architectural grid pattern background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Bogotá Sky Stars (Top Right of the house) */}
          <div className="absolute top-4 right-14 flex items-center gap-3 pointer-events-none z-10">
            <div className="text-bogota-yellow drop-shadow-[0_0_12px_rgba(253,195,0,0.8)] text-5xl font-black animate-bounce-subtle">
              ★
            </div>
            <div className="text-bogota-yellow drop-shadow-[0_0_16px_rgba(253,195,0,0.9)] text-6xl font-black animate-float">
              ★
            </div>
            <div className="text-bogota-yellow drop-shadow-[0_0_12px_rgba(253,195,0,0.8)] text-4xl font-black animate-bounce-subtle">
              ★
            </div>
          </div>

          {/* Interactive Tangram House Container */}
          <div className="relative w-full max-w-[840px] h-[870px] flex items-center justify-center">
            {/* Main SVG House with Tangram Polygonal Slots */}
            <svg
              ref={svgHouseRef}
              viewBox="0 0 800 1000"
              className="w-full h-full drop-shadow-2xl overflow-visible"
            >
              <defs>
                {/* LEGO Stud Pattern for Empty Unplaced Slots */}
                <pattern
                  id="legoStudsDark"
                  width="36"
                  height="36"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="36" height="36" fill="#8A0A15" />
                  <circle cx="18" cy="18" r="9.5" fill="#99001B" />
                  <circle cx="18" cy="18" r="8" fill="#6B000F" />
                  <circle cx="16" cy="16" r="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  <text x="18" y="20.5" fontSize="4.5" fontWeight="900" fill="rgba(255,255,255,0.22)" textAnchor="middle">
                    BOGOTÁ
                  </text>
                </pattern>

                {/* LEGO Stud Pattern for House Border / Outer Red Wall */}
                <pattern
                  id="legoStudsRed"
                  width="36"
                  height="36"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="36" height="36" fill="#D31424" />
                  <circle cx="18" cy="18" r="9.5" fill="#E61E30" />
                  <circle cx="18" cy="18" r="8" fill="#B3001B" />
                  <circle cx="16" cy="16" r="5.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                </pattern>

                {/* Laser Glow Filter for Simulation */}
                <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Red Silhouette of the House of Bogotá */}
              <path
                d="M 340,15 L 430,15 L 750,530 L 760,540 L 780,555 L 740,555 L 740,960 Q 740,985 715,985 L 85,985 Q 60,985 60,960 L 60,430 L 40,430 L 230,20 Z"
                fill="url(#legoStudsRed)"
                stroke="#B3001B"
                strokeWidth="12"
                strokeLinejoin="round"
                className="drop-shadow-lg"
              />

              {/* 15 Balanced Polygonal Tangram Slots */}
              {BUILDING_BLOCKS.map(block => {
                const isPlaced = placedBlockIds.includes(block.id);
                const isActiveGuide = activeBlockId === block.id;
                const isSimActive = isSimulationMode && SIMULATION_STEPS[currentSimStep]?.blockId === block.id;

                return (
                  <g
                    key={block.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => {
                      if (!isPlaced) {
                        handlePlaceBlock(block.id);
                      } else {
                        soundFx.playTap();
                        setActiveBlockId(block.id);
                      }
                    }}
                  >
                    {/* The Polygon Slot */}
                    <path
                      d={block.shape.pathD}
                      fill={isPlaced ? block.color : 'url(#legoStudsDark)'}
                      stroke={
                        isSimActive
                          ? '#FFD100'
                          : isActiveGuide
                          ? '#FFD100'
                          : isPlaced
                          ? '#FFFFFF'
                          : '#450A0A'
                      }
                      strokeWidth={isSimActive ? 8 : isActiveGuide ? 7 : isPlaced ? 3 : 2}
                      strokeLinejoin="round"
                      className={`transition-all duration-300 ${
                        isActiveGuide && !isPlaced ? 'animate-slot-guide' : ''
                      } ${isSimActive ? 'drop-shadow-[0_0_25px_rgba(255,209,0,0.9)]' : ''}`}
                    />

                    {/* Studs texture highlight & bevel if placed */}
                    {isPlaced && (
                      <g pointerEvents="none">
                        {/* Tactile block header in house */}
                        <circle
                          cx={block.shape.centerX}
                          cy={block.shape.centerY - 22}
                          r="18"
                          fill="rgba(255,255,255,0.22)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1.5"
                        />
                        <text
                          x={block.shape.centerX}
                          y={block.shape.centerY - 16}
                          fontSize="13"
                          fontWeight="900"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          #{block.number}
                        </text>

                        {/* Title text */}
                        <text
                          x={block.shape.centerX}
                          y={block.shape.centerY + 10}
                          fontSize="14"
                          fontWeight="800"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="tracking-tight"
                          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.45))"
                        >
                          {block.shortName}
                        </text>
                      </g>
                    )}

                    {/* Unplaced Slot Indicator: Pulsing Target Hint */}
                    {!isPlaced && (
                      <g pointerEvents="none">
                        <circle
                          cx={block.shape.centerX}
                          cy={block.shape.centerY}
                          r={isActiveGuide ? 24 : 16}
                          fill={isActiveGuide ? 'rgba(255, 209, 0, 0.9)' : 'rgba(0,0,0,0.35)'}
                          className={isActiveGuide ? 'animate-ping' : ''}
                        />
                        <circle
                          cx={block.shape.centerX}
                          cy={block.shape.centerY}
                          r={isActiveGuide ? 20 : 16}
                          fill={isActiveGuide ? '#FFD100' : 'rgba(0,0,0,0.5)'}
                          stroke="#FFFFFF"
                          strokeWidth={isActiveGuide ? 3 : 1}
                        />
                        <text
                          x={block.shape.centerX}
                          y={block.shape.centerY + 1}
                          fontSize={isActiveGuide ? '16' : '13'}
                          fontWeight="900"
                          fill={isActiveGuide ? '#1F2937' : '#FFFFFF'}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {block.number}
                        </text>

                        {/* Label beneath hint for guide */}
                        {isActiveGuide && (
                          <rect
                            x={block.shape.centerX - 65}
                            y={block.shape.centerY + 28}
                            width="130"
                            height="24"
                            rx="12"
                            fill="#FFD100"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        )}
                        {isActiveGuide && (
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 41}
                            fontSize="11"
                            fontWeight="900"
                            fill="#1F2937"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            ENCAJA AQUÍ
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Simulation Laser Connectors / Neon Path */}
              {isSimulationMode && (
                <g pointerEvents="none">
                  {SIMULATION_STEPS.slice(0, currentSimStep).map((step, idx) => {
                    const nextStep = SIMULATION_STEPS[idx + 1];
                    if (!nextStep) return null;
                    const fromBlock = BUILDING_BLOCKS.find(b => b.id === step.blockId);
                    const toBlock = BUILDING_BLOCKS.find(b => b.id === nextStep.blockId);
                    if (!fromBlock || !toBlock) return null;

                    return (
                      <line
                        key={`sim-line-${idx}`}
                        x1={fromBlock.shape.centerX}
                        y1={fromBlock.shape.centerY}
                        x2={toBlock.shape.centerX}
                        y2={toBlock.shape.centerY}
                        stroke="#FFD100"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="animate-laser-flow"
                        filter="url(#laserGlow)"
                      />
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Completed House Celebration Banner Overlay */}
            {isCompleted && !isSimulationMode && (
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl border-4 border-bogota-yellow p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-4 z-30 animate-bounce-subtle">
                <div className="w-20 h-20 rounded-full bg-bogota-red text-bogota-yellow flex items-center justify-center text-4xl font-black shadow-lg">
                  ★
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-bogota-red bg-red-50 px-3 py-1 rounded-md">
                    ¡CASA DE BOGOTÁ ENSAMBLADA!
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">
                    ¡Felicitaciones a la Ciudadanía!
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 max-w-md mt-1">
                    Has completado las 15 soluciones compartidas (Building Blocks) que hacen posible un Distrito ágil y digital.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={startSimulation}
                    className="flex items-center gap-3 px-8 py-4 bg-bogota-red hover:bg-red-700 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-xl transition-all"
                  >
                    <Play className="w-6 h-6 fill-white" />
                    <span>Iniciar Simulación de Trámite</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm rounded-2xl transition-all"
                  >
                    Volver a Jugar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Step HUD Bar (when in simulation mode) */}
          {isSimulationMode && (
            <div className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border-2 border-bogota-yellow text-white rounded-3xl p-5 shadow-2xl flex items-center justify-between z-20 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-bogota-yellow text-slate-900 font-black flex items-center justify-center text-xl shadow-md">
                  {currentSimStep + 1}
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    {currentSimData.entity}
                  </span>
                  <h4 className="text-lg font-black tracking-tight">
                    {currentSimData.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-300 max-w-xl">
                    {currentSimData.description}
                  </p>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCurrentSimStep(prev => Math.max(0, prev - 1));
                    setActiveBlockId(SIMULATION_STEPS[Math.max(0, currentSimStep - 1)].blockId);
                  }}
                  disabled={currentSimStep === 0}
                  className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    soundFx.playTap();
                    setIsSimPlaying(!isSimPlaying);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-bogota-yellow hover:bg-amber-400 text-slate-900 font-black flex items-center gap-2 shadow-md active:scale-95"
                >
                  {isSimPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-slate-900" />}
                  <span>{isSimPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playTap();
                    if (currentSimStep < SIMULATION_STEPS.length - 1) {
                      setCurrentSimStep(prev => prev + 1);
                      setActiveBlockId(SIMULATION_STEPS[currentSimStep + 1].blockId);
                    }
                  }}
                  disabled={currentSimStep === SIMULATION_STEPS.length - 1}
                  className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsSimulationMode(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* NIVEL 3: DOCK TÁCTIL DE INVENTARIO (Bottom: 1400px a 1920px)              */}
        {/* ========================================================================= */}
        <footer className="w-full bg-[#F3F4F6] border-t-2 border-slate-200 rounded-t-[40px] px-8 pt-6 pb-8 shadow-2xl z-20 flex flex-col gap-4">
          {/* Dock Header & Filter Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-bogota-red text-white flex items-center justify-center font-black shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Inventario de Soluciones Compartidas
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Selecciona o arrastra una ficha para armar la casa de Bogotá
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos (15)
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('unplaced');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  categoryFilter === 'unplaced'
                    ? 'bg-bogota-red text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pendientes ({15 - progressCount})
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('transaccional');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  categoryFilter === 'transaccional'
                    ? 'bg-bogota-red text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Transaccional
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('seguridad');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  categoryFilter === 'seguridad'
                    ? 'bg-bogota-red text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Seguridad
              </button>
            </div>
          </div>

          {/* Touch Pieces Grid (15 Tactile Building Block Cards with literal names and >=64px touch target) */}
          <div className="grid grid-cols-5 gap-3.5 max-h-[360px] overflow-y-auto no-scrollbar py-1">
            {filteredBlocks.map(block => {
              const isPlaced = placedBlockIds.includes(block.id);
              const isSelected = activeBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onPointerDown={e => handlePointerDownPiece(e, block.id)}
                  className={`relative min-h-[110px] rounded-2xl p-3 flex flex-col justify-between border-2 transition-all cursor-grab active:cursor-grabbing touch-active-card ${
                    isSelected
                      ? 'bg-amber-50/95 border-bogota-yellow shadow-kiosk-glow scale-[1.02] ring-2 ring-bogota-yellow'
                      : isPlaced
                      ? 'bg-white/80 border-emerald-300 opacity-90'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Card Header: Category & Number */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md text-white shadow-xs"
                      style={{ backgroundColor: block.color }}
                    >
                      #{block.number}
                    </span>

                    {/* Placed Status Icon */}
                    {isPlaced ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    )}
                  </div>

                  {/* Icon & Exact Literal Title */}
                  <div className="flex items-center gap-2 my-auto">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: block.color }}
                    >
                      <BlockIcon name={block.iconName} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800 leading-tight line-clamp-2">
                      {block.name}
                    </span>
                  </div>

                  {/* Footer status hint */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>{block.categoryLabel}</span>
                    <span className="text-bogota-red font-black">
                      {isPlaced ? 'Listo' : 'Encajar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* FLOATING DRAGGED PIECE AVATAR (Follows touch cursor with 0 latency)       */}
        {/* ========================================================================= */}
        {dragState.isDragging && dragState.blockId && (
          <div
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${dragState.pointerX}px`,
              top: `${dragState.pointerY}px`,
            }}
          >
            {(() => {
              const block = BUILDING_BLOCKS.find(b => b.id === dragState.blockId);
              if (!block) return null;
              return (
                <div
                  className="w-52 h-24 rounded-3xl p-3 bg-white/95 border-3 border-bogota-yellow shadow-2xl flex flex-col justify-between scale-110 rotate-2 backdrop-blur-md"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 25px rgba(255, 209, 0, 0.8)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-black uppercase px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: block.color }}
                    >
                      #{block.number}
                    </span>
                    <span className="text-[10px] font-black text-bogota-red uppercase animate-pulse">
                      ¡Arrastra a la casa!
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: block.color }}
                    >
                      <BlockIcon name={block.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {block.name}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
