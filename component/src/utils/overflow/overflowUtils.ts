import {StringDimensionUtils, ParsedDimension} from '../tableDimensions/stringDimensionUtils';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {TableElement} from '../../elements/table/tableElement';
import {OverflowInternal} from '../../types/overflowInternal';
import {TableDimensions} from '../../types/tableDimensions';
import {ActiveTable} from '../../activeTable';
import {Overflow} from '../../types/overflow';
import {Browser} from '../browser/browser';

export class OverflowUtils {
  private static ID = 'overflow-container';
  public static readonly SCROLLBAR_WIDTH = 15;

  public static isOverflowElement(element?: HTMLElement) {
    return element?.id === OverflowUtils.ID;
  }

  // a simple way to not take the border into consideration when doing table width calculation, however if there are issues
  // feel free to investigate a better way
  public static unsetBorderDimensions(tableDimensions: TableDimensions, numberDimension: ParsedDimension) {
    numberDimension.number -= tableDimensions.border.leftWidth + tableDimensions.border.rightWidth;
    TableElement.changeStaticWidthTotal(tableDimensions, -tableDimensions.border.leftWidth);
    TableElement.changeStaticWidthTotal(tableDimensions, -tableDimensions.border.rightWidth);
    tableDimensions.border.leftWidth = 0;
    tableDimensions.border.rightWidth = 0;
    tableDimensions.border.topWidth = 0;
    tableDimensions.border.bottomWidth = 0;
  }

  public static processNumberDimension(tableDimensions: TableDimensions, numberDimension: ParsedDimension) {
    OverflowUtils.unsetBorderDimensions(tableDimensions, numberDimension);
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
      at.parentElement as HTMLElement, overflow, 'maxWidth', true);
    widthResult.number -= at.tableDimensions.border.leftWidth + at.tableDimensions.border.rightWidth;
    if (widthResult.isPercentage) overflowInternal.isWidthPercentage = true;
    // if heightResult is 0 for a %, the likelyhood is that the parent element does not have height set
    const heightResult = StringDimensionUtils.generateNumberDimensionFromClientString(
      at.parentElement as HTMLElement, overflow, 'maxHeight', false);
    heightResult.number -= at.tableDimensions.border.topWidth + at.tableDimensions.border.bottomWidth;
    if (heightResult.isPercentage) overflowInternal.isHeightPercentage = true;
    return {width: widthResult.number, height: heightResult.number};
  }

  public static applyDimensions(at: ActiveTable) {
    const {overflow, overflowInternal} = at;
    if (!overflow || !overflowInternal) return;
    const dimensions = OverflowUtils.getDimensions(at, overflow, overflowInternal);
    OverflowUtils.setDimensions(overflowInternal.overflowContainer, dimensions);
    OverflowUtils.adjustStyleForScrollbarWidth(overflowInternal.overflowContainer, overflow);
  }

  public static setupContainer(at: ActiveTable, tableElement: HTMLElement) {
    const overflowContainer = document.createElement('div');
    at.overflowInternal = {overflowContainer};
    overflowContainer.id = OverflowUtils.ID;
    OverflowUtils.moveBorderToOverflowContainer(overflowContainer, tableElement);
    overflowContainer.appendChild(tableElement);
  }
}
