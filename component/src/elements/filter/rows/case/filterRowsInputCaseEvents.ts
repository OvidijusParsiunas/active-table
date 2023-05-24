import {OuterDropdownButtonElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {FilterRowsInputEvents} from '../input/filterRowsInputEvents';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseEvents {
  private static clickButton(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    const wasActive = OuterDropdownButtonElement.toggleIcon(button);
    FilterRowsInputEvents.setEvents(at, input, colIndex, !wasActive);
    input.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, input: HTMLInputElement, button: HTMLElement, colIndex: number) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(this, at, input, button, colIndex);
  }
}
