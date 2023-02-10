import {DropdownDisplaySettings} from '../../../types/dropdownDisplaySettings';
import {FrameComponentsInternal} from '../../../types/frameComponentsInternal';
import {DropdownDisplaySettingsUtil} from '../dropdownDisplaySettingsUtil';
import {RowDropdownSettings} from '../../../types/rowDropdownSettings';
import {ActiveTable} from '../../../activeTable';

export class RowDropdownSettingsUtil {
  private static postprocessOpenMethod(rowSettings: RowDropdownSettings, frameComponents: FrameComponentsInternal) {
    // when no index column and cell click method is being used, change it to overlay click
    if (!frameComponents.displayIndexColumn && rowSettings.displaySettings.openMethod?.cellClick) {
      delete rowSettings.displaySettings.openMethod?.cellClick;
      rowSettings.displaySettings.openMethod.overlayClick = true;
    }
  }

  // prettier-ignore
  private static preprocessOpenMethod(rowSettings: RowDropdownSettings, displaySettings?: DropdownDisplaySettings) {
    if (!displaySettings) return;
    // if no openMethod defined and column settings has one, use its approach for open instead
    if ((rowSettings.displaySettings.openMethod === undefined
        || Object.keys(rowSettings.displaySettings.openMethod).length === 0) && displaySettings.openMethod) {
      rowSettings.displaySettings.openMethod = JSON.parse(JSON.stringify(displaySettings.openMethod));
    }
  }

  public static process(at: ActiveTable) {
    const {rowDropdown, frameComponentsInternal, _defaultColumnsSettings} = at;
    rowDropdown.isInsertUpAvailable ??= true;
    rowDropdown.isInsertDownAvailable ??= true;
    rowDropdown.isMoveAvailable ??= true;
    rowDropdown.canEditHeaderRow ??= true;
    rowDropdown.isDeleteAvailable ??= true;
    rowDropdown.displaySettings ??= {};
    RowDropdownSettingsUtil.preprocessOpenMethod(rowDropdown, _defaultColumnsSettings.columnDropdown?.displaySettings);
    DropdownDisplaySettingsUtil.process(rowDropdown.displaySettings);
    RowDropdownSettingsUtil.postprocessOpenMethod(rowDropdown, frameComponentsInternal);
  }
}
