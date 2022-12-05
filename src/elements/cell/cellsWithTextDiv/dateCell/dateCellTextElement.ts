import {CalendarProperties, YMDFormat} from '../../../../types/calendarProperties';
import {RegexUtils} from '../../../../utils/regex/regexUtils';
import {CellText} from '../../../../types/tableContents';
import {CellTextElement} from '../text/cellTextElement';
import {DateCellElement} from './dateCellElement';

export class DateCellTextElement {
  // prettier-ignore
  public static convertInputValueToText(inputDate: string, defaultText: CellText, dateType: string,
      dateProperties: CalendarProperties) {
    if (dateProperties) {
      const integerArr = RegexUtils.extractIntegerStrs(inputDate);
      return dateProperties.dateConversion?.fromYMD(integerArr as YMDFormat) as string
    }
    // below should not be required
    const integerArr = RegexUtils.extractIntegerStrs(inputDate);
    if (integerArr?.length === 3) {
      const dateTypeToProperties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const dateArr = new Array<string>();
      // changing the YYYY-MM-DD format to target type
      dateArr[dateTypeToProperties.structureIndexes.day] = integerArr[2];
      dateArr[dateTypeToProperties.structureIndexes.month] = integerArr[1];
      dateArr[dateTypeToProperties.structureIndexes.year] = integerArr[0];
      return dateArr.join(dateTypeToProperties.separator);
    }
    return defaultText;
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement);
    textElement.style.float = 'left';
    return textElement;
  }
}
