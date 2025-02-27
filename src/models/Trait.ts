import { v4 as uuidv4 } from "uuid";
import { ICreature, IThought } from "@/interfaces/ICreature";
import { IAttribute } from "@/interfaces/IAttribute";
import {
  ITrait,
  TraitCategory,
  TraitImpact,
  IMoodModifier,
  IThoughtTrigger,
  MoodConditionType,
  IMoodCondition,
} from "@/interfaces/ITrait";
import { IAttributeModifier } from "@/interfaces/IAttribute";
import { ISkillModifier } from "@/interfaces/ISkill";

// Beispielimplementierung für Traits und deren Auswirkungen
export class Trait implements ITrait {
  id: string;
  name: string;
  description: string;
  category: TraitCategory;
  impact: TraitImpact;

  // Ein Trait kann andere Traits ausschließen (z.B. "Optimist" vs "Pessimist")
  conflictingTraits: string[];

  // Auswirkungen
  attributeModifiers: IAttributeModifier[]; // Permanente Attribute-Änderungen
  skillModifiers: ISkillModifier[]; // Permanente Skill-Änderungen

  moodModifiers: IMoodModifier[]; // Stimmungsänderungen unter Bedingungen
  thoughtTriggers: IThoughtTrigger[]; // Auslöser für bestimmte Gedanken

  // Bei Spectrum-Traits
  spectrumValue?: number; // Wert auf dem Spektrum (-100 bis +100)
  spectrumRange?: [number, number]; // Min/Max-Bereich

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.name = "";
    this.description = "";
    this.category = TraitCategory.PERSONALITY;
    this.impact = TraitImpact.NEUTRAL;
    this.conflictingTraits = [];
    this.attributeModifiers = [];
    this.skillModifiers = [];
    this.moodModifiers = [];
    this.thoughtTriggers = [];
  }

  applyEffects(creature: ICreature): void {
    // Attribut-Modifikatoren anwenden
    for (const mod of this.attributeModifiers) {
      const attribute = this.findAttribute(creature, mod.attributeId);
      if (attribute) {
        // Prozentuale Modifikation
        if (mod.modifierPercent) {
          attribute.currentValue *= 1 + mod.modifierPercent / 100;
        }

        // Absolute Modifikation
        if (mod.modifier) {
          attribute.currentValue += mod.modifier;
        }

        // Auf Grenzen beschränken
        attribute.currentValue = Math.min(
          attribute.maxValue,
          Math.max(0, attribute.currentValue)
        );
      }
    }

    // Skill-Modifikatoren anwenden
    for (const mod of this.skillModifiers) {
      const skill = creature.skills.find((s) => s.id === mod.skillId);
      if (skill) {
        // Level direkt modifizieren
        if (mod.levelModifier) {
          skill.level += mod.levelModifier;
        }

        // Passion setzen
        if (mod.passionChange !== undefined) {
          skill.passion = mod.passionChange;
        }
      }
    }

    // Stimmungs-Modifikatoren prüfen und anwenden
    for (const mod of this.moodModifiers) {
      if (!mod.condition || this.checkCondition(creature, mod.condition)) {
        // Gedanke anwenden
        creature.applyThought({
          id: `thought_from_trait_${this.id}`,
          name: `${this.name} (Trait)`,
          moodEffect: mod.moodChange,
          duration: mod.duration || -1, // -1 für permanent
          remainingTime: mod.duration || -1,
          stackCount: 1,
          stackLimit: 1,
        });
      }
    }

    // Gedanken-Trigger überprüfen
    for (const trigger of this.thoughtTriggers) {
      const conditionsMet = trigger.conditions.every((condition) =>
        this.checkCondition(creature, condition)
      );

      if (conditionsMet && Math.random() < trigger.chance) {
        // Gedanke auslösen basierend auf Traits
        const thought = this.getThoughtById(trigger.thoughtId);
        if (thought) {
          creature.applyThought(thought);
        }
      }
    }
  }

  private findAttribute(
    creature: ICreature,
    attributeId: string
  ): IAttribute | null {
    // Attribut in den verschiedenen Kategorien suchen
    const allAttributes = [
      ...Object.values(creature.physicalAttributes),
      ...Object.values(creature.mentalAttributes),
      ...Object.values(creature.socialAttributes),
    ];

    return allAttributes.find((attr) => attr.id === attributeId) || null;
  }

  private checkCondition(
    creature: ICreature,
    condition: IMoodCondition
  ): boolean {
    // Verschiedene Bedingungstypen überprüfen
    switch (condition.type) {
      case MoodConditionType.ENVIRONMENT:
        // Umgebungsbedingungen prüfen
        return this.checkEnvironmentCondition(creature, condition.parameters);

      case MoodConditionType.SOCIAL:
        // Soziale Bedingungen prüfen
        return this.checkSocialCondition(creature, condition.parameters);

      case MoodConditionType.ACTIVITY:
        // Aktivitätsbedingungen prüfen
        return this.checkActivityCondition(creature, condition.parameters);

      case MoodConditionType.NEED:
        // Bedürfnisbedingungen prüfen
        return this.checkNeedCondition(creature, condition.parameters);

      case MoodConditionType.TIME:
        // Zeitbedingungen prüfen
        return this.checkTimeCondition(creature, condition.parameters);

      default:
        return false;
    }
  }

  // Hilfsmethoden für die verschiedenen Bedingungsprüfungen
  private checkEnvironmentCondition(creature: ICreature, params: any): boolean {
    // Implementiere Umgebungsprüfungen
    return true; // Platzhalterwert
  }

  private checkSocialCondition(creature: ICreature, params: any): boolean {
    // Implementiere soziale Prüfungen
    return true; // Platzhalterwert
  }

  private checkActivityCondition(creature: ICreature, params: any): boolean {
    // Implementiere Aktivitätsprüfungen
    return true; // Platzhalterwert
  }

  private checkNeedCondition(creature: ICreature, params: any): boolean {
    // Implementiere Bedürfnisprüfungen
    return true; // Platzhalterwert
  }

  private checkTimeCondition(creature: ICreature, params: any): boolean {
    // Implementiere Zeitprüfungen
    return true; // Platzhalterwert
  }

  private getThoughtById(thoughtId: string): IThought | null {
    // Implementiere Gedankensuche
    return null; // Platzhalterwert
  }

  getDescription(detailed: boolean): string {
    if (!detailed) {
      return this.description;
    }

    // Ausführliche Beschreibung mit allen Auswirkungen
    let detailedDesc = `${this.description}\n\nEffekte:\n`;

    // Attribut-Modifikatoren
    if (this.attributeModifiers.length > 0) {
      detailedDesc += "\nAttribute:\n";
      for (const mod of this.attributeModifiers) {
        const sign = mod.modifier > 0 ? "+" : "";
        detailedDesc += `- ${mod.attributeId}: ${sign}${mod.modifier}`;
        if (mod.modifierPercent) {
          const signPercent = mod.modifierPercent > 0 ? "+" : "";
          detailedDesc += ` (${signPercent}${mod.modifierPercent}%)`;
        }
        detailedDesc += "\n";
      }
    }

    // Skill-Modifikatoren
    if (this.skillModifiers.length > 0) {
      detailedDesc += "\nFähigkeiten:\n";
      for (const mod of this.skillModifiers) {
        detailedDesc += `- ${mod.skillId}: `;
        if (mod.levelModifier) {
          const sign = mod.levelModifier > 0 ? "+" : "";
          detailedDesc += `${sign}${mod.levelModifier} Level `;
        }
        if (mod.passionChange !== undefined) {
          detailedDesc += `Leidenschaft: ${mod.passionChange} `;
        }
        if (mod.experienceMultiplier !== undefined) {
          detailedDesc += `Erfahrung ×${mod.experienceMultiplier} `;
        }
        detailedDesc += "\n";
      }
    }

    // Stimmungs-Modifikatoren
    if (this.moodModifiers.length > 0) {
      detailedDesc += "\nStimmung:\n";
      for (const mod of this.moodModifiers) {
        const sign = mod.moodChange > 0 ? "+" : "";
        detailedDesc += `- ${sign}${mod.moodChange} `;
        if (mod.condition) {
          detailedDesc += `bei ${this.describeCondition(mod.condition)} `;
        }
        if (mod.duration) {
          detailedDesc += `für ${mod.duration} Ticks`;
        } else {
          detailedDesc += `permanent`;
        }
        detailedDesc += "\n";
      }
    }

    return detailedDesc;
  }

  private describeCondition(condition: IMoodCondition): string {
    // Formatiere Bedingungen lesbar
    switch (condition.type) {
      case MoodConditionType.ENVIRONMENT:
        return `Umgebung: ${condition.parameters.description || "Spezifisch"}`;
      case MoodConditionType.SOCIAL:
        return `Sozial: ${condition.parameters.description || "Spezifisch"}`;
      case MoodConditionType.ACTIVITY:
        return `Aktivität: ${condition.parameters.description || "Spezifisch"}`;
      case MoodConditionType.NEED:
        return `Bedürfnis: ${condition.parameters.description || "Spezifisch"}`;
      case MoodConditionType.TIME:
        return `Zeit: ${condition.parameters.description || "Spezifisch"}`;
      default:
        return "Unbekannte Bedingung";
    }
  }
}
