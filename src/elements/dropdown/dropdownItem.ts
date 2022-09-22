import {EditableTableComponent} from '../../editable-table-component';
import {InsertNewColumn} from '../../utils/insertRemoveStructure/insert/insertNewColumn';
import {RemoveColumn} from '../../utils/insertRemoveStructure/remove/removeColumn';
import {CellEvents} from '../cell/cellEvents';
import {Dropdown} from './dropdown';

export class DropdownItem {
  public static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  public static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  public static readonly DROPDOWN_BUTTON_CLASS = 'dropdown-button';

  private static createItem(dropdownElement: HTMLElement) {
    const itemElement = document.createElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS);
    return itemElement;
  }

  // reason why using onInput for updating cells is because it works for paste
  // prettier-ignore
  private static onInput(this: EditableTableComponent,
    columnIndex: number, cellElement: HTMLElement, dropdownElement: HTMLElement, dropdownInutElement: HTMLInputElement) {
  setTimeout(() => {
    CellEvents.updateCell(this, dropdownInutElement.value, 0, columnIndex, { element: cellElement, processText: false });
    // when the header cell height changes - the dropdown moves up and
    const dimensions = cellElement.getBoundingClientRect();
    dropdownElement.style.top = `${dimensions.bottom}px`;
  })
}

  // prettier-ignore
  public static setUpInputElement(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement,
      dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    dropdownInutElement.value = etc.contents[0][columnIndex] as string;
    // overwrites the oninput event
    dropdownInutElement.oninput = DropdownItem.onInput.bind(
      etc, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }

  public static addInputItem(dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    const inputElement = document.createElement('input');
    inputElement.classList.add(DropdownItem.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputElement.spellcheck = false;
    itemElement.appendChild(inputElement);
    dropdownElement.appendChild(itemElement);
  }

  // prettier-ignore
  private static buttonItemClickMiddleware(this: EditableTableComponent, columnIndex: number,
      fn: (this: EditableTableComponent, columnIndex: number) => void) {
    fn.bind(this)(columnIndex);
    Dropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static rebindButtonItems(etc: EditableTableComponent, columnIndex: number, dropdownElement: HTMLElement) {
    const buttonItemChildren = dropdownElement.getElementsByClassName(DropdownItem.DROPDOWN_BUTTON_CLASS);
    (buttonItemChildren[2] as HTMLElement).onclick = DropdownItem.buttonItemClickMiddleware.bind(
      etc, columnIndex + 1, InsertNewColumn.insertEvent);
    (buttonItemChildren[3] as HTMLElement).onclick = DropdownItem.buttonItemClickMiddleware.bind(
      etc, columnIndex, InsertNewColumn.insertEvent);
    (buttonItemChildren[4] as HTMLElement).onclick = DropdownItem.buttonItemClickMiddleware.bind(
      etc, columnIndex, RemoveColumn.removeEvent);
    // WORK - potential animation can be useful when a new column is inserted
  }

  public static addButtonItem(dropdownElement: HTMLElement, itemText: string) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_BUTTON_CLASS);
    const text = document.createElement('div');
    text.textContent = itemText;
    itemElement.append(text);
    dropdownElement.appendChild(itemElement);
  }

  private static focusNextItemOutsideOfInput(focusedElement: HTMLElement) {
    const itemElement = focusedElement.parentElement as HTMLElement;
    const nextItemElement = itemElement.nextSibling as HTMLElement;
    nextItemElement.focus();
  }

  public static focusInputElement(dropdownElement: HTMLElement) {
    (dropdownElement.children[0].children[0] as HTMLElement).focus();
  }

  public static focusNextItem(dropdownElement: HTMLElement, event: KeyboardEvent) {
    event.preventDefault();
    const focusedElement = event.target as HTMLElement;
    const nextElement = focusedElement.nextSibling as HTMLElement;
    if (nextElement) {
      nextElement.focus();
    } else if (!nextElement) {
      // if at last item
      if (focusedElement.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)) {
        DropdownItem.focusInputElement(dropdownElement);
      } else {
        // if currently inside of input item (assuming input is not last item)
        DropdownItem.focusNextItemOutsideOfInput(focusedElement);
      }
    }
  }
}
