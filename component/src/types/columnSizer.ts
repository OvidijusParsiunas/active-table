import {StatefulCSSS, NoDimensionCSSStyle} from './cssStyle';
import {PX} from './dimensions';

export interface SizerMoveLimits {
  left: number;
  right: number;
}

// these are styles that are dynamic and also depend on the column index
export interface ColumnSizerStyles {
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
  styles: ColumnSizerStyles;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  isMouseUpOnSizer: boolean;
}

export interface SelectedColumnSizerT {
  element: HTMLElement;
  moveLimits: SizerMoveLimits;
  wasAutoresized?: boolean;
  mouseMoveOffset: number;
  // this is to reflect the initial sizer offset to center itself in the cell divider
  initialOffset: number;
}

export type UserSetColumnSizerStyle = Omit<StatefulCSSS<Pick<NoDimensionCSSStyle, 'backgroundColor'>>, 'default'>;
