// src/interfaces/IGoal.ts
export interface IGoal {
  id: string;
  name: string;
  description: string;
  priority: number; // Higher number = higher priority
  deadline?: Date; // Optional deadline
  status: GoalStatus;
  subgoals: IGoal[]; // Nested subgoals
  progress?: number; // Progress percentage (0-100)
  realizedDate?: Date; // When the goal was realized/completed
  requirements?: string[]; // List of requirements to complete this goal
  moodEffect?: number; // Mood bonus when completing the goal
}

export enum GoalStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  FAILED = "FAILED",
  REALIZED = "REALIZED", // Special status for life goals that have been realized
}

// Goal types based on Dwarf Fortress
export enum GoalType {
  START_A_FAMILY = "START_A_FAMILY",
  RULE_THE_WORLD = "RULE_THE_WORLD",
  CREATE_A_GREAT_WORK_OF_ART = "CREATE_A_GREAT_WORK_OF_ART",
  CRAFT_A_MASTERWORK = "CRAFT_A_MASTERWORK",
  BRING_PEACE_TO_THE_WORLD = "BRING_PEACE_TO_THE_WORLD",
  BECOME_A_LEGENDARY_WARRIOR = "BECOME_A_LEGENDARY_WARRIOR",
  MASTER_A_SKILL = "MASTER_A_SKILL",
  FALL_IN_LOVE = "FALL_IN_LOVE",
  SEE_THE_GREAT_NATURAL_SITES = "SEE_THE_GREAT_NATURAL_SITES",
  IMMORTALITY = "IMMORTALITY",
  MAKE_A_GREAT_DISCOVERY = "MAKE_A_GREAT_DISCOVERY",
  ATTAIN_RANK_IN_SOCIETY = "ATTAIN_RANK_IN_SOCIETY",
  BATHE_WORLD_IN_CHAOS = "BATHE_WORLD_IN_CHAOS",
  STAY_ALIVE = "STAY_ALIVE",
  CUSTOM = "CUSTOM",
}

// Goal details descriptions
export interface GoalDetails {
  description: string;
  realizationConditions: string[];
  moodBonus: number;
  priority: number;
}

// Map of goal types to their details
export const goalDetailsMap: Record<GoalType, GoalDetails> = {
  [GoalType.START_A_FAMILY]: {
    description: "Dreams of raising a family",
    realizationConditions: ["Give birth to or father a child"],
    moodBonus: 20,
    priority: 5,
  },
  [GoalType.RULE_THE_WORLD]: {
    description: "Dreams of ruling the world",
    realizationConditions: [
      "Become a ruler of a civilization",
      "Conquer multiple regions",
    ],
    moodBonus: 30,
    priority: 10,
  },
  [GoalType.CREATE_A_GREAT_WORK_OF_ART]: {
    description: "Dreams of creating a great work of art",
    realizationConditions: ["Create an artifact or masterpiece artwork"],
    moodBonus: 15,
    priority: 5,
  },
  [GoalType.CRAFT_A_MASTERWORK]: {
    description: "Dreams of crafting a masterwork someday",
    realizationConditions: ["Create a masterwork quality item"],
    moodBonus: 15,
    priority: 5,
  },
  [GoalType.BRING_PEACE_TO_THE_WORLD]: {
    description: "Dreams of bringing lasting peace to the world",
    realizationConditions: [
      "Establish peace treaties between warring factions",
    ],
    moodBonus: 25,
    priority: 8,
  },
  [GoalType.BECOME_A_LEGENDARY_WARRIOR]: {
    description: "Dreams of becoming a legendary warrior",
    realizationConditions: [
      "Achieve legendary status in combat skills",
      "Defeat notable enemies",
    ],
    moodBonus: 20,
    priority: 7,
  },
  [GoalType.MASTER_A_SKILL]: {
    description: "Dreams of mastering a skill",
    realizationConditions: ["Reach legendary status in any skill"],
    moodBonus: 15,
    priority: 5,
  },
  [GoalType.FALL_IN_LOVE]: {
    description: "Dreams of falling in love",
    realizationConditions: [
      "Form a romantic relationship with another creature",
    ],
    moodBonus: 15,
    priority: 5,
  },
  [GoalType.SEE_THE_GREAT_NATURAL_SITES]: {
    description: "Dreams of seeing the great natural places of the world",
    realizationConditions: ["Visit notable natural landmarks"],
    moodBonus: 10,
    priority: 3,
  },
  [GoalType.IMMORTALITY]: {
    description: "Has become obsessed with their own mortality",
    realizationConditions: [
      "Discover the secrets of immortality",
      "Become a necromancer",
    ],
    moodBonus: 30,
    priority: 10,
  },
  [GoalType.MAKE_A_GREAT_DISCOVERY]: {
    description: "Dreams of making a great discovery",
    realizationConditions: ["Discover a new scientific or magical principle"],
    moodBonus: 18,
    priority: 6,
  },
  [GoalType.ATTAIN_RANK_IN_SOCIETY]: {
    description: "Dreams of attaining rank in society",
    realizationConditions: [
      "Become a noble",
      "Achieve a position of authority",
    ],
    moodBonus: 15,
    priority: 5,
  },
  [GoalType.BATHE_WORLD_IN_CHAOS]: {
    description: "Dreams of bathing the world in chaos",
    realizationConditions: ["Cause widespread destruction", "Start wars"],
    moodBonus: 25,
    priority: 8,
  },
  [GoalType.STAY_ALIVE]: {
    description: "Dreams of staying alive at all costs",
    realizationConditions: ["Survive a near-death experience"],
    moodBonus: 10,
    priority: 5,
  },
  [GoalType.CUSTOM]: {
    description: "Has a personal goal",
    realizationConditions: ["Complete custom conditions"],
    moodBonus: 15,
    priority: 5,
  },
};
