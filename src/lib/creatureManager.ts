// src/utils/creatureManager.ts
import { v4 as uuidv4 } from "uuid"; // Du musst dieses Paket installieren: npm install uuid @types/uuid
import { createBasicHumanoidBody } from "@/examples/bodyExamples";

import {
  ICreature,
  INeed,
  IThought,
  IHealthCondition,
  IMentalState,
  ISocialRelation,
  IHealthEffect,
} from "../interfaces/ICreature";
import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  AttributeCategory,
} from "../interfaces/IAttribute";
import { Attribute } from "../models/Attribute";
export const STORAGE_KEY = "creatures";

/**
 * Speichert eine Kreatur im localStorage
 */
export const saveCreature = (creature: ICreature): void => {
  // Aktuelle Kreaturen laden
  const storedCreatures = getCreatures();

  // Neue Kreatur hinzufügen/aktualisieren
  const updatedCreatures = {
    ...storedCreatures,
    [creature.id]: creature,
  };

  // Zurück in localStorage speichern
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCreatures));
};

/**
 * Lädt alle Kreaturen aus dem localStorage
 */
export const getCreatures = (): Record<string, ICreature> => {
  const storedCreatures = localStorage.getItem(STORAGE_KEY);
  return storedCreatures ? JSON.parse(storedCreatures) : {};
};

/**
 * Lädt eine einzelne Kreatur anhand ihrer ID
 */
export const getCreatureById = (id: string): ICreature | null => {
  const creatures = getCreatures();
  return creatures[id] || null;
};

/**
 * Erstellt eine neue Kreatur mit Standardwerten
 */
export const createNewCreature = (name: string): ICreature => {
  // Hier erstellst du eine neue Kreatur mit allen erforderlichen Eigenschaften
  // und setzt sinnvolle Standardwerte
  const body = createBasicHumanoidBody();

  // Erstelle Attribute mit der Attribute-Klasse
  const physicalAttributes: IPhysicalAttributes = {
    strength: new Attribute({
      id: "strength",
      name: "Stärke",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
    agility: new Attribute({
      id: "agility",
      name: "Agilität",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
    toughness: new Attribute({
      id: "toughness",
      name: "Zähigkeit",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
    endurance: new Attribute({
      id: "endurance",
      name: "Ausdauer",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
    recuperation: new Attribute({
      id: "recuperation",
      name: "Regeneration",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
    diseaseResistance: new Attribute({
      id: "diseaseResistance",
      name: "Krankheitsresistenz",
      category: AttributeCategory.PHYSICAL,
      baseValue: 50,
    }),
  };

  const mentalAttributes: IMentalAttributes = {
    analyticalAbility: new Attribute({
      id: "analyticalAbility",
      name: "Analytisches Denken",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    focus: new Attribute({
      id: "focus",
      name: "Fokus",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    willpower: new Attribute({
      id: "willpower",
      name: "Willenskraft",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    creativity: new Attribute({
      id: "creativity",
      name: "Kreativität",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    intuition: new Attribute({
      id: "intuition",
      name: "Intuition",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    patience: new Attribute({
      id: "patience",
      name: "Geduld",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    memory: new Attribute({
      id: "memory",
      name: "Gedächtnis",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
    spatialSense: new Attribute({
      id: "spatialSense",
      name: "Raumgefühl",
      category: AttributeCategory.MENTAL,
      baseValue: 50,
    }),
  };

  const socialAttributes: ISocialAttributes = {
    empathy: new Attribute({
      id: "empathy",
      name: "Empathie",
      category: AttributeCategory.SOCIAL,
      baseValue: 50,
    }),
    socialAwareness: new Attribute({
      id: "socialAwareness",
      name: "Soziales Bewusstsein",
      category: AttributeCategory.SOCIAL,
      baseValue: 50,
    }),
    linguisticAbility: new Attribute({
      id: "linguisticAbility",
      name: "Sprachbegabung",
      category: AttributeCategory.SOCIAL,
      baseValue: 50,
    }),
    leadership: new Attribute({
      id: "leadership",
      name: "Führungsqualitäten",
      category: AttributeCategory.SOCIAL,
      baseValue: 50,
    }),
    negotiation: new Attribute({
      id: "negotiation",
      name: "Verhandlungsgeschick",
      category: AttributeCategory.SOCIAL,
      baseValue: 50,
    }),
  };

  // Leere Listen für Needs, Thoughts, etc. erstellen
  const needs: INeed[] = [];
  const thoughts: IThought[] = [];
  const healthConditions: IHealthCondition[] = [];
  const mentalStates: IMentalState[] = [];
  const socialRelations: ISocialRelation[] = [];

  const newCreature: ICreature = {
    id: uuidv4(),
    name: name,
    birthdate: new Date(),
    genome: { id: uuidv4(), chromosomes: [] },
    body: body,
    memory: { events: [] },

    // Neue Attribute
    physicalAttributes: physicalAttributes,
    mentalAttributes: mentalAttributes,
    socialAttributes: socialAttributes,

    // Vorhandene Eigenschaften
    goals: [],
    skills: [],
    traits: [],
    mentalState: {
      id: uuidv4(),
      name: "Normal",
      description: "Regular state of mind",
      value: 0,
    },
    physicalState: [],
    socialState: {
      id: uuidv4(),
      name: "Neutral",
      description: "Normal social standing",
      value: 0,
    },

    // Neue Eigenschaften
    needs: needs,
    mood: 50, // Standardwert für Stimmung
    thoughts: thoughts,
    healthConditions: healthConditions,
    mentalStates: [],
    socialRelations: socialRelations,

    // Methoden
    calculateMood: () => 50, // Platzhalter-Implementierung
    updateNeeds: (ticksPassed: number) => {}, // Platzhalter-Implementierung
    gainExperienceInSkill: (skillId: string, amount: number) => {}, // Platzhalter-Implementierung
    applyHealthEffect: (effect: IHealthEffect) => {}, // Platzhalter-Implementierung
    applyThought: (thought: IThought) => {}, // Platzhalter-Implementierung
    getEffectiveSkillLevel: (skillId: string) => 0, // Platzhalter-Implementierung
    getEffectiveAttributeValue: (attributeId: string) => 0, // Platzhalter-Implementierung
  };

  return newCreature;
};

/**
 * Löscht eine Kreatur anhand ihrer ID
 */
export const deleteCreature = (id: string): void => {
  const creatures = getCreatures();
  if (creatures[id]) {
    delete creatures[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creatures));
  }
};

/**
 * Löscht alle Kreaturen
 */
export const deleteAllCreatures = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
