// src/lib/services/weapon-service.ts
import weaponsData from "@/data/weapons.json";
import { IWeapon, WeaponType } from "@/types/weapon";
import { ca } from "date-fns/locale";

// Konvertierungsfunktion für die Typen
function parseWeapons(data: any[]): IWeapon[] {
  return data.map((item) => ({
    ...item,
    type: item.type as WeaponType,
    category: item.category as WeaponType,
    range: item.range ? new Map(item.range) : undefined,
  }));
}

export class WeaponService {
  static getWeapons(): Promise<IWeapon[]> {
    // Direktes Zurückgeben der Daten in einem Promise
    return Promise.resolve(parseWeapons(weaponsData));
  }

  static getWeaponById(id: string): Promise<IWeapon | null> {
    const weapons = parseWeapons(weaponsData);
    const weapon = weapons.find((weapon) => weapon.id === id) || null;
    return Promise.resolve(weapon);
  }
}
