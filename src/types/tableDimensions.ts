import {Percentage, PX} from './dimensions';

// REF-15

// DO NOT USE THIS INTERNALLY - this is an interface to be exposed to the client
export interface TableDimensions {
  // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
  width?: Percentage | PX;
  maxWidth?: Percentage | PX;
  // minWidth?: number;
  // // WORK - figure out if we are going to have an internal scroll, also need option for maximum rows, maximum columns
  // height?: number;
  // maxHeight?: number;
}

// this is a processed version of the client object and is to be used by the internal logic of this component
// width and maxWidth are mutually exclusive and if both are present width is the only one that is used
export type TableDimensionsInternal = {
  [key in keyof TableDimensions]: number;
};
