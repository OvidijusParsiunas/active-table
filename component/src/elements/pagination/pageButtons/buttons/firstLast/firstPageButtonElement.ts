import {FIRST_PAGE_ICON_SVG_STRING} from '../../../../../consts/icons/firstLastPageIconSVGString';
import {SVGIconUtils} from '../../../../../utils/svgIcons/svgIconUtils';
import {FirstPageButtonEvents} from './firstPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class FirstPageButtonElement {
  private static populate(firstButtonElement: HTMLElement, text?: string) {
    if (text) {
      firstButtonElement.innerHTML = String(text);
    } else {
      const svgIconElement = SVGIconUtils.createSVGElement(FIRST_PAGE_ICON_SVG_STRING);
      svgIconElement.classList.add('pagination-first-last-button');
      firstButtonElement.appendChild(svgIconElement);
    }
  }

  public static create(at: ActiveTable) {
    const {pageButtons} = at._pagination.styles;
    const firstButtonElement = PageButtonElement.create(pageButtons, true);
    FirstPageButtonElement.populate(firstButtonElement, pageButtons.actionButtons.firstText);
    setTimeout(() => FirstPageButtonEvents.setEvents(at, firstButtonElement));
    return firstButtonElement;
  }
}
