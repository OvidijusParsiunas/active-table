export interface ColumnSizerState {
  element: HTMLElement;
  isParentCellHovered: boolean;
  isSizerHovered: boolean;
  backgroundImage: string;
  hoverWidth: string;
}

export type ColumnSizerList = ColumnSizerState[];

export interface ColumnSizers {
  list: ColumnSizerList;
  currentlyVisibleElements: Set<HTMLElement>;
}

export interface OverlayElements {
  columnSizers: ColumnSizers;
}
