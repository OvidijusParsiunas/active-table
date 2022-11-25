import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {StringDimensionUtil, SuccessResult} from '../tableDimensions/stringDimensionUtil';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ColumnSettingsWidthUtil {
  public static isWidthDefined(settings?: ColumnSettingsInternal) {
    return settings?.width !== undefined || settings?.minWidth !== undefined;
  }

  // prettier-ignore
  public static getSettingsWidthNumber(tableElement: HTMLElement, settings: ColumnSettingsInternal): SuccessResult {
    const result = settings.minWidth !== undefined ?
    StringDimensionUtil.generateNumberDimensionFromClientString(
      'minWidth', tableElement, settings, ColumnDetails.MINIMAL_COLUMN_WIDTH):
    StringDimensionUtil.generateNumberDimensionFromClientString(
      'width', tableElement, settings, ColumnDetails.MINIMAL_COLUMN_WIDTH);
    // Should always return a successful result for column as parent width should technically be determinible
    return result as SuccessResult;
  }

  // prettier-ignore
  public static updateColumnAndAuxWidth(tableElement: HTMLElement,
      cellElement: HTMLElement, settings: ColumnSettingsInternal, isNewSetting: boolean) {
    const {width} = ColumnSettingsWidthUtil.getSettingsWidthNumber(tableElement, settings);
    cellElement.style.width = `${width}px`;
    TableElement.changeStaticTableContentWidth(isNewSetting ? width : -width); 
  }

  // prettier-ignore
  public static changeWidth(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      oldSettings: ColumnSettingsInternal | undefined, newSettings: ColumnSettingsInternal, cellElement: HTMLElement) {
    let hasWidthChanged = false;
    if (oldSettings && ColumnSettingsWidthUtil.isWidthDefined(oldSettings)) {
      ColumnSettingsWidthUtil.updateColumnAndAuxWidth(etc.tableElementRef as HTMLElement, cellElement, oldSettings, false);
      hasWidthChanged = true;
    }
    if (ColumnSettingsWidthUtil.isWidthDefined(newSettings)) {
      ColumnSettingsWidthUtil.updateColumnAndAuxWidth(etc.tableElementRef as HTMLElement, cellElement, newSettings, true);
      hasWidthChanged = true;
    }
    columnDetails.settings = newSettings;
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }
}
