import {EditableTableComponent} from '../../../editable-table-component';
import {TableElement} from '../../../elements/table/tableElement';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {StaticTable} from './staticTable';

// TO-DO when not at maximum length - have a setting option to resize all columns to the limit as resizing to small and
// back does not preserve the original width. Alternatively go as far as checking that data has not been changed since
// the resize and if not - automatically set to the original ratio

// table width is considered static when the user sets its width
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;

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
  public static toggleWidthUsingMaxWidth(etc: EditableTableComponent, isSetValue: boolean) {
    const {tableElementRef, tableDimensionsInternal: { maxWidth, preserveNarrowColumns }} = etc;
    if (tableElementRef && maxWidth !== undefined) {
      tableElementRef.style.width = isSetValue ? `${maxWidth}px` : ''; // '' defaults width back to min-content
      StaticTableWidthUtils.togglePreserveNarrowColumns(isSetValue, tableElementRef, preserveNarrowColumns); // REF-11
    }
  }

  // prettier-ignore
  public static setTableWidth(etc: EditableTableComponent) {
    const {tableDimensionsInternal: {preserveNarrowColumns, width}, tableElementRef, } = etc;
    if (tableElementRef && width !== undefined) {
      tableElementRef.style.width = `${width}px`;
      StaticTableWidthUtils.togglePreserveNarrowColumns(true, tableElementRef, preserveNarrowColumns); // REF-11
    }
  }

  private static setNewColumnWidth(tableWidth: number, numberOfColumns: number) {
    const totalColumnsWidth = tableWidth - TableElement.AUXILIARY_TABLE_CONTENT_WIDTH;
    StaticTableWidthUtils.NEW_COLUMN_WIDTH = totalColumnsWidth / numberOfColumns;
  }

  private static resetAllColumnSizes(columnsDetails: ColumnsDetailsT, tableWidth: number) {
    const columnsToBeChanged = columnsDetails.filter((column) => column.settings?.width === undefined);
    StaticTableWidthUtils.setNewColumnWidth(tableWidth, columnsToBeChanged.length);
    columnsToBeChanged.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean) {
    const {tableElementRef, tableDimensionsInternal, columnsDetails} = etc;
    if (!tableElementRef) return;
    if (tableDimensionsInternal.width !== undefined) {
      StaticTableWidthUtils.resetAllColumnSizes(columnsDetails, tableDimensionsInternal.width);
      // isInsert check was initially not needed as this was not getting called when a column had been removed, however
      // it has been identified that the table offsetWidth does not immediately update when the column widths are very
      // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_WIDTH variable), hence it was added
    } else if (isInsert && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
      StaticTableWidthUtils.resetAllColumnSizes(columnsDetails, tableDimensionsInternal.maxWidth as number);
    }
  }
}
