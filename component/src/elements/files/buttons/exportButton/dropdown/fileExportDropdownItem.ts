import {StaticDropdown} from '../../../../../utils/outerTableComponents/dropdown/staticDropdown';
import {FileExportDropdownItemEvents} from './fileExportDropdownItemEvents';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';
import {FileFormat} from '../../../../../types/files';

export class FileExportDropdownItem {
  private static readonly ITEM_CLASS = 'export-formats-dropdown-item';

  // prettier-ignore
  public static populate(at: ActiveTable, dropdownElement: HTMLElement, formats: FileFormat[]) {
    formats.forEach((itemText) => {
      const itemsSettings = {text: itemText.toUpperCase()};
      const item = DropdownItem.addButtonItem(at, dropdownElement, itemsSettings,
        FileExportDropdownItem.ITEM_CLASS, StaticDropdown.ITEM_CLASS);
      FileExportDropdownItemEvents.setEvents(at, item);
    });
  }
}
