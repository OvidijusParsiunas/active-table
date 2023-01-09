import {CellWithTextEvents} from '../../cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {SelectDropdownScrollbar} from './selectDropdownScrollbar';
import {SelectDropdownT} from '../../../types/columnDetails';
import {CellElement} from '../../cell/cellElement';
import {DropdownItem} from '../dropdownItem';

export class SelectDeleteButton {
  private static readonly SELECT_DELETE_BUTTON_CONTAINER_CLASS = 'select-delete-button-container';
  public static readonly SELECT_DELETE_BUTTON_CLASS = 'select-delete-button';
  private static readonly SELECT_DELETE_BUTTON_ICON_CLASS = 'select-delete-button-icon';
  private static readonly DELETE_ICON_TEXT = '×';

  private static delete(this: EditableTableComponent, selectDropdown: SelectDropdownT, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete selectDropdown.selectItem[CellElement.getText(itemElement.children[0] as HTMLElement)];
    itemElement.remove();
    if (Object.keys(selectDropdown.selectItem).length === 0) {
      CellWithTextEvents.programmaticBlur(this);
    } else {
      SelectDropdownScrollbar.setProperties(selectDropdown);
    }
  }

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.classList.add(SelectDeleteButton.SELECT_DELETE_BUTTON_ICON_CLASS);
    iconElement.innerText = SelectDeleteButton.DELETE_ICON_TEXT;
    return iconElement;
  }

  private static createButton(etc: EditableTableComponent, selectDropdown: SelectDropdownT) {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER, SelectDeleteButton.SELECT_DELETE_BUTTON_CLASS);
    buttonElement.onclick = SelectDeleteButton.delete.bind(etc, selectDropdown);
    return buttonElement;
  }

  private static createContainer() {
    const containerElement = document.createElement('div');
    containerElement.classList.add(SelectDeleteButton.SELECT_DELETE_BUTTON_CONTAINER_CLASS);
    return containerElement;
  }

  public static create(etc: EditableTableComponent, selectDropdown: SelectDropdownT) {
    const containerElement = SelectDeleteButton.createContainer();
    const buttonElement = SelectDeleteButton.createButton(etc, selectDropdown);
    const iconElement = SelectDeleteButton.createIcon();
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
