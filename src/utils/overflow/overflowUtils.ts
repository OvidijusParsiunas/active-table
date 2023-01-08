import {StringDimensionUtils, SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {EditableTableComponent} from '../../editable-table-component';
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
    if (numberDimension?.number) {
      numberDimension.number -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
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
      // how will max width work?
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

  // prettier-ignore
  private static getDimensions(etc: EditableTableComponent, overflow: Overflow) {
    const widthResult = StringDimensionUtils.generateNumberDimensionFromClientString(
      'maxWidth', etc.parentElement as HTMLElement, overflow, true) || {number: 0};
    widthResult.number -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
    // if heightResult is 0 for a %, the likelyhood is that the parent element does not have height set
    const heightResult = StringDimensionUtils.generateNumberDimensionFromClientString(
      'maxHeight', etc.parentElement as HTMLElement, overflow, false) || {number: 0};
    return {width: widthResult.number, height: heightResult.number};
  }

  public static setupContainer(etc: EditableTableComponent, tableElement: HTMLElement) {
    if (!etc.overflow) return;
    const overflowContainer = document.createElement('div');
    overflowContainer.id = OverflowUtils.ID;
    const dimensions = OverflowUtils.getDimensions(etc, etc.overflow);
    OverflowUtils.setDimensions(overflowContainer, dimensions);
    OverflowUtils.adjustForScrollbarWidth(overflowContainer, etc.overflow);
    OverflowUtils.moveBorderToOverlay(etc.tableStyle, overflowContainer, tableElement);
    overflowContainer.appendChild(tableElement);
    etc.overflowInternal = {overflowContainer};
  }
}
