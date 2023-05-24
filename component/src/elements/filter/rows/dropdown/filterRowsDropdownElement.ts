import {OuterDropdownElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContentPosition} from '../../../../types/outerContainer';
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
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Planets Planets Planets Planets'});
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Diameter'});
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Mass'});
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Moons'});
      DropdownItem.addButtonItem(at, dropdownElement, {text: 'Density'});
    });
  }

  public static create(at: ActiveTable, containerElement: HTMLElement, position: OuterContentPosition) {
    const buttonElement = FilterRowsDropdownElement.createButton();
    containerElement.appendChild(buttonElement);
    const {element} = OuterDropdownElement.create(at, buttonElement, position, ['filter-rows-dropdown']);
    FilterRowsDropdownElement.addItems(at, element);
    return element;
  }
}
