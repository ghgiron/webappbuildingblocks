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
  Check,
  Info,
  X,
  ChevronRight,
  Hammer
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
  const [activeBlockId, setActiveBlockId] = useState<string>('identidad');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [currentSimStep, setCurrentSimStep] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showConceptModal, setShowConceptModal] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

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

  // Check Landscape (Horizontal desktop/TV >= 1024px width and width > height)
  useEffect(() => {
    const handleResize = () => {
      const isLand = window.innerWidth >= 1024 && window.innerWidth > window.innerHeight;
      setIsLandscape(isLand);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Derived state
  const progressCount = placedBlockIds.length;
  const score = progressCount * 100;
  const isCompleted = progressCount === BUILDING_BLOCKS.length;

  const activeBlock = useMemo(() => {
    return BUILDING_BLOCKS.find(b => b.id === activeBlockId) || BUILDING_BLOCKS[0];
  }, [activeBlockId]);

  // Victory fanfare & confetti
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
          colors: ['#CC0E35', '#FAB62D', '#FFFFFF', '#99001B']
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.65 },
          colors: ['#CC0E35', '#FAB62D', '#FFFFFF', '#3366CC']
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
    setShowConceptModal(false);
  };

  // Auto-complete (Demo presentation feature)
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
      particleCount: 16,
      spread: 55,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#FAB62D', '#CC0E35', '#FFFFFF']
    });

    // Auto select next unplaced block
    const remaining = BUILDING_BLOCKS.filter(b => b.id !== blockId && !placedBlockIds.includes(b.id));
    if (remaining.length > 0) {
      setTimeout(() => {
        setActiveBlockId(remaining[0].id);
      }, 700);
    }
  }, [placedBlockIds]);

  // Handle Tap on Dock Piece (Selection without locking modal)
  const handleSelectPiece = (blockId: string) => {
    soundFx.playSelect();
    setActiveBlockId(blockId);
  };

  // Handle Click / Tap on House Slot (Inspect if placed, Place if unplaced)
  const handleSlotClick = (blockId: string) => {
    const isPlaced = placedBlockIds.includes(blockId);
    if (isPlaced) {
      // Open pedagogical concept post-assembly!
      soundFx.playTap();
      setActiveBlockId(blockId);
      setShowConceptModal(true);
    } else {
      // Tap-to-Place
      handlePlaceBlock(blockId);
    }
  };

  // Pointer Down on Dock Piece (Start Drag)
  const handlePointerDownPiece = (e: React.PointerEvent, blockId: string) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    handleSelectPiece(blockId);

    setDragState({
      isDragging: true,
      blockId,
      pointerX: e.clientX,
      pointerY: e.clientY,
      offsetX: 0,
      offsetY: 0,
    });
  };

  // Pointer Move (Dragging)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.isDragging || !dragState.blockId) return;

    setDragState(prev => ({
      ...prev,
      pointerX: e.clientX,
      pointerY: e.clientY,
    }));
  };

  // Pointer Up (Drop)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.isDragging || !dragState.blockId) return;

    const blockId = dragState.blockId;
    const block = BUILDING_BLOCKS.find(b => b.id === blockId);

    if (block && svgHouseRef.current) {
      const svgRect = svgHouseRef.current.getBoundingClientRect();
      const scaleX = svgRect.width / 800;
      const scaleY = svgRect.height / 1000;
      const relativeX = (e.clientX - svgRect.left) / scaleX;
      const relativeY = (e.clientY - svgRect.top) / scaleY;

      // Distance threshold in SVG coordinates with generous tolerance
      const distance = Math.hypot(relativeX - block.shape.centerX, relativeY - block.shape.centerY);

      if (distance < 210) {
        handlePlaceBlock(blockId);
        setShowConceptModal(false);
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
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="h-dvh w-full bg-[#F8F9FA] text-[#333333] flex flex-col font-sans select-none overflow-hidden antialiased touch-none"
    >
      {/* ========================================================================= */}
      {/* 1. HEADER INSTITUCIONAL (UI KIT OFICIAL DE BOGOTÁ)                         */}
      {/* ========================================================================= */}
      <header className="shrink-0 w-full bg-white border-b border-slate-200 text-[#333333] shadow-xs z-30 px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Official Logos and App Title */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <img
              src="/assets/logo-bogota.png"
              alt="Alcaldía Mayor de Bogotá"
              className="h-8 sm:h-11 lg:h-12 w-auto object-contain"
            />
            <div className="h-6 sm:h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="font-title text-[11px] sm:text-xs lg:text-sm font-extrabold text-[#CC0E35] uppercase tracking-wider leading-none">
                Portal Transaccional
              </span>
              <span className="font-title text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                Alcaldía Mayor de Bogotá
              </span>
            </div>
          </div>

          {/* Slogan Banner (Center - Desktop only) */}
          <div className="hidden lg:flex flex-col text-center">
            <h1 className="font-title text-xs xl:text-base font-extrabold text-[#333333] tracking-tight leading-tight">
              Entre todos construimos la Bogotá
            </h1>
            <p className="font-body text-[11px] xl:text-xs font-medium text-slate-600">
              Soluciones compartidas (Building Blocks) que transforman los servicios para <span className="font-bold text-[#CC0E35]">la ciudadanía</span>
            </p>
          </div>

          {/* Right: Campaign Logo + Game Badges & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Campaign Logo */}
            <img
              src="/assets/logo-campana.png"
              alt="Aquí Sí Pasa - Bogotá Mi Ciudad, Mi Casa"
              className="h-8 sm:h-11 lg:h-12 w-auto object-contain"
            />

            {/* Score & Progress Badges */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-[15px] border border-slate-200 font-title font-bold text-[10px] sm:text-xs text-slate-700">
                <span className="hidden sm:inline text-slate-500">Progreso:</span>
                <span className="px-1.5 py-0.2 rounded bg-[#CC0E35] text-white font-black">
                  {progressCount}/15
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#FEF7E6] text-[#333333] px-2.5 py-1 rounded-[15px] border border-[#FAB62D] font-title font-black text-[10px] sm:text-xs shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-[#FAB62D]" />
                <span>{score} pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={handleToggleSound}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[15px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[15px] bg-slate-100 hover:bg-red-50 active:scale-95 text-slate-700 hover:text-[#CC0E35] border border-slate-200 hover:border-red-300 font-title font-bold text-[10px] sm:text-xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT (ADAPTATIVO SEGÚN ORIENTACIÓN)                           */}
      {/* ========================================================================= */}
      {isLandscape ? (
        /* ======================================================================= */
        /* A. HORIZONTAL DESKTOP / TV 55" LANDSCAPE (1920x1080) -> 3 COLUMNAS       */
        /* ======================================================================= */
        <div className="flex-1 min-h-0 w-full max-w-[1920px] mx-auto p-3 lg:p-4 grid grid-cols-12 gap-4 overflow-hidden items-stretch">
          
          {/* Col 1 (Left, 3 cols): Inventario con scroll vertical */}
          <section className="col-span-3 h-full flex flex-col bg-white border border-slate-200 rounded-[15px] p-4 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#CC0E35] text-white flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-title text-xs xl:text-sm font-extrabold text-[#333333] uppercase tracking-tight">
                  Inventario ({15 - progressCount} pendientes)
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-title font-bold transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-[#333333] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('unplaced');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-title font-bold transition-all ${
                    categoryFilter === 'unplaced'
                      ? 'bg-[#CC0E35] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>

            {/* Cards Grid (2 cols) */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-2 gap-2.5 pt-3 pr-0.5">
              {filteredBlocks.map(block => {
                const isPlaced = placedBlockIds.includes(block.id);
                const isSelected = activeBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onPointerDown={e => handlePointerDownPiece(e, block.id)}
                    onClick={() => handleSelectPiece(block.id)}
                    className={`relative min-h-[82px] rounded-[15px] p-2.5 flex flex-col justify-between border-2 transition-all cursor-grab active:cursor-grabbing touch-none select-none ${
                      isSelected
                        ? 'bg-[#FEF7E6] border-[#FAB62D] shadow-sm ring-2 ring-[#FAB62D] scale-[1.02]'
                        : isPlaced
                        ? 'bg-slate-50 border-emerald-300 opacity-85'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-title text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: block.color }}
                      >
                        #{block.number}
                      </span>
                      {isPlaced ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 my-auto">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: block.color }}
                      >
                        <BlockIcon name={block.iconName} className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-title text-[11px] font-bold text-[#333333] leading-tight line-clamp-2">
                        {block.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-medium text-slate-400">
                      <span className="truncate">{block.categoryLabel}</span>
                      <span className="font-title text-[#CC0E35] font-bold shrink-0">
                        {isPlaced ? 'Listo' : 'Colocar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Mode trigger */}
            {progressCount < 15 && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>💡 1 Tap ficha + 1 Tap casa</span>
                <button
                  onClick={handleAutoComplete}
                  className="font-bold text-slate-400 hover:text-[#CC0E35] transition-colors underline"
                >
                  Modo Demo
                </button>
              </div>
            )}
          </section>

          {/* Col 2 (Center, 6 cols): La Casa de Bogotá en gran formato */}
          <section className="col-span-6 h-full flex flex-col items-center justify-center relative p-2 overflow-hidden">
            <div className="flex-1 min-h-0 w-full flex items-center justify-center relative max-h-[100%] aspect-[800/1000]">
              <svg
                ref={svgHouseRef}
                viewBox="0 0 800 1000"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-full drop-shadow-xl overflow-visible touch-none select-none"
              >
                <defs>
                  {/* LEGO Stud Pattern for Empty Slots */}
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
                    <text x="18" y="20.5" fontFamily="Montserrat" fontSize="4.5" fontWeight="900" fill="rgba(255,255,255,0.22)" textAnchor="middle">
                      BOGOTÁ
                    </text>
                  </pattern>

                  {/* LEGO Stud Pattern for Outer Wall */}
                  <pattern
                    id="legoStudsRed"
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="36" height="36" fill="#CC0E35" />
                    <circle cx="18" cy="18" r="9.5" fill="#E61E30" />
                    <circle cx="18" cy="18" r="8" fill="#99001B" />
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

                {/* 3 Estrellas de Bogotá DENTRO del SVG */}
                <g pointerEvents="none" className="drop-shadow-[0_0_12px_rgba(250,182,45,0.85)]">
                  <path
                    d="M 680,85 L 693,115 L 725,118 L 700,139 L 708,170 L 680,152 L 652,170 L 660,139 L 635,118 L 667,115 Z"
                    fill="#FAB62D"
                    className="animate-pulse"
                  />
                  <path
                    d="M 625,128 L 633,144 L 650,145 L 637,157 L 641,173 L 625,164 L 609,173 L 613,157 L 600,145 L 617,144 Z"
                    fill="#FAB62D"
                    className="animate-bounce-subtle"
                  />
                  <path
                    d="M 748,68 L 754,82 L 769,83 L 757,94 L 761,109 L 748,100 L 735,109 L 739,94 L 727,83 L 742,82 Z"
                    fill="#FAB62D"
                    className="animate-bounce-subtle"
                  />
                </g>

                {/* Outer Red Silhouette of the House of Bogotá */}
                <path
                  d="M 340,15 L 430,15 L 750,530 L 760,540 L 780,555 L 740,555 L 740,960 Q 740,985 715,985 L 85,985 Q 60,985 60,960 L 60,430 L 40,430 L 230,20 Z"
                  fill="url(#legoStudsRed)"
                  stroke="#99001B"
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
                      onClick={() => handleSlotClick(block.id)}
                    >
                      {/* The Polygon Slot */}
                      <path
                        d={block.shape.pathD}
                        fill={isPlaced ? block.color : 'url(#legoStudsDark)'}
                        stroke={
                          isSimActive
                            ? '#FAB62D'
                            : isActiveGuide
                            ? '#FAB62D'
                            : isPlaced
                            ? '#FFFFFF'
                            : '#450A0A'
                        }
                        strokeWidth={isSimActive ? 8 : isActiveGuide ? 7 : isPlaced ? 3 : 2}
                        strokeLinejoin="round"
                        className={`transition-all duration-300 ${
                          isActiveGuide && !isPlaced ? 'animate-slot-guide' : ''
                        } ${isSimActive ? 'drop-shadow-[0_0_25px_rgba(250,182,45,0.9)]' : ''}`}
                      />

                      {/* Placed slot header & title in house */}
                      {isPlaced && (
                        <g pointerEvents="none">
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY - 20}
                            r="17"
                            fill="rgba(255,255,255,0.22)"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1.5"
                          />
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY - 14}
                            fontFamily="Montserrat"
                            fontSize="13"
                            fontWeight="800"
                            fill="#FFFFFF"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            #{block.number}
                          </text>

                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 10}
                            fontFamily="Montserrat"
                            fontSize="13.5"
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

                      {/* Unplaced Slot Indicator: Guide Hint */}
                      {!isPlaced && (
                        <g pointerEvents="none">
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY}
                            r={isActiveGuide ? 22 : 15}
                            fill={isActiveGuide ? 'rgba(250, 182, 45, 0.95)' : 'rgba(0,0,0,0.35)'}
                            className={isActiveGuide ? 'animate-ping' : ''}
                          />
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY}
                            r={isActiveGuide ? 18 : 15}
                            fill={isActiveGuide ? '#FAB62D' : 'rgba(0,0,0,0.5)'}
                            stroke="#FFFFFF"
                            strokeWidth={isActiveGuide ? 3 : 1}
                          />
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 1}
                            fontFamily="Montserrat"
                            fontSize={isActiveGuide ? '15' : '12'}
                            fontWeight="800"
                            fill={isActiveGuide ? '#333333' : '#FFFFFF'}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {block.number}
                          </text>

                          {/* Label beneath hint for active guide */}
                          {isActiveGuide && (
                            <rect
                              x={block.shape.centerX - 60}
                              y={block.shape.centerY + 26}
                              width="120"
                              height="22"
                              rx="11"
                              fill="#FAB62D"
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                            />
                          )}
                          {isActiveGuide && (
                            <text
                              x={block.shape.centerX}
                              y={block.shape.centerY + 38}
                              fontFamily="Montserrat"
                              fontSize="10.5"
                              fontWeight="800"
                              fill="#333333"
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
                          stroke="#FAB62D"
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

              {/* Victory Celebration Modal Overlay */}
              {isCompleted && !isSimulationMode && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border-4 border-[#FAB62D] p-6 rounded-[15px] shadow-2xl text-center flex flex-col items-center gap-3 z-30 animate-bounce-subtle text-[#333333]">
                  <div className="w-16 h-16 rounded-full bg-[#CC0E35] text-[#FAB62D] flex items-center justify-center text-3xl font-black shadow-lg">
                    ★
                  </div>
                  <div>
                    <span className="font-title text-xs font-extrabold uppercase tracking-widest text-[#CC0E35] bg-red-50 px-2.5 py-0.5 rounded-[15px]">
                      ¡CASA DE BOGOTÁ ENSAMBLADA!
                    </span>
                    <h3 className="font-title text-2xl font-extrabold text-[#333333] mt-1">
                      ¡Felicitaciones a la Ciudadanía!
                    </h3>
                    <p className="font-body text-xs font-medium text-slate-600 max-w-md mt-0.5">
                      Has completado las 15 soluciones compartidas (Building Blocks) que hacen posible un Distrito ágil y digital.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={startSimulation}
                      className="flex items-center gap-2 px-6 py-3 bg-[#FAB62D] hover:bg-[#CC0E35] text-[#333333] hover:text-white font-title font-extrabold text-sm rounded-[15px] shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Iniciar Simulación de Trámite</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-title font-bold text-xs rounded-[15px] transition-all"
                    >
                      Volver a Jugar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Simulation Step HUD Bar */}
            {isSimulationMode && (
              <div className="w-full max-w-xl bg-white border-2 border-[#FAB62D] text-[#333333] rounded-[15px] p-3 shadow-lg flex items-center justify-between gap-3 z-20 mt-1 shrink-0">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-[15px] bg-[#FAB62D] text-[#333333] font-title font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                    {currentSimStep + 1}
                  </div>
                  <div className="truncate">
                    <span className="font-title text-[9px] font-extrabold uppercase text-amber-800 tracking-wider">
                      {currentSimData.entity}
                    </span>
                    <h4 className="font-title text-xs font-extrabold tracking-tight leading-tight truncate">
                      {currentSimData.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      soundFx.playTap();
                      setCurrentSimStep(prev => Math.max(0, prev - 1));
                      setActiveBlockId(SIMULATION_STEPS[Math.max(0, currentSimStep - 1)].blockId);
                    }}
                    disabled={currentSimStep === 0}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playTap();
                      setIsSimPlaying(!isSimPlaying);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#FAB62D] hover:bg-amber-400 text-[#333333] font-title font-bold flex items-center gap-1 shadow-2xs active:scale-95 text-xs"
                  >
                    {isSimPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isSimPlaying ? 'Pausa' : 'Play'}</span>
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
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsSimulationMode(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#CC0E35] font-title font-bold text-xs"
                  >
                    Salir
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Col 3 (Right, 3 cols): Tarjeta interactiva amplia */}
          <section className="col-span-3 h-full flex flex-col justify-between bg-white text-[#333333] border-2 border-[#CC0E35] rounded-[15px] p-5 shadow-2xs relative overflow-hidden">
            {/* Watermark icon */}
            <div className="absolute -right-6 -bottom-6 text-red-50 pointer-events-none select-none opacity-40">
              <BlockIcon name={activeBlock.iconName} className="w-40 h-40" />
            </div>

            <div className="relative z-10 flex flex-col gap-3.5">
              {/* Header: Icon, Category & Title */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-[15px] flex items-center justify-center text-white shadow-2xs shrink-0"
                    style={{ backgroundColor: activeBlock.color }}
                  >
                    <BlockIcon name={activeBlock.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-title text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-0.5">
                      {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                    </span>
                    <h3 className="font-title text-base font-extrabold text-[#333333] tracking-tight leading-tight">
                      {activeBlock.name}
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                {placedBlockIds.includes(activeBlock.id) ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-[15px] bg-emerald-100 text-emerald-800 font-title font-bold text-xs shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Listo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-[15px] bg-amber-100 text-amber-900 font-title font-bold text-xs shrink-0 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pendiente</span>
                  </div>
                )}
              </div>

              {/* Description & Citizen Example */}
              <div className="flex flex-col gap-3 text-slate-700">
                <div className="bg-[#F8F9FA] p-3.5 rounded-[15px] border border-slate-100">
                  <p className="font-title text-[11px] font-extrabold text-[#CC0E35] uppercase tracking-wider mb-1">
                    ¿QUÉ ES?
                  </p>
                  <p className="font-body text-xs xl:text-sm leading-snug font-normal text-slate-800">
                    {activeBlock.description}
                  </p>
                </div>
                <div className="bg-[#FEF7E6] p-3.5 rounded-[15px] border border-[#FAB62D]/40">
                  <p className="font-title text-[11px] font-extrabold text-amber-900 uppercase tracking-wider mb-1">
                    EJEMPLO:
                  </p>
                  <p className="font-body text-xs xl:text-sm leading-snug font-medium text-slate-800">
                    {activeBlock.example}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action Button */}
            <div className="relative z-10 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-body text-xs font-medium text-slate-500">
                {placedBlockIds.includes(activeBlock.id)
                  ? 'Bloque ensamblado en la casa'
                  : 'Toca la ranura en la casa para colocar'}
              </span>
              {!placedBlockIds.includes(activeBlock.id) && (
                <button
                  onClick={() => handlePlaceBlock(activeBlock.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[15px] bg-[#FAB62D] hover:bg-[#CC0E35] text-[#333333] hover:text-white font-title font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Colocar</span>
                </button>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* ======================================================================= */
        /* B. VERTICAL VIEWPORT (1080x1920 KIOSK 55" PORTRAIT / TABLET / MOBILE)     */
        /* 1 Sola Columna en 3 Filas Generosas                                     */
        /* ======================================================================= */
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto p-2.5 sm:p-4 flex flex-col justify-between overflow-hidden gap-2 sm:gap-3.5">
          
          {/* ===================================================================== */}
          {/* FILA 1: TARJETA DE CONCEPTO ACTIVA (TOP ~22% DEL ALTO)               */}
          {/* ===================================================================== */}
          <section className="shrink-0 w-full">
            {/* Desktop / Tablet / Kiosk Portrait (> 768px): Tarjeta completa con tipografía grande */}
            <div className="hidden sm:flex w-full bg-white border-2 border-[#CC0E35] rounded-[15px] p-4 sm:p-5 shadow-xs items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-14 h-14 rounded-[15px] flex items-center justify-center text-white shadow-xs shrink-0"
                  style={{ backgroundColor: activeBlock.color }}
                >
                  <BlockIcon name={activeBlock.iconName} className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="font-title text-xs font-bold uppercase tracking-wider text-slate-500">
                    {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                  </span>
                  <h3 className="font-title text-xl sm:text-2xl font-extrabold text-[#333333] leading-tight">
                    {activeBlock.name}
                  </h3>
                </div>
              </div>

              {/* Description & Example Preview */}
              <div className="hidden md:flex flex-col gap-1 max-w-xl text-left">
                <p className="font-body text-xs sm:text-sm font-normal text-slate-800 line-clamp-2">
                  <strong className="font-title text-[#CC0E35] font-extrabold">¿QUÉ ES?</strong> {activeBlock.description}
                </p>
                <p className="font-body text-xs sm:text-sm font-medium text-amber-900 line-clamp-2">
                  <strong className="font-title text-amber-900 font-extrabold">EJEMPLO:</strong> {activeBlock.example}
                </p>
              </div>

              {/* Detail button for modal inspection */}
              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowConceptModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-[15px] bg-[#FEF7E6] hover:bg-[#FAB62D] text-[#333333] font-title font-bold text-xs shrink-0 border border-[#FAB62D] transition-all"
              >
                <Info className="w-4 h-4 text-[#CC0E35]" />
                <span>Ver completo</span>
              </button>
            </div>

            {/* Mobile (< 768px): Barra compacta con botón 'Ver concepto' */}
            <div
              onClick={() => {
                soundFx.playTap();
                setShowConceptModal(true);
              }}
              className="sm:hidden w-full flex items-center justify-between bg-white border border-slate-200 rounded-[15px] px-3 py-2 shadow-2xs cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className="w-7 h-7 rounded-[15px] flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: activeBlock.color }}
                >
                  <BlockIcon name={activeBlock.iconName} className="w-4 h-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-title text-[9px] font-bold text-slate-500 leading-none">
                    Bloque #{activeBlock.number}
                  </span>
                  <span className="font-title text-xs font-bold text-[#333333] truncate leading-tight">
                    {activeBlock.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-[15px] bg-[#FEF7E6] text-[#333333] font-title font-bold text-[11px] shrink-0 border border-[#FAB62D]">
                <Info className="w-3.5 h-3.5 text-[#CC0E35]" />
                <span>Ver concepto</span>
              </div>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* FILA 2: LA CASA DE BOGOTÁ (CENTRO ~50% DEL ALTO, MIN 850PX EN KIOSK) */}
          {/* ===================================================================== */}
          <section className="flex-1 min-h-0 w-full flex items-center justify-center relative p-1 overflow-hidden">
            <div className="flex-1 min-h-0 w-full flex items-center justify-center relative max-h-[100%] aspect-[800/1000]">
              <svg
                ref={svgHouseRef}
                viewBox="0 0 800 1000"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-full drop-shadow-xl overflow-visible touch-none select-none"
              >
                <defs>
                  {/* LEGO Stud Pattern for Empty Slots */}
                  <pattern
                    id="legoStudsDarkPortrait"
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="36" height="36" fill="#8A0A15" />
                    <circle cx="18" cy="18" r="9.5" fill="#99001B" />
                    <circle cx="18" cy="18" r="8" fill="#6B000F" />
                    <circle cx="16" cy="16" r="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <text x="18" y="20.5" fontFamily="Montserrat" fontSize="4.5" fontWeight="900" fill="rgba(255,255,255,0.22)" textAnchor="middle">
                      BOGOTÁ
                    </text>
                  </pattern>

                  {/* LEGO Stud Pattern for Outer Wall */}
                  <pattern
                    id="legoStudsRedPortrait"
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="36" height="36" fill="#CC0E35" />
                    <circle cx="18" cy="18" r="9.5" fill="#E61E30" />
                    <circle cx="18" cy="18" r="8" fill="#99001B" />
                    <circle cx="16" cy="16" r="5.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                  </pattern>

                  {/* Laser Glow Filter for Simulation */}
                  <filter id="laserGlowPortrait" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 3 Estrellas de Bogotá DENTRO del SVG */}
                <g pointerEvents="none" className="drop-shadow-[0_0_12px_rgba(250,182,45,0.85)]">
                  <path
                    d="M 680,85 L 693,115 L 725,118 L 700,139 L 708,170 L 680,152 L 652,170 L 660,139 L 635,118 L 667,115 Z"
                    fill="#FAB62D"
                    className="animate-pulse"
                  />
                  <path
                    d="M 625,128 L 633,144 L 650,145 L 637,157 L 641,173 L 625,164 L 609,173 L 613,157 L 600,145 L 617,144 Z"
                    fill="#FAB62D"
                    className="animate-bounce-subtle"
                  />
                  <path
                    d="M 748,68 L 754,82 L 769,83 L 757,94 L 761,109 L 748,100 L 735,109 L 739,94 L 727,83 L 742,82 Z"
                    fill="#FAB62D"
                    className="animate-bounce-subtle"
                  />
                </g>

                {/* Outer Red Silhouette of the House of Bogotá */}
                <path
                  d="M 340,15 L 430,15 L 750,530 L 760,540 L 780,555 L 740,555 L 740,960 Q 740,985 715,985 L 85,985 Q 60,985 60,960 L 60,430 L 40,430 L 230,20 Z"
                  fill="url(#legoStudsRedPortrait)"
                  stroke="#99001B"
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
                      onClick={() => handleSlotClick(block.id)}
                    >
                      {/* The Polygon Slot */}
                      <path
                        d={block.shape.pathD}
                        fill={isPlaced ? block.color : 'url(#legoStudsDarkPortrait)'}
                        stroke={
                          isSimActive
                            ? '#FAB62D'
                            : isActiveGuide
                            ? '#FAB62D'
                            : isPlaced
                            ? '#FFFFFF'
                            : '#450A0A'
                        }
                        strokeWidth={isSimActive ? 8 : isActiveGuide ? 7 : isPlaced ? 3 : 2}
                        strokeLinejoin="round"
                        className={`transition-all duration-300 ${
                          isActiveGuide && !isPlaced ? 'animate-slot-guide' : ''
                        } ${isSimActive ? 'drop-shadow-[0_0_25px_rgba(250,182,45,0.9)]' : ''}`}
                      />

                      {/* Placed slot header & title in house */}
                      {isPlaced && (
                        <g pointerEvents="none">
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY - 20}
                            r="17"
                            fill="rgba(255,255,255,0.22)"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1.5"
                          />
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY - 14}
                            fontFamily="Montserrat"
                            fontSize="13"
                            fontWeight="800"
                            fill="#FFFFFF"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            #{block.number}
                          </text>

                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 10}
                            fontFamily="Montserrat"
                            fontSize="13.5"
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

                      {/* Unplaced Slot Indicator: Guide Hint */}
                      {!isPlaced && (
                        <g pointerEvents="none">
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY}
                            r={isActiveGuide ? 22 : 15}
                            fill={isActiveGuide ? 'rgba(250, 182, 45, 0.95)' : 'rgba(0,0,0,0.35)'}
                            className={isActiveGuide ? 'animate-ping' : ''}
                          />
                          <circle
                            cx={block.shape.centerX}
                            cy={block.shape.centerY}
                            r={isActiveGuide ? 18 : 15}
                            fill={isActiveGuide ? '#FAB62D' : 'rgba(0,0,0,0.5)'}
                            stroke="#FFFFFF"
                            strokeWidth={isActiveGuide ? 3 : 1}
                          />
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 1}
                            fontFamily="Montserrat"
                            fontSize={isActiveGuide ? '15' : '12'}
                            fontWeight="800"
                            fill={isActiveGuide ? '#333333' : '#FFFFFF'}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {block.number}
                          </text>

                          {/* Label beneath hint for active guide */}
                          {isActiveGuide && (
                            <rect
                              x={block.shape.centerX - 60}
                              y={block.shape.centerY + 26}
                              width="120"
                              height="22"
                              rx="11"
                              fill="#FAB62D"
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                            />
                          )}
                          {isActiveGuide && (
                            <text
                              x={block.shape.centerX}
                              y={block.shape.centerY + 38}
                              fontFamily="Montserrat"
                              fontSize="10.5"
                              fontWeight="800"
                              fill="#333333"
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
                          stroke="#FAB62D"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className="animate-laser-flow"
                          filter="url(#laserGlowPortrait)"
                        />
                      );
                    })}
                  </g>
                )}
              </svg>

              {/* Victory Celebration Modal Overlay */}
              {isCompleted && !isSimulationMode && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border-4 border-[#FAB62D] p-6 rounded-[15px] shadow-2xl text-center flex flex-col items-center gap-3 z-30 animate-bounce-subtle text-[#333333]">
                  <div className="w-16 h-16 rounded-full bg-[#CC0E35] text-[#FAB62D] flex items-center justify-center text-3xl font-black shadow-lg">
                    ★
                  </div>
                  <div>
                    <span className="font-title text-xs font-extrabold uppercase tracking-widest text-[#CC0E35] bg-red-50 px-2.5 py-0.5 rounded-[15px]">
                      ¡CASA DE BOGOTÁ ENSAMBLADA!
                    </span>
                    <h3 className="font-title text-2xl font-extrabold text-[#333333] mt-1">
                      ¡Felicitaciones a la Ciudadanía!
                    </h3>
                    <p className="font-body text-xs font-medium text-slate-600 max-w-md mt-0.5">
                      Has completado las 15 soluciones compartidas (Building Blocks) que hacen posible un Distrito ágil y digital.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={startSimulation}
                      className="flex items-center gap-2 px-6 py-3 bg-[#FAB62D] hover:bg-[#CC0E35] text-[#333333] hover:text-white font-title font-extrabold text-sm rounded-[15px] shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Iniciar Simulación de Trámite</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-title font-bold text-xs rounded-[15px] transition-all"
                    >
                      Volver a Jugar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===================================================================== */}
          {/* FILA 3: DOCK DE INVENTARIO TÁCTIL (BOTTOM ~28% DEL ALTO)              */}
          {/* ===================================================================== */}
          <section className="shrink-0 w-full bg-white border border-slate-200 rounded-[15px] p-2.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <span className="font-title text-xs sm:text-sm font-extrabold text-[#333333] uppercase">
                Inventario de Soluciones ({15 - progressCount} pendientes)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('all');
                  }}
                  className={`px-2.5 py-1 rounded-[15px] text-[10px] sm:text-xs font-title font-bold transition-all ${
                    categoryFilter === 'all' ? 'bg-[#333333] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('unplaced');
                  }}
                  className={`px-2.5 py-1 rounded-[15px] text-[10px] sm:text-xs font-title font-bold transition-all ${
                    categoryFilter === 'unplaced' ? 'bg-[#CC0E35] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>

            {/* Grid de 2 filas de fichas táctiles (fácil para dedos en móvil y kiosk 55") */}
            <div className="grid grid-flow-col auto-cols-[140px] sm:auto-cols-[180px] grid-rows-2 gap-2 overflow-x-auto no-scrollbar py-0.5">
              {filteredBlocks.map(block => {
                const isPlaced = placedBlockIds.includes(block.id);
                const isSelected = activeBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onPointerDown={e => handlePointerDownPiece(e, block.id)}
                    onClick={() => handleSelectPiece(block.id)}
                    className={`relative min-h-[58px] sm:min-h-[72px] rounded-[15px] p-2 flex flex-col justify-between border-2 transition-all cursor-pointer touch-none select-none ${
                      isSelected
                        ? 'bg-[#FEF7E6] border-[#FAB62D] shadow-xs ring-2 ring-[#FAB62D] scale-[1.02]'
                        : isPlaced
                        ? 'bg-slate-50 border-emerald-300 opacity-80'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-title text-[8px] sm:text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: block.color }}
                      >
                        #{block.number}
                      </span>
                      {isPlaced ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 my-auto">
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: block.color }}
                      >
                        <BlockIcon name={block.iconName} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                      <span className="font-title text-[10px] sm:text-xs font-bold text-[#333333] leading-tight line-clamp-1">
                        {block.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-medium text-slate-400">
                      <span className="truncate">{block.categoryLabel}</span>
                      <span className="font-title text-[#CC0E35] font-bold shrink-0">
                        {isPlaced ? 'Listo' : 'Colocar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL / BOTTOM SHEET DE CONCEPTO Y EJEMPLO (CONSULTA ON-DEMAND)        */}
      {/* ========================================================================= */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowConceptModal(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity"
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-t-[15px] sm:rounded-[15px] border-t-4 sm:border-2 border-[#CC0E35] p-5 sm:p-6 shadow-2xl z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-[15px] flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: activeBlock.color }}
                >
                  <BlockIcon name={activeBlock.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-title text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-0.5">
                    {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                  </span>
                  <h3 className="font-title text-lg sm:text-xl font-extrabold text-[#333333] tracking-tight leading-tight">
                    {activeBlock.name}
                  </h3>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowConceptModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description "¿QUÉ ES?" */}
            <div className="bg-[#F8F9FA] p-4 rounded-[15px] border border-slate-100">
              <p className="font-title text-[11px] font-extrabold text-[#CC0E35] uppercase tracking-wider mb-1">
                ¿QUÉ ES?
              </p>
              <p className="font-body text-xs sm:text-sm leading-snug font-normal text-slate-800">
                {activeBlock.description}
              </p>
            </div>

            {/* Citizen Example */}
            <div className="bg-[#FEF7E6] p-4 rounded-[15px] border border-[#FAB62D]/40">
              <p className="font-title text-[11px] font-extrabold text-amber-900 uppercase tracking-wider mb-1">
                EJEMPLO:
              </p>
              <p className="font-body text-xs sm:text-sm leading-snug font-medium text-slate-800">
                {activeBlock.example}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowConceptModal(false);
                }}
                className="flex-1 py-3.5 bg-[#FAB62D] hover:bg-[#CC0E35] text-[#333333] hover:text-white font-title font-extrabold text-sm rounded-[15px] shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>¡Entendido!</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {!placedBlockIds.includes(activeBlock.id) && (
                <button
                  onClick={() => {
                    handlePlaceBlock(activeBlock.id);
                    setShowConceptModal(false);
                  }}
                  className="px-5 py-3.5 bg-[#CC0E35] hover:bg-red-700 text-white font-title font-bold text-sm rounded-[15px] shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Hammer className="w-4 h-4" />
                  <span>Colocar ahora</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FLOATING DRAGGED PIECE AVATAR (Follows touch pointer)                  */}
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
                className="w-48 sm:w-56 h-20 sm:h-24 rounded-[15px] p-2.5 bg-white text-[#333333] border-3 border-[#FAB62D] shadow-2xl flex flex-col justify-between scale-105 rotate-2"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 25px rgba(250, 182, 45, 0.8)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-title text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: block.color }}
                  >
                    #{block.number}
                  </span>
                  <span className="font-title text-[9px] font-extrabold text-[#CC0E35] uppercase animate-pulse">
                    ¡Arrastra a la casa!
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: block.color }}
                  >
                    <BlockIcon name={block.iconName} className="w-4 h-4" />
                  </div>
                  <span className="font-title text-xs font-bold text-[#333333] leading-tight">
                    {block.name}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
