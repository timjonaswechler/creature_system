import { ICreature } from "./creature";
import { ISkillModifier } from "./skill";
import { IAttributeModifier } from "./attribute";

// src/types/ITrait.ts
export enum TraitCategory {
  PERSONALITY = "PERSONALITY", // Charakter und Temperament
  PHYSICAL = "PHYSICAL", // Körperliche Eigenschaften
  BACKGROUND = "BACKGROUND", // Vorgeschichte, Herkunft
  QUIRK = "QUIRK", // Kleine Eigenheiten
  SPECTRUM = "SPECTRUM", // Eigenschaften auf einem Spektrum (wie RimWorld's neurotic)
}

export enum TraitImpact {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  NEUTRAL = "NEUTRAL",
  SITUATIONAL = "SITUATIONAL",
}

export interface ITrait {
  id: string;
  name: string;
  description: string;
  category: TraitCategory;
  impact: TraitImpact;

  // Ein Trait kann andere Traits ausschließen (z.B. "Optimist" vs "Pessimist")
  conflictingTraits: string[];

  // Auswirkungen
  attributeModifiers: IAttributeModifier[]; // Permanente Attribute-Änderungen
  skillModifiers: ISkillModifier[]; // Permanente Skill-Änderungen

  moodModifiers: IMoodModifier[]; // Stimmungsänderungen unter Bedingungen
  thoughtTriggers: IThoughtTrigger[]; // Auslöser für bestimmte Gedanken

  // Bei Spectrum-Traits
  spectrumValue?: number; // Wert auf dem Spektrum (-100 bis +100)
  spectrumRange?: [number, number]; // Min/Max-Bereich

  // Methoden
  applyEffects(creature: ICreature): void;
  getDescription(detailed: boolean): string;
}

export interface IMoodModifier {
  moodChange: number; // z.B. +10, -15
  condition?: IMoodCondition; // Optional: Bedingung für diesen Modifikator
  duration?: number; // Dauer in Ticks
}

export interface IMoodCondition {
  type: MoodConditionType;
  parameters: any; // Zusätzliche Parameter für die Bedingung
}

export enum MoodConditionType {
  ENVIRONMENT = "ENVIRONMENT", // z.B. im Freien, unterirdisch
  SOCIAL = "SOCIAL", // z.B. in Gesellschaft, allein
  ACTIVITY = "ACTIVITY", // z.B. beim Kämpfen, Forschen
  NEED = "NEED", // z.B. hungrig, müde
  TIME = "TIME", // z.B. Tageszeit, Jahreszeit
}

export interface IThoughtTrigger {
  thoughtId: string;
  conditions: IMoodCondition[];
  chance: number; // Wahrscheinlichkeit 0-1
}

// Beispiele für Spektrum-Traits (inspiriert von RimWorld)
export enum SpectrumTraitType {
  INDUSTRIOUSNESS = "INDUSTRIOUSNESS", // Arbeitsgeschwindigkeit
  NERVOUSNESS = "NERVOUSNESS", // Stressschwelle
  NEUROTIC = "NEUROTIC", // Arbeitsgeschwindigkeit vs Stress
  MOOD_BASE = "MOOD_BASE", // Grundstimmung
  PSYCHIC_SENSITIVITY = "PSYCHIC_SENSITIVITY", // Empfindlichkeit
  SPEED = "SPEED", // Bewegungsgeschwindigkeit
}
