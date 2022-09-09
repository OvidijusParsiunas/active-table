export interface ColumnSizerState {
  element: HTMLElement;
  isParentCellHovered: boolean;
  isMouseHovered: boolean;
}

export type ColumnSizersStates = ColumnSizerState[];

export interface OverlayElements {
  columnSizers: ColumnSizersStates;
}
