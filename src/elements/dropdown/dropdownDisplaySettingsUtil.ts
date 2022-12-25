import {DropdownDisplaySettings} from '../../types/dropdownDisplaySettings';

export class DropdownDisplaySettingsUtil {
  public static process(dropdownDisplaySettings: DropdownDisplaySettings) {
    dropdownDisplaySettings.isAvailable ??= true;
    if (dropdownDisplaySettings.isAvailable) {
      dropdownDisplaySettings.openMethod ??= {};
      if (dropdownDisplaySettings.openMethod.overlayClick) {
        delete dropdownDisplaySettings.openMethod.cellClick;
      } else if (dropdownDisplaySettings.openMethod.cellClick) {
        delete dropdownDisplaySettings.openMethod.overlayClick;
      } else {
        // overlayClick takes presedence if none set
        dropdownDisplaySettings.openMethod.overlayClick = true;
      }
    } else {
      delete dropdownDisplaySettings.openMethod;
      delete dropdownDisplaySettings.overlayStyle;
    }
  }
}
