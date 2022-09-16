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

// WORK - ColumnSizerT
export interface ColumnSizerStateT {
  element: HTMLElement;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  styles: ColumnSizerStyles;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerStateT;
}

export interface ColumnDetailsTPartial {
  elements: HTMLElement[];
  columnSizer?: ColumnSizerStateT;
}

export type ColumnsDetails = ColumnDetailsT[];
