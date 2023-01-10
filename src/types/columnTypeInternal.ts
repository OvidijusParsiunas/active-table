import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {CalendarFunctionality} from './calendarFunctionality';
import {CustomTextProcessing} from './customTextProcessing';
import {SelectProperties} from './selectProperties';
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
  select?: SelectProperties;
  dropdownItem: ColumnTypeDropdownItem;
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

interface Checkbox extends Omit<Parent, 'sorting'> {
  checkbox: true;
}

interface Select extends Omit<Parent, 'validation'> {
  isSelect: boolean; // WORK - this will be replaced by select getting renamed to labelSelect
}

export type ColumnTypeInternal = InterfacesUnion<Calendar | Checkbox | Select | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
