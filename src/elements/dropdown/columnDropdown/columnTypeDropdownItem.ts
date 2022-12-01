import {DisplayedCellTypeName} from '../../../utils/cellType/displayedCellTypeName';
import {ColumnTypeDropdownItemEvents} from './columnTypeDropdownItemEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {CellElement} from '../../cell/cellElement';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdownItem {
  private static readonly ACTIVE_ITEM_CLASS = 'active-dropdown-item';

  private static getActiveItem(dropdownElement: HTMLElement) {
    return dropdownElement.getElementsByClassName(ColumnTypeDropdownItem.ACTIVE_ITEM_CLASS)[0];
  }

  private static unsetActiveUserChosenColumnType(dropdownElement: HTMLElement) {
    const activeItem = ColumnTypeDropdownItem.getActiveItem(dropdownElement);
    if (activeItem) activeItem.classList.remove(ColumnTypeDropdownItem.ACTIVE_ITEM_CLASS);
  }

  public static reset(dropdownElement: HTMLElement) {
    DropdownItem.resetNestedDropdownItemStyle(dropdownElement);
    ColumnTypeDropdownItem.unsetActiveUserChosenColumnType(dropdownElement);
  }

  private static setActiveItem(items: HTMLElement[], targetItemText: string) {
    items.forEach((item) => {
      if (CellElement.getText(item) == targetItemText) {
        // TO-DO - perhaps instead of highlighting - use a tick mark
        item.classList.add(ColumnTypeDropdownItem.ACTIVE_ITEM_CLASS);
      }
    });
  }

  private static setActiveUserChosenColumnType(items: HTMLElement[], columnDetails: ColumnDetailsT) {
    const userChosenColumnTypeString = DisplayedCellTypeName.get(columnDetails.userSetColumnType);
    ColumnTypeDropdownItem.setActiveItem(items, userChosenColumnTypeString);
  }

  public static setUp(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const columnTypeItems = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnTypeDropdownItemEvents.set(etc, columnTypeItems, columnIndex);
    setTimeout(() => {
      ColumnTypeDropdownItem.setActiveUserChosenColumnType(columnTypeItems, etc.columnsDetails[columnIndex]);
    });
  }

  public static addItems(etc: EditableTableComponent, dropdownElement: HTMLElement, parentButtonClassName: string) {
    const itemsText = Object.keys(USER_SET_COLUMN_TYPE).map((key) => DisplayedCellTypeName.get(key));
    return DropdownItem.addNestedDropdownItem(etc, dropdownElement, '', itemsText, parentButtonClassName);
  }
}
