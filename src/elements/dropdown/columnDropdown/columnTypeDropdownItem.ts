import {DisplayedCellTypeName} from '../../../utils/cellType/displayedCellTypeName';
import {ColumnTypeDropdownItemEvents} from './columnTypeDropdownItemEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {CellElement} from '../../cell/cellElement';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdownItem {
  private static readonly ACTIVE_ITEM_CLASS = 'active-dropdown-item';

  public static reset(dropdownElement: HTMLElement) {
    DropdownItem.removeItems(dropdownElement);
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

  // the items are repopulated during every setup
  public static setUp(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number, text: string[]) {
    const columnTypeItems = DropdownItem.addItems(etc, dropdownElement, text);
    ColumnTypeDropdownItemEvents.set(etc, columnTypeItems, columnIndex);
    ColumnTypeDropdownItem.setActiveUserChosenColumnType(columnTypeItems, etc.columnsDetails[columnIndex]);
  }
}
