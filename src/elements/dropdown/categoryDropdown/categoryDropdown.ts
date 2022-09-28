import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

// WORK - refactor here
export class CategoryDropdown extends Dropdown {
  public static create() {
    const dropdownElement = Dropdown.createBase();
    DropdownItem.addButtonItem(dropdownElement, 'Insert Right');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Left');
    DropdownItem.addButtonItem(dropdownElement, 'Delete');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Right');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Left');
    DropdownItem.addButtonItem(dropdownElement, 'Delete');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Right');
    DropdownItem.addButtonItem(dropdownElement, 'Insert Left');
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.style.overflow = 'auto';
    return dropdownElement;
  }

  // might need closable elements function
  public static hide(etc: EditableTableComponent) {
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    GenericElementUtils.hideElements(categoryDropdown);
  }

  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
      categoryDropdown.style.display = 'block';
      const rect = cellElement.getBoundingClientRect();
      categoryDropdown.style.left = `${rect.right}px`;
      categoryDropdown.style.top = `${rect.top}px`;
    } else if (Dropdown.isDisplayed(etc.overlayElementsState.categoryDropdown)) {
      CategoryDropdown.hide(etc);
    }
  }
}
