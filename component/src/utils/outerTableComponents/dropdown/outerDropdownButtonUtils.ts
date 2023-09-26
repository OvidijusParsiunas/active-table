import {ARROW_DOWN_SVG_STRING} from '../../../consts/icons/arrowDownIconSVGString';
import {GenericElementUtils} from '../../elements/genericElementUtils';
import {SVGIconUtils} from '../../svgIcons/svgIconUtils';
import {StatefulCSS} from '../../../types/cssStyle';

// this is currently used by file export and rows per page buttons - needs refactoring to include filter
export class OuterDropdownButtonUtils {
  private static readonly ARROW_CONTAINER_CLASS = 'outer-dropdown-button-arrow-container';
  private static readonly ARROW_ICON_CLASS = 'outer-dropdown-button-arrow-icon';

  private static processStatefulStyle(statefulCSS: StatefulCSS) {
    statefulCSS.hover ??= statefulCSS.default;
    statefulCSS.click ??= statefulCSS.hover;
  }

  public static processAndApplyDefaultStyle(element: HTMLElement, styles?: StatefulCSS) {
    if (styles) {
      OuterDropdownButtonUtils.processStatefulStyle(styles);
      Object.assign(element.style, styles.default);
    }
  }

  public static createArrow(containerClasses?: string[], iconClasses?: string[]) {
    const container = document.createElement('div');
    container.classList.add(OuterDropdownButtonUtils.ARROW_CONTAINER_CLASS, GenericElementUtils.NOT_SELECTABLE_CLASS);
    if (containerClasses) container.classList.add(...containerClasses);
    const icon = SVGIconUtils.createSVGElement(ARROW_DOWN_SVG_STRING);
    icon.classList.add(OuterDropdownButtonUtils.ARROW_ICON_CLASS);
    if (iconClasses) icon.classList.add(...iconClasses);
    container.appendChild(icon);
    return container;
  }
}
