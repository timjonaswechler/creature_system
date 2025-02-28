// src/lib/factories/creature-factory.ts
import { v4 as uuidv4 } from "uuid";
import { Creature } from "@/lib/models/creature";
import { Trait } from "@/lib/models/trait";
import { Skill } from "@/lib/models/skill";
import { Goal } from "@/lib/models/goal";
import { SocialRelation } from "@/lib/models/social-relation";
import { createBasicHumanoidBody } from "@/data/body-examples";
import { TraitCategory, TraitImpact } from "@/types/trait";
import { SkillCategory, SkillPassion } from "@/types/skill";
import { SocialRelationType } from "@/types/social-relation";
import { ICreature } from "@/types/creature";
import { GoalType } from "@/types/goal";

/**
 * CreatureFactory handles the creation of various creature types
 * and manages relationships between them.
 */
export class CreatureFactory {
  /**
   * Creates a basic creature with standard values
   */
  static createBasicCreature(name: string): ICreature {
    // Create a basic humanoid body
    const body = createBasicHumanoidBody();

    // Create a new creature instance
    const creature = new Creature({
      id: uuidv4(),
      name,
      birthdate: new Date(
        Date.now() - Math.random() * 30 * 365 * 24 * 60 * 60 * 1000
      ), // Random age up to 30 years
      genome: { id: uuidv4(), chromosomes: [] },
      body: body,
      memory: { events: [] },
    });

    // Add some basic traits
    creature.traits = [
      this.createToughTrait(),
      this.createSanguineTrait(),
      this.createHardWorkerTrait(),
    ];

    // Add basic skills
    creature.skills = [
      this.createCraftingSkill(creature),
      this.createMiningSkill(creature),
      this.createShootingSkill(creature),
    ];

    return creature;
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
   * Creates a family unit with parents and child
   */
  static createFamilyUnit(): {
    father: ICreature;
    mother: ICreature;
    child: ICreature;
  } {
    // Create parent creatures
    const father = this.createBasicCreature("Father");
    const mother = this.createBasicCreature("Mother");

    // Adjust ages to be appropriate for parents
    father.birthdate = new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000); // 30 years ago
    mother.birthdate = new Date(Date.now() - 28 * 365 * 24 * 60 * 60 * 1000); // 28 years ago

    // Create child
    const child = this.createBasicCreature("Child");
    child.birthdate = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000); // 5 years ago

    // Establish relationships
    // Father-Mother relationship (SPOUSE)
    this.addSocialRelation(father, mother.id, SocialRelationType.SPOUSE, {
      isBloodRelated: false,
      generationDifference: 0,
    });

    this.addSocialRelation(mother, father.id, SocialRelationType.SPOUSE, {
      isBloodRelated: false,
      generationDifference: 0,
    });

    // Parent-Child relationships
    this.addSocialRelation(father, child.id, SocialRelationType.CHILD, {
      isBloodRelated: true,
      generationDifference: -1,
      relationshipDescription: "Eldest Son",
    });

    this.addSocialRelation(mother, child.id, SocialRelationType.CHILD, {
      isBloodRelated: true,
      generationDifference: -1,
      relationshipDescription: "Eldest Son",
    });

    this.addSocialRelation(child, father.id, SocialRelationType.PARENT, {
      isBloodRelated: true,
      generationDifference: 1,
      relationshipDescription: "Father",
    });

    this.addSocialRelation(child, mother.id, SocialRelationType.PARENT, {
      isBloodRelated: true,
      generationDifference: 1,
      relationshipDescription: "Mother",
    });

    return { father, mother, child };
  }

  /**
   * Creates a warrior with combat-oriented attributes and skills
   */
  static createWarrior(name: string, level: number = 5): ICreature {
    const warrior = this.createBasicCreature(name);

    // Add combat traits
    const braveTrait = new Trait();
    braveTrait.id = uuidv4();
    braveTrait.name = "Mutig";
    braveTrait.description =
      "Fürchtet keine Gefahr und stellt sich jeder Herausforderung.";
    braveTrait.category = TraitCategory.PERSONALITY;
    braveTrait.impact = TraitImpact.POSITIVE;
    warrior.traits.push(braveTrait);

    const toughTrait = new Trait();
    toughTrait.id = uuidv4();
    toughTrait.name = "Zäh";
    toughTrait.description =
      "Hat eine höhere Schmerztoleranz und Widerstandsfähigkeit.";
    toughTrait.category = TraitCategory.PHYSICAL;
    toughTrait.impact = TraitImpact.POSITIVE;
    warrior.traits.push(toughTrait);

    // Add combat skills
    const meleeCombatSkill = new Skill();
    meleeCombatSkill.id = uuidv4();
    meleeCombatSkill.name = "Nahkampf";
    meleeCombatSkill.description =
      "Kampffähigkeiten im Nahkampf mit verschiedenen Waffen.";
    meleeCombatSkill.category = SkillCategory.COMBAT;
    meleeCombatSkill.level = level;
    meleeCombatSkill.passion = SkillPassion.MAJOR;
    warrior.skills.push(meleeCombatSkill);

    const tacticsSkill = new Skill();
    tacticsSkill.id = uuidv4();
    tacticsSkill.name = "Taktik";
    tacticsSkill.description =
      "Verständnis von Kampftaktiken und strategischem Denken.";
    tacticsSkill.category = SkillCategory.INTELLECTUAL;
    tacticsSkill.level = Math.max(1, level - 2);
    tacticsSkill.passion = SkillPassion.MINOR;
    warrior.skills.push(tacticsSkill);

    // Set physical attributes higher
    warrior.physicalAttributes.strength.baseValue = 70 + Math.random() * 30;
    warrior.physicalAttributes.toughness.baseValue = 60 + Math.random() * 30;
    warrior.physicalAttributes.endurance.baseValue = 65 + Math.random() * 25;

    return warrior;
  }

  /**
   * Creates a scholar with intellectual attributes and skills
   */
  static createScholar(name: string, level: number = 5): ICreature {
    const scholar = this.createBasicCreature(name);

    // Add scholarly traits
    const curiousTrait = new Trait();
    curiousTrait.id = uuidv4();
    curiousTrait.name = "Wissbegierig";
    curiousTrait.description =
      "Hat einen unstillbaren Durst nach Wissen und neuen Erkenntnissen.";
    curiousTrait.category = TraitCategory.PERSONALITY;
    curiousTrait.impact = TraitImpact.POSITIVE;
    scholar.traits.push(curiousTrait);

    const patientTrait = new Trait();
    patientTrait.id = uuidv4();
    patientTrait.name = "Geduldig";
    patientTrait.description =
      "Besitzt die Geduld, langwierige Studien durchzuführen.";
    patientTrait.category = TraitCategory.PERSONALITY;
    patientTrait.impact = TraitImpact.POSITIVE;
    scholar.traits.push(patientTrait);

    // Add scholarly skills
    const researchSkill = new Skill();
    researchSkill.id = uuidv4();
    researchSkill.name = "Forschung";
    researchSkill.description =
      "Fähigkeit, neue Erkenntnisse zu gewinnen und zu dokumentieren.";
    researchSkill.category = SkillCategory.INTELLECTUAL;
    researchSkill.level = level;
    researchSkill.passion = SkillPassion.MAJOR;
    scholar.skills.push(researchSkill);

    const teachingSkill = new Skill();
    teachingSkill.id = uuidv4();
    teachingSkill.name = "Lehre";
    teachingSkill.description =
      "Fähigkeit, Wissen effektiv an andere weiterzugeben.";
    teachingSkill.category = SkillCategory.SOCIAL;
    teachingSkill.level = Math.max(1, level - 1);
    teachingSkill.passion = SkillPassion.MINOR;
    scholar.skills.push(teachingSkill);

    // Set mental attributes higher
    scholar.mentalAttributes.analyticalAbility.baseValue =
      70 + Math.random() * 30;
    scholar.mentalAttributes.memory.baseValue = 65 + Math.random() * 30;
    scholar.mentalAttributes.focus.baseValue = 60 + Math.random() * 30;

    return scholar;
  }

  /**
   * Creates a craftsman with crafting skills and attributes
   */
  static createCraftsman(name: string, level: number = 5): ICreature {
    const craftsman = this.createBasicCreature(name);

    // Add crafting traits
    const diligentTrait = new Trait();
    diligentTrait.id = uuidv4();
    diligentTrait.name = "Fleißig";
    diligentTrait.description =
      "Arbeitet ausdauernd und gewissenhaft an Projekten.";
    diligentTrait.category = TraitCategory.PERSONALITY;
    diligentTrait.impact = TraitImpact.POSITIVE;
    craftsman.traits.push(diligentTrait);

    const detailedTrait = new Trait();
    detailedTrait.id = uuidv4();
    detailedTrait.name = "Detailverliebt";
    detailedTrait.description = "Achtet auf feinste Details bei der Arbeit.";
    detailedTrait.category = TraitCategory.PERSONALITY;
    detailedTrait.impact = TraitImpact.POSITIVE;
    craftsman.traits.push(detailedTrait);

    // Add crafting skills
    const craftingSkill = new Skill();
    craftingSkill.id = uuidv4();
    craftingSkill.name = "Handwerk";
    craftingSkill.description =
      "Fähigkeit, hochwertige Gegenstände herzustellen.";
    craftingSkill.category = SkillCategory.CRAFTING;
    craftingSkill.level = level;
    craftingSkill.passion = SkillPassion.MAJOR;
    craftsman.skills.push(craftingSkill);

    const materialSkill = new Skill();
    materialSkill.id = uuidv4();
    materialSkill.name = "Materialkunde";
    materialSkill.description =
      "Wissen über verschiedene Materialien und ihre Eigenschaften.";
    materialSkill.category = SkillCategory.INTELLECTUAL;
    materialSkill.level = Math.max(1, level - 2);
    materialSkill.passion = SkillPassion.MINOR;
    craftsman.skills.push(materialSkill);

    // Set mixed attributes higher
    craftsman.physicalAttributes.strength.baseValue = 60 + Math.random() * 20;
    craftsman.mentalAttributes.patience.baseValue = 70 + Math.random() * 20;
    craftsman.mentalAttributes.spatialSense.baseValue = 65 + Math.random() * 30;

    return craftsman;
  }

  /**
   * Creates a magical being with arcane skills
   */
  static createMagicalBeing(name: string, level: number = 5): ICreature {
    const magicalBeing = this.createBasicCreature(name);

    // Add magical traits
    const mysticalTrait = new Trait();
    mysticalTrait.id = uuidv4();
    mysticalTrait.name = "Mystisch";
    mysticalTrait.description =
      "Hat eine natürliche Verbindung zu magischen Energien.";
    mysticalTrait.category = TraitCategory.BACKGROUND;
    mysticalTrait.impact = TraitImpact.POSITIVE;
    magicalBeing.traits.push(mysticalTrait);

    const enigmaticTrait = new Trait();
    enigmaticTrait.id = uuidv4();
    enigmaticTrait.name = "Rätselhaft";
    enigmaticTrait.description =
      "Ist schwer zu durchschauen und gibt sich geheimnisvoll.";
    enigmaticTrait.category = TraitCategory.PERSONALITY;
    enigmaticTrait.impact = TraitImpact.NEUTRAL;
    magicalBeing.traits.push(enigmaticTrait);

    // Add magical skills
    const arcaneSkill = new Skill();
    arcaneSkill.id = uuidv4();
    arcaneSkill.name = "Arkane Magie";
    arcaneSkill.description = "Beherrschung von magischen Kräften und Zaubern.";
    arcaneSkill.category = SkillCategory.INTELLECTUAL;
    arcaneSkill.level = level;
    arcaneSkill.passion = SkillPassion.BURNING;
    magicalBeing.skills.push(arcaneSkill);

    const alchemySkill = new Skill();
    alchemySkill.id = uuidv4();
    alchemySkill.name = "Alchemie";
    alchemySkill.description = "Herstellung magischer Tränke und Substanzen.";
    alchemySkill.category = SkillCategory.CRAFTING;
    alchemySkill.level = Math.max(1, level - 3);
    alchemySkill.passion = SkillPassion.MINOR;
    magicalBeing.skills.push(alchemySkill);

    // Set mental attributes higher
    magicalBeing.mentalAttributes.focus.baseValue = 75 + Math.random() * 25;
    magicalBeing.mentalAttributes.creativity.baseValue =
      65 + Math.random() * 25;
    magicalBeing.socialAttributes.empathy.baseValue = 60 + Math.random() * 20;

    return magicalBeing;
  }

  /**
   * Creates a nature-oriented being
   */
  static createNatureBeing(name: string, level: number = 5): ICreature {
    const natureBeing = this.createBasicCreature(name);

    // Add nature traits
    const natureLoverTrait = new Trait();
    natureLoverTrait.id = uuidv4();
    natureLoverTrait.name = "Naturverbunden";
    natureLoverTrait.description =
      "Hat eine tiefe Verbindung zur natürlichen Welt.";
    natureLoverTrait.category = TraitCategory.PERSONALITY;
    natureLoverTrait.impact = TraitImpact.POSITIVE;
    natureBeing.traits.push(natureLoverTrait);

    const patientTrait = new Trait();
    patientTrait.id = uuidv4();
    patientTrait.name = "Geduldig";
    patientTrait.description =
      "Besitzt die Geduld, mit der Natur im Einklang zu leben.";
    patientTrait.category = TraitCategory.PERSONALITY;
    patientTrait.impact = TraitImpact.POSITIVE;
    natureBeing.traits.push(patientTrait);

    // Add nature skills
    const survivalSkill = new Skill();
    survivalSkill.id = uuidv4();
    survivalSkill.name = "Überleben";
    survivalSkill.description =
      "Fähigkeit, in der Wildnis zu überleben und sich zurechtzufinden.";
    survivalSkill.category = SkillCategory.LABOR;
    survivalSkill.level = level;
    survivalSkill.passion = SkillPassion.MAJOR;
    natureBeing.skills.push(survivalSkill);

    const animalHandlingSkill = new Skill();
    animalHandlingSkill.id = uuidv4();
    animalHandlingSkill.name = "Tierkunde";
    animalHandlingSkill.description = "Verständnis und Umgang mit Tieren.";
    animalHandlingSkill.category = SkillCategory.SOCIAL;
    animalHandlingSkill.level = Math.max(1, level - 2);
    animalHandlingSkill.passion = SkillPassion.MAJOR;
    natureBeing.skills.push(animalHandlingSkill);

    // Set nature-related attributes higher
    natureBeing.physicalAttributes.agility.baseValue = 65 + Math.random() * 25;
    natureBeing.physicalAttributes.endurance.baseValue =
      70 + Math.random() * 20;
    natureBeing.mentalAttributes.intuition.baseValue = 65 + Math.random() * 30;

    return natureBeing;
  }

  /**
   * Creates a romantic couple
   */
  static createRomanticCouple(): { lover1: ICreature; lover2: ICreature } {
    // Create two creatures
    const lover1 = this.createBasicCreature("Lover 1");
    const lover2 = this.createBasicCreature("Lover 2");

    // Add love trait to both
    const lovingTrait1 = new Trait();
    lovingTrait1.id = uuidv4();
    lovingTrait1.name = "Liebevoll";
    lovingTrait1.description =
      "Zeigt tiefe Gefühle und Zuneigung für nahestehende Personen.";
    lovingTrait1.category = TraitCategory.PERSONALITY;
    lovingTrait1.impact = TraitImpact.POSITIVE;
    lover1.traits.push(lovingTrait1);

    const lovingTrait2 = new Trait();
    lovingTrait2.id = uuidv4();
    lovingTrait2.name = "Liebevoll";
    lovingTrait2.description =
      "Zeigt tiefe Gefühle und Zuneigung für nahestehende Personen.";
    lovingTrait2.category = TraitCategory.PERSONALITY;
    lovingTrait2.impact = TraitImpact.POSITIVE;
    lover2.traits.push(lovingTrait2);

    // Create romantic relationship
    this.addSocialRelation(lover1, lover2.id, SocialRelationType.LOVER, {
      isBloodRelated: false,
      generationDifference: 0,
    });

    this.addSocialRelation(lover2, lover1.id, SocialRelationType.LOVER, {
      isBloodRelated: false,
      generationDifference: 0,
    });

    return { lover1, lover2 };
  }

  /**
   * Creates a warrior group with a leader and followers
   */
  static createWarriorGroup(
    leaderLevel: number = 10,
    followerCount: number = 4
  ): { leader: ICreature; followers: ICreature[] } {
    // Create a leader
    const leader = this.createWarrior("Anführer", leaderLevel);

    // Create followers
    const followers: ICreature[] = [];
    const followerTypes = ["Krieger", "Bogenschütze", "Schildträger", "Späher"];

    for (let i = 0; i < followerCount; i++) {
      const followerType = followerTypes[i % followerTypes.length];
      const level = leaderLevel - 2 - Math.floor(Math.random() * 3);
      const follower = this.createWarrior(followerType, Math.max(1, level));
      followers.push(follower);
    }

    // Create relationships
    followers.forEach((follower) => {
      // Follower has loyalty to leader
      this.addSocialRelation(follower, leader.id, SocialRelationType.MASTER, {
        isBloodRelated: false,
        generationDifference: 1,
      });

      // Leader knows all followers
      this.addSocialRelation(
        leader,
        follower.id,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: -1,
        }
      );

      // Followers know each other as companions
      followers.forEach((otherFollower) => {
        if (follower.id !== otherFollower.id) {
          this.addSocialRelation(
            follower,
            otherFollower.id,
            SocialRelationType.COMPANION,
            {
              isBloodRelated: false,
              generationDifference: 0,
            }
          );
        }
      });
    });

    return { leader, followers };
  }

  // Helper methods for trait creation

  /**
   * Creates a tough trait
   */
  private static createToughTrait(): Trait {
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
   * Creates a sanguine (optimistic) trait
   */
  private static createSanguineTrait(): Trait {
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
   * Creates a hard worker trait
   */
  private static createHardWorkerTrait(): Trait {
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

  // Helper methods for skill creation

  /**
   * Creates a crafting skill
   */
  private static createCraftingSkill(creature: ICreature): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Handwerk";
    skill.description =
      "Die Fähigkeit, Gegenstände herzustellen und zu verarbeiten.";
    skill.category = SkillCategory.CRAFTING;
    skill.level = 4; // Skilled
    skill.experience = 7000;
    skill.passion = SkillPassion.MINOR;

    // Attribute-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      creature.physicalAttributes.strength,
      creature.mentalAttributes.creativity,
    ];

    skill.secondaryAttributes = [
      creature.physicalAttributes.agility,
      creature.mentalAttributes.patience,
    ];

    return skill;
  }

  /**
   * Creates a mining skill
   */
  private static createMiningSkill(creature: ICreature): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Bergbau";
    skill.description = "Die Fähigkeit, effizient Ressourcen abzubauen.";
    skill.category = SkillCategory.LABOR;
    skill.level = 2; // Adequate
    skill.experience = 2000;
    skill.passion = SkillPassion.NONE;

    // Attribute-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      creature.physicalAttributes.strength,
      creature.physicalAttributes.endurance,
    ];

    skill.secondaryAttributes = [creature.mentalAttributes.patience];

    return skill;
  }

  /**
   * Creates a shooting skill
   */
  private static createShootingSkill(creature: ICreature): Skill {
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = "Schießen";
    skill.description =
      "Die Fähigkeit, präzise mit Fernkampfwaffen zu treffen.";
    skill.category = SkillCategory.COMBAT;
    skill.level = 3; // Competent
    skill.experience = 4000;
    skill.passion = SkillPassion.MAJOR;

    // Attribute-Verknüpfungen hinzufügen
    skill.primaryAttributes = [
      creature.physicalAttributes.agility,
      creature.mentalAttributes.focus,
    ];

    skill.secondaryAttributes = [creature.physicalAttributes.strength];

    return skill;
  }
}
