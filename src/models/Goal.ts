// src/models/Goal.ts
import { v4 as uuidv4 } from "uuid";
import { ICreature } from "@/interfaces/ICreature";
import {
  IGoal,
  GoalStatus,
  GoalType,
  goalDetailsMap,
} from "@/interfaces/IGoal";

export class Goal implements IGoal {
  id: string;
  name: string;
  description: string;
  priority: number;
  deadline?: Date;
  status: GoalStatus;
  subgoals: IGoal[];
  progress?: number;
  realizedDate?: Date;
  requirements?: string[];
  moodEffect?: number;

  constructor(params?: Partial<IGoal>) {
    this.id = params?.id || uuidv4();
    this.name = params?.name || "";
    this.description = params?.description || "";
    this.priority = params?.priority || 3; // Default medium priority
    this.deadline = params?.deadline;
    this.status = params?.status || GoalStatus.OPEN;
    this.subgoals = params?.subgoals || [];
    this.progress = params?.progress || 0;
    this.realizedDate = params?.realizedDate;
    this.requirements = params?.requirements || [];
    this.moodEffect = params?.moodEffect || 10; // Default modest mood bonus
  }

  /**
   * Creates a goal from a predefined goal type
   */
  static fromGoalType(type: GoalType): Goal {
    const details = goalDetailsMap[type];

    return new Goal({
      name: type,
      description: details.description,
      priority: details.priority,
      requirements: details.realizationConditions,
      moodEffect: details.moodBonus,
      status: GoalStatus.OPEN,
    });
  }

  /**
   * Updates the progress of a goal based on its subgoals
   */
  updateProgress(): number {
    if (this.subgoals.length === 0) {
      return this.progress || 0;
    }

    // Calculate progress based on subgoals
    const totalSubgoals = this.subgoals.length;
    const completedSubgoals = this.subgoals.filter(
      (sg) => sg.status === GoalStatus.DONE || sg.status === GoalStatus.REALIZED
    ).length;

    this.progress = Math.round((completedSubgoals / totalSubgoals) * 100);
    return this.progress;
  }

  /**
   * Marks a goal as realized (completed) and updates the creature's mood
   */
  realize(creature: ICreature) {
    if (
      this.status !== GoalStatus.DONE &&
      this.status !== GoalStatus.REALIZED
    ) {
      this.status = GoalStatus.REALIZED;
      this.realizedDate = new Date();

      // Add a happy thought for realizing a life goal
      if (this.moodEffect && this.moodEffect > 0) {
        creature.applyThought({
          id: `thought_goal_realized_${this.id}`,
          name: `Realized Life Goal: ${this.name}`,
          moodEffect: this.moodEffect,
          duration: 60, // Long-lasting happiness (60 days)
          remainingTime: 60,
          stackCount: 1,
          stackLimit: 1,
        });
      }
    }
  }

  /**
   * Checks if a goal should be realized based on certain conditions
   */
  checkForRealization(creature: ICreature): boolean {
    // This would be enhanced with specific condition checks
    // For now, a simple implementation that just checks for known goals

    const goalType = this.name as GoalType;

    switch (goalType) {
      case GoalType.MASTER_A_SKILL:
        // Check if any skill is at legendary level
        const hasLegendarySkill = creature.skills.some(
          (skill) => skill.level >= 16
        );
        if (hasLegendarySkill) {
          this.realize(creature);
          return true;
        }
        break;

      // Additional goal type checks would be added here

      default:
        // For custom goals or unimplemented checks, no auto-realization
        break;
    }

    return false;
  }

  /**
   * Adds a subgoal to this goal
   */
  addSubgoal(subgoal: IGoal): void {
    this.subgoals.push(subgoal);
    this.updateProgress();
  }

  /**
   * Removes a subgoal from this goal
   */
  removeSubgoal(subgoalId: string): void {
    this.subgoals = this.subgoals.filter((sg) => sg.id !== subgoalId);
    this.updateProgress();
  }
}
