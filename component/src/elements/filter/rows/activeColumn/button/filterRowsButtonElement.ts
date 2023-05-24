import {OuterDropdownButtonElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {DRODOWN_ARROW_SVG_STRING} from '../../../../../consts/icons/dropdownArrowSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {FilterRowsElements} from '../../filterRowsElements';

// events are appended at OuterDropdownButtonEvents.set
export class FilterRowsButtonElement {
  // prettier-ignore
  public static create() {
    const button = document.createElement('div');
    button.classList.add(
      'filter-rows-dropdown-button', FilterRowsElements.ICON_BUTTON_CLASS, OuterDropdownButtonElement.AUTO_STYLING);
    const svgIconElement = SVGIconUtils.createSVGElement(DRODOWN_ARROW_SVG_STRING);
    button.appendChild(svgIconElement);
    return button;
  }
}
