import {OuterDropdownButtonEvents} from './outerDropdownButtonEvents';
import {OuterContentPosition} from '../../../types/outerContainer';
import {ElementVisibility} from '../../elements/elementVisibility';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {OuterDropdownEvents} from './outerDropdownEvents';
import {ActiveTable} from '../../../activeTable';
import {SIDE} from '../../../types/side';

// not used for pagination as that dropdown behaves differently
export class OuterDropdownElement {
  public static hide(dropdownElement: HTMLElement) {
    Dropdown.hide(dropdownElement);
  }

  public static display(at: ActiveTable, dropdownElement: HTMLElement) {
    Dropdown.display(dropdownElement);
    at._activeOverlayElements.outerContainerDropdown = dropdownElement;
  }

  public static displayReactToBottomVisibility(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.classList.remove('active-table-dropup');
    OuterDropdownElement.display(at, dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement, at._tableDimensions.border);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      dropdownElement.classList.add('active-table-dropup');
    }
  }

  private static setOrientation(dropdownElement: HTMLElement, position: OuterContentPosition) {
    if (position.endsWith('right')) dropdownElement.style.right = '0px';
  }

  public static create(at: ActiveTable, buttonElement: HTMLElement, position: OuterContentPosition) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.width = '';
    dropdownElement.classList.add('outer-container-dropdown', 'filter-rows-dropdown');
    OuterDropdownElement.setOrientation(dropdownElement, position);
    OuterDropdownButtonEvents.set(at, buttonElement, dropdownElement, position);
    OuterDropdownEvents.set(at, dropdownElement);
    return dropdownElement;
  }
}
