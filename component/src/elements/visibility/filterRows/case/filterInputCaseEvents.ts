import {FilterInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterInternalUtils';
import {ToggleableElement} from '../../../../utils/elements/toggleableElement';
import {FilterInternal} from '../../../../types/visibilityInternal';
import {ActiveTable} from '../../../../activeTable';
import {CSSStyle} from '../../../../types/cssStyle';

export class FilterInputCaseEvents {
  private static clickButton(this: ActiveTable, button: HTMLElement, config: FilterInternal, active?: CSSStyle) {
    const activeStyle = active || {};
    const wasActive = ToggleableElement.toggleActive(button, {...activeStyle, color: '#000000'});
    config.isCaseSensitive = !wasActive;
    FilterInternalUtils.resetInput(this, config);
    config.inputElement.dispatchEvent(new Event('input'));
  }

  public static setEvents(at: ActiveTable, button: HTMLElement, config: FilterInternal, activeStyle?: CSSStyle) {
    button.onclick = FilterInputCaseEvents.clickButton.bind(at, button, config, activeStyle);
  }
}
