import {CategoryDropdownItem} from '../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {FocusedCellUtils} from '../../utils/cellFocus/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CaretPosition} from '../../utils/cellFocus/caretPosition';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {Browser} from '../../utils/browser/browser';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from './cellElement';

export class CategoryCellEvents {
  // prettier-ignore
  private static keyDownText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const { categories: { categoryDropdownItems}, elements } = this.columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE || event.key === KEYBOARD_KEY.TAB) {
      (event.target as HTMLElement).blur();
      // the above will not trigger the CategoryCellEvents.blur functionality if dropdown has been focused, but will blur
      // the element in the dom, the following will trigger the required programmatic functionality
      if (this.focusedCategoryDropdown.element) CategoryCellEvents.blur(this, rowIndex, columnIndex, event);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      CategoryDropdownItem.focusOrBlurNextColumnCell(elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      CategoryDropdownItem.highlightSiblingItem(this, categoryDropdownItems, 'previousSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      CategoryDropdownItem.highlightSiblingItem(this, categoryDropdownItems, 'nextSibling');
    }
  }

  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    CategoryDropdown.display(this, columnIndex, cellElement);
    FocusedCellUtils.set(this.focusedCell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    if (this.cellKeyPressState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownOnCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  private static blur(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const {overlayElementsState, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const {isCellTextNewCategory: isTypedNewCategory, categoryDropdownItems} = columnDetails.categories;
    const categoryDropdown = overlayElementsState.categoryDropdown as HTMLElement;
    CategoryDropdown.hide(categoryDropdown);
    if (isTypedNewCategory) {
      const textElement = event.target as HTMLElement;
      CategoryDropdownItem.addNewCategory(textElement, columnDetails, categoryDropdown, categoryDropdownItems);
    }
    DataCellEvents.blur.bind(etc, rowIndex, columnIndex, event);
  }

  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    if (!this.focusedCategoryDropdown.element) {
      CategoryCellEvents.blur(this, rowIndex, columnIndex, event);
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
      // Firefox does not fire the focus event for CaretPosition.setToEndOfText
      if (Browser.IS_FIREFOX) textElement.focus();
      // in non firefox browsers this also focuses
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  // inherently using data cell events and overwriting the following
  public static addEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.onmousedown = CategoryCellEvents.mouseDownCell.bind(etc);
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    const textElement = cellElement.children[0] as HTMLElement;
    textElement.onblur = CategoryCellEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = CategoryCellEvents.focusText.bind(etc, rowIndex, columnIndex);
    textElement.onkeydown = CategoryCellEvents.keyDownText.bind(etc, rowIndex, columnIndex);
  }
}
