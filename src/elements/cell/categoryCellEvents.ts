import {CategoryDropdownItem} from '../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {FocusedCellUtils} from '../../utils/cellFocus/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CaretPosition} from '../../utils/cellFocus/caretPosition';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
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

  // prettier-ignore
  private static display(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement,
      textElement: HTMLElement) {
    if (etc.focusedCell.element !== cellElement) {
      // also make sure this line is before others as this entire methods would get called twice when mouse down on text
      // IMPORTANT for this to be called in mouse down as it needs to be called before onMouseDown is called in tableEvents
      FocusedCellUtils.set(etc.focusedCell, cellElement, rowIndex, columnIndex, etc.defaultCellValue);
      CategoryDropdown.display(etc, columnIndex, cellElement);
      // will be overriden if mouse clicked on text 
      CaretPosition.setToEndOfText(etc, textElement);
    }
  }

  // only real purpose of this is to focus on tab and facilitate caret functionality for firefox
  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    CategoryCellEvents.display(this, rowIndex, columnIndex, cellElement, textElement);
  }

  private static mouseDownOnText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    // this is called here because FocusedCellUtils.set needs to be called before mousedown is called in tableEvents
    CategoryCellEvents.display(etc, rowIndex, columnIndex, cellElement, textElement);
  }

  private static mouseDownOnCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    const textElement = cellElement.children[0] as HTMLElement;
    event.preventDefault();
    // needs to be called for firefox in order to set content editable for the workaround
    textElement.focus();
    CategoryCellEvents.display(etc, rowIndex, columnIndex, cellElement, textElement);
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
