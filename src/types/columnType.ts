import {CalendarFunctionality} from './calendarFunctionality';
import {CategoriesProperties} from './categoriesProperties';
import {CustomTextProcessing} from './customTextProcessing';
import {DEFAULT_COLUMN_TYPES} from '../enums/columnType';
import {IconSettings} from './dropdownButtonItem';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';

// This is to be used by the client exclusively

export type DropdownIconSettings = {
  defaultIconName?: DEFAULT_COLUMN_TYPES; // can reuse one of the existing icons
} & IconSettings;

interface Parent {
  name: string;
  // textValidation and customTextProcessing only operate on data cells
  // REF-3
  textValidation?: TextValidation; // this is a genuine form of custom text validation and its resulting style
  customTextProcessing?: CustomTextProcessing; // this is used to allow explicit processing of text and its resulting style
  sorting?: SortingFuncs; // by default the elements will be sorted in ascending ASCII character order
  dropdownIconSettings?: DropdownIconSettings; // by default will be set to text icon
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

interface Categories extends Omit<Parent, 'validation'> {
  categories: CategoriesProperties | true;
}

export type ColumnType = InterfacesUnion<Calendar | Categories | Parent>;

export type ColumnTypes = ColumnType[];
