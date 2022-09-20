export class Dropdown {
  // there will only ever be one dropdown instance within the shadow dom
  private static readonly DROPDOWN_ID = 'editable-table-component-dropdown';
  private static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  private static readonly CSS_DISPLAY_VISIBLE = 'block';

  private static addInputItem(dropdownElement: HTMLElement, defaultText: string) {
    const inputItemElement = document.createElement('input');
    inputItemElement.classList.add(Dropdown.DROPDOWN_ITEM_CLASS);
    inputItemElement.textContent = defaultText;
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
    Dropdown.addInputItem(dropdownElement, 'asdasdsad');
    Dropdown.addItem(dropdownElement, 'Ascending');
    Dropdown.addItem(dropdownElement, 'Descending');
    Dropdown.addItem(dropdownElement, 'Insert Right');
    Dropdown.addItem(dropdownElement, 'Insert Left');
    Dropdown.addItem(dropdownElement, 'Delete');
    Dropdown.hideElements(dropdownElement);
    return dropdownElement;
  }

  public static display(dropdownElement: HTMLElement, fullTableOverlay: HTMLElement, columnId: number, event: MouseEvent) {
    fullTableOverlay.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    dropdownElement.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    dropdownElement.style.left = `${event.clientX}px`;
    dropdownElement.style.top = `${event.clientY}px`;
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
