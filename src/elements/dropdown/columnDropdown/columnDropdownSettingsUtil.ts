import {ColumnDropdownSettings} from '../../../types/columnDropdownSettings';

export class ColumnDropdownSettingsUtil {
  public static process(columnDropdownSettings: ColumnDropdownSettings) {
    columnDropdownSettings.isAvailable ??= true;
    if (columnDropdownSettings.isAvailable) {
      columnDropdownSettings.openMethod ??= {};
      if (columnDropdownSettings.openMethod.overlayClick) {
        delete columnDropdownSettings.openMethod.cellClick;
      } else if (columnDropdownSettings.openMethod.cellClick) {
        delete columnDropdownSettings.openMethod.overlayClick;
      } else {
        // overlayClick takes presedence if none set
        columnDropdownSettings.openMethod.overlayClick = true;
      }
    } else if (!columnDropdownSettings.isAvailable) {
      delete columnDropdownSettings.openMethod;
      delete columnDropdownSettings.overlayStyle;
    }
  }
}
