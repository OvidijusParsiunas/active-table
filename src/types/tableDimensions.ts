import {MaxStructureDimensions} from './maxStructureDimensions';
import {InterfacesUnion} from './utilityTypes';
import {StringDimension} from './dimensions';

// REF-15

// DO NOT USE THIS INTERFACE INTERNALLY - this is to be used by the client

// REF-19
// wrapIndexCellText:
// By default, index column width is updated by analyzing the number of digits present in the highest index number.
// When wrapIndexCellText is set to true, the default behaviour can be turned off to instead wrap the number within each
// cell. This would cause the cell's width to always remain as default (30px).
// set to false by default

// width/maxWidth:
// width and maxWidth are mutually exclusive and if both are present width is the only one that will be used

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

type AllowedByDefault = {
  wrapIndexCellText?: boolean;
} & MaxStructureDimensions;

interface Width extends AllowedByDefault {
  width: StringDimension;
  preserveNarrowColumns?: boolean; // true by default
}

interface MaxWidth extends AllowedByDefault {
  maxWidth: StringDimension;
  preserveNarrowColumns?: boolean; // true by default
}

interface NarrowColumns extends AllowedByDefault {
  preserveNarrowColumns: boolean; // true by default
}

interface UnlimitedSize extends AllowedByDefault {
  unlimitedSize: boolean; // false by default
}

type Empty = {} & AllowedByDefault;

// CAUTION-3
// These exclusive type combinations may not be respected by the user, hence the handling logic needs to exercise caution
export type TableDimensions = InterfacesUnion<Width | MaxWidth | NarrowColumns | UnlimitedSize | Empty>;

// Replacement for the following
// exporty type TableDimensions =
// | AssignNever<AllDimensionProps, Width>
// | AssignNever<AllDimensionProps, MaxWidth>
// | AssignNever<AllDimensionProps, NarrowColumns>
// | AssignNever<AllDimensionProps, UnlimitedSize>
// | AssignNever<AllDimensionProps, Empty>;
