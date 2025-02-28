// src/interfaces/ISocialRelation.ts
// Complete implementation of the social relationship system

import { ICreature } from "./ICreature";

/**
 * Defines the types of social relationships between creatures
 */
export enum SocialRelationType {
  // Kin relationships
  SPOUSE = "SPOUSE",
  LOVER = "LOVER",
  PARENT = "PARENT",
  CHILD = "CHILD",
  SIBLING = "SIBLING",
  GRANDPARENT = "GRANDPARENT",
  GRANDCHILD = "GRANDCHILD",
  AUNT_UNCLE = "AUNT_UNCLE",
  NIECE_NEPHEW = "NIECE_NEPHEW",
  COUSIN = "COUSIN",
  FAMILY = "FAMILY", // Legacy type for backwards compatibility

  // Spiritual relationships
  DEITY = "DEITY",
  WORSHIPPER = "WORSHIPPER",

  // Professional relationships
  APPRENTICE = "APPRENTICE",
  MASTER = "MASTER",
  FORMER_APPRENTICE = "FORMER_APPRENTICE",
  FORMER_MASTER = "FORMER_MASTER",

  // Animal relationships
  PET = "PET",
  OWNER = "OWNER",
  BONDED_ANIMAL = "BONDED_ANIMAL",
  ANIMAL_TRAINER = "ANIMAL_TRAINER",

  // Non-kin personal relationships
  KINDRED_SPIRIT = "KINDRED_SPIRIT",
  COMPANION = "COMPANION",
  CLOSE_FRIEND = "CLOSE_FRIEND",
  FRIEND = "FRIEND",
  FRIENDLY_TERMS = "FRIENDLY_TERMS",
  LONG_TERM_ACQUAINTANCE = "LONG_TERM_ACQUAINTANCE",
  PASSING_ACQUAINTANCE = "PASSING_ACQUAINTANCE",
  GRUDGE = "GRUDGE",
  ENEMY = "ENEMY",
  RIVAL = "RIVAL", // Legacy type for backwards compatibility
  ACQUAINTANCE = "ACQUAINTANCE", // Legacy type for backwards compatibility
}

/**
 * Categories for relationship variables that modify the relationship quality
 */
export enum RelationshipVariable {
  LOYALTY = "LOYALTY",
  TRUST = "TRUST",
  FEAR = "FEAR",
  LOVE = "LOVE",
  RESPECT = "RESPECT",
}

/**
 * A single relationship variable with a value
 */
export interface IRelationshipVariable {
  type: RelationshipVariable;
  value: number; // -100 to +100
}

/**
 * Reasons for opinion changes in a relationship
 */
export interface IOpinionModifier {
  reason: string;
  value: number;
  expiryDate?: Date;
}

/**
 * Represents the social relationship between two creatures
 */
export interface ISocialRelation {
  // The ID of the target creature
  targetId: string;

  // The type of relationship
  type: SocialRelationType;

  // Value for compatibility with original design (same as relationshipRank)
  value: number; // -100 to +100

  // Numerical ranking of relationship strength (0-100)
  relationshipRank: number;

  // How compatible the creatures are (-100 to 100)
  compatibility: number;

  // Detailed relationship variables (trust, fear, etc.)
  variables: IRelationshipVariable[];

  // Specific reasons for opinion changes
  opinionModifiers: IOpinionModifier[];

  // When the creatures last interacted
  lastInteraction: Date;

  // How many times they've interacted
  interactionCount: number;

  // For family relationships
  familyDetails?: {
    isBloodRelated: boolean;
    generationDifference: number; // Positive = older generation, negative = younger
    relationshipDescription?: string; // e.g., "eldest son", "maternal grandfather"
  };

  // Methods
  getVariableValue(type: RelationshipVariable): number;
  setVariableValue(type: RelationshipVariable, value: number): void;
  interact(quality: number): void;
  addOpinionModifier(reason: string, value: number, expiryDays?: number): void;
  isFamilyRelationship(): boolean;
}

/**
 * Manager for handling all relationship operations for a creature
 */
export interface IRelationshipManager {
  // Get all relationships
  getAllRelationships(): ISocialRelation[];

  // Get a specific relationship by target ID
  getRelationship(targetId: string): ISocialRelation | undefined;

  // Create or update a relationship
  setRelationship(params: {
    targetId: string;
    type: SocialRelationType;
    value?: number;
    compatibility?: number;
    familyDetails?: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    };
  }): ISocialRelation;

  // Handle interaction between creatures
  processInteraction(targetId: string, quality: number, reason?: string): void;

  // Process death of a related creature
  processRelatedCreatureDeath(targetId: string): void;

  // Calculate compatibility between this creature and another
  calculateCompatibility(targetCreature: ICreature): number;
}
