import {ColumnTypeDropdownItemEvents} from './columnTypeDropdownItemEvents';
import {SVGIconUtils} from '../../../utils/svgIcons/svgIconUtils';
import {CellElement} from '../../cell/cellElement';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdownItem {
  private static unsetActiveItem(dropdownElement: HTMLElement) {
    const activeItem = dropdownElement.getElementsByClassName(DropdownItem.ACTIVE_ITEM_CLASS)[0] as HTMLElement;
    if (activeItem) {
      (activeItem.children[0] as HTMLElement).style.filter = '';
      activeItem.classList.remove(DropdownItem.ACTIVE_ITEM_CLASS);
    }
  }

  public static reset(dropdownElement: HTMLElement) {
    ColumnTypeDropdownItem.unsetActiveItem(dropdownElement);
    DropdownItem.removeItems(dropdownElement);
  }

  private static setActiveItem(items: HTMLElement[], targetItemText: string) {
    const activeItem = items.find((item) => CellElement.getText(item) === targetItemText);
    if (activeItem) {
      activeItem.classList.add(DropdownItem.ACTIVE_ITEM_CLASS);
      (activeItem.children[0] as HTMLElement).style.filter = SVGIconUtils.WHITE_FILTER;
    }
  }

  // the items are repopulated every time column dropdown is opened
  public static setUp(at: ActiveTable, columnIndex: number) {
    const {columnTypeDropdown} = at._activeOverlayElements;
    const columnDetails = at._columnsDetails[columnIndex];
    const elements = columnDetails.settings.types.map((type) => type.dropdownItem.element) as HTMLElement[];
    DropdownItem.addButtonItemElements(at, columnTypeDropdown as HTMLElement, elements);
    ColumnTypeDropdownItemEvents.set(at, elements, columnIndex);
    ColumnTypeDropdownItem.setActiveItem(elements, columnDetails.activeType.name);
  }
}
