import {DateCellCalendarIconElement} from './dateCellCalendarIconElement';
import {ColumnType} from '../../../../types/columnType';
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

  private static convertTextToInputValue(textDate: string, type: ColumnType): string {
    if (type.calendar) {
      const isValid = type.validation === undefined || type.validation(textDate);
      if (isValid) {
        const ymd = type.calendar.toYMD(textDate);
        return [ymd[0], ymd[1].padStart(2, '0'), ymd[2].padStart(2, '0')].join('-');
      }
    }
    return '-';
  }

  public static updateInputBasedOnTextDiv(cellElement: HTMLElement, type: ColumnType) {
    const dateValue = DateCellInputElement.convertTextToInputValue(CellElement.getText(cellElement), type);
    DateCellInputElement.extractInputElementFromCell(cellElement).value = dateValue;
  }

  private static createInputElement(text: string, type: ColumnType): HTMLInputElement {
    const inputElement = document.createElement('input');
    inputElement.type = DateCellInputElement.ELEMENT_TYPE;
    inputElement.classList.add(DateCellInputElement.DATE_INPUT_CLASS);
    inputElement.value = DateCellInputElement.convertTextToInputValue(text, type);
    return inputElement;
  }

  private static createInputElementContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS);
    inputContainer.style.display = 'none';
    return inputContainer;
  }

  public static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, type: ColumnType) {
    const inputContainer = DateCellInputElement.createInputElementContainer();
    const inputElement = DateCellInputElement.createInputElement(CellElement.getText(textElement), type);
    inputContainer.appendChild(inputElement);
    const svgImage = DateCellCalendarIconElement.get();
    inputContainer.appendChild(svgImage);
    cellElement.appendChild(inputContainer);
  }
}
