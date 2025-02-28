// src/lib/serialization.ts
// Helper functions for serializing and deserializing complex objects

import { SocialRelation } from "@/lib/models/social-relation";
import {
  SocialRelationType,
  RelationshipVariable,
} from "@/types/social-relation";

/**
 * Custom replacer function for JSON.stringify to handle circular references
 * and non-serializable properties like methods.
 */
export function creatureReplacer(key: string, value: any) {
  // Skip the relationshipManager property entirely since it's created at runtime
  if (key === "relationshipManager") {
    return undefined;
  }

  // For dates, convert to ISO string
  if (value instanceof Date) {
    return {
      __type: "Date",
      value: value.toISOString(),
    };
  }

  // Don't try to serialize functions
  if (typeof value === "function") {
    return undefined;
  }

  return value;
}

/**
 * Creates a serializable version of the social relation object
 * by removing methods and handling complex properties
 */
export function serializeSocialRelation(relation: SocialRelation) {
  // Create a plain object copy without methods
  const serializable = {
    targetId: relation.targetId,
    type: relation.type,
    value: relation.value,
    relationshipRank: relation.relationshipRank,
    compatibility: relation.compatibility,
    // Convert Date object to ISO string
    lastInteraction: relation.lastInteraction.toISOString(),
    interactionCount: relation.interactionCount,
    // Clone arrays to avoid circular references
    variables: [...relation.variables],
    opinionModifiers: relation.opinionModifiers.map((mod) => ({
      ...mod,
      expiryDate: mod.expiryDate ? mod.expiryDate.toISOString() : undefined,
    })),
    // Copy familyDetails if it exists
    familyDetails: relation.familyDetails
      ? { ...relation.familyDetails }
      : undefined,
  };

  return serializable;
}

/**
 * Recreates a SocialRelation object from serialized data
 */
export function deserializeSocialRelation(data: any): SocialRelation {
  // Create basic relationship
  const relation = new SocialRelation({
    targetId: data.targetId,
    type: data.type as SocialRelationType,
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
  relation.opinionModifiers = (data.opinionModifiers || []).map((mod: any) => ({
    reason: mod.reason,
    value: mod.value,
    expiryDate: mod.expiryDate ? new Date(mod.expiryDate) : undefined,
  }));

  return relation;
}
