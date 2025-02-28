import { ICreature } from "./creature";

export interface IEvent {
  id: string;
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
