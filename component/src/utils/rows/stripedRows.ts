import {StripedRowsInternal} from '../../types/stripedRowsInternal';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ActiveTable} from '../../activeTable';

export class StripedRows {
  private static readonly DEFAULT_PROPERTIES: StripedRowsInternal = {
    odd: {backgroundColor: ''},
    even: {backgroundColor: '#dcdcdc7a'},
  };

  public static setRowStyle(rowElement: HTMLElement, index: number, stripedRows: StripedRowsInternal) {
    const style = index % 2 ? stripedRows.even : stripedRows.odd;
    Object.assign(rowElement.style, style);
    return style;
  }

  public static process(at: ActiveTable) {
    const {stripedRows, defaultCellHoverColors} = at;
    if (!stripedRows) return;
    if (typeof stripedRows === 'boolean') {
      at.stripedRowsInternal = StripedRows.DEFAULT_PROPERTIES;
    } else {
      at.stripedRowsInternal = {
        even: stripedRows.even || StripedRows.DEFAULT_PROPERTIES.even,
        odd: stripedRows.odd || StripedRows.DEFAULT_PROPERTIES.odd,
      };
    }
    CellHighlightUtils.unsetDefaultHoverProperties(defaultCellHoverColors);
  }
}
