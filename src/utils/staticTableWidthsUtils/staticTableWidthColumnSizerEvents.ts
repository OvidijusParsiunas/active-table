import {ColumnSizerEventsUtils} from '../../elements/columnSizer/columnSizerEventsUtils';
import {ColumnDetailsT, ColumnsDetailsT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';

export class StaticTableWidthColumnSizerEvents {
  // when the user moves their cursor too quickly or over one of the neighbouring cells, the total of the two cells
  // will no longer be the same, hence this is used to make sure the original is kept
  private static correctWidths(siblingCellsTotalWidth: number, headerCell: HTMLElement, nextColumn: ColumnDetailsT) {
    if (nextColumn) {
      const nextHeaderCell = nextColumn.elements[0];
      if (headerCell.offsetWidth + nextHeaderCell.offsetWidth !== siblingCellsTotalWidth) {
        nextHeaderCell.style.width = `${siblingCellsTotalWidth - headerCell.offsetWidth}px`;
        // when the user moves mouse over the neighbour cell - the widths are set incorrectly and do not match up
        // to the offset widths (easiest way to test is to use sizer between the last and second last) which
        // causes further attempts at resizing any columns to jump to incorrect column sizes
        // additionally this prevents the column widths from jumping when the mouse moves over the neighbour columns
        if (nextHeaderCell.style.width !== `${nextHeaderCell.offsetWidth}px`) {
          nextHeaderCell.style.width = `${nextHeaderCell.offsetWidth}px`;
          headerCell.style.width = `${siblingCellsTotalWidth - nextHeaderCell.offsetWidth}px`;
        }
      }
    }
  }

  // WORK - weird behaviour when reaching the end of the window
  // prettier-ignore
  public static changeNextColumnSize(etc: EditableTableComponent,
      nextColumnDetails: ColumnDetailsT, newXMovement: number, siblingCellsTotalWidth: number, headerCell: HTMLElement) {
    const {tableElementRef, tableDimensions} = etc;
    if (tableDimensions.width) {
      // * -1 sets positive to negative and negative to positive
      if (nextColumnDetails) ColumnSizerEventsUtils.changeElementWidth(nextColumnDetails.elements[0], newXMovement * -1);
      StaticTableWidthColumnSizerEvents.correctWidths(siblingCellsTotalWidth, headerCell, nextColumnDetails);
    } else {
      ColumnSizerEventsUtils.changeElementWidth(tableElementRef as HTMLElement, newXMovement);
    }
  }

  // prettier-ignore
  // when the user moves their cursor too quickly or over one of the neighbouring cells, the total of the two cells
  // will no longer be the same, hence this is used to make sure the original is kept
  public static setPreResizeSiblingCellsTotalWidth(columnsDetails: ColumnsDetailsT, selectedColumnSizer: HTMLElement) {
    const {columnSizer, headerCell, sizerNumber} = ColumnSizerEventsUtils.getSizerDetailsViaElementId(
      selectedColumnSizer.id, columnsDetails);
    const nextColumn = columnsDetails[sizerNumber + 1];
    if (nextColumn) {
      const nextColumnHeaderCell = nextColumn.elements[0];
      columnSizer.siblingCellsTotalWidth = headerCell.offsetWidth + nextColumnHeaderCell.offsetWidth;
    }
  }
}
