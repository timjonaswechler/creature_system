// Grundlegende Material-Definitionen
export interface IMaterial {
  id: string;
  name: string;
  // Physikalische Eigenschaften
  density: number; // kg/m³
  hardness: number; // Mohs-Skala
  elasticity: number; // Young's Modulus
  // Biologische Eigenschaften
  healingRate: number; // Regenerationsrate
  painReceptors: boolean; // Schmerzempfindlichkeit
  bleeding: boolean; // Blutungsneigung
  // Erscheinungsbild
  appearance?: IAppearanceProperties;
}

// Phänotypische Eigenschaften
export interface IAppearanceProperties {
  color?: string; // CSS-Color oder RGB
  texture?: string; // Beschreibung der Textur
  pattern?: string; // Muster (z.B. gestreift, gefleckt)
  opacity?: number; // 0-1: Transparenz
  glossiness?: number; // 0-1: Glanz
  roughness?: number; // 0-1: Oberflächenrauheit
}
