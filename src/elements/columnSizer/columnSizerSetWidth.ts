import {SizerMoveLimits, SelectedColumnSizerT} from '../../types/columnSizer';
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

  // for the Safari bug described below - take note that the columnElement.offsetWidth and columnElement.style.width
  // are different when there is a border on the table
  private static getNewColumnWidth(selectedColumnSizer: SelectedColumnSizerT, columnElement: HTMLElement) {
    const {moveLimits, mouseMoveOffset, initialOffset} = selectedColumnSizer;
    const delta = ColumnSizerSetWidth.getWidthDelta(mouseMoveOffset, moveLimits) - initialOffset;
    return {width: Math.max(0, columnElement.offsetWidth + delta), delta};
  }

  // when the table has a border and the column along with the table width are expanded in Safari - it is
  // noticeable that columns that were not involved in the expansion have their widths also changed.
  // This is a bug that I was not able to fix, however I can revisit this in the future.
  // prettier-ignore
  private static setColumnWidth(tableElement: HTMLElement, selectedColumnSizer: SelectedColumnSizerT,
      columnElement: HTMLElement) {
    const {width, delta} = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, columnElement);
    columnElement.style.width = `${width}px`;
    if (Browser.IS_SAFARI) tableElement.style.width = `${tableElement.offsetWidth + delta}px`; // REF-11
  }

  // when the user moves the sizer to the start/end of a column in an attempt to completely crush the column,
  // the dom will not allow that and will leave enough space for the column to display its text,
  // the problem is that the widths will be set incorrectly and need to be corrected
  // prettier-ignore
  private static correctWidths(selectedColumnSizer: SelectedColumnSizerT, crushedElement: HTMLElement,
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
  private static setWidths(selectedColumnSizer: SelectedColumnSizerT, leftHeader: HTMLElement,
      rightHeader: HTMLElement, initialWidthsTotal: number) {
    const {width} = ColumnSizerSetWidth.getNewColumnWidth(selectedColumnSizer, leftHeader);
    const newRightWidth = Math.max(0, initialWidthsTotal - width);
    leftHeader.style.width = `${width}px`;
    rightHeader.style.width = `${newRightWidth}px`;
  }

  // prettier-ignore
  private static setColumnsWidths(selectedColumnSizer: SelectedColumnSizerT, leftHeader: HTMLElement,
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
  public static set(selectedColumnSizer: SelectedColumnSizerT, tableElement: HTMLElement,
      tableDimensions: TableDimensions, leftHeader: HTMLElement, rightHeader?: HTMLElement) {
    // REF-11
    if (rightHeader && tableDimensions.width !== undefined) {
      // when the table width is static - control the width of two columns
      ColumnSizerSetWidth.setColumnsWidths(selectedColumnSizer, leftHeader, rightHeader);
    } else {
      ColumnSizerSetWidth.setColumnWidth(tableElement, selectedColumnSizer, leftHeader);
    }
  }
}
