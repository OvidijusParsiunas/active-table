import {Calendar, YMDFormat} from '../../../../types/calendarFunctionality';
import {RegexUtils} from '../../../../utils/regex/regexUtils';
import {CellTextElement} from '../text/cellTextElement';
import {CellText} from '../../../../types/tableData';

export class DateCellTextElement {
  public static convertInputValueToText(inputDate: string, defaultText: CellText, calendarFunc: Calendar) {
    const integerArr = RegexUtils.extractIntegerStrs(inputDate);
    // null when the user clicks on clear button on the calendar
    if (integerArr) {
      return calendarFunc.fromYMDFunc(integerArr as YMDFormat) as string;
    }
    return defaultText;
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.style.float = 'left';
    return textElement;
  }
}
