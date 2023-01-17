import {SelectDropdownStyle, SelectDropdownOptionStyle} from './selectProperties';
import {ColumnTypeInternal, ColumnTypesInternal} from './columnTypeInternal';
import {ColumnSettingsInternal} from './columnsSettingsInternal';
import {ColProcessedTextStyle} from './processedTextStyle';
import {AUXILIARY_CELL_TYPE} from '../enums/cellType';
import {CellStateColors} from './cellStateColors';
import {ColumnSizerT} from './columnSizer';
import {OnColumnUpdate} from './onUpdate';
import {Optional} from './utilityTypes';

// difference between column details and settings is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

export interface BordersOverwrittenBySiblings {
  left?: boolean;
  right?: boolean;
}

export interface LabelDetails {
  newItemColors: string[]; // REF-34
  colorPickerContainer?: HTMLElement; // set when picker is opened
  colorPickerNewValue?: {
    color: string;
    text: string;
  };
}

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

interface SelectItems {
  [cellText: string]: SelectItemDetails;
}

export interface SelectDropdownT {
  selectItems: SelectItems; // dropdown items
  activeItems: ActiveSelectItems; // items that exhibit certain behaviours
  element: HTMLElement; // REF-8
  scrollbarPresence: ScrollbarPresence;
  customDropdownStyle?: SelectDropdownStyle;
  customItemStyle?: SelectDropdownOptionStyle;
  canAddMoreOptions: boolean;
  displayedCellElement?: HTMLElement;
  labelDetails?: LabelDetails; // extra properties that are used for the label type that are not by the basic select type
}

export type CellTypeTotals = {
  [key in string]: number;
} & {[AUXILIARY_CELL_TYPE.Undefined]: number};

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
  index: number;
  onColumnUpdate: OnColumnUpdate;
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
  | 'index'
  | 'onColumnUpdate'
>;

// REF-13
export type ColumnDetailsNoSizer = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
