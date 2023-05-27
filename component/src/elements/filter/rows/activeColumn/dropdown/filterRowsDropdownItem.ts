import {OuterDropdownItem} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsDropdownItemEvents} from './filterRowsDropdownItemEvents';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownItem {
  public static populate(at: ActiveTable, dropdownElement: HTMLElement, config: FilterRowsInternalConfig) {
    dropdownElement.replaceChildren();
    const headers = at.content[0]?.map((headerText) => String(headerText));
    headers?.forEach((headerText) => {
      const itemsSettings = {text: headerText};
      const item = DropdownItem.addButtonItem(at, dropdownElement, itemsSettings);
      FilterRowsDropdownItemEvents.setEvents(at, item, config);
    });
    OuterDropdownItem.setActive(Array.from(dropdownElement.children) as HTMLElement[], config.activeHeaderName);
  }
}
