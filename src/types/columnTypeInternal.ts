import {CalendarFunctionality} from './calendarFunctionality';
import {CategoriesProperties} from './categoriesProperties';
import {ValidationProps} from './validationProps';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';
import {CellText} from './tableContents';

// to be used internally
export interface Parent {
  name: string;
  validation?: (cellText: string) => boolean;
  validationProps?: ValidationProps;
  // executed after the user removes focus from the selected cell
  postProcessText?: {
    func?: (cellText: string) => CellText;
    customValidationStyleColors?: () => void;
  };
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
  categories?: CategoriesProperties;
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

export type ColumnTypeInternal = InterfacesUnion<Calendar | Parent>;

export type ColumnTypesInternal = ColumnTypeInternal[];
