import {LabelOptions, SelectOptions, CellDropdownT} from './cellDropdown';
import {DEFAULT_COLUMN_TYPES} from '../enums/defaultColumnTypes';
import {CustomTextProcessing} from './customTextProcessing';
import {IconSettings} from './dropdownButtonItem';
import {Calendar} from './calendarFunctionality';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {Sorting} from './sorting';

// This is to be used by the client exclusively

// can reuse one of the existing icons
export type ColumnIconSettings = InterfacesUnion<{reusableIconName: DEFAULT_COLUMN_TYPES} | IconSettings>;

interface Parent {
  name: string;
  // textValidation and customTextProcessing only operate on data cells
  // REF-3
  textValidation?: TextValidation; // does not validate header even if dataStartsAtHeader is set to true
  customTextProcessing?: CustomTextProcessing; // this is used to allow explicit processing of text and its resulting style
  sorting?: Sorting; // by default the elements will be sorted in ascending ASCII character order
  iconSettings?: ColumnIconSettings; // by default will be set to text icon
}

interface Label extends Omit<Parent, 'validation'> {
  label: CellDropdownT<LabelOptions> | true;
}

interface Select extends Omit<Parent, 'validation'> {
  select: CellDropdownT<SelectOptions> | true;
}

interface CalendarT extends Omit<Parent, 'sorting'> {
  calendar: Calendar;
}

interface Checkbox extends Omit<Parent, 'sorting'> {
  // By default this comes with a customTextProcessing property function that uses '', '0', '00' and 'false' to uncheck
  // the checkbox and all other values to check it
  // You can overwite this property with your own function that returns a string value of 'true' when the passed in value
  // should check the checkbox and 'false' for unchecking it
  checkbox: true;
}

export type ColumnType = InterfacesUnion<Select | Label | CalendarT | Checkbox | Parent>;

export type ColumnTypes = ColumnType[];
