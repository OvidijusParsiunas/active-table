import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsInternal, ColumnsSettingsMap} from '../../types/columnsSettingsInternal';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsWidthUtil} from './columnSettingsWidthUtil';
import {ColumnsSettings} from '../../types/columnsSettings';

export class ColumnSettingsUtil {
  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {columnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = columnsSettingsInternal[cellElement.textContent as string];
    if (oldSettings !== newSettings) {
      ColumnSettingsWidthUtil.changeWidth(etc, columnDetails, oldSettings, newSettings, cellElement);
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
