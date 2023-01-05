import {EditableTableComponent} from '../../editable-table-component';
import {RowHoverEvents} from './rowHoverEvents';
import {CSSStyle} from '../../types/cssStyle';
import {StripedRows} from './stripedRows';

export class CustomRowProperties {
  private static updateRow(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number) {
    const {stripedRowsInternal, rowHover} = etc;
    let defaultStyle: CSSStyle = {};
    if (stripedRowsInternal) defaultStyle = StripedRows.setRowStyle(rowElement, rowIndex, stripedRowsInternal);
    setTimeout(() => {
      if (rowHover) RowHoverEvents.addEvents(rowHover, rowElement, rowIndex, defaultStyle);
    });
  }

  // this can be considered tobe wasteful if no striped rows are used and we are resetting the same row events
  // every time this is called, howver we are still traversing all rows from startIndex for code simplicity
  public static update(etc: EditableTableComponent, startIndex = 0) {
    if (!etc.tableBodyElementRef) return;
    const rows = Array.from(etc.tableBodyElementRef.children) as HTMLElement[];
    rows.slice(startIndex).forEach((rowElement, rowIndex) => {
      const relativeRowIndex = rowIndex + startIndex;
      CustomRowProperties.updateRow(etc, rowElement, relativeRowIndex);
    });
  }
}
