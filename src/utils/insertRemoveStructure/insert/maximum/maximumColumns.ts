import {StaticTable} from '../../../tableDimensions/staticTable/staticTable';
import {EditableTableComponent} from '../../../../editable-table-component';
import {TableElement} from '../../../../elements/table/tableElement';
import {ColumnDetails} from '../../../columnDetails/columnDetails';
import {TableDimensions} from '../../../../types/tableDimensions';

export class MaximumColumns {
  // the motivation behind minimal column length came from the fact that when we have set a table width and all the columns
  // have become too narrow (24px), upon adding any subsequent columns - the set table width would be ignored and the table
  // would expand - as an infinite amount of columns can't just be added to a table width a preset width

  // the actual minimal column length is usually not reached as dividing table width by its columns rarely produces it
  // originally this was set to 28, however the extra padding on the left column causes the table width to overflow
  // the set limit hence it is set to 34 instead

  // REF-24
  // this is a small effort to toggle off the add new column button when columns with set widths breach the table
  // please note that this will not allow any more columns to be added even if preserveNarrowColumns is true
  private static isStaticContentBreachingSetTableWidth(tableDimensions: TableDimensions) {
    const width = tableDimensions.width || tableDimensions.maxWidth;
    return width !== undefined && TableElement.STATIC_WIDTH_CONTENT_TOTAL > width;
  }

  // prettier-ignore
  private static ignoreMinimalColumnWidthCheck(tableDimensions: TableDimensions,
      tableElement: HTMLElement, numberOfColumns: number) {
    return tableDimensions.preserveNarrowColumns ||
      !StaticTable.isStaticTableWidth(tableElement, tableDimensions) ||
      numberOfColumns === 0;
  }

  // prettier-ignore
  public static canAddMore(etc: EditableTableComponent) {
    const {tableElementRef, columnsDetails, tableDimensions, maxColumns} = etc;
    const numberOfColumns = columnsDetails.length;
    if ((maxColumns !== undefined && maxColumns > 0 && maxColumns === numberOfColumns)
      || MaximumColumns.isStaticContentBreachingSetTableWidth(tableDimensions)) return false;
    const tableElement = tableElementRef as HTMLElement;
    if (MaximumColumns.ignoreMinimalColumnWidthCheck(tableDimensions, tableElement, numberOfColumns)) return true;
    const totalColumnsWidth = tableElement.offsetWidth - TableElement.STATIC_WIDTH_CONTENT_TOTAL;
    return totalColumnsWidth / (numberOfColumns + 1) >= ColumnDetails.MINIMAL_COLUMN_WIDTH;
  }
}
