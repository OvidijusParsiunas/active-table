import {LabelOptions, SelectProperties} from './selectProperties';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {CustomTextProcessing} from './customTextProcessing';
import {Calendar} from './calendarFunctionality';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {Sorting} from './sorting';

// this object encompasses properties for either select or label
// the reason why LabelOptions is used is to capture all props
// using isBasicSelect instead of isLabel to minimise the if statemnt logic complexity
export type SelectPropertiesInternal = SelectProperties<LabelOptions> & {isBasicSelect: boolean};

// to be used internally
export interface Parent {
  name: string;
  // REF-3
  textValidation: TextValidation; // this is a genuine form of custom text validation and its resulting style
  customTextProcessing?: CustomTextProcessing; // this is used to allow explicit processing of text and its resulting style
  sorting?: Sorting; // By default the elements will be sorted in ascending ASCII character order
  selectProps?: SelectPropertiesInternal;
  dropdownItem: ColumnTypeDropdownItem;
}

interface CalendarT extends Omit<Parent, 'sorting'> {
  calendar: Calendar;
}

interface Checkbox extends Omit<Parent, 'sorting'> {
  checkbox: true;
}

export type ColumnTypeInternal = InterfacesUnion<CalendarT | Checkbox | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
