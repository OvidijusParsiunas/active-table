interface ColumnSizerStyles {
  default: {
    backgroundImage: string;
    width: string;
  };
  hover: {
    width: string;
  };
  permanent: {
    marginLeft: string;
  };
}

// WORK - typescript regex
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
