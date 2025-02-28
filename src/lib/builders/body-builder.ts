// src/lib/builders/body-builder.ts
import { v4 as uuidv4 } from "uuid";
import { Body, createBodyPart } from "@/lib/models/body";
import {
  PhysicalConnectionType,
  IBodyPart,
  IPosition,
  IConnectionProperties,
} from "@/types/body";

/**
 * Builder-Klasse für die Erstellung von verschiedenen Körpertypen
 */
export class BodyBuilder {
  private body: Body;
  private bodyParts: Map<string, IBodyPart> = new Map();

  constructor() {
    this.body = new Body();
  }

  /**
   * Erstellt einen neuen BodyBuilder
   */
  public static create(): BodyBuilder {
    return new BodyBuilder();
  }

  /**
   * Fügt einen Körperteil hinzu und merkt ihn sich für spätere Verbindungen
   */
  public addPart(name: string, type: string): BodyBuilder {
    const part = createBodyPart(name, type);
    this.body.addBodyPart(part);
    this.bodyParts.set(name, part);
    return this;
  }

  /**
   * Verbindet zwei Körperteile miteinander
   */
  public connectParts(
    parentName: string,
    childName: string,
    connectionType: PhysicalConnectionType,
    position: IPosition,
    properties?: IConnectionProperties
  ): BodyBuilder {
    const parent = this.bodyParts.get(parentName);
    const child = this.bodyParts.get(childName);

    if (!parent || !child) {
      throw new Error(
        `Körperteile nicht gefunden: ${parentName} oder ${childName}`
      );
    }

    this.body.connectBodyParts(
      parent,
      child,
      connectionType,
      position,
      properties || { flexibility: 0.7, strength: 0.8, detachable: false }
    );

    return this;
  }

  /**
   * Baut einen grundlegenden humanoiden Körper
   */
  public buildHumanoid(): Body {
    // Körperteile erstellen
    this.addPart("Torso", "core");
    this.addPart("Head", "core");
    this.addPart("Left Arm", "limb");
    this.addPart("Right Arm", "limb");
    this.addPart("Left Leg", "limb");
    this.addPart("Right Leg", "limb");

    // Kopf mit Torso verbinden
    this.connectParts(
      "Torso",
      "Head",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "CENTER",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    // Linken Arm mit Torso verbinden
    this.connectParts(
      "Torso",
      "Left Arm",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "SIDE",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    // Rechten Arm mit Torso verbinden
    this.connectParts(
      "Torso",
      "Right Arm",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "SIDE",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    // Linkes Bein mit Torso verbinden
    this.connectParts(
      "Torso",
      "Left Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "FRONT",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    // Rechtes Bein mit Torso verbinden
    this.connectParts(
      "Torso",
      "Right Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "FRONT",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    return this.body;
  }

  /**
   * Baut einen detaillierten humanoiden Körper mit inneren Organen
   */
  public buildDetailedHumanoid(): Body {
    // Grundlegenden humanoiden Körper erstellen
    this.buildHumanoid();

    // Innere Organe hinzufügen
    this.addPart("Heart", "organ");
    this.addPart("Lungs", "organ");
    this.addPart("Liver", "organ");
    this.addPart("Stomach", "organ");

    // Organe mit Torso verbinden
    this.connectParts(
      "Torso",
      "Heart",
      PhysicalConnectionType.CONTAINED_IN,
      {
        vertical: "TOP",
        horizontal: "CENTER",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Lungs",
      PhysicalConnectionType.CONTAINED_IN,
      {
        vertical: "TOP",
        horizontal: "BACK",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Liver",
      PhysicalConnectionType.CONTAINED_IN,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Stomach",
      PhysicalConnectionType.CONTAINED_IN,
      {
        vertical: "MIDDLE",
        horizontal: "CENTER",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    return this.body;
  }

  /**
   * Baut einen vierbeinigen (Quadruped) Körper
   */
  public buildQuadruped(): Body {
    // Körperteile erstellen
    this.addPart("Torso", "core");
    this.addPart("Head", "core");
    this.addPart("Tail", "limb");
    this.addPart("Front Left Leg", "limb");
    this.addPart("Front Right Leg", "limb");
    this.addPart("Back Left Leg", "limb");
    this.addPart("Back Right Leg", "limb");

    // Kopf mit Torso verbinden
    this.connectParts(
      "Torso",
      "Head",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    // Schwanz mit Torso verbinden
    this.connectParts(
      "Torso",
      "Tail",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "BACK",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    // Beine mit Torso verbinden
    this.connectParts(
      "Torso",
      "Front Left Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "FRONT",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Front Right Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "FRONT",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Back Left Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "BACK",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Back Right Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "BACK",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    return this.body;
  }

  /**
   * Baut einen Vogel-Körper
   */
  public buildBirdBody(): Body {
    // Körperteile erstellen
    this.addPart("Torso", "core");
    this.addPart("Head", "core");
    this.addPart("Left Wing", "limb");
    this.addPart("Right Wing", "limb");
    this.addPart("Left Leg", "limb");
    this.addPart("Right Leg", "limb");
    this.addPart("Tail", "limb");

    // Kopf mit Torso verbinden
    this.connectParts(
      "Torso",
      "Head",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    // Flügel mit Torso verbinden
    this.connectParts(
      "Torso",
      "Left Wing",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "SIDE",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Right Wing",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "TOP",
        horizontal: "SIDE",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    // Beine mit Torso verbinden
    this.connectParts(
      "Torso",
      "Left Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "CENTER",
        laterality: "LEFT",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Torso",
      "Right Leg",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "BOTTOM",
        horizontal: "CENTER",
        laterality: "RIGHT",
      },
      {
        detachable: false,
      }
    );

    // Schwanz mit Torso verbinden
    this.connectParts(
      "Torso",
      "Tail",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "BACK",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    return this.body;
  }

  /**
   * Baut einen Schlangen-Körper
   */
  public buildSnakeBody(): Body {
    // Körperteile erstellen
    this.addPart("Head", "core");
    this.addPart("Neck", "core");
    this.addPart("Body Front", "core");
    this.addPart("Body Middle", "core");
    this.addPart("Body Back", "core");
    this.addPart("Tail", "limb");

    // Teile verbinden
    this.connectParts(
      "Neck",
      "Head",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Body Front",
      "Neck",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Body Middle",
      "Body Front",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Body Back",
      "Body Middle",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "FRONT",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    this.connectParts(
      "Body Back",
      "Tail",
      PhysicalConnectionType.ATTACHED_TO,
      {
        vertical: "MIDDLE",
        horizontal: "BACK",
        laterality: "CENTER",
      },
      {
        detachable: false,
      }
    );

    return this.body;
  }

  /**
   * Baut einen benutzerdefinierten Körper und gibt ihn zurück
   */
  public build(): Body {
    return this.body;
  }

  /**
   * Statische Factory-Methode für einen humanoiden Körper
   */
  public static createHumanoidBody(): Body {
    return new BodyBuilder().buildHumanoid();
  }

  /**
   * Statische Factory-Methode für einen detaillierten humanoiden Körper
   */
  public static createDetailedHumanoidBody(): Body {
    return new BodyBuilder().buildDetailedHumanoid();
  }

  /**
   * Statische Factory-Methode für einen Quadruped-Körper
   */
  public static createQuadrupedBody(): Body {
    return new BodyBuilder().buildQuadruped();
  }

  /**
   * Statische Factory-Methode für einen Vogel-Körper
   */
  public static createBirdBody(): Body {
    return new BodyBuilder().buildBirdBody();
  }

  /**
   * Statische Factory-Methode für einen Schlangen-Körper
   */
  public static createSnakeBody(): Body {
    return new BodyBuilder().buildSnakeBody();
  }
}
