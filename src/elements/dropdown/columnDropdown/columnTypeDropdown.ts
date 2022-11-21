import {DisplayedCellTypeName} from '../../../utils/cellType/displayedCellTypeName';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';

export class ColumnTypeDropdown {
  // this item activates the column type dropdown from the column dropdown
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';

  public static getColumnTypeItemText(dropdownElement: HTMLElement) {
    const columnTypeItems = dropdownElement.getElementsByClassName(ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS)[0];
    return columnTypeItems.children[0];
  }

  public static setUp(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const textElement = ColumnTypeDropdown.getColumnTypeItemText(dropdownElement);
    textElement.textContent = DisplayedCellTypeName.get(etc.columnsDetails[columnIndex].activeColumnType);
    ColumnTypeDropdownItem.setUp(etc, textElement.nextSibling as HTMLElement, columnIndex);
  }

  // prettier-ignore
  public static addToColumnDropdown(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const columnTypeDropdown = ColumnTypeDropdownItem.addItems(
      etc.shadowRoot, dropdownElement, ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS);
    etc.overlayElementsState.columnTypeDropdown = columnTypeDropdown;
  }
}
