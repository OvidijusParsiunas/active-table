import {ColumnSettingsWidthUtils} from '../../../utils/columnSettings/columnSettingsWidthUtils';
import {StaticTable} from '../../../utils/tableDimensions/staticTable/staticTable';
import {ColumnDetailsUtils} from '../../../utils/columnDetails/columnDetailsUtils';
import {TableDimensionsInternal} from '../../../types/tableDimensionsInternal';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../types/columnsSettings';
import {UNSET_NUMBER_IDENTIFIER} from '../../../consts/unsetNumber';
import {SizerMoveLimits} from '../../../types/columnSizer';

export class MoveLimits {
  // borders of the side cells tend to breach over the limits of the table by half their width, causing the offsets to
  // give incorrect data and set the limit beyond the table limits, this is used to prevent it
  private static SIDE_LIMIT_DELTA = UNSET_NUMBER_IDENTIFIER;

  private static setSideLimitDelta(headerElement: HTMLElement) {
    MoveLimits.SIDE_LIMIT_DELTA = 0;
    if (headerElement.style.borderRightWidth) {
      MoveLimits.SIDE_LIMIT_DELTA += Math.ceil(Number.parseInt(headerElement.style.borderRightWidth) / 2);
    }
    if (headerElement.style.borderLeftWidth) {
      MoveLimits.SIDE_LIMIT_DELTA -= Math.floor(Number.parseInt(headerElement.style.borderLeftWidth) / 2);
    }
  }

  private static getRightLimitDynamicWidthTable() {
    return window.innerWidth;
  }

  // prettier-ignore
  private static getRightLimitForMaxWidth(tableElement: HTMLElement,
      tableDimensions: TableDimensionsInternal, rightHeader?: HTMLElement) {
    if (StaticTable.isTableAtMaxWidth(tableElement, tableDimensions)) {
      return rightHeader ? rightHeader.offsetWidth : 0;
    }
    return (tableDimensions.maxWidth as number) - tableElement.offsetWidth;
  }

  // prettier-ignore
  private static getRightLimitStaticWidthTable(etc: EditableTableComponent, isSecondLastSizer: boolean,
      rightHeader?: HTMLElement) {
    if (rightHeader) {
      let rightLimit = rightHeader.offsetWidth;
      if (!isSecondLastSizer) rightLimit += MoveLimits.SIDE_LIMIT_DELTA;
      return rightLimit;
    }
    // table with set width does not normally have a sizer on the last column and this class would not be called, however
    // when the sizer is selected for column with minWidth setting and all the following columns are not dynamic (with
    // width/minWidth settings), rightHeader will be undefined and this is the only way to get the right limit.
    const {tableElementRef, tableDimensionsInternal: {width}} = etc;
    return (width as number) - (tableElementRef as HTMLElement).offsetWidth;
  }

  private static getRightLimit(etc: EditableTableComponent, isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    if (etc.tableDimensionsInternal.width !== undefined) {
      return MoveLimits.getRightLimitStaticWidthTable(etc, isSecondLastSizer, rightHeader);
    } else if (etc.tableDimensionsInternal.maxWidth !== undefined && etc.tableElementRef) {
      return MoveLimits.getRightLimitForMaxWidth(etc.tableElementRef, etc.tableDimensionsInternal, rightHeader);
    }
    return MoveLimits.getRightLimitDynamicWidthTable();
  }

  // prettier-ignore
  private static getLeftLimit(etc: EditableTableComponent,
      isFirstSizer: boolean, leftHeader: HTMLElement, leftHeaderSettings?: ColumnSettingsInternal) {
    const {tableElementRef, columnsDetails} = etc;
    let leftLimit = 0;
    if (leftHeaderSettings?.minWidth !== undefined) {
      // if table width is set and there are no more dynamic columns, do not allow current column size to be reduced
      if (etc.tableDimensionsInternal.width !== undefined
        && ColumnDetailsUtils.getFilteredColumns(columnsDetails).dynamicWidthColumns.length === 0) return 0;
      // REF-21 - works for left, but not perfectly for right
      const {width} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElementRef as HTMLElement, leftHeaderSettings);
      leftLimit = -(leftHeader.offsetWidth - width);
    } else {
      leftLimit = -leftHeader.offsetWidth;
    }
    if (isFirstSizer) leftLimit += MoveLimits.SIDE_LIMIT_DELTA;
    return leftLimit;
  }

  // prettier-ignore
  public static generate(etc: EditableTableComponent, isFirstSizer: boolean,
      isSecondLastSizer: boolean, columnSizerOffset: number, rightHeader: HTMLElement | undefined,
      leftHeader: HTMLElement, leftHeaderSettings?: ColumnSettingsInternal): SizerMoveLimits {
    if (MoveLimits.SIDE_LIMIT_DELTA === UNSET_NUMBER_IDENTIFIER) {
      // (CAUTION-1) - when styles are different take this into consideration
      // only needs to be set once
      MoveLimits.setSideLimitDelta(leftHeader);
    }
    return {
      left: MoveLimits.getLeftLimit(etc, isFirstSizer, leftHeader, leftHeaderSettings) + columnSizerOffset,
      right: MoveLimits.getRightLimit(etc, isSecondLastSizer, rightHeader) + columnSizerOffset,
    };
  }
}
