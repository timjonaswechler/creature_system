// src/utils/creatureManager.ts
import { v4 as uuidv4 } from "uuid";
import { createBasicHumanoidBody } from "@/examples/bodyExamples";
import { Trait } from "../models/Trait";
import { Skill } from "../models/Skill";
import { SocialRelation } from "../models/SocialRelation"; // Import SocialRelation class
import { TraitCategory, TraitImpact } from "../interfaces/ITrait";
import { SkillCategory, SkillPassion } from "../interfaces/ISkill";
import { creatureReplacer, deserializeSocialRelation } from "./serialization"; // Import serialization helpers

import {
  ICreature,
  INeed,
  IThought,
  IHealthCondition,
  IMentalState,
  IHealthEffect,
} from "../interfaces/ICreature";
import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  AttributeCategory,
} from "../interfaces/IAttribute";
import { Attribute } from "../models/Attribute";
import { Creature } from "@/models/Creature";
export const STORAGE_KEY = "creatures";

/**
 * Speichert eine Kreatur im localStorage
 */
export const saveCreature = (creature: ICreature): void => {
  // Aktuelle Kreaturen laden
  const storedCreatures = getCreatures();

  // Convert the social relations to a serializable format
  const serializedCreature = {
    ...creature,
    // Remove the relationship manager which is recreated at runtime
    relationshipManager: undefined,
    // Convert social relations to plain objects
    socialRelations: creature.socialRelations.map((rel) => {
      if (rel instanceof SocialRelation) {
        return rel; // This will be processed by the creatureReplacer
      }
      return rel;
    }),
  };

  // Neue Kreatur hinzufügen/aktualisieren with custom replacer function
  const updatedCreatures = {
    ...storedCreatures,
    [creature.id]: serializedCreature,
  };

  // Zurück in localStorage speichern using custom replacer
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedCreatures, creatureReplacer)
  );
};

/**
 * Lädt alle Kreaturen aus dem localStorage
 */
export const getCreatures = (): Record<string, ICreature> => {
  const storedCreatures = localStorage.getItem(STORAGE_KEY);
  if (!storedCreatures) return {};

  // Parse the stored creatures
  const parsedCreatures = JSON.parse(storedCreatures);

  // Recreate proper SocialRelation objects
  Object.values(parsedCreatures).forEach((creature: any) => {
    if (creature.socialRelations && Array.isArray(creature.socialRelations)) {
      creature.socialRelations = creature.socialRelations.map((rel: any) => {
        // Recreate the SocialRelation object with proper methods
        return deserializeSocialRelation(rel);
      });
    }

    // Restore Date objects
    if (creature.birthdate) {
      creature.birthdate = new Date(creature.birthdate);
    }

    // Re-instantiate the relationship manager when the creature is accessed
    // This happens in the Creature constructor, so we don't need to do it here
  });

  return parsedCreatures;
};

/**
 * Lädt eine einzelne Kreatur anhand ihrer ID
 */
export const getCreatureById = (id: string): ICreature | null => {
  const creatures = getCreatures();
  const creature = creatures[id] || null;

  // If the creature exists, ensure it has a properly initialized relationship manager
  if (creature && !("relationshipManager" in creature)) {
    // This will be recreated when the Creature class is instantiated
  }

  return creature;
};

/**
 * Erstellt eine neue Kreatur mit Standardwerten
 */
export const createNewCreature = (name: string): ICreature => {
  // Hier erstellst du eine neue Kreatur mit allen erforderlichen Eigenschaften
  // und setzt sinnvolle Standardwerte
  const body = createBasicHumanoidBody();
  // Erstelle einige Standard-Traits
  const traits = [
    // Körperliche Eigenschaften
    createToughTrait(),

    // Basisstimmung wie in RimWorld
    createSanguineTrait(),

    // Arbeitseigenschaften
    createHardWorkerTrait(),
  ];

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

  const newCreature = new Creature({
    id: uuidv4(),
    name: name,
    birthdate: new Date(),
    genome: { id: uuidv4(), chromosomes: [] },
    body: body,
    memory: { events: [] },
  });

  // Erstelle einige Basis-Skills
  const skills = [
    createCraftingSkill(newCreature),
    createMiningSkill(newCreature),
    createShootingSkill(newCreature),
  ];

  // Füge sie zur Kreatur hinzu
  newCreature.traits = traits;
  newCreature.skills = skills;

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

// Hilfsfunktionen für Trait-Erstellung
function createToughTrait(): Trait {
  const trait = new Trait();
  trait.id = uuidv4();
  trait.name = "Zäh";
  trait.description =
    "Diese Person hat eine dickere Haut, dichteres Fleisch und stabilere Knochen.";
  trait.category = TraitCategory.PHYSICAL;
  trait.impact = TraitImpact.POSITIVE;

  trait.attributeModifiers = [
    {
      attributeId: "toughness",
      modifier: 20,
    },
    {
      attributeId: "recuperation",
      modifier: 10,
    },
  ];

  return trait;
}

function createSanguineTrait(): Trait {
  const trait = new Trait();
  trait.id = uuidv4();
  trait.name = "Sanguinisch";
  trait.description =
    "Diese Person ist von Natur aus optimistisch und gut gelaunt.";
  trait.category = TraitCategory.PERSONALITY;
  trait.impact = TraitImpact.POSITIVE;

  trait.moodModifiers = [
    {
      moodChange: 12, // Permanenter Stimmungsbonus
    },
  ];

  return trait;
}

function createHardWorkerTrait(): Trait {
  const trait = new Trait();
  trait.id = uuidv4();
  trait.name = "Fleißig";
  trait.description =
    "Ein natürlicher Arbeiter, der Aufgaben schneller als die meisten erledigt.";
  trait.category = TraitCategory.SPECTRUM;
  trait.impact = TraitImpact.POSITIVE;

  trait.attributeModifiers = [
    {
      attributeId: "willpower",
      modifier: 0, // Hinzufügen des erforderlichen Feldes mit Standardwert
      modifierPercent: 20, // Prozentuale Steigerung für alle arbeitsbezogenen Aktivitäten
    },
  ];

  return trait;
}

// Hilfsfunktionen für Skill-Erstellung
function createCraftingSkill(creature: ICreature): Skill {
  const skill = new Skill();
  skill.id = uuidv4();
  skill.name = "Handwerk";
  skill.description =
    "Die Fähigkeit, Gegenstände herzustellen und zu verarbeiten.";
  skill.category = SkillCategory.CRAFTING;
  skill.level = 4; // Skilled
  skill.experience = 7000;
  skill.passion = SkillPassion.MINOR;

  // Attribute-Verknüpfungen hinzufügen
  skill.primaryAttributes = [
    creature.physicalAttributes.strength,
    creature.mentalAttributes.creativity,
  ];

  skill.secondaryAttributes = [
    creature.physicalAttributes.agility,
    creature.mentalAttributes.patience,
  ];

  return skill;
}

function createMiningSkill(creature: ICreature): Skill {
  const skill = new Skill();
  skill.id = uuidv4();
  skill.name = "Bergbau";
  skill.description = "Die Fähigkeit, effizient Ressourcen abzubauen.";
  skill.category = SkillCategory.LABOR;
  skill.level = 2; // Adequate
  skill.experience = 2000;
  skill.passion = SkillPassion.NONE;

  // Attribute-Verknüpfungen hinzufügen
  skill.primaryAttributes = [
    creature.physicalAttributes.strength,
    creature.physicalAttributes.endurance,
  ];

  skill.secondaryAttributes = [creature.mentalAttributes.patience];

  return skill;
}

function createShootingSkill(creature: ICreature): Skill {
  const skill = new Skill();
  skill.id = uuidv4();
  skill.name = "Schießen";
  skill.description = "Die Fähigkeit, präzise mit Fernkampfwaffen zu treffen.";
  skill.category = SkillCategory.COMBAT;
  skill.level = 3; // Competent
  skill.experience = 4000;
  skill.passion = SkillPassion.MAJOR;

  // Attribute-Verknüpfungen hinzufügen
  skill.primaryAttributes = [
    creature.physicalAttributes.agility,
    creature.mentalAttributes.focus,
  ];

  skill.secondaryAttributes = [creature.physicalAttributes.strength];

  return skill;
}
