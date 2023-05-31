import {DropdownItemHighlightUtils} from '../../color/dropdownItemHighlightUtils';
import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../types/activeOverlayElements';
import {OuterDropdownButtonEvents} from './outerDropdownButtonEvents';
import {ToggleableElement} from '../../elements/toggleableElement';
import {OuterContentPosition} from '../../../types/outerContainer';
import {ElementVisibility} from '../../elements/elementVisibility';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {OuterDropdownEvents} from './outerDropdownEvents';
import {ActiveTable} from '../../../activeTable';
import {CSSStyle} from '../../../types/cssStyle';
import {SIDE} from '../../../types/side';

export class OuterDropdownElement {
  private static readonly DROPUP_CLASS = 'active-table-dropup';

  public static hide(activeOverlayElements: ActiveOverlayElements, activeStyle: CSSStyle) {
    const dropdown = activeOverlayElements.outerContainerDropdown;
    if (dropdown) {
      Dropdown.hide(dropdown.element);
      if (dropdown.button.classList.contains(ToggleableElement.AUTO_STYLING_CLASS)) {
        ToggleableElement.unsetActive(dropdown.button, activeStyle);
      }
      delete activeOverlayElements.outerContainerDropdown;
      DropdownItemHighlightUtils.fadeCurrentlyHighlighted(activeOverlayElements);
    }
  }

  public static display(at: ActiveTable, dropdown: OuterContainerDropdownI) {
    if (dropdown.button.classList.contains(ToggleableElement.AUTO_STYLING_CLASS)) {
      ToggleableElement.setActive(dropdown.button, dropdown.activeButtonStyle);
    }
    Dropdown.display(dropdown.element);
    at._activeOverlayElements.outerContainerDropdown = dropdown;
  }

  public static displayReactToBottomVisibility(at: ActiveTable, dropdown: OuterContainerDropdownI) {
    dropdown.element.classList.remove(OuterDropdownElement.DROPUP_CLASS);
    OuterDropdownElement.display(at, dropdown);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown.element, at._tableDimensions.border, false);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      dropdown.element.classList.add(OuterDropdownElement.DROPUP_CLASS);
    }
  }

  private static setOrientation(dropdownElement: HTMLElement, position: OuterContentPosition) {
    if (position.endsWith('right')) dropdownElement.style.right = '0px';
  }

  private static createElement(additionalClasses?: string[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.width = '';
    dropdownElement.classList.add('outer-container-dropdown');
    if (additionalClasses) dropdownElement.classList.add(...additionalClasses);
    return dropdownElement;
  }

  // prettier-ignore
  public static create(at: ActiveTable, button: HTMLElement, position: OuterContentPosition,
      activeButtonStyle: CSSStyle, additionalClasses: string[], hide: () => void,
      displayFunc?: (at: ActiveTable, dropdown: OuterContainerDropdownI) => void) {
    const dropdownElement = OuterDropdownElement.createElement(additionalClasses);
    const dropdown: OuterContainerDropdownI = {element: dropdownElement, hide, button, activeButtonStyle};
    OuterDropdownElement.setOrientation(dropdownElement, position);
    OuterDropdownButtonEvents.set(at, button, position, dropdown, displayFunc);
    OuterDropdownEvents.set(at, dropdown);
    return dropdown;
  }
}
