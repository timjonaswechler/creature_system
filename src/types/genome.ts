export interface IGenome {
  id: string;
  chromosomes: IChromosome[];
}

export interface IChromosome {
  id: string;
  genes: IGene[];
}

export interface IGene {
  // TODO: Allele und so weiter
  id: string;
  name: string;
  value: any;
}
