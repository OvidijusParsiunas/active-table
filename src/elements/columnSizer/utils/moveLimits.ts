import {ColumnSettingsWidthUtils} from '../../../utils/columnSettings/columnSettingsWidthUtils';
import {StaticTable} from '../../../utils/tableDimensions/staticTable/staticTable';
import {ColumnDetailsUtils} from '../../../utils/columnDetails/columnDetailsUtils';
import {ColumnSettingsInternal} from '../../../types/columnsSettingsInternal';
import {EditableTableComponent} from '../../../editable-table-component';
import {ExtractElements} from '../../../utils/elements/extractElements';
import {TableDimensions} from '../../../types/tableDimensions';
import {SizerMoveLimits} from '../../../types/columnSizer';

export class MoveLimits {
  // Borders of the side cells tend to breach over the limits of the table (when no side auxiliary elements),
  // causing the offsets to give incorrect data and set the limits beyond the table. The breach magnitude is
  // influenced by the sizer start position when cells have borders - which is the very center position of
  // the total of those two borders width.
  // prettier-ignore
  private static getSideLimitDelta(leftElement: HTMLElement) {
    // left element will always be the actual element as even when minWidth is set in its settings, we return
    // the left element of the sizer, however when minWidth/width are set on the right header(s), rightHeader
    // will actually be first dynamic header in the ones following the sizer. Hence the only reliably way
    // of obtaining the actual right header is by extracting it manually by traversing the DOM.
    const rightElement = ExtractElements.getRightColumnSiblingCell(leftElement) as HTMLElement;
    const sideLimitDelta = (Number.parseFloat(leftElement.style.borderRightWidth) || 0)
      - (Number.parseFloat(rightElement.style.borderLeftWidth) || 0);
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

  // prettier-ignore
  private static getRightLimitStaticWidthTable(etc: EditableTableComponent, rightHeader?: HTMLElement,
      sideLimitDelta?: number) {
    if (rightHeader) {
      let rightLimit = Number.parseFloat(rightHeader.style.width);
      if (sideLimitDelta !== undefined) rightLimit += sideLimitDelta;
      return rightLimit;
    }
    // table with set width does not normally have a sizer on the last column and this class would not be called, however
    // when the sizer is selected for column with minWidth setting and all the following columns are not dynamic (with
    // width/minWidth settings), rightHeader will be undefined and this is the only way to get the right limit.
    const {tableElementRef, tableDimensions: {width}} = etc;
    return (width as number) - (tableElementRef as HTMLElement).offsetWidth;
  }

  private static getRightLimit(etc: EditableTableComponent, rightHeader?: HTMLElement, sideLimitDelta?: number) {
    if (etc.tableDimensions.width !== undefined) {
      return MoveLimits.getRightLimitStaticWidthTable(etc, rightHeader, sideLimitDelta);
    } else if (etc.tableDimensions.maxWidth !== undefined && etc.tableElementRef) {
      return MoveLimits.getRightLimitForMaxWidth(etc.tableElementRef, etc.tableDimensions, rightHeader);
    }
    return MoveLimits.getRightLimitDynamicWidthTable();
  }

  // prettier-ignore
  private static getLeftLimit(etc: EditableTableComponent,
      leftHeader: HTMLElement, leftHeaderSettings: ColumnSettingsInternal, sideLimitDelta?: number) {
    const {tableElementRef, columnsDetails} = etc;
    let leftLimit = 0;
    if (leftHeaderSettings.minWidth !== undefined) {
      // if table width is set and there are no more dynamic columns, do not allow current column size to be reduced
      if (etc.tableDimensions.width !== undefined
        && ColumnDetailsUtils.getFilteredColumns(columnsDetails).dynamicWidthColumns.length === 0) return 0;
      // REF-21 - works for left, but not perfectly for right
      const {number} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElementRef as HTMLElement, leftHeaderSettings);
      leftLimit = -(leftHeader.offsetWidth - number);
    } else {
      leftLimit = -leftHeader.offsetWidth;
    }
    if (sideLimitDelta !== undefined) leftLimit += sideLimitDelta;
    return leftLimit;
  }

  // prettier-ignore
  public static generate(etc: EditableTableComponent, isFirstSizer: boolean,
      isLastSizer: boolean, columnSizerOffset: number, rightHeader: HTMLElement | undefined,
      leftHeader: HTMLElement, leftHeaderSettings: ColumnSettingsInternal): SizerMoveLimits {
    const sideLimitDelta = isFirstSizer || isLastSizer ? MoveLimits.getSideLimitDelta(leftHeader) : 0;
    return {
      left: MoveLimits.getLeftLimit(etc, leftHeader, leftHeaderSettings,
        isFirstSizer ? sideLimitDelta : undefined) + columnSizerOffset,
      right: MoveLimits.getRightLimit(etc, rightHeader,
        isLastSizer ? sideLimitDelta : undefined) + columnSizerOffset,
    };
  }
}
