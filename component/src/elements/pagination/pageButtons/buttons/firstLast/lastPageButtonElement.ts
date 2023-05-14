import {LAST_PAGE_ICON_SVG_STRING} from '../../../../../consts/icons/firstLastPageIconSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {LastPageButtonEvents} from './lastPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class LastPageButtonElement {
  private static populate(lastButtonElement: HTMLElement, text?: string) {
    if (text) {
      lastButtonElement.innerHTML = String(text);
    } else {
      const svgIconElement = SVGIconUtils.createSVGElement(LAST_PAGE_ICON_SVG_STRING);
      svgIconElement.classList.add('pagination-first-last-button');
      lastButtonElement.appendChild(svgIconElement);
    }
  }

  public static create(at: ActiveTable) {
    const {pageButtons} = at._pagination.styles;
    const lastButtonElement = PageButtonElement.create(pageButtons, true);
    LastPageButtonElement.populate(lastButtonElement, pageButtons.actionButtons.lastText);
    setTimeout(() => LastPageButtonEvents.setEvents(at, lastButtonElement));
    return lastButtonElement;
  }
}
