import {MaximumColumns} from '../../../utils/insertRemoveStructure/insert/maximumColumns';
import {ColumnDropdownButtonItemConf} from './columnDropdownButtonItemConf';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../types/columnsSettings';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {ObjectUtils} from '../../../utils/object/objectUtils';
import {ColumnTypeDropdown} from './columnTypeDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem {
  public static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';

  public static resetItems(dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    items.forEach((item) => DropdownItem.toggleItem(item, true));
  }

  public static addItems(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    // creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      DropdownItem.addTitle(dropdownElement, 'Property type');
      ColumnTypeDropdown.create(etc, dropdownElement);
      DropdownItem.addDivider(dropdownElement);
      ColumnDropdownButtonItemConf.ITEMS.slice(0, 2).forEach((item) => {
        DropdownItem.addButtonItem(etc, dropdownElement, item, ColumnDropdownItem.SORT_ITEM_CLASS);
      });
      ColumnDropdownButtonItemConf.ITEMS.slice(2).forEach((item) => {
        DropdownItem.addButtonItem(etc, dropdownElement, item);
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
  private static setUpInputElement(etc: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, inputItem: HTMLElement, dropdownElement: HTMLElement) {
    const {isCellTextEditable, isHeaderTextEditable} = etc.columnsDetails[columnIndex].settings;
    const display = ObjectUtils.areValuesFullyDefined(isHeaderTextEditable) ? isHeaderTextEditable : isCellTextEditable;
    if (!display) {
      DropdownItem.toggleItem(inputItem, false);
    } else {
      const inputElement = inputItem.children[0] as HTMLInputElement;
      inputElement.value = etc.contents[0][columnIndex] as string;
      ColumnDropdownItemEvents.setInputItemEvent(etc, columnIndex, cellElement, inputElement, dropdownElement);
    }
  }

  // prettier-ignore
  public static setUp(etc: EditableTableComponent,
      dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnTypeDropdown.setUp(etc, dropdownElement, columnIndex);
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.setUpInputElement(etc, columnIndex, cellElement, items[0], dropdownElement);
    ColumnDropdownItem.toggleItems(etc.columnsDetails[columnIndex].settings, items);
    ColumnDropdownItem.updateItemsStyle(etc, columnIndex, dropdownElement);
    ColumnDropdownItemEvents.setItemEvents(etc, columnIndex, dropdownElement);
  }

  private static updateMoveColumnItemsStyle(etc: EditableTableComponent, colIndex: number, items: HTMLElement[]) {
    const {isMoveAvailable} = etc.columnsDetails[colIndex].settings;
    if (!isMoveAvailable) return;
    DropdownItem.toggleUsability(items[8], true);
    DropdownItem.toggleUsability(items[9], true);
    if (colIndex === 0) {
      DropdownItem.toggleUsability(items[8], false);
    }
    if (colIndex === etc.columnsDetails.length - 1) {
      DropdownItem.toggleUsability(items[9], false);
    }
  }

  private static updateInsertColumnItemsStyle(etc: EditableTableComponent, items: HTMLElement[]) {
    const canAddMoreColumns = MaximumColumns.canAddMore(etc);
    if (canAddMoreColumns) {
      DropdownItem.toggleUsability(items[6], true);
      DropdownItem.toggleUsability(items[7], true);
    } else {
      DropdownItem.toggleUsability(items[6], false);
      DropdownItem.toggleUsability(items[7], false);
    }
  }

  public static updateItemsStyle(etc: EditableTableComponent, columnIndex: number, dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.updateInsertColumnItemsStyle(etc, items);
    ColumnDropdownItem.updateMoveColumnItemsStyle(etc, columnIndex, items);
  }
}
