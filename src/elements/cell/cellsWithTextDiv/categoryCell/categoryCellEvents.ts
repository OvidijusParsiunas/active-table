import {FocusNextCellFromCategoryCell} from '../../../../utils/focusedElements/focusNextCellFromCategoryCell';
import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../../../dropdown/categoryDropdown/categoryDropdown';
import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../dataCell/dataCellEvents';
import {CellsWithTextEvents} from '../cellsWithTextEvents';
import {CategoryCellElement} from './categoryCellElement';
import {Browser} from '../../../../utils/browser/browser';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class CategoryCellEvents {
  // the reason why this is triggered by window is because when the user clicks on dropdown padding or delete button
  // keydown events will no longer be fired through the cell text - however we need to maintain the same behaviour
  // prettier-ignore
  public static keyDownText(etc: EditableTableComponent, columnIndex: number, rowIndex: number, event: KeyboardEvent) {
    const {categoryDropdown: {activeItems}, elements} = etc.columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      CellsWithTextEvents.programmaticBlur(etc);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      DataCellEvents.keyDownCell.bind(etc)(event);
      FocusNextCellFromCategoryCell.focusOrBlurRowNextCell(etc, columnIndex, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      FocusNextCellFromCategoryCell.focusOrBlurColumnNextCell(elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      CategoryDropdownItem.setSiblingItemOnCell(etc, activeItems, 'previousSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      CategoryDropdownItem.setSiblingItemOnCell(etc, activeItems, 'nextSibling');
    }
  }

  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    CategoryDropdown.display(this, columnIndex, cellElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  public static blurring(etc: EditableTableComponent, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const {element, categoryToItem} = etc.columnsDetails[columnIndex].categoryDropdown;
    CategoryDropdown.hide(element);
    if (!categoryToItem[textElement.textContent as string]) {
      CategoryCellElement.finaliseEditedText(etc, textElement, columnIndex);
    }
    DataCellEvents.blur(etc, rowIndex, columnIndex, textElement);
  }

  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    if (!this.focusedElements.categoryDropdown) {
      CategoryCellEvents.blurring(this, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  private static mouseDownCell(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // this is also triggered by text, but we only want when cell to focus
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      const cellElement = event.target as HTMLElement;
      const textElement = cellElement.children[0] as HTMLElement;
      // needed to set cursor at the end
      event.preventDefault();
      // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
      // or delete cateogory buttons are clicked, hence once that happens and the user clicks on another category
      // cell, the dropdown is closed programmatically as follows
      if (this.focusedElements.categoryDropdown) {
        CellsWithTextEvents.programmaticBlur(this);
      }
      // Firefox does not fire the focus event for CaretPosition.setToEndOfText
      if (Browser.IS_FIREFOX) textElement.focus();
      // in non firefox browsers this also focuses
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  // inherently using data cell events and overwriting the following
  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    // these are used in date cells and overwritten when converted from
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.onmousedown = CategoryCellEvents.mouseDownCell.bind(etc);
    const textElement = cellElement.children[0] as HTMLElement;
    textElement.onblur = CategoryCellEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = CategoryCellEvents.focusText.bind(etc, rowIndex, columnIndex);
  }
}
