import {StaticTable} from '../../../utils/tableDimensions/staticTable/staticTable';
import {SizerMoveLimits, SelectedColumnSizerT} from '../../../types/columnSizer';
import {TableDimensions} from '../../../types/tableDimensions';

// Try not use offsetWidth for cells as it rounds the width number up, whereas some columns can have widths with
// decimal places, thus this would cause a column width to be changed when no movement was made or cause the new
// width to not be correct. Thus, use Number.parseFloat instead to get the fully correct column width.
export class ColumnSizerSetWidth {
  private static getWidthDelta(mouseMoveOffset: number, moveLimits: SizerMoveLimits) {
    if (mouseMoveOffset < moveLimits.left) {
      return moveLimits.left;
    } else if (mouseMoveOffset > moveLimits.right) {
      return moveLimits.right;
    }
    return mouseMoveOffset;
  }

  private static getNewColumnWidth(selectedColumnSizer: SelectedColumnSizerT, columnElement: HTMLElement) {
    const {moveLimits, mouseMoveOffset, initialOffset} = selectedColumnSizer;
    const delta = ColumnSizerSetWidth.getWidthDelta(mouseMoveOffset, moveLimits) - initialOffset;
    return Math.max(0, Number.parseFloat(columnElement.style.width) + delta);
  }

  private static setColumnWidth(selectedColumnSizer: SelectedColumnSizerT, headerCell: HTMLElement) {
    const newWidth = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, headerCell);
    headerCell.style.width = `${newWidth}px`;
  }

  // when the user moves the sizer to the start/end of a column in an attempt to completely crush the column,
  // the dom will not allow that and will leave enough space for the column to display its text,
  // the problem is that the widths will be set incorrectly and need to be corrected
  // prettier-ignore
  private static correctWidths(selectedColumnSizer: SelectedColumnSizerT, crushedElement: HTMLElement,
      sideElement: HTMLElement, initialWidthsTotal: number) {
    // Using Number.parseFloat as Number.parseInt rounds with ceil
    if (crushedElement.offsetWidth !== Math.round(Number.parseFloat(crushedElement.style.width))) {
      const leftValue = `${crushedElement.offsetWidth}px`;
      const rightValue = `${initialWidthsTotal - crushedElement.offsetWidth}px`;
      crushedElement.style.width = leftValue;
      sideElement.style.width = rightValue;
      selectedColumnSizer.wasAutoresized = true;
      setTimeout(() => selectedColumnSizer.wasAutoresized = false);
    }
  }

  // prettier-ignore
  private static setWidths(selectedColumnSizer: SelectedColumnSizerT, leftHeader: HTMLElement,
      rightHeader: HTMLElement, initialWidthsTotal: number) {
    const newLeftWidth = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, leftHeader);
    const newRightWidth = Math.max(0, initialWidthsTotal - newLeftWidth);
    leftHeader.style.width = `${newLeftWidth}px`;
    rightHeader.style.width = `${newRightWidth}px`;
  }

  // prettier-ignore
  private static setColumnsWidths(selectedColumnSizer: SelectedColumnSizerT, leftHeader: HTMLElement,
      rightHeader: HTMLElement) {
    const leftWidth = Number.parseFloat(leftHeader.style.width);
    const rightWidth = Number.parseFloat(rightHeader.style.width);
    const initialWidthsTotal = leftWidth + rightWidth;
    ColumnSizerSetWidth.setWidths(selectedColumnSizer, leftHeader, rightHeader, initialWidthsTotal);
    if (rightWidth > leftWidth) {
      ColumnSizerSetWidth.correctWidths(selectedColumnSizer, leftHeader, rightHeader, initialWidthsTotal);
    } else {
      ColumnSizerSetWidth.correctWidths(selectedColumnSizer, rightHeader, leftHeader, initialWidthsTotal);
    }
  }

  // left or right header in respect to the position of the sizer element
  // prettier-ignore
  public static set(selectedColumnSizer: SelectedColumnSizerT, tableElement: HTMLElement,
      tableDimensions: TableDimensions, leftHeader: HTMLElement, rightHeader?: HTMLElement) {
    if (rightHeader && StaticTable.isStaticTableWidth(tableElement, tableDimensions)) {
      // when the table width is static - control the width of two columns
      ColumnSizerSetWidth.setColumnsWidths(selectedColumnSizer, leftHeader, rightHeader);
    } else {
      ColumnSizerSetWidth.setColumnWidth(selectedColumnSizer, leftHeader);
    }
    setTimeout(() => selectedColumnSizer.fireColumnWidthsUpdate());
  }
}
