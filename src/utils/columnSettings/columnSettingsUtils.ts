import {HeaderIconCellElement} from '../../elements/cell/cellsWithTextDiv/headerIconCell/headerIconCellElement';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {ColumnDropdownCellOverlay} from '../../elements/dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {ResetColumnStructure} from './resetColumnStructure';
import {CellElement} from '../../elements/cell/cellElement';
import {GenericObject} from '../../types/genericObject';
import {EMPTY_STRING} from '../../consts/text';
import {
  ColumnSettingsInternal,
  DefaultColumnsSettings,
  CustomColumnsSettings,
  CustomColumnSettings,
  ColumnsSettingsMap,
} from '../../types/columnsSettings';

export class ColumnSettingsUtils {
  private static updateSizer(etc: EditableTableComponent, columnIndex: number) {
    const {columnsDetails, tableElementRef} = etc;
    if (!tableElementRef) return;
    const {columnSizer} = columnsDetails[columnIndex];
    // if not needed - cleanUpCustomColumnSizers will remove it (however it would not insert it otherwise)
    if (!columnSizer) InsertRemoveColumnSizer.insert(etc, columnIndex);
    InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
    if (columnSizer) {
      InsertRemoveColumnSizer.updateSizer(columnSizer, columnsDetails, columnIndex, tableElementRef);
    }
    const previousColumnIndex = columnIndex - 1;
    if (columnIndex > 0 && columnsDetails[previousColumnIndex].columnSizer) {
      const {columnSizer: previousColumnSizer} = columnsDetails[previousColumnIndex];
      InsertRemoveColumnSizer.updateSizer(previousColumnSizer, columnsDetails, previousColumnIndex, tableElementRef);
    }
  }

  // prettier-ignore
  private static change(etc: EditableTableComponent, headerElement: HTMLElement, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal) {
    const columnDetails = etc.columnsDetails[columnIndex];
    ColumnSettingsDefaultTextUtils.unsetDefaultText(etc, columnDetails, columnIndex);
    columnDetails.settings = newSettings;
    Object.assign(columnDetails, ColumnTypesUtils.getProcessedTypes(newSettings, columnDetails.activeType.name));
    ResetColumnStructure.reset(etc, columnDetails, columnIndex);
    ColumnSettingsDefaultTextUtils.setDefaultText(etc, columnDetails, columnIndex);
    ColumnSettingsWidthUtils.changeWidth(etc, headerElement, oldSettings, newSettings);
    ColumnSettingsStyleUtils.changeStyle(etc, columnIndex, oldSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
    ColumnSettingsUtils.updateSizer(etc, columnIndex);
    if (etc.areIconsDisplayedInHeaders) HeaderIconCellElement.changeHeaderIcon(etc.columnsDetails[columnIndex]);
    ColumnDropdownCellOverlay.updateIfDisplayed(columnDetails);
    AddNewColumnElement.toggle(etc, true);
  }

  // prettier-ignore
  public static parseSettingsChange(etc: EditableTableComponent) {
    const {customColumnsSettingsInternal, columnsDetails,
      focusedElements: {cell: {element: cellElement, columnIndex}}} = etc;
    const columnDetails = columnsDetails[columnIndex as number];
    const oldSettings = columnDetails.settings;
    const newSettings = customColumnsSettingsInternal[CellElement.getText(cellElement as HTMLElement)]
      || etc.defaultColumnsSettings;
    return { oldSettings, newSettings, areSettingsDifferent: oldSettings !== newSettings }; 
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number) {
    const {oldSettings, newSettings, areSettingsDifferent} = ColumnSettingsUtils.parseSettingsChange(etc);
    if (areSettingsDifferent) ColumnSettingsUtils.change(etc, cellElement, columnIndex, oldSettings, newSettings);
  }

  private static createInternalSettings(settings: CustomColumnSettings, defSettings: DefaultColumnsSettings) {
    const internalSettings = settings as ColumnSettingsInternal;
    if (ColumnSettingsStyleUtils.doesSettingHaveSideBorderStyle(internalSettings)) {
      internalSettings.stylePrecedence = true; // REF-23
    }
    Object.keys(defSettings).forEach((key: string) => {
      (internalSettings as unknown as GenericObject)[key] ??= defSettings[key as keyof DefaultColumnsSettings] as string;
    });
    return internalSettings;
  }

  private static createInternalMap(clientSettings: CustomColumnsSettings, defaultSettings: DefaultColumnsSettings) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.columnName] = ColumnSettingsUtils.createInternalSettings(clientSettings, defaultSettings);
      return settingsMap;
    }, {});
  }

  private static processDefaultColumnsSettings(defaultColumnsSettings: DefaultColumnsSettings) {
    defaultColumnsSettings.defaultText ??= EMPTY_STRING;
    defaultColumnsSettings.isDefaultTextRemovable ??= true;
    defaultColumnsSettings.isCellTextEditable ??= true;
    defaultColumnsSettings.isHeaderTextEditable ??= defaultColumnsSettings.isCellTextEditable;
    defaultColumnsSettings.isSortAvailable ??= true;
    defaultColumnsSettings.isDeleteAvailable ??= true;
    defaultColumnsSettings.isInsertLeftAvailable ??= true;
    defaultColumnsSettings.isInsertRightAvailable ??= true;
    defaultColumnsSettings.isMoveAvailable ??= false;
  }

  // prettier-ignore
  public static setUpInternalSettings(etc: EditableTableComponent) {
    ColumnSettingsUtils.processDefaultColumnsSettings(etc.defaultColumnsSettings);
    etc.customColumnsSettingsInternal = ColumnSettingsUtils.createInternalMap(
      etc.customColumnsSettings, etc.defaultColumnsSettings);
  }
}
