import {OnCellUpdate, OnColumnUpdate, OnTableUpdate, OnColumnWidthsUpdate} from './onUpdate';
import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {DynamicCellTextUpdateT} from './dynamicCellTextUpdateT';
import {ColumnsSettingsDefault} from './columnsSettingsDefault';
import {AuxiliaryTableContent} from './auxiliaryTableContent';
import {StripedRows as StripedRowsType} from './stripedRows';
import {RowDropdownSettings} from './rowDropdownSettings';
import {CustomColumnsSettings} from './columnsSettings';
import {UserSetColumnSizerStyle} from './columnSizer';
import {ColumnsWidths} from './columnsWidths';
import {TableContent} from './tableContent';
import {Pagination} from './pagination';
import {TableStyle} from './tableStyle';
import {Overflow} from './overflow';
import {RowHover} from './rowHover';
import {LitElement} from 'lit';

// This interface is to be used exclusively by the client
export interface ActiveTable extends LitElement {
  content?: TableContent;
  onCellUpdate?: OnCellUpdate;
  onColumnUpdate?: OnColumnUpdate;
  onTableUpdate?: OnTableUpdate;
  onColumnWidthsUpdate?: OnColumnWidthsUpdate;
  duplicateHeadersAllowed?: boolean;
  areIconsDisplayedInHeaders?: boolean;
  spellCheck?: boolean;
  stickyHeader?: boolean | undefined;
  updateCellText?: DynamicCellTextUpdateT;
  defaultColumnsSettings?: ColumnsSettingsDefault;
  customColumnsSettings?: CustomColumnsSettings;
  tableStyle?: TableStyle;
  rowHover?: RowHover;
  overwriteColumnWidths?: ColumnsWidths;
  preserveNarrowColumns?: boolean;
  maxColumns?: number;
  maxRows?: number;
  auxiliaryTableContent?: AuxiliaryTableContent;
  dataBeginsAtHeader?: boolean;
  columnResizerStyle?: UserSetColumnSizerStyle;
  columnDropdownDisplaySettings?: DropdownDisplaySettings;
  rowDropdownSettings?: RowDropdownSettings;
  stripedRows?: StripedRowsType | boolean;
  overflow?: Overflow;
  pagination?: Pagination;
}

declare global {
  interface HTMLElementTagNameMap {
    'active-table': ActiveTable;
  }
}
