import {ColumnSettingsUtils} from '../../../utils/columnSettings/columnSettingsUtils';
import {ChangeColumnType} from '../../../utils/columnType/changeColumnType';
import {ActiveTable} from '../../../activeTable';
import {ColumnDropdown} from './columnDropdown';

export class ColumnTypeDropdownItemEvents {
  private static onClickMiddleware(this: ActiveTable, func: Function): void {
    if (!ColumnSettingsUtils.parseSettingsChange(this).areSettingsDifferent) func();
    ColumnDropdown.processTextAndHide(this);
  }

  // prettier-ignore
  public static set(at: ActiveTable, items: HTMLElement[], columnIndex: number) {
    items.forEach((dropdownChildElement) => {
      const dropdownItem = dropdownChildElement as HTMLElement;
      dropdownItem.onclick = ColumnTypeDropdownItemEvents.onClickMiddleware.bind(at,
        ChangeColumnType.change.bind(at, dropdownItem.innerText.trim(), columnIndex));
    });
  }
}
