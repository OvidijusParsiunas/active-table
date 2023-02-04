import {PX} from './dimensions';

export interface SizerMoveLimits {
  left: number;
  right: number;
}

// these are styles that are dynamic and also depend on the column index
export interface ColumnResizerStyles {
  default: {
    // this is dynamic as it can depend on the index of the column this is on
    backgroundImage: string;
    width: PX;
  };
  hover: {
    width: PX;
  };
  static: {
    // using margin right to help center the sizers because movable sizer is using the offsetLeft for the callculation
    // of the new width which would marginLeft interfer with
    // the reason why it is stored in state is because it involves a calculation with a result that can change
    // depending on the index that the column sizer is on
    marginRight: PX;
  };
}

export interface ColumnSizerT {
  element: HTMLElement;
  movableElement: HTMLElement;
  overlayElement: HTMLElement;
  styles: ColumnResizerStyles;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  isMouseUpOnSizer: boolean;
  // color that needs to be passed down for events and is set here to not overwrite it when updating the object
  hoverColor: string;
}

export interface SelectedColumnSizerT {
  element: HTMLElement;
  moveLimits: SizerMoveLimits;
  wasAutoresized?: boolean;
  mouseMoveOffset: number;
  // this is to reflect the initial sizer offset to center itself in the cell divider
  initialOffset: number;
  fireColumnUpdate: () => void; // pre-binded
}

// called columnResizer for the client - columnSizer in the code
export type ColumnResizerColors = {hover?: string; click?: string};
