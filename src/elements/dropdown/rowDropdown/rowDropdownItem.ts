import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximumRows';
import {EditableTableComponent} from '../../../editable-table-component';
import {RowDropdownSettings} from '../../../types/rowDropdownSettings';
import {RowDropdownItemEvents} from './rowDropdownItemEvents';
import {DropdownItem} from '../dropdownItem';

export class RowDropdownItem {
  private static updateDeleteRowItemStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    if (rowIndex === 0 && !etc.rowDropdownSettings.isHeaderRowEditable) {
      items[4].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
    } else {
      items[4].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
    }
  }

  private static updateMoveRowsItemsStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    const {isMoveAvailable, isHeaderRowEditable} = etc.rowDropdownSettings;
    if (!isMoveAvailable) return;
    items[2].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
    items[3].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
    if (rowIndex === 0 || (rowIndex === 1 && !isHeaderRowEditable)) {
      items[2].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
    }
    if (rowIndex === etc.columnsDetails[0].elements.length - 1 || (rowIndex === 0 && !isHeaderRowEditable)) {
      items[3].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
    }
  }

  private static updateInsertRowsItemsStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    if (MaximumRows.canAddMore(etc)) {
      if (rowIndex === 0 && !etc.rowDropdownSettings.isHeaderRowEditable) {
        items[0].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
      } else {
        items[0].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
      }
      items[1].classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
    } else {
      items[0].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
      items[1].classList.add(DropdownItem.DISABLED_ITEM_CLASS);
    }
  }

  private static updateItemStyle(etc: EditableTableComponent, dropdownElement: HTMLElement, rowIndex: number) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    RowDropdownItem.updateInsertRowsItemsStyle(etc, rowIndex, items);
    RowDropdownItem.updateMoveRowsItemsStyle(etc, rowIndex, items);
    RowDropdownItem.updateDeleteRowItemStyle(etc, rowIndex, items);
  }

  public static update(etc: EditableTableComponent, dropdownElement: HTMLElement, rowIndex: number) {
    RowDropdownItem.updateItemStyle(etc, dropdownElement, rowIndex);
    RowDropdownItemEvents.set(etc, dropdownElement, rowIndex);
  }

  public static setUpItems(settings: RowDropdownSettings, dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    const {isInsertUpAvailable, isInsertDownAvailable, isMoveAvailable, isDeleteAvailable} = settings;
    if (!isInsertUpAvailable) DropdownItem.toggleItem(items[0], false);
    if (!isInsertDownAvailable) DropdownItem.toggleItem(items[1], false);
    if (!isMoveAvailable) {
      DropdownItem.toggleItem(items[2], false);
      DropdownItem.toggleItem(items[3], false);
    }
    if (!isDeleteAvailable) DropdownItem.toggleItem(items[4], false);
  }
}
