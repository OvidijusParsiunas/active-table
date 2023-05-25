import {OuterDropdownButtonElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsInputEvents} from '../input/filterRowsInputEvents';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseEvents {
  private static clickButton(this: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig) {
    const wasActive = OuterDropdownButtonElement.toggleIcon(button);
    config.isCaseSensitive = !wasActive;
    FilterRowsInputEvents.setEvents(this, config);
    config.inputElement.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(at, button, config);
  }
}
