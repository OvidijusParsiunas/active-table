import {CategoriesProperties} from './categoriesProperties';
import {CalendarProperties} from './calendarProperties';
import {CellText} from './tableContents';

export interface SortingFuncs {
  // The functions are expected to return a negative value if cellText1 is less than cellText2, zero if both arguments
  // are equal, or a positive value if cellText1 is greater than cellText2.
  // The reason why the arguments are of string type is because cell dom elements store text in a string format, hence
  // instead of attempting to infer the correct type ourselves, we leave it to the consumer to infer the data they
  // want to and give them full control over the sorting functionality.
  ascending: (cellText1: string, cellText2: string) => number;
  descending: (cellText1: string, cellText2: string) => number;
}

export interface ColumnType {
  name: string;
  // WORK - cell text should be string to allow the client to anticipate consistency
  // WORK - no need for this for categories if options are set as it will validate them
  validation?: (cellText: CellText) => boolean;
  removeOnFailedValidation?: boolean;
  failedValidationStyle?: () => void;
  customValidationStyleColors?: () => void;
  // WORK - not required for date
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
  // WORK - should offer this to be set as true
  calendar?: CalendarProperties;
  // date and category cannot exist together
  categories?: CategoriesProperties;
  // restrict what options a category can have
  defaultText?: CellText;
}

export type ColumnTypes = ColumnType[];
