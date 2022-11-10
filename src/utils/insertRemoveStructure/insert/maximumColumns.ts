import {TableDimensionsInternal} from '../../../types/tableDimensionsInternal';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableElement} from '../../../elements/table/tableElement';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {TableContents} from '../../../types/tableContents';
import {StaticTable} from '../../staticTable/staticTable';

// TO-DO - the add columns column should disappear when more columns cannot be added and appear when they can
export class MaximumColumns {
  // the motivation behind minimal column length came from the fact that when we have set a table width and all the columns
  // have become too narrow (24px), upon adding any subsequent columns - the set table width would be ignored and the table
  // would expand - as an infinite amount of columns can't just be added to a table width a preset width

  // the actual minimal column length is usually not reached as dividing table width by its columns rarely produces it
  // originally this was set to 28, however the extra padding on the left column causes the table width to overflow
  // the set limit hence it is set to 34 instead
  private static readonly MINIMAL_COLUMN_WIDTH = 34;

  // prettier-ignore
  private static ignoreMinimalColumnWidthCheck(tableDimensionsInternal: TableDimensionsInternal,
      tableElement: HTMLElement, numberOfColumns: number) {
    return tableDimensionsInternal.preserveNarrowColumns ||
      !StaticTable.isStaticTableWidth(tableElement, tableDimensionsInternal) ||
      numberOfColumns === 0;
  }

  // This is primarily concerned on not making the columns too narrow when the table is at its width limit
  public static canAddMore(etc: EditableTableComponent) {
    const {tableElementRef, columnsDetails, tableDimensionsInternal} = etc;
    const tableElement = tableElementRef as HTMLElement;
    const numberOfColumns = columnsDetails.length;
    if (MaximumColumns.ignoreMinimalColumnWidthCheck(tableDimensionsInternal, tableElement, numberOfColumns)) return true;
    // TO-DO if certain columns have a custom width
    const totalColumnsWidth = tableElement.offsetWidth - TableElement.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH;
    return totalColumnsWidth / (numberOfColumns + 1) >= MaximumColumns.MINIMAL_COLUMN_WIDTH;
  }

  public static cleanupContentsThatDidNotGetAdded(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    if (contents[0].length - columnsDetails.length > 0) contents.forEach((row) => row.splice(columnsDetails.length));
  }
}
