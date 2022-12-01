import {EditableTableComponent} from '../../../editable-table-component';
import {UserSetCellType} from '../../../utils/cellType/userSetCellType';
import {ColumnDropdown} from './columnDropdown';

export class ColumnTypeDropdownItemEvents {
  private static onClickMiddleware(this: EditableTableComponent, func: Function): void {
    func();
    ColumnDropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static set(etc: EditableTableComponent, items: HTMLElement[], columnIndex: number) {
    items.forEach((dropdownChildElement) => {
      const dropdownItem = dropdownChildElement as HTMLElement;
      dropdownItem.onclick = ColumnTypeDropdownItemEvents.onClickMiddleware.bind(etc,
        UserSetCellType.setIfNew.bind(etc, dropdownItem.innerText, columnIndex));
    });
  }
}
