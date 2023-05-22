import {OuterDropdownElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {DropdownItem} from '../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsDropdownElement {
  private static createButton() {
    const button = document.createElement('div');
    button.classList.add('filter-rows-dropdown-button');
    button.textContent = 'Aa';
    return button;
  }

  private static addItems(at: ActiveTable, dropdownElement: HTMLElement) {
    setTimeout(() => {
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Hello'});
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'What makes sense'});
    });
  }

  public static create(at: ActiveTable, containerElement: HTMLElement) {
    const buttonElement = FilterRowsDropdownElement.createButton();
    containerElement.appendChild(buttonElement);
    const dropdownElement = OuterDropdownElement.create(at, buttonElement);
    FilterRowsDropdownElement.addItems(at, dropdownElement);
    return dropdownElement;
  }
}
