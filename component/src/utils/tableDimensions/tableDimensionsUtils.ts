import {TableBorderDimensionsUtils} from '../../elements/table/tableBorderDimensionsUtils';
import {PossibleStringDimensions, StringDimensionUtils} from './stringDimensionUtils';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {TableDimensions} from '../../types/tableDimensions';
import {IndexColumnT} from '../../types/frameComponents';
import {OverflowUtils} from '../overflow/overflowUtils';
import {TableStyle} from '../../types/tableStyle';
import {ActiveTable} from '../../activeTable';

export class TableDimensionsUtils {
  public static readonly MINIMAL_TABLE_WIDTH = 70;

  // REF-19
  private static setIsColumnIndexCellTextWrapped(tableDimensions: TableDimensions, displayIndexColumn: IndexColumnT) {
    if (displayIndexColumn) {
      if (typeof displayIndexColumn === 'object' && displayIndexColumn.wrapIndexCellText) {
        tableDimensions.isColumnIndexCellTextWrapped = true;
      } else if (tableDimensions.isColumnIndexCellTextWrapped === undefined) {
        tableDimensions.isColumnIndexCellTextWrapped = false;
      }
    }
  }

  private static setPreserveNarrowColumnsProp(at: ActiveTable, tableDimensions: TableDimensions) {
    // the reason why preserNarrowColumns is stored inside an object is because we temporarily need to overwrite it
    // when resizing the table and we do not want to re-render
    tableDimensions.preserveNarrowColumns = at.preserveNarrowColumns;
  }

  // prettier-ignore
  private static setDimension(at: ActiveTable, key: keyof PossibleStringDimensions<TableStyle>) {
    const {tableStyle, _tableDimensions, _tableElementRef, parentElement} = at;
    if (!_tableElementRef || !parentElement) return;
    const numberDimension = StringDimensionUtils.generateNumberDimensionFromClientString(
      parentElement, tableStyle, key, true, TableDimensionsUtils.MINIMAL_TABLE_WIDTH);
    if (numberDimension.number > 0) {
      if (at.overflow) OverflowUtils.processNumberDimension(_tableDimensions, numberDimension);
      _tableDimensions[key] = numberDimension.number;
      _tableDimensions.isPercentage = numberDimension.isPercentage;
    }
  }

  // CAUTION-3
  // prettier-ignore
  public static setTableDimensions(at: ActiveTable) {
    const {tableStyle, _tableDimensions, _frameComponents: {displayIndexColumn}} = at;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableStyle.width !== undefined) {
      TableDimensionsUtils.setDimension(at, 'width');
    } else if (tableStyle.maxWidth !== undefined) {
      TableDimensionsUtils.setDimension(at, 'maxWidth');
    }
    // else the table automatically holds an unlimited size via table-controlled-width class (dynamic table)
    TableDimensionsUtils.setPreserveNarrowColumnsProp(at, _tableDimensions);
    TableDimensionsUtils.setIsColumnIndexCellTextWrapped(_tableDimensions, displayIndexColumn);
  }

  public static hasSetTableWidthBeenBreached(at: ActiveTable) {
    const {width, maxWidth} = at._tableDimensions;
    const tableOffset = at.offsetWidth;
    const setWidth = width || maxWidth;
    if (setWidth) {
      // tableOffset is usually rounded, hence using Math.ceil on setWidth to correctly compare them
      return Math.ceil(setWidth) < tableOffset;
    }
    return false;
  }

  public static record(at: ActiveTable) {
    at._tableDimensions.recordedParentWidth = (at.parentElement as HTMLElement).offsetWidth;
    at._tableDimensions.recordedParentHeight = (at.parentElement as HTMLElement).offsetHeight;
    at._tableDimensions.recordedWindowWidth = window.innerWidth;
    at._tableDimensions.recordedWindowHeight = window.innerHeight;
  }

  public static getDefault() {
    return {
      recordedParentWidth: 0,
      recordedParentHeight: 0,
      recordedWindowWidth: 0,
      recordedWindowHeight: 0,
      border: TableBorderDimensionsUtils.generateDefault(),
      staticWidth: UNSET_NUMBER_IDENTIFIER,
      newColumnWidth: 140,
      indexColumnWidth: IndexColumn.DEFAULT_WIDTH,
    };
  }
}
