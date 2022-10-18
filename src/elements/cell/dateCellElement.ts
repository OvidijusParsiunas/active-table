import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {FocusedCellUtils} from '../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {Browser} from '../../utils/browser/browser';
import {CellElement} from './cellElement';
import {CellEvents} from './cellEvents';

// WORK - refactor functions
// some browsers may not support date input picker
export class DateCellElement {
  private static readonly DATE_INPUT_CLASS = 'date-input';
  private static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';

  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const cellElement = (event.target as HTMLElement).parentElement as HTMLElement;
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
  }

  public static getCellElement(element: HTMLElement) {
    if (
      element.classList.contains(CellElement.CATEGORY_CELL_TEXT_CLASS) ||
      element.classList.contains(DateCellElement.DATE_INPUT_CONTAINER_CLASS)
    ) {
      return element.parentElement as HTMLElement;
    } else if (element.classList.contains(DateCellElement.DATE_INPUT_CLASS)) {
      return (element.parentElement as HTMLElement).parentElement as HTMLElement;
    }
    return element;
  }

  // WORK - need calendar icon
  private static addDateInputElement(cellElement: HTMLElement) {
    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'relative';
    inputContainer.style.float = 'right';
    // WORK - click container open calendar
    inputContainer.style.cursor = 'pointer';
    inputContainer.classList.add(DateCellElement.DATE_INPUT_CONTAINER_CLASS);
    const inputElement = document.createElement('input');
    inputElement.type = 'date';
    inputElement.style.width = '14px';
    inputElement.style.height = '20px';
    inputElement.style.border = 'unset';
    inputElement.style.padding = '0px';
    inputElement.style.right = '-7px';
    inputElement.style.position = 'absolute';
    inputElement.classList.add(DateCellElement.DATE_INPUT_CLASS);
    inputContainer.style.display = 'none';
    inputContainer.appendChild(inputElement);
    cellElement.appendChild(inputContainer);
  }

  private static setTextAsAnElement(cellElement: HTMLElement, textElement: HTMLElement) {
    cellElement.textContent = '';
    cellElement.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeTabIndex(cellElement);
    cellElement.appendChild(textElement);
  }

  private static createTextElement(text: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.float = 'left';
    textElement.classList.add(CellElement.CATEGORY_CELL_TEXT_CLASS);
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  // try to use cell type title to create date - so if the user has / separator, use -
  private static convertToAppropriateFormat(chosenDate: string) {
    const integers = chosenDate.match(/\d+/g) as RegExpMatchArray;
    return `${integers[2]}-${integers[1]}-${integers[0]}`;
  }

  // click on a button inside the datepicker
  private static change(this: EditableTableComponent, event: Event) {
    console.log('change');
    DateCellElement.hideDatePicker(event.target as HTMLInputElement);
    delete this.overlayElementsState.datePickerInput;
  }

  private static input(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const chosenDate = (event.target as HTMLInputElement).value;
    const appropariateFormatDate = chosenDate ? DateCellElement.convertToAppropriateFormat(chosenDate) : '';
    const element = this.columnsDetails[columnIndex].elements[rowIndex];
    CellEvents.updateCell(this, appropariateFormatDate, rowIndex, columnIndex, {element});
  }

  public static hideDatePicker(datePickerInput: HTMLElement) {
    (datePickerInput.parentElement as HTMLElement).style.display = 'none';
  }

  private static markDatePicker(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const inputElement = event.target as HTMLInputElement;
    const cellElement = DateCellElement.getCellElement(inputElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    setTimeout(() => (this.overlayElementsState.datePickerInput = inputElement));
  }

  private static mouseEnter(event: MouseEvent) {
    console.log('entering');
    const cell = event.target as HTMLElement;
    (cell.children[1] as HTMLElement).style.display = 'block';
  }

  private static mouseLeave(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    if (this.overlayElementsState.datePickerInput === cell?.children[1]?.children[0]) return;
    (cell.children[1] as HTMLElement).style.display = 'none';
  }

  // prettier-ignore
  public static convertCellFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const textElement = DateCellElement.createTextElement(cellElement.textContent as string);
    textElement.onfocus = DateCellElement.focusText.bind(etc, rowIndex, columnIndex);
    DateCellElement.setTextAsAnElement(cellElement, textElement);
    DateCellElement.addDateInputElement(cellElement);
    cellElement.onmouseenter = DateCellElement.mouseEnter;
    cellElement.onmouseleave = DateCellElement.mouseLeave.bind(etc);
    const inputElement = cellElement.children[1] as HTMLInputElement;
    inputElement.oninput = DateCellElement.input.bind(etc, rowIndex, columnIndex);
    inputElement.onchange = DateCellElement.change.bind(etc);
    inputElement.onmousedown = DateCellElement.markDatePicker.bind(etc, rowIndex, columnIndex);
  }

  public static convertColumnFromDataToCategory(etc: EditableTableComponent, columnIndex: number) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      DateCellElement.convertCellFromDataToCategory(etc, relativeIndex, columnIndex, cellElement);
    });
  }
}
