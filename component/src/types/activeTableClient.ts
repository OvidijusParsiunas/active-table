import {OnCellUpdate, OnColumnsUpdate, OnTableUpdate, ColumnUpdateDetails} from './onUpdate';
import {FrameComponentsStyle, IndexColumnT} from './frameComponents';
import {ProgrammaticCellUpdateT} from './programmaticCellUpdateT';
import {ColumnsSettingsDefault} from './columnsSettingsDefault';
import {RowDropdownSettings} from './rowDropdownSettings';
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
  allowDuplicateHeaders?: boolean;
  displayHeaderIcons?: boolean;
  spellCheck?: boolean;
  stickyHeader?: boolean | undefined;
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
  rowDropdown?: RowDropdownSettings;
  stripedRows?: StripedRowsT | boolean;
  overflow?: Overflow;
  pagination?: Pagination;
  getContent: () => TableContent;
  getColumnsDetails: () => ColumnUpdateDetails[];
  updateCell: (update: ProgrammaticCellUpdateT) => void;
  onCellUpdate?: OnCellUpdate;
  onColumnsUpdate?: OnColumnsUpdate;
  onContentUpdate?: OnTableUpdate;
}

declare global {
  interface HTMLElementTagNameMap {
    'active-table': ActiveTable;
  }
}
