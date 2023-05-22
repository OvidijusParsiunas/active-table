import {FilterRowsInputEvents} from '../input/filterRowsInputEvents';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseEvents {
  private static readonly ACTIVE_CLASS = 'filter-rows-case-button-active';

  private static clickButton(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    const isCaseSensitive = !!button.classList.contains(FilterRowsInputCaseEvents.ACTIVE_CLASS);
    if (isCaseSensitive) {
      button.classList.remove(FilterRowsInputCaseEvents.ACTIVE_CLASS);
    } else {
      button.classList.add(FilterRowsInputCaseEvents.ACTIVE_CLASS);
    }
    FilterRowsInputEvents.setEvents(at, input, colIndex, !isCaseSensitive);
    input.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(this, at, input, button, colIndex);
  }
}
