import {OuterDropdownItem} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsDropdownItemEvents} from './filterRowsDropdownItemEvents';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownItem {
  private static setActive(at: ActiveTable, dropdownElement: HTMLElement, config: FilterRowsInternalConfig) {
    const index = at._columnsDetails.findIndex((columnDetail) => columnDetail.elements === config.elements);
    OuterDropdownItem.setActiveByIndex(Array.from(dropdownElement.children) as HTMLElement[], index);
  }

  private static addItems(at: ActiveTable, dropdownElement: HTMLElement, config: FilterRowsInternalConfig) {
    const headers = at.content[0]?.map((headerText) => String(headerText));
    headers?.forEach((headerText) => {
      const itemsSettings = {text: headerText};
      const item = DropdownItem.addButtonItem(at, dropdownElement, itemsSettings);
      FilterRowsDropdownItemEvents.setEvents(at, item, config);
    });
  }

  public static populate(at: ActiveTable, dropdownElement: HTMLElement, config: FilterRowsInternalConfig) {
    dropdownElement.replaceChildren();
    FilterRowsDropdownItem.addItems(at, dropdownElement, config);
    FilterRowsDropdownItem.setActive(at, dropdownElement, config);
  }
}
