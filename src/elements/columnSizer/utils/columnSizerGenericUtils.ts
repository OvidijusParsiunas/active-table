import {ColumnsDetailsT} from '../../../types/columnDetails';
import {RegexUtils} from '../../../utils/regex/regexUtils';

export class ColumnSizerGenericUtils {
  public static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(RegexUtils.extractIntegerValues(id)[0]);
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }
}
