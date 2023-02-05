import {ColumnSettingsInternal} from './columnsSettingsInternal';
import {ColProcessedTextStyle} from './processedTextStyle';
import {ColumnTypeInternal} from './columnTypeInternal';
import {CellDropdownI} from './cellDropdownInternal';
import {CellStateColors} from './cellStateColors';
import {ColumnSizerT} from './columnSizer';
import {Optional} from './utilityTypes';

// difference between column details and settings is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

export interface BordersOverwrittenBySiblings {
  left?: boolean;
  right?: boolean;
}

export interface ColumnDetailsT {
  elements: HTMLElement[];
  processedStyle: ColProcessedTextStyle; // style added via validation
  columnSizer: ColumnSizerT;
  activeType: ColumnTypeInternal;
  cellDropdown: CellDropdownI;
  columnDropdownCellOverlay: HTMLElement;
  settings: ColumnSettingsInternal;
  headerStateColors: CellStateColors;
  bordersOverwrittenBySiblings: BordersOverwrittenBySiblings;
  fireColumnsUpdate: () => void; // pre-binded
}

// REF-13
export type ColumnDetailsInitial = Pick<
  ColumnDetailsT,
  | 'elements'
  | 'processedStyle'
  | 'activeType'
  | 'cellDropdown'
  | 'settings'
  | 'headerStateColors'
  | 'bordersOverwrittenBySiblings'
  | 'fireColumnsUpdate'
>;

// REF-13
export type ColumnDetailsNoSizer = Optional<ColumnDetailsT, 'columnSizer'>;

export type ColumnsDetailsT = ColumnDetailsT[];
