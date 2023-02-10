import {ColumnDropdownCellOverlay} from '../../elements/dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {HeaderIconCellElement} from '../../elements/cell/cellsWithTextDiv/headerIconCell/headerIconCellElement';
import {ColumnSettingsInternal, ColumnsSettingsMap, _ColumnWidths} from '../../types/columnsSettingsInternal';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {DropdownDisplaySettingsUtil} from '../../elements/dropdown/dropdownDisplaySettingsUtil';
import {CustomColumnsSettings, CustomColumnSettings} from '../../types/columnsSettings';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {StringDimensionUtils} from '../tableDimensions/stringDimensionUtils';
import {ColumnDropdownSettings} from '../../types/columnDropdownSettings';
import {DefaultColumnsSettings} from '../../types/columnsSettingsDefault';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {ResetColumnStructure} from './resetColumnStructure';
import {CellElement} from '../../elements/cell/cellElement';
import {GenericObject} from '../../types/genericObject';
import {ActiveTable} from '../../activeTable';
import {EMPTY_STRING} from '../../consts/text';

export class ColumnSettingsUtils {
  private static updateSizer(at: ActiveTable, columnIndex: number) {
    const {_columnsDetails, _tableElementRef} = at;
    if (!_tableElementRef) return;
    const {columnSizer} = _columnsDetails[columnIndex];
    // if not needed - cleanUpCustomColumnSizers will remove it (however it would not insert it otherwise)
    if (!columnSizer) InsertRemoveColumnSizer.insert(at, columnIndex);
    InsertRemoveColumnSizer.cleanUpCustomColumnSizers(at, columnIndex);
    if (columnSizer) {
      InsertRemoveColumnSizer.updateSizer(columnSizer, _columnsDetails, columnIndex, _tableElementRef);
    }
    const previousColumnIndex = columnIndex - 1;
    if (columnIndex > 0 && _columnsDetails[previousColumnIndex].columnSizer) {
      const {columnSizer: previousColumnSizer} = _columnsDetails[previousColumnIndex];
      InsertRemoveColumnSizer.updateSizer(previousColumnSizer, _columnsDetails, previousColumnIndex, _tableElementRef);
    }
  }

  // prettier-ignore
  private static change(at: ActiveTable, headerElement: HTMLElement, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal, onColumnMove: boolean) {
    const columnDetails = at._columnsDetails[columnIndex];
    ColumnSettingsDefaultTextUtils.unsetDefaultText(at, columnDetails, columnIndex);
    columnDetails.settings = newSettings;
    columnDetails.activeType = ColumnTypesUtils.getActiveType(newSettings, columnDetails.activeType.name);
    ResetColumnStructure.reset(at, columnDetails, columnIndex);
    ColumnSettingsDefaultTextUtils.setDefaultText(at, columnDetails, columnIndex);
    if (!onColumnMove) ColumnSettingsWidthUtils.changeWidth(at, headerElement, oldSettings.widths, newSettings.widths);
    ColumnSettingsStyleUtils.changeStyleFunc(at, columnIndex, oldSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(at, columnIndex);
    ColumnSettingsUtils.updateSizer(at, columnIndex);
    if (at.displayHeaderIcons) HeaderIconCellElement.changeHeaderIcon(at._columnsDetails[columnIndex]);
    ColumnDropdownCellOverlay.updateIfDisplayed(columnDetails);
    AddNewColumnElement.toggle(at, true);
  }

  // prettier-ignore
  public static parseSettingsChange(at: ActiveTable) {
    const {_customColumnsSettings, _columnsDetails, _focusedElements: {cell: {element: cellElement, columnIndex}}} = at;
    const columnDetails = _columnsDetails[columnIndex as number];
    const oldSettings = columnDetails.settings;
    const newSettings = _customColumnsSettings[CellElement.getText(cellElement as HTMLElement)]
      || at._defaultColumnsSettings;
    return { oldSettings, newSettings, areSettingsDifferent: oldSettings !== newSettings }; 
  }

  // prettier-ignore
  public static changeColumnSettingsIfNameDifferent(at: ActiveTable, cellElement: HTMLElement, colIndex: number,
      onColMove = false) {
    const {oldSettings, newSettings, areSettingsDifferent} = ColumnSettingsUtils.parseSettingsChange(at);
    if (areSettingsDifferent) ColumnSettingsUtils.change(at, cellElement, colIndex, oldSettings, newSettings, onColMove);
  }

  private static setDropdownSettings(customDropdown?: ColumnDropdownSettings, defDropdown?: ColumnDropdownSettings) {
    if (!customDropdown || !defDropdown) return;
    customDropdown.isSortAvailable ??= defDropdown.isSortAvailable;
    customDropdown.isDeleteAvailable ??= defDropdown.isDeleteAvailable;
    customDropdown.isInsertLeftAvailable ??= defDropdown.isInsertLeftAvailable;
    customDropdown.isInsertRightAvailable ??= defDropdown.isInsertRightAvailable;
    customDropdown.isMoveAvailable ??= defDropdown.isMoveAvailable;
  }

  private static processCellDimensions(settings: CustomColumnSettings) {
    const cellStyle = settings.cellStyle;
    if (!cellStyle) return;
    const internalSettings = settings as unknown as ColumnSettingsInternal;
    if (cellStyle.width) {
      const key: keyof _ColumnWidths = settings.isColumnResizable === false ? 'staticWidth' : 'initialWidth';
      internalSettings.widths = {[key]: cellStyle.width} as unknown as _ColumnWidths;
      // when customSetting does not have width set and is resizable, but default settings have a static width set
    } else if (internalSettings.widths && settings.isColumnResizable && internalSettings.widths.staticWidth) {
      internalSettings.widths = {initialWidth: internalSettings.widths.staticWidth};
    }
    StringDimensionUtils.removeAllDimensions(cellStyle);
  }

  private static createInternalSettings(settings: CustomColumnSettings, defSettings: DefaultColumnsSettings) {
    const internalSettings = settings as unknown as ColumnSettingsInternal;
    if (ColumnSettingsStyleUtils.doesSettingHaveSideBorderStyle(internalSettings)) {
      internalSettings.stylePrecedence = true; // REF-23
    }
    ColumnSettingsUtils.setDropdownSettings(settings.columnDropdown, defSettings.columnDropdown);
    Object.keys(defSettings).forEach((key: string) => {
      (internalSettings as unknown as GenericObject)[key] ??= defSettings[key as keyof DefaultColumnsSettings] as string;
    });
    internalSettings.types = ColumnTypesUtils.getProcessedTypes(internalSettings);
    ColumnSettingsUtils.processCellDimensions(settings); // here to first inherit isColumnResizable if not set by user
    return internalSettings;
  }

  private static createInternalMap(customSettings: CustomColumnsSettings, defaultSettings: DefaultColumnsSettings) {
    return customSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.headerName] = ColumnSettingsUtils.createInternalSettings(clientSettings, defaultSettings);
      return settingsMap;
    }, {});
  }

  private static setDefaultTypeProperties(at: ActiveTable) {
    const {_defaultColumnsSettings} = at;
    _defaultColumnsSettings.availableDefaultColumnTypes = at.availableDefaultColumnTypes;
    _defaultColumnsSettings.customColumnTypes = at.customColumnTypes;
    _defaultColumnsSettings.defaultColumnTypeName = at.defaultColumnTypeName;
    _defaultColumnsSettings.types = ColumnTypesUtils.getProcessedTypes(_defaultColumnsSettings);
  }

  private static setDefaultDropdownProperties(at: ActiveTable) {
    const {_defaultColumnsSettings} = at;
    const defaultDisplaySettings = {openMethod: {cellClick: true}};
    _defaultColumnsSettings.columnDropdown = at.columnDropdown || {displaySettings: defaultDisplaySettings};
    _defaultColumnsSettings.columnDropdown.displaySettings ??= defaultDisplaySettings;
    DropdownDisplaySettingsUtil.process(_defaultColumnsSettings.columnDropdown.displaySettings);
    _defaultColumnsSettings.columnDropdown.isSortAvailable ??= true;
    _defaultColumnsSettings.columnDropdown.isDeleteAvailable ??= true;
    _defaultColumnsSettings.columnDropdown.isInsertLeftAvailable ??= true;
    _defaultColumnsSettings.columnDropdown.isInsertRightAvailable ??= true;
    _defaultColumnsSettings.columnDropdown.isMoveAvailable ??= true;
  }

  private static setDefaultGenericProperties(at: ActiveTable) {
    const {_defaultColumnsSettings} = at;
    _defaultColumnsSettings.defaultText = at.defaultText ?? EMPTY_STRING;
    _defaultColumnsSettings.isDefaultTextRemovable = at.isDefaultTextRemovable ?? true;
    _defaultColumnsSettings.cellStyle = at.cellStyle;
    _defaultColumnsSettings.isCellTextEditable = at.isCellTextEditable ?? true;
    _defaultColumnsSettings.headerStyles = at.headerStyles;
    _defaultColumnsSettings.isHeaderTextEditable = at.isHeaderTextEditable ?? _defaultColumnsSettings.isCellTextEditable;
    _defaultColumnsSettings.headerIconStyle = at.headerIconStyle;
    _defaultColumnsSettings.isColumnResizable = at.isColumnResizable ?? true;
  }

  private static setDefaultColumnsSettings(at: ActiveTable) {
    const {_defaultColumnsSettings} = at;
    ColumnSettingsUtils.setDefaultGenericProperties(at);
    ColumnSettingsUtils.processCellDimensions(_defaultColumnsSettings as unknown as CustomColumnSettings);
    ColumnSettingsUtils.setDefaultDropdownProperties(at);
    ColumnSettingsUtils.setDefaultTypeProperties(at);
  }

  // REF-21
  public static setUpInternalSettings(at: ActiveTable) {
    ColumnSettingsUtils.setDefaultColumnsSettings(at);
    at._customColumnsSettings = ColumnSettingsUtils.createInternalMap(
      at.customColumnsSettings,
      at._defaultColumnsSettings
    );
  }
}
