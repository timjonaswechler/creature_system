// src/lib/builders/creature-builder.ts
import { v4 as uuidv4 } from "uuid";
import { Creature } from "@/lib/models/creature";
import { Trait } from "@/lib/models/trait";
import { Skill } from "@/lib/models/skill";
import { SocialRelation } from "@/lib/models/social-relation";
import { Goal } from "@/lib/models/goal";
import { BodyBuilder } from "./body-builder";
import { TraitCategory, TraitImpact } from "@/types/trait";
import { SkillCategory, SkillPassion } from "@/types/skill";
import { SocialRelationType } from "@/types/social-relation";
import { ICreature } from "@/types/creature";
import { GoalType } from "@/types/goal";
import { Body } from "@/lib/models/body";

/**
 * Builder-Klasse für die Erstellung von Kreaturen
 * Zentraler Ort für alle Kreaturerstellungsfunktionen
 */
export class CreatureBuilder {
  private creature: ICreature;

  constructor(name: string) {
    // Erstelle die Basis-Kreatur mit einem Standard-Körper
    const body = BodyBuilder.createHumanoidBody();

    // Erstelle eine neue Kreatur-Instanz
    this.creature = new Creature({
      id: uuidv4(),
      name,
      birthdate: new Date(
        Date.now() - Math.random() * 30 * 365 * 24 * 60 * 60 * 1000
      ), // Zufälliges Alter bis zu 30 Jahre
      genome: { id: uuidv4(), chromosomes: [] },
      body: body,
      memory: { events: [] },
    });
  }

  /**
   * Erstellt und gibt eine neue Builder-Instanz zurück
   */
  public static create(name: string): CreatureBuilder {
    return new CreatureBuilder(name);
  }

  /**
   * Setzt einen benutzerdefinierten Körper für die Kreatur
   */
  public withBody(body: Body): CreatureBuilder {
    this.creature.body = body;
    return this;
  }

  /**
   * Setzt das Geburtsdatum der Kreatur
   */
  public withBirthdate(birthdate: Date): CreatureBuilder {
    this.creature.birthdate = birthdate;
    return this;
  }

  /**
   * Setzt das Alter der Kreatur in Jahren
   */
  public withAge(ageInYears: number): CreatureBuilder {
    const now = new Date();
    const birthdate = new Date(
      now.getTime() - ageInYears * 365 * 24 * 60 * 60 * 1000
    );
    this.creature.birthdate = birthdate;
    return this;
  }

  /**
   * Fügt einen Trait zur Kreatur hinzu
   */
  public withTrait(trait: Trait): CreatureBuilder {
    this.creature.traits.push(trait);
    return this;
  }

  /**
   * Erstellt und fügt einen Standardtrait hinzu
   */
  public withStandardTrait(
    name: string,
    description: string,
    category: TraitCategory,
    impact: TraitImpact
  ): CreatureBuilder {
    const trait = new Trait();
    trait.id = uuidv4();
    trait.name = name;
    trait.description = description;
    trait.category = category;
    trait.impact = impact;

    this.creature.traits.push(trait);
    return this;
  }

  /**
   * Fügt eine Fähigkeit zur Kreatur hinzu
   */
  public withSkill(skill: Skill): CreatureBuilder {
    this.creature.skills.push(skill);
    return this;
  }

  /**
   * Erstellt und fügt eine Standardfähigkeit hinzu
   */
  public withStandardSkill(
    name: string,
    description: string,
    category: SkillCategory,
    level: number,
    passion: SkillPassion = SkillPassion.NONE
  ): CreatureBuilder {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = name;
    skill.description = description;
    skill.category = category;
    skill.level = level;
    skill.passion = passion;

    // Füge entsprechende Attribute basierend auf der Kategorie hinzu
    if (category === SkillCategory.COMBAT) {
      skill.primaryAttributes = [
        this.creature.physicalAttributes.strength,
        this.creature.physicalAttributes.agility,
      ];
    } else if (category === SkillCategory.CRAFTING) {
      skill.primaryAttributes = [
        this.creature.physicalAttributes.agility,
        this.creature.mentalAttributes.creativity,
      ];
    } else if (category === SkillCategory.INTELLECTUAL) {
      skill.primaryAttributes = [
        this.creature.mentalAttributes.analyticalAbility,
        this.creature.mentalAttributes.memory,
      ];
    }

    this.creature.skills.push(skill);
    return this;
  }

  /**
   * Fügt ein Ziel zur Kreatur hinzu
   */
  public withGoal(goal: Goal): CreatureBuilder {
    this.creature.goals.push(goal);
    return this;
  }

  /**
   * Erstellt und fügt ein Ziel basierend auf einem vordefinierten Zieltyp hinzu
   */
  public withGoalType(goalType: GoalType): CreatureBuilder {
    const goal = Goal.fromGoalType(goalType);
    this.creature.goals.push(goal);
    return this;
  }

  /**
   * Fügt eine soziale Beziehung zur Kreatur hinzu
   */
  public withRelationship(
    targetId: string,
    relationType: SocialRelationType,
    familiarity: number = 0,
    familyDetails?: {
      isBloodRelated: boolean;
      generationDifference: number;
      relationshipDescription?: string;
    }
  ): CreatureBuilder {
    const relation = new SocialRelation({
      targetId,
      type: relationType,
      value: familiarity,
      familyDetails,
    });

    this.creature.socialRelations.push(relation);
    return this;
  }

  /**
   * Fügt Basis-Attribute für einen bestimmten Archetypen hinzu
   */
  public withArchetype(
    archetype: "warrior" | "scholar" | "craftsman" | "mage" | "ranger"
  ): CreatureBuilder {
    switch (archetype) {
      case "warrior":
        // Erhöhe physische Attribute
        this.creature.physicalAttributes.strength.baseValue =
          70 + Math.random() * 20;
        this.creature.physicalAttributes.toughness.baseValue =
          65 + Math.random() * 20;
        this.creature.physicalAttributes.endurance.baseValue =
          60 + Math.random() * 20;

        // Füge Kampffähigkeiten hinzu
        this.withStandardSkill(
          "Nahkampf",
          "Fähigkeit im Umgang mit Nahkampfwaffen",
          SkillCategory.COMBAT,
          5,
          SkillPassion.MAJOR
        );

        // Füge passende Traits hinzu
        this.withStandardTrait(
          "Mutig",
          "Stellt sich furchtlos jeder Gefahr",
          TraitCategory.PERSONALITY,
          TraitImpact.POSITIVE
        );

        break;

      case "scholar":
        // Erhöhe mentale Attribute
        this.creature.mentalAttributes.analyticalAbility.baseValue =
          70 + Math.random() * 20;
        this.creature.mentalAttributes.memory.baseValue =
          65 + Math.random() * 20;
        this.creature.mentalAttributes.focus.baseValue =
          60 + Math.random() * 20;

        // Füge Wissensfähigkeiten hinzu
        this.withStandardSkill(
          "Forschung",
          "Fähigkeit, neues Wissen zu entdecken und zu dokumentieren",
          SkillCategory.INTELLECTUAL,
          5,
          SkillPassion.MAJOR
        );

        // Füge passende Traits hinzu
        this.withStandardTrait(
          "Wissbegierig",
          "Strebt ständig nach neuem Wissen",
          TraitCategory.PERSONALITY,
          TraitImpact.POSITIVE
        );

        break;

      case "craftsman":
        // Mische physische und mentale Attribute
        this.creature.physicalAttributes.agility.baseValue =
          65 + Math.random() * 20;
        this.creature.mentalAttributes.patience.baseValue =
          70 + Math.random() * 20;
        this.creature.mentalAttributes.creativity.baseValue =
          65 + Math.random() * 20;

        // Füge Handwerksfähigkeiten hinzu
        this.withStandardSkill(
          "Handwerk",
          "Fähigkeit, hochwertige Gegenstände herzustellen",
          SkillCategory.CRAFTING,
          5,
          SkillPassion.MAJOR
        );

        // Füge passende Traits hinzu
        this.withStandardTrait(
          "Genau",
          "Arbeitet mit großer Präzision und Liebe zum Detail",
          TraitCategory.PERSONALITY,
          TraitImpact.POSITIVE
        );

        break;

      case "mage":
        // Erhöhe mystische Attribute
        this.creature.mentalAttributes.focus.baseValue =
          75 + Math.random() * 20;
        this.creature.mentalAttributes.creativity.baseValue =
          70 + Math.random() * 20;
        this.creature.socialAttributes.empathy.baseValue =
          60 + Math.random() * 20;

        // Füge magische Fähigkeiten hinzu
        this.withStandardSkill(
          "Arkane Magie",
          "Beherrschung magischer Kräfte",
          SkillCategory.INTELLECTUAL,
          5,
          SkillPassion.BURNING
        );

        // Füge passende Traits hinzu
        this.withStandardTrait(
          "Mystisch",
          "Hat eine natürliche Verbindung zu magischen Energien",
          TraitCategory.BACKGROUND,
          TraitImpact.POSITIVE
        );

        break;

      case "ranger":
        // Mische Attribute für Naturverbundenheit
        this.creature.physicalAttributes.agility.baseValue =
          70 + Math.random() * 20;
        this.creature.mentalAttributes.intuition.baseValue =
          65 + Math.random() * 20;
        this.creature.physicalAttributes.endurance.baseValue =
          65 + Math.random() * 20;

        // Füge Waldläufer-Fähigkeiten hinzu
        this.withStandardSkill(
          "Überleben",
          "Fähigkeit, in der Wildnis zu überleben",
          SkillCategory.LABOR,
          5,
          SkillPassion.MAJOR
        );

        // Füge passende Traits hinzu
        this.withStandardTrait(
          "Naturverbunden",
          "Hat eine tiefe Verbindung zur natürlichen Welt",
          TraitCategory.PERSONALITY,
          TraitImpact.POSITIVE
        );

        break;
    }

    return this;
  }

  /**
   * Fügt Standardeigenschaften und -fähigkeiten hinzu
   */
  public withStandardTraitsAndSkills(): CreatureBuilder {
    // Füge Standardtraits hinzu
    const toughTrait = this.createToughTrait();
    const sanguineTrait = this.createSanguineTrait();
    const hardWorkerTrait = this.createHardWorkerTrait();

    this.creature.traits.push(toughTrait, sanguineTrait, hardWorkerTrait);

    // Füge Standardfähigkeiten hinzu
    const craftingSkill = this.createCraftingSkill();
    const miningSkill = this.createMiningSkill();
    const shootingSkill = this.createShootingSkill();

    this.creature.skills.push(craftingSkill, miningSkill, shootingSkill);

    return this;
  }

  /**
   * Setzt Attributwerte direkt
   */
  public withAttributeValue(
    attributeId: string,
    value: number
  ): CreatureBuilder {
    const allAttributes = [
      ...Object.values(this.creature.physicalAttributes),
      ...Object.values(this.creature.mentalAttributes),
      ...Object.values(this.creature.socialAttributes),
    ];

    const attribute = allAttributes.find((attr) => attr.id === attributeId);
    if (attribute) {
      attribute.baseValue = value;
      attribute.currentValue = value;
    }

    return this;
  }

  /**
   * Baut die Kreatur und gibt sie zurück
   */
  public build(): ICreature {
    return this.creature;
  }

  // FACTORY-METHODEN FÜR KOMPLEXE STRUKTUREN

  /**
   * Erstellt eine Familie mit Eltern und Kind
   */
  public static createFamily(): {
    father: ICreature;
    mother: ICreature;
    child: ICreature;
  } {
    // Erstelle Eltern
    const father = new CreatureBuilder("Vater")
      .withAge(30 + Math.floor(Math.random() * 10))
      .withArchetype("warrior")
      .withStandardTraitsAndSkills()
      .build();

    const mother = new CreatureBuilder("Mutter")
      .withAge(28 + Math.floor(Math.random() * 8))
      .withArchetype("scholar")
      .withStandardTraitsAndSkills()
      .build();

    // Erstelle Kind
    const child = new CreatureBuilder("Kind")
      .withAge(4 + Math.floor(Math.random() * 6))
      .withStandardTraitsAndSkills()
      .build();

    // Erstelle Beziehungen
    // Vater-Mutter Beziehung (SPOUSE)
    const fatherRelation = new SocialRelation({
      targetId: mother.id,
      type: SocialRelationType.SPOUSE,
      familyDetails: {
        isBloodRelated: false,
        generationDifference: 0,
      },
    });

    const motherRelation = new SocialRelation({
      targetId: father.id,
      type: SocialRelationType.SPOUSE,
      familyDetails: {
        isBloodRelated: false,
        generationDifference: 0,
      },
    });

    // Eltern-Kind Beziehungen
    const fatherToChildRelation = new SocialRelation({
      targetId: child.id,
      type: SocialRelationType.CHILD,
      familyDetails: {
        isBloodRelated: true,
        generationDifference: -1,
        relationshipDescription: "Ältester Sohn",
      },
    });

    const motherToChildRelation = new SocialRelation({
      targetId: child.id,
      type: SocialRelationType.CHILD,
      familyDetails: {
        isBloodRelated: true,
        generationDifference: -1,
        relationshipDescription: "Ältester Sohn",
      },
    });

    const childToFatherRelation = new SocialRelation({
      targetId: father.id,
      type: SocialRelationType.PARENT,
      familyDetails: {
        isBloodRelated: true,
        generationDifference: 1,
        relationshipDescription: "Vater",
      },
    });

    const childToMotherRelation = new SocialRelation({
      targetId: mother.id,
      type: SocialRelationType.PARENT,
      familyDetails: {
        isBloodRelated: true,
        generationDifference: 1,
        relationshipDescription: "Mutter",
      },
    });

    // Füge die Beziehungen hinzu
    father.socialRelations.push(fatherRelation, fatherToChildRelation);
    mother.socialRelations.push(motherRelation, motherToChildRelation);
    child.socialRelations.push(childToFatherRelation, childToMotherRelation);

    return { father, mother, child };
  }

  /**
   * Erstellt eine Kriegergruppe mit Anführer und Gefolgsleuten
   */
  public static createWarriorGroup(
    leaderLevel: number = 10,
    followerCount: number = 4
  ): { leader: ICreature; followers: ICreature[] } {
    // Erstelle den Anführer
    const leader = new CreatureBuilder("Anführer")
      .withArchetype("warrior")
      .withAge(30 + Math.floor(Math.random() * 15))
      .withStandardTraitsAndSkills()
      .build();

    // Modifiziere Anführer-Fähigkeiten basierend auf Level
    leader.skills.find((s) => s.name === "Nahkampf")!.level = leaderLevel;

    // Erstelle Gefolgsleute
    const followerTypes = ["Krieger", "Bogenschütze", "Schildträger", "Späher"];
    const followers: ICreature[] = [];

    for (let i = 0; i < followerCount; i++) {
      const followerType = followerTypes[i % followerTypes.length];
      const level = Math.max(
        1,
        leaderLevel - 2 - Math.floor(Math.random() * 3)
      );

      const follower = new CreatureBuilder(`${followerType} ${i + 1}`)
        .withArchetype("warrior")
        .withAge(20 + Math.floor(Math.random() * 10))
        .withStandardTraitsAndSkills()
        .build();

      // Modifiziere Gefolgsmann-Fähigkeiten basierend auf Level
      follower.skills.find((s) => s.name === "Nahkampf")!.level = level;

      // Erstelle Beziehungen
      const followerToLeaderRelation = new SocialRelation({
        targetId: leader.id,
        type: SocialRelationType.MASTER,
        familyDetails: {
          isBloodRelated: false,
          generationDifference: 1,
        },
      });

      const leaderToFollowerRelation = new SocialRelation({
        targetId: follower.id,
        type: SocialRelationType.APPRENTICE,
        familyDetails: {
          isBloodRelated: false,
          generationDifference: -1,
        },
      });

      // Füge die Beziehungen hinzu
      follower.socialRelations.push(followerToLeaderRelation);
      leader.socialRelations.push(leaderToFollowerRelation);

      // Füge Beziehungen zwischen Gefolgsleuten hinzu
      for (const otherFollower of followers) {
        const followerRelation = new SocialRelation({
          targetId: otherFollower.id,
          type: SocialRelationType.COMPANION,
          familyDetails: {
            isBloodRelated: false,
            generationDifference: 0,
          },
        });

        const otherFollowerRelation = new SocialRelation({
          targetId: follower.id,
          type: SocialRelationType.COMPANION,
          familyDetails: {
            isBloodRelated: false,
            generationDifference: 0,
          },
        });

        follower.socialRelations.push(followerRelation);
        otherFollower.socialRelations.push(otherFollowerRelation);
      }

      followers.push(follower);
    }

    return { leader, followers };
  }

  /**
   * Erstellt ein Liebespaar
   */
  public static createRomanticCouple(): {
    lover1: ICreature;
    lover2: ICreature;
  } {
    // Erstelle die Liebenden
    const lover1 = new CreatureBuilder("Liebender 1")
      .withAge(20 + Math.floor(Math.random() * 10))
      .withStandardTraitsAndSkills()
      .build();

    const lover2 = new CreatureBuilder("Liebender 2")
      .withAge(20 + Math.floor(Math.random() * 10))
      .withStandardTraitsAndSkills()
      .build();

    // Erstelle Liebestraits
    const lovingTrait1 = new Trait();
    lovingTrait1.id = uuidv4();
    lovingTrait1.name = "Liebevoll";
    lovingTrait1.description =
      "Zeigt tiefe Gefühle und Zuneigung für nahestehende Personen.";
    lovingTrait1.category = TraitCategory.PERSONALITY;
    lovingTrait1.impact = TraitImpact.POSITIVE;

    const lovingTrait2 = new Trait();
    lovingTrait2.id = uuidv4();
    lovingTrait2.name = "Liebevoll";
    lovingTrait2.description =
      "Zeigt tiefe Gefühle und Zuneigung für nahestehende Personen.";
    lovingTrait2.category = TraitCategory.PERSONALITY;
    lovingTrait2.impact = TraitImpact.POSITIVE;

    lover1.traits.push(lovingTrait1);
    lover2.traits.push(lovingTrait2);

    // Erstelle romantische Beziehung
    const relation1 = new SocialRelation({
      targetId: lover2.id,
      type: SocialRelationType.LOVER,
      familyDetails: {
        isBloodRelated: false,
        generationDifference: 0,
      },
    });

    const relation2 = new SocialRelation({
      targetId: lover1.id,
      type: SocialRelationType.LOVER,
      familyDetails: {
        isBloodRelated: false,
        generationDifference: 0,
      },
    });

    lover1.socialRelations.push(relation1);
    lover2.socialRelations.push(relation2);

    return { lover1, lover2 };
  }

  // PRIVATE HILFSMETHODEN FÜR TRAITS UND SKILLS

  /**
   * Erstellt einen "Zäh"-Trait
   */
  private createToughTrait(): Trait {
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

  /**
   * Erstellt einen "Sanguinisch"-Trait
   */
  private createSanguineTrait(): Trait {
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

  /**
   * Erstellt einen "Fleißig"-Trait
   */
  private createHardWorkerTrait(): Trait {
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
        modifier: 0,
        modifierPercent: 20, // Prozentuale Steigerung für alle arbeitsbezogenen Aktivitäten
      },
    ];

    return trait;
  }

  /**
   * Erstellt eine Handwerksfähigkeit
   */
  private createCraftingSkill(): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Handwerk";
    skill.description =
      "Die Fähigkeit, Gegenstände herzustellen und zu verarbeiten.";
    skill.category = SkillCategory.CRAFTING;
    skill.level = 4; // Skilled
    skill.experience = 7000;
    skill.passion = SkillPassion.MINOR;

    // Attribut-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      this.creature.physicalAttributes.strength,
      this.creature.mentalAttributes.creativity,
    ];

    skill.secondaryAttributes = [
      this.creature.physicalAttributes.agility,
      this.creature.mentalAttributes.patience,
    ];

    return skill;
  }

  /**
   * Erstellt eine Bergbaufähigkeit
   */
  private createMiningSkill(): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Bergbau";
    skill.description = "Die Fähigkeit, effizient Ressourcen abzubauen.";
    skill.category = SkillCategory.LABOR;
    skill.level = 2; // Adequate
    skill.experience = 2000;
    skill.passion = SkillPassion.NONE;

    // Attribut-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      this.creature.physicalAttributes.strength,
      this.creature.physicalAttributes.endurance,
    ];

    skill.secondaryAttributes = [this.creature.mentalAttributes.patience];

    return skill;
  }

  /**
   * Erstellt eine Schießfähigkeit
   */
  private createShootingSkill(): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Schießen";
    skill.description =
      "Die Fähigkeit, präzise mit Fernkampfwaffen zu treffen.";
    skill.category = SkillCategory.COMBAT;
    skill.level = 3; // Competent
    skill.experience = 4000;
    skill.passion = SkillPassion.MAJOR;

    // Attribut-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      this.creature.physicalAttributes.agility,
      this.creature.mentalAttributes.focus,
    ];

    skill.secondaryAttributes = [this.creature.physicalAttributes.strength];

    return skill;
  }
}
