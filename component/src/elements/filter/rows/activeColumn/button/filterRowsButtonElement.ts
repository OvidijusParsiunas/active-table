import {DRODOWN_ARROW_SVG_STRING} from '../../../../../consts/icons/dropdownArrowSVGString';
import {ToggleableElement} from '../../../../../utils/elements/toggleableElement';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {FilterRowsElements} from '../../filterRowsElements';
import {StatefulCSS} from '../../../../../types/cssStyle';

// events are appended at OuterDropdownButtonEvents.set
export class FilterRowsButtonElement {
  public static readonly ACTIVE_STYLE = {
    filter:
      // eslint-disable-next-line max-len
      'brightness(0) saturate(100%) invert(14%) sepia(59%) saturate(2970%) hue-rotate(219deg) brightness(98%) contrast(126%)',
  };

  private static readonly HOVER_STYLE = {
    filter:
      // eslint-disable-next-line max-len
      'brightness(0) saturate(100%) invert(14%) sepia(59%) saturate(2970%) hue-rotate(219deg) brightness(98%) contrast(126%)',
  };

  public static create(styles: StatefulCSS = {}) {
    const button = document.createElement('div');
    button.classList.add('filter-rows-dropdown-button', ToggleableElement.AUTO_STYLING_CLASS);
    FilterRowsElements.applyStatefulStyles(button as unknown as HTMLElement, FilterRowsButtonElement.HOVER_STYLE, styles);
    const svgIconElement = SVGIconUtils.createSVGElement(DRODOWN_ARROW_SVG_STRING);
    button.appendChild(svgIconElement);
    return button;
  }
}
