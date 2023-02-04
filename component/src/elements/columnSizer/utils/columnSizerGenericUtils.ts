import {ColumnsDetailsT} from '../../../types/columnDetails';
import {RegexUtils} from '../../../utils/regex/regexUtils';
import {Browser} from '../../../utils/browser/browser';

export class ColumnSizerGenericUtils {
  // the current solution for using first row position as 'relative' with divider having 100% height only works for
  // these browsers
  public static canHeightBeInherited() {
    return Browser.IS_CHROMIUM || Browser.IS_FIREFOX;
  }

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
