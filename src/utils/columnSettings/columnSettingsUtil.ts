import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsInternal, ColumnsSettingsMap} from '../../types/columnsSettingsInternal';
import {StaticTableWidthUtils} from '../tableDimensions/staticTable/staticTableWidthUtils';
import {StringDimensionUtil} from '../tableDimensions/stringDimensionUtil';
import {EditableTableComponent} from '../../editable-table-component';
import {TableElement} from '../../elements/table/tableElement';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {ColumnsSettings} from '../../types/columnsSettings';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ColumnSettingsUtil {
  // prettier-ignore
  public static getSettingsWidthNumber(tableElement: HTMLElement, settings: ColumnSettingsInternal) {
    return StringDimensionUtil.generateNumberDimensionFromClientString(
      'width', tableElement, settings, ColumnDetails.MINIMAL_COLUMN_WIDTH);
  }

  // prettier-ignore
  public static setWidthOnHeaderCell(tableElement: HTMLElement,
      cellElement: HTMLElement, settings: ColumnSettingsInternal, isNewSetting: boolean) {
    const numberDimension = ColumnSettingsUtil.getSettingsWidthNumber(tableElement, settings);
    if (numberDimension !== undefined) {
      const { result } = numberDimension;
      cellElement.style.width = `${result}px`;
      TableElement.changeAuxiliaryTableContentWidth(isNewSetting ? result : -result); 
    }
  }

  // prettier-ignore
  private static changeWidth(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      oldSettings: ColumnSettingsInternal | undefined, newSettings: ColumnSettingsInternal, cellElement: HTMLElement) {
    let hasWidthChanged = false;
    if (oldSettings?.width !== undefined) {
      ColumnSettingsUtil.setWidthOnHeaderCell(etc.tableElementRef as HTMLElement, cellElement, oldSettings, false);
      hasWidthChanged = true;
    }
    if (newSettings?.width !== undefined) {
      ColumnSettingsUtil.setWidthOnHeaderCell(etc.tableElementRef as HTMLElement, cellElement, newSettings, true);
      hasWidthChanged = true;
    }
    columnDetails.settings = newSettings;
    if (hasWidthChanged) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {columnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = columnsSettingsInternal[cellElement.textContent as string];
    if (oldSettings !== newSettings) {
      ColumnSettingsUtil.changeWidth(etc, columnDetails, oldSettings, newSettings, cellElement);
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
    }
  }

  public static createInternalMap(clientSettings: ColumnsSettings) {
    return clientSettings.reduce<ColumnsSettingsMap>((previousValue, currentvalue) => {
      previousValue[currentvalue.columnName] = currentvalue as ColumnSettingsInternal;
      return previousValue;
    }, {});
  }
}
