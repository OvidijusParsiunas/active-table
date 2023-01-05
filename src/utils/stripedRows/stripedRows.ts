import {EditableTableComponent} from '../../editable-table-component';
import {StripedRowsInternal} from '../../types/stripedRowsInternal';

export class StripedRows {
  private static readonly DEFAULT_PROPERTIES: StripedRowsInternal = {
    oddRow: {backgroundColor: ''},
    evenRow: {backgroundColor: 'grey'},
  };

  public static updateRows(etc: EditableTableComponent, startIndex = 0) {
    const {tableBodyElementRef, stripedRowsInternal} = etc;
    if (!tableBodyElementRef || !stripedRowsInternal) return;
    const rows = Array.from(tableBodyElementRef.children) as HTMLElement[];
    rows.slice(startIndex).forEach((row, rowIndex) => {
      const relativeIndex = rowIndex + startIndex;
      const style = relativeIndex % 2 ? stripedRowsInternal.evenRow : stripedRowsInternal.oddRow;
      Object.assign(row.style, style);
    });
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
  }
}
