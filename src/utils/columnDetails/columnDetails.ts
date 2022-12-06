import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CellTypeTotalsUtils} from '../columnType/cellTypeTotalsUtils';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ColumnType, ColumnTypes} from '../../types/columnType';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;
  public static NEW_COLUMN_WIDTH = 100;

  // prettier-ignore
  private static getHeaderDefaultColor(etc: EditableTableComponent,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.defaultStyle?.[key] || settings?.cellStyle?.[key] ||
      etc.header.defaultStyle?.[key] || etc.cellStyle[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(etc: EditableTableComponent,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.hoverColors?.[key] || etc.header.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(etc, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(etc: EditableTableComponent, settings?: ColumnSettingsInternal) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(
          etc, 'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(
          etc, 'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(etc, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(etc, 'backgroundColor', '', settings),
      }
    };
  }

  private static getActiveType(settings: ColumnSettingsInternal, availableTypes: ColumnTypes) {
    if (settings?.activeTypeName) {
      const activeType = availableTypes.find((type) => type.name === settings.activeTypeName);
      if (activeType) return activeType;
    }
    const textType = availableTypes.find((type) => type.name === DEFAULT_COLUMN_TYPES.TEXT);
    if (textType) return textType;
    const noValidationType = availableTypes.find((type) => !type.validation);
    if (noValidationType) return noValidationType;
    const firstType = availableTypes[0];
    if (firstType) return firstType;
    return null;
  }

  // prettier-ignore
  public static createInitial(etc: EditableTableComponent, categoryDropdown: HTMLElement,
      settings?: ColumnSettingsInternal): ColumnDetailsInitial {
    const columnSettings = settings || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS;
    const {isDefaultTextRemovable, defaultText: settingsDefaultText} = columnSettings;
    // optimize this
    const types = ColumnTypesUtils.getDefault();
    ColumnTypesUtils.process(types, isDefaultTextRemovable, settingsDefaultText || etc.defaultText);
    // WORK - active type should also accept null
    const activeType = ColumnDetails.getActiveType(columnSettings, types) as ColumnType;
    return {
      elements: [],
      settings: columnSettings,
      headerStateColors: ColumnDetails.createHeaderStateColors(etc, settings),
      bordersOverwrittenBySiblings: {},
      types,
      activeType,
      categoryDropdown: CategoryDropdown.getDefaultObj(categoryDropdown),
    };
  }

  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial): ColumnDetailsNoSizer {
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
      cellTypeTotals: CellTypeTotalsUtils.createObj(columnDetails.types),
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
