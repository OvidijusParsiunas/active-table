import {InterfacesUnion} from './utilityTypes';

// REF-15

// this is a processed version of the client object and is to be used by the internal logic of this component
// width and maxWidth are mutually exclusive and if both are present width is the only one that is used
export type AllDimensionProps = {
  width: number;
  maxWidth: number;
  // used to resize the table if the parent width has changed
  isPercentage: boolean;
  preserveNarrowColumns: boolean;
  recordedParentWidth: number;
};

interface Parent {
  preserveNarrowColumns?: boolean;
  recordedParentWidth: number;
}

interface Initial {
  recordedParentWidth: number;
}

interface Width extends Parent {
  width: number;
  isPercentage: boolean;
}

interface MaxWidth extends Parent {
  maxWidth: number;
  isPercentage: boolean;
}

export type TableDimensionsInternal = InterfacesUnion<AllDimensionProps, Width | MaxWidth | Initial>;
