// src/models/RelationshipManager.ts
// Final implementation of the RelationshipManager class

import { v4 as uuidv4 } from "uuid";
import {
  IRelationshipManager,
  ISocialRelation,
  SocialRelationType,
  RelationshipVariable,
} from "@/types/social-relation";
import { ICreature, IThought } from "@/types/creature";
import { SocialRelation } from "./social-relation";

/**
 * Manager for handling all relationship operations for a creature
 */
export class RelationshipManager implements IRelationshipManager {
  private creature: ICreature;

  constructor(creature: ICreature) {
    this.creature = creature;
  }

  /**
   * Get all relationships
   */
  getAllRelationships(): ISocialRelation[] {
    return this.creature.socialRelations;
  }

  /**
   * Get a specific relationship by target ID
   */
  getRelationship(targetId: string): ISocialRelation | undefined {
    return this.creature.socialRelations.find(
      (rel) => rel.targetId === targetId
    );
  }

  /**
   * Create or update a relationship
   */
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
  }): ISocialRelation {
    // Check if relationship already exists
    const existingRelIndex = this.creature.socialRelations.findIndex(
      (rel) => rel.targetId === params.targetId
    );

    // If relationship exists, update it
    if (existingRelIndex >= 0) {
      const existingRel = this.creature.socialRelations[existingRelIndex];

      // Don't change type if it's already a family relationship and we're trying to set a non-family type
      const isFamilyRel = (
        existingRel as SocialRelation
      ).isFamilyRelationship();
      const newIsFamily = this.isFamilyRelationType(params.type);

      const newType =
        isFamilyRel && !newIsFamily ? existingRel.type : params.type;

      // Update the relationship
      const updatedRelation = {
        ...existingRel,
        type: newType,
        value: params.value !== undefined ? params.value : existingRel.value,
        relationshipRank:
          params.value !== undefined
            ? params.value
            : existingRel.relationshipRank,
        compatibility:
          params.compatibility !== undefined
            ? params.compatibility
            : existingRel.compatibility,
        familyDetails: params.familyDetails || existingRel.familyDetails,
      };

      this.creature.socialRelations[existingRelIndex] = updatedRelation;
      return updatedRelation;
    }
    // Otherwise, create a new relationship
    else {
      const newRelationship = new SocialRelation({
        ...params,
        value: params.value !== undefined ? params.value : 0, // Default value if not provided
      });
      this.creature.socialRelations.push(newRelationship);
      return newRelationship;
    }
  }

  /**
   * Handle interaction between creatures
   * @param targetId - ID of the creature being interacted with
   * @param quality - Positive or negative value indicating interaction quality
   * @param reason - Optional reason for the interaction
   */
  processInteraction(targetId: string, quality: number, reason?: string): void {
    let relationship = this.getRelationship(targetId);

    // If no relationship exists, create one
    if (!relationship) {
      // Calculate compatibility (in a real system, this would compare traits, interests, etc.)
      const compatibility = Math.floor(Math.random() * 201) - 100; // -100 to 100
      relationship = this.setRelationship({
        targetId,
        type:
          compatibility >= 0
            ? SocialRelationType.PASSING_ACQUAINTANCE
            : SocialRelationType.GRUDGE,
        compatibility,
        value: quality > 0 ? quality : quality / 2, // Initialize value based on quality
      });
    }

    // Update the relationship
    relationship.interact(quality);

    // Add an opinion modifier if a reason is provided
    if (reason) {
      relationship.addOpinionModifier(reason, quality, 30); // Expires in 30 days
    }

    // Apply effects based on the interaction
    this.applyInteractionEffects(relationship, quality);
  }

  /**
   * Calculate compatibility between this creature and another
   * @param targetCreature - The creature to calculate compatibility with
   * @returns A compatibility score (-100 to 100)
   */
  calculateCompatibility(targetCreature: ICreature): number {
    let score = 0;

    // Compare traits
    for (const trait of this.creature.traits) {
      // Find matching trait in target
      const matchingTrait = targetCreature.traits.find(
        (t) => t.id === trait.id
      );

      // If traits match, increase compatibility
      if (matchingTrait) {
        score += 10;
      }

      // Check for conflicting traits
      for (const conflictId of trait.conflictingTraits) {
        if (targetCreature.traits.some((t) => t.id === conflictId)) {
          score -= 15; // Conflicting traits reduce compatibility more
        }
      }
    }

    // Compare skills (similar skill levels increase compatibility)
    for (const skill of this.creature.skills) {
      const targetSkill = targetCreature.skills.find((s) => s.id === skill.id);
      if (targetSkill) {
        // Similar skill levels increase compatibility
        const levelDiff = Math.abs(skill.level - targetSkill.level);
        if (levelDiff < 3) {
          score += 5;
        }

        // Shared passion increases compatibility significantly
        if (skill.passion === targetSkill.passion && skill.passion !== "NONE") {
          score += 15;
        }
      }
    }

    // Limit score to -100 to 100
    return Math.max(-100, Math.min(100, score));
  }

  /**
   * Process death of a related creature
   * @param targetId - ID of the creature that died
   */
  processRelatedCreatureDeath(targetId: string): void {
    const relationship = this.getRelationship(targetId);
    if (!relationship) return;

    let moodEffect = 0;
    let thoughtName = "";

    // Different relationship types have different effects
    switch (relationship.type) {
      case SocialRelationType.SPOUSE:
      case SocialRelationType.FAMILY:
        moodEffect = -40;
        thoughtName = "Spouse died";
        break;
      case SocialRelationType.LOVER:
        moodEffect = -30;
        thoughtName = "Lover died";
        break;
      case SocialRelationType.CHILD:
        moodEffect = -40;
        thoughtName = "Child died";
        break;
      case SocialRelationType.PARENT:
        moodEffect = -30;
        thoughtName = "Parent died";
        break;
      case SocialRelationType.SIBLING:
        moodEffect = -25;
        thoughtName = "Sibling died";
        break;
      case SocialRelationType.PET:
        moodEffect = -20;
        thoughtName = "Pet died";
        break;
      case SocialRelationType.CLOSE_FRIEND:
      case SocialRelationType.KINDRED_SPIRIT:
        moodEffect = -20;
        thoughtName = "Close friend died";
        break;
      case SocialRelationType.FRIEND:
        moodEffect = -15;
        thoughtName = "Friend died";
        break;
      case SocialRelationType.GRUDGE:
      case SocialRelationType.ENEMY:
      case SocialRelationType.RIVAL:
        moodEffect = -5; // Still negative for psychological realism
        thoughtName = "Someone I disliked died";
        break;
      default:
        moodEffect = -5;
        thoughtName = "Acquaintance died";
    }

    // Create a long-lasting thought about the death
    this.creature.applyThought({
      id: `death_of_${relationship.type.toLowerCase()}_${targetId}`,
      name: thoughtName,
      moodEffect: moodEffect,
      duration: 10000, // Very long duration
      remainingTime: 10000,
      stackCount: 1,
      stackLimit: 1,
    });
  }

  /**
   * Apply effects based on an interaction with another creature
   * @param relationship - The relationship being affected
   * @param quality - The quality of the interaction
   */
  private applyInteractionEffects(
    relationship: ISocialRelation,
    quality: number
  ): void {
    // Create a thought based on relationship type and interaction quality
    let thought: IThought | null = null;

    // For positive interactions
    if (quality > 0) {
      switch (relationship.type) {
        case SocialRelationType.FRIEND:
        case SocialRelationType.CLOSE_FRIEND:
        case SocialRelationType.KINDRED_SPIRIT:
          thought = {
            id: `pleasant_conversation_${relationship.targetId}_${Date.now()}`,
            name: `Had a nice chat with ${
              relationship.type === SocialRelationType.CLOSE_FRIEND
                ? "a close friend"
                : relationship.type === SocialRelationType.KINDRED_SPIRIT
                ? "a kindred spirit"
                : "a friend"
            }`,
            moodEffect:
              5 *
              (relationship.type === SocialRelationType.CLOSE_FRIEND
                ? 1.5
                : relationship.type === SocialRelationType.KINDRED_SPIRIT
                ? 2
                : 1),
            duration: 1000,
            remainingTime: 1000,
            stackCount: 1,
            stackLimit: 3,
          };
          break;
        case SocialRelationType.SPOUSE:
        case SocialRelationType.LOVER:
        case SocialRelationType.FAMILY:
          thought = {
            id: `time_with_loved_one_${relationship.targetId}_${Date.now()}`,
            name: `Spent time with ${
              relationship.type === SocialRelationType.SPOUSE ||
              relationship.type === SocialRelationType.FAMILY
                ? "spouse"
                : "lover"
            }`,
            moodEffect: 8,
            duration: 1500,
            remainingTime: 1500,
            stackCount: 1,
            stackLimit: 2,
          };
          break;
        // Add other positive interaction cases as needed
      }
    }
    // For negative interactions
    else if (quality < 0) {
      switch (relationship.type) {
        case SocialRelationType.GRUDGE:
        case SocialRelationType.ENEMY:
        case SocialRelationType.RIVAL:
          thought = {
            id: `unpleasant_encounter_${relationship.targetId}_${Date.now()}`,
            name: `Had to deal with ${
              relationship.type === SocialRelationType.ENEMY
                ? "an enemy"
                : "someone I dislike"
            }`,
            moodEffect:
              -5 * (relationship.type === SocialRelationType.ENEMY ? 1.5 : 1),
            duration: 1000,
            remainingTime: 1000,
            stackCount: 1,
            stackLimit: 3,
          };
          break;
        case SocialRelationType.FRIEND:
        case SocialRelationType.CLOSE_FRIEND:
          thought = {
            id: `argument_with_friend_${relationship.targetId}_${Date.now()}`,
            name: `Argued with ${
              relationship.type === SocialRelationType.CLOSE_FRIEND
                ? "a close friend"
                : "a friend"
            }`,
            moodEffect:
              -7 *
              (relationship.type === SocialRelationType.CLOSE_FRIEND ? 1.5 : 1),
            duration: 1500,
            remainingTime: 1500,
            stackCount: 1,
            stackLimit: 2,
          };
          break;
        // Add other negative interaction cases as needed
      }
    }

    // Apply the thought if one was created
    if (thought) {
      this.creature.applyThought(thought);
    }
  }

  /**
   * Check if a relationship type is a family type
   * @param type - The relationship type to check
   * @returns true if it's a family relationship type
   */
  private isFamilyRelationType(type: SocialRelationType): boolean {
    return [
      SocialRelationType.SPOUSE,
      SocialRelationType.LOVER,
      SocialRelationType.PARENT,
      SocialRelationType.CHILD,
      SocialRelationType.SIBLING,
      SocialRelationType.GRANDPARENT,
      SocialRelationType.GRANDCHILD,
      SocialRelationType.AUNT_UNCLE,
      SocialRelationType.NIECE_NEPHEW,
      SocialRelationType.COUSIN,
      SocialRelationType.FAMILY,
    ].includes(type);
  }
}
