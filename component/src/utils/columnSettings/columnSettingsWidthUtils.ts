import {StringDimensionUtils, ParsedDimension} from '../tableDimensions/stringDimensionUtils';
import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnWidthsI} from '../../types/columnsSettingsInternal';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {ActiveTable} from '../../activeTable';

// REF-24
export class ColumnSettingsWidthUtils {
  // prettier-ignore
  public static getSettingsWidthNumber(table: HTMLElement, widths: ColumnWidthsI, isStatic = true): ParsedDimension {
    return StringDimensionUtils.generateNumberDimensionFromClientString(
      table, widths, isStatic ? 'staticWidth' : 'initialWidth', true, ColumnDetails.MINIMAL_COLUMN_WIDTH);
  }

  public static updateColumnWidth(at: ActiveTable, cellEl: HTMLElement, widths: ColumnWidthsI, isNewSetting: boolean) {
    const {tableDimensions, tableElementRef} = at;
    const {number: numberWidth} = ColumnSettingsWidthUtils.getSettingsWidthNumber(tableElementRef as HTMLElement, widths);
    cellEl.style.width = `${numberWidth}px`;
    TableElement.changeStaticWidthTotal(tableDimensions, isNewSetting ? numberWidth : -numberWidth);
  }

  // prettier-ignore
  public static changeWidth(at: ActiveTable,
      cellElement: HTMLElement, oldWidths?: ColumnWidthsI, newWidths?: ColumnWidthsI) {
    let hasWidthChanged = false;
    if (oldWidths?.staticWidth) {
      ColumnSettingsWidthUtils.updateColumnWidth(at, cellElement, oldWidths, false);
      hasWidthChanged = true;
    }
    if (newWidths?.staticWidth) {
      ColumnSettingsWidthUtils.updateColumnWidth(at, cellElement, newWidths, true);
      hasWidthChanged = true;
    }
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true);
  }
}
