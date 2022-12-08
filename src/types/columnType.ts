import {CalendarFunctionality} from './calendarFunctionality';
import {CategoriesProperties} from './categoriesProperties';
import {ValidationProps} from './validationProps';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';
import {CellText} from './tableContents';

// This is to be used by the client exclusively

interface Parent {
  name: string;
  // TO-DO user should set this to string so it can be parsed
  // the reason why cell text is a string is because when it is extracted from an element it comes out in a string format
  validation?: (cellText: string) => boolean;
  // executed when the user is typing
  validationProps?: ValidationProps;
  // executed after the user removes focus from the selected cell
  postProcessText?: {
    func?: (cellText: string) => CellText;
    customValidationStyleColors?: () => void;
  };
  // WORK - option to post process text - e.g. change date format or add currency to start
  sorting?: SortingFuncs; // By default the elements will be sorted in ascending ASCII character order
}

interface Calendar extends Omit<Parent, 'sorting'> {
  calendar: CalendarFunctionality;
}

interface Categories extends Omit<Parent, 'validation'> {
  categories: CategoriesProperties | true;
}

export type ColumnType = InterfacesUnion<Calendar | Categories | Parent>;

export type ColumnTypes = ColumnType[];
