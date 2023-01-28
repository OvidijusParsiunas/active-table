import {OnCellUpdate, OnColumnUpdate, OnTableUpdate, OnColumnWidthsUpdate} from './onUpdate';
import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {ColumnsSettingsDefault} from './columnsSettingsDefault';
import {AuxiliaryTableContent} from './auxiliaryTableContent';
import {RowDropdownSettings} from './rowDropdownSettings';
import {DynamicCellUpdateT} from './dynamicCellUpdateT';
import {CustomColumnsSettings} from './columnsSettings';
import {ColumnResizerColors} from './columnSizer';
import {ColumnsWidths} from './columnsWidths';
import {RowHoverStyle} from './rowHoverStyle';
import {TableContent} from './tableContent';
import {StripedRowsT} from './stripedRows';
import {Pagination} from './pagination';
import {TableStyle} from './tableStyle';
import {Overflow} from './overflow';
import {LitElement} from 'lit';

// This interface is to be used exclusively by the client
export interface ActiveTable extends LitElement {
  content?: TableContent;
  onCellUpdate?: OnCellUpdate;
  onColumnUpdate?: OnColumnUpdate;
  onTableUpdate?: OnTableUpdate;
  onColumnWidthsUpdate?: OnColumnWidthsUpdate;
  allowDuplicateHeaders?: boolean;
  displayIconsInHeaders?: boolean;
  spellCheck?: boolean;
  stickyHeader?: boolean | undefined;
  updateCell?: DynamicCellUpdateT;
  columnsSettings?: ColumnsSettingsDefault;
  customColumnsSettings?: CustomColumnsSettings;
  tableStyle?: TableStyle;
  rowHoverStyle?: RowHoverStyle;
  overwriteColumnWidths?: ColumnsWidths;
  preserveNarrowColumns?: boolean;
  maxColumns?: number;
  maxRows?: number;
  auxiliaryTableContent?: AuxiliaryTableContent;
  dataStartsAtHeader?: boolean;
  columnResizerColors?: ColumnResizerColors;
  columnDropdownDisplaySettings?: DropdownDisplaySettings;
  rowDropdown?: RowDropdownSettings;
  stripedRows?: StripedRowsT | boolean;
  overflow?: Overflow;
  pagination?: Pagination;
}

declare global {
  interface HTMLElementTagNameMap {
    'active-table': ActiveTable;
  }
}
