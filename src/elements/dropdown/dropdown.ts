import {EditableTableComponent} from '../../editable-table-component';
import {ElementViewPort} from '../../utils/elements/elementViewPort';
import {HeaderCellEvents} from '../cell/headerCellEvents';
import {CellEvents} from '../cell/cellEvents';

export class Dropdown {
  private static readonly ENTER_KEY = 'Enter';
  private static readonly ESCAPE_KEY = 'Escape';
  private static readonly TAB_KEY = 'Tab';
  // there will only ever be one dropdown instance within the shadow dom
  private static readonly DROPDOWN_ID = 'editable-table-component-dropdown';
  private static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  private static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly CSS_DISPLAY_VISIBLE = 'block';

  public static isDisplayed(columnDropdown?: HTMLElement) {
    return columnDropdown?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.id === Dropdown.DROPDOWN_ID || element.classList.contains(Dropdown.DROPDOWN_ITEM_CLASS);
  }

  private static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  private static focusNextItem(dropdownElement: HTMLElement, event: KeyboardEvent) {
    event.preventDefault();
    const focusedElement = event.target as HTMLElement;
    const nextElement = focusedElement.nextSibling as HTMLElement;
    (nextElement || dropdownElement.children[0]).focus();
  }

  private static onKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === Dropdown.ENTER_KEY || event.key === Dropdown.ESCAPE_KEY) {
      Dropdown.hideRelevantDropdownElements(this);
    } else if (event.key === Dropdown.TAB_KEY) {
      Dropdown.focusNextItem(dropdownElement, event);
    }
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

  private static addInputItem(dropdownElement: HTMLElement) {
    const inputItemElement = document.createElement('input');
    inputItemElement.tabIndex = dropdownElement.children.length;
    inputItemElement.classList.add(Dropdown.DROPDOWN_ITEM_CLASS, Dropdown.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputItemElement.spellcheck = false;
    dropdownElement.appendChild(inputItemElement);
  }

  private static addItem(dropdownElement: HTMLElement, itemText: string) {
    const itemElement = document.createElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(Dropdown.DROPDOWN_ITEM_CLASS);
    itemElement.textContent = itemText;
    dropdownElement.appendChild(itemElement);
  }

  public static create(areHeadersEditable: boolean) {
    const dropdownElement = document.createElement('div');
    dropdownElement.id = Dropdown.DROPDOWN_ID;
    if (areHeadersEditable) Dropdown.addInputItem(dropdownElement);
    Dropdown.addItem(dropdownElement, 'Ascendinasdsadasdasg');
    Dropdown.addItem(dropdownElement, 'Descending');
    Dropdown.addItem(dropdownElement, 'Insert Right');
    Dropdown.addItem(dropdownElement, 'Insert Left');
    Dropdown.addItem(dropdownElement, 'Delete');
    Dropdown.hideElements(dropdownElement);
    return dropdownElement;
  }

  private static resetDropdownPosition(dropdownElement: HTMLElement) {
    dropdownElement.style.left = '';
    dropdownElement.style.right = '';
  }

  // prettier-ignore
  public static hideRelevantDropdownElements(etc: EditableTableComponent) {
    const {
      overlayElementsState: {columnDropdown, fullTableOverlay},
      highlightedHeaderCell: {element: cellElement, columnIndex}} = etc;
    CellEvents.setCellToDefaultIfNeeded(etc, 0, columnIndex as number, cellElement as HTMLElement);
    HeaderCellEvents.fadeCell(cellElement as HTMLElement);
    Dropdown.hideElements(columnDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    Dropdown.resetDropdownPosition(columnDropdown as HTMLElement);
  }

  // TO-DO will this work correctly when a scrollbar is introduced
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement) {
    const dimensions = cellElement.getBoundingClientRect();
    dropdownElement.style.left = `${dimensions.left}px`;
    dropdownElement.style.top = `${dimensions.bottom}px`;
    // needs to be displayed in order to evalute if in view port
    dropdownElement.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    if (!ElementViewPort.isIn(dropdownElement)) {
      // move to the right
      dropdownElement.style.left = '';
      dropdownElement.style.right = '0px';
    }
  }

  // prettier-ignore
  private static setInputElement(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement,
      dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    dropdownInutElement.value = etc.contents[0][columnIndex] as string;
    // overwrites the oninput event
    dropdownInutElement.oninput = Dropdown.onInput.bind(
      etc, columnIndex, cellElement, dropdownElement, dropdownInutElement);
  }

  // prettier-ignore
  // WORK - how will this positioning work with scrolling
  public static displayRelevantDropdownElements(etc: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const fullTableOverlay = etc.overlayElementsState.fullTableOverlay as HTMLElement;
    const dropdownElement = etc.overlayElementsState.columnDropdown as HTMLElement;
    const dropdownInutElement = dropdownElement.getElementsByClassName(
      Dropdown.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    const cellElement = event.target as HTMLElement;
    Dropdown.displayAndSetDropdownPosition(cellElement, dropdownElement);
    if (dropdownInutElement) Dropdown.setInputElement(etc, columnIndex, cellElement, dropdownInutElement, dropdownElement);
    dropdownElement.onkeydown = Dropdown.onKeyDown.bind(etc, dropdownElement);
    (dropdownElement.children[0] as HTMLElement).focus()
    fullTableOverlay.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
  }
}
