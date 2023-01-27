import {StaticTable} from '../../../utils/tableDimensions/staticTable/staticTable';
import {ExtractElements} from '../../../utils/elements/extractElements';
import {TableDimensions} from '../../../types/tableDimensions';
import {SizerMoveLimits} from '../../../types/columnSizer';
import {ActiveTable} from '../../../activeTable';

export class MoveLimits {
  // Borders of the side cells tend to breach over the limits of the table (when no side auxiliary elements),
  // causing the offsets to give incorrect data and set the limits beyond the table. The breach magnitude is
  // influenced by the sizer start position when cells have borders - which is the very center position of
  // the total of those two borders width.
  // prettier-ignore
  private static getSideLimitDelta(leftElement: HTMLElement) {
    // left element will always be the actual element, however when width is set on the right header(s), rightHeader
    // will actually be first dynamic header in the ones following the sizer. Hence the only reliably way
    // of obtaining the actual right header is by extracting it manually by traversing the DOM.
    const rightElement = ExtractElements.getRightColumnSiblingCell(leftElement) as HTMLElement;
    const sideLimitDelta = (Number.parseFloat(getComputedStyle(leftElement).borderRightWidth) || 0)
      - (Number.parseFloat(getComputedStyle(rightElement).borderLeftWidth) || 0);
    return sideLimitDelta / 2;
  }

  private static getRightLimitDynamicWidthTable() {
    return window.innerWidth;
  }

  // prettier-ignore
  private static getRightLimitForMaxWidth(tableElement: HTMLElement,
      tableDimensions: TableDimensions, rightHeader?: HTMLElement) {
    if (StaticTable.isTableAtMaxWidth(tableElement, tableDimensions)) {
      return rightHeader ? Number.parseFloat(rightHeader.style.width) : 0;
    }
    return (tableDimensions.maxWidth as number) - tableElement.offsetWidth;
  }

  private static getRightLimit(at: ActiveTable, rightHeader?: HTMLElement) {
    if (at.tableDimensions.width !== undefined) {
      // there is always a resizable header on right of a sizer when table width is set
      return Number.parseFloat((rightHeader as HTMLElement).style.width);
    } else if (at.tableDimensions.maxWidth !== undefined && at.tableElementRef) {
      return MoveLimits.getRightLimitForMaxWidth(at.tableElementRef, at.tableDimensions, rightHeader);
    }
    return MoveLimits.getRightLimitDynamicWidthTable();
  }

  private static getLeftLimit(leftHeader: HTMLElement, sideLimitDelta?: number) {
    let leftLimit = -leftHeader.offsetWidth;
    if (sideLimitDelta !== undefined) leftLimit += sideLimitDelta;
    return leftLimit;
  }

  // prettier-ignore
  public static generate(at: ActiveTable, isFirstSizer: boolean, isLastSizer: boolean,
      columnSizerOffset: number, rightHeader: HTMLElement | undefined, leftHeader: HTMLElement): SizerMoveLimits {
    const sideLimitDelta = isFirstSizer || isLastSizer ? MoveLimits.getSideLimitDelta(leftHeader) : 0;
    return {
      left: MoveLimits.getLeftLimit(leftHeader, isFirstSizer ? sideLimitDelta : undefined) + columnSizerOffset,
      right: MoveLimits.getRightLimit(at, rightHeader),
    };
  }
}
