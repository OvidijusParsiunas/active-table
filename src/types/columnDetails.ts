import {CELL_TYPE, COLUMN_TYPE} from '../enums/cellType';
import {Optional} from './optional';
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

export interface ColumnSizerT {
  element: HTMLElement;
  isSideCellHovered: boolean;
  isSizerHovered: boolean;
  styles: ColumnSizerStyles;
}

export type CellTypeTotals = {
  [key in CELL_TYPE]: number;
};

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
  columnType: COLUMN_TYPE;
  cellTypeTotals: CellTypeTotals;
}

// used for when column details initialised before the column sizer
export type ColumnDetailsTPartial = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
