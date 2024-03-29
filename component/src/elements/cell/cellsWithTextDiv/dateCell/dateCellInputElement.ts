import {DateCellCalendarIconElement} from './dateCellCalendarIconElement';
import {ColumnTypeInternal} from '../../../../types/columnTypeInternal';
import {CellElement} from '../../cellElement';

// the user does not use the actual input element and the events are triggered via the date picker (calendar)
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

  private static convertTextToInputValue(textDate: string, type: ColumnTypeInternal): string {
    if (type.calendar) {
      const isValid = type.textValidation.func === undefined || type.textValidation.func(textDate);
      if (isValid) {
        const ymd = type.calendar.toYMDFunc(textDate);
        return [ymd[0], ymd[1].padStart(2, '0'), ymd[2].padStart(2, '0')].join('-');
      }
    }
    return '-';
  }

  public static updateInputBasedOnTextDiv(cellElement: HTMLElement, type: ColumnTypeInternal) {
    const dateValue = DateCellInputElement.convertTextToInputValue(CellElement.getText(cellElement), type);
    DateCellInputElement.extractInputElementFromCell(cellElement).value = dateValue;
  }

  private static createInputElement(text: string, type: ColumnTypeInternal): HTMLInputElement {
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

  public static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, type: ColumnTypeInternal) {
    const inputContainer = DateCellInputElement.createInputElementContainer();
    const inputElement = DateCellInputElement.createInputElement(CellElement.getText(textElement), type);
    inputContainer.appendChild(inputElement);
    const svgImage = DateCellCalendarIconElement.get();
    inputContainer.appendChild(svgImage);
    cellElement.appendChild(inputContainer);
  }
}
