import {CellStateColorProperties, DefaultCellHoverColors} from '../../types/cellStateColors';

export class CellHighlightUtils {
  public static fade(cellElement: HTMLElement, defaultColorProperties?: CellStateColorProperties) {
    cellElement.style.backgroundColor = defaultColorProperties?.backgroundColor || '';
    cellElement.style.color = defaultColorProperties?.color || '';
  }

  public static highlight(cellElement: HTMLElement, hoverColorProperties?: CellStateColorProperties) {
    if (hoverColorProperties?.backgroundColor) cellElement.style.backgroundColor = hoverColorProperties.backgroundColor;
    if (hoverColorProperties?.color) cellElement.style.color = hoverColorProperties.color;
  }

  public static unsetDefaultHoverProperties(defaultCellHoverColors: DefaultCellHoverColors) {
    defaultCellHoverColors.backgroundColor = '';
    defaultCellHoverColors.color = '';
  }

  public static getDefaultHoverProperties(): DefaultCellHoverColors {
    return {backgroundColor: '#f7f7f7', color: ''};
  }
}
