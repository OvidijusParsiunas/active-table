import {StringDimensionUtils, SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {TableElement} from '../../elements/table/tableElement';
import {OverflowInternal} from '../../types/overflowInternal';
import {ActiveTable} from '../../activeTable';
import {Overflow} from '../../types/overflow';
import {Browser} from '../browser/browser';

export class OverflowUtils {
  private static ID = 'overflow-container';
  public static SCROLLBAR_WIDTH = 15;

  public static isOverflowElement(element?: HTMLElement) {
    return element?.id === OverflowUtils.ID;
  }

  // a simple way to not take the border into consideration when doing table width calculation, however if there are issues
  // feel free to investigate a better way
  public static unsetBorderDimensions(numberDimension: SuccessResult) {
    numberDimension.number -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
    TableElement.changeStaticWidthTotal(-TableElement.BORDER_DIMENSIONS.leftWidth);
    TableElement.changeStaticWidthTotal(-TableElement.BORDER_DIMENSIONS.rightWidth);
    TableElement.BORDER_DIMENSIONS.leftWidth = 0;
    TableElement.BORDER_DIMENSIONS.rightWidth = 0;
    TableElement.BORDER_DIMENSIONS.topWidth = 0;
    TableElement.BORDER_DIMENSIONS.bottomWidth = 0;
  }

  public static processNumberDimension(numberDimension: SuccessResult) {
    OverflowUtils.unsetBorderDimensions(numberDimension);
    numberDimension.number -= OverflowUtils.SCROLLBAR_WIDTH;
  }

  // prettier-ignore
  private static moveBorderToOverflowContainer(overflowContainer: HTMLElement, tableElement: HTMLElement) {
    GenericElementUtils.moveStyles(tableElement, overflowContainer,
      'borderRight', 'borderLeft', 'borderTop', 'borderBottom');
    tableElement.style.border = 'unset';
  }

  private static adjustStyleForScrollbarWidth(overflowContainer: HTMLElement, overflow: Overflow) {
    if (Browser.IS_SAFARI || Browser.IS_FIREFOX) {
      if (overflow.maxHeight && !overflow.maxWidth) {
        // this is used to not create a horizontal scroll
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
  private static getDimensions(at: ActiveTable, overflow: Overflow, overflowInternal: OverflowInternal) {
    const widthResult = StringDimensionUtils.generateNumberDimensionFromClientString(
      'maxWidth', at.parentElement as HTMLElement, overflow, true) || {number: 0, isPercentage: false};
    widthResult.number -= TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
    if (widthResult.isPercentage) overflowInternal.isWidthPercentage = true;
    // if heightResult is 0 for a %, the likelyhood is that the parent element does not have height set
    const heightResult = StringDimensionUtils.generateNumberDimensionFromClientString(
      'maxHeight', at.parentElement as HTMLElement, overflow, false) || {number: 0, isPercentage: false};
    heightResult.number -= TableElement.BORDER_DIMENSIONS.topWidth + TableElement.BORDER_DIMENSIONS.bottomWidth;
    if (heightResult.isPercentage) overflowInternal.isHeightPercentage = true;
    return {width: widthResult.number, height: heightResult.number};
  }

  public static applyDimensions(at: ActiveTable) {
    if (!at.overflow || !at.overflowInternal) return;
    const dimensions = OverflowUtils.getDimensions(at, at.overflow, at.overflowInternal);
    OverflowUtils.setDimensions(at.overflowInternal.overflowContainer, dimensions);
    OverflowUtils.adjustStyleForScrollbarWidth(at.overflowInternal.overflowContainer, at.overflow);
  }

  public static setupContainer(at: ActiveTable, tableElement: HTMLElement) {
    const overflowContainer = document.createElement('div');
    at.overflowInternal = {overflowContainer};
    overflowContainer.id = OverflowUtils.ID;
    OverflowUtils.moveBorderToOverflowContainer(overflowContainer, tableElement);
    overflowContainer.appendChild(tableElement);
  }
}
