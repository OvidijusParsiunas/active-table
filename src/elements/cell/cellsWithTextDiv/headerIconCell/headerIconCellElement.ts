import {IconContainerStyles, IconSettings} from '../../../../types/dropdownButtonItem';
import {EditableTableComponent} from '../../../../editable-table-component';
import {SVGIconUtils} from '../../../../utils/svgIcons/svgIconUtils';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {CellTextElement} from '../text/cellTextElement';

export class HeaderIconCellElement {
  private static readonly TEXT_CLASS = 'header-icon-side-text';
  private static readonly ICON_CONTAINER_CLASS = 'header-icon-container';

  private static createTextElement(cellElement: HTMLElement, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(HeaderIconCellElement.TEXT_CLASS);
    return textElement;
  }

  private static createSvgIcon(svgString: string) {
    const svgIconElement = SVGIconUtils.createSVGElement(svgString);
    svgIconElement.setAttribute('transform', 'scale(1.1, 1.1)');
    svgIconElement.style.filter = SVGIconUtils.LIGHT_GREY_FILTER;
    return svgIconElement;
  }

  private static createSVGContainer(containerStyles?: IconContainerStyles) {
    const container = document.createElement('div');
    if (containerStyles?.dropdown) Object.assign(container.style, containerStyles.dropdown);
    if (containerStyles?.headerCorrections) Object.assign(container.style, containerStyles.headerCorrections);
    container.classList.add(HeaderIconCellElement.ICON_CONTAINER_CLASS);
    return container;
  }

  private static createSVG(iconSettings: IconSettings) {
    const svgContainer = HeaderIconCellElement.createSVGContainer(iconSettings.containerStyles);
    const svgIconElement = HeaderIconCellElement.createSvgIcon(iconSettings.svgString);
    svgContainer.appendChild(svgIconElement);
    return svgContainer;
  }

  public static changeHeaderIcon(columnDetails: ColumnDetailsT) {
    const {elements, activeType} = columnDetails;
    const svgIconElement = HeaderIconCellElement.createSVG(activeType.dropdownItem.settings.iconSettings);
    const headerElement = elements[0];
    headerElement.replaceChild(svgIconElement, headerElement.children[0] as SVGGraphicsElement);
  }

  public static setHeaderIconStructure(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    const {activeType, settings} = etc.columnsDetails[columnIndex];
    const svgIconElement = HeaderIconCellElement.createSVG(activeType.dropdownItem.settings.iconSettings);
    const textElement = HeaderIconCellElement.createTextElement(cellElement, settings.isCellTextEditable);
    cellElement.insertBefore(svgIconElement, textElement);
  }
}
