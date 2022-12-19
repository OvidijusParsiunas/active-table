import {CALENDAR_ICON_SVG_STRING} from '../../../../consts/icons/calendarIconSVGString';
import {SVGIconUtils} from '../../../../utils/svgIcons/svgIconUtils';

export class DateCellCalendarIconElement {
  public static readonly CALENDAR_ICON_CONTAINER_CLASS = 'calender-icon-container';
  private static readonly CALENDAR_ICON_ELEMENT = DateCellCalendarIconElement.createSVG();

  // need a container as mousedown target kept being different parts of svg
  // hence svgIcon has no pointer events
  private static createContainer() {
    const container = document.createElement('div');
    container.classList.add(DateCellCalendarIconElement.CALENDAR_ICON_CONTAINER_CLASS);
    return container;
  }

  // REF-10
  private static createSVGElement() {
    const svgIconElement = SVGIconUtils.createSVGElement(CALENDAR_ICON_SVG_STRING);
    // using style as the class has no effect on svg
    svgIconElement.style.pointerEvents = 'none';
    svgIconElement.style.height = '25px';
    return svgIconElement;
  }

  private static createSVG() {
    const svgIcon = DateCellCalendarIconElement.createSVGElement();
    const container = DateCellCalendarIconElement.createContainer();
    container.appendChild(svgIcon);
    return container;
  }

  public static get() {
    return DateCellCalendarIconElement.CALENDAR_ICON_ELEMENT.cloneNode(true);
  }
}
