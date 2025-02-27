export interface IGoal {
  id: string;
  name: string;
  description: string;
  priority: number;
  deadline?: Date;
  status: GoalStatus;
  subgoals: IGoal[];
}

export enum GoalStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  FAILED = "FAILED",
}
// https://dwarffortresswiki.org/index.php/Personality_goal
