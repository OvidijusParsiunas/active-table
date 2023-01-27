import {ColumnsDetailsT} from '../../../types/columnDetails';
import {RegexUtils} from '../../../utils/regex/regexUtils';

export class ColumnSizerGenericUtils {
  public static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(RegexUtils.extractIntegerStrs(id)[0]);
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }

  public static findNextResizableColumnHeader(columnsDetails: ColumnsDetailsT, sizerNumber: number) {
    const columnDetails = columnsDetails.slice(sizerNumber + 1).find((columnDetails) => {
      return !columnDetails.settings.widths?.staticWidth;
    });
    return columnDetails?.elements[0];
  }
}
