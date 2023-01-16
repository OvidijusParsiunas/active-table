import {MaximumColumns} from '../../../utils/insertRemoveStructure/insert/maximum/maximumColumns';
import {ColumnSettingsInternal} from '../../../types/columnsSettingsInternal';
import {ColumnDropdownButtonItemConf} from './columnDropdownButtonItemConf';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {ObjectUtils} from '../../../utils/object/objectUtils';
import {ColumnTypeDropdown} from './columnTypeDropdown';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem {
  public static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';

  public static resetItems(dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    items.forEach((item) => DropdownItem.toggleItem(item, true));
  }

  public static addItems(at: ActiveTable, dropdownElement: HTMLElement) {
    // creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      DropdownItem.addTitle(dropdownElement, 'Property type');
      ColumnTypeDropdown.create(at, dropdownElement);
      DropdownItem.addDivider(dropdownElement);
      ColumnDropdownButtonItemConf.ITEMS.slice(0, 2).forEach((item) => {
        DropdownItem.addButtonItem(at, dropdownElement, item, ColumnDropdownItem.SORT_ITEM_CLASS);
      });
      ColumnDropdownButtonItemConf.ITEMS.slice(2).forEach((item) => {
        DropdownItem.addButtonItem(at, dropdownElement, item);
      });
    });
  }

  private static toggleItems(settings: ColumnSettingsInternal, items: HTMLElement[]) {
    const {isSortAvailable, isDeleteAvailable, isInsertLeftAvailable, isInsertRightAvailable, isMoveAvailable} = settings;
    if (!isSortAvailable) {
      DropdownItem.toggleItem(items[4], false);
      DropdownItem.toggleItem(items[5], false);
    }
    if (!isInsertLeftAvailable) DropdownItem.toggleItem(items[6], false);
    if (!isInsertRightAvailable) DropdownItem.toggleItem(items[7], false);
    if (!isMoveAvailable) {
      // their display should be toggled if can't move any further
      DropdownItem.toggleItem(items[8], false);
      DropdownItem.toggleItem(items[9], false);
    }
    if (!isDeleteAvailable) DropdownItem.toggleItem(items[9], false);
  }

  // prettier-ignore
  private static setUpInputElement(at: ActiveTable,
      columnIndex: number, cellElement: HTMLElement, inputItem: HTMLElement, dropdownElement: HTMLElement) {
    const {isCellTextEditable, isHeaderTextEditable} = at.columnsDetails[columnIndex].settings;
    if (at.columnDropdownDisplaySettings.openMethod?.overlayClick ||
        (ObjectUtils.areValuesFullyDefined(isHeaderTextEditable) ? !isHeaderTextEditable : !isCellTextEditable)) {
      DropdownItem.toggleItem(inputItem, false);
    } else {
      const inputElement = inputItem.children[0] as HTMLInputElement;
      inputElement.value = at.content[0][columnIndex] as string;
      ColumnDropdownItemEvents.setInputItemEvent(at, columnIndex, cellElement, inputElement, dropdownElement);
    }
  }

  public static setUp(at: ActiveTable, dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnTypeDropdown.setUp(at, dropdownElement, columnIndex);
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.setUpInputElement(at, columnIndex, cellElement, items[0], dropdownElement);
    ColumnDropdownItem.toggleItems(at.columnsDetails[columnIndex].settings, items);
    ColumnDropdownItem.updateItemsStyle(at, columnIndex, dropdownElement);
    ColumnDropdownItemEvents.setItemEvents(at, columnIndex, dropdownElement);
  }

  private static updateMoveColumnItemsStyle(at: ActiveTable, colIndex: number, items: HTMLElement[]) {
    const {isMoveAvailable} = at.columnsDetails[colIndex].settings;
    if (!isMoveAvailable) return;
    DropdownItem.toggleUsability(items[8], true);
    DropdownItem.toggleUsability(items[9], true);
    if (colIndex === 0) {
      DropdownItem.toggleUsability(items[8], false);
    }
    if (colIndex === at.columnsDetails.length - 1) {
      DropdownItem.toggleUsability(items[9], false);
    }
  }

  private static updateInsertColumnItemsStyle(at: ActiveTable, items: HTMLElement[]) {
    const canAddMoreColumns = MaximumColumns.canAddMore(at);
    if (canAddMoreColumns) {
      DropdownItem.toggleUsability(items[6], true);
      DropdownItem.toggleUsability(items[7], true);
    } else {
      DropdownItem.toggleUsability(items[6], false);
      DropdownItem.toggleUsability(items[7], false);
    }
  }

  public static updateItemsStyle(at: ActiveTable, columnIndex: number, dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.updateInsertColumnItemsStyle(at, items);
    ColumnDropdownItem.updateMoveColumnItemsStyle(at, columnIndex, items);
  }
}
