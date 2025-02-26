import { UUID } from "crypto";
import { IBodyPart } from "./IBody";

// als Referenz :
// - https://rimworldwiki.com/wiki/Skills
// - https://rimworldwiki.com/wiki/Traits
// - https://rimworldwiki.com/wiki/Characters
// - https://dwarffortresswiki.org/index.php/Skill
// - https://dwarffortresswiki.org/index.php/Attribute
// - https://dwarffortresswiki.org/index.php/Attribute
// - https://projectzomboid.fandom.com/wiki/Skills_and_Leveling_Up

export interface ISkill {
  id: UUID;
  name: string;
  description: string;
  level: number;
  experience: number;
}
export interface ITrait {
  id: UUID;
  name: string;
  description: string;
  value: number;
}

export interface IMentalState {
  id: UUID;
  name: string;
  description: string;
  value: number;
}

export interface IPhysicalState {
  id: UUID;
  name: string;
  bodyPart: IBodyPart;
  description: string;
  value: number;
}

export interface ISocialState {
  id: UUID;
  name: string;
  description: string;
  value: number;
}
