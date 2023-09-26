import {OuterDropdownSimpleUtils} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownSimpleUtils';
import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {StaticDropdown} from '../../../../../utils/outerTableComponents/dropdown/staticDropdown';
import {FileExportDropdownItem} from './fileExportDropdownItem';
import {ActiveTable} from '../../../../../activeTable';
import {FileFormat} from '../../../../../types/files';

export class FileExportDropdown {
  public static create(at: ActiveTable, optionsButton: HTMLElement, formats: FileFormat[]) {
    const hideFunc = OuterDropdownSimpleUtils.hide.bind(this, at._activeOverlayElements);
    const displayFunc = OuterDropdownSimpleUtils.display.bind(this, optionsButton);
    // position is arbitrary as long as orientation isn't changed
    const dropdown = OuterDropdownElement.create(at, optionsButton, 'bottom-right', {}, [], hideFunc, displayFunc);
    dropdown.element.classList.add(StaticDropdown.DROPDOWN_CLASS);
    FileExportDropdownItem.populate(at, dropdown.element, formats);
    return dropdown;
  }
}
