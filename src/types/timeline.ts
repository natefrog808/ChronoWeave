export interface HistoricalEvent {
  id: number;
  year: number;
  event: string;
  description: string;
  impact: Record<string, number>;
  effects?: number[];
  causedBy?: number[];
  category: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface ImpactType {
  id: string;
  label: string;
  color: string;
}

export interface TimelineConnection {
  from: number;
  to: number;
  type: 'effect' | 'dependency' | 'paradox';
}

export interface TimelineEffects {
  economy: number;
  society: number;
  technology: number;
  education: number;
  health: number;
  [key: string]: number;
}
