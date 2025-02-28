// src/models/Creature.ts
import { v4 as uuidv4 } from "uuid";
import {
  ICreature,
  INeed,
  IThought,
  IHealthCondition,
  IMentalState,
  IHealthEffect,
  MentalStateSeverity,
} from "@/types/creature";
import { IGenome } from "@/types/genome";
import { IBody, IBodyPart } from "@/types/body";
import { IMemory } from "@/types/memory";
import { IGoal } from "@/types/goal";
import { ISkill } from "@/types/skill";
import { ITrait } from "@/types/trait";
import { RelationshipManager } from "./relationship-manager";
import { ISocialRelation, SocialRelationType } from "@/types/social-relation";

import {
  IPhysicalAttributes,
  IMentalAttributes,
  ISocialAttributes,
  AttributeCategory,
  IAttribute,
} from "@/types/attribute";
import { Attribute } from "./attribute";

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

  private relationshipManager: RelationshipManager;

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
    this.socialRelations = [];
    this.relationshipManager = new RelationshipManager(this);

    (this.mentalStates = [
      {
        id: uuidv4(),
        name: "Normal",
        description: "Regular state of mind",
        severity: MentalStateSeverity.MINOR,
        duration: -1,
        remainingTime: -1,
        behaviorModifiers: [],
      },
    ]),
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
    // In applyHealthEffect method in Creature.ts
    const healthCondition: IHealthCondition = {
      id: uuidv4(),
      name: effect.name,
      affectedBodyPartID: affectedBodyPart ? affectedBodyPart.id : "",
      severity: effect.severity,
      // Add other required properties from IHealthCondition
      painFactor: effect.painFactor,
      bleedRate: effect.bleedRate,
      attributeModifiers: effect.attributeModifiers,
      permanent: effect.isPermanent || false,
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
  /**
   * Get a relationship with another creature by ID
   */
  getRelationship(targetId: string): ISocialRelation | undefined {
    return this.relationshipManager.getRelationship(targetId);
  }
  getAllRelationships(): ISocialRelation[] {
    return this.relationshipManager.getAllRelationships();
  }
  /**
   * Process an interaction with another creature
   */
  processInteraction(targetId: string, quality: number, reason?: string): void {
    this.relationshipManager.processInteraction(targetId, quality, reason);
  }

  /**
   * Handle notification that a creature this one knows has died
   */
  handleDeathNotification(creatureId: string): void {
    this.relationshipManager.processRelatedCreatureDeath(creatureId);
  }

  /**
   * Get all friends of this creature
   */
  getFriends(): ISocialRelation[] {
    return this.socialRelations.filter(
      (rel) =>
        rel.type === SocialRelationType.FRIEND ||
        rel.type === SocialRelationType.CLOSE_FRIEND ||
        rel.type === SocialRelationType.KINDRED_SPIRIT
    );
  }

  /**
   * Get all family members of this creature
   */
  getFamilyMembers(): ISocialRelation[] {
    return this.socialRelations.filter(
      (rel) =>
        rel.type === SocialRelationType.SPOUSE ||
        rel.type === SocialRelationType.LOVER ||
        rel.type === SocialRelationType.PARENT ||
        rel.type === SocialRelationType.CHILD ||
        rel.type === SocialRelationType.SIBLING ||
        rel.type === SocialRelationType.GRANDPARENT ||
        rel.type === SocialRelationType.GRANDCHILD ||
        rel.type === SocialRelationType.AUNT_UNCLE ||
        rel.type === SocialRelationType.NIECE_NEPHEW ||
        rel.type === SocialRelationType.COUSIN ||
        rel.type === SocialRelationType.FAMILY
    );
  }

  /**
   * Get all grudges/enemies of this creature
   */
  getEnemies(): ISocialRelation[] {
    return this.socialRelations.filter(
      (rel) =>
        rel.type === SocialRelationType.GRUDGE ||
        rel.type === SocialRelationType.ENEMY ||
        rel.type === SocialRelationType.RIVAL
    );
  }

  /**
   * Form a familial relationship with another creature
   */
  formFamilialRelationship(
    targetId: string,
    relationType: SocialRelationType, // Using enum type directly
    familyDetails: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    }
  ): ISocialRelation {
    return this.relationshipManager.setRelationship({
      targetId,
      type: relationType,
      familyDetails,
    });
  }
}
