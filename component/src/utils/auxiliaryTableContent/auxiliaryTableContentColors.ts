import {AuxiliaryContentCellsColors} from '../../types/auxiliaryTableContentCellsColors';
import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {HoverableStyles} from '../../types/hoverableStyles';
import {ActiveTable} from '../../activeTable';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContentColors {
  // prettier-ignore
  private static getInheritedDefaultColr(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableStyles) {
    return headerStyle?.default?.[key] || dataColors.default?.[key];
  }

  // prettier-ignore
  private static getInheritedHoverColor(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableStyles) {
    return (
      headerStyle?.hoverColors?.[key] ||
      dataColors.hover?.[key] ||
      AuxiliaryTableContentColors.getInheritedDefaultColr(key, dataColors, headerStyle)
    );
  }

  // prettier-ignore
  private static overwriteHeaderWithInheritedColors(cellColors: AuxiliaryContentCellsColors,
      headerStyles?: HoverableStyles) {
    cellColors.header = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedDefaultColr(
          'backgroundColor', cellColors.data, headerStyles),
        color: AuxiliaryTableContentColors.getInheritedDefaultColr('color', cellColors.data, headerStyles),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedHoverColor(
          'backgroundColor', cellColors.data, headerStyles),
        color: AuxiliaryTableContentColors.getInheritedHoverColor('color', cellColors.data, headerStyles),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties): string {
    const {auxiliaryTableContentInternal: {style}, defaultCellHoverColors} = at;
    return style?.hoverColors?.[colorKey] || style?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || defaultCellHoverColors[colorKey];
  }

  // prettier-ignore
  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at.auxiliaryTableContentInternal.style?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(at: ActiveTable) {
    const newCellColors = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getDefaultColorValue(at, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getDefaultColorValue(at, 'color'),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getHoverColorValue(at, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getHoverColorValue(at, 'color'),
      },
    };
    const {auxiliaryTableContentInternal: {cellColors}} = at;
    cellColors.data = newCellColors;
    cellColors.header = newCellColors;
    const {auxiliaryTableContentInternal: {inheritHeader}, columnsSettings: {headerStyles}} = at;
    if (inheritHeader === undefined || inheritHeader === true) {
      AuxiliaryTableContentColors.overwriteHeaderWithInheritedColors(cellColors, headerStyles)
    } else {
      cellColors.data.default.color = 'black';
      cellColors.header.default.color = 'black';
    }
  }

  public static getColorsBasedOnParam(cellColors: AuxiliaryContentCellsColors, rowIndex: number): CellStateColorsR {
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
