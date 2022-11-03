import {ColumnSizerT, SelectedColumnSizerT} from '../../types/columnSizer';
import {EditableTableComponent} from '../../editable-table-component';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {Browser} from '../../utils/browser/browser';

export class SelectedColumnSizer {
  // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
  // give incorrect data and set the limit beyond the table limits, this is used to prevent it
  private static SIDE_LIMIT_DELTA = UNSET_NUMBER_IDENTIFIER;

  private static setSideLimitDelta(headerElement: HTMLElement) {
    SelectedColumnSizer.SIDE_LIMIT_DELTA = 0;
    if (headerElement.style.borderRightWidth) {
      SelectedColumnSizer.SIDE_LIMIT_DELTA += Number.parseInt(headerElement.style.borderRightWidth) / 2;
    }
    if (headerElement.style.borderLeftWidth) {
      SelectedColumnSizer.SIDE_LIMIT_DELTA -= Number.parseInt(headerElement.style.borderLeftWidth) / 2;
    }
  }

  private static getRightLimitDynamicWidthTable(etc: EditableTableComponent) {
    const parentElement = etc.parentElement as HTMLElement;
    const parentWidth = parentElement.offsetWidth;
    // parent element may already have an offset which will affect the table offset
    // bug where if the parent element is the <body> tag, then the offset will not display but that has been accepted
    const tableOffsetInParent = etc.offsetLeft - parentElement.offsetLeft;
    return parentWidth - tableOffsetInParent - etc.offsetWidth;
  }

  private static getRightLimitStaticWidthTable(isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    let rightLimit = rightHeader?.offsetWidth || 0;
    if (!isSecondLastSizer) rightLimit += SelectedColumnSizer.SIDE_LIMIT_DELTA;
    return rightLimit;
  }

  private static getRightLimit(etc: EditableTableComponent, isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    if (etc.tableDimensions.width || Browser.IS_SAFARI) {
      return SelectedColumnSizer.getRightLimitStaticWidthTable(isSecondLastSizer, rightHeader);
    }
    return SelectedColumnSizer.getRightLimitDynamicWidthTable(etc);
  }

  private static getLeftLimit(leftHeader: HTMLElement, isFirstSizer: boolean) {
    let leftLimit = -leftHeader.offsetWidth;
    if (!isFirstSizer) leftLimit += SelectedColumnSizer.SIDE_LIMIT_DELTA;
    return leftLimit;
  }

  // prettier-ignore
  private static generateObject(etc: EditableTableComponent, columnSizer: ColumnSizerT, isFirstSizer: boolean,
      isSecondLastSizer: boolean, leftHeader: HTMLElement, rightHeader: HTMLElement, ): SelectedColumnSizerT {
    // sizer is centered within the cell divider and starts with an offset, hence mouseMoveOffset is set
    // with that offset in order to limit the vertical line at the correct cell offset position
    const columnSizerOffset = columnSizer.movableElement.offsetLeft;
    return {
      element: columnSizer.element,
      moveLimits: {
        left: SelectedColumnSizer.getLeftLimit(leftHeader, isFirstSizer) + columnSizerOffset,
        right: SelectedColumnSizer.getRightLimit(etc, isSecondLastSizer, rightHeader) + columnSizerOffset,
      },
      // this is to reflect the initial sizer offset to center itself in the cell divider
      initialOffset: columnSizerOffset,
      mouseMoveOffset: columnSizerOffset,
    };
  }

  public static get(etc: EditableTableComponent, sizerNumber: number, columnSizer: ColumnSizerT): SelectedColumnSizerT {
    // WORK
    // last column should not have the next sizer if it is
    const isFirstSizer = sizerNumber === 0;
    const isSecondLastSizer = etc.columnsDetails.length > sizerNumber + 2;
    const leftHeader = etc.columnsDetails[sizerNumber].elements[0];
    const rightHeader = etc.columnsDetails[sizerNumber + 1]?.elements[0];
    if (SelectedColumnSizer.SIDE_LIMIT_DELTA === UNSET_NUMBER_IDENTIFIER) {
      // (CAUTION-1)
      // only needs to be set once
      SelectedColumnSizer.setSideLimitDelta(leftHeader);
    }
    return SelectedColumnSizer.generateObject(etc, columnSizer, isFirstSizer, isSecondLastSizer, leftHeader, rightHeader);
  }
}
