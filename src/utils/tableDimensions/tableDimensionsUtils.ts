import {PossibleStringDimensions, StringDimensionUtils} from './stringDimensionUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {IndexColumnT} from '../../types/auxiliaryTableContent';
import {TableDimensions} from '../../types/tableDimensions';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {TableContents} from '../../types/tableContents';
import {OverflowUtils} from '../overflow/overflowUtils';
import {TableStyle} from '../../types/tableStyle';

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

  private static setPreserveNarrowColumnsProp(etc: EditableTableComponent, tableDimensions: TableDimensions) {
    // the reason why preserNarrowColumns is stored inside an object is because we temporarily need to overwrite it
    // when resizing the table and we do not want to re-render
    tableDimensions.preserveNarrowColumns = etc.preserveNarrowColumns;
  }

  private static setDefaultDimension(tableDimensions: TableDimensions, parentElement: HTMLElement) {
    // 100% width of the parent element
    tableDimensions.maxWidth = parentElement.offsetWidth;
    tableDimensions.isPercentage = true;
  }

  // prettier-ignore
  private static setDimension(etc: EditableTableComponent, key: keyof PossibleStringDimensions<TableStyle>) {
    const {tableStyle, tableDimensions, tableElementRef, parentElement} = etc;
    if (!tableElementRef || !parentElement) return;
    const numberDimension = StringDimensionUtils.generateNumberDimensionFromClientString(key,
      parentElement, tableStyle, true, TableDimensionsUtils.MINIMAL_TABLE_WIDTH);
    if (numberDimension !== undefined) {
      if (etc.overflow) OverflowUtils.processNumberDimension(numberDimension);
      tableDimensions[key] = numberDimension.number;
      tableDimensions.isPercentage = numberDimension.isPercentage;
    }
  }

  // CAUTION-3
  // prettier-ignore
  public static setTableDimensions(etc: EditableTableComponent) {
    const {tableStyle, tableDimensions, auxiliaryTableContentInternal: {displayIndexColumn}} = etc;
    const parentElement = etc.parentElement as HTMLElement;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableStyle.width !== undefined) {
      TableDimensionsUtils.setDimension(etc, 'width');
    } else if (tableStyle.maxWidth !== undefined) {
      TableDimensionsUtils.setDimension(etc, 'maxWidth');
    } else if (
      !GenericElementUtils.isParentWidthUndetermined(parentElement.style.width)
    ) {
      TableDimensionsUtils.setDefaultDimension(tableDimensions, parentElement);
    }
    StringDimensionUtils.removeAllDimensions(tableStyle);
    // else the table automatically holds an unlimited size via table-controlled-width class (dynamic table)
    TableDimensionsUtils.setPreserveNarrowColumnsProp(etc, tableDimensions);
    TableDimensionsUtils.setIsColumnIndexCellTextWrapped(tableDimensions, displayIndexColumn);
  }

  public static cleanupContentsThatDidNotGetAdded(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    if (contents[0]?.length - columnsDetails.length > 0) contents.forEach((row) => row.splice(columnsDetails.length));
    if (contents.length > columnsDetails[0]?.elements.length) contents.splice(columnsDetails[0].elements.length);
  }

  public static hasSetTableWidthBeenBreached(etc: EditableTableComponent) {
    const {width, maxWidth} = etc.tableDimensions;
    const tableOffset = etc.offsetWidth;
    const setWidth = width || maxWidth;
    if (setWidth) {
      // tableOffset is usually rounded, hence using Math.ceil on setWidth to correctly compare them
      return Math.ceil(setWidth) < tableOffset;
    }
    return false;
  }

  public static record(etc: EditableTableComponent) {
    etc.tableDimensions.recordedParentWidth = (etc.parentElement as HTMLElement).offsetWidth;
    etc.tableDimensions.recordedParentHeight = (etc.parentElement as HTMLElement).offsetHeight;
    etc.tableDimensions.recordedWindowWidth = window.innerWidth;
    etc.tableDimensions.recordedWindowHeight = window.innerHeight;
  }

  public static getDefault() {
    return {recordedParentWidth: 0, recordedParentHeight: 0, recordedWindowWidth: 0, recordedWindowHeight: 0};
  }
}
