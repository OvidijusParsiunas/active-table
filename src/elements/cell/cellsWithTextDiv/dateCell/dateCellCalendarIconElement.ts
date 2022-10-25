import {CALENDAR_ICON_SVG_STRING} from './calendarIconSVGString';

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

  private static createSVGElement() {
    const parser = new DOMParser();
    // REF-10
    const doc = parser.parseFromString(CALENDAR_ICON_SVG_STRING, 'image/svg+xml');
    const svgIcon = doc.documentElement;
    // styles are set here as the class does not take effect on svg
    svgIcon.style.pointerEvents = 'none';
    svgIcon.style.height = '25px';
    return svgIcon;
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
