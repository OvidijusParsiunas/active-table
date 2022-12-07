import {ColumnSettings, ColumnSettingsInternal, ColumnsSettings, ColumnsSettingsMap} from '../../types/columnsSettings';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {CellText} from '../../types/tableContents';
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
    ColumnSettingsStyleUtils.changeStyle(etc, columnDetails, oldSettings, newSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
    AddNewColumnElement.toggle(etc, true);
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {columnsSettingsInternal, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const oldSettings = columnDetails.settings;
    const newSettings = columnsSettingsInternal[CellElement.getText(cellElement)]
      || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS;
    if (oldSettings !== newSettings) ColumnSettingsUtils.change(etc, cellElement, columnIndex, oldSettings, newSettings);
  }

  private static createInternal(clientSettings: ColumnSettings): ColumnSettingsInternal {
    const internalSettings = clientSettings as ColumnSettingsInternal;
    internalSettings.defaultText ??= ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.defaultText;
    internalSettings.isDefaultTextRemovable ??= true;
    return internalSettings;
  }

  private static prepareDefaultInternalColumnSettings(defaultTableText: CellText) {
    if (defaultTableText) ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS.defaultText = defaultTableText;
  }

  private static createInternalMap(clientSettings: ColumnsSettings) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.columnName] = ColumnSettingsUtils.createInternal(clientSettings);
      return settingsMap;
    }, {});
  }

  public static setUpInternalSettings(etc: EditableTableComponent) {
    ColumnSettingsUtils.prepareDefaultInternalColumnSettings(etc.defaultText);
    etc.columnsSettingsInternal = ColumnSettingsUtils.createInternalMap(etc.columnsSettings);
  }
}
