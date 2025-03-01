// Updated src/types/ICreature.ts
// This removes the old social relation definitions and imports the new ones

import { IGenome } from "./genome";
import { IBody } from "./body";
import { IMemory } from "./memory";
import { IGoal } from "./goal";
import { ISkill } from "./skill";
import { ITrait } from "./trait";
import { ISocialRelation } from "./social-relation"; // Import the new interface
import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  IAttributeModifier,
} from "./attribute";

export interface ICreature {
  //TODO: INVENTAR ( WEAPONS; MONEY and CO )
  //TODO: ARMOR AND CO
  id: string;
  name: string;
  birthdate: Date;

  // Grundeigenschaften
  genome: IGenome;
  body: IBody;
  memory: IMemory;

  // Attribute und Fähigkeiten
  physicalAttributes: IPhysicalAttributes;
  mentalAttributes: IMentalAttributes;
  socialAttributes: ISocialAttributes;

  skills: ISkill[];
  traits: ITrait[];

  // Zustände
  needs: INeed[]; // Bedürfnisse wie Hunger, Schlaf, etc.
  mood: number; // Gesamtstimmung (0-100)
  thoughts: IThought[]; // Aktuelle Gedanken, die Stimmung beeinflussen

  goals: IGoal[]; // Langfristige Ziele

  // Status und Zustände
  healthConditions: IHealthCondition[]; // Gesundheitszustände, Verletzungen
  mentalStates: IMentalState[]; // Psychische Zustände (z.B. Tantrum)
  socialRelations: ISocialRelation[]; // Using the new ISocialRelation interface

  // Methoden
  calculateMood(): number;
  updateNeeds(ticksPassed: number): void;
  gainExperienceInSkill(skillId: string, amount: number): void;
  applyHealthEffect(effect: IHealthEffect): void;
  applyThought(thought: IThought): void;

  // Unterstützende Berechnungen
  getEffectiveSkillLevel(skillId: string): number;
  getEffectiveAttributeValue(attributeId: string): number;

  // New methods for social relationships
  getRelationship(targetId: string): ISocialRelation | undefined;
  getAllRelationships(): ISocialRelation[];
  processInteraction(targetId: string, quality: number, reason?: string): void;
  handleDeathNotification(creatureId: string): void;
}

export interface INeed {
  id: string;
  name: string;
  currentValue: number; // 0-100
  fallRate: number; // Wie schnell der Wert sinkt
  thresholds: INeedThreshold[];
}

export interface INeedThreshold {
  value: number;
  moodEffect: number;
  label: string; // z.B. "Hungrig", "Verhungert"
}

export interface IThought {
  id: string;
  name: string;
  moodEffect: number;
  duration: number; // In Ticks oder Tagen
  remainingTime: number;
  stackCount: number; // Wie oft der Gedanke gestapelt wurde
  stackLimit: number; // Maximaler Stack
}

export interface IHealthCondition {
  id: string;
  name: string;
  affectedBodyPartID: string; // ID des betroffenen Körperteils
  severity: number; // 0-1
  permanent: boolean; // Dauerhafter Zustand?
  treatmentQuality?: number; // Qualität der Behandlung
  tendedUntil?: number; // Wie lange die Behandlung anhält

  // Auswirkungen
  painFactor: number; // Schmerzfaktor
  bleedRate: number; // Blutungsrate
  attributeModifiers: IAttributeModifier[];
}

export interface IMentalState {
  id: string;
  name: string;
  description: string;
  severity: MentalStateSeverity;
  duration: number; // In Ticks
  remainingTime: number;

  // Auswirkungen auf Verhalten
  behaviorModifiers: IBehaviorModifier[];
}

export enum MentalStateSeverity {
  MINOR = "MINOR", // z.B. Weinen
  MAJOR = "MAJOR", // z.B. Wutanfall
  EXTREME = "EXTREME", // z.B. Mörderische Rage
}

export interface IBehaviorModifier {
  type: string;
  value: any;
}

export interface IOpinionModifier {
  reason: string;
  value: number;
  expiryDate?: Date;
}

export interface IHealthEffect {
  id: string;
  name: string;
  description: string;
  targetBodyPart?: string; // ID des betroffenen Körperteils
  severity: number; // 0-1
  duration?: number; // Dauer in Ticks, undefined = permanent

  // Auswirkungen
  painFactor: number; // Schmerzfaktor
  bleedRate: number; // Blutungsrate
  attributeModifiers: IAttributeModifier[];

  // Optionale Flags
  isTreatable: boolean;
  isPermanent: boolean;
  isLethal: boolean;
}
