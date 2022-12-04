import {DateCellCalendarIconElement} from './dateCellCalendarIconElement';
import {RegexUtils} from '../../../../utils/regex/regexUtils';
import {ColumnType} from '../../../../types/columnTypes';
import {DateCellElement} from './dateCellElement';
import {CellElement} from '../../cellElement';

export class DateCellInputElement {
  public static readonly ELEMENT_TYPE = 'date';
  public static readonly DATE_INPUT_CLASS = 'date-input';
  public static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';

  public static isInputElement(element?: Element): element is HTMLInputElement {
    return (element as HTMLInputElement)?.type === DateCellInputElement.ELEMENT_TYPE;
  }

  public static toggle(cellElement: HTMLElement | undefined, isDisplay: boolean) {
    if (!cellElement) return;
    const inputContainer = cellElement.children[1] as HTMLElement;
    inputContainer.style.display = isDisplay ? 'block' : 'none';
  }

  private static extractInputElementFromCell(cellElement: HTMLElement) {
    return (cellElement.children[1] as HTMLElement).children[0] as HTMLInputElement;
  }

  private static convertTextToInputValue(textDate: string, dateType: string, type: ColumnType): string {
    if (type.calendar) {
      const isValid = type.validation === undefined || type.validation(textDate);
      if (isValid) return type.calendar.dateTranslation?.toYMD(textDate).join('-') as string;
      return '-';
    }
    // below should not be required
    const integerArr = RegexUtils.extractIntegerStrs(textDate);
    if (integerArr?.length === 3) {
      const dateTypeToProperties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      return [
        integerArr[dateTypeToProperties.structureIndexes.year],
        integerArr[dateTypeToProperties.structureIndexes.month].padStart(2, '0'),
        integerArr[dateTypeToProperties.structureIndexes.day].padStart(2, '0'),
      ].join('-');
    }
    return '-';
  }

  // prettier-ignore
  public static updateInputBasedOnTextDiv(dateType: string, cellElement: HTMLElement, type: ColumnType) {
    const dateValue = DateCellInputElement.convertTextToInputValue(
      CellElement.getText(cellElement), dateType, type);
    DateCellInputElement.extractInputElementFromCell(cellElement).value = dateValue;
  }

  private static createInputElement(text: string, dateType: string, type: ColumnType): HTMLInputElement {
    const inputElement = document.createElement('input');
    inputElement.type = DateCellInputElement.ELEMENT_TYPE;
    inputElement.classList.add(DateCellInputElement.DATE_INPUT_CLASS);
    if (text !== undefined && dateType !== undefined) {
      inputElement.value = DateCellInputElement.convertTextToInputValue(text, dateType, type);
    }
    return inputElement;
  }

  private static createInputElementContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS);
    inputContainer.style.display = 'none';
    return inputContainer;
  }

  // prettier-ignore
  public static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, dateType: string,
      type: ColumnType) {
    const inputContainer = DateCellInputElement.createInputElementContainer();
    const inputElement = DateCellInputElement.createInputElement(CellElement.getText(textElement), dateType, type);
    inputContainer.appendChild(inputElement);
    const svgImage = DateCellCalendarIconElement.get();
    inputContainer.appendChild(svgImage);
    cellElement.appendChild(inputContainer);
  }
}
