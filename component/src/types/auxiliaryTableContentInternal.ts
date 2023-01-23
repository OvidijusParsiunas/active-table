import {AuxiliaryTableContentDisplayProps, AuxiliaryTableContentGenericProps} from './auxiliaryTableContent';
import {AuxiliaryContentCellsColors} from './auxiliaryTableContentCellsColors';

// to be used internally

// REF-22
// auxiliary content is comprised of index column, add new column column and add new row row
export type AuxiliaryTableContentInternal = AuxiliaryTableContentGenericProps &
  Required<AuxiliaryTableContentDisplayProps> & {cellColors: AuxiliaryContentCellsColors};
