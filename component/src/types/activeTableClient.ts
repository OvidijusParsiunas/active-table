import {OnCellUpdate, OnColumnsUpdate, OnTableUpdate, OnColumnWidthsUpdate} from './onUpdate';
import {FrameComponentsStyle, IndexColumnT} from './frameComponents';
import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {ColumnsSettingsDefault} from './columnsSettingsDefault';
import {RowDropdownSettings} from './rowDropdownSettings';
import {DynamicCellUpdateT} from './dynamicCellUpdateT';
import {CustomColumnsSettings} from './columnsSettings';
import {ColumnResizerColors} from './columnSizer';
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
  onColumnsUpdate?: OnColumnsUpdate;
  onContentUpdate?: OnTableUpdate;
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
  preserveNarrowColumns?: boolean;
  maxColumns?: number;
  maxRows?: number;
  displayAddNewRow?: boolean;
  displayAddNewColumn?: boolean;
  displayIndexColumn?: IndexColumnT;
  frameComponentsStyle?: FrameComponentsStyle;
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
