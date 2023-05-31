import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {ToggleableElement} from '../../../../utils/elements/toggleableElement';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {ActiveTable} from '../../../../activeTable';
import {CSSStyle} from '../../../../types/cssStyle';

export class FilterRowsInputCaseEvents {
  private static clickButton(this: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig, active?: CSSStyle) {
    const activeStyle = active || {};
    const wasActive = ToggleableElement.toggleActive(button, {...activeStyle, color: '#001C87'});
    config.isCaseSensitive = !wasActive;
    FilterRowsInternalUtils.resetInput(this, config);
    config.inputElement.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, button: HTMLElement, config: FilterRowsInternalConfig, activeStyle?: CSSStyle) {
    button.onclick = FilterRowsInputCaseEvents.clickButton.bind(at, button, config, activeStyle);
  }
}
