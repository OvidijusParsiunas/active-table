import {NEXT_PAGE_ICON_SVG_STRING} from '../../../../../consts/icons/previousNextPageIconSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {NextPageButtonEvents} from './nextPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class NextPageButtonElement {
  private static populate(nextButtonElement: HTMLElement, text?: string) {
    if (text) {
      nextButtonElement.innerHTML = String(text);
    } else {
      const svgIconElement = SVGIconUtils.createSVGElement(NEXT_PAGE_ICON_SVG_STRING);
      svgIconElement.classList.add('pagination-prev-next-button');
      nextButtonElement.appendChild(svgIconElement);
    }
  }

  public static create(at: ActiveTable) {
    const {pageButtons} = at._pagination.styles;
    const nextButtonElement = PageButtonElement.create(pageButtons, true);
    NextPageButtonElement.populate(nextButtonElement, pageButtons.actionButtons.nextText);
    setTimeout(() => NextPageButtonEvents.setEvents(at, nextButtonElement));
    return nextButtonElement;
  }
}
