// src/utils/creatureManager.ts
import { v4 as uuidv4 } from "uuid"; // Du musst dieses Paket installieren: npm install uuid @types/uuid
import { ICreature } from "@/interfaces/ICreature";

export const STORAGE_KEY = "creatures";

/**
 * Speichert eine Kreatur im localStorage
 */
export const saveCreature = (creature: ICreature): void => {
  // Aktuelle Kreaturen laden
  const storedCreatures = getCreatures();

  // Neue Kreatur hinzufügen/aktualisieren
  const updatedCreatures = {
    ...storedCreatures,
    [creature.id]: creature,
  };

  // Zurück in localStorage speichern
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCreatures));
};

/**
 * Lädt alle Kreaturen aus dem localStorage
 */
export const getCreatures = (): Record<string, ICreature> => {
  const storedCreatures = localStorage.getItem(STORAGE_KEY);
  return storedCreatures ? JSON.parse(storedCreatures) : {};
};

/**
 * Lädt eine einzelne Kreatur anhand ihrer ID
 */
export const getCreatureById = (id: string): ICreature | null => {
  const creatures = getCreatures();
  return creatures[id] || null;
};

/**
 * Erstellt eine neue Kreatur mit Standardwerten
 */
export const createNewCreature = (name: string): ICreature => {
  // Hier erstellst du eine neue Kreatur mit allen erforderlichen Eigenschaften
  // und setzt sinnvolle Standardwerte
  const newCreature: ICreature = {
    id: uuidv4(),
    name: name,
    birthdate: new Date(),
    genome: { id: uuidv4(), chromosomes: [] },
    body: {
      id: uuidv4(),
      bodyParts: [],
      addBodyPart: () => {},
      removeBodyPart: () => {},
      updateBodyPart: () => {},
      getBodyPartById: () => ({
        id: "",
        name: "",
        type: "HEAD",
        tissueLayer: [],
        connections: { childConnections: [] },
      }),
      getBodyPartByName: () => ({
        id: "",
        name: "",
        type: "HEAD",
        tissueLayer: [],
        connections: { childConnections: [] },
      }),
      getAllBodyParts: () => [],
      getAllbodyPartsByType: () => [],
      getConnectedBodyParts: () => [],
      traverseBodyParts: () => [],
    },
    memory: { events: [] },
    goals: [],
    skills: [],
    traits: [],
    mentalState: {
      id: uuidv4(),
      name: "Normal",
      description: "Regular state of mind",
      value: 0,
    },
    physicalState: [],
    socialState: {
      id: uuidv4(),
      name: "Neutral",
      description: "Normal social standing",
      value: 0,
    },
  };

  return newCreature;
};

/**
 * Löscht eine Kreatur anhand ihrer ID
 */
export const deleteCreature = (id: string): void => {
  const creatures = getCreatures();
  if (creatures[id]) {
    delete creatures[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creatures));
  }
};

/**
 * Löscht alle Kreaturen
 */
export const deleteAllCreatures = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
