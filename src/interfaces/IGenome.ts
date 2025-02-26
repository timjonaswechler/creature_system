import { UUID } from "crypto";

export interface IGenome {
  id: UUID;
  chromosomes: IChromosome[];
}

export interface IChromosome {
  id: UUID;
  genes: IGene[];
}

export interface IGene {
  // TODO: Allele und so weiter
  id: UUID;
  name: string;
  value: any;
}
