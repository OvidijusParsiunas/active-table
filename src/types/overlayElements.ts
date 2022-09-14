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

export interface ColumnSizerStateT {
  element: HTMLElement;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  styles: ColumnSizerStyles;
}

export type ColumnSizerList = ColumnSizerStateT[];

export interface ColumnSizers {
  list: ColumnSizerList;
  currentlyVisibleElements: Set<HTMLElement>;
}

export interface OverlayElements {
  columnSizers: ColumnSizers;
}
