import {SizerMoveLimits, SelectedColumnSizer} from '../../types/columnSizer';
import {TableDimensions} from '../../types/tableDimensions';
import {Browser} from '../../utils/browser/browser';

export class ColumnSizerSetWidth {
  private static getWidthDelta(mouseMoveOffset: number, moveLimits: SizerMoveLimits) {
    if (mouseMoveOffset < moveLimits.left) {
      return moveLimits.left;
    } else if (mouseMoveOffset > moveLimits.right) {
      return moveLimits.right;
    }
    return mouseMoveOffset;
  }

  private static getNewColumnWidth(selectedColumnSizer: SelectedColumnSizer, columnElement: HTMLElement) {
    const {moveLimits, mouseMoveOffset, initialOffset} = selectedColumnSizer;
    const newWidthDelta = ColumnSizerSetWidth.getWidthDelta(mouseMoveOffset, moveLimits) - initialOffset;
    return Math.max(0, columnElement.offsetWidth + newWidthDelta);
  }

  private static setColumnWidth(selectedColumnSizer: SelectedColumnSizer, columnElement: HTMLElement) {
    const newWidth = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, columnElement);
    columnElement.style.width = `${newWidth}px`;
  }

  // when the user moves the sizer to the start/end of a column in an attempt to completely crush the column,
  // the dom will not allow that and will leave enough space for the column to display its text,
  // the problem is that the widths will be set incorrectly and need to be corrected
  // prettier-ignore
  private static correctWidths(selectedColumnSizer: SelectedColumnSizer, crushedElement: HTMLElement,
      sideElement: HTMLElement, initialWidthsTotal: number) {
    if (crushedElement.offsetWidth !== Number.parseInt(crushedElement.style.width)) {
      const leftValue = `${crushedElement.offsetWidth}px`;
      const rightValue = `${initialWidthsTotal - crushedElement.offsetWidth}px`;
      crushedElement.style.width = leftValue;
      sideElement.style.width = rightValue;
      selectedColumnSizer.wasAutoresized = true;
      setTimeout(() => selectedColumnSizer.wasAutoresized = false);
    }
  }

  // prettier-ignore
  private static setWidths(selectedColumnSizer: SelectedColumnSizer, leftHeader: HTMLElement,
      rightHeader: HTMLElement, initialWidthsTotal: number) {
    const newLeftWidth = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, leftHeader);
    const newRightWidth = Math.max(0, initialWidthsTotal - newLeftWidth);
    leftHeader.style.width = `${newLeftWidth}px`;
    rightHeader.style.width = `${newRightWidth}px`;
  }

  // prettier-ignore
  private static setColumnsWidths(selectedColumnSizer: SelectedColumnSizer, leftHeader: HTMLElement,
      rightHeader: HTMLElement) {
    const initialWidthsTotal = leftHeader.offsetWidth + rightHeader.offsetWidth;
    ColumnSizerSetWidth.setWidths(selectedColumnSizer, leftHeader, rightHeader, initialWidthsTotal);
    if (rightHeader.offsetWidth > leftHeader.offsetWidth) {
      ColumnSizerSetWidth.correctWidths(selectedColumnSizer, leftHeader, rightHeader, initialWidthsTotal);
    } else {
      ColumnSizerSetWidth.correctWidths(selectedColumnSizer, rightHeader, leftHeader, initialWidthsTotal);
    }
  }

  // left or right header in respect to the position of the sizer element
  // prettier-ignore
  public static set(selectedColumnSizer: SelectedColumnSizer, tableDimensions: TableDimensions,
      leftHeader: HTMLElement, rightHeader?: HTMLElement) {
    // REF-11
    if (rightHeader && (tableDimensions.width || Browser.IS_SAFARI)) {
      // when the table width is static - control the width of two columns
      ColumnSizerSetWidth.setColumnsWidths(selectedColumnSizer, leftHeader, rightHeader);
    } else {
      ColumnSizerSetWidth.setColumnWidth(selectedColumnSizer, leftHeader);
    }
  }
}
