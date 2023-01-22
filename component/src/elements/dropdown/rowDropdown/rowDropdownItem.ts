import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximum/maximumRows';
import {RowDropdownButtonItemConf} from './rowDropdownButtonItemConf';
import {RowDropdownItemEvents} from './rowDropdownItemEvents';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';

export class RowDropdownItem {
  private static updateDeleteRowItemStyle(at: ActiveTable, rowIndex: number, items: HTMLElement[]) {
    DropdownItem.toggleUsability(items[4], Boolean(rowIndex > 0 || at.rowDropdown.canEditHeaderRow));
  }

  private static updateMoveRowsItemsStyle(at: ActiveTable, rowIndex: number, items: HTMLElement[]) {
    const {isMoveAvailable, canEditHeaderRow} = at.rowDropdown;
    if (!isMoveAvailable) return;
    DropdownItem.toggleUsability(items[2], true);
    DropdownItem.toggleUsability(items[3], true);
    if (rowIndex === 0 || (rowIndex === 1 && !canEditHeaderRow)) {
      DropdownItem.toggleUsability(items[2], false);
    }
    if (rowIndex === at.columnsDetails[0].elements.length - 1 || (rowIndex === 0 && !canEditHeaderRow)) {
      DropdownItem.toggleUsability(items[3], false);
    }
  }

  private static updateInsertRowsItemsStyle(at: ActiveTable, rowIndex: number, items: HTMLElement[]) {
    if (MaximumRows.canAddMore(at)) {
      if (rowIndex === 0 && !at.rowDropdown.canEditHeaderRow) {
        DropdownItem.toggleUsability(items[0], false);
      } else {
        DropdownItem.toggleUsability(items[0], true);
      }
      DropdownItem.toggleUsability(items[1], true);
    } else {
      DropdownItem.toggleUsability(items[0], false);
      DropdownItem.toggleUsability(items[1], false);
    }
  }

  private static updateItemStyle(at: ActiveTable, dropdownElement: HTMLElement, rowIndex: number) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    RowDropdownItem.updateInsertRowsItemsStyle(at, rowIndex, items);
    RowDropdownItem.updateMoveRowsItemsStyle(at, rowIndex, items);
    RowDropdownItem.updateDeleteRowItemStyle(at, rowIndex, items);
  }

  public static update(at: ActiveTable, dropdownElement: HTMLElement, rowIndex: number) {
    RowDropdownItem.updateItemStyle(at, dropdownElement, rowIndex);
    RowDropdownItemEvents.set(at, dropdownElement, rowIndex);
  }

  public static setUpItems(at: ActiveTable, dropdownElement: HTMLElement) {
    // creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      const {rowDropdown} = at;
      const {isInsertUpAvailable, isInsertDownAvailable, isMoveAvailable, isDeleteAvailable} = rowDropdown;
      const items = RowDropdownButtonItemConf.ITEMS.map((item) => DropdownItem.addButtonItem(at, dropdownElement, item));
      if (!isInsertUpAvailable) DropdownItem.toggleItem(items[0], false);
      if (!isInsertDownAvailable) DropdownItem.toggleItem(items[1], false);
      if (!isMoveAvailable) {
        DropdownItem.toggleItem(items[2], false);
        DropdownItem.toggleItem(items[3], false);
      }
      if (!isDeleteAvailable) DropdownItem.toggleItem(items[4], false);
    });
  }
}
