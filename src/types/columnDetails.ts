import {CategoriesOptions, CategoriesDropdownStyle, CategoriesDropdownOptionStyle} from './categoriesProperties';
import {ColumnSettingsInternal} from './columnsSettings';
import {AUXILIARY_CELL_TYPE} from '../enums/cellType';
import {ColumnType, ColumnTypes} from './columnType';
import {CellStateColors} from './cellStateColors';
import {ColumnSizerT} from './columnSizer';
import {Optional} from './utilityTypes';

export interface BordersOverwrittenBySiblings {
  left?: boolean;
  right?: boolean;
}

export type CellTypeTotals = {
  [key in string]: number;
} & {[AUXILIARY_CELL_TYPE.Undefined]: number};

export interface ScrollbarPresence {
  horizontal: boolean;
  vertical: boolean;
}

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

export interface CategoryDropdownT {
  // dropdown item
  categoryToItem: CategoryToItem;
  // items that exhibit certain behaviours
  activeItems: ActiveCategoryItems;
  // REF-8
  element: HTMLElement;
  scrollbarPresence: ScrollbarPresence;
  customDropdownStyle?: CategoriesDropdownStyle;
  customItemStyle?: CategoriesDropdownOptionStyle;
  staticItems?: CategoriesOptions;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  columnSizer: ColumnSizerT;
  types: ColumnTypes;
  // WORK - user should have option to set type as a string by the name
  activeType: ColumnType;
  // difference between column type and cell type is - is that column type governs the type for all cells within that
  // column whereas cell type is the actual type used on a cell
  // column type set by the user, set to auto by default
  userSetColumnType: string;
  cellTypeTotals: CellTypeTotals;
  categoryDropdown: CategoryDropdownT;
  settings: ColumnSettingsInternal;
  headerStateColors: CellStateColors;
  bordersOverwrittenBySiblings: BordersOverwrittenBySiblings;
}

// REF-13
export type ColumnDetailsInitial = Pick<
  ColumnDetailsT,
  'elements' | 'settings' | 'headerStateColors' | 'bordersOverwrittenBySiblings'
>;

// REF-13
export type ColumnDetailsNoSizer = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
