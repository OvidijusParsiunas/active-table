import {CellWithTextEvents} from '../../cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {CellElement} from '../../cell/cellElement';
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
    delete categoryDropdown.categoryToItem[CellElement.getText(itemElement.children[0] as HTMLElement)];
    itemElement.remove();
    if (Object.keys(categoryDropdown.categoryToItem).length === 0) {
      CellWithTextEvents.programmaticBlur(this);
    } else {
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
    }
  }

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.classList.add(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_ICON_CLASS);
    iconElement.innerText = CategoryDeleteButton.DELETE_ICON_TEXT;
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

  public static changeVisibility(event: MouseEvent, verticalScrollPresent: boolean, displayOnDropdown?: HTMLElement) {
    // event.isTrusted ensures that the item only appears when using a mouse
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const buttonContainerElement = itemElement.children[1] as HTMLElement;
      buttonContainerElement.style.display = displayOnDropdown ? 'block' : 'none';
      if (displayOnDropdown) {
        const buttonElement = buttonContainerElement.children[0] as HTMLElement;
        const rightSideDelta = verticalScrollPresent ? 31 : 16;
        buttonElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta}px`;
      }
    }
  }
}
