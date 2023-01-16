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
    const {rowDropdownSettings, auxiliaryTableContentInternal, columnDropdownDisplaySettings} = at;
    rowDropdownSettings.isInsertUpAvailable ??= true;
    rowDropdownSettings.isInsertDownAvailable ??= true;
    rowDropdownSettings.isMoveAvailable ??= false;
    rowDropdownSettings.isHeaderRowEditable ??= true;
    rowDropdownSettings.isDeleteAvailable ??= true;
    rowDropdownSettings.displaySettings ??= {};
    RowDropdownSettingsUtil.preprocessOpenMethod(rowDropdownSettings, columnDropdownDisplaySettings);
    DropdownDisplaySettingsUtil.process(rowDropdownSettings.displaySettings);
    RowDropdownSettingsUtil.postprocessOpenMethod(rowDropdownSettings, auxiliaryTableContentInternal);
  }
}
