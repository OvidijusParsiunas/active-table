import {SelectDropdown} from '../../elements/dropdown/selectDropdown/selectDropdown';
import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {ColumnSettingsWidthUtils} from '../columnSettings/columnSettingsWidthUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {CellTypeTotalsUtils} from '../columnType/cellTypeTotalsUtils';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {OnColumnUpdate} from '../../types/onUpdate';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;
  public static NEW_COLUMN_WIDTH = 140;

  // prettier-ignore
  private static getHeaderDefaultColor(columnsSettings: ColumnsSettingsDefault,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyleProps?.default?.[key] || settings?.cellStyle?.[key] ||
      columnsSettings.headerStyleProps?.default?.[key] || columnsSettings.cellStyle?.[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(columnsSettings: ColumnsSettingsDefault,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyleProps?.hoverColors?.[key] || columnsSettings.headerStyleProps?.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(columnsSettings, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(columnsSettings: ColumnsSettingsDefault,
      settings?: ColumnSettingsInternal) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(columnsSettings,
          'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(columnsSettings,
          'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(columnsSettings, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(columnsSettings, 'backgroundColor', '', settings),
      }
    };
  }

  // prettier-ignore
  public static createInitial(columnsSettings: ColumnsSettingsDefault, selectDropdown: HTMLElement,
      settings: ColumnSettingsInternal, index: number,
      onColumnUpdate: OnColumnUpdate): ColumnDetailsInitial {
    const columnSettings = settings || columnsSettings as ColumnSettingsInternal;
    ColumnSettingsWidthUtils.setMinWidthOnSettings(columnSettings, columnsSettings.cellStyle); // REF-36
    const {types, activeType} = ColumnTypesUtils.getProcessedTypes(columnSettings);
    return {
      elements: [],
      processedStyle: [],
      settings: columnSettings,
      headerStateColors: ColumnDetails.createHeaderStateColors(columnsSettings, settings),
      bordersOverwrittenBySiblings: {},
      types,
      activeType,
      selectDropdown: SelectDropdown.getDefaultObj(selectDropdown),
      index,
      onColumnUpdate,
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
