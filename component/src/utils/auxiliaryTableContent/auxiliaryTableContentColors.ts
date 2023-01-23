import {AuxiliaryContentCellsColors} from '../../types/auxiliaryTableContentCellsColors';
import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {HoverableElementStyleClient} from '../../types/hoverableElementStyle';
import {ActiveTable} from '../../activeTable';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContentColors {
  // prettier-ignore
  private static getInheritedDefaultColr(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableElementStyleClient) {
    return headerStyle?.default?.[key] || dataColors.default?.[key];
  }

  // prettier-ignore
  private static getInheritedHoverColor(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableElementStyleClient) {
    return (
      headerStyle?.hoverColors?.[key] ||
      dataColors.hover?.[key] ||
      AuxiliaryTableContentColors.getInheritedDefaultColr(key, dataColors, headerStyle)
    );
  }

  // prettier-ignore
  private static overwriteHeaderWithInheritedColors(cellColors: AuxiliaryContentCellsColors,
      headerStyleProps?: HoverableElementStyleClient) {
    cellColors.header = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedDefaultColr(
          'backgroundColor', cellColors.data, headerStyleProps),
        color: AuxiliaryTableContentColors.getInheritedDefaultColr('color', cellColors.data, headerStyleProps),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedHoverColor(
          'backgroundColor', cellColors.data, headerStyleProps),
        color: AuxiliaryTableContentColors.getInheritedHoverColor('color', cellColors.data, headerStyleProps),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties): string {
    const {auxiliaryTableContentInternal: {styleProps}, defaultCellHoverColors} = at;
    return styleProps?.hoverColors?.[colorKey] || styleProps?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || defaultCellHoverColors[colorKey];
  }

  // prettier-ignore
  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at.auxiliaryTableContentInternal.styleProps?.default?.[colorKey]
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
    const {auxiliaryTableContentInternal: {inheritHeaderStyle}, columnsSettings: {headerStyleProps}} = at;
    if (inheritHeaderStyle === undefined || inheritHeaderStyle === true) {
      AuxiliaryTableContentColors.overwriteHeaderWithInheritedColors(cellColors, headerStyleProps)
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
