import {TableDimensionsInternal} from '../../../types/tableDimensionsInternal';
import {StaticTable} from '../../tableDimensions/staticTable/staticTable';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableElement} from '../../../elements/table/tableElement';
import {ColumnDetails} from '../../columnDetails/columnDetails';

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
  private static isStaticContentBreachingSetTableWidth(tableDimensions: TableDimensionsInternal) {
    const width = tableDimensions.width || tableDimensions.maxWidth;
    return width !== undefined && TableElement.STATIC_WIDTH_CONTENT_TOTAL > width;
  }

  // prettier-ignore
  private static ignoreMinimalColumnWidthCheck(tableDimensionsInternal: TableDimensionsInternal,
      tableElement: HTMLElement, numberOfColumns: number) {
    return tableDimensionsInternal.preserveNarrowColumns ||
      !StaticTable.isStaticTableWidth(tableElement, tableDimensionsInternal) ||
      numberOfColumns === 0;
  }

  // prettier-ignore
  public static canAddMore(etc: EditableTableComponent) {
    const {tableElementRef, columnsDetails, tableDimensionsInternal} = etc;
    const numberOfColumns = columnsDetails.length;
    if (tableDimensionsInternal.maxColumns === numberOfColumns
      || MaximumColumns.isStaticContentBreachingSetTableWidth(tableDimensionsInternal)) return false;
    const tableElement = tableElementRef as HTMLElement;
    if (MaximumColumns.ignoreMinimalColumnWidthCheck(tableDimensionsInternal, tableElement, numberOfColumns)) return true;
    const totalColumnsWidth = tableElement.offsetWidth - TableElement.STATIC_WIDTH_CONTENT_TOTAL;
    return totalColumnsWidth / (numberOfColumns + 1) >= ColumnDetails.MINIMAL_COLUMN_WIDTH;
  }
}
