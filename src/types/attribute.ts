// src/types/IAttribute.ts
export enum AttributeCategory {
  PHYSICAL = "PHYSICAL",
  MENTAL = "MENTAL",
  SOCIAL = "SOCIAL",
}

export interface IAttribute {
  id: string;
  name: string;
  category: AttributeCategory;
  baseValue: number; // Grundwert (0-100)
  currentValue: number; // Aktueller Wert mit temporären Modifikatoren
  maxValue: number; // Maximaler Wert (normalerweise 100)

  // Berechnet Attributwert mit allen Modifikatoren
  calculateEffectiveValue(): number;

  // Attribute können Rust/Decay haben (wie in DF)
  lastUsed?: Date;
  rustLevel?: number; // 0-6 wie in DF
}

export interface IAttributeModifier {
  attributeId: string;
  modifier: number; // Absoluter Wert z.B. +10
  modifierPercent?: number; // Prozentualer Wert z.B. +15%
}

// Physische Attribute (inspiriert von Dwarf Fortress)
export interface IPhysicalAttributes {
  strength: IAttribute; // Stärke, Tragfähigkeit, Nahkampfschaden
  agility: IAttribute; // Geschwindigkeit, Geschicklichkeit
  toughness: IAttribute; // Widerstand gegen Schaden
  endurance: IAttribute; // Ausdauer, Widerstand gegen Erschöpfung
  recuperation: IAttribute; // Heilungsrate
  diseaseResistance: IAttribute; // Widerstand gegen Krankheiten
}

// Mentale Attribute (inspiriert von Dwarf Fortress)
export interface IMentalAttributes {
  analyticalAbility: IAttribute; // Problemlösung, Forschung
  focus: IAttribute; // Konzentration, Präzisionsarbeit
  willpower: IAttribute; // Stressresistenz, mentale Stärke
  creativity: IAttribute; // Kunstfertigkeit, Ideenreichtum
  intuition: IAttribute; // Entscheidungsfindung
  patience: IAttribute; // Geduld bei langwierigen Aufgaben
  memory: IAttribute; // Lernfähigkeit
  spatialSense: IAttribute; // Konstruktion, Navigation
}

// Soziale Attribute
export interface ISocialAttributes {
  empathy: IAttribute; // Verständnis für andere
  socialAwareness: IAttribute; // Soziale Intelligenz
  linguisticAbility: IAttribute; // Kommunikationsfähigkeit
  leadership: IAttribute; // Führungsqualitäten
  negotiation: IAttribute; // Handel, Diplomatie
}
