import {FocusNextCellFromCategoryCell} from '../../../utils/focusedElements/focusNextCellFromCategoryCell';
import {ACTIVE_COLUMN_TYPE, DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE} from '../../../enums/columnType';
import {FirefoxCaretDisplayFix} from '../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {DateProperties, DateTypeToProperties} from '../../../types/dateTypeToProperties';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {FocusedElements} from '../../../types/focusedElements';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {MOUSE_EVENT} from '../../../consts/mouseEvents';
import {Browser} from '../../../utils/browser/browser';
import {DataCellEvents} from '../dataCellEvents';
import {CellElement} from '../cellElement';
import {CellEvents} from '../cellEvents';

// WORK - refactor functions
// some browsers may not support date input picker
export class DateCellElement {
  private static readonly DATE_INPUT_CLASS = 'date-input';
  private static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';
  private static readonly DATE_TYPE_TO_PROPERTIES: DateTypeToProperties = {};

  // TO-DO - the column type will also need to be added to column types
  public static addNewDateType(dateTypeName: string, dateProperties: DateProperties) {
    DateCellElement.DATE_TYPE_TO_PROPERTIES[dateTypeName] = dateProperties;
    DATE_COLUMN_TYPE[dateTypeName] = dateTypeName;
    TEXT_DIV_COLUMN_TYPE[dateTypeName] = dateTypeName;
  }

  // added through addNewDateType method instead of direct in order perform other important operations
  public static populateDefaultDateTypes() {
    DateCellElement.addNewDateType(ACTIVE_COLUMN_TYPE.Date_D_M_Y, {
      separator: '-',
      structureIndexes: {
        day: 0,
        month: 1,
        year: 2,
      },
    });
    DateCellElement.addNewDateType(ACTIVE_COLUMN_TYPE.Date_M_D_Y, {
      separator: '-',
      structureIndexes: {
        day: 1,
        month: 0,
        year: 2,
      },
    });
  }

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
  // prettier-ignore
  private static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, defaultCellValue: string,
      dateType: string) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellElement.DATE_INPUT_CONTAINER_CLASS);
    const inputElement = document.createElement('input');
    inputElement.type = 'date';
    inputElement.value = DateCellElement.convertToInput(
      textElement.textContent as string, defaultCellValue, dateType);
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

  public static updateInputBasedOnTextDiv(defaultCellValue: string, dateType: string, cellElement: HTMLElement) {
    const textElement = cellElement.children[0] as HTMLElement;
    const inputElementContainer = cellElement.children[1] as HTMLElement;
    const inputElement = inputElementContainer.children[0] as HTMLInputElement;
    const date = DateCellElement.convertToInput(textElement.textContent as string, defaultCellValue, dateType);
    inputElement.value = date;
  }

  private static textDivInput(defaultCellValue: string, dateType: string, event: Event) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DateCellElement.updateInputBasedOnTextDiv(defaultCellValue, dateType, cellElement);
  }

  // prettier-ignore
  private static createTextElement(etc: EditableTableComponent, rowIndex: number, columnIndex: number, text: string,
      dateType: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.float = 'left';
    textElement.onfocus = DateCellElement.focusText.bind(etc, rowIndex, columnIndex,
      etc.focusedElements, etc.defaultCellValue);
    textElement.oninput = DateCellElement.textDivInput.bind(this, etc.defaultCellValue, dateType);
    textElement.onblur = DateCellElement.blur.bind(etc, rowIndex, columnIndex);
    textElement.classList.add(CellElement.CELL_TEXT_DIV_CLASS);
    textElement.onkeydown = DateCellElement.keyDownOnText.bind(etc, rowIndex, columnIndex)
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  // TO-DO will need a way for user to define where is DD/MM etc when they define their custom cell type
  // try to use cell type title to create date - so if the user has / separator, use -
  private static convertToInput(chosenDate: string, defaultCellValue: string, dateType: string) {
    const integers = chosenDate?.match(/\d+/g) as RegExpMatchArray;
    if (integers?.length === 3) {
      const properties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const date = [
        integers[properties.structureIndexes.year],
        integers[properties.structureIndexes.month].padStart(2, '0'),
        integers[properties.structureIndexes.day].padStart(2, '0'),
      ];
      return date.join('-');
    }
    return defaultCellValue;
  }

  private static convertFromInput(chosenDate: string, defaultCellValue: string, dateType: string) {
    const integers = chosenDate?.match(/\d+/g) as RegExpMatchArray;
    if (integers?.length === 3) {
      const properties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const date = new Array<string>();
      date[properties.structureIndexes.day] = integers[2];
      date[properties.structureIndexes.month] = integers[1];
      date[properties.structureIndexes.year] = integers[0];
      return date.join(properties.separator);
    }
    return defaultCellValue;
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

  // prettier-ignore
  private static input(this: EditableTableComponent, rowIndex: number, columnIndex: number, dateType: string,
      event: Event) {
    const chosenDate = (event.target as HTMLInputElement).value;
    const appropariateFormatDate = DateCellElement.convertFromInput(chosenDate, this.defaultCellValue, dateType);
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
      rowIndex: number, columnIndex: number, cellElement: HTMLElement, dateType: string) {
    const textElement = DateCellElement.createTextElement(etc,
      rowIndex, columnIndex, cellElement.textContent as string, dateType);
    DateCellElement.setTextAsAnElement(cellElement, textElement);
    DateCellElement.addDateInputElement(cellElement, textElement, etc.defaultCellValue, dateType);
    cellElement.onmouseenter = DateCellElement.mouseEnter.bind(etc);
    cellElement.onmouseleave = DateCellElement.mouseLeave.bind(etc);
    cellElement.onmousedown = DateCellElement.mouseDownCell.bind(etc);
    const inputElement = cellElement.children[1] as HTMLInputElement;
    inputElement.onmousedown = DateCellElement.markDatePicker.bind(etc, rowIndex, columnIndex);
    inputElement.onchange = DateCellElement.change.bind(etc);
    inputElement.oninput = DateCellElement.input.bind(etc, rowIndex, columnIndex, dateType);
    inputElement.onkeyup = DateCellElement.keyUp.bind(etc);
  }

  // prettier-ignore
  public static convertColumnFromDataToCategory(etc: EditableTableComponent, columnIndex: number,
      dateType: string) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      DateCellElement.convertCellFromDataToCategory(etc, relativeIndex, columnIndex, cellElement, dateType);
    });
  }
}
