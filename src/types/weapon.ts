// src/types/weapon.ts
export enum WeaponType {
  MELEE = "MELEE",
  RANGED = "RANGED",
  THROWING = "THROWING",
}
export enum GraspType {
  ONE_HANDED = "ONE_HANDED",
  TWO_HANDED = "TWO_HANDED",
}
export enum WeaponCategory {
  //MELLEE
  DAGGERS = "DAGGER",
  SWORDS = "SWORDS",
  MACES = "MACES",
  SPEARS = "SPEARS",
  AXES = "AXES",
  FLAILS = "FLAILS",
  CLEAVERS = "CLEAVERS",
  HAMMERS = "HAMMERS",
  POLEARMS = "POLEARMS",

  // RANGED
  BOWS = "BOWS",
  CROSSBOWS = "CROSSBOWS",
  FIREARMS = "FIREARMS",
  THROWING_WEAPONS = "THROWING_WEAPONS",
  THROWABLE_ITEMS = "THROWABLE_ITEMS",
}

export interface IWeapon {
  id: string;
  name: string;
  description: string;
  type: WeaponType;
  category: WeaponCategory; // z.B. Schwert, Axt, Bogen, etc.
  baseDamage: number[]; // z.B. 65-85
  weight: number[]; //  min max in kg
  price: number; // base price
  material: string; // TODO: Connect with MATERIAL INTERFACE
  durability: number;
  range?: Map<number, number>; // für Fernwaffen
  grasp: GraspType[];
  properties: string[]; // besondere Eigenschaften wie "zweihändig", "finesse", etc.
  imageUrl?: string;
}
