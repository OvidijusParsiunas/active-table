import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsInputCaseEvents} from './filterRowsInputCaseEvents';
import {FilterRowsStyles} from '../../../../types/filterRows';
import {FilterRowsElements} from '../filterRowsElements';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseElement {
  private static createButton(styles: StatefulCSS = {}) {
    const caseButton = document.createElement('div');
    caseButton.classList.add('filter-rows-case-button');
    caseButton.textContent = 'Aa';
    FilterRowsElements.applyStatefulStyles(caseButton, {color: '#010101'}, styles);
    return caseButton;
  }

  // prettier-ignore
  public static create(at: ActiveTable,
      containerElement: HTMLElement, config: FilterRowsInternalConfig, styles?: FilterRowsStyles) {
    const buttonElement = FilterRowsInputCaseElement.createButton(styles?.caseButton);
    containerElement.appendChild(buttonElement);
    setTimeout(() => FilterRowsInputCaseEvents.setEvents(at, buttonElement, config, styles?.caseButton?.active));
  }
}
