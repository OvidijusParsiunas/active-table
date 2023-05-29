import {OuterDropdownButtonElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonElement';
import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseEvents {
  private static clickButton(this: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig) {
    const wasActive = OuterDropdownButtonElement.toggleIcon(button);
    config.isCaseSensitive = !wasActive;
    FilterRowsInternalUtils.resetInput(this, config);
    config.inputElement.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(at, button, config);
  }
}
