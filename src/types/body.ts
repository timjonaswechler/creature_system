// src/types/IBody.ts
import { ITissueLayer } from "./tissue";

/**
 * Represents the entire body of a creature
 */
export interface IBody {
  id: string;
  bodyParts: IBodyPart[];

  // Basic CRUD operations
  addBodyPart(bodyPart: IBodyPart): void;
  removeBodyPart(bodyPart: IBodyPart): void;
  updateBodyPart(bodyPart: IBodyPart): void;

  // Query methods
  getBodyPartById(id: string): IBodyPart;
  getBodyPartID(bodyPart: IBodyPart): string;
  getBodyPartByName(name: string): IBodyPart;
  getAllBodyParts(): IBodyPart[];
  getAllbodyPartsByType(type: string): IBodyPart[];
  getConnectedBodyParts(bodyPart: IBodyPart): IBodyPart[];

  // Traversal method - provides body parts in hierarchical order
  traverseBodyParts(): IBodyPart[];
}

/**
 * Represents a single body part with its properties and connections
 */
export interface IBodyPart {
  id: string;
  name: string;
  type: string; // e.g., "organ", "limb", "bone", etc.
  tissueLayer: ITissueLayer[]; // Tissues that make up this body part
  connections: IBodyPartConnections; // How this part connects to others
}

/**
 * Defines the connections between body parts
 * Each part can have one parent and multiple children
 */
export interface IBodyPartConnections {
  parentConnection?: IPhysicalConnection; // Connection to parent part (null for root part)
  childConnections: IPhysicalConnection[]; // Connections to child parts
}

/**
 * Defines how a body part physically connects to another
 */
export interface IPhysicalConnection {
  targetId: string; // ID of the connected body part
  position: IPosition; // Position information for this connection
  type: PhysicalConnectionType; // Type of physical connection
  properties?: IConnectionProperties; // Optional additional properties
}

/**
 * Defines the relative position of a connection
 * Each property is optional to allow for partial positioning information
 */
export interface IPosition {
  vertical?: VerticalPosition; // Vertical position (top/middle/bottom)
  horizontal?: RelativePosition; // Horizontal position (front/back/side)
  laterality?: Laterality; // Left/right/center orientation
}

/**
 * Additional properties that describe a connection
 */
export interface IConnectionProperties {
  detachable?: boolean; // Whether the connection can be detached
}

// Type definitions for positioning
export type Laterality = "LEFT" | "RIGHT" | "CENTER";
export type VerticalPosition = "TOP" | "MIDDLE" | "BOTTOM";
export type RelativePosition = "FRONT" | "BACK" | "SIDE" | "CENTER";

/**
 * Types of physical connections between body parts
 */
export enum PhysicalConnectionType {
  ATTACHED_TO = "ATTACHED_TO", // External connection (e.g. arm to shoulder)
  CONTAINED_IN = "CONTAINED_IN", // Inside another part (e.g. heart in chest)
  SURROUNDS = "SURROUNDS", // Wraps around another part (e.g. skin around muscle)
  CONNECTED_BY = "CONNECTED_BY", // Connected via another part (e.g. bones connected by joints)
}
