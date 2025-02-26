import { UUID } from "crypto";
import { ICreature } from "./ICreature";

export interface IEvent {
  id: UUID;
  type: EventType;
  timestamp: Date;
  duration?: number;
  description: string;
  location?: ILocation;
  participants?: ICreature[];
}
export enum EventType {
  BIRTH = "BIRTH",
  DEATH = "DEATH",
  MURDER = "MURDER",
}
export interface ILocation {
  name: string;
  coordinates: ICoordinates;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
