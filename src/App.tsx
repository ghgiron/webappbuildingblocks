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
  ChevronRight
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
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.65 },
          colors: ['#D31424', '#FFD100', '#FFFFFF', '#B3001B']
        });
        confetti({
          particleCount: 5,
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
      colors: ['#FFD100', '#D31424', '#FFFFFF']
    });

    // Auto select next unplaced block
    const remaining = BUILDING_BLOCKS.filter(b => b.id !== blockId && !placedBlockIds.includes(b.id));
    if (remaining.length > 0) {
      setTimeout(() => {
        setActiveBlockId(remaining[0].id);
      }, 800);
    }
  }, [placedBlockIds]);

  // Pointer Down on Dock Piece (Start Drag / Tap)
  const handlePointerDownPiece = (e: React.PointerEvent, blockId: string) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    soundFx.playSelect();
    setActiveBlockId(blockId);

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

  // Pointer Up (Drop / End Tap)
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

      // Distance threshold in SVG coordinates
      const distance = Math.hypot(relativeX - block.shape.centerX, relativeY - block.shape.centerY);

      if (distance < 200) {
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
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="min-h-screen w-full bg-[#F8F9FA] text-slate-900 flex flex-col font-sans select-none overflow-x-hidden antialiased"
    >
      {/* ========================================================================= */}
      {/* 1. HEADER INSTITUCIONAL ULTRA-LIMPIO (TEMA CLARO #FFFFFF / #F8F9FA)       */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-slate-200 text-slate-900 shadow-xs sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Official Logos and App Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/assets/logo-bogota.png"
              alt="Alcaldía Mayor de Bogotá"
              className="h-8 sm:h-11 w-auto object-contain drop-shadow-2xs"
            />
            <div className="h-6 sm:h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-black text-bogota-red uppercase tracking-wider leading-none">
                Portal Transaccional
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                Alcaldía Mayor de Bogotá
              </span>
            </div>
          </div>

          {/* Slogan Banner (Center - Desktop only) */}
          <div className="hidden lg:flex flex-col text-center">
            <h1 className="text-sm xl:text-base font-black text-slate-900 tracking-tight leading-tight">
              Entre todos construimos la Bogotá
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Soluciones compartidas (Building Blocks) que transforman los servicios para <span className="font-black text-bogota-red">la ciudadanía</span>
            </p>
          </div>

          {/* Right: Campaign Logo + Game Badges & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Campaign Logo */}
            <img
              src="/assets/logo-campana.png"
              alt="Aquí Sí Pasa - Bogotá Mi Ciudad, Mi Casa"
              className="h-8 sm:h-11 w-auto object-contain"
            />

            {/* Score & Progress Badges */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-[11px] sm:text-xs text-slate-700">
                <span className="hidden sm:inline text-slate-500">Progreso:</span>
                <span className="px-1.5 py-0.2 rounded bg-bogota-red text-white font-black">
                  {progressCount}/15
                </span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 sm:px-2.5 py-1 rounded-lg border border-amber-200 font-black text-[11px] sm:text-xs shadow-2xs">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                <span>{score} pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={handleToggleSound}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 active:scale-95 text-slate-700 hover:text-bogota-red border border-slate-200 hover:border-red-300 font-bold text-xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (MOBILE COMPACT & DESKTOP SPLIT-SCREEN)              */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-2.5 sm:p-4 lg:p-6 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-8 items-center lg:items-start justify-between">
        
        {/* ========================================================================= */}
        {/* DESKTOP LEFT COLUMN (lg:col-span-5): TARJETA PEDAGÓGICA PERMANENTE        */}
        {/* ========================================================================= */}
        <section className="hidden lg:flex lg:col-span-5 flex-col gap-4 w-full">
          
          {/* Tarjeta Pedagógica Dinámica en Desktop */}
          <div className="w-full bg-white text-slate-900 border-2 border-bogota-red rounded-3xl p-5 shadow-sm relative overflow-hidden transition-all duration-300">
            {/* Watermark icon */}
            <div className="absolute -right-6 -bottom-6 text-red-50 pointer-events-none select-none opacity-50">
              <BlockIcon name={activeBlock.iconName} className="w-40 h-40" />
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              {/* Header: Icon, Category & Title */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                    style={{ backgroundColor: activeBlock.color }}
                  >
                    <BlockIcon name={activeBlock.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-0.5">
                      {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                      {activeBlock.name}
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                {placedBlockIds.includes(activeBlock.id) ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ensamblado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Toca la casa</span>
                  </div>
                )}
              </div>

              {/* Description & Citizen Example */}
              <div className="flex flex-col gap-2.5 pt-1 text-slate-700">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-black text-bogota-red uppercase tracking-wider mb-0.5">
                    ¿Qué es?
                  </p>
                  <p className="text-sm leading-snug font-medium text-slate-800">
                    {activeBlock.description}
                  </p>
                </div>
                <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-100">
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

          {/* Desktop Inventory Dock */}
          <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-bogota-red text-white flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Inventario ({15 - progressCount} pendientes)
                </h4>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos (15)
                </button>
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('unplaced');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    categoryFilter === 'unplaced'
                      ? 'bg-bogota-red text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setCategoryFilter('transaccional');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    categoryFilter === 'transaccional'
                      ? 'bg-bogota-red text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Transaccional
                </button>
              </div>
            </div>

            {/* Grid 3 cols */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
              {filteredBlocks.map(block => {
                const isPlaced = placedBlockIds.includes(block.id);
                const isSelected = activeBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    onPointerDown={e => handlePointerDownPiece(e, block.id)}
                    className={`relative min-h-[86px] rounded-2xl p-2.5 flex flex-col justify-between border-2 transition-all cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'bg-amber-50 border-bogota-yellow shadow-md scale-[1.02] ring-2 ring-bogota-yellow'
                        : isPlaced
                        ? 'bg-slate-50 border-emerald-300 opacity-80'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: block.color }}
                      >
                        #{block.number}
                      </span>
                      {isPlaced ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 my-auto">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: block.color }}
                      >
                        <BlockIcon name={block.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-slate-800 leading-tight line-clamp-2">
                        {block.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="truncate">{block.categoryLabel}</span>
                      <span className="text-bogota-red font-black shrink-0">
                        {isPlaced ? 'Listo' : 'Encajar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Mode trigger */}
            {progressCount < 15 && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                <span>💡 Toca una ficha y luego su espacio en la casa</span>
                <button
                  onClick={handleAutoComplete}
                  className="font-bold text-slate-400 hover:text-bogota-red transition-colors underline"
                >
                  Modo Demo (15/15)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ESCENARIO CENTRAL (CASA TANGRAM - SIEMPRE VISIBLE EN MÓVIL Y DESKTOP)    */}
        {/* ========================================================================= */}
        <section className="w-full lg:col-span-7 flex flex-col items-center justify-center relative">
          
          {/* Mobile Active Block 1-Line Action Banner (Tap opens Modal/Bottom Sheet) */}
          <div className="w-full lg:hidden flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-2xs mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: activeBlock.color }}
              >
                <BlockIcon name={activeBlock.iconName} className="w-4 h-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] font-bold text-slate-500 leading-none">
                  Bloque #{activeBlock.number}
                </span>
                <span className="text-xs font-black text-slate-900 truncate leading-tight">
                  {activeBlock.name}
                </span>
              </div>
            </div>

            {/* Button to open Pedagogical Modal/Bottom Sheet */}
            <button
              onClick={() => {
                soundFx.playTap();
                setShowConceptModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 active:scale-95 text-bogota-red font-black text-xs shrink-0 transition-all border border-red-200"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Ver concepto</span>
            </button>
          </div>

          {/* Bogotá Sky Stars (Top Right) */}
          <div className="absolute top-1 right-3 sm:right-6 flex items-center gap-1.5 pointer-events-none z-10">
            <div className="text-bogota-yellow drop-shadow-[0_0_8px_rgba(253,195,0,0.8)] text-2xl sm:text-4xl font-black animate-bounce-subtle">
              ★
            </div>
            <div className="text-bogota-yellow drop-shadow-[0_0_12px_rgba(253,195,0,0.9)] text-3xl sm:text-5xl font-black animate-float">
              ★
            </div>
            <div className="text-bogota-yellow drop-shadow-[0_0_8px_rgba(253,195,0,0.8)] text-xl sm:text-3xl font-black animate-bounce-subtle">
              ★
            </div>
          </div>

          {/* Interactive SVG House Canvas (Fits Mobile Height ~320-380px without scrolling) */}
          <div className="relative w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[330px] sm:h-[420px] lg:h-[540px] flex items-center justify-center my-auto">
            <svg
              ref={svgHouseRef}
              viewBox="0 0 800 1000"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full drop-shadow-xl overflow-visible"
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
                  <text x="18" y="20.5" fontSize="4.5" fontWeight="900" fill="rgba(255,255,255,0.22)" textAnchor="middle">
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
                          fontSize="13"
                          fontWeight="900"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          #{block.number}
                        </text>

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

                    {/* Unplaced Slot Indicator: Guide Hint */}
                    {!isPlaced && (
                      <g pointerEvents="none">
                        <circle
                          cx={block.shape.centerX}
                          cy={block.shape.centerY}
                          r={isActiveGuide ? 22 : 15}
                          fill={isActiveGuide ? 'rgba(255, 209, 0, 0.9)' : 'rgba(0,0,0,0.35)'}
                          className={isActiveGuide ? 'animate-ping' : ''}
                        />
                        <circle
                          cx={block.shape.centerX}
                          cy={block.shape.centerY}
                          r={isActiveGuide ? 18 : 15}
                          fill={isActiveGuide ? '#FFD100' : 'rgba(0,0,0,0.5)'}
                          stroke="#FFFFFF"
                          strokeWidth={isActiveGuide ? 3 : 1}
                        />
                        <text
                          x={block.shape.centerX}
                          y={block.shape.centerY + 1}
                          fontSize={isActiveGuide ? '15' : '12'}
                          fontWeight="900"
                          fill={isActiveGuide ? '#1F2937' : '#FFFFFF'}
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
                            fill="#FFD100"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        )}
                        {isActiveGuide && (
                          <text
                            x={block.shape.centerX}
                            y={block.shape.centerY + 38}
                            fontSize="10.5"
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

            {/* Victory Celebration Modal Overlay */}
            {isCompleted && !isSimulationMode && (
              <div className="absolute inset-x-2 sm:inset-x-6 top-1/2 -translate-y-1/2 bg-white border-4 border-bogota-yellow p-5 sm:p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-3 z-30 animate-bounce-subtle text-slate-900">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-bogota-red text-bogota-yellow flex items-center justify-center text-2xl sm:text-4xl font-black shadow-lg">
                  ★
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-bogota-red bg-red-50 px-3 py-1 rounded-md">
                    ¡CASA DE BOGOTÁ ENSAMBLADA!
                  </span>
                  <h3 className="text-lg sm:text-3xl font-black text-slate-900 mt-1">
                    ¡Felicitaciones a la Ciudadanía!
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mt-1">
                    Has completado las 15 soluciones compartidas (Building Blocks) que hacen posible un Distrito ágil y digital.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1 w-full justify-center">
                  <button
                    onClick={startSimulation}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-bogota-red hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar Simulación de Trámite</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Volver a Jugar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Step HUD Bar */}
          {isSimulationMode && (
            <div className="w-full max-w-2xl bg-white border-2 border-bogota-yellow text-slate-900 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20 mt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-bogota-yellow text-slate-900 font-black flex items-center justify-center text-sm sm:text-base shadow-xs shrink-0">
                  {currentSimStep + 1}
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    {currentSimData.entity}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black tracking-tight leading-tight">
                    {currentSimData.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-600 line-clamp-1 sm:line-clamp-2">
                    {currentSimData.description}
                  </p>
                </div>
              </div>

              {/* Controls */}
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
                  className="px-3 py-1.5 rounded-lg bg-bogota-yellow hover:bg-amber-400 text-slate-900 font-black flex items-center gap-1 shadow-xs active:scale-95 text-xs"
                >
                  {isSimPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-900" />}
                  <span>{isSimPlaying ? 'Pausar' : 'Play'}</span>
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
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-bogota-red font-bold text-xs"
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* MOBILE DOCK COMPACTO (2 FILAS O SCROLL HORIZONTAL DE ALTO CONTRASTE)      */}
        {/* ========================================================================= */}
        <section className="w-full lg:hidden bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm mt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black text-slate-900 uppercase">
              Inventario ({15 - progressCount} pendientes)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('all');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  categoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setCategoryFilter('unplaced');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  categoryFilter === 'unplaced' ? 'bg-bogota-red text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Pendientes
              </button>
            </div>
          </div>

          {/* 2-row scrollable grid on mobile (fits in 130px height) */}
          <div className="grid grid-flow-col auto-cols-[145px] grid-rows-2 gap-2 overflow-x-auto no-scrollbar py-0.5">
            {filteredBlocks.map(block => {
              const isPlaced = placedBlockIds.includes(block.id);
              const isSelected = activeBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onPointerDown={e => handlePointerDownPiece(e, block.id)}
                  className={`relative h-[62px] rounded-xl p-1.5 flex flex-col justify-between border-2 transition-all cursor-grab active:cursor-grabbing ${
                    isSelected
                      ? 'bg-amber-50 border-bogota-yellow shadow-sm ring-1 ring-bogota-yellow'
                      : isPlaced
                      ? 'bg-slate-50 border-emerald-300 opacity-75'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[8px] font-black uppercase px-1 rounded text-white"
                      style={{ backgroundColor: block.color }}
                    >
                      #{block.number}
                    </span>
                    {isPlaced ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: block.color }}
                    >
                      <BlockIcon name={block.iconName} className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-800 leading-tight truncate">
                      {block.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL / BOTTOM SHEET SUAVE DE CONCEPTO Y EJEMPLO (MOBILE / TABLET)     */}
      {/* ========================================================================= */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowConceptModal(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Bottom Sheet Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border-t-4 sm:border-2 border-bogota-red p-5 sm:p-6 shadow-2xl z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: activeBlock.color }}
                >
                  <BlockIcon name={activeBlock.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-0.5">
                    {activeBlock.categoryLabel} • Bloque #{activeBlock.number}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
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

            {/* Description "¿Qué es?" */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[11px] font-black text-bogota-red uppercase tracking-wider mb-1">
                ¿Qué es?
              </p>
              <p className="text-sm leading-snug font-medium text-slate-800">
                {activeBlock.description}
              </p>
            </div>

            {/* Citizen Example */}
            <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-100">
              <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider mb-1">
                Ejemplo tangible en la vida real:
              </p>
              <p className="text-xs leading-snug font-semibold text-slate-800">
                {activeBlock.example}
              </p>
            </div>

            {/* Primary Action Button to close & place in house */}
            <button
              onClick={() => setShowConceptModal(false)}
              className="w-full py-3.5 bg-bogota-red hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Entendido / Continuar jugando</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
                className="w-48 sm:w-56 h-20 sm:h-24 rounded-2xl p-2.5 bg-white text-slate-900 border-3 border-bogota-yellow shadow-2xl flex flex-col justify-between scale-105 rotate-2"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 25px rgba(255, 209, 0, 0.8)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: block.color }}
                  >
                    #{block.number}
                  </span>
                  <span className="text-[9px] font-black text-bogota-red uppercase animate-pulse">
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
  );
}
