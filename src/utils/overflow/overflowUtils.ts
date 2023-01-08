import {EditableTableComponent} from '../../editable-table-component';
import {SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {TableElement} from '../../elements/table/tableElement';
import {CSSStyle} from '../../types/cssStyle';
import {Overflow} from '../../types/overflow';
import {Browser} from '../browser/browser';

export class OverflowUtils {
  private static ID = 'overflow-container';
  private static SCROLLBAR_WIDTH = 15;

  public static isOverflowElement(element?: HTMLElement) {
    return element?.id === OverflowUtils.ID;
  }

  public static adjustPaginationContainer(paginationContainer: HTMLElement) {
    if (Browser.IS_SAFARI || Browser.IS_FIREFOX) {
      // paginationContainer.style.width = 'calc(100% - 15px)';
    }
  }

  // a simple way to not take the border into consideration when doing table width calculation, however if there are issues
  // feel free to investigate a better way
  public static unsetBorderDimensions(numberDimension?: SuccessResult) {
    if (numberDimension?.width) {
      numberDimension.width -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
      TableElement.changeStaticWidthTotal(-TableElement.BORDER_DIMENSIONS.leftWidth);
      TableElement.changeStaticWidthTotal(-TableElement.BORDER_DIMENSIONS.rightWidth);
      TableElement.BORDER_DIMENSIONS.leftWidth = 0;
      TableElement.BORDER_DIMENSIONS.rightWidth = 0;
      TableElement.BORDER_DIMENSIONS.topWidth = 0;
      TableElement.BORDER_DIMENSIONS.bottomWidth = 0;
    }
  }

  private static moveBorderToOverlay(tableStyle: CSSStyle, overflowContainer: HTMLElement, tableElement: HTMLElement) {
    overflowContainer.style.border = tableStyle.border as string;
    tableElement.style.border = '';
  }

  private static adjustForScrollbarWidth(overflowContainer: HTMLElement, overflow: Overflow) {
    if (Browser.IS_SAFARI || Browser.IS_FIREFOX) {
      if (!overflow.isScrollbarPartOfWidth) {
        overflowContainer.style.paddingRight = `${OverflowUtils.SCROLLBAR_WIDTH}px`;
      }
    }
  }

  private static setDimensions(overflowContainer: HTMLElement, {width, height}: {width: number; height: number}) {
    if (width) {
      overflowContainer.style.overflowX = 'auto';
      overflowContainer.style.maxWidth = `${width}px`;
    }
    if (height) {
      overflowContainer.style.overflowY = 'auto';
      overflowContainer.style.maxHeight = `${height}px`;
    }
  }

  private static getDimensions(overflow: Overflow) {
    let width = overflow.maxWidth ? Number.parseInt(overflow.maxWidth) : 0;
    if (!Browser.IS_SAFARI && !Browser.IS_FIREFOX && width && overflow.isScrollbarPartOfWidth) {
      width -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
    }
    const height = overflow.maxHeight ? Number.parseInt(overflow.maxHeight) : 0;
    return {width, height};
  }

  public static setupContainer(etc: EditableTableComponent, tableElement: HTMLElement) {
    if (!etc.overflow) return;
    const overflowContainer = document.createElement('div');
    overflowContainer.id = OverflowUtils.ID;
    const dimensions = OverflowUtils.getDimensions(etc.overflow);
    OverflowUtils.setDimensions(overflowContainer, dimensions);
    OverflowUtils.adjustForScrollbarWidth(overflowContainer, etc.overflow);
    OverflowUtils.moveBorderToOverlay(etc.tableStyle, overflowContainer, tableElement);
    overflowContainer.appendChild(tableElement);
    etc.overflowInternal = {overflowContainer};
  }
}
