import {StringDimensionUtils, SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';

// REF-24
export class ColumnSettingsWidthUtils {
  public static isWidthDefined(settings: ColumnSettingsInternal) {
    return settings.width !== undefined || settings.minWidth !== undefined;
  }

  // prettier-ignore
  public static getSettingsWidthNumber(tableElement: HTMLElement, settings: ColumnSettingsInternal): SuccessResult {
    const result = settings.minWidth !== undefined ?
        StringDimensionUtils.generateNumberDimensionFromClientString(
          'minWidth', tableElement, settings, true, ColumnDetails.MINIMAL_COLUMN_WIDTH)
      : StringDimensionUtils.generateNumberDimensionFromClientString(
          'width', tableElement, settings, true, ColumnDetails.MINIMAL_COLUMN_WIDTH);
    // Should always return a successful result for column as parent width should technically be determinible
    return result as SuccessResult;
  }

  // prettier-ignore
  public static updateColumnWidth(tableElement: HTMLElement,
      cellElement: HTMLElement, settings: ColumnSettingsInternal, isNewSetting: boolean) {
    const {number: numberWidth} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElement, settings);
    cellElement.style.width = `${numberWidth}px`;
    TableElement.changeStaticWidthTotal(isNewSetting ? numberWidth : -numberWidth); 
  }

  // prettier-ignore
  public static changeWidth(etc: EditableTableComponent, cellElement: HTMLElement, oldSettings?: ColumnSettingsInternal,
      newSettings?: ColumnSettingsInternal) {
    let hasWidthChanged = false;
    if (oldSettings && ColumnSettingsWidthUtils.isWidthDefined(oldSettings)) {
      ColumnSettingsWidthUtils.updateColumnWidth(etc.tableElementRef as HTMLElement, cellElement, oldSettings, false);
      hasWidthChanged = true;
    }
    if (newSettings && ColumnSettingsWidthUtils.isWidthDefined(newSettings)) {
      ColumnSettingsWidthUtils.updateColumnWidth(etc.tableElementRef as HTMLElement, cellElement, newSettings, true);
      hasWidthChanged = true;
    }
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }
}
