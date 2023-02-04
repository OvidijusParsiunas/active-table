import {ColumnDetailsUtils} from '../../columnDetails/columnDetailsUtils';
import {TableDimensions} from '../../../types/tableDimensions';
import {ColumnsByWidth} from '../../../types/columnsByWidth';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {ActiveTable} from '../../../activeTable';
import {StaticTable} from './staticTable';

// TO-DO when not at maximum length - have a setting option to resize all columns to the limit as resizing to small and
// back does not preserve the original width. Alternatively go as far as checking that data has not been changed since
// the resize and if not - automatically set to the original ratio

// table width is considered static when the user sets its width
export class StaticTableWidthUtils {
  // REF-11
  private static togglePreserveNarrowColumns(isSetValue: boolean, tableElement: HTMLElement, preserve?: boolean) {
    if (!preserve) {
      // the reason why this is only executed when preserveNarrowColumns is false is because when the narrow columns
      // overflow the set table width - 'block' causes the border to remain at the set width and not cover the full table,
      // another reason (for MaxWidth) is when the table width is not set - 'block' causes the columns widths to
      // be an arbitrary value - and inherently the table offset to not respect their pixel widths
      // 'block' causes the table offset width to be the same (when no overflow) as the set css width pixel value
      tableElement.style.display = isSetValue ? 'block' : '';
    }
  }

  // when the client has not provided the 'width' value for the table, but a 'maxWidth' is present, need to
  // temporarily set the width at the start in order to help the MaximumColumns class to determine what columns fit
  // prettier-ignore
  public static toggleWidthUsingMaxWidth(at: ActiveTable, isSetValue: boolean) {
    const {tableElementRef, tableDimensions: {maxWidth, preserveNarrowColumns}} = at;
    if (tableElementRef && maxWidth !== undefined) {
      tableElementRef.style.width = isSetValue ? `${maxWidth}px` : ''; // '' defaults width back to min-content
      StaticTableWidthUtils.togglePreserveNarrowColumns(isSetValue, tableElementRef, preserveNarrowColumns); // REF-11
    }
  }

  // prettier-ignore
  public static setTableWidth(at: ActiveTable) {
    const {tableDimensions: {preserveNarrowColumns, width}, tableElementRef} = at;
    if (tableElementRef && width !== undefined) {
      tableElementRef.style.width = `${width}px`;
      StaticTableWidthUtils.togglePreserveNarrowColumns(true, tableElementRef, preserveNarrowColumns); // REF-11
    }
  }

  // This only runs when the table width is set
  // prettier-ignore
  private static changeTableWidthForNonDynamicColumns(columnsDetails: ColumnsDetailsT,
      columnsByWidth: ColumnsByWidth, tableElement: HTMLElement, setTableWidth: number, staticWidth: number) {
    if (columnsDetails.length === 0 || columnsByWidth.dynamicWidth.length > 0) {
      // this would be triggered if there were only width setting columns and they got removed
      if (tableElement.offsetWidth !== setTableWidth) tableElement.style.width = `${setTableWidth}px`;
    } else {
      // please note that the width will no longer be the same as activeTable.tableDimensions.width
      tableElement.style.width = `${staticWidth}px`;
    }
  }

  private static resetDynamicWidthColumns(dynamicWidthColumns: ColumnsDetailsT, tableDimensions: TableDimensions) {
    dynamicWidthColumns.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${tableDimensions.newColumnWidth}px`;
    });
  }

  private static setNewColumnWidth(tableWidth: number, numberOfDynamicColumns: number, tableDimensions: TableDimensions) {
    if (numberOfDynamicColumns > 0) {
      const totalColumnsWidth = tableWidth - tableDimensions.staticWidth;
      tableDimensions.newColumnWidth = totalColumnsWidth / numberOfDynamicColumns;
    }
  }

  private static resetColumnSizes(columnsDetails: ColumnsDetailsT, tableWidth: number, tableDimensions: TableDimensions) {
    const columnsByWidth = ColumnDetailsUtils.getColumnsByWidth(columnsDetails);
    StaticTableWidthUtils.setNewColumnWidth(tableWidth, columnsByWidth.dynamicWidth.length, tableDimensions);
    StaticTableWidthUtils.resetDynamicWidthColumns(columnsByWidth.dynamicWidth, tableDimensions);
    return columnsByWidth;
  }

  public static changeWidthsBasedOnColumnInsertRemove(at: ActiveTable, isInsert: boolean) {
    const {tableElementRef: table, tableDimensions: td, columnsDetails, onColumnsUpdate} = at;
    if (!table) return;
    const {width, maxWidth, staticWidth} = td;
    if (width !== undefined) {
      const colsByWidth = StaticTableWidthUtils.resetColumnSizes(columnsDetails, width, td);
      StaticTableWidthUtils.changeTableWidthForNonDynamicColumns(columnsDetails, colsByWidth, table, width, staticWidth);
      // isInsert check was initially not needed as this was not getting called when a column had been removed, however
      // it has been identified that the table offsetWidth does not immediately update when the column widths are very
      // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_WIDTH variable), hence it was added
    } else if (isInsert && StaticTable.isTableAtMaxWidth(table, td)) {
      StaticTableWidthUtils.resetColumnSizes(columnsDetails, maxWidth as number, td);
    }
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(columnsDetails, onColumnsUpdate));
  }
}
