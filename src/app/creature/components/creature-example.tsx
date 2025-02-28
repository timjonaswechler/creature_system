"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Swords,
  Book,
  Hammer,
  Heart,
  Sparkles,
  Leaf,
  Loader2,
} from "lucide-react";
import { saveCreature } from "@/lib/creatureManager";
import { createFamilyUnit } from "@/lib/socialSimulation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createBasicHumanoidBody } from "@/data/body-examples";
import { Creature } from "@/lib/models/creature";
import { Skill } from "@/lib/models/skill";
import { Trait } from "@/lib/models/trait";
import { SocialRelationType } from "@/types/social-relation";
import { TraitCategory, TraitImpact } from "@/types/trait";
import { SkillCategory, SkillPassion } from "@/types/skill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface CreatureExamplesProps {
  onCreaturesCreated: () => void;
}

export function CreatureExamples({
  onCreaturesCreated,
}: CreatureExamplesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  // Create a basic family unit (parent + child)
  const createFamily = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Familie...");

    try {
      const family = createFamilyUnit();

      // Save each family member
      saveCreature(family.father);
      saveCreature(family.mother);
      saveCreature(family.child);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Familie erstellt", {
        description:
          "Eine neue Familie mit sozialen Beziehungen wurde erstellt",
      });
    } catch (error) {
      console.error("Error creating family:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Familie",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of warriors
  const createWarriorGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Krieger-Gruppe...");

    try {
      // Create a leader and warriors
      const leader = createWarrior("Anführer", 10);
      const warriors = [
        createWarrior("Krieger", 6),
        createWarrior("Krieger", 5),
        createWarrior("Bogenschütze", 7),
        createWarrior("Schildträger", 8),
      ];

      // Create relationships
      warriors.forEach((warrior) => {
        // Warrior has loyalty to leader
        warrior.formFamilialRelationship(leader.id, SocialRelationType.MASTER, {
          isBloodRelated: false,
          generationDifference: 1,
        });

        // Leader knows all warriors
        leader.formFamilialRelationship(
          warrior.id,
          SocialRelationType.APPRENTICE,
          {
            isBloodRelated: false,
            generationDifference: -1,
          }
        );

        // Warriors know each other as companions
        warriors.forEach((otherWarrior) => {
          if (warrior.id !== otherWarrior.id) {
            warrior.formFamilialRelationship(
              otherWarrior.id,
              SocialRelationType.COMPANION,
              {
                isBloodRelated: false,
                generationDifference: 0,
              }
            );
          }
        });
      });

      // Save all creatures
      saveCreature(leader);
      warriors.forEach((warrior) => saveCreature(warrior));

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Krieger-Gruppe erstellt", {
        description: `Ein Anführer und ${warriors.length} Krieger wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating warrior group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Krieger-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of scholars
  const createScholarGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Gelehrten-Gruppe...");

    try {
      // Create master scholar and apprentices
      const masterScholar = createScholar("Meister", 10);
      const scholars = [
        createScholar("Gelehrter", 8),
        createScholar("Gelehrter", 7),
        createScholar("Schüler", 4),
        createScholar("Schüler", 3),
      ];

      // Create relationships
      scholars.forEach((scholar) => {
        // Scholar has relationship to master
        scholar.formFamilialRelationship(
          masterScholar.id,
          SocialRelationType.MASTER,
          {
            isBloodRelated: false,
            generationDifference: 1,
          }
        );

        // Master knows all scholars
        masterScholar.formFamilialRelationship(
          scholar.id,
          SocialRelationType.APPRENTICE,
          {
            isBloodRelated: false,
            generationDifference: -1,
          }
        );

        // Scholars know each other
        scholars.forEach((otherScholar) => {
          if (scholar.id !== otherScholar.id) {
            scholar.formFamilialRelationship(
              otherScholar.id,
              SocialRelationType.COMPANION,
              {
                isBloodRelated: false,
                generationDifference: 0,
              }
            );
          }
        });
      });

      // Save all creatures
      saveCreature(masterScholar);
      scholars.forEach((scholar) => saveCreature(scholar));

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Gelehrten-Gruppe erstellt", {
        description: `Ein Meister und ${scholars.length} Gelehrte wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating scholar group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Gelehrten-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of craftsmen
  const createCraftsmenGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Handwerker-Gruppe...");

    try {
      // Create master craftsman and apprentices
      const masterCraftsman = createCraftsman("Meister Handwerker", 10);
      const craftsmen = [
        createCraftsman("Schmied", 8),
        createCraftsman("Tischler", 7),
        createCraftsman("Lehrling", 4),
        createCraftsman("Lehrling", 3),
      ];

      // Create relationships
      craftsmen.forEach((craftsman) => {
        // Craftsman has relationship to master
        craftsman.formFamilialRelationship(
          masterCraftsman.id,
          SocialRelationType.MASTER,
          {
            isBloodRelated: false,
            generationDifference: 1,
          }
        );

        // Master knows all craftsmen
        masterCraftsman.formFamilialRelationship(
          craftsman.id,
          SocialRelationType.APPRENTICE,
          {
            isBloodRelated: false,
            generationDifference: -1,
          }
        );

        // Craftsmen know each other
        craftsmen.forEach((otherCraftsman) => {
          if (craftsman.id !== otherCraftsman.id) {
            craftsman.formFamilialRelationship(
              otherCraftsman.id,
              SocialRelationType.COMPANION,
              {
                isBloodRelated: false,
                generationDifference: 0,
              }
            );
          }
        });
      });

      // Save all creatures
      saveCreature(masterCraftsman);
      craftsmen.forEach((craftsman) => saveCreature(craftsman));

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Handwerker-Gruppe erstellt", {
        description: `Ein Meister und ${craftsmen.length} Handwerker wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating craftsmen group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Handwerker-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a romantic couple
  const createCouple = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Liebespaar...");

    try {
      // Create two creatures
      const creature1 = createBasicCreature("Liebhaber 1");
      const creature2 = createBasicCreature("Liebhaber 2");

      // Add love trait
      addLovingTrait(creature1);
      addLovingTrait(creature2);

      // Create romantic relationship
      creature1.formFamilialRelationship(
        creature2.id,
        SocialRelationType.LOVER,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      creature2.formFamilialRelationship(
        creature1.id,
        SocialRelationType.LOVER,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      // Save creatures
      saveCreature(creature1);
      saveCreature(creature2);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Liebespaar erstellt", {
        description: "Ein Paar mit romantischer Beziehung wurde erstellt",
      });
    } catch (error) {
      console.error("Error creating couple:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen des Liebespaars",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of magical beings
  const createMagicalBeings = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle magische Wesen...");

    try {
      // Create magical beings
      const wizard = createMagicalBeing("Zauberer", 10);
      const apprentice = createMagicalBeing("Lehrling", 5);
      const familiar = createMagicalBeing("Vertrauter", 3);

      // Create relationships
      apprentice.formFamilialRelationship(
        wizard.id,
        SocialRelationType.MASTER,
        {
          isBloodRelated: false,
          generationDifference: 1,
        }
      );

      wizard.formFamilialRelationship(
        apprentice.id,
        SocialRelationType.APPRENTICE,
        {
          isBloodRelated: false,
          generationDifference: -1,
        }
      );

      familiar.formFamilialRelationship(
        wizard.id,
        SocialRelationType.BONDED_ANIMAL,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      wizard.formFamilialRelationship(familiar.id, SocialRelationType.OWNER, {
        isBloodRelated: false,
        generationDifference: 0,
      });

      // Save creatures
      saveCreature(wizard);
      saveCreature(apprentice);
      saveCreature(familiar);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Magische Wesen erstellt", {
        description:
          "Ein Zauberer, ein Lehrling und ein Vertrauter wurden erstellt",
      });
    } catch (error) {
      console.error("Error creating magical beings:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der magischen Wesen",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of nature creatures
  const createNatureCreatures = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Naturwesen...");

    try {
      // Create nature beings
      const druid = createNatureBeing("Druide", 10);
      const ranger = createNatureBeing("Waldläufer", 8);
      const animalCompanion = createNatureBeing("Tiergefährte", 5);

      // Create relationships
      ranger.formFamilialRelationship(
        druid.id,
        SocialRelationType.KINDRED_SPIRIT,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      druid.formFamilialRelationship(
        ranger.id,
        SocialRelationType.KINDRED_SPIRIT,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      animalCompanion.formFamilialRelationship(
        ranger.id,
        SocialRelationType.BONDED_ANIMAL,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      ranger.formFamilialRelationship(
        animalCompanion.id,
        SocialRelationType.ANIMAL_TRAINER,
        {
          isBloodRelated: false,
          generationDifference: 0,
        }
      );

      // Save creatures
      saveCreature(druid);
      saveCreature(ranger);
      saveCreature(animalCompanion);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Naturwesen erstellt", {
        description:
          "Ein Druide, ein Waldläufer und ein Tiergefährte wurden erstellt",
      });
    } catch (error) {
      console.error("Error creating nature creatures:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Naturwesen",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Helper functions to create different types of creatures

  // Basic creature creation
  const createBasicCreature = (name: string) => {
    const creature = new Creature({
      id: uuidv4(),
      name,
      birthdate: new Date(
        Date.now() - Math.random() * 30 * 365 * 24 * 60 * 60 * 1000
      ), // Random age up to 30 years
      genome: { id: uuidv4(), chromosomes: [] },
      body: createBasicHumanoidBody(),
      memory: { events: [] },
    });

    return creature;
  };

  // Create a warrior with combat skills
  const createWarrior = (name: string, level: number) => {
    const warrior = createBasicCreature(`${name} ${randomSuffix()}`);

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
  };

  // Create a scholar with intellectual skills
  const createScholar = (name: string, level: number) => {
    const scholar = createBasicCreature(`${name} ${randomSuffix()}`);

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
  };

  // Create a craftsman with crafting skills
  const createCraftsman = (name: string, level: number) => {
    const craftsman = createBasicCreature(`${name} ${randomSuffix()}`);

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
  };

  // Create a magical being with arcane skills
  const createMagicalBeing = (name: string, level: number) => {
    const magicalBeing = createBasicCreature(`${name} ${randomSuffix()}`);

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
  };

  // Create a nature-oriented being
  const createNatureBeing = (name: string, level: number) => {
    const natureBeing = createBasicCreature(`${name} ${randomSuffix()}`);

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

    const herbLoreSkill = new Skill();
    herbLoreSkill.id = uuidv4();
    herbLoreSkill.name = "Pflanzenkunde";
    herbLoreSkill.description =
      "Wissen über Pflanzen, ihre Eigenschaften und Verwendungen.";
    herbLoreSkill.category = SkillCategory.INTELLECTUAL;
    herbLoreSkill.level = Math.max(1, level - 1);
    herbLoreSkill.passion = SkillPassion.MINOR;
    natureBeing.skills.push(herbLoreSkill);

    // Set nature-related attributes higher
    natureBeing.physicalAttributes.agility.baseValue = 65 + Math.random() * 25;
    natureBeing.physicalAttributes.endurance.baseValue =
      70 + Math.random() * 20;
    natureBeing.mentalAttributes.intuition.baseValue = 65 + Math.random() * 30;

    return natureBeing;
  };

  // Add loving trait to a creature
  const addLovingTrait = (creature: any) => {
    const lovingTrait = new Trait();
    lovingTrait.id = uuidv4();
    lovingTrait.name = "Liebevoll";
    lovingTrait.description =
      "Zeigt tiefe Gefühle und Zuneigung für nahestehende Personen.";
    lovingTrait.category = TraitCategory.PERSONALITY;
    lovingTrait.impact = TraitImpact.POSITIVE;
    creature.traits.push(lovingTrait);

    // Enhance social attributes
    creature.socialAttributes.empathy.baseValue = 75 + Math.random() * 25;
  };

  // Generate random name suffix for variety
  const randomSuffix = () => {
    const suffixes = [
      "der Tapfere",
      "die Weise",
      "der Starke",
      "die Schnelle",
      "der Kluge",
      "die Mutige",
      "der Geschickte",
      "die Scharfsinnige",
      "von Nordheim",
      "aus Westfels",
      "von Sonnental",
      "aus Finsterwald",
    ];
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentTask || "Wird geladen..."}
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Beispiel-Kreaturen
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Gruppenvorlagen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createFamily}>
          <UserPlus className="mr-2 h-4 w-4" />
          Familie erstellen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createWarriorGroup}>
          <Swords className="mr-2 h-4 w-4" />
          Krieger-Gruppe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createScholarGroup}>
          <Book className="mr-2 h-4 w-4" />
          Gelehrten-Gruppe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createCraftsmenGroup}>
          <Hammer className="mr-2 h-4 w-4" />
          Handwerker-Gruppe
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Spezielle Kreaturen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createCouple}>
          <Heart className="mr-2 h-4 w-4" />
          Liebespaar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createMagicalBeings}>
          <Sparkles className="mr-2 h-4 w-4" />
          Magische Wesen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createNatureCreatures}>
          <Leaf className="mr-2 h-4 w-4" />
          Naturwesen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
