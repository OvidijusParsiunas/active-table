import {RowDropdownSettings} from '../../../types/rowDropdownSettings';
import {DropdownDisplaySettingsUtil} from '../dropdownSettingsUtil';

export class RowDropdownSettingsUtil {
  public static process(rowDropdownSettings: RowDropdownSettings, displayIndexColumn: boolean) {
    rowDropdownSettings.isInsertUpAvailable ??= true;
    rowDropdownSettings.isInsertDownAvailable ??= true;
    rowDropdownSettings.isMoveAvailable ??= false;
    rowDropdownSettings.isHeaderRowEditable ??= rowDropdownSettings.isMoveAvailable;
    rowDropdownSettings.isDeleteAvailable ??= true;
    rowDropdownSettings.displaySettings ??= {};
    DropdownDisplaySettingsUtil.process(rowDropdownSettings.displaySettings);
    if (!displayIndexColumn && rowDropdownSettings.displaySettings.openMethod?.cellClick) {
      delete rowDropdownSettings.displaySettings.openMethod?.cellClick;
      rowDropdownSettings.displaySettings.openMethod.overlayClick = true;
    }
  }
}
