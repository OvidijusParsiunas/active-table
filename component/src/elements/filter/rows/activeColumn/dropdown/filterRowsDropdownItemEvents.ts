import {FilterRowsInternalUtils} from '../../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {OuterDropdownItemEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItemEvents';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsDropdownElement} from './filterRowsDropdownElement';
import {ActiveTable} from '../../../../../activeTable';
import {CSSStyle} from '../../../../../types/cssStyle';

export class FilterRowsDropdownItemEvents {
  private static resetInput(config: FilterRowsInternalConfig, at: ActiveTable, _: string, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // if clicked on text or item
    const columnIndex =
      targetElement.tabIndex === -1 ? (targetElement.parentElement as HTMLElement).tabIndex : targetElement.tabIndex;
    const colElements = at._columnsDetails[columnIndex].elements;
    if (colElements !== config.elements) {
      config.elements = colElements;
      FilterRowsInternalUtils.resetInput(at, config);
      FilterRowsInternalUtils.unsetFilter(config.inputElement);
    }
  }

  public static setEvents(at: ActiveTable, item: HTMLElement, config: FilterRowsInternalConfig, activeStyle: CSSStyle) {
    const actionFunc = FilterRowsDropdownItemEvents.resetInput.bind(this, config);
    const hideFunc = FilterRowsDropdownElement.hide.bind(this, activeStyle);
    item.onmousedown = OuterDropdownItemEvents.itemMouseDownCommon.bind(at, actionFunc, hideFunc);
  }
}
