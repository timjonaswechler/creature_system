// src/models/SocialRelation.ts
// Final implementation of the SocialRelation class

import {
  ISocialRelation,
  IRelationshipVariable,
  IOpinionModifier,
  SocialRelationType,
  RelationshipVariable,
} from "../interfaces/ISocialRelation";

/**
 * Implements a social relationship between two creatures
 */
export class SocialRelation implements ISocialRelation {
  targetId: string;
  type: SocialRelationType;
  value: number;
  relationshipRank: number;
  compatibility: number;
  variables: IRelationshipVariable[];
  opinionModifiers: IOpinionModifier[];
  lastInteraction: Date;
  interactionCount: number;
  familyDetails?: {
    isBloodRelated: boolean;
    generationDifference: number;
    relationshipDescription?: string;
  };

  constructor(params: {
    targetId: string;
    type: SocialRelationType;
    value?: number;
    compatibility?: number;
    familyDetails?: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    };
  }) {
    this.targetId = params.targetId;
    this.type = params.type;
    this.relationshipRank = params.value !== undefined ? params.value : 0;
    this.value = this.relationshipRank; // Maintain compatibility with old system
    this.compatibility =
      params.compatibility !== undefined ? params.compatibility : 0;
    this.variables = [
      { type: RelationshipVariable.LOYALTY, value: 0 },
      { type: RelationshipVariable.TRUST, value: 0 },
      { type: RelationshipVariable.FEAR, value: 0 },
      { type: RelationshipVariable.LOVE, value: 0 },
      { type: RelationshipVariable.RESPECT, value: 0 },
    ];
    this.opinionModifiers = [];
    this.lastInteraction = new Date();
    this.interactionCount = 0;
    this.familyDetails = params.familyDetails;
  }

  /**
   * Update relationship after an interaction
   * @param quality - Positive or negative value indicating interaction quality
   */
  interact(quality: number): void {
    this.interactionCount++;
    this.lastInteraction = new Date();

    // Adjust relationship rank based on interaction quality and compatibility
    const rankChange = quality * (this.compatibility > 0 ? 1.5 : 0.5);
    this.relationshipRank = Math.max(
      0,
      Math.min(100, this.relationshipRank + rankChange)
    );

    // Ensure value is synchronized with relationshipRank for compatibility
    this.value = this.relationshipRank;

    // Update the type based on relationship rank and compatibility
    this.updateRelationshipType();
  }

  /**
   * Add an opinion modifier that affects relationship variables
   * @param reason - Description of the modifier
   * @param value - Positive or negative value
   * @param expiryDays - Optional number of days until modifier expires
   */
  addOpinionModifier(reason: string, value: number, expiryDays?: number): void {
    const modifier: IOpinionModifier = {
      reason,
      value,
    };

    if (expiryDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      modifier.expiryDate = expiryDate;
    }

    this.opinionModifiers.push(modifier);

    // Update overall relationship variables based on the new modifier
    this.updateVariablesFromModifiers();
  }

  /**
   * Get the value of a specific relationship variable
   * @param type - The type of variable to retrieve
   * @returns The variable value (-100 to 100)
   */
  getVariableValue(type: RelationshipVariable): number {
    const variable = this.variables.find((v) => v.type === type);
    return variable ? variable.value : 0;
  }

  /**
   * Set the value of a specific relationship variable
   * @param type - The type of variable to set
   * @param value - The new value (-100 to 100)
   */
  setVariableValue(type: RelationshipVariable, value: number): void {
    const variable = this.variables.find((v) => v.type === type);
    if (variable) {
      variable.value = Math.max(-100, Math.min(100, value));
    } else {
      this.variables.push({
        type,
        value: Math.max(-100, Math.min(100, value)),
      });
    }
  }

  /**
   * Check if this is a family relationship
   * @returns true if the relationship is a family type
   */
  isFamilyRelationship(): boolean {
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
      SocialRelationType.FAMILY, // Include legacy type
    ].includes(this.type);
  }

  /**
   * Update relationship type based on rank and compatibility
   * This determines progression from acquaintance to friend/enemy
   */
  private updateRelationshipType(): void {
    // Skip if it's a family relationship
    if (this.isFamilyRelationship()) {
      return;
    }

    // Skip if it's a deity or professional relationship
    if (
      [
        SocialRelationType.DEITY,
        SocialRelationType.WORSHIPPER,
        SocialRelationType.MASTER,
        SocialRelationType.APPRENTICE,
        SocialRelationType.FORMER_MASTER,
        SocialRelationType.FORMER_APPRENTICE,
      ].includes(this.type)
    ) {
      return;
    }

    // For positive compatibility
    if (this.compatibility >= 0) {
      if (this.relationshipRank < 5) {
        this.type = SocialRelationType.PASSING_ACQUAINTANCE;
      } else if (this.relationshipRank < 15) {
        this.type = SocialRelationType.LONG_TERM_ACQUAINTANCE;
      } else if (this.relationshipRank < 30) {
        this.type = SocialRelationType.FRIENDLY_TERMS;
      } else if (this.relationshipRank < 50) {
        this.type = SocialRelationType.FRIEND;
      } else if (this.relationshipRank < 70) {
        this.type = SocialRelationType.CLOSE_FRIEND;
      } else if (this.relationshipRank < 90) {
        this.type = SocialRelationType.KINDRED_SPIRIT;
      } else {
        // Only set to LOVER if appropriate (would need to check orientation, etc. in real implementation)
        this.type = SocialRelationType.KINDRED_SPIRIT;
      }
    }
    // For negative compatibility
    else {
      if (this.relationshipRank > 15) {
        this.type = SocialRelationType.GRUDGE;
      } else if (this.relationshipRank > 50) {
        this.type = SocialRelationType.ENEMY;
      }
    }
  }

  /**
   * Update relationship variables based on all opinion modifiers
   */
  private updateVariablesFromModifiers(): void {
    // Clear expired modifiers
    const now = new Date();
    this.opinionModifiers = this.opinionModifiers.filter(
      (mod) => !mod.expiryDate || mod.expiryDate > now
    );

    // Calculate base values from modifiers
    let loyaltySum = 0;
    let trustSum = 0;
    let fearSum = 0;
    let loveSum = 0;
    let respectSum = 0;

    for (const mod of this.opinionModifiers) {
      // Different modifiers affect different variables
      // This is simplified; in a real system, each modifier would specify which variables it affects
      if (mod.reason.includes("loyal") || mod.reason.includes("betrayal")) {
        loyaltySum += mod.value;
      }
      if (
        mod.reason.includes("trust") ||
        mod.reason.includes("honest") ||
        mod.reason.includes("lie")
      ) {
        trustSum += mod.value;
      }
      if (
        mod.reason.includes("intimidate") ||
        mod.reason.includes("threaten") ||
        mod.reason.includes("power")
      ) {
        fearSum += mod.value;
      }
      if (
        mod.reason.includes("love") ||
        mod.reason.includes("affection") ||
        mod.reason.includes("kind")
      ) {
        loveSum += mod.value;
      }
      if (mod.reason.includes("respect") || mod.reason.includes("admire")) {
        respectSum += mod.value;
      }
    }

    // Update variables
    this.setVariableValue(RelationshipVariable.LOYALTY, loyaltySum);
    this.setVariableValue(RelationshipVariable.TRUST, trustSum);
    this.setVariableValue(RelationshipVariable.FEAR, fearSum);
    this.setVariableValue(RelationshipVariable.LOVE, loveSum);
    this.setVariableValue(RelationshipVariable.RESPECT, respectSum);
  }
  /**
   * Customize JSON serialization
   * This method is called by JSON.stringify to determine what should be serialized
   */
  toJSON() {
    return {
      targetId: this.targetId,
      type: this.type,
      value: this.value,
      relationshipRank: this.relationshipRank,
      compatibility: this.compatibility,
      lastInteraction: this.lastInteraction.toISOString(),
      interactionCount: this.interactionCount,
      variables: this.variables,
      opinionModifiers: this.opinionModifiers.map((mod) => ({
        reason: mod.reason,
        value: mod.value,
        expiryDate: mod.expiryDate ? mod.expiryDate.toISOString() : undefined,
      })),
      familyDetails: this.familyDetails,
    };
  }

  /**
   * Recreate a SocialRelation from serialized data
   * @param data The serialized data
   */
  static fromJSON(data: any): SocialRelation {
    const relation = new SocialRelation({
      targetId: data.targetId,
      type: data.type,
      value: data.value,
      compatibility: data.compatibility,
      familyDetails: data.familyDetails,
    });

    // Restore additional properties
    relation.relationshipRank = data.relationshipRank;
    relation.interactionCount = data.interactionCount;
    relation.lastInteraction = new Date(data.lastInteraction);

    // Restore variables
    relation.variables = data.variables || [];

    // Restore opinion modifiers with proper Date objects
    relation.opinionModifiers = (data.opinionModifiers || []).map(
      (mod: any) => ({
        reason: mod.reason,
        value: mod.value,
        expiryDate: mod.expiryDate ? new Date(mod.expiryDate) : undefined,
      })
    );

    return relation;
  }
}
