import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../../types/columnsSettings';
import {SVGIconUtils} from '../../../../utils/svgIcons/svgIconUtils';
import {IconSettings} from '../../../../types/dropdownButtonItem';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {CellTextElement} from '../text/cellTextElement';
import {SVGScale} from '../../../../types/svgScale';

export class HeaderIconCellElement {
  private static readonly TEXT_CLASS = 'header-icon-side-text';
  private static readonly ICON_CONTAINER_CLASS = 'header-icon-container';

  private static createTextElement(cellElement: HTMLElement, isHeaderTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isHeaderTextEditable);
    textElement.classList.add(HeaderIconCellElement.TEXT_CLASS);
    textElement.style.pointerEvents = isHeaderTextEditable ? '' : 'none';
    return textElement;
  }

  private static setScale(svgIconElement: SVGGraphicsElement, scale?: SVGScale) {
    const x = scale?.x || 1.2;
    const y = scale?.y || 1.2;
    svgIconElement.setAttribute('transform', `scale(${x}, ${y})`);
  }

  private static createSvgIcon(iconSettings: IconSettings, columnSettings: ColumnSettingsInternal) {
    const svgIconElement = SVGIconUtils.createSVGElement(iconSettings.svgString);
    HeaderIconCellElement.setScale(svgIconElement, columnSettings.headerIconStyle?.scale);
    svgIconElement.style.filter = columnSettings.headerIconStyle?.iconFilterColor || SVGIconUtils.LIGHT_GREY_FILTER;
    return svgIconElement;
  }

  private static createSVGContainer(iconSettings: IconSettings) {
    const container = document.createElement('div');
    const {containerStyles} = iconSettings;
    if (containerStyles?.dropdown) Object.assign(container.style, containerStyles?.dropdown);
    if (containerStyles?.headerCorrections) Object.assign(container.style, containerStyles?.headerCorrections);
    container.classList.add(HeaderIconCellElement.ICON_CONTAINER_CLASS);
    return container;
  }

  private static createSVG(iconSettings: IconSettings, columnSettings: ColumnSettingsInternal) {
    const svgContainer = HeaderIconCellElement.createSVGContainer(iconSettings);
    const svgIconElement = HeaderIconCellElement.createSvgIcon(iconSettings, columnSettings);
    svgContainer.appendChild(svgIconElement);
    return svgContainer;
  }

  public static changeHeaderIcon(columnDetails: ColumnDetailsT) {
    const {elements, activeType, settings} = columnDetails;
    const svgIconElement = HeaderIconCellElement.createSVG(activeType.dropdownItem.settings.iconSettings, settings);
    const headerElement = elements[0];
    headerElement.replaceChild(svgIconElement, headerElement.children[0] as SVGGraphicsElement);
  }

  public static setHeaderIconStructure(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    const {activeType, settings} = etc.columnsDetails[columnIndex];
    const svgIconElement = HeaderIconCellElement.createSVG(activeType.dropdownItem.settings.iconSettings, settings);
    const isHeaderTextEditable = settings.isHeaderTextEditable && !etc.columnDropdownDisplaySettings.openMethod?.cellClick;
    const textElement = HeaderIconCellElement.createTextElement(cellElement, isHeaderTextEditable);
    cellElement.insertBefore(svgIconElement, textElement);
  }
}
