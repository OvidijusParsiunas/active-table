import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {ActiveOverlayElements} from '../../../../../types/activeOverlayElements';
import {FilterRowsButtonElement} from '../button/filterRowsButtonElement';
import {OuterContentPosition} from '../../../../../types/outerContainer';
import {FilterRowsDropdownItem} from './filterRowsDropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownElement {
  public static hide(activeOverlayElements: ActiveOverlayElements) {
    OuterDropdownElement.hide(activeOverlayElements);
  }

  public static create(at: ActiveTable, containerElement: HTMLElement, position: OuterContentPosition) {
    const buttonElement = FilterRowsButtonElement.create();
    containerElement.appendChild(buttonElement);
    const hideFunc = FilterRowsDropdownElement.hide.bind(this, at._activeOverlayElements);
    const {element} = OuterDropdownElement.create(at, buttonElement, position, ['filter-rows-dropdown'], hideFunc);
    FilterRowsDropdownItem.populate(at, element);
    return element;
  }
}
