import {PX} from './pxDimension';

export interface SizerMoveLimits {
  left: number;
  right: number;
  currentOffset: number;
}

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
  movableElement: HTMLElement;
  styles: ColumnSizerStyles;
  siblingCellsTotalWidth?: number;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  isMouseUpOnSizer: boolean;
}
