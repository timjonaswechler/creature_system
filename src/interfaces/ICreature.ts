import { IGenome } from "./IGenome";
import { IBody } from "./IBody";
import { IMemory } from "./IMemory";
import { IGoal } from "./IGoal";
import {
  ISkill,
  ITrait,
  IMentalState,
  IPhysicalState,
  ISocialState,
} from "./ITrait_ISkill";

export interface ICreature {
  id: string;
  name: string;
  birthdate: Date; //TODO: longterm Goal own in house Dateformat
  genome: IGenome;
  body: IBody;
  // brain: IBrain;
  memory: IMemory; // Eventlog
  goals: IGoal[]; // List of goals
  skills: ISkill[]; // List of skills ( learned behaviors, social skills, etc. )
  traits: ITrait[]; // List of traits ( personality, physical, etc. )
  mentalState: IMentalState; // Current mental state
  physicalState: IPhysicalState[]; // summary of th bodyPart issues
  socialState: ISocialState; // Current social state
}
