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
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
}
export interface ITrait {
  id: string;
  name: string;
  description: string;
  value: number;
}

export interface IMentalState {
  id: string;
  name: string;
  description: string;
  value: number;
}

export interface IPhysicalState {
  id: string;
  name: string;
  bodyPart: IBodyPart;
  description: string;
  value: number;
}

export interface ISocialState {
  id: string;
  name: string;
  description: string;
  value: number;
}
