import {FocusNextCellFromCategoryCell} from '../../utils/focusedElements/focusNextCellFromCategoryCell';
import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {FocusedCellUtils} from '../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../editable-table-component';
import {FocusedElements} from '../../types/focusedElements';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {MOUSE_EVENT} from '../../consts/mouseEvents';
import {Browser} from '../../utils/browser/browser';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from './cellElement';
import {CellEvents} from './cellEvents';

// WORK - refactor functions
// WORK - insert text on paste
// some browsers may not support date input picker
export class DateCellElement {
  private static readonly DATE_INPUT_CLASS = 'date-input';
  private static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';

  public static isDateInputElement(element?: Element): element is HTMLInputElement {
    return (element as HTMLInputElement)?.type === 'date';
  }

  // prettier-ignore
  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number,
      focusedElements: FocusedElements, defaultCellValue: string, event: Event) {
    const textElement = event.target as HTMLElement;
    const cellElement = (event.target as HTMLElement).parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    FocusedCellUtils.set(focusedElements.cell, cellElement, rowIndex, columnIndex, defaultCellValue);
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  public static getCellElement(element: HTMLElement) {
    if (
      element.classList.contains(CellElement.CELL_TEXT_DIV_CLASS) ||
      element.classList.contains(DateCellElement.DATE_INPUT_CONTAINER_CLASS)
    ) {
      return element.parentElement as HTMLElement;
    } else if (element.classList.contains(DateCellElement.DATE_INPUT_CLASS)) {
      return (element.parentElement as HTMLElement).parentElement as HTMLElement;
    }
    return element;
  }

  // WORK - need calendar icon
  private static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, defaultCellValue: string) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellElement.DATE_INPUT_CONTAINER_CLASS);
    const inputElement = document.createElement('input');
    inputElement.type = 'date';
    inputElement.value = DateCellElement.convertYYYMMDDToDDMMYYYY(textElement.textContent as string, defaultCellValue);
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

  private static keyDownOnText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      DataCellEvents.keyDownCell.bind(this)(event);
      FocusNextCellFromCategoryCell.focusOrBlurRowNextCell(this, columnIndex, rowIndex);
    }
  }

  private static textDivInput(defaultCellValue: string, event: Event) {
    // WORK - handle on paste event
    const textElement = event.target as HTMLElement;
    const cellElement = (textElement as HTMLElement).parentElement as HTMLElement;
    const inputElementContainer = cellElement.children[1] as HTMLElement;
    const inputElement = inputElementContainer.children[0] as HTMLInputElement;
    inputElement.value = DateCellElement.convertYYYMMDDToDDMMYYYY(textElement.textContent as string, defaultCellValue);
  }

  // prettier-ignore
  private static createTextElement(etc: EditableTableComponent, rowIndex: number, columnIndex: number, text: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.float = 'left';
    textElement.onfocus = DateCellElement.focusText.bind(etc, rowIndex, columnIndex,
      etc.focusedElements, etc.defaultCellValue);
    textElement.oninput = DateCellElement.textDivInput.bind(this, etc.defaultCellValue);
    textElement.onblur = DateCellElement.blur.bind(etc, rowIndex, columnIndex);
    textElement.classList.add(CellElement.CELL_TEXT_DIV_CLASS);
    textElement.onkeydown = DateCellElement.keyDownOnText.bind(etc, rowIndex, columnIndex)
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  private static convertYYYMMDDToDDMMYYYY(chosenDate: string, defaultCellValue: string) {
    const integers = chosenDate.match(/\d+/g) as RegExpMatchArray;
    if (integers?.length === 3) {
      return `${integers[2]}-${integers[1]}-${integers[0]}`;
    }
    return defaultCellValue;
  }

  // try to use cell type title to create date - so if the user has / separator, use -
  private static convertDDMMYYYYToYYYMMDD(chosenDate: string) {
    const integers = chosenDate.match(/\d+/g) as RegExpMatchArray;
    return `${integers[2]}-${integers[1]}-${integers[0]}`;
  }

  // this is triggered when the user clicks on picker buttons
  private static change(this: EditableTableComponent, event: Event) {
    if (
      // this.userKeyEventsState[MOUSE_EVENT.DOWN] is used to prevent a bug where if the user opens the date picker,
      // uses arrow keys to navigate and clicks back on the cell - this event is fired
      !this.userKeyEventsState[MOUSE_EVENT.DOWN] &&
      // do not hide when currently hovered
      this.hoveredElements.dateCell !== DateCellElement.getCellElement(event.target as HTMLElement)
    ) {
      DateCellElement.hideDatePicker(event.target as HTMLInputElement);
    }
    delete this.overlayElementsState.datePickerInput;
  }

  private static input(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const chosenDate = (event.target as HTMLInputElement).value;
    const appropariateFormatDate = chosenDate ? DateCellElement.convertDDMMYYYYToYYYMMDD(chosenDate) : '';
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

  private static mouseEnter(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    this.hoveredElements.dateCell = cell;
    (cell.children[1] as HTMLElement).style.display = 'block';
  }

  private static mouseLeave(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    delete this.hoveredElements.dateCell;
    if (this.overlayElementsState.datePickerInput === cell?.children[1]?.children[0]) return;
    (cell.children[1] as HTMLElement).style.display = 'none';
  }

  // outstanding bug is when the user opens picker and moves with arrow keys, then clicks enter
  // the picker fires a clear event and does not actuall close itself and instead goes to the
  // initially opened up date. The key up event for the escape button is also not fired.
  private static keyUp(this: EditableTableComponent, event: KeyboardEvent) {
    if (
      event.key === KEYBOARD_KEY.ESCAPE &&
      this.overlayElementsState.datePickerInput &&
      // do not hide when currently hovered
      this.hoveredElements.dateCell !== DateCellElement.getCellElement(event.target as HTMLElement)
    ) {
      DateCellElement.hideDatePicker(this.overlayElementsState.datePickerInput);
      delete this.overlayElementsState.datePickerInput;
    }
  }

  private static blur(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  private static mouseDownCell(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // this is also triggered by text, but we only want when cell to focus
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      const cellElement = event.target as HTMLElement;
      const textElement = cellElement.children[0] as HTMLElement;
      // needed to set cursor at the end
      event.preventDefault();
      // Firefox does not fire the focus event for CaretPosition.setToEndOfText
      if (Browser.IS_FIREFOX) textElement.focus();
      // in non firefox browsers this also focuses
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  // prettier-ignore
  public static convertCellFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const textElement = DateCellElement.createTextElement(etc, rowIndex, columnIndex, cellElement.textContent as string);
    DateCellElement.setTextAsAnElement(cellElement, textElement);
    DateCellElement.addDateInputElement(cellElement, textElement, etc.defaultCellValue);
    cellElement.onmouseenter = DateCellElement.mouseEnter.bind(etc);
    cellElement.onmouseleave = DateCellElement.mouseLeave.bind(etc);
    cellElement.onmousedown = DateCellElement.mouseDownCell.bind(etc);
    const inputElement = cellElement.children[1] as HTMLInputElement;
    inputElement.onmousedown = DateCellElement.markDatePicker.bind(etc, rowIndex, columnIndex);
    inputElement.onchange = DateCellElement.change.bind(etc);
    inputElement.oninput = DateCellElement.input.bind(etc, rowIndex, columnIndex);
    inputElement.onkeyup = DateCellElement.keyUp.bind(etc);
  }

  public static convertColumnFromDataToCategory(etc: EditableTableComponent, columnIndex: number) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      DateCellElement.convertCellFromDataToCategory(etc, relativeIndex, columnIndex, cellElement);
    });
  }
}
