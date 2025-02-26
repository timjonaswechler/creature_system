import { UUID } from "crypto";
import { ITissueLayer } from "./ITissue";

export interface IBody {
  id: UUID;
  bodyParts: IBodyPart[];
  addBodyPart(bodyPart: IBodyPart): void;
  removeBodyPart(bodyPart: IBodyPart): void;
  updateBodyPart(bodyPart: IBodyPart): void;

  getBodyPartById(id: UUID): IBodyPart;
  getBodyPartByName(name: string): IBodyPart;
  getAllBodyParts(): IBodyPart[];
  getAllbodyPartsByType(type: string): IBodyPart[];
  getConnectedBodyParts(bodyPart: IBodyPart): IBodyPart[];

  traverseBodyParts(): IBodyPart[];
}

export interface IBodyPart {
  id: string;
  name: string;
  type: string;
  tissueLayer: ITissueLayer[];
  connections: IBodyPartConnections;
}

export interface IBodyPartConnections {
  parentConnection?: IPhysicalConnection; // Verbindung zum Elternteil
  childConnections: IPhysicalConnection[]; // Verbindungen zu Kindteilen
}

export interface IPhysicalConnection {
  targetId: string; // ID des verbundenen Körperteils
  position: IPosition; // Position der Verbindung
  type: PhysicalConnectionType; // Art der physischen Verbindung
  properties?: IConnectionProperties; // Zusätzliche Eigenschaften
}

export interface IPosition {
  vertical?: VerticalPosition; // TOP, MIDDLE, BOTTOM
  horizontal?: RelativePosition; // FRONT, BACK, SIDE
  laterality?: Laterality; // LEFT, RIGHT, CENTER
}

export interface IConnectionProperties {
  flexibility?: number; // 0-1: Wie flexibel ist die Verbindung
  strength?: number; // 0-1: Wie stark ist die Verbindung
  detachable?: boolean; // Kann die Verbindung gelöst werden
}

export type Laterality = "LEFT" | "RIGHT" | "CENTER";
export type VerticalPosition = "TOP" | "MIDDLE" | "BOTTOM";
export type RelativePosition = "FRONT" | "BACK" | "SIDE" | "CENTER";

export enum PhysicalConnectionType {
  ATTACHED_TO = "ATTACHED_TO", // External connection (e.g. arm to shoulder)
  CONTAINED_IN = "CONTAINED_IN", // Inside another part (e.g. heart in chest)
  SURROUNDS = "SURROUNDS", // Wraps around another part (e.g. skin around muscle)
  CONNECTED_BY = "CONNECTED_BY", // Connected via another part (e.g. bones connected by joints)
}
