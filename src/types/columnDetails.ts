import {PX} from './pxDimension';

interface ColumnSizerStyles {
  default: {
    backgroundImage: string;
    width: PX;
  };
  hover: {
    width: PX;
  };
  permanent: {
    marginLeft: PX;
  };
}

export interface ColumnSizerT {
  element: HTMLElement;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  styles: ColumnSizerStyles;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
}

// used for when column details initialised bedore the column sizer
export interface ColumnDetailsTPartial {
  elements: HTMLElement[];
  columnSizer?: ColumnSizerT;
}

export type ColumnsDetails = ColumnDetailsT[];
