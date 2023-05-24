import {OuterDropdownItem} from '../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {RowsPerPageDropdownItemEvents} from './rowsPerPageDropdownItemEvents';
import {DropdownItem} from '../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageDropdownItem {
  private static readonly ITEM_CLASS = 'number-of-rows-dropdown-item';
  public static readonly ALL_ITEM_TEXT = 'all'; // lower case as it will be compared against user set text

  public static populate(at: ActiveTable, dropdownElement: HTMLElement, optionsButton: HTMLElement) {
    at._pagination.rowsPerPageOptionsItemText.forEach((itemText) => {
      const itemsSettings = {text: String(itemText)};
      const item = DropdownItem.addButtonItem(at, dropdownElement, itemsSettings, RowsPerPageDropdownItem.ITEM_CLASS);
      RowsPerPageDropdownItemEvents.setEvents(at, item, optionsButton);
    });
    const activeItemText = String(at._pagination.rowsPerPage);
    OuterDropdownItem.setActive(Array.from(dropdownElement.children) as HTMLElement[], activeItemText);
  }
}
