import {StatefulCSSS, CSSStyle} from './cssStyle';
import {PX} from './pxDimension';

export interface SizerMoveLimits {
  left: number;
  right: number;
  currentOffset: number;
}

export interface ColumnSizerStyles {
  default: {
    backgroundImage: string;
    width: PX;
  };
  hover: {
    width: PX;
    backgroundColor: string;
  };
  permanent: {
    marginLeft: PX;
  };
}

export interface ColumnSizerT {
  element: HTMLElement;
  movableElement: HTMLElement;
  styles: ColumnSizerStyles;
  siblingCellsTotalWidth?: number;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  isMouseUpOnSizer: boolean;
}

export type UserSetColumnSizerStyle = Omit<StatefulCSSS<Pick<CSSStyle, 'backgroundColor'>>, 'default'>;
