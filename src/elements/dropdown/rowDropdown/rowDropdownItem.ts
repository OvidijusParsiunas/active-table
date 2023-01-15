import {MaximumRows} from '../../../utils/insertRemoveStructure/insert/maximum/maximumRows';
import {EditableTableComponent} from '../../../editable-table-component';
import {RowDropdownButtonItemConf} from './rowDropdownButtonItemConf';
import {RowDropdownItemEvents} from './rowDropdownItemEvents';
import {DropdownItem} from '../dropdownItem';

export class RowDropdownItem {
  private static updateDeleteRowItemStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    DropdownItem.toggleUsability(items[4], Boolean(rowIndex > 0 || etc.rowDropdownSettings.isHeaderRowEditable));
  }

  private static updateMoveRowsItemsStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    const {isMoveAvailable, isHeaderRowEditable} = etc.rowDropdownSettings;
    if (!isMoveAvailable) return;
    DropdownItem.toggleUsability(items[2], true);
    DropdownItem.toggleUsability(items[3], true);
    if (rowIndex === 0 || (rowIndex === 1 && !isHeaderRowEditable)) {
      DropdownItem.toggleUsability(items[2], false);
    }
    if (rowIndex === etc.columnsDetails[0].elements.length - 1 || (rowIndex === 0 && !isHeaderRowEditable)) {
      DropdownItem.toggleUsability(items[3], false);
    }
  }

  private static updateInsertRowsItemsStyle(etc: EditableTableComponent, rowIndex: number, items: HTMLElement[]) {
    if (MaximumRows.canAddMore(etc)) {
      if (rowIndex === 0 && !etc.rowDropdownSettings.isHeaderRowEditable) {
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

  public static setUpItems(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    // creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      const {rowDropdownSettings} = etc;
      const {isInsertUpAvailable, isInsertDownAvailable, isMoveAvailable, isDeleteAvailable} = rowDropdownSettings;
      const items = RowDropdownButtonItemConf.ITEMS.map((item) => DropdownItem.addButtonItem(etc, dropdownElement, item));
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
