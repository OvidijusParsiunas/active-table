import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../enums/columnType';
import {CELL_TYPE} from '../enums/cellType';
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

export type ColumnCategories = {[cellText: string]: true};

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
  // column type that has been inferred automatically or set by user
  activeColumnType: ACTIVE_COLUMN_TYPE;
  // column type set by the user, set to auto by default
  userSetColumnType: USER_SET_COLUMN_TYPE;
  cellTypeTotals: CellTypeTotals;
  categories: ColumnCategories;
  // item element inside the category dropdown
  hoveredCategoryItem?: HTMLElement;
}

// used for when column details initialised before the column sizer
export type ColumnDetailsTPartial = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
