import {RegexUtils} from '../../../../utils/regex/regexUtils';
import {CellTextElement} from '../text/cellTextElement';
import {DateCellElement} from './dateCellElement';

export class DateCellTextElement {
  public static convertInputValueToText(inputDate: string, defaultCellValue: string, dateType: string) {
    const integerArr = RegexUtils.extractIntegerValues(inputDate);
    if (integerArr?.length === 3) {
      const dateTypeToProperties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const dateArr = new Array<string>();
      // changing the YYYY-MM-DD format to target type
      dateArr[dateTypeToProperties.structureIndexes.day] = integerArr[2];
      dateArr[dateTypeToProperties.structureIndexes.month] = integerArr[1];
      dateArr[dateTypeToProperties.structureIndexes.year] = integerArr[0];
      return dateArr.join(dateTypeToProperties.separator);
    }
    return defaultCellValue;
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement);
    textElement.style.float = 'left';
    return textElement;
  }
}
