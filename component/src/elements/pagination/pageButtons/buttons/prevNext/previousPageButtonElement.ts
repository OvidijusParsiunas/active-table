import {PREVIOUS_PAGE_ICON_SVG_STRING} from '../../../../../consts/icons/previousNextPageIconSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {PreviousPageButtonEvents} from './previousPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class PreviousPageButtonElement {
  private static populate(previousButtonElement: HTMLElement, text?: string) {
    if (text) {
      previousButtonElement.innerHTML = String(text);
    } else {
      const svgIconElement = SVGIconUtils.createSVGElement(PREVIOUS_PAGE_ICON_SVG_STRING);
      svgIconElement.classList.add('pagination-prev-next-button');
      previousButtonElement.appendChild(svgIconElement);
    }
  }

  public static create(at: ActiveTable) {
    const {pageButtons} = at._pagination.styles;
    const previousButtonElement = PageButtonElement.create(pageButtons, true);
    PreviousPageButtonElement.populate(previousButtonElement, pageButtons.actionButtons.previousText);
    setTimeout(() => PreviousPageButtonEvents.setEvents(at, previousButtonElement));
    return previousButtonElement;
  }
}
