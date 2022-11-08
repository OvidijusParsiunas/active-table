import {StringDimension} from './dimensions';

// REF-15

// DO NOT USE THIS INTERFACE INTERNALLY - this is to be used by the client
export interface TableDimensions {
  // width and maxWidth are mutually exclusive and if both are present width is the only one that will be used
  width?: StringDimension;
  maxWidth?: StringDimension;
  // Takes effect when width or maxWidth are set:
  // When either of the above are set, the insertion of columns does not increase the table width beyond these values
  // and instead the existing column widths are reduced to make space for a new one. This can become problematic when
  // the existing column widths become too narrow (<34px - MINIMAL_COLUMN_WIDTH) as the browser will force the table to
  // increase its width beyond the set value.
  // When preserveNarrowColumns is set to true, the user can add an unlimited amount of columns (if max columns has not
  // been set) and all of them will be preserved with the chance that the table width would increase if they all become
  // too narrow.
  // When preserveNarrowColumns is set to false, the addition of any new columns that would cause the table width to expand
  // will be prevented and the user will not be able to add any more columns.
  // WORK - update the name of the property in the description
  // set to true by default
  // (Please note that upon resizing the window when width is a % value - columns that are too narrow will not be removed
  // to preserve their data and the table size has a chance of increasing beyond the set value)
  preserveNarrowColumns?: boolean;
  // // WORK - figure out if we are going to have an internal scroll, also need option for maximum rows, maximum columns
  // height?: number;
  // maxHeight?: number;
}

// this is a processed version of the client object and is to be used by the internal logic of this component
// width and maxWidth are mutually exclusive and if both are present width is the only one that is used
export type TableDimensionsInternal = {
  width?: number;
  maxWidth?: number;
  // used to resize the table if the parent width has changed
  isPercentage?: boolean;
  preserveNarrowColumns?: boolean;
  recordedParentWidth: number;
};
