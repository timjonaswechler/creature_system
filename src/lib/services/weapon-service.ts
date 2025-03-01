// src/lib/services/weapon-service.ts
import daggerData from "@/data/weapons/dagger.json";
import swordData from "@/data/weapons/sword.json";
import two_handed_swordData from "@/data/weapons/two_handed_sword.json";
import { IWeapon, WeaponType, WeaponCategory, GraspType } from "@/types/weapon";
import { da } from "date-fns/locale";

// Hilfsfunktion zum Konvertieren der Range-Maps
function parseRange(
  rangeData: any[] | undefined
): Map<number, number> | undefined {
  if (!rangeData || !Array.isArray(rangeData) || rangeData.length === 0) {
    return undefined;
  }

  // Konvertiere das Array von Arrays in eine Map
  const rangeMap = new Map<number, number>();
  rangeData.forEach((entry) => {
    if (Array.isArray(entry) && entry.length === 2) {
      rangeMap.set(entry[0], entry[1]);
    }
  });

  return rangeMap.size > 0 ? rangeMap : undefined;
}

// Konvertierungsfunktion für die Typen, die imported JSON zu IWeapon-Objekten macht
function parseWeapons(data: any[]): IWeapon[] {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: item.type as WeaponType, // Konvertierung zum enum
    category: item.category as WeaponCategory, // Konvertierung zum enum
    baseDamage: Array.isArray(item.baseDamage) ? item.baseDamage : [],
    weight: Array.isArray(item.weight) ? item.weight : [],
    price: item.price,
    material: item.material,
    durability: item.durability,
    properties: Array.isArray(item.properties) ? item.properties : [],
    imageUrl: item.imageUrl,
    range: parseRange(item.range), // Konvertiere range-Daten in eine Map
    grasp: Array.isArray(item.grasp) ? item.grasp : [],
  }));
}
// Konvertieren der Waffen bereits beim Import
const typedWeapons: IWeapon[] = parseWeapons(
  [daggerData, swordData, two_handed_swordData].flat()
);

export class WeaponService {
  // Alle Waffen abrufen
  static getWeapons(): Promise<IWeapon[]> {
    // In einer echten Anwendung würde hier ein API-Aufruf stehen
    return Promise.resolve(typedWeapons);
  }

  // Eine spezifische Waffe anhand der ID abrufen
  static getWeaponById(id: string): Promise<IWeapon | null> {
    const weapon = typedWeapons.find((w) => w.id === id) || null;
    return Promise.resolve(weapon);
  }

  // Waffen nach Typ filtern
  static getWeaponsByType(type: WeaponType): Promise<IWeapon[]> {
    const weapons = typedWeapons.filter((w) => w.type === type);
    return Promise.resolve(weapons);
  }

  // Waffen nach Kategorie filtern
  static getWeaponsByCategory(category: WeaponCategory): Promise<IWeapon[]> {
    const weapons = typedWeapons.filter((w) => w.category === category);
    return Promise.resolve(weapons);
  }
  static getWeaponsByGrasp(grasp: GraspType): Promise<IWeapon[]> {
    const weapons = typedWeapons.filter((w) => w.grasp.includes(grasp));
    return Promise.resolve(weapons);
  }

  // Waffen nach Material filtern
  static getWeaponsByMaterial(material: string): Promise<IWeapon[]> {
    const weapons = typedWeapons.filter((w) =>
      w.material.toLowerCase().includes(material.toLowerCase())
    );
    return Promise.resolve(weapons);
  }

  // Waffen nach Preisspanne filtern
  static getWeaponsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<IWeapon[]> {
    const weapons = typedWeapons.filter(
      (w) => w.price >= minPrice && w.price <= maxPrice
    );
    return Promise.resolve(weapons);
  }
}
