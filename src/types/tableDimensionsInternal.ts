import {MaxStructureDimensions} from './maxStructureDimensions';
import {InterfacesUnion} from './utilityTypes';

// REF-15
// this is a processed version of the client object and is to be used by the internal logic of this component
// width and maxWidth are mutually exclusive and if both are present width is the only one that is used

type Parent = {
  preserveNarrowColumns?: boolean;
  recordedParentWidth: number;
  isColumnIndexCellTextWrapped?: boolean; // REF-19
} & MaxStructureDimensions;

interface Initial {
  recordedParentWidth: number;
}

interface Width extends Parent {
  width: number;
  isPercentage: boolean; // used to resize the table if the parent width has changed
}

interface MaxWidth extends Parent {
  maxWidth: number;
  isPercentage: boolean; // used to resize the table if the parent width has changed
}

export type TableDimensionsInternal = InterfacesUnion<Width | MaxWidth | Initial>;
