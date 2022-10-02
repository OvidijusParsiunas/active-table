import {CategoryDropdownItem} from '../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {FocusedCellUtils} from '../../utils/focusedCell/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {DataCellEvents} from './dataCellEvents';
import {Dropdown} from '../dropdown/dropdown';
import {CellElement} from './cellElement';

export class CategoryCellEvents extends DataCellEvents {
  private static keyDownText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {overlayElementsState, columnsDetails} = this;
    const categoryDropdown = overlayElementsState.categoryDropdown as HTMLElement;
    const columnDetails = columnsDetails[columnIndex];
    // WORK - Esc
    if (event.key === KEYBOARD_KEY.TAB) {
      CategoryDropdown.hideAndSetText(this, categoryDropdown);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      CategoryDropdown.hideAndSetText(this, categoryDropdown);
      CategoryDropdownItem.focusOrBlurNextColumnCell(columnDetails.elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      // WORK - should be able to easily remove this
      if (Dropdown.isDisplayed(categoryDropdown)) {
        event.preventDefault();
        CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'nextSibling');
      }
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      // WORK - should be able to easily remove this
      if (Dropdown.isDisplayed(categoryDropdown)) {
        event.preventDefault();
        CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'previousSibling');
      }
    }
  }

  // prettier-ignore
  private static setTextAndDisplay(etc: EditableTableComponent, rowIndex: number, columnIndex: number,
      cellElement: HTMLElement) {
    if (etc.focusedCell.element !== cellElement) {
      CategoryDropdown.display(etc, columnIndex, cellElement);
      // set on mouse down rather than focus as it needs to be called before onMouseDown is called in tableEvents
      FocusedCellUtils.set(etc.focusedCell, cellElement, rowIndex, columnIndex, etc.defaultCellValue)
    }
  }

  private static mouseDownOnText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    CategoryCellEvents.setTextAndDisplay(etc, rowIndex, columnIndex, cellElement);
  }

  private static mouseDownOnCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    const textElement = cellElement.children[0] as HTMLElement;
    CategoryCellEvents.setTextAndDisplay(etc, rowIndex, columnIndex, cellElement);
    event.preventDefault();
    // textElement.innerHTML = ''
    // const newElement = document.createElement('span');
    // newElement.textContent = '123123';
    // const newElement2 = document.createElement('br');
    // textElement.onfocus = DataCellEvents.setFirefoxStuff.bind(this, textElement, rowIndex);
    textElement.focus();
    // const shadowRoot = etc.shadowRoot as unknown as Document;
    // const selection = shadowRoot.getSelection() as Selection;
    // const range = document.createRange();
    // range.setStart(textElement.childNodes[0], textElement.textContent?.length || 0);
    // range.collapse(true);
    // selection.removeAllRanges();
    // selection.addRange(range);
    // setTimeout(() => {
    //   textElement.insertBefore(newElement, textElement.childNodes[0]);
    //   const content = document.createElement('span');
    //   newElement.insertAdjacentElement('beforebegin', content);
    //   content.textContent = 'asduyagsduygsadyu';
    // }, 100);
    // setTimeout(() => newElement.insertAdjacentText('beforebegin', 'asdsad'), 1000);
  }

  private static mouseDownCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      CategoryCellEvents.mouseDownOnCell(this, rowIndex, columnIndex, event);
    } else {
      CategoryCellEvents.mouseDownOnText(this, rowIndex, columnIndex, event);
    }
  }

  // inherently using data cell events and overwriting the following
  public static addEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.onmousedown = CategoryCellEvents.mouseDownCell.bind(etc, rowIndex, columnIndex);
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    const textElement = cellElement.children[0] as HTMLElement;
    textElement.onblur = DataCellEvents.blur.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = DataCellEvents.prepareCell.bind(etc, rowIndex, columnIndex);
    textElement.onkeydown = CategoryCellEvents.keyDownText.bind(etc, rowIndex, columnIndex);
  }
}
