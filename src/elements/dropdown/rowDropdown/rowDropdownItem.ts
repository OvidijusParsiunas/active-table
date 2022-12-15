import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximumRows';
import {EditableTableComponent} from '../../../editable-table-component';
import {DropdownItem} from '../dropdownItem';

export class RowDropdownItem {
  public static updateItemsStyle(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    const canAddMoreColumns = MaximumRows.canAddMore(etc);
    if (canAddMoreColumns) {
      items[0].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
      items[1].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
    } else {
      items[0].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
      items[1].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
    }
  }
}
