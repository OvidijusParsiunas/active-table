import {ColumnSettingsWidthUtil} from '../../columnSettings/columnSettingsWidthUtil';
import {ColumnDetailsT, ColumnsDetailsT} from '../../../types/columnDetails';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../types/columnsSettings';
import {TableElement} from '../../../elements/table/tableElement';
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

  private static resetMinWidthColumns(minWidthColumns: ColumnDetailsT[], tableElement: HTMLElement) {
    minWidthColumns.forEach((columnDetails) => {
      const {settings, elements} = columnDetails;
      const {width} = ColumnSettingsWidthUtil.getSettingsWidthNumber(tableElement, settings as ColumnSettingsInternal);
      const headerCell = elements[0];
      if (headerCell.offsetWidth !== width) {
        headerCell.style.width = `${width}px`;
      }
    });
  }

  private static resetDynamicWidthColumns(dynamicWidthColumns: ColumnDetailsT[]) {
    dynamicWidthColumns.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  private static getChangeableColumns(columnsDetails: ColumnsDetailsT): {
    dynamicWidthColumns: ColumnDetailsT[];
    minWidthColumns: ColumnDetailsT[];
  } {
    const dynamicWidthColumns: ColumnDetailsT[] = [];
    const minWidthColumns: ColumnDetailsT[] = [];
    for (let i = 0; i < columnsDetails.length; i += 1) {
      const columnDetails = columnsDetails[i];
      if (columnDetails.settings?.width === undefined) {
        if (columnDetails.settings?.minWidth !== undefined) {
          minWidthColumns.push(columnDetails);
        } else {
          dynamicWidthColumns.push(columnDetails);
        }
      }
    }
    return {dynamicWidthColumns, minWidthColumns};
  }

  private static resetColumnSizes(tableElementRef: HTMLElement, columnsDetails: ColumnsDetailsT, tableWidth: number) {
    const {dynamicWidthColumns, minWidthColumns} = StaticTableWidthUtils.getChangeableColumns(columnsDetails);
    StaticTableWidthUtils.setNewColumnWidth(tableWidth, dynamicWidthColumns.length);
    StaticTableWidthUtils.resetDynamicWidthColumns(dynamicWidthColumns);
    StaticTableWidthUtils.resetMinWidthColumns(minWidthColumns, tableElementRef);
  }

  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean) {
    const {tableElementRef, tableDimensionsInternal, columnsDetails} = etc;
    if (!tableElementRef) return;
    const {width, maxWidth} = tableDimensionsInternal;
    if (width !== undefined) {
      StaticTableWidthUtils.resetColumnSizes(tableElementRef, columnsDetails, width);
      // isInsert check was initially not needed as this was not getting called when a column had been removed, however
      // it has been identified that the table offsetWidth does not immediately update when the column widths are very
      // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_WIDTH variable), hence it was added
    } else if (isInsert && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
      StaticTableWidthUtils.resetColumnSizes(tableElementRef, columnsDetails, maxWidth as number);
    }
  }
}
