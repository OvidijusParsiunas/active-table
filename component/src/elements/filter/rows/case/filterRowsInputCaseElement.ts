import {OuterDropdownButtonElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {StatefulCSSEvents} from '../../../../utils/elements/statefulCSSEvents';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsInputCaseEvents} from './filterRowsInputCaseEvents';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {FilterRowsStyles} from '../../../../types/filterRows';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseElement {
  // prettier-ignore
  private static createButton(styles: StatefulCSS = {}) {
    const caseButton = document.createElement('div');
    caseButton.classList.add('filter-rows-case-button');
    caseButton.textContent = 'Aa';
    const statefulStyles = ElementStyle.generateStatefulCSS(styles, {color: '#010101'}, {color: '#001C87'});
    Object.assign(caseButton.style, statefulStyles.default);
    setTimeout(() => StatefulCSSEvents.setEvents(
      caseButton, statefulStyles, OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS));
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
