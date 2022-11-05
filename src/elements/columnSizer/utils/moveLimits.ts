import {EditableTableComponent} from '../../../editable-table-component';
import {UNSET_NUMBER_IDENTIFIER} from '../../../consts/unsetNumber';
import {StaticTable} from '../../../utils/staticTable/staticTable';
import {SizerMoveLimits} from '../../../types/columnSizer';

export class MoveLimits {
  // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
  // give incorrect data and set the limit beyond the table limits, this is used to prevent it
  private static SIDE_LIMIT_DELTA = UNSET_NUMBER_IDENTIFIER;

  private static setSideLimitDelta(headerElement: HTMLElement) {
    MoveLimits.SIDE_LIMIT_DELTA = 0;
    if (headerElement.style.borderRightWidth) {
      MoveLimits.SIDE_LIMIT_DELTA += Number.parseInt(headerElement.style.borderRightWidth) / 2;
    }
    if (headerElement.style.borderLeftWidth) {
      MoveLimits.SIDE_LIMIT_DELTA -= Number.parseInt(headerElement.style.borderLeftWidth) / 2;
    }
  }

  private static getRightLimitDynamicWidthTable(etc: EditableTableComponent) {
    const parentElement = etc.parentElement as HTMLElement;
    const parentWidth = parentElement.offsetWidth;
    // parent element may already have an offset which will affect the table offset
    // bug where the parent element is the <body> tag, then the offset will not display but that has been accepted
    const tableOffsetInParent = etc.offsetLeft - parentElement.offsetLeft;
    return parentWidth - tableOffsetInParent - etc.offsetWidth;
  }

  private static getRightLimitForMaxWidth(maxWidth: number, currentWidth: number) {
    return maxWidth - currentWidth;
  }

  private static getRightLimitStaticWidthTable(isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    let rightLimit = rightHeader?.offsetWidth || 0;
    if (!isSecondLastSizer) rightLimit += MoveLimits.SIDE_LIMIT_DELTA;
    return rightLimit;
  }

  private static getRightLimit(etc: EditableTableComponent, isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    if (StaticTable.isStaticTableWidth(etc.tableElementRef as HTMLElement, etc.tableDimensions)) {
      return MoveLimits.getRightLimitStaticWidthTable(isSecondLastSizer, rightHeader);
    } else if (etc.tableDimensions.maxWidth !== undefined) {
      return MoveLimits.getRightLimitForMaxWidth(etc.tableDimensions.maxWidth, etc.offsetWidth);
    }
    return MoveLimits.getRightLimitDynamicWidthTable(etc);
  }

  private static getLeftLimit(leftHeader: HTMLElement, isFirstSizer: boolean) {
    let leftLimit = -leftHeader.offsetWidth;
    if (!isFirstSizer) leftLimit += MoveLimits.SIDE_LIMIT_DELTA;
    return leftLimit;
  }

  // prettier-ignore
  public static generate(etc: EditableTableComponent, isFirstSizer: boolean, isSecondLastSizer: boolean,
      leftHeader: HTMLElement, rightHeader: HTMLElement, columnSizerOffset: number): SizerMoveLimits {
    if (MoveLimits.SIDE_LIMIT_DELTA === UNSET_NUMBER_IDENTIFIER) {
      // (CAUTION-1)
      // only needs to be set once
      MoveLimits.setSideLimitDelta(leftHeader);
    }
    return {
      left: MoveLimits.getLeftLimit(leftHeader, isFirstSizer) + columnSizerOffset,
      right: MoveLimits.getRightLimit(etc, isSecondLastSizer, rightHeader) + columnSizerOffset,
    };
  }
}
