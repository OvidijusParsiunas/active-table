import {DropdownItem} from '../dropdownItem';

export class CategoryDeleteButton {
  private static readonly CATEGORY_DELETE_BUTTON_CONTAINER_CLASS = 'category-delete-button-container';
  public static readonly CATEGORY_DELETE_BUTTON_CLASS = 'category-delete-button';
  private static readonly CATEGORY_DELETE_BUTTON_ICON_CLASS = 'category-delete-button-icon';
  private static readonly DELETE_ICON_TEXT = '×';

  private static click() {
    console.log('click');
  }

  private static createIcon() {
    const icon = document.createElement('div');
    icon.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_ICON_CLASS);
    icon.textContent = CategoryDeleteButton.DELETE_ICON_TEXT;
    return icon;
  }

  private static createButton() {
    const button = document.createElement('div');
    button.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER, CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CLASS);
    button.onclick = CategoryDeleteButton.click;
    return button;
  }

  private static createContainer() {
    const container = document.createElement('div');
    container.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CONTAINER_CLASS);
    return container;
  }

  // WORK - mouse on and use arrow keys
  public static create() {
    const container = CategoryDeleteButton.createContainer();
    const button = CategoryDeleteButton.createButton();
    const icon = CategoryDeleteButton.createIcon();
    button.appendChild(icon);
    container.appendChild(button);
    return container;
  }

  public static changeDisplay(event: MouseEvent, display: boolean) {
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const buttonContainerElement = itemElement.children[1] as HTMLElement;
      buttonContainerElement.style.display = display ? 'block' : 'none';
    }
  }
}
