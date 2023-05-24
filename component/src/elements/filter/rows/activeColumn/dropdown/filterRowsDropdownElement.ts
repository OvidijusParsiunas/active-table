import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {ActiveOverlayElements} from '../../../../../types/activeOverlayElements';
import {FilterRowsButtonElement} from '../button/filterRowsButtonElement';
import {OuterContentPosition} from '../../../../../types/outerContainer';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownElement {
  private static hide(activeOverlayElements: ActiveOverlayElements) {
    OuterDropdownElement.hide(activeOverlayElements);
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
    const buttonElement = FilterRowsButtonElement.create();
    containerElement.appendChild(buttonElement);
    const hideFunc = FilterRowsDropdownElement.hide.bind(this, at._activeOverlayElements);
    const {element} = OuterDropdownElement.create(at, buttonElement, position, ['filter-rows-dropdown'], hideFunc);
    FilterRowsDropdownElement.addItems(at, element);
    return element;
  }
}
