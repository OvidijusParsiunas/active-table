import {OuterDropdownItem} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {OuterContainerDropdownI} from '../../../../../types/outerContainerInternal';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsDropdownItemEvents} from './filterRowsDropdownItemEvents';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownItem {
  private static setActive(at: ActiveTable, dropdownElement: HTMLElement, config: FilterRowsInternalConfig) {
    const index = at._columnsDetails.findIndex((columnDetail) => columnDetail.elements === config.elements);
    OuterDropdownItem.setActiveByIndex(Array.from(dropdownElement.children) as HTMLElement[], index);
  }

  private static addItems(at: ActiveTable, dropdown: OuterContainerDropdownI, config: FilterRowsInternalConfig) {
    const headers = at.content[0]?.map((headerText) => String(headerText));
    headers?.forEach((headerText) => {
      const itemsSettings = {text: headerText};
      const item = DropdownItem.addButtonItem(at, dropdown.element, itemsSettings);
      FilterRowsDropdownItemEvents.setEvents(at, item, config, dropdown.activeButtonStyle);
    });
  }

  public static populate(at: ActiveTable, dropdown: OuterContainerDropdownI, config: FilterRowsInternalConfig) {
    dropdown.element.replaceChildren();
    FilterRowsDropdownItem.addItems(at, dropdown, config);
    FilterRowsDropdownItem.setActive(at, dropdown.element, config);
  }
}
