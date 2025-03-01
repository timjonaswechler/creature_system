// src/lib/services/weapon-service.ts
import daggersData from "@/data/weapons/daggers.json";
import swordsData from "@/data/weapons/swords.json";
import macesData from "@/data/weapons/maces.json";
import spearsData from "@/data/weapons/spears.json";
import axesData from "@/data/weapons/axes.json";
import cleaversData from "@/data/weapons/cleavers.json";
import flailsData from "@/data/weapons/flails.json";
import hammersData from "@/data/weapons/hammers.json";
import polearmsData from "@/data/weapons/polearms.json";
import bowsData from "@/data/weapons/bows.json";
import crossbowsData from "@/data/weapons/crossbows.json";
import firearmsData from "@/data/weapons/firearms.json";
import thrownData from "@/data/weapons/throwing_weapons.json";
import { IWeapon, WeaponType, WeaponCategory, GraspType } from "@/types/weapon";

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
    grasp: Array.isArray(item.grasp)
      ? item.grasp.map((g: string) => g as GraspType)
      : [], // Ensure we properly convert grasp strings to enum values
  }));
}
// Konvertieren der Waffen bereits beim Import
const typedWeapons: IWeapon[] = parseWeapons(
  [
    daggersData,
    swordsData,
    spearsData,
    axesData,
    macesData,
    cleaversData,
    flailsData,
    hammersData,
    polearmsData,
    bowsData,
    crossbowsData,
    firearmsData,
    thrownData,
  ].flat()
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

  // Waffen nach Griff filtern
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
