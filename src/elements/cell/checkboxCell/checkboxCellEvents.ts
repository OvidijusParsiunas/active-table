import {EditableTableComponent} from '../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {CellWithTextEvents} from '../cellsWithTextDiv/cellWithTextEvents';
import {CellElement} from '../cellElement';

// the logic for cell and text divs is handled here
export class CheckboxCellEvents {
  private static changeValueCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    console.log(checkbox.checked);
  }

  private static keyDownCheckbox(event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const checkbox = event.target as HTMLInputElement;
      checkbox.click();
    }
  }
  // public static blurring(etc: EditableTableComponent, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
  //   const {element, categoryToItem} = etc.columnsDetails[columnIndex].categoryDropdown;
  //   Dropdown.hide(element);
  //   if (!categoryToItem[CellElement.getText(textElement)]) {
  //     CategoryCellElement.finaliseEditedText(etc, textElement, columnIndex);
  //   }
  //   DataCellEvents.blur(etc, rowIndex, columnIndex, textElement);
  // }

  // private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
  //   if (!this.focusedElements.categoryDropdown) {
  //     CheckboxCellEvents.blurring(this, rowIndex, columnIndex, event.target as HTMLElement);
  //   }
  // }

  private static blurIfDropdownFocused(etc: EditableTableComponent) {
    // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
    // or delete category buttons are clicked, hence once that happens and the user clicks on another category
    // cell, the dropdown is closed programmatically as follows
    if (etc.focusedElements.categoryDropdown) {
      CellWithTextEvents.programmaticBlur(etc);
    }
  }

  private static mouseDownCell(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains(CellElement.CELL_CLASS)) {
      const checkboxElement = target.children[0] as HTMLInputElement;
      checkboxElement.click();
    }
  }

  // please note that checkbox focus in not supported in safari
  private static focusCell(event: FocusEvent) {
    // this is triggered in firefox
    const target = event.target as HTMLElement;
    const checkboxElement = target.children[0] as HTMLInputElement;
    checkboxElement.focus();
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = CheckboxCellEvents.focusCell;
    // these are used in date cells and overwritten when converted from
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.onmousedown = CheckboxCellEvents.mouseDownCell;
    const checkboxElement = cellElement.children[0] as HTMLInputElement;
    checkboxElement.onkeydown = CheckboxCellEvents.keyDownCheckbox;
    checkboxElement.onchange = CheckboxCellEvents.changeValueCheckbox;
  }
}
