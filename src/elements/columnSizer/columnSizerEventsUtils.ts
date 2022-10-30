import {ColumnsDetailsT} from '../../types/columnDetails';
import {RegexUtils} from '../../utils/regex/regexUtils';

// these methods are used by column sizer events and static table width column sizer events
export class ColumnSizerEventsUtils {
  public static changeElementWidth(columnElement: HTMLElement, widthDelta: number) {
    const newWidth = `${Math.max(0, columnElement.offsetWidth + widthDelta)}px`;
    columnElement.style.width = newWidth;
  }

  public static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(RegexUtils.extractIntegerValues(id)[0]);
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }
}
