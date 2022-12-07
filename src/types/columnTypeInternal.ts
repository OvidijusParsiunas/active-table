import {CalendarFunctionality} from './calendarFunctionality';
import {CategoriesProperties} from './categoriesProperties';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';
import {CellText} from './tableContents';

// to be used internally
export interface Parent {
  name: string;
  validation?: (cellText: string) => boolean;
  removeOnFailedValidation?: boolean;
  failedValidationStyle?: () => void;
  customValidationStyleColors?: () => void;
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
  categories?: CategoriesProperties;
  // WORK - this should be used to set the default text inside column details - think about cellstyle
  defaultText?: CellText;
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

export type ColumnTypeInternal = InterfacesUnion<Calendar | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
