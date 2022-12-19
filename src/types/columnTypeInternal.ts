import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {CalendarFunctionality} from './calendarFunctionality';
import {CustomTextProcessing} from './customTextProcessing';
import {CategoriesProperties} from './categoriesProperties';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';

// to be used internally
export interface Parent {
  name: string;
  // REF-3
  textValidation: TextValidation; // this is a genuine form of custom text validation and its resulting style
  customTextProcessing?: CustomTextProcessing; // this is used to allow explicit processing of text and its resulting style
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
  categories?: CategoriesProperties;
  dropdownItem: ColumnTypeDropdownItem;
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

export type ColumnTypeInternal = InterfacesUnion<Calendar | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
