// src/models/Attribute.ts
import { AttributeCategory, IAttribute } from "@/types/attribute";

export class Attribute implements IAttribute {
  id: string;
  name: string;
  category: AttributeCategory;
  baseValue: number;
  currentValue: number;
  maxValue: number;
  lastUsed?: Date;
  rustLevel?: number;

  constructor(params: {
    id: string;
    name: string;
    category: AttributeCategory;
    baseValue?: number;
    maxValue?: number;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.category = params.category;
    this.baseValue = params.baseValue || 50;
    this.maxValue = params.maxValue || 100;
    this.currentValue = this.baseValue;
    this.lastUsed = new Date();
    this.rustLevel = 0;
  }

  calculateEffectiveValue(): number {
    // Berücksichtige Modifikatoren, Status-Effekte usw.
    // Für jetzt einfach den aktuellen Wert zurückgeben
    return Math.min(this.maxValue, Math.max(0, this.currentValue));
  }
}
