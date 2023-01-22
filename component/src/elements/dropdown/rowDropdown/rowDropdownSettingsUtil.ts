import {DropdownDisplaySettings} from '../../../types/dropdownDisplaySettings';
import {DropdownDisplaySettingsUtil} from '../dropdownDisplaySettingsUtil';
import {AuxiliaryTableContent} from '../../../types/auxiliaryTableContent';
import {RowDropdownSettings} from '../../../types/rowDropdownSettings';
import {ActiveTable} from '../../../activeTable';

export class RowDropdownSettingsUtil {
  private static postprocessOpenMethod(rowSettings: RowDropdownSettings, auxiliaryTableContent: AuxiliaryTableContent) {
    // when no index column and cell click method is being used, change it to overlay click
    if (!auxiliaryTableContent.displayIndexColumn && rowSettings.displaySettings.openMethod?.cellClick) {
      delete rowSettings.displaySettings.openMethod?.cellClick;
      rowSettings.displaySettings.openMethod.overlayClick = true;
    }
  }

  // prettier-ignore
  private static preprocessOpenMethod(rowSettings: RowDropdownSettings, columnSettings: DropdownDisplaySettings) {
    // if no openMethod defined and column settings has one, use its approach for open instead
    if ((rowSettings.displaySettings.openMethod === undefined
        || Object.keys(rowSettings.displaySettings.openMethod).length === 0) && columnSettings.openMethod) {
      rowSettings.displaySettings.openMethod = JSON.parse(JSON.stringify(columnSettings.openMethod));
    }
  }

  public static process(at: ActiveTable) {
    const {rowDropdown, auxiliaryTableContentInternal, columnDropdownDisplaySettings} = at;
    rowDropdown.isInsertUpAvailable ??= true;
    rowDropdown.isInsertDownAvailable ??= true;
    rowDropdown.isMoveAvailable ??= true;
    rowDropdown.canEditHeaderRow ??= true;
    rowDropdown.isDeleteAvailable ??= true;
    rowDropdown.displaySettings ??= {};
    RowDropdownSettingsUtil.preprocessOpenMethod(rowDropdown, columnDropdownDisplaySettings);
    DropdownDisplaySettingsUtil.process(rowDropdown.displaySettings);
    RowDropdownSettingsUtil.postprocessOpenMethod(rowDropdown, auxiliaryTableContentInternal);
  }
}
