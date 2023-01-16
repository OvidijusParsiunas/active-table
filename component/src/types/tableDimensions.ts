import {InterfacesUnion} from './utilityTypes';

// preserveNarrowColumns:
// When width or maxWidth properties are set (or default - maxWidth 100%), the insertion of a new column does not
// increase the table width beyond them and instead the existing column widths are reduced to make space for a new
// one. This can however become problematic when the existing column widths eventually become too narrow
// (<34px - MINIMAL_COLUMN_WIDTH) and no more columns can be added (the browser would instead increase the table
// width without reducing the column widths).
// When preserveNarrowColumns is set to true, the user can add an unlimited amount of columns (if maxColumns has not
// been set) and all of them will be preserved with the chance that the table width would increase if they all became
// too narrow.
// When preserveNarrowColumns is set to false, the addition of any new columns that would cause the table width to expand
// will be prevented and the user will not be able to add any more columns.
// set to true by default
// (Please note that upon resizing the window when width is a % value - columns that are too narrow will not be removed
// to preserve their data and the table size then has a chance of increasing beyond the set value)

type Parent = {
  // the reason why preserNarrowColumns is stored inside this object is because we temporarily need to overwrite it
  // when resizing the table and we do not want to re-render
  preserveNarrowColumns?: boolean;
  isColumnIndexCellTextWrapped?: boolean; // REF-19
} & Initial;

interface Initial {
  recordedParentWidth: number;
  recordedParentHeight: number;
  recordedWindowWidth: number;
  recordedWindowHeight: number;
}

interface Width extends Parent {
  width: number;
  isPercentage: boolean; // used to resize the table if the parent width has changed
}

interface MaxWidth extends Parent {
  maxWidth: number;
  isPercentage: boolean; // used to resize the table if the parent width has changed
}

export type TableDimensions = InterfacesUnion<Width | MaxWidth | Initial>;
