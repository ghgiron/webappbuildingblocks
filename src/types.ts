export type BlockCategory =
  | 'seguridad'
  | 'transaccional'
  | 'orquestacion'
  | 'datos'
  | 'ciudadania'
  | 'analitica';

export interface TangramShape {
  // SVG polygon path in the master house coordinate space (e.g. 0 0 800 1000)
  pathD: string;
  // Visual center for label & icon placement inside the house
  centerX: number;
  centerY: number;
  // Dock visual representation
  shapeClass: string;
  clipPathCss?: string;
  // Dimensions hint for UI cards
  colSpan?: number;
}

export interface BuildingBlock {
  id: string;
  number: number;
  name: string;
  shortName: string;
  category: BlockCategory;
  categoryLabel: string;
  color: string;
  borderColor: string;
  bgLight: string;
  description: string;
  example: string;
  iconName: string;
  shape: TangramShape;
  simulationStep?: {
    order: number;
    stepTitle: string;
    actionDescription: string;
  };
}

export interface SimulationStepData {
  order: number;
  blockId: string;
  relatedBlockIds?: string[];
  title: string;
  description: string;
  entity: string;
  citizenBenefit?: string;
}

export interface DragState {
  isDragging: boolean;
  blockId: string | null;
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
}
