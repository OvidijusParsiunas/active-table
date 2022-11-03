import {ColumnSizerT, SelectedColumnSizerT} from '../../types/columnSizer';
import {EditableTableComponent} from '../../editable-table-component';
import {Browser} from '../../utils/browser/browser';

export class SelectedColumnSizer {
  // prettier-ignore
  private static getRightColumnLimit(etc: EditableTableComponent, leftHeader: HTMLElement,
      rightHeader?: HTMLElement, headerAfterRight = false) {
    // WORK - take into consideration border size and padding
    const cellRightBorderOffset = leftHeader.offsetLeft + leftHeader.offsetWidth;
    if (etc.tableDimensions.width || Browser.IS_SAFARI) {
      let rightLimit = rightHeader?.offsetWidth || 0;
      if (!headerAfterRight) {
        // these ain't going to change so can store them in state
        rightLimit += Number.parseInt(leftHeader.style.borderRightWidth) || 0;
      }
      return rightLimit;
    }
    const parentOffset = (etc.parentElement as HTMLElement).offsetWidth;
    const offsetInParent = etc.offsetLeft;
    return parentOffset - offsetInParent - cellRightBorderOffset;
  }

  private static getLeftLimit(leftHeader: HTMLElement, headerBeforeLeft?: boolean) {
    let leftLimit = -leftHeader.offsetWidth;
    if (!headerBeforeLeft) {
      // these ain't going to change so can store them in state
      leftLimit -= Number.parseInt(leftHeader.style.borderLeftWidth) || 0;
    }
    return leftLimit;
  }

  public static get(etc: EditableTableComponent, sizerNumber: number, columnSizer: ColumnSizerT): SelectedColumnSizerT {
    // WORK
    // take note of cell and table borders
    // last column should not have the next sizer if it is
    // use the number instead of overreaching
    const headerBeforeLeft = etc.columnsDetails[sizerNumber - 1];
    const leftHeader = etc.columnsDetails[sizerNumber].elements[0];
    const rightHeader = etc.columnsDetails[sizerNumber + 1]?.elements[0];
    const headerAfterRight = etc.columnsDetails[sizerNumber + 2];
    // column is centered and starts with an offset, hence mouseMoveOffset starts with that offset in order to place
    // the vertical line at the correct left limit
    const columnSizerOffset = columnSizer.movableElement.offsetLeft;
    return {
      element: columnSizer.element,
      moveLimits: {
        left: SelectedColumnSizer.getLeftLimit(leftHeader, !!headerBeforeLeft) + columnSizerOffset,
        right:
          SelectedColumnSizer.getRightColumnLimit(etc, leftHeader, rightHeader, !!headerAfterRight) + columnSizerOffset,
      },
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
    };
  }
}
