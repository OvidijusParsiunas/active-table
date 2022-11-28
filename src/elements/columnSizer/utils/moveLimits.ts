import {ColumnSettingsWidthUtil} from '../../../utils/columnSettings/columnSettingsWidthUtil';
import {StaticTable} from '../../../utils/tableDimensions/staticTable/staticTable';
import {TableDimensionsInternal} from '../../../types/tableDimensionsInternal';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../types/columnsSettings';
import {UNSET_NUMBER_IDENTIFIER} from '../../../consts/unsetNumber';
import {SizerMoveLimits} from '../../../types/columnSizer';
import {TableElement} from '../../table/tableElement';

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

  private static getRightLimitStaticWidthTable(isSecondLastSizer: boolean, widthLimit: number, rightHeader?: HTMLElement) {
    // table with set width does not normally have a sizer on the last column, however when the sizer is selected for
    // column with minWidth setting and all the following columns are not dynamic (with setting width), rightHeader
    // will be undefined and this is the only way to get the right limit. (Please take note that when there are no
    // dynamic columns (all with setting width), table width may actually be lower than the limit, hence using table
    // width is not suggicient and this is the best way)
    let rightLimit = rightHeader?.offsetWidth || widthLimit - TableElement.STATIC_WIDTH_CONTENT_TOTAL;
    if (!isSecondLastSizer) rightLimit += MoveLimits.SIDE_LIMIT_DELTA;
    return rightLimit;
  }

  private static getRightLimit(etc: EditableTableComponent, isSecondLastSizer: boolean, rightHeader?: HTMLElement) {
    if (etc.tableDimensionsInternal.width !== undefined) {
      return MoveLimits.getRightLimitStaticWidthTable(isSecondLastSizer, etc.tableDimensionsInternal.width, rightHeader);
    } else if (etc.tableDimensionsInternal.maxWidth !== undefined && etc.tableElementRef) {
      return MoveLimits.getRightLimitForMaxWidth(etc.tableElementRef, etc.tableDimensionsInternal, rightHeader);
    }
    return MoveLimits.getRightLimitDynamicWidthTable();
  }

  // prettier-ignore
  private static getLeftLimit(leftHeader: HTMLElement,
      isFirstSizer: boolean, tableElement: HTMLElement, leftHeaderSettings?: ColumnSettingsInternal) {
    let leftLimit = 0;
    // REF-21 - works for left, but not perfectly for right
    if (leftHeaderSettings?.minWidth !== undefined) {
      const { width } = ColumnSettingsWidthUtil.getSettingsWidthNumber(tableElement, leftHeaderSettings);
      leftLimit = -(leftHeader.offsetWidth - width);
    } else {
      leftLimit = -leftHeader.offsetWidth;
    }
    if (isFirstSizer) leftLimit += MoveLimits.SIDE_LIMIT_DELTA;
    return leftLimit;
  }

  // prettier-ignore
  public static generate(etc: EditableTableComponent, isFirstSizer: boolean,
      isSecondLastSizer: boolean, leftHeader: HTMLElement, rightHeader: HTMLElement | undefined,
      columnSizerOffset: number, leftHeaderSettings?: ColumnSettingsInternal): SizerMoveLimits {
    if (MoveLimits.SIDE_LIMIT_DELTA === UNSET_NUMBER_IDENTIFIER) {
      // (CAUTION-1) - when styles are different take this into consideration
      // only needs to be set once
      MoveLimits.setSideLimitDelta(leftHeader);
    }
    return {
      left: MoveLimits.getLeftLimit(
        leftHeader, isFirstSizer, etc.tableElementRef as HTMLElement, leftHeaderSettings) + columnSizerOffset,
      right: MoveLimits.getRightLimit(etc, isSecondLastSizer, rightHeader) + columnSizerOffset,
    };
  }
}
