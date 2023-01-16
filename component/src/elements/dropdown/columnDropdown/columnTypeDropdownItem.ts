import {ColumnTypeDropdownItemEvents} from './columnTypeDropdownItemEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {SVGIconUtils} from '../../../utils/svgIcons/svgIconUtils';
import {CellElement} from '../../cell/cellElement';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdownItem {
  private static unsetActiveItem(dropdownElement: HTMLElement) {
    const activeItem = dropdownElement.getElementsByClassName(DropdownItem.ACTIVE_ITEM_CLASS)[0] as HTMLElement;
    (activeItem.children[0] as HTMLElement).style.filter = '';
    activeItem.classList.remove(DropdownItem.ACTIVE_ITEM_CLASS);
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
  public static setUp(etc: EditableTableComponent, columnIndex: number) {
    const {columnTypeDropdown} = etc.activeOverlayElements;
    const elements = etc.columnsDetails[columnIndex].types.map((type) => type.dropdownItem.element) as HTMLElement[];
    DropdownItem.addButtonItemElements(etc, columnTypeDropdown as HTMLElement, elements);
    ColumnTypeDropdownItemEvents.set(etc, elements, columnIndex);
    ColumnTypeDropdownItem.setActiveItem(elements, etc.columnsDetails[columnIndex].activeType.name);
  }
}
