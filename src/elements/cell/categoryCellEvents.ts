import {CategoryDropdownItem} from '../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {FocusedCellUtils} from '../../utils/cellFocus/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CaretPosition} from '../../utils/cellFocus/caretPosition';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {Browser} from '../../utils/browser/browser';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from './cellElement';

export class CategoryCellEvents extends DataCellEvents {
  private static keyDownText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {overlayElementsState, columnsDetails} = this;
    const categoryDropdown = overlayElementsState.categoryDropdown as HTMLElement;
    const columnDetails = columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      CategoryDropdown.hideAndSetText(this, categoryDropdown);
      (event.target as HTMLElement).blur();
    } else if (event.key === KEYBOARD_KEY.TAB) {
      CategoryDropdown.hideAndSetText(this, categoryDropdown);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      CategoryDropdown.hideAndSetText(this, categoryDropdown);
      CategoryDropdownItem.focusOrBlurNextColumnCell(columnDetails.elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'nextSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'previousSibling');
    }
  }

  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    CategoryDropdown.display(this, rowIndex, columnIndex, cellElement);
    // this is called here as well as mousedown, the reason for that is because of the following event sequence
    // mouse click cell text -> mouse click table -> blur focused cell -> focus text
    // mouse click table event is relevant as it analyzes whether the dropdown should be closed
    FocusedCellUtils.set(this.focusedCell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    if (this.cellKeyPressState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownOnCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  private static mouseDownOnText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    // this is called here because FocusedCellUtils.set needs to be called before mousedown is called in tableEvents
    FocusedCellUtils.set(etc.focusedCell, cellElement, rowIndex, columnIndex, etc.defaultCellValue);
  }

  private static mouseDownOnCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    const textElement = cellElement.children[0] as HTMLElement;
    // this is called here because FocusedCellUtils.set needs to be called before mousedown is called in tableEvents
    FocusedCellUtils.set(etc.focusedCell, cellElement, rowIndex, columnIndex, etc.defaultCellValue);
    // needed to set cursor at the end
    event.preventDefault();
    // Firefox does not fire the focus event for CaretPosition.setToEndOfText
    if (Browser.IS_FIREFOX) textElement.focus();
    // in non firefox browsers this also focuses
    CaretPosition.setToEndOfText(etc, textElement);
  }

  // prettier-ignore
  private static mouseDownCategoryCell(this: EditableTableComponent,
      rowIndex: number, columnIndex: number, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      CategoryCellEvents.mouseDownOnCell(this, rowIndex, columnIndex, event);
    } else {
      CategoryCellEvents.mouseDownOnText(this, rowIndex, columnIndex, event);
    }
  }

  // inherently using data cell events and overwriting the following
  public static addEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.onmousedown = CategoryCellEvents.mouseDownCategoryCell.bind(etc, rowIndex, columnIndex);
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    const textElement = cellElement.children[0] as HTMLElement;
    textElement.onblur = DataCellEvents.blur.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = CategoryCellEvents.focusText.bind(etc, rowIndex, columnIndex);
    textElement.onkeydown = CategoryCellEvents.keyDownText.bind(etc, rowIndex, columnIndex);
  }
}
