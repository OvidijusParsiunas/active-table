import {CalendarFunctionality} from './calendarFunctionality';
import {CustomTextProcessing} from './customTextProcessing';
import {CategoriesProperties} from './categoriesProperties';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';

// to be used internally
export interface Parent {
  name: string;
  textValidation: TextValidation;
  customTextProcessing?: CustomTextProcessing;
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
  categories?: CategoriesProperties;
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

export type ColumnTypeInternal = InterfacesUnion<Calendar | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
