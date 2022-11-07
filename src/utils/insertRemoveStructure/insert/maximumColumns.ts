import {TableDimensionsInternal} from '../../../types/tableDimensions';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {TableContents} from '../../../types/tableContents';
import {StaticTable} from '../../staticTable/staticTable';

// TO-DO - the add columns column should disappear when more columns cannot be added and appear when they can
export class MaximumColumns {
  // the actual minimal column length is usually not reached as dividing table width by its columns rarely produces it
  private static readonly MINIMAL_COLUMN_LENGTH = 34;

  // This is primarily concerned on not making the columns too narrow when the table is at its width limit.
  public static canAddMore(tableElement: HTMLElement, numberOfColumns: number, tableDimensions: TableDimensionsInternal) {
    // this feature only kicks in if the user has specified a width that the table must uphold
    if (!StaticTable.isStaticTableWidth(tableElement, tableDimensions) || numberOfColumns === 0) return true;
    // TO-DO if certain columns have a custom width
    // ((table width - (total of custom widths)) / (number of default columns + 1))
    //  >= MaximumColumns.MINIMAL_COLUMN_LENGTH;
    return tableElement.offsetWidth / (numberOfColumns + 1) >= MaximumColumns.MINIMAL_COLUMN_LENGTH;
  }

  public static cleanupContentsThatDidNotGetAdded(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    if (contents[0].length - columnsDetails.length > 0) contents.forEach((row) => row.splice(columnsDetails.length));
  }
}
