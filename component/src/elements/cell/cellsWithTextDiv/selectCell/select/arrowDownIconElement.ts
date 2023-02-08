import {ARROW_DOWN_ICON_SVG_STRING} from '../../../../../consts/icons/arrowDownSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';

export class ArrowDownIconElement {
  public static readonly ARROW_ICON_CLASS = 'arrow-down-icon';
  private static readonly ARROW_ICON_CONTAINER_CLASS = 'arrow-down-icon-container';
  // WORK - this can potentially be reused
  private static readonly ARROW_ICON_ELEMENT = ArrowDownIconElement.createSVG();

  // WORK - flip the arrow icon when dropdown is open
  public static toggle(cellElement: HTMLElement | undefined, isDisplay: boolean) {
    if (!cellElement) return;
    const inputContainer = cellElement.children[1] as HTMLElement;
    inputContainer.style.display = isDisplay ? 'block' : 'none';
  }

  // need a container to allow absolute positioning for the icon
  private static createContainer() {
    const container = document.createElement('div');
    container.classList.add(ArrowDownIconElement.ARROW_ICON_CONTAINER_CLASS);
    container.style.display = 'none';
    return container;
  }

  // REF-10
  private static createSVGElement() {
    const svgIconElement = SVGIconUtils.createSVGElement(ARROW_DOWN_ICON_SVG_STRING);
    svgIconElement.classList.add(ArrowDownIconElement.ARROW_ICON_CLASS);
    // using style as the class has no effect on svg
    return svgIconElement;
  }

  public static createSVG() {
    const svgIcon = ArrowDownIconElement.createSVGElement();
    const container = ArrowDownIconElement.createContainer();
    container.appendChild(svgIcon);
    return container;
  }

  public static get() {
    return ArrowDownIconElement.ARROW_ICON_ELEMENT.cloneNode(true);
  }
}
