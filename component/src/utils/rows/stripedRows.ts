import {EditableTableComponent} from '../../editable-table-component';
import {StripedRowsInternal} from '../../types/stripedRowsInternal';
import {CellHighlightUtils} from '../color/cellHighlightUtils';

export class StripedRows {
  private static readonly DEFAULT_PROPERTIES: StripedRowsInternal = {
    oddRow: {backgroundColor: ''},
    evenRow: {backgroundColor: 'grey'},
  };

  public static setRowStyle(rowElement: HTMLElement, index: number, stripedRows: StripedRowsInternal) {
    const style = index % 2 ? stripedRows.evenRow : stripedRows.oddRow;
    Object.assign(rowElement.style, style);
    return style;
  }

  public static process(etc: EditableTableComponent) {
    const {stripedRows} = etc;
    if (!stripedRows) return;
    if (typeof stripedRows === 'boolean') {
      etc.stripedRowsInternal = StripedRows.DEFAULT_PROPERTIES;
    } else {
      etc.stripedRowsInternal = {
        evenRow: stripedRows.evenRow || StripedRows.DEFAULT_PROPERTIES.evenRow,
        oddRow: stripedRows.oddRow || StripedRows.DEFAULT_PROPERTIES.oddRow,
      };
    }
    CellHighlightUtils.unsetDefaultHoverProperties();
  }
}
