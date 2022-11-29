import {ColumnSettingsInternal, ColumnsSettings, ColumnsSettingsMap} from '../../types/columnsSettings';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';

export class ColumnSettingsUtils {
  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {columnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = columnsSettingsInternal[cellElement.textContent as string];
    if (oldSettings !== newSettings) {
      ColumnSettingsWidthUtils.changeWidth(etc, columnDetails, oldSettings, newSettings, cellElement);
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
      ColumnSettingsStyleUtils.changeStyle(etc, columnDetails, oldSettings, newSettings);
      ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
      AddNewColumnElement.toggle(etc, true);
    }
  }

  public static createInternalMap(clientSettings: ColumnsSettings) {
    return clientSettings.reduce<ColumnsSettingsMap>((previousValue, currentvalue) => {
      previousValue[currentvalue.columnName] = currentvalue as ColumnSettingsInternal;
      return previousValue;
    }, {});
  }
}
