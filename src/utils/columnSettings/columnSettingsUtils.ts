import {ColumnSettingsInternal, CustomColumnsSettings, ColumnsSettingsMap} from '../../types/columnsSettings';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {EMPTY_STRING} from '../../consts/text';

export class ColumnSettingsUtils {
  public static DEFAULT_INTERNAL_COLUMN_SETTINGS: ColumnSettingsInternal = {
    defaultText: EMPTY_STRING,
    isDefaultTextRemovable: true,
  };

  // prettier-ignore
  private static change(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number,
      oldSettings?: ColumnSettingsInternal, newSettings?: ColumnSettingsInternal) {
    const columnDetails = etc.columnsDetails[columnIndex];
    ColumnSettingsDefaultTextUtils.unsetDefaultText(etc, columnDetails, columnIndex);
    columnDetails.settings = newSettings || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS;
    ColumnSettingsDefaultTextUtils.setDefaultText(etc, columnDetails, columnIndex);
    ColumnSettingsWidthUtils.changeWidth(etc, cellElement, oldSettings, newSettings);
    InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
    ColumnSettingsStyleUtils.changeStyle(etc.defaultColumnsSettings, columnDetails, oldSettings, newSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
    AddNewColumnElement.toggle(etc, true);
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {customColumnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = customColumnsSettingsInternal[CellElement.getText(cellElement)]
      || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS;
    if (oldSettings !== newSettings) ColumnSettingsUtils.change(etc, cellElement, columnIndex, oldSettings, newSettings);
  }

  private static prepareDefaultInternalColumnSettings(etc: EditableTableComponent) {
    const {defaultText, defaultColumnTypes, customColumnTypes, activeTypeName} = etc.defaultColumnsSettings;
    if (defaultText) ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.defaultText = defaultText;
    if (defaultColumnTypes) ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.defaultColumnTypes = defaultColumnTypes;
    if (customColumnTypes) ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.customColumnTypes = customColumnTypes;
    if (activeTypeName) ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.activeTypeName = activeTypeName;
    // IMPORTANT - cellStyle and header are not added here
  }

  private static createInternalMap(clientSettings: CustomColumnsSettings) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.columnName] = Object.assign(
        clientSettings,
        ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS
      );
      return settingsMap;
    }, {});
  }

  public static setUpInternalSettings(etc: EditableTableComponent) {
    ColumnSettingsUtils.prepareDefaultInternalColumnSettings(etc);
    etc.customColumnsSettingsInternal = ColumnSettingsUtils.createInternalMap(etc.customColumnsSettings);
  }
}
