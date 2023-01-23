import {StringDimensionUtils, SuccessResult} from '../tableDimensions/stringDimensionUtils';
import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {ColumnWidth} from '../../types/columnsSettings';
import {ActiveTable} from '../../activeTable';

// REF-24
export class ColumnSettingsWidthUtils {
  public static isWidthDefined(width: ColumnWidth) {
    return width.width !== undefined || width.minWidth !== undefined;
  }

  // prettier-ignore
  public static getSettingsWidthNumber(tableElement: HTMLElement, width: ColumnWidth): SuccessResult {
    const result = width.minWidth !== undefined ?
        StringDimensionUtils.generateNumberDimensionFromClientString(
          'minWidth', tableElement, width, true, ColumnDetails.MINIMAL_COLUMN_WIDTH)
      : StringDimensionUtils.generateNumberDimensionFromClientString(
          'width', tableElement, width, true, ColumnDetails.MINIMAL_COLUMN_WIDTH);
    // Should always return a successful result for column as parent width should technically be determinible
    return result as SuccessResult;
  }

  public static updateColumnWidth(at: ActiveTable, cellElement: HTMLElement, width: ColumnWidth, isNewSetting: boolean) {
    const {tableDimensions, tableElementRef} = at;
    const {number: numberWidth} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElementRef as HTMLElement, width);
    cellElement.style.width = `${numberWidth}px`;
    TableElement.changeStaticWidthTotal(tableDimensions, isNewSetting ? numberWidth : -numberWidth);
  }

  public static changeWidth(at: ActiveTable, cellElement: HTMLElement, oldWidth?: ColumnWidth, newWidth?: ColumnWidth) {
    let hasWidthChanged = false;
    if (oldWidth && ColumnSettingsWidthUtils.isWidthDefined(oldWidth)) {
      ColumnSettingsWidthUtils.updateColumnWidth(at, cellElement, oldWidth, false);
      hasWidthChanged = true;
    }
    if (newWidth && ColumnSettingsWidthUtils.isWidthDefined(newWidth)) {
      ColumnSettingsWidthUtils.updateColumnWidth(at, cellElement, newWidth, true);
      hasWidthChanged = true;
    }
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true);
  }

  // REF-36
  public static setMinWidthOnSettings(settings: ColumnSettingsInternal, defaultWidth?: ColumnWidth) {
    if (defaultWidth?.minWidth && !settings.width && !settings.minWidth) {
      (settings as Required<ColumnSettingsInternal>).minWidth = defaultWidth.minWidth;
    }
  }
}
