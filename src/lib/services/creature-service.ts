// src/lib/services/creature-service.ts
import { ICreature } from "@/types/creature";
import { SocialRelationType } from "@/types/social-relation";
import { GoalType } from "@/types/goal";
import {
  creatureReplacer,
  deserializeSocialRelation,
} from "@/lib/serialization";
import { CreatureBuilder } from "@/lib/builders/creature-builder";

export const STORAGE_KEY = "creatures";

/**
 * Service für die Verwaltung von Kreaturen
 * Verwendet den CreatureBuilder für die Erstellung
 */
export class CreatureService {
  /**
   * Speichert eine Kreatur im localStorage
   */
  static saveCreature(creature: ICreature): void {
    // Aktuelle Kreaturen laden
    const storedCreatures = this.getCreatures();

    // Neue Kreatur hinzufügen/aktualisieren
    const updatedCreatures = {
      ...storedCreatures,
      [creature.id]: creature,
    };

    // Zurück in localStorage speichern mit custom replacer
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCreatures, creatureReplacer)
    );
  }

  /**
   * Lädt alle Kreaturen aus dem localStorage
   */
  static getCreatures(): Record<string, ICreature> {
    const storedCreatures = localStorage.getItem(STORAGE_KEY);
    if (!storedCreatures) return {};

    // Parse the stored creatures
    const parsedCreatures = JSON.parse(storedCreatures);

    // Process stored creatures to ensure proper object types
    this.processStoredCreatures(parsedCreatures);

    return parsedCreatures;
  }

  /**
   * Lädt eine einzelne Kreatur anhand ihrer ID
   */
  static getCreatureById(id: string): ICreature | null {
    const creatures = this.getCreatures();
    return creatures[id] || null;
  }

  /**
   * Löscht eine Kreatur anhand ihrer ID
   */
  static deleteCreature(id: string): void {
    const creatures = this.getCreatures();
    if (creatures[id]) {
      delete creatures[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creatures));
    }
  }

  /**
   * Löscht alle Kreaturen
   */
  static deleteAllCreatures(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Erstellt eine neue Basis-Kreatur
   */
  static createCreature(name: string): ICreature {
    // Nutze den Builder, um eine Standardkreatur zu erstellen
    const creature = CreatureBuilder.create(name)
      .withStandardTraitsAndSkills()
      .build();

    // Speichere die Kreatur
    this.saveCreature(creature);

    return creature;
  }

  /**
   * Erstellt eine Kreatur mit bestimmtem Archetyp
   */
  static createCreatureWithArchetype(
    name: string,
    archetype: "warrior" | "scholar" | "craftsman" | "mage" | "ranger"
  ): ICreature {
    // Nutze den Builder mit dem spezifizierten Archetyp
    const creature = CreatureBuilder.create(name)
      .withArchetype(archetype)
      .withStandardTraitsAndSkills()
      .build();

    // Speichere die Kreatur
    this.saveCreature(creature);

    return creature;
  }

  /**
   * Erstellt eine Familie mit Eltern und Kind
   */
  static createFamily(): {
    father: ICreature;
    mother: ICreature;
    child: ICreature;
  } {
    // Nutze den Builder, um eine Familie zu erstellen
    const family = CreatureBuilder.createFamily();

    // Speichere alle Familienmitglieder
    this.saveCreature(family.father);
    this.saveCreature(family.mother);
    this.saveCreature(family.child);

    return family;
  }

  /**
   * Erstellt eine Kriegergruppe mit einem Anführer und Gefolgsleuten
   */
  static createWarriorGroup(
    leaderLevel: number = 10,
    followerCount: number = 4
  ): { leader: ICreature; followers: ICreature[] } {
    // Nutze den Builder, um eine Kriegergruppe zu erstellen
    const group = CreatureBuilder.createWarriorGroup(
      leaderLevel,
      followerCount
    );

    // Speichere alle Gruppenmitglieder
    this.saveCreature(group.leader);
    group.followers.forEach((follower) => this.saveCreature(follower));

    return group;
  }

  /**
   * Erstellt ein romantisches Paar
   */
  static createRomanticCouple(): { lover1: ICreature; lover2: ICreature } {
    // Nutze den Builder, um ein Liebespaar zu erstellen
    const couple = CreatureBuilder.createRomanticCouple();

    // Speichere beide Kreaturen
    this.saveCreature(couple.lover1);
    this.saveCreature(couple.lover2);

    return couple;
  }

  /**
   * Erstellt eine Gruppe von Gelehrten mit einem Meister und Lehrlingen
   */
  static createScholarGroup(
    masterLevel: number = 10,
    apprenticeCount: number = 4
  ): { master: ICreature; apprentices: ICreature[] } {
    // Erstelle Meister-Gelehrten
    const master = CreatureBuilder.create("Meister Gelehrter")
      .withArchetype("scholar")
      .withAge(40 + Math.floor(Math.random() * 20))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.MASTER_A_SKILL)
      .build();

    // Setze den Meister-Level
    master.skills.find((s) => s.name === "Forschung")!.level = masterLevel;

    // Erstelle Lehrlinge
    const apprentices: ICreature[] = [];
    for (let i = 0; i < apprenticeCount; i++) {
      const level = Math.max(
        1,
        masterLevel - 3 - Math.floor(Math.random() * 3)
      );
      const title = i < apprenticeCount / 2 ? "Gelehrter" : "Schüler";

      const apprentice = CreatureBuilder.create(`${title} ${i + 1}`)
        .withArchetype("scholar")
        .withAge(20 + Math.floor(Math.random() * 15))
        .withStandardTraitsAndSkills()
        .build();

      // Setze den Lehrling-Level
      apprentice.skills.find((s) => s.name === "Forschung")!.level = level;

      // Erstelle Beziehungen zwischen Meister und Lehrling
      this.createMutualRelationship(
        apprentice,
        master,
        SocialRelationType.MASTER,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: 1,
        }
      );

      // Erstelle Beziehungen zwischen Lehrlingen
      apprentices.forEach((otherApprentice) => {
        if (apprentice.id !== otherApprentice.id) {
          this.createMutualRelationship(
            apprentice,
            otherApprentice,
            SocialRelationType.COMPANION,
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

    // Speichere alle Kreaturen
    this.saveCreature(master);
    apprentices.forEach((apprentice) => this.saveCreature(apprentice));

    return { master, apprentices };
  }

  /**
   * Erstellt eine Gruppe von Handwerkern mit einem Meister und Lehrlingen
   */
  static createCraftsmenGroup(
    masterLevel: number = 10,
    apprenticeCount: number = 4
  ): { master: ICreature; apprentices: ICreature[] } {
    // Erstelle Meister-Handwerker
    const master = CreatureBuilder.create("Meister Handwerker")
      .withArchetype("craftsman")
      .withAge(40 + Math.floor(Math.random() * 20))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.CRAFT_A_MASTERWORK)
      .build();

    // Setze den Meister-Level
    master.skills.find((s) => s.name === "Handwerk")!.level = masterLevel;

    // Erstelle Lehrlinge
    const apprentices: ICreature[] = [];
    const crafts = ["Schmied", "Tischler", "Steinmetz", "Weber"];

    for (let i = 0; i < apprenticeCount; i++) {
      const level = Math.max(
        1,
        masterLevel - 3 - Math.floor(Math.random() * 3)
      );
      const title =
        i < apprenticeCount / 2 ? crafts[i % crafts.length] : "Lehrling";

      const apprentice = CreatureBuilder.create(`${title} ${i + 1}`)
        .withArchetype("craftsman")
        .withAge(20 + Math.floor(Math.random() * 15))
        .withStandardTraitsAndSkills()
        .build();

      // Setze den Lehrling-Level
      apprentice.skills.find((s) => s.name === "Handwerk")!.level = level;

      // Erstelle Beziehungen zwischen Meister und Lehrling
      this.createMutualRelationship(
        apprentice,
        master,
        SocialRelationType.MASTER,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: 1,
        }
      );

      // Erstelle Beziehungen zwischen Lehrlingen
      apprentices.forEach((otherApprentice) => {
        if (apprentice.id !== otherApprentice.id) {
          this.createMutualRelationship(
            apprentice,
            otherApprentice,
            SocialRelationType.COMPANION,
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

    // Speichere alle Kreaturen
    this.saveCreature(master);
    apprentices.forEach((apprentice) => this.saveCreature(apprentice));

    return { master, apprentices };
  }

  /**
   * Erstellt magische Wesen (Zauberer, Lehrling, Vertrauter)
   */
  static createMagicalBeings(): {
    wizard: ICreature;
    apprentice: ICreature;
    familiar: ICreature;
  } {
    // Erstelle den Zauberer
    const wizard = CreatureBuilder.create("Zauberer")
      .withArchetype("mage")
      .withAge(50 + Math.floor(Math.random() * 100))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.MAKE_A_GREAT_DISCOVERY)
      .build();

    // Erstelle den Lehrling
    const apprentice = CreatureBuilder.create("Lehrling")
      .withArchetype("mage")
      .withAge(20 + Math.floor(Math.random() * 10))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.MASTER_A_SKILL)
      .build();

    // Erstelle den Vertrauten
    const familiar = CreatureBuilder.create("Vertrauter")
      .withArchetype("mage")
      .withAge(5 + Math.floor(Math.random() * 5))
      .withStandardTraitsAndSkills()
      .build();

    // Erstelle Beziehungen
    this.createMutualRelationship(
      apprentice,
      wizard,
      SocialRelationType.MASTER,
      SocialRelationType.APPRENTICE,
      {
        isBloodRelated: false,
        generationDifference: 1,
      }
    );

    this.createMutualRelationship(
      familiar,
      wizard,
      SocialRelationType.BONDED_ANIMAL,
      SocialRelationType.OWNER,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    // Speichere alle Kreaturen
    this.saveCreature(wizard);
    this.saveCreature(apprentice);
    this.saveCreature(familiar);

    return { wizard, apprentice, familiar };
  }

  /**
   * Erstellt Naturwesen (Druide, Waldläufer, Tiergefährte)
   */
  static createNatureBeings(): {
    druid: ICreature;
    ranger: ICreature;
    animalCompanion: ICreature;
  } {
    // Erstelle Druide
    const druid = CreatureBuilder.create("Druide")
      .withArchetype("mage") // Mage passt am besten für Druiden-Attribute
      .withAge(40 + Math.floor(Math.random() * 60))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.BRING_PEACE_TO_THE_WORLD)
      .build();

    // Erstelle Waldläufer
    const ranger = CreatureBuilder.create("Waldläufer")
      .withArchetype("ranger")
      .withAge(25 + Math.floor(Math.random() * 15))
      .withStandardTraitsAndSkills()
      .withGoalType(GoalType.SEE_THE_GREAT_NATURAL_SITES)
      .build();

    // Erstelle Tiergefährte
    const animalCompanion = CreatureBuilder.create("Tiergefährte")
      .withArchetype("ranger")
      .withAge(3 + Math.floor(Math.random() * 6))
      .withStandardTraitsAndSkills()
      .build();

    // Erstelle Beziehungen
    this.createMutualRelationship(
      ranger,
      druid,
      SocialRelationType.KINDRED_SPIRIT,
      SocialRelationType.KINDRED_SPIRIT,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    this.createMutualRelationship(
      animalCompanion,
      ranger,
      SocialRelationType.BONDED_ANIMAL,
      SocialRelationType.ANIMAL_TRAINER,
      {
        isBloodRelated: false,
        generationDifference: 0,
      }
    );

    // Speichere alle Kreaturen
    this.saveCreature(druid);
    this.saveCreature(ranger);
    this.saveCreature(animalCompanion);

    return { druid, ranger, animalCompanion };
  }

  /**
   * Dupliziert eine Kreatur
   */
  static duplicateCreature(
    creatureId: string,
    newName?: string
  ): ICreature | null {
    const creature = this.getCreatureById(creatureId);
    if (!creature) return null;

    try {
      // Erstelle eine tiefe Kopie der Kreatur
      const newCreature = JSON.parse(JSON.stringify(creature));

      // Generiere eine neue ID und aktualisiere den Namen
      newCreature.id = crypto.randomUUID();
      newCreature.name = newName || `${creature.name} (Kopie)`;

      // Setze Beziehungen zurück, die nicht dupliziert werden sollten
      newCreature.socialRelations = [];

      // Speichere die neue Kreatur
      this.saveCreature(newCreature);

      return newCreature;
    } catch (error) {
      console.error("Fehler beim Duplizieren der Kreatur:", error);
      return null;
    }
  }

  /**
   * Hilfsmethode, um gegenseitige Beziehungen zwischen zwei Kreaturen zu erstellen
   */
  private static createMutualRelationship(
    creature1: ICreature,
    creature2: ICreature,
    relationTypeFrom1To2: SocialRelationType,
    relationTypeFrom2To1: SocialRelationType,
    details: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    }
  ): void {
    // Erstelle Beziehung von Kreatur 1 zu Kreatur 2
    const builder = new CreatureBuilder(creature1.name);
    builder.withRelationship(
      creature2.id,
      relationTypeFrom1To2,
      50, // Standardwert für Vertrautheit
      {
        isBloodRelated: details.isBloodRelated,
        generationDifference: details.generationDifference,
        relationshipDescription: details.relationshipDescription,
      }
    );

    // Hinzufügen zur Kreatur 1, wenn noch nicht vorhanden
    if (
      !creature1.socialRelations.find((rel) => rel.targetId === creature2.id)
    ) {
      creature1.socialRelations.push(builder.build().socialRelations[0]);
    }

    // Erstelle Beziehung von Kreatur 2 zu Kreatur 1
    const builder2 = new CreatureBuilder(creature2.name);
    builder2.withRelationship(
      creature1.id,
      relationTypeFrom2To1,
      50, // Standardwert für Vertrautheit
      {
        isBloodRelated: details.isBloodRelated,
        generationDifference: -details.generationDifference, // Umgekehrte Generationsdifferenz
        relationshipDescription: details.relationshipDescription,
      }
    );

    // Hinzufügen zur Kreatur 2, wenn noch nicht vorhanden
    if (
      !creature2.socialRelations.find((rel) => rel.targetId === creature1.id)
    ) {
      creature2.socialRelations.push(builder2.build().socialRelations[0]);
    }
  }

  /**
   * Verarbeitet gespeicherte Kreaturen, um sicherzustellen, dass die Objekttypen korrekt sind
   */
  private static processStoredCreatures(creatures: Record<string, any>): void {
    Object.values(creatures).forEach((creature: any) => {
      // Rekonstruiere SocialRelation-Objekte richtig
      if (creature.socialRelations && Array.isArray(creature.socialRelations)) {
        creature.socialRelations = creature.socialRelations.map((rel: any) => {
          return deserializeSocialRelation(rel);
        });
      }

      // Stelle Date-Objekte wieder her
      if (creature.birthdate) {
        creature.birthdate = new Date(creature.birthdate);
      }
    });
  }
}
