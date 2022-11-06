import {TableDimensions} from '../../../types/tableDimensions';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {TableContents} from '../../../types/tableContents';

export class MaximumColumns {
  // this is called a threshold because this kicks in only when the column widths are smaller or equal
  // to this, hence this is only a threshold at which we make a say that no more columns can be added
  // this was initially set to 28, however it has been identified that the padding in the first column
  // causes the table width to overspill by the padding difference when maxWidth is set as we do
  // not explicitly set the width styl on the table in non safari browsers, hence to prevent this
  // the value has been upped to 36
  private static readonly COLUMN_LENGTH_LIMIT_THRESHOLD = 36;

  // This is primarily concerned on not making the columns too small
  public static canAddMore(tableElement: HTMLElement, numberOfColumns: number, tableDimensions: TableDimensions) {
    // this feature only kicks in if the user has specified a width that the table must uphold
    const width = tableDimensions.width || tableDimensions.maxWidth;
    if (!width || numberOfColumns === 0) return true;
    // TO-DO if certain columns have a custom width
    // ((table width - (total of custom widths)) / number of default columns) > MaximumColumns.MIMIMUM_COLUMN_LENGTH;
    return tableElement.offsetWidth / numberOfColumns > MaximumColumns.COLUMN_LENGTH_LIMIT_THRESHOLD;
  }

  public static cleanupContentsThatDidNotGetAdded(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    if (contents[0].length - columnsDetails.length > 0) contents.forEach((row) => row.splice(columnsDetails.length));
  }
}
