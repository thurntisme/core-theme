export interface Property {
  id: number;
  name: string;
  level: number;
  income: number;
  maintenanceCost: number;
  type?: string;
  position?: { x: number; y: number };
  district?: string;
}

export interface User {
  username: string;
  email: string;
  continent: string;
  level: number;
  money: number;
  properties: Property[];
  land: { size: number; value: number };
  lastLogin: string;
}
