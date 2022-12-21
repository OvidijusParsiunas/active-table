import {TEXT_ICON_SVG_STRING} from '../../../../consts/icons/textIconSVGString';
import {SVGIconUtils} from '../../../../utils/svgIcons/svgIconUtils';
import {CellTextElement} from '../text/cellTextElement';

export class HeaderIconCellElement {
  private static readonly TEXT_CLASS = 'header-icon-side-text';
  private static readonly ICON_CONTAINER_CLASS = 'header-icon-container';

  private static createTextElement(cellElement: HTMLElement) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, false);
    textElement.classList.add(HeaderIconCellElement.TEXT_CLASS);
    return textElement;
  }

  private static createSvgIcon() {
    const svgIconElement = SVGIconUtils.createSVGElement(TEXT_ICON_SVG_STRING);
    svgIconElement.setAttribute('transform', 'scale(1.1, 1.1)');
    svgIconElement.style.filter = SVGIconUtils.LIGHT_GREY_FILTER;
    return svgIconElement;
  }

  private static createSVGContainer() {
    const container = document.createElement('div');
    // need to allow custom css
    container.style.marginLeft = '1px';
    container.style.marginRight = '7px';
    container.style.marginTop = '2.5px';
    container.classList.add(HeaderIconCellElement.ICON_CONTAINER_CLASS);
    return container;
  }

  private static createSVG() {
    const svgContainer = HeaderIconCellElement.createSVGContainer();
    const svgIconElement = HeaderIconCellElement.createSvgIcon();
    svgContainer.appendChild(svgIconElement);
    return svgContainer;
  }

  public static setHeaderIconStructure(cellElement: HTMLElement) {
    const svgIconElement = HeaderIconCellElement.createSVG();
    const textElement = HeaderIconCellElement.createTextElement(cellElement);
    cellElement.insertBefore(svgIconElement, textElement);
  }
}
