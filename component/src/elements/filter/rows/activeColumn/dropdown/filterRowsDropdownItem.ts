import {OuterDropdownItem} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {FilterRowsDropdownItemEvents} from './filterRowsDropdownItemEvents';
import {FilterRowsInternal} from '../../../../../types/filterInternal';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownItem {
  public static populate(at: ActiveTable, dropdownElement: HTMLElement) {
    const rows = at._filterInternal.rows as FilterRowsInternal;
    const headers = at.content[0]?.map((headerText) => String(headerText));
    headers?.forEach((headerText) => {
      const itemsSettings = {text: headerText};
      const item = DropdownItem.addButtonItem(at, dropdownElement, itemsSettings);
      FilterRowsDropdownItemEvents.setEvents(at, item);
    });
    OuterDropdownItem.setActive(Array.from(dropdownElement.children) as HTMLElement[], rows.activeColumnName);
  }
}
