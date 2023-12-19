import {CellText} from './tableData';

export interface ItemToColor {
  [cellText: CellText]: string;
}

export interface GlobalItemColors {
  newColors: string[]; // REF-3
  existingColors: ItemToColor;
}
