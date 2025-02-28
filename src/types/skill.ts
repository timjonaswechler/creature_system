import { IAttribute } from "./attribute";

// src/types/ISkill.ts
export enum SkillCategory {
  CRAFTING = "CRAFTING",
  COMBAT = "COMBAT",
  SOCIAL = "SOCIAL",
  INTELLECTUAL = "INTELLECTUAL",
  ARTISTIC = "ARTISTIC",
  LABOR = "LABOR",
  MEDICAL = "MEDICAL",
}

export interface ISkill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;

  // Skill-Levels
  level: number; // Aktuelles Level (0-20)
  experience: number; // Angesammelte XP
  passion: SkillPassion; // Wie in RimWorld

  // Verknüpfung mit Attributen
  primaryAttributes: IAttribute[]; // Hauptattribute, die diesen Skill beeinflussen
  secondaryAttributes: IAttribute[]; // Sekundäre Attribute mit geringerem Einfluss

  // Skill-Verfall wie in Dwarf Fortress
  unusedCounter: number; // Zählt die Tage seit letzter Verwendung
  rustCounter: number; // Rostlevel, das durch Nichtbenutzung entsteht
  demotionCounter: number; // Zählt wie nahe der Skill davor ist, ein Level zu verlieren

  // Methoden
  gainExperience(amount: number): void;
  checkForLevelUp(): boolean;
  applyRust(): void;
  getEffectiveLevel(): number; // Berücksichtigt Rost und temporäre Modifikationen
  getDisplayName(): string; // Gibt den Namen des Skills mit Level zurück
  // Optional: Learning Rate Modifier (wie viel Erfahrung beim Ausführen gesammelt wird)
  learningRateModifier: number;
}

export enum SkillPassion {
  NONE = "NONE", // Standard, 35% Lernrate
  MINOR = "MINOR", // Interessiert, 100% Lernrate, +8 Stimmung
  MAJOR = "MAJOR", // Leidenschaftlich, 150% Lernrate, +14 Stimmung
  BURNING = "BURNING", // Brennende Leidenschaft, 200% Lernrate, +20 Stimmung (eigene Erweiterung)
}

// Beispiel für Experience-Level-Verhältnis (ähnlich DF)
export const EXPERIENCE_THRESHOLDS = [
  0, // Level 0 (Not)
  500, // Level 1 (Dabbling)
  1500, // Level 2 (Novice)
  3000, // Level 3 (Adequate)
  6000, // Level 4 (Competent)
  10000, // Level 5 (Skilled)
  15000, // Level 6 (Proficient)
  21000, // Level 7 (Talented)
  28000, // Level 8 (Talented)
  36000, // Level 9 (Expert)
  45000, // Level 10 (Professional)
  55000, // Level 11 (Accomplished)
  67000, // Level 12 (Great)
  81000, // Level 13 (Master)
  97000, // Level 14 (High Master)
  115000, // Level 15 (Grand Master)
  135000, // Level 16 (Legendary)
  157000, // Level 17 (Legendary+)
  181000, // Level 18 (Legendary++)
  207000, // Level 19 (Legendary+++)
  235000, // Level 20 (Legendary++++)
];

// Skill-Namen basierend auf Level (wie in DF)
export const SKILL_LEVEL_NAMES = [
  "Not", // 0
  "Dabbling", // 1
  "Novice", // 2
  "Adequate", // 3
  "Competent", // 4
  "Skilled", // 5
  "Proficient", // 6
  "Talented", // 7
  "Adept", // 8
  "Expert", // 9
  "Professional", // 10
  "Accomplished", // 11
  "Great", // 12
  "Master", // 13
  "High Master", // 14
  "Grand Master", // 15
  "Legendary", // 16+
];

export interface ISkillModifier {
  skillId: string;
  levelModifier?: number; // Direkter Level-Boost
  experienceMultiplier?: number; // Multiplikator für Erfahrungsgewinn
  passionChange?: SkillPassion; // Setzt Passion auf bestimmten Wert
}
