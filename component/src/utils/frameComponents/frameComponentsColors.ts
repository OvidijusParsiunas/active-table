import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {FrameComponentsCellsColors} from '../../types/frameComponentsCellsColors';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsColors {
  // prettier-ignore
  private static getInheritedHeaderColors(at: ActiveTable) {
    const {_defaultColumnsSettings: {headerStyles, cellStyle}} = at;
    return {
      default: {
        backgroundColor: headerStyles?.default?.backgroundColor || cellStyle?.backgroundColor || '',
        color: headerStyles?.default?.color || cellStyle?.color || '',
      },
      hover: {
        backgroundColor: headerStyles?.hoverColors?.backgroundColor || headerStyles?.default?.backgroundColor
          || cellStyle?.backgroundColor || at._defaultCellHoverColors.backgroundColor,
        color: headerStyles?.hoverColors?.color || headerStyles?.default?.color
          || cellStyle?.color || at._defaultCellHoverColors.color,
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties): string {
    const {_frameComponents: {styles}, _defaultCellHoverColors} = at;
    return styles?.hoverColors?.[colorKey] || styles?.default?.[colorKey]
      || at._defaultColumnsSettings.cellStyle?.[colorKey] || _defaultCellHoverColors[colorKey];
  }

  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at._frameComponents.styles?.default?.[colorKey] || at._defaultColumnsSettings.cellStyle?.[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(at: ActiveTable) {
    const newCellColors = {
      default: {
        backgroundColor: FrameComponentsColors.getDefaultColorValue(at, 'backgroundColor'),
        color: FrameComponentsColors.getDefaultColorValue(at, 'color'),
      },
      hover: {
        backgroundColor: FrameComponentsColors.getHoverColorValue(at, 'backgroundColor'),
        color: FrameComponentsColors.getHoverColorValue(at, 'color'),
      },
    };
    const {_frameComponents: {cellColors, inheritHeaderColors}} = at;
    cellColors.data = newCellColors;
    cellColors.header = inheritHeaderColors ? FrameComponentsColors.getInheritedHeaderColors(at) : newCellColors;
  }

  public static getColorsBasedOnParam(cellColors: FrameComponentsCellsColors, rowIndex: number): CellStateColorsR {
    const {data, header} = cellColors;
    return rowIndex === 0 ? header : data;
  }

  public static getDefaultCellColors() {
    return {
      data: {
        default: {backgroundColor: '', color: ''},
        hover: {backgroundColor: '', color: ''},
      },
      header: {
        default: {backgroundColor: '', color: ''},
        hover: {backgroundColor: '', color: ''},
      },
    };
  }
}
