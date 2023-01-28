import {ColumnDropdownCellOverlay} from '../../elements/dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlay';
import {HeaderIconCellElement} from '../../elements/cell/cellsWithTextDiv/headerIconCell/headerIconCellElement';
import {ColumnSettingsInternal, ColumnsSettingsMap, ColumnWidthsI} from '../../types/columnsSettingsInternal';
import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {DropdownDisplaySettingsUtil} from '../../elements/dropdown/dropdownDisplaySettingsUtil';
import {CustomColumnsSettings, CustomColumnSettings} from '../../types/columnsSettings';
import {ColumnSettingsDefaultTextUtils} from './columnSettingsDefaultTextUtils';
import {StringDimensionUtils} from '../tableDimensions/stringDimensionUtils';
import {ColumnDropdownSettings} from '../../types/columnDropdownSettings';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from './columnSettingsWidthUtils';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {ResetColumnStructure} from './resetColumnStructure';
import {CellElement} from '../../elements/cell/cellElement';
import {GenericObject} from '../../types/genericObject';
import {EMPTY_STRING} from '../../consts/text';
import {ActiveTable} from '../../activeTable';

export class ColumnSettingsUtils {
  private static updateSizer(at: ActiveTable, columnIndex: number) {
    const {columnsDetails, tableElementRef} = at;
    if (!tableElementRef) return;
    const {columnSizer} = columnsDetails[columnIndex];
    // if not needed - cleanUpCustomColumnSizers will remove it (however it would not insert it otherwise)
    if (!columnSizer) InsertRemoveColumnSizer.insert(at, columnIndex);
    InsertRemoveColumnSizer.cleanUpCustomColumnSizers(at, columnIndex);
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
  private static change(at: ActiveTable, headerElement: HTMLElement, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal, onColumnMove: boolean) {
    const columnDetails = at.columnsDetails[columnIndex];
    ColumnSettingsDefaultTextUtils.unsetDefaultText(at, columnDetails, columnIndex);
    columnDetails.settings = newSettings;
    columnDetails.activeType = ColumnTypesUtils.getActiveType(newSettings, columnDetails.activeType.name);
    ResetColumnStructure.reset(at, columnDetails, columnIndex);
    ColumnSettingsDefaultTextUtils.setDefaultText(at, columnDetails, columnIndex);
    if (!onColumnMove) ColumnSettingsWidthUtils.changeWidth(at, headerElement, oldSettings.widths, newSettings.widths);
    ColumnSettingsStyleUtils.changeStyleFunc(at, columnIndex, oldSettings);
    ColumnSettingsBorderUtils.updateSiblingColumns(at, columnIndex);
    ColumnSettingsUtils.updateSizer(at, columnIndex);
    if (at.displayIconsInHeaders) HeaderIconCellElement.changeHeaderIcon(at.columnsDetails[columnIndex]);
    ColumnDropdownCellOverlay.updateIfDisplayed(columnDetails);
    AddNewColumnElement.toggle(at, true);
  }

  // prettier-ignore
  public static parseSettingsChange(at: ActiveTable) {
    const {customColumnsSettingsInternal, columnsDetails,
      focusedElements: {cell: {element: cellElement, columnIndex}}} = at;
    const columnDetails = columnsDetails[columnIndex as number];
    const oldSettings = columnDetails.settings;
    const newSettings = customColumnsSettingsInternal[CellElement.getText(cellElement as HTMLElement)]
      || at.columnsSettings;
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
      const key: keyof ColumnWidthsI = settings.isResizable === false ? 'staticWidth' : 'initialWidth';
      internalSettings.widths = {[key]: cellStyle.width} as unknown as ColumnWidthsI;
      // when customSetting does not have width set and is resizable, but default settings have a static width set
    } else if (internalSettings.widths && settings.isResizable && internalSettings.widths.staticWidth) {
      internalSettings.widths = {initialWidth: internalSettings.widths.staticWidth};
    }
    StringDimensionUtils.removeAllDimensions(cellStyle);
  }

  private static createInternalSettings(settings: CustomColumnSettings, defSettings: ColumnsSettingsDefault) {
    const internalSettings = settings as unknown as ColumnSettingsInternal;
    if (ColumnSettingsStyleUtils.doesSettingHaveSideBorderStyle(internalSettings)) {
      internalSettings.stylePrecedence = true; // REF-23
    }
    ColumnSettingsUtils.setDropdownSettings(settings.dropdown, defSettings.dropdown);
    Object.keys(defSettings).forEach((key: string) => {
      (internalSettings as unknown as GenericObject)[key] ??= defSettings[key as keyof ColumnsSettingsDefault] as string;
    });
    internalSettings.types = ColumnTypesUtils.getProcessedTypes(internalSettings);
    ColumnSettingsUtils.processCellDimensions(settings); // here to first inherit isResizable if not set by user
    return internalSettings;
  }

  private static createInternalMap(clientSettings: CustomColumnsSettings, defaultSettings: ColumnsSettingsDefault) {
    return clientSettings.reduce<ColumnsSettingsMap>((settingsMap, clientSettings) => {
      settingsMap[clientSettings.headerName] = ColumnSettingsUtils.createInternalSettings(clientSettings, defaultSettings);
      return settingsMap;
    }, {});
  }

  private static processDefaultColumnsSettings(columnsSettings: ColumnsSettingsDefault) {
    columnsSettings.defaultText ??= EMPTY_STRING;
    columnsSettings.isDefaultTextRemovable ??= true;
    columnsSettings.isCellTextEditable ??= true;
    columnsSettings.isHeaderTextEditable ??= columnsSettings.isCellTextEditable;
    columnsSettings.isResizable ??= true;
    const defaultDisplaySettings = {openMethod: {cellClick: true}};
    columnsSettings.dropdown ??= {displaySettings: defaultDisplaySettings};
    columnsSettings.dropdown.displaySettings ??= defaultDisplaySettings;
    const internalSettings = columnsSettings as unknown as ColumnSettingsInternal;
    ColumnSettingsUtils.processCellDimensions(columnsSettings as CustomColumnSettings);
    DropdownDisplaySettingsUtil.process(columnsSettings.dropdown.displaySettings);
    columnsSettings.dropdown.isSortAvailable ??= true;
    columnsSettings.dropdown.isDeleteAvailable ??= true;
    columnsSettings.dropdown.isInsertLeftAvailable ??= true;
    columnsSettings.dropdown.isInsertRightAvailable ??= true;
    columnsSettings.dropdown.isMoveAvailable ??= true;
    internalSettings.types = ColumnTypesUtils.getProcessedTypes(internalSettings);
  }

  public static setUpInternalSettings(at: ActiveTable) {
    ColumnSettingsUtils.processDefaultColumnsSettings(at.columnsSettings);
    at.customColumnsSettingsInternal = ColumnSettingsUtils.createInternalMap(at.customColumnsSettings, at.columnsSettings);
  }
}
