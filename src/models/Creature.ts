// src/models/Creature.ts
import { v4 as uuidv4 } from "uuid";
import {
  ICreature,
  INeed,
  IThought,
  IHealthCondition,
  IMentalState,
  ISocialRelation,
  IHealthEffect,
} from "../interfaces/ICreature";
import { IGenome } from "../interfaces/IGenome";
import { IBody, IBodyPart } from "../interfaces/IBody";
import { IMemory } from "../interfaces/IMemory";
import { IGoal } from "../interfaces/IGoal";
import { ISkill } from "../interfaces/ISkill";
import { ITrait } from "../interfaces/ITrait";
import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  AttributeCategory,
  IAttribute,
} from "../interfaces/IAttribute";
import { Attribute } from "./Attribute";

export class Creature implements ICreature {
  id: string;
  name: string;
  birthdate: Date;
  genome: IGenome;
  body: IBody;
  memory: IMemory;

  physicalAttributes: IPhysicalAttributes = {} as IPhysicalAttributes;
  mentalAttributes: IMentalAttributes = {} as IMentalAttributes;
  socialAttributes: ISocialAttributes = {} as ISocialAttributes;

  skills: ISkill[] = [];
  traits: ITrait[] = [];

  needs: INeed[] = [];
  mood: number = 50; // Standardwert
  thoughts: IThought[] = [];

  goals: IGoal[] = [];

  healthConditions: IHealthCondition[] = [];
  mentalStates: IMentalState[] = [];
  socialRelations: ISocialRelation[] = [];

  constructor(params: {
    id: string;
    name: string;
    birthdate: Date;
    genome: IGenome;
    body: IBody;
    memory: IMemory;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.birthdate = params.birthdate;
    this.genome = params.genome;
    this.body = params.body;
    this.memory = params.memory;

    // Initialisiere Attribute
    this.initializeAttributes();
  }

  get age(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.birthdate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365); // Vereinfachte Berechnung
  }

  private initializeAttributes(): void {
    // Physische Attribute
    this.physicalAttributes = {
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

    // Mentale Attribute
    this.mentalAttributes = {
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

    // Soziale Attribute
    this.socialAttributes = {
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
  }

  calculateMood(): number {
    // Berechne die Gesamtstimmung basierend auf Gedanken, Traits, usw.
    let baseMood = 50; // Standardwert

    // Gedanken beeinflussen Stimmung
    for (const thought of this.thoughts) {
      baseMood += thought.moodEffect * thought.stackCount;
    }

    // Körperliche Zustände beeinflussen Stimmung
    for (const condition of this.healthConditions) {
      // Schmerz reduziert Stimmung
      baseMood -= condition.painFactor * 5;
    }

    // Bedürfnisse beeinflussen Stimmung
    for (const need of this.needs) {
      // Finde die aktuelle Stimmungsschwelle
      const threshold = need.thresholds.find(
        (t) => need.currentValue >= t.value
      );
      if (threshold) {
        baseMood += threshold.moodEffect;
      }
    }

    // Begrenze die Stimmung
    this.mood = Math.max(0, Math.min(100, baseMood));
    return this.mood;
  }

  applyHealthEffect(effect: IHealthEffect): void {
    // Finde das betroffene Körperteil, falls angegeben
    let affectedBodyPart: IBodyPart | undefined;
    if (effect.targetBodyPart) {
      affectedBodyPart = this.body.getBodyPartById(effect.targetBodyPart);
    }

    // Nur fortfahren, wenn ein Körperteil gefunden wurde oder keins benötigt wird
    if (effect.targetBodyPart && !affectedBodyPart) {
      console.warn(
        `Körperteil mit ID ${effect.targetBodyPart} nicht gefunden.`
      );
      return;
    }

    // Erstelle eine neue Gesundheitsbedingung basierend auf dem Effekt
    // Passe die Eigenschaften an deine IHealthCondition-Definition an
    const healthCondition: IHealthCondition = {
      id: uuidv4(),
      name: effect.name,
      bodyPart: affectedBodyPart.id as IBodyPart, // Sicherstellen, dass es nicht undefined ist
      // Entferne die description-Eigenschaft, wenn sie nicht in IHealthCondition existiert
      // description: effect.description,
      value: effect.severity,
      // Füge weitere erforderliche Eigenschaften aus deinem IHealthCondition-Interface hinzu
    };

    // Füge die Bedingung zur Liste hinzu
    this.healthConditions.push(healthCondition);

    // Füge die Bedingung zur Liste hinzu
    this.healthConditions.push(healthCondition);

    // Wende Attributmodifikatoren an
    for (const mod of effect.attributeModifiers) {
      const attribute = this.findAttribute(mod.attributeId);
      if (attribute) {
        // Prozentuale Modifikation
        if (mod.modifierPercent) {
          attribute.currentValue *= 1 + mod.modifierPercent / 100;
        }

        // Absolute Modifikation
        if (mod.modifier) {
          attribute.currentValue += mod.modifier;
        }

        // Auf Grenzen beschränken
        attribute.currentValue = Math.min(
          attribute.maxValue,
          Math.max(0, attribute.currentValue)
        );
      }
    }

    // Aktualisiere die Stimmung
    this.calculateMood();
  }

  updateNeeds(ticksPassed: number): void {
    // Aktualisiere die Bedürfnisse basierend auf verstrichener Zeit
    for (const need of this.needs) {
      need.currentValue = Math.max(
        0,
        need.currentValue - need.fallRate * ticksPassed
      );
    }
  }

  gainExperienceInSkill(skillId: string, amount: number): void {
    const skill = this.skills.find((s) => s.id === skillId);
    if (skill) {
      skill.gainExperience(amount);
    }
  }

  // applyHealthEffect(effect: IHealthEffect): void { // TODO: Implementierung
  //   // Implementierung von Gesundheitseffekten
  // }

  applyThought(thought: IThought): void {
    // Prüfe, ob der Gedanke bereits existiert
    const existingThought = this.thoughts.find((t) => t.id === thought.id);

    if (existingThought) {
      // Stapeln, wenn möglich
      if (existingThought.stackCount < existingThought.stackLimit) {
        existingThought.stackCount++;
        existingThought.remainingTime = Math.max(
          existingThought.remainingTime,
          thought.duration
        );
      }
    } else {
      // Neuen Gedanken hinzufügen
      this.thoughts.push({
        ...thought,
        remainingTime: thought.duration,
        stackCount: 1,
      });
    }

    // Stimmung neu berechnen
    this.calculateMood();
  }

  getEffectiveSkillLevel(skillId: string): number {
    const skill = this.skills.find((s) => s.id === skillId);
    if (!skill) return 0;

    return skill.getEffectiveLevel();
  }

  getEffectiveAttributeValue(attributeId: string): number {
    // Finde das Attribut in allen Attributkategorien
    const attribute = this.findAttribute(attributeId);
    if (!attribute) return 0;

    return attribute.calculateEffectiveValue();
  }

  private findAttribute(attributeId: string): IAttribute | null {
    // Suche in allen Attributkategorien
    const allAttributes = [
      ...Object.values(this.physicalAttributes),
      ...Object.values(this.mentalAttributes),
      ...Object.values(this.socialAttributes),
    ];

    return allAttributes.find((attr) => attr.id === attributeId) || null;
  }
}
