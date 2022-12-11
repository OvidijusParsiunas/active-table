import {CalendarFunctionality} from './calendarFunctionality';
import {CategoriesProperties} from './categoriesProperties';
import {TextValidation} from './textValidation';
import {InterfacesUnion} from './utilityTypes';
import {SortingFuncs} from './sortingFuncs';
import {CellText} from './tableContents';

// This is to be used by the client exclusively

interface Parent {
  name: string;
  textValidation?: TextValidation;
  customTextProcessing?: {
    // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
    changeText?: (cellText: string) => CellText;
    // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
    changeStyle?: () => void;
  };
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
