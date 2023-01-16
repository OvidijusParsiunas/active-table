import {StripedRowsInternal} from '../../types/stripedRowsInternal';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ActiveTable} from '../../activeTable';

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

  public static process(at: ActiveTable) {
    const {stripedRows} = at;
    if (!stripedRows) return;
    if (typeof stripedRows === 'boolean') {
      at.stripedRowsInternal = StripedRows.DEFAULT_PROPERTIES;
    } else {
      at.stripedRowsInternal = {
        evenRow: stripedRows.evenRow || StripedRows.DEFAULT_PROPERTIES.evenRow,
        oddRow: stripedRows.oddRow || StripedRows.DEFAULT_PROPERTIES.oddRow,
      };
    }
    CellHighlightUtils.unsetDefaultHoverProperties();
  }
}
