// src/models/Body.ts
import { v4 as uuidv4 } from "uuid";
import { ITissueLayer } from "@/interfaces/ITissue";
import {
  IBody,
  IBodyPart,
  IPosition,
  IPhysicalConnection,
  PhysicalConnectionType,
} from "@/interfaces/IBody";

export class Body implements IBody {
  id: string;
  bodyParts: IBodyPart[];

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.bodyParts = [];
  }

  addBodyPart(bodyPart: IBodyPart): void {
    // Check if body part already exists
    if (this.bodyParts.some((part) => part.id === bodyPart.id)) {
      throw new Error(`Body part with ID ${bodyPart.id} already exists`);
    }
    this.bodyParts.push(bodyPart);
  }

  removeBodyPart(bodyPart: IBodyPart): void {
    // Find the body part to remove
    const index = this.bodyParts.findIndex((part) => part.id === bodyPart.id);
    if (index === -1) {
      throw new Error(`Body part with ID ${bodyPart.id} not found`);
    }

    // Remove connections to this body part from other parts
    this.bodyParts.forEach((part) => {
      // Filter out child connections to the removed part
      part.connections.childConnections =
        part.connections.childConnections.filter(
          (conn) => conn.targetId !== bodyPart.id
        );
    });

    // Handle parent connection cleanup if this part is being removed
    if (bodyPart.connections.parentConnection) {
      const parentId = bodyPart.connections.parentConnection.targetId;
      const parent = this.getBodyPartById(parentId);

      // Remove the child connection from the parent
      parent.connections.childConnections =
        parent.connections.childConnections.filter(
          (conn) => conn.targetId !== bodyPart.id
        );
    }

    // Remove the body part
    this.bodyParts.splice(index, 1);
  }

  updateBodyPart(bodyPart: IBodyPart): void {
    const index = this.bodyParts.findIndex((part) => part.id === bodyPart.id);
    if (index === -1) {
      throw new Error(`Body part with ID ${bodyPart.id} not found`);
    }
    this.bodyParts[index] = bodyPart;
  }

  getBodyPartById(id: string): IBodyPart {
    const bodyPart = this.bodyParts.find((part) => part.id === id);
    if (!bodyPart) {
      throw new Error(`Body part with ID ${id} not found`);
    }
    return bodyPart;
  }

  getBodyPartID(bodyPart: IBodyPart): string {
    return bodyPart.id;
  }

  getBodyPartByName(name: string): IBodyPart {
    const bodyPart = this.bodyParts.find((part) => part.name === name);
    if (!bodyPart) {
      throw new Error(`Body part with name ${name} not found`);
    }
    return bodyPart;
  }

  getAllBodyParts(): IBodyPart[] {
    return [...this.bodyParts];
  }

  getAllbodyPartsByType(type: string): IBodyPart[] {
    return this.bodyParts.filter((part) => part.type === type);
  }

  getConnectedBodyParts(bodyPart: IBodyPart): IBodyPart[] {
    const connectedParts: IBodyPart[] = [];

    // Add parent if exists
    if (bodyPart.connections.parentConnection) {
      try {
        const parentPart = this.getBodyPartById(
          bodyPart.connections.parentConnection.targetId
        );
        connectedParts.push(parentPart);
      } catch (error) {
        console.warn(`Parent body part not found: ${error}`);
      }
    }

    // Add all children
    for (const childConn of bodyPart.connections.childConnections) {
      try {
        const childPart = this.getBodyPartById(childConn.targetId);
        connectedParts.push(childPart);
      } catch (error) {
        console.warn(`Child body part not found: ${error}`);
      }
    }

    return connectedParts;
  }

  traverseBodyParts(): IBodyPart[] {
    // Find the root body part (one with no parent)
    const rootPart = this.bodyParts.find(
      (part) => !part.connections.parentConnection
    );
    if (!rootPart) {
      return [];
    }

    // Traverse the tree
    const result: IBodyPart[] = [];
    this.traverseFromPart(rootPart, result);
    return result;
  }

  private traverseFromPart(part: IBodyPart, result: IBodyPart[]): void {
    result.push(part);

    // Process all children recursively
    for (const childConn of part.connections.childConnections) {
      try {
        const childPart = this.getBodyPartById(childConn.targetId);
        this.traverseFromPart(childPart, result);
      } catch (error) {
        console.warn(`Error traversing to child part: ${error}`);
      }
    }
  }

  // Helper method to connect body parts
  connectBodyParts(
    parentPart: IBodyPart,
    childPart: IBodyPart,
    connectionType: PhysicalConnectionType,
    position: IPosition,
    properties?: {
      flexibility?: number;
      strength?: number;
      detachable?: boolean;
    }
  ): void {
    // Create the physical connection from child to parent
    const childToParentConnection: IPhysicalConnection = {
      targetId: parentPart.id,
      position,
      type: connectionType,
      properties: properties || {},
    };

    // Create the physical connection from parent to child
    const parentToChildConnection: IPhysicalConnection = {
      targetId: childPart.id,
      position,
      type: connectionType,
      properties: properties || {},
    };

    // Set the parent connection for the child
    childPart.connections.parentConnection = childToParentConnection;

    // Add child connection to the parent
    parentPart.connections.childConnections.push(parentToChildConnection);

    // Update both parts in the body
    this.updateBodyPart(parentPart);
    this.updateBodyPart(childPart);
  }
}

// Factory function to create a new body part
export function createBodyPart(
  name: string,
  type: string,
  tissueLayers: ITissueLayer[] = []
): IBodyPart {
  return {
    id: uuidv4(),
    name,
    type,
    tissueLayer: tissueLayers,
    connections: {
      childConnections: [],
    },
  };
}
