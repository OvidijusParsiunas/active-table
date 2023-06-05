import {OuterDropdownItemEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItemEvents';
import {FilterInternalUtils} from '../../../../../utils/outerTableComponents/filter/rows/filterInternalUtils';
import {FilterInternal} from '../../../../../types/visibilityInternal';
import {FilterDropdownElement} from './filterDropdownElement';
import {ActiveTable} from '../../../../../activeTable';
import {CSSStyle} from '../../../../../types/cssStyle';

export class FilterDropdownItemEvents {
  private static resetInput(config: FilterInternal, at: ActiveTable, _: string, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // if clicked on text or item
    const columnIndex =
      targetElement.tabIndex === -1 ? (targetElement.parentElement as HTMLElement).tabIndex : targetElement.tabIndex;
    const colElements = at._columnsDetails[columnIndex].elements;
    if (colElements !== config.elements) {
      config.elements = colElements;
      FilterInternalUtils.resetInput(at, config);
      FilterInternalUtils.unsetFilter(config.inputElement);
    }
  }

  public static setEvents(at: ActiveTable, item: HTMLElement, config: FilterInternal, activeStyle: CSSStyle) {
    const actionFunc = FilterDropdownItemEvents.resetInput.bind(this, config);
    const hideFunc = FilterDropdownElement.hide.bind(this, activeStyle);
    item.onmousedown = OuterDropdownItemEvents.itemMouseDownCommon.bind(at, actionFunc, hideFunc);
  }
}
