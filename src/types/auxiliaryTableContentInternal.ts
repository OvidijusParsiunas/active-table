import {AuxiliaryTableContentDisplayProps, AuxiliaryTableContentGenericProps} from './auxiliaryTableContent';

// REF-22
// auxiliary content is comprised of index column, add new column column and add new row row
// to be used internally
export type AuxiliaryTableContentInternal = AuxiliaryTableContentGenericProps &
  Required<AuxiliaryTableContentDisplayProps>;
