export interface ShipNameResult {
  names: string[];
}

export interface CoupleData {
  name1: string;
  name2: string;
}

export type AppState = 'input' | 'loading' | 'selection' | 'result';