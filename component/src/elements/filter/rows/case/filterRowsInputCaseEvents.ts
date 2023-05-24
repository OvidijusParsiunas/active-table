import {OuterDropdownButtonElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {FilterRowsInputEvents} from '../input/filterRowsInputEvents';
import {FilterRowsInternal} from '../../../../types/filterInternal';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseEvents {
  private static clickButton(at: ActiveTable, input: HTMLInputElement, button: HTMLElement) {
    const rows = at._filterInternal.rows as FilterRowsInternal;
    const wasActive = OuterDropdownButtonElement.toggleIcon(button);
    rows.isCaseSensitive = !wasActive;
    FilterRowsInputEvents.setEvents(at);
    input.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(this, at, input, button, colIndex);
  }
}
