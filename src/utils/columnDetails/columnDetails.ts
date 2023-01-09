import {ColumnSettingsInternal, DefaultColumnsSettings} from '../../types/columnsSettings';
import {SelectDropdown} from '../../elements/dropdown/selectDropdown/selectDropdown';
import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {CellTypeTotalsUtils} from '../columnType/cellTypeTotalsUtils';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {CellHighlightUtils} from '../color/cellHighlightUtils';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;
  public static NEW_COLUMN_WIDTH = 100;

  // prettier-ignore
  private static getHeaderDefaultColor(defaultColumnsSettings: DefaultColumnsSettings,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyleProps?.default?.[key] || settings?.cellStyle?.[key] ||
      defaultColumnsSettings.headerStyleProps?.default?.[key] || defaultColumnsSettings.cellStyle?.[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(defaultColumnsSettings: DefaultColumnsSettings,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyleProps?.hoverColors?.[key] || defaultColumnsSettings.headerStyleProps?.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(defaultColumnsSettings: DefaultColumnsSettings,
      settings?: ColumnSettingsInternal) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(defaultColumnsSettings,
          'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(defaultColumnsSettings,
          'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, 'backgroundColor', '', settings),
      }
    };
  }

  // prettier-ignore
  public static createInitial(defaultColumnsSettings: DefaultColumnsSettings, selectDropdown: HTMLElement,
      settings: ColumnSettingsInternal): ColumnDetailsInitial {
    const columnSettings = settings || defaultColumnsSettings as ColumnSettingsInternal;
    const {types, activeType} = ColumnTypesUtils.getProcessedTypes(columnSettings);
    return {
      elements: [],
      processedStyle: [],
      settings: columnSettings,
      headerStateColors: ColumnDetails.createHeaderStateColors(defaultColumnsSettings, settings),
      bordersOverwrittenBySiblings: {},
      types,
      activeType,
      selectDropdown: SelectDropdown.getDefaultObj(selectDropdown),
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial,
      columnDropdownCellOverlay: HTMLElement): ColumnDetailsNoSizer {
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
      cellTypeTotals: CellTypeTotalsUtils.createObj(columnDetails.types),
      columnDropdownCellOverlay,
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
