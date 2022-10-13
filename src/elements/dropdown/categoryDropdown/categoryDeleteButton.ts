import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {CategoryCellEvents} from '../../cell/categoryCellEvents';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {DropdownItem} from '../dropdownItem';

export class CategoryDeleteButton {
  private static readonly CATEGORY_DELETE_BUTTON_CONTAINER_CLASS = 'category-delete-button-container';
  public static readonly CATEGORY_DELETE_BUTTON_CLASS = 'category-delete-button';
  private static readonly CATEGORY_DELETE_BUTTON_ICON_CLASS = 'category-delete-button-icon';
  private static readonly DELETE_ICON_TEXT = '×';

  private static delete(this: EditableTableComponent, categoryDropdown: CategoryDropdownT, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete categoryDropdown.categoryToItem[itemElement.children[0].textContent as string];
    categoryDropdown.element.removeChild(itemElement);
    if (Object.keys(categoryDropdown.categoryToItem).length === 0) {
      CategoryCellEvents.programmaticBlur(this);
    } else {
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
    }
  }

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_ICON_CLASS);
    iconElement.textContent = CategoryDeleteButton.DELETE_ICON_TEXT;
    return iconElement;
  }

  private static createButton(etc: EditableTableComponent, categoryDropdown: CategoryDropdownT) {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER, CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CLASS);
    buttonElement.onclick = CategoryDeleteButton.delete.bind(etc, categoryDropdown);
    return buttonElement;
  }

  private static createContainer() {
    const containerElement = document.createElement('div');
    containerElement.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CONTAINER_CLASS);
    return containerElement;
  }

  public static create(etc: EditableTableComponent, categoryDropdown: CategoryDropdownT) {
    const containerElement = CategoryDeleteButton.createContainer();
    const buttonElement = CategoryDeleteButton.createButton(etc, categoryDropdown);
    const iconElement = CategoryDeleteButton.createIcon();
    buttonElement.appendChild(iconElement);
    containerElement.appendChild(buttonElement);
    return containerElement;
  }

  public static changeVisibility(event: MouseEvent, isVerticalScrollPresent: boolean, display: boolean) {
    // event.isTrusted ensures that the item only appears when using a mouse
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const buttonContainerElement = itemElement.children[1] as HTMLElement;
      buttonContainerElement.style.display = display ? 'block' : 'none';
      if (display) {
        const buttonElement = buttonContainerElement.children[0] as HTMLElement;
        buttonElement.style.left = isVerticalScrollPresent ? '145px' : '160px';
      }
    }
  }
}
