// src/interfaces/ICreature.ts (überarbeitet)
import { IGenome } from "./IGenome";
import { IBody } from "./IBody";
import { IMemory } from "./IMemory";
import { IGoal } from "./IGoal";
import { ISkill } from "./ISkill";
import { ITrait } from "./ITrait";
import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  IAttributeModifier,
} from "./IAttribute";

export interface ICreature {
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
  socialRelations: ISocialRelation[]; // Beziehungen zu anderen Kreaturen

  // Methoden
  calculateMood(): number;
  updateNeeds(ticksPassed: number): void;
  gainExperienceInSkill(skillId: string, amount: number): void;
  applyHealthEffect(effect: IHealthEffect): void;
  applyThought(thought: IThought): void;

  // Unterstützende Berechnungen
  getEffectiveSkillLevel(skillId: string): number;
  getEffectiveAttributeValue(attributeId: string): number;
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

export interface ISocialRelation {
  targetId: string;
  type: SocialRelationType;
  value: number; // -100 bis +100
  opinionModifiers: IOpinionModifier[];
}

export enum SocialRelationType {
  FAMILY = "FAMILY", // Familienmitglied
  LOVER = "LOVER", // Partner
  FRIEND = "FRIEND", // Freund
  RIVAL = "RIVAL", // Rivale
  ENEMY = "ENEMY", // Feind
  ACQUAINTANCE = "ACQUAINTANCE", // Bekannter
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
