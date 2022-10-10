import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownProps} from '../../../types/columnDetails';
import {CategoryCellEvents} from '../../cell/categoryCellEvents';
import {DropdownItem} from '../dropdownItem';

export class CategoryDeleteButton {
  private static readonly CATEGORY_DELETE_BUTTON_CONTAINER_CLASS = 'category-delete-button-container';
  public static readonly CATEGORY_DELETE_BUTTON_CLASS = 'category-delete-button';
  private static readonly CATEGORY_DELETE_BUTTON_ICON_CLASS = 'category-delete-button-icon';
  private static readonly DELETE_ICON_TEXT = '×';

  private static delete(this: EditableTableComponent, categoryDropdownProps: CategoryDropdownProps, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete categoryDropdownProps.categoryToItem[itemElement.children[0].textContent as string];
    categoryDropdownProps.element.removeChild(itemElement);
    if (Object.keys(categoryDropdownProps.categoryToItem).length === 0) {
      CategoryCellEvents.programmaticBlur(this);
    } else {
      CategoryDropdownHorizontalScroll.setPropertiesIfHorizontalScrollPresent(categoryDropdownProps);
    }
  }

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_ICON_CLASS);
    iconElement.textContent = CategoryDeleteButton.DELETE_ICON_TEXT;
    return iconElement;
  }

  private static createButton(etc: EditableTableComponent, categoryDropdownProps: CategoryDropdownProps) {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER, CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CLASS);
    buttonElement.onclick = CategoryDeleteButton.delete.bind(etc, categoryDropdownProps);
    return buttonElement;
  }

  private static createContainer() {
    const containerElement = document.createElement('div');
    containerElement.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CONTAINER_CLASS);
    return containerElement;
  }

  // WORK - mouse on and use arrow keys
  public static create(etc: EditableTableComponent, categoryDropdownProps: CategoryDropdownProps) {
    const containerElement = CategoryDeleteButton.createContainer();
    const buttonElement = CategoryDeleteButton.createButton(etc, categoryDropdownProps);
    const iconElement = CategoryDeleteButton.createIcon();
    buttonElement.appendChild(iconElement);
    containerElement.appendChild(buttonElement);
    return containerElement;
  }

  public static changeDisplay(event: MouseEvent, display: boolean) {
    // event.isTrusted ensures that the item only appears when using a mouse
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const buttonContainerElement = itemElement.children[1] as HTMLElement;
      buttonContainerElement.style.display = display ? 'block' : 'none';
    }
  }
}
