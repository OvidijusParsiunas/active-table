import {AuxiliaryTableContentDisplayProps, AuxiliaryTableContentGenericProps} from './auxiliaryTableContent';

// to be used internally

// REF-22
// auxiliary content is comprised of index column, add new column column and add new row row
export type AuxiliaryTableContentInternal = AuxiliaryTableContentGenericProps &
  Required<AuxiliaryTableContentDisplayProps>;
