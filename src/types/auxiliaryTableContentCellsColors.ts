import {CellStateColorProperties} from './cellStateColors';

export interface AuxiliaryContentCellColors {
  defaultColor: Required<CellStateColorProperties>;
  hoverColor: Required<CellStateColorProperties>;
}

export interface AuxiliaryContentCellsColors {
  data: AuxiliaryContentCellColors;
  header: AuxiliaryContentCellColors;
}
