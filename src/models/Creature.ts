// src/models/Creature.ts
import { v4 as uuidv4 } from "uuid";
import { ICreature } from "../interfaces/ICreature";
import { IGenome } from "../interfaces/IGenome";
import { IBody } from "../interfaces/IBody";
import { IMemory } from "../interfaces/IMemory";
import { IGoal } from "../interfaces/IGoal";
import {
  ISkill,
  ITrait,
  IMentalState,
  IPhysicalState,
  ISocialState,
} from "../interfaces/ITrait_ISkill";
import { Body } from "./Body";

export class Creature implements ICreature {
  id: string;
  name: string;
  birthdate: Date;
  genome: IGenome;
  body: IBody;
  memory: IMemory;
  goals: IGoal[];
  skills: ISkill[];
  traits: ITrait[];
  mentalState: IMentalState;
  physicalState: IPhysicalState[];
  socialState: ISocialState;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.birthdate = new Date();

    // Initialize with empty/default values
    this.genome = { id: uuidv4(), chromosomes: [] };
    this.body = new Body();
    this.memory = { events: [] };
    this.goals = [];
    this.skills = [];
    this.traits = [];
    this.mentalState = {
      id: uuidv4(),
      name: "Normal",
      description: "Regular state of mind",
      value: 0,
    };
    this.physicalState = [];
    this.socialState = {
      id: uuidv4(),
      name: "Neutral",
      description: "Normal social standing",
      value: 0,
    };
  }

  // Method to add a skill to the creature
  addSkill(skill: ISkill): void {
    this.skills.push(skill);
  }

  // Method to add a trait to the creature
  addTrait(trait: ITrait): void {
    this.traits.push(trait);
  }

  // Method to add a goal to the creature
  addGoal(goal: IGoal): void {
    this.goals.push(goal);
  }

  // Method to update mental state
  updateMentalState(mentalState: IMentalState): void {
    this.mentalState = mentalState;
  }

  // Method to add or update a physical state
  updatePhysicalState(physicalState: IPhysicalState): void {
    const existingIndex = this.physicalState.findIndex(
      (ps) =>
        ps.id === physicalState.id ||
        (ps.bodyPart.id === physicalState.bodyPart.id &&
          ps.name === physicalState.name)
    );

    if (existingIndex >= 0) {
      this.physicalState[existingIndex] = physicalState;
    } else {
      this.physicalState.push(physicalState);
    }
  }

  // Method to update social state
  updateSocialState(socialState: ISocialState): void {
    this.socialState = socialState;
  }

  // Helper method to calculate age
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
