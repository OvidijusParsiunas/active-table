import {RowDropdownSettings} from '../../../types/rowDropdownSettings';

export class RowDropdownSettingsUtil {
  public static process(rowDropdownSettings: RowDropdownSettings) {
    rowDropdownSettings.isDisplayed ??= true;
    rowDropdownSettings.isInsertUpAvailable ??= true;
    rowDropdownSettings.isInsertDownAvailable ??= true;
    rowDropdownSettings.isMoveAvailable ??= false;
    rowDropdownSettings.isHeaderRowEditable ??= rowDropdownSettings.isMoveAvailable;
    rowDropdownSettings.isDeleteAvailable ??= true;
  }
}
