import {SelectedColumnSizer, SizerMoveLimits} from '../../types/columnSizer';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {RegexUtils} from '../../utils/regex/regexUtils';

// these methods are used by column sizer events and static table width column sizer events
export class ColumnSizerEventsUtils {
  private static getWidthDelta(mouseMoveOffset: number, moveLimits: SizerMoveLimits) {
    if (mouseMoveOffset < moveLimits.left) {
      return moveLimits.left;
    } else if (mouseMoveOffset > moveLimits.right) {
      return moveLimits.right;
    }
    return mouseMoveOffset;
  }

  public static changeElementWidth(selectedColumnSizer: SelectedColumnSizer, columnElement: HTMLElement) {
    const {moveLimits, mouseMoveOffset, initialOffset} = selectedColumnSizer;
    const newDelta = ColumnSizerEventsUtils.getWidthDelta(mouseMoveOffset, moveLimits);
    const newWidth = `${Math.max(0, columnElement.offsetWidth + newDelta - initialOffset)}px`;
    columnElement.style.width = newWidth;
  }

  public static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(RegexUtils.extractIntegerValues(id)[0]);
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }
}
