export interface RulesInterface {
  gt: number;
  lte: number;
  unit?: number;
  price: number;
}

export type AddressType = 'nearby' | 'address' | 'none';
