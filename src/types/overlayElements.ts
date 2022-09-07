export interface ColumnSizerState {
  element: HTMLElement;
  isMouseHovered: boolean;
}

export type ColumnSizersStates = ColumnSizerState[];

export interface OverlayElements {
  columnSizers: ColumnSizersStates;
}
