import {FilterInputEvents} from './filterInputEvents';
import {ActiveTable} from '../../activeTable';

export class FilterInputCaseEvents {
  private static readonly ACTIVE_CLASS = 'row-filter-case-button-active';

  private static clickButton(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    const isCaseSensitive = !!button.classList.contains(FilterInputCaseEvents.ACTIVE_CLASS);
    if (isCaseSensitive) {
      button.classList.remove(FilterInputCaseEvents.ACTIVE_CLASS);
    } else {
      button.classList.add(FilterInputCaseEvents.ACTIVE_CLASS);
    }
    FilterInputEvents.setEvents(at, input, colIndex, !isCaseSensitive);
    input.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    button.onclick = FilterInputCaseEvents.clickButton.bind(this, at, input, button, colIndex);
  }
}
