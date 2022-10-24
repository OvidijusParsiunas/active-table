import {RegexUtils} from '../../../../utils/regex/regexUtils';
import {DateCellElement} from './dateCellElement';

export class DateCellInputElement {
  public static readonly ELEMENT_TYPE = 'date';
  public static readonly DATE_INPUT_CLASS = 'date-input';
  public static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';

  public static updateInputBasedOnTextDiv(dateType: string, cellElement: HTMLElement) {
    const dateValue = DateCellInputElement.convertTextToInputValue(cellElement.textContent as string, dateType);
    DateCellInputElement.extractInputElementFromCell(cellElement).value = dateValue;
  }

  public static isInputElement(element?: Element): element is HTMLInputElement {
    return (element as HTMLInputElement)?.type === DateCellInputElement.ELEMENT_TYPE;
  }

  public static extractInputElementFromCell(cellElement: HTMLElement) {
    return (cellElement.children[1] as HTMLElement).children[0] as HTMLInputElement;
  }

  public static toggle(inputElement: HTMLElement, isDisplay: boolean) {
    (inputElement.parentElement as HTMLElement).style.display = isDisplay ? 'block' : 'none';
  }

  private static convertTextToInputValue(textDate: string, dateType: string): string {
    const integerArr = RegexUtils.extractIntegerValues(textDate);
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

  public static createInputElement(text: string, dateType: string): HTMLInputElement;
  public static createInputElement(): HTMLInputElement;
  public static createInputElement(text?: string, dateType?: string): HTMLInputElement {
    const inputElement = document.createElement('input');
    inputElement.type = DateCellInputElement.ELEMENT_TYPE;
    inputElement.classList.add(DateCellInputElement.DATE_INPUT_CLASS);
    if (text !== undefined && dateType !== undefined) {
      inputElement.value = DateCellInputElement.convertTextToInputValue(text, dateType);
    }
    return inputElement;
  }

  private static createInputElementContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS);
    inputContainer.style.display = 'none';
    return inputContainer;
  }

  // WORK - need calendar icon
  public static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, dateType: string) {
    const inputContainer = DateCellInputElement.createInputElementContainer();
    const inputElement = DateCellInputElement.createInputElement(textElement.textContent as string, dateType);
    inputContainer.appendChild(inputElement);
    cellElement.appendChild(inputContainer);
  }
}
