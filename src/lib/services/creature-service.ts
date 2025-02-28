// src/lib/services/creature-service.ts
import { v4 as uuidv4 } from "uuid";
import { ICreature } from "@/types/creature";
import { SocialRelationType } from "@/types/social-relation";
import { CreatureFactory } from "@/lib/factories/creature-factory";
import {
  creatureReplacer,
  deserializeSocialRelation,
} from "@/lib/serialization";
import { SocialRelation } from "@/lib/models/social-relation";

export const STORAGE_KEY = "creatures";

/**
 * Service for managing creature persistence and operations
 */
export class CreatureService {
  /**
   * Save a creature to localStorage
   */
  static saveCreature(creature: ICreature): void {
    // Get current creatures
    const storedCreatures = this.getCreatures();

    // Add/update creature
    const updatedCreatures = {
      ...storedCreatures,
      [creature.id]: creature,
    };

    // Save back to localStorage with custom replacer
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCreatures, creatureReplacer)
    );
  }

  /**
   * Get all creatures from localStorage
   */
  static getCreatures(): Record<string, ICreature> {
    const storedCreatures = localStorage.getItem(STORAGE_KEY);
    if (!storedCreatures) return {};

    // Parse stored creatures
    const parsedCreatures = JSON.parse(storedCreatures);

    // Process creatures to ensure proper object types
    this.processStoredCreatures(parsedCreatures);

    return parsedCreatures;
  }

  /**
   * Get a creature by ID
   */
  static getCreatureById(id: string): ICreature | null {
    const creatures = this.getCreatures();
    return creatures[id] || null;
  }

  /**
   * Delete a creature by ID
   */
  static deleteCreature(id: string): void {
    const creatures = this.getCreatures();
    if (creatures[id]) {
      delete creatures[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creatures));
    }
  }

  /**
   * Delete all creatures
   */
  static deleteAllCreatures(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Create a new basic creature
   */
  static createCreature(name: string): ICreature {
    const creature = CreatureFactory.createBasicCreature(name);
    this.saveCreature(creature);
    return creature;
  }

  /**
   * Create a family unit
   */
  static createFamily(): {
    father: ICreature;
    mother: ICreature;
    child: ICreature;
  } {
    const family = CreatureFactory.createFamilyUnit();

    // Save all family members
    this.saveCreature(family.father);
    this.saveCreature(family.mother);
    this.saveCreature(family.child);

    return family;
  }

  /**
   * Create a warrior group
   */
  static createWarriorGroup(
    leaderLevel: number = 10,
    followerCount: number = 4
  ): { leader: ICreature; followers: ICreature[] } {
    const group = CreatureFactory.createWarriorGroup(
      leaderLevel,
      followerCount
    );

    // Save all members
    this.saveCreature(group.leader);
    group.followers.forEach((follower) => this.saveCreature(follower));

    return group;
  }

  /**
   * Create a romantic couple
   */
  static createRomanticCouple(): { lover1: ICreature; lover2: ICreature } {
    const couple = CreatureFactory.createRomanticCouple();

    // Save both creatures
    this.saveCreature(couple.lover1);
    this.saveCreature(couple.lover2);

    return couple;
  }

  /**
   * Create a scholar group with a master and apprentices
   */
  static createScholarGroup(
    masterLevel: number = 10,
    apprenticeCount: number = 4
  ): { master: ICreature; apprentices: ICreature[] } {
    // Create master scholar
    const master = CreatureFactory.createScholar(
      "Meister Gelehrter",
      masterLevel
    );

    // Create apprentices
    const apprentices: ICreature[] = [];
    for (let i = 0; i < apprenticeCount; i++) {
      const level = Math.max(
        1,
        masterLevel - 3 - Math.floor(Math.random() * 3)
      );
      const title = i < apprenticeCount / 2 ? "Gelehrter" : "Schüler";
      const apprentice = CreatureFactory.createScholar(
        `${title} ${i + 1}`,
        level
      );

      // Create relationships
      this.addSocialRelation(apprentice, master.id, SocialRelationType.MASTER, {
        isBloodRelated: false,
        generationDifference: 1,
      });

      this.addSocialRelation(
        master,
        apprentice.id,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: -1,
        }
      );

      // Apprentices know each other
      apprentices.forEach((otherApprentice) => {
        if (apprentice.id !== otherApprentice.id) {
          this.addSocialRelation(
            apprentice,
            otherApprentice.id,
            SocialRelationType.COMPANION,
            {
              isBloodRelated: false,
              generationDifference: 0,
            }
          );
        }
      });

      apprentices.push(apprentice);
    }

    // Save all creatures
    this.saveCreature(master);
    apprentices.forEach((apprentice) => this.saveCreature(apprentice));

    return { master, apprentices };
  }

  /**
   * Create a craftsmen group with a master and apprentices
   */
  static createCraftsmenGroup(
    masterLevel: number = 10,
    apprenticeCount: number = 4
  ): { master: ICreature; apprentices: ICreature[] } {
    // Create master craftsman
    const master = CreatureFactory.createCraftsman(
      "Meister Handwerker",
      masterLevel
    );

    // Create apprentices
    const apprentices: ICreature[] = [];
    const crafts = ["Schmied", "Tischler", "Steinmetz", "Weber"];

    for (let i = 0; i < apprenticeCount; i++) {
      const level = Math.max(
        1,
        masterLevel - 3 - Math.floor(Math.random() * 3)
      );
      const title =
        i < apprenticeCount / 2 ? crafts[i % crafts.length] : "Lehrling";
      const apprentice = CreatureFactory.createCraftsman(
        `${title} ${i + 1}`,
        level
      );

      // Create relationships
      this.addSocialRelation(apprentice, master.id, SocialRelationType.MASTER, {
        isBloodRelated: false,
        generationDifference: 1,
      });

      this.addSocialRelation(
        master,
        apprentice.id,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: -1,
        }
      );

      // Apprentices know each other
      apprentices.forEach((otherApprentice) => {
        if (apprentice.id !== otherApprentice.id) {
          this.addSocialRelation(
            apprentice,
            otherApprentice.id,
            SocialRelationType.COMPANION,
            {
              isBloodRelated: false,
              generationDifference: 0,
            }
          );
        }
      });

      apprentices.push(apprentice);
    }

    // Save all creatures
    this.saveCreature(master);
    apprentices.forEach((apprentice) => this.saveCreature(apprentice));

    return { master, apprentices };
  }

  /**
   * Create magical beings (wizard, apprentice, familiar)
   */
  static createMagicalBeings(): {
    wizard: ICreature;
    apprentice: ICreature;
    familiar: ICreature;
  } {
    // Create the magical beings
    const wizard = CreatureFactory.createMagicalBeing("Zauberer", 10);
    const apprentice = CreatureFactory.createMagicalBeing("Lehrling", 5);
    const familiar = CreatureFactory.createMagicalBeing("Vertrauter", 3);

    // Create relationships
    this.addSocialRelation(apprentice, wizard.id, SocialRelationType.MASTER, {
      isBloodRelated: false,
      generationDifference: 1,
    });

    this.addSocialRelation(
      wizard,
      apprentice.id,
      SocialRelationType.APPRENTICE,
      {
        isBloodRelated: false,
        generationDifference: -1,
      }
    );

    this.addSocialRelation(
      familiar,
      wizard.id,
      SocialRelationType.BONDED_ANIMAL,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    this.addSocialRelation(wizard, familiar.id, SocialRelationType.OWNER, {
      isBloodRelated: false,
      generationDifference: 0,
    });

    // Save creatures
    this.saveCreature(wizard);
    this.saveCreature(apprentice);
    this.saveCreature(familiar);

    return { wizard, apprentice, familiar };
  }

  /**
   * Create nature beings (druid, ranger, animal companion)
   */
  static createNatureBeings(): {
    druid: ICreature;
    ranger: ICreature;
    animalCompanion: ICreature;
  } {
    // Create nature beings
    const druid = CreatureFactory.createNatureBeing("Druide", 10);
    const ranger = CreatureFactory.createNatureBeing("Waldläufer", 8);
    const animalCompanion = CreatureFactory.createNatureBeing(
      "Tiergefährte",
      5
    );

    // Create relationships
    this.addSocialRelation(
      ranger,
      druid.id,
      SocialRelationType.KINDRED_SPIRIT,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    this.addSocialRelation(
      druid,
      ranger.id,
      SocialRelationType.KINDRED_SPIRIT,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    this.addSocialRelation(
      animalCompanion,
      ranger.id,
      SocialRelationType.BONDED_ANIMAL,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    this.addSocialRelation(
      ranger,
      animalCompanion.id,
      SocialRelationType.ANIMAL_TRAINER,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    // Save creatures
    this.saveCreature(druid);
    this.saveCreature(ranger);
    this.saveCreature(animalCompanion);

    return { druid, ranger, animalCompanion };
  }

  /**
   * Duplicate a creature
   */
  static duplicateCreature(
    creatureId: string,
    newName?: string
  ): ICreature | null {
    const creature = this.getCreatureById(creatureId);
    if (!creature) return null;

    try {
      // Create a deep copy of the creature
      const newCreature = JSON.parse(JSON.stringify(creature));

      // Generate a new ID and update name
      newCreature.id = uuidv4();
      newCreature.name = newName || `${creature.name} (Kopie)`;

      // Reset some properties that shouldn't be copied
      newCreature.socialRelations = [];

      // Save the new creature
      this.saveCreature(newCreature);

      return newCreature;
    } catch (error) {
      console.error("Error duplicating creature:", error);
      return null;
    }
  }

  /**
   * Helper method to add a social relation to a creature
   */
  private static addSocialRelation(
    creature: ICreature,
    targetId: string,
    relationType: SocialRelationType,
    relationData: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    }
  ): void {
    const relation = new SocialRelation({
      targetId: targetId,
      type: relationType,
      familyDetails: {
        isBloodRelated: relationData.isBloodRelated,
        generationDifference: relationData.generationDifference,
        ...(relationData.relationshipDescription && {
          relationshipDescription: relationData.relationshipDescription,
        }),
      },
    });

    if (!creature.socialRelations) {
      creature.socialRelations = [];
    }

    creature.socialRelations.push(relation);
  }

  /**
   * Process stored creatures to ensure proper object types
   */
  private static processStoredCreatures(creatures: Record<string, any>): void {
    Object.values(creatures).forEach((creature: any) => {
      // Recreate proper SocialRelation objects
      if (creature.socialRelations && Array.isArray(creature.socialRelations)) {
        creature.socialRelations = creature.socialRelations.map((rel: any) => {
          return deserializeSocialRelation(rel);
        });
      }

      // Restore Date objects
      if (creature.birthdate) {
        creature.birthdate = new Date(creature.birthdate);
      }
    });
  }
}
