import { IMaterial } from "./material";

export interface ITissueLayer {
  material: IMaterial;
  thickness: number;
  order: number;
}
