import {
  ISkill,
  SkillCategory,
  SkillPassion,
  EXPERIENCE_THRESHOLDS,
  SKILL_LEVEL_NAMES,
} from "../interfaces/ISkill";
import { IAttribute } from "../interfaces/IAttribute";
import { v4 as uuidv4 } from "uuid";

// Beispielimplementierung für Skill-XP-Gewinn und Verfall
export class Skill implements ISkill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;

  // Skill-Levels
  level: number; // Aktuelles Level (0-20)
  experience: number; // Angesammelte XP
  passion: SkillPassion; // Wie in RimWorld

  // Verknüpfung mit Attributen
  primaryAttributes: IAttribute[]; // Hauptattribute, die diesen Skill beeinflussen
  secondaryAttributes: IAttribute[]; // Sekundäre Attribute mit geringerem Einfluss

  // Skill-Verfall wie in Dwarf Fortress
  unusedCounter: number; // Zählt die Tage seit letzter Verwendung
  rustCounter: number; // Rostlevel, das durch Nichtbenutzung entsteht
  demotionCounter: number; // Zählt wie nahe der Skill davor ist, ein Level zu verlieren

  // Optional: Learning Rate Modifier (wie viel Erfahrung beim Ausführen gesammelt wird)
  learningRateModifier: number;
  constructor(id?: string) {
    this.id = id || uuidv4();
    this.name = "";
    this.description = "";
    this.category = SkillCategory.CRAFTING;
    this.level = 0;
    this.experience = 0;
    this.passion = SkillPassion.NONE;
    this.primaryAttributes = [];
    this.secondaryAttributes = [];
    this.unusedCounter = 0;
    this.rustCounter = 0;
    this.demotionCounter = 0;
    this.learningRateModifier = 1.0;
  }

  gainExperience(amount: number): void {
    // Passion-Modifikator anwenden
    let modifiedAmount = amount;
    switch (this.passion) {
      case SkillPassion.NONE:
        modifiedAmount *= 0.35;
        break;
      case SkillPassion.MINOR:
        modifiedAmount *= 1.0;
        break;
      case SkillPassion.MAJOR:
        modifiedAmount *= 1.5;
        break;
      case SkillPassion.BURNING:
        modifiedAmount *= 2.0;
        break;
    }

    // Attribut-basierte Modifikatoren
    let attrMultiplier = 1.0;

    // Primärattribute stärker gewichten
    for (const attr of this.primaryAttributes) {
      attrMultiplier += (attr.calculateEffectiveValue() - 50) / 500;
    }

    // Sekundärattribute schwächer gewichten
    for (const attr of this.secondaryAttributes) {
      attrMultiplier += (attr.calculateEffectiveValue() - 50) / 1250;
    }

    // Erfahrung anwenden
    this.experience += modifiedAmount * attrMultiplier;

    // Skill-Verfall zurücksetzen
    this.unusedCounter = 0;
    if (this.rustCounter > 0) this.rustCounter--;
    if (this.demotionCounter > 0) this.demotionCounter--;

    // Level-Aufstieg prüfen
    this.checkForLevelUp();
  }

  checkForLevelUp(): boolean {
    const nextLevelThreshold = EXPERIENCE_THRESHOLDS[this.level + 1];
    if (nextLevelThreshold && this.experience >= nextLevelThreshold) {
      this.level++;
      return true;
    }
    return false;
  }

  applyRust(): void {
    // Täglicher Verfall-Check (wie in DF)
    this.unusedCounter++;

    // Wenn der Skill lange genug ungenutzt ist
    if (this.unusedCounter >= 8) {
      // 8 Tage Inaktivität
      this.unusedCounter = 0;
      this.rustCounter++;

      // Wenn genug Rost angesammelt wurde
      if (this.rustCounter >= 16) {
        // 16 Rosteinheiten
        this.rustCounter = 0;
        this.demotionCounter++;

        // Wenn genug Deleveling-Counter angesammelt wurden
        if (this.demotionCounter >= 16) {
          // 16 Deleveling-Punkte
          this.demotionCounter = 0;
          if (this.level > 0) {
            this.level--;
            this.experience = EXPERIENCE_THRESHOLDS[this.level];
          }
        }
      }
    }
  }

  getEffectiveLevel(): number {
    // Bei niedrigen Levels tritt Rost nicht so stark auf
    let effectiveRust = 0;

    if (this.level > 0) {
      const rustFactor = Math.min(6, this.rustCounter / 2);

      // Berechne effektiven Rost basierend auf Level
      // Höhere Level können mehr Rost akkumulieren
      if (this.level >= 4 && rustFactor >= 3) {
        effectiveRust = 2; // "Very Rusty" (V.Rusty)
      } else if (rustFactor > 0) {
        effectiveRust = 1; // "Rusty"
      }
    }

    return Math.max(0, this.level - effectiveRust);
  }

  getDisplayName(): string {
    const baseName = SKILL_LEVEL_NAMES[this.level];

    // Rost anzeigen
    if (this.level > 0) {
      const rustFactor = this.rustCounter / 2;

      if (this.level >= 4 && rustFactor >= 3) {
        return `${baseName} (V.Rusty)`;
      } else if (rustFactor > 0) {
        return `${baseName} (Rusty)`;
      }
    }

    // Legendary+ für höhere Stufen
    if (this.level > 16) {
      const plusCount = this.level - 16;
      return `${baseName}${"+".repeat(plusCount)}`;
    }

    return baseName;
  }
}
