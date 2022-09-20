import {EditableTableComponent} from '../../editable-table-component';
import {ElementViewPort} from '../../utils/elements/elementViewPort';
import {CellEvents} from '../cell/cellEvents';

export class Dropdown {
  // there will only ever be one dropdown instance within the shadow dom
  private static readonly DROPDOWN_ID = 'editable-table-component-dropdown';
  private static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  private static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly CSS_DISPLAY_VISIBLE = 'block';

  // prettier-ignore
  private static onInputKeyDown(this: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownElement: HTMLElement, dropdownInutElement: HTMLInputElement) {
    setTimeout(() => {
      CellEvents.updateCellWithPreprocessing(this, 0, columnIndex, dropdownInutElement.value, cellElement);
      // when the header cell height changes - the dropdown moves up and
      const dimensions = cellElement.getBoundingClientRect();
      dropdownElement.style.top = `${dimensions.bottom}px`;
    })
  }

  private static addInputItem(dropdownElement: HTMLElement) {
    const inputItemElement = document.createElement('input');
    inputItemElement.classList.add(Dropdown.DROPDOWN_ITEM_CLASS, Dropdown.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputItemElement.spellcheck = false;
    dropdownElement.appendChild(inputItemElement);
  }

  private static addItem(dropdownElement: HTMLElement, itemText: string) {
    const itemElement = document.createElement('div');
    itemElement.classList.add(Dropdown.DROPDOWN_ITEM_CLASS);
    itemElement.textContent = itemText;
    dropdownElement.appendChild(itemElement);
  }

  public static create() {
    const dropdownElement = document.createElement('div');
    dropdownElement.id = Dropdown.DROPDOWN_ID;
    Dropdown.addInputItem(dropdownElement);
    Dropdown.addItem(dropdownElement, 'Ascending');
    Dropdown.addItem(dropdownElement, 'Descending');
    Dropdown.addItem(dropdownElement, 'Insert Right');
    Dropdown.addItem(dropdownElement, 'Insert Left');
    Dropdown.addItem(dropdownElement, 'Delete');
    Dropdown.hideElements(dropdownElement);
    return dropdownElement;
  }

  // prettier-ignore
  private static displayElements(
      dropdownElement: HTMLElement, fullTableOverlay: HTMLElement, dropdownInutElement: HTMLElement) {
    dropdownElement.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    fullTableOverlay.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    dropdownInutElement.focus();
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static setDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement) {
    const dimensions = cellElement.getBoundingClientRect();
    dropdownElement.style.left = `${dimensions.left}px`;
    dropdownElement.style.top = `${dimensions.bottom}px`;
    if (!ElementViewPort.isIn(dropdownElement)) {
      // move to the right
      dropdownElement.style.left = '';
      dropdownElement.style.right = '0px';
    }
  }

  // prettier-ignore
  // WORK - how will this positioning work with scrolling
  public static display(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const fullTableOverlay = etc.overlayElementsState.fullTableOverlay as HTMLElement;
    const dropdownElement = etc.overlayElementsState.columnDropdown as HTMLElement;
    const dropdownInutElement = dropdownElement.getElementsByClassName(
      Dropdown.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    dropdownInutElement.value = etc.contents[0][columnIndex] as string;
    const cellElement = event.target as HTMLElement;
    Dropdown.setDropdownPosition(cellElement, dropdownElement);
    Dropdown.displayElements(dropdownElement, fullTableOverlay, dropdownInutElement);
    // overwrites the onkeydown event
    dropdownElement.onkeydown = Dropdown.onInputKeyDown.bind(
      etc, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }

  public static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  public static isDisplayed(columnDropdown?: HTMLElement) {
    return columnDropdown?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.id === Dropdown.DROPDOWN_ID || element.classList.contains(Dropdown.DROPDOWN_ITEM_CLASS);
  }
}
