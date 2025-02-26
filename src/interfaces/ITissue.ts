import { IMaterial } from "./IMaterial";

export interface ITissueLayer {
  material: IMaterial;
  thickness: number;
  order: number;
}
