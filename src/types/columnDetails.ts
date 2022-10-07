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

export interface ActiveCategoryItems {
  matchingWithCellText?: HTMLElement;
  hovered?: HTMLElement;
}

export interface CategoryItemDetails {
  color: string;
  element: HTMLElement;
}

export interface CategoryToItem {
  [cellText: string]: CategoryItemDetails;
}

export interface CategoryDropdownProps {
  // dropdown item
  categoryToItem: CategoryToItem;
  // items that exhibit certain behaviours
  activeItems: ActiveCategoryItems;
  // REF-8
  element: HTMLElement;
  isHorizontalScrollPresent: boolean;
}

export interface Categories {
  isCellTextNewCategory: boolean;
  dropdown: CategoryDropdownProps;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
  // difference between column type and cell type is - is that column type governs the type for all cells within that
  // column whereas cell type is the actual type used on a cell
  // column type that has been inferred automatically or set by user
  activeColumnType: ACTIVE_COLUMN_TYPE;
  // column type set by the user, set to auto by default
  userSetColumnType: USER_SET_COLUMN_TYPE;
  cellTypeTotals: CellTypeTotals;
  categories: Categories;
}

// used for when column details initialised before the column sizer
export type ColumnDetailsTPartial = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
