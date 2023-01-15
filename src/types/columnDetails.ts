import {SelectDropdownStyle, SelectDropdownOptionStyle} from './selectProperties';
import {ColumnTypeInternal, ColumnTypesInternal} from './columnTypeInternal';
import {ColProcessedTextStyle} from './processedTextStyle';
import {ColumnSettingsInternal} from './columnsSettings';
import {AUXILIARY_CELL_TYPE} from '../enums/cellType';
import {CellStateColors} from './cellStateColors';
import {ColumnSizerT} from './columnSizer';
import {Optional} from './utilityTypes';

// difference between column details and settings is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

export interface BordersOverwrittenBySiblings {
  left?: boolean;
  right?: boolean;
}

export interface DropdownOverlays {
  colorPickerNewValue?: {
    color: string;
    text: string;
  };
  colorPickerContainer?: HTMLElement; // cannot get the reference to the overlay element, hence using container instead
}

export type CellTypeTotals = {
  [key in string]: number;
} & {[AUXILIARY_CELL_TYPE.Undefined]: number};

interface ScrollbarPresence {
  horizontal: boolean;
  vertical: boolean;
}

export interface ActiveSelectItems {
  matchingWithCellText?: HTMLElement;
  hovered?: HTMLElement;
}

interface SelectItemDetails {
  color: string;
  element: HTMLElement;
}

interface SelectItem {
  [cellText: string]: SelectItemDetails;
}

export interface SelectDropdownT {
  selectItem: SelectItem; // dropdown item
  activeItems: ActiveSelectItems; // items that exhibit certain behaviours
  element: HTMLElement; // REF-8
  scrollbarPresence: ScrollbarPresence;
  customDropdownStyle?: SelectDropdownStyle;
  customItemStyle?: SelectDropdownOptionStyle;
  canAddMoreOptions: boolean;
  displayedCellElement?: HTMLElement;
  newItemColors?: string[]; // this property serves 2 purposers: 1. indicates if label type 2. eplained in notes at REF-34
  overlays: DropdownOverlays;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  processedStyle: ColProcessedTextStyle; // style added via validation
  columnSizer: ColumnSizerT;
  types: ColumnTypesInternal;
  activeType: ColumnTypeInternal;
  cellTypeTotals: CellTypeTotals;
  selectDropdown: SelectDropdownT;
  columnDropdownCellOverlay: HTMLElement;
  settings: ColumnSettingsInternal;
  headerStateColors: CellStateColors;
  bordersOverwrittenBySiblings: BordersOverwrittenBySiblings;
}

// REF-13
export type ColumnDetailsInitial = Pick<
  ColumnDetailsT,
  | 'elements'
  | 'processedStyle'
  | 'types'
  | 'activeType'
  | 'selectDropdown'
  | 'settings'
  | 'headerStateColors'
  | 'bordersOverwrittenBySiblings'
>;

// REF-13
export type ColumnDetailsNoSizer = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
