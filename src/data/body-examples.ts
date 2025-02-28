// src/examples/bodyExamples.ts
import { Body, createBodyPart } from "@/lib/models/body";
import { PhysicalConnectionType } from "@/types/body";

/**
 * Example of creating a basic humanoid body structure
 */
export function createBasicHumanoidBody(): Body {
  const body = new Body();

  // Create main body parts
  const torso = createBodyPart("Torso", "core");
  const head = createBodyPart("Head", "core");
  const leftArm = createBodyPart("Left Arm", "limb");
  const rightArm = createBodyPart("Right Arm", "limb");
  const leftLeg = createBodyPart("Left Leg", "limb");
  const rightLeg = createBodyPart("Right Leg", "limb");

  // Add them to the body
  body.addBodyPart(torso);
  body.addBodyPart(head);
  body.addBodyPart(leftArm);
  body.addBodyPart(rightArm);
  body.addBodyPart(leftLeg);
  body.addBodyPart(rightLeg);

  // Connect head to torso
  body.connectBodyParts(
    torso,
    head,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "TOP",
      horizontal: "CENTER",
      laterality: "CENTER",
    },
    {
      flexibility: 0.7,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect left arm to torso
  body.connectBodyParts(
    torso,
    leftArm,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "TOP",
      horizontal: "SIDE",
      laterality: "LEFT",
    },
    {
      flexibility: 0.9,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect right arm to torso
  body.connectBodyParts(
    torso,
    rightArm,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "TOP",
      horizontal: "SIDE",
      laterality: "RIGHT",
    },
    {
      flexibility: 0.9,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect left leg to torso
  body.connectBodyParts(
    torso,
    leftLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "FRONT",
      laterality: "LEFT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );

  // Connect right leg to torso
  body.connectBodyParts(
    torso,
    rightLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "FRONT",
      laterality: "RIGHT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );
  console.log("body");
  console.log(body);
  return body;
}

/**
 * Example of creating a more detailed body with internal organs
 */
export function createDetailedHumanoidBody(): Body {
  // Start with the basic body
  const body = createBasicHumanoidBody();

  // Get the torso to add organs to it
  const torso = body.getBodyPartByName("Torso");

  // Create internal organs
  const heart = createBodyPart("Heart", "organ");
  const lungs = createBodyPart("Lungs", "organ");
  const liver = createBodyPart("Liver", "organ");
  const stomach = createBodyPart("Stomach", "organ");

  // Add organs to the body
  body.addBodyPart(heart);
  body.addBodyPart(lungs);
  body.addBodyPart(liver);
  body.addBodyPart(stomach);

  // Connect heart to torso (contained within)
  body.connectBodyParts(
    torso,
    heart,
    PhysicalConnectionType.CONTAINED_IN,
    {
      vertical: "TOP",
      horizontal: "CENTER",
      laterality: "CENTER",
    },
    {
      flexibility: 0.2,
      strength: 0.9,
      detachable: false,
    }
  );

  // Connect lungs to torso
  body.connectBodyParts(
    torso,
    lungs,
    PhysicalConnectionType.CONTAINED_IN,
    {
      vertical: "TOP",
      horizontal: "BACK",
      laterality: "CENTER",
    },
    {
      flexibility: 0.3,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect liver to torso
  body.connectBodyParts(
    torso,
    liver,
    PhysicalConnectionType.CONTAINED_IN,
    {
      vertical: "MIDDLE",
      horizontal: "FRONT",
      laterality: "RIGHT",
    },
    {
      flexibility: 0.1,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect stomach to torso
  body.connectBodyParts(
    torso,
    stomach,
    PhysicalConnectionType.CONTAINED_IN,
    {
      vertical: "MIDDLE",
      horizontal: "CENTER",
      laterality: "CENTER",
    },
    {
      flexibility: 0.4,
      strength: 0.7,
      detachable: false,
    }
  );

  return body;
}

/**
 * Example of using the body implementation to create a non-humanoid creature
 */
export function createQuadrupedBody(): Body {
  const body = new Body();

  // Create main body parts
  const torso = createBodyPart("Torso", "core");
  const head = createBodyPart("Head", "core");
  const tail = createBodyPart("Tail", "limb");
  const frontLeftLeg = createBodyPart("Front Left Leg", "limb");
  const frontRightLeg = createBodyPart("Front Right Leg", "limb");
  const backLeftLeg = createBodyPart("Back Left Leg", "limb");
  const backRightLeg = createBodyPart("Back Right Leg", "limb");

  // Add parts to body
  body.addBodyPart(torso);
  body.addBodyPart(head);
  body.addBodyPart(tail);
  body.addBodyPart(frontLeftLeg);
  body.addBodyPart(frontRightLeg);
  body.addBodyPart(backLeftLeg);
  body.addBodyPart(backRightLeg);

  // Connect head to torso
  body.connectBodyParts(
    torso,
    head,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "MIDDLE",
      horizontal: "FRONT",
      laterality: "CENTER",
    },
    {
      flexibility: 0.7,
      strength: 0.8,
      detachable: false,
    }
  );

  // Connect tail to torso
  body.connectBodyParts(
    torso,
    tail,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "MIDDLE",
      horizontal: "BACK",
      laterality: "CENTER",
    },
    {
      flexibility: 0.9,
      strength: 0.6,
      detachable: false,
    }
  );

  // Connect legs
  body.connectBodyParts(
    torso,
    frontLeftLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "FRONT",
      laterality: "LEFT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );

  body.connectBodyParts(
    torso,
    frontRightLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "FRONT",
      laterality: "RIGHT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );

  body.connectBodyParts(
    torso,
    backLeftLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "BACK",
      laterality: "LEFT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );

  body.connectBodyParts(
    torso,
    backRightLeg,
    PhysicalConnectionType.ATTACHED_TO,
    {
      vertical: "BOTTOM",
      horizontal: "BACK",
      laterality: "RIGHT",
    },
    {
      flexibility: 0.8,
      strength: 0.9,
      detachable: false,
    }
  );

  return body;
}
