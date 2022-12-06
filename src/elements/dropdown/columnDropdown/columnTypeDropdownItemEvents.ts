import {ChangeColumnType} from '../../../utils/columnType/changeColumnType';
import {EditableTableComponent} from '../../../editable-table-component';
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
        ChangeColumnType.change.bind(etc, dropdownItem.innerText, columnIndex));
    });
  }
}
