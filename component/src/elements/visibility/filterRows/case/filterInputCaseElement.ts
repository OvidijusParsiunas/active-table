import {FilterInternal} from '../../../../types/visibilityInternal';
import {FilterInputCaseEvents} from './filterInputCaseEvents';
import {StatefulCSS} from '../../../../types/cssStyle';
import {FilterStyles} from '../../../../types/filter';
import {ActiveTable} from '../../../../activeTable';
import {FilterElements} from '../filterElements';

export class FilterInputCaseElement {
  private static createButton(styles: StatefulCSS = {}) {
    const caseButton = document.createElement('div');
    caseButton.classList.add('filter-rows-case-button');
    caseButton.textContent = 'Aa';
    FilterElements.applyStatefulStyles(caseButton, {color: '#626262'}, styles);
    return caseButton;
  }

  public static create(at: ActiveTable, container: HTMLElement, config: FilterInternal, styles?: FilterStyles) {
    const buttonElement = FilterInputCaseElement.createButton(styles?.caseButton);
    container.appendChild(buttonElement);
    setTimeout(() => FilterInputCaseEvents.setEvents(at, buttonElement, config, styles?.caseButton?.active));
  }
}
