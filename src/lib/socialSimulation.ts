// src/lib/socialSimulation.ts
// Integration Example and Usage Guide

// 1. Setting up initial relationships when creating a creature
import { v4 as uuidv4 } from "uuid";
import { Creature } from "@/models/Creature";
import { SocialRelationType } from "@/interfaces/ISocialRelation";
import { createBasicHumanoidBody } from "@/examples/bodyExamples";
import { ICreature } from "@/interfaces/ICreature";
import { RelationshipVariable } from "@/interfaces/ISocialRelation";

// Creating a family unit example
export function createFamilyUnit() {
  // Create parent creatures
  const father = new Creature({
    id: uuidv4(),
    name: "Father Creature",
    birthdate: new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000), // 30 years ago
    genome: { id: uuidv4(), chromosomes: [] },
    body: createBasicHumanoidBody(),
    memory: { events: [] },
  });

  const mother = new Creature({
    id: uuidv4(),
    name: "Mother Creature",
    birthdate: new Date(Date.now() - 28 * 365 * 24 * 60 * 60 * 1000), // 28 years ago
    genome: { id: uuidv4(), chromosomes: [] },
    body: createBasicHumanoidBody(),
    memory: { events: [] },
  });

  // Create child
  const child = new Creature({
    id: uuidv4(),
    name: "Child Creature",
    birthdate: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), // 5 years ago
    genome: { id: uuidv4(), chromosomes: [] },
    body: createBasicHumanoidBody(),
    memory: { events: [] },
  });

  // Establish relationships

  // Father-Mother relationship (SPOUSE)
  father.formFamilialRelationship(mother.id, SocialRelationType.SPOUSE, {
    isBloodRelated: false,
    generationDifference: 0,
  });

  mother.formFamilialRelationship(father.id, SocialRelationType.SPOUSE, {
    isBloodRelated: false,
    generationDifference: 0,
  });

  // Parent-Child relationships
  father.formFamilialRelationship(child.id, SocialRelationType.CHILD, {
    isBloodRelated: true,
    generationDifference: -1,
    relationshipDescription: "Eldest Son",
  });

  mother.formFamilialRelationship(child.id, SocialRelationType.CHILD, {
    isBloodRelated: true,
    generationDifference: -1,
    relationshipDescription: "Eldest Son",
  });

  child.formFamilialRelationship(father.id, SocialRelationType.PARENT, {
    isBloodRelated: true,
    generationDifference: 1,
    relationshipDescription: "Father",
  });

  child.formFamilialRelationship(mother.id, SocialRelationType.PARENT, {
    isBloodRelated: true,
    generationDifference: 1,
    relationshipDescription: "Mother",
  });

  return { father, mother, child };
}

// 2. Example of simulating social interactions between creatures
export function simulateSocialInteraction(
  creature1: ICreature,
  creature2: ICreature,
  scenario: string
) {
  // Different scenarios have different outcomes
  switch (scenario) {
    case "friendly_chat":
      // Positive interaction
      const chatQuality = Math.floor(Math.random() * 5) + 3; // 3-8 (moderately positive)
      creature1.processInteraction(
        creature2.id,
        chatQuality,
        "Had a pleasant conversation"
      );
      creature2.processInteraction(
        creature1.id,
        chatQuality,
        "Had a pleasant conversation"
      );
      break;

    case "argument":
      // Negative interaction
      const argumentQuality = -(Math.floor(Math.random() * 5) + 3); // -3 to -8 (moderately negative)
      creature1.processInteraction(
        creature2.id,
        argumentQuality,
        "Got into an argument"
      );
      creature2.processInteraction(
        creature1.id,
        argumentQuality,
        "Got into an argument"
      );
      break;

    case "compliment":
      // Very positive interaction
      const complimentQuality = Math.floor(Math.random() * 5) + 8; // 8-13 (very positive)
      creature1.processInteraction(
        creature2.id,
        complimentQuality,
        "Gave a heartfelt compliment"
      );
      creature2.processInteraction(
        creature1.id,
        complimentQuality,
        "Received a heartfelt compliment"
      );
      break;

    case "insult":
      // Very negative interaction
      const insultQuality = -(Math.floor(Math.random() * 5) + 8); // -8 to -13 (very negative)
      creature1.processInteraction(
        creature2.id,
        insultQuality,
        "Hurled an insult"
      );
      creature2.processInteraction(creature1.id, insultQuality, "Was insulted");
      break;

    case "deep_conversation":
      // Builds trust and respect
      const deepConvoQuality = Math.floor(Math.random() * 5) + 5; // 5-10
      creature1.processInteraction(
        creature2.id,
        deepConvoQuality,
        "Had a deep and meaningful conversation"
      );
      creature2.processInteraction(
        creature1.id,
        deepConvoQuality,
        "Had a deep and meaningful conversation"
      );

      // Also affect the trust and respect variables directly
      const relationship1 = creature1.getRelationship(creature2.id);
      const relationship2 = creature2.getRelationship(creature1.id);

      if (relationship1) {
        relationship1.setVariableValue(
          RelationshipVariable.TRUST,
          relationship1.getVariableValue(RelationshipVariable.TRUST) + 10
        );
        relationship1.setVariableValue(
          RelationshipVariable.RESPECT,
          relationship1.getVariableValue(RelationshipVariable.RESPECT) + 8
        );
      }

      if (relationship2) {
        relationship2.setVariableValue(
          RelationshipVariable.TRUST,
          relationship2.getVariableValue(RelationshipVariable.TRUST) + 10
        );
        relationship2.setVariableValue(
          RelationshipVariable.RESPECT,
          relationship2.getVariableValue(RelationshipVariable.RESPECT) + 8
        );
      }
      break;
  }
}

// 3. Example of handling death and its effects on relationships
export function simulateDeath(deadCreature: ICreature, observers: ICreature[]) {
  // Notify all related creatures about the death
  for (const observer of observers) {
    observer.handleDeathNotification(deadCreature.id);
  }

  // The thoughts system will automatically create appropriate thoughts
  // based on the relationship type, as implemented in processRelatedCreatureDeath()
}

// 4. Example of simulating daily interactions in a settlement
export function simulateDailyInteractions(creatures: ICreature[]) {
  // Each creature has a chance to interact with others
  for (const creature of creatures) {
    // Number of interactions varies by creature personality
    const numInteractions = Math.floor(Math.random() * 3) + 1; // 1-3 interactions per day

    for (let i = 0; i < numInteractions; i++) {
      // Pick a random creature to interact with
      const otherCreatures = creatures.filter((c) => c.id !== creature.id);
      if (otherCreatures.length === 0) continue;

      const targetIndex = Math.floor(Math.random() * otherCreatures.length);
      const target = otherCreatures[targetIndex];

      // Determine interaction type based on existing relationship
      const relationship = creature.getRelationship(target.id);

      if (relationship) {
        let scenarios: string[];

        // Choose scenarios based on relationship type
        if (
          [
            SocialRelationType.FRIEND,
            SocialRelationType.CLOSE_FRIEND,
            SocialRelationType.KINDRED_SPIRIT,
            SocialRelationType.SPOUSE,
            SocialRelationType.LOVER,
          ].includes(relationship.type)
        ) {
          // Positive relationships have more positive interactions
          scenarios = ["friendly_chat", "compliment", "deep_conversation"];
          // Small chance of negative interaction
          if (Math.random() < 0.1) scenarios.push("argument");
        } else if (
          [SocialRelationType.GRUDGE, SocialRelationType.ENEMY].includes(
            relationship.type
          )
        ) {
          // Negative relationships have more negative interactions
          scenarios = ["argument", "insult"];
          // Small chance of improvement
          if (Math.random() < 0.05) scenarios.push("deep_conversation");
        } else {
          // Neutral relationships have mixed interactions
          scenarios = ["friendly_chat", "argument", "deep_conversation"];
        }

        // Pick a random scenario and simulate it
        const scenario =
          scenarios[Math.floor(Math.random() * scenarios.length)];
        simulateSocialInteraction(creature, target, scenario);
      } else {
        // No existing relationship, start with basic interactions
        const scenarios = ["friendly_chat", "deep_conversation"];
        const scenario =
          scenarios[Math.floor(Math.random() * scenarios.length)];
        simulateSocialInteraction(creature, target, scenario);
      }
    }
  }

  // After daily interactions, update relationship decay
  for (const creature of creatures) {
    // In a real implementation, relationships would decay over time if not maintained
    // This could be implemented in the RelationshipManager class
  }
}

// 5. Using relationship data for intelligent decision making
export function chooseSocialTarget(
  creature: ICreature,
  availableCreatures: ICreature[]
): ICreature | null {
  // Filter out the creature itself
  const others = availableCreatures.filter((c) => c.id !== creature.id);
  if (others.length === 0) return null;

  // Get all social relations
  const relationships = creature.getAllRelationships();

  // Calculate social desire for each potential target
  const targets = others.map((target) => {
    const relationship = creature.getRelationship(target.id);
    let desire = 0;

    if (relationship) {
      // Base desire on relationship type
      switch (relationship.type) {
        case SocialRelationType.SPOUSE:
        case SocialRelationType.LOVER:
          desire += 20;
          break;
        case SocialRelationType.CHILD:
        case SocialRelationType.PARENT:
          desire += 15;
          break;
        case SocialRelationType.FRIEND:
          desire += 10;
          break;
        case SocialRelationType.CLOSE_FRIEND:
        case SocialRelationType.KINDRED_SPIRIT:
          desire += 18;
          break;
        case SocialRelationType.GRUDGE:
          desire -= 10;
          break;
        case SocialRelationType.ENEMY:
          desire -= 20;
          break;
        default:
          desire += 5; // Small base value for all other relationships
      }

      // Adjust based on time since last interaction
      const daysSinceLastInteraction = Math.floor(
        (Date.now() - new Date(relationship.lastInteraction).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // More desire to interact if it's been a while
      desire += Math.min(daysSinceLastInteraction, 7);

      // Personality-based adjustment would go here in a real implementation
    } else {
      // No existing relationship - small chance to form new ones
      desire += 3;
    }

    return { target, desire };
  });

  // Sort by desire in descending order
  targets.sort((a, b) => b.desire - a.desire);

  // Return the creature with the highest social desire, if positive
  if (targets.length > 0 && targets[0].desire > 0) {
    return targets[0].target;
  }

  return null; // No suitable target
}
