import {ColumnSettings, ColumnSettingsInternal, ColumnsSettings, ColumnsSettingsMap} from '../../types/columnsSettings';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {EMPTY_STRING} from '../../consts/text';

export class ColumnSettingsUtils {
  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {columnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = columnsSettingsInternal[cellElement.textContent as string];
    if (oldSettings !== newSettings) {
      ColumnSettingsWidthUtils.changeWidth(etc, columnDetails, cellElement, oldSettings, newSettings);
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
      ColumnSettingsStyleUtils.changeStyle(etc, columnDetails, oldSettings, newSettings);
      ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
      AddNewColumnElement.toggle(etc, true);
    }
  }

  public static createDefaultInternal(defaultTableText: string) {
    return {defaultText: defaultTableText || EMPTY_STRING};
  }

  private static createInternal(clientSettings: ColumnSettings, defaultTableText: string): ColumnSettingsInternal {
    const internalSettings = clientSettings as ColumnSettingsInternal;
    if (internalSettings.defaultText === undefined) {
      internalSettings.defaultText = defaultTableText || EMPTY_STRING;
    }
    return internalSettings;
  }

  public static createInternalMap(clientSettings: ColumnsSettings, defaultTableText: string) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.columnName] = ColumnSettingsUtils.createInternal(clientSettings, defaultTableText);
      return settingsMap;
    }, {});
  }
}
