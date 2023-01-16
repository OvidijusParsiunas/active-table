import {DropdownDisplaySettings, DropdownCellOverlayStyle} from '../../../../types/dropdownDisplaySettings';
import {DropdownCellOverlay} from '../../cellOverlay/dropdownCellOverlay';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {ActiveTable} from '../../../../activeTable';

export class ColumnDropdownCellOverlay {
  private static readonly COLUMN_DROPDOWN_CELL_OVERLAY_CLASS = 'column-dropdown-cell-overlay';

  private static setDefault(columnDropdownCellOverlay: HTMLElement, overlayStyle?: DropdownCellOverlayStyle) {
    columnDropdownCellOverlay.style.backgroundColor = overlayStyle?.default?.backgroundColor || '';
  }

  public static resetDefaultColor(displaySettings: DropdownDisplaySettings, columnDropdownCellOverlay: HTMLElement) {
    const overlayStyle = displaySettings.overlayStyle;
    if (overlayStyle?.hover?.backgroundColor) {
      ColumnDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    }
  }

  public static setHoverColor(displaySettings: DropdownDisplaySettings, columnDetails: ColumnDetailsT) {
    const hoverBackgroundColor = displaySettings.overlayStyle?.hover?.backgroundColor;
    if (hoverBackgroundColor) columnDetails.columnDropdownCellOverlay.style.backgroundColor = hoverBackgroundColor;
  }

  public static hide(at: ActiveTable, columnDetails: ColumnDetailsT) {
    const {columnDropdownCellOverlay} = columnDetails;
    const currentHeader = at.hoveredElements.headerCell;
    setTimeout(() => {
      if (currentHeader !== at.hoveredElements.headerCell) {
        columnDropdownCellOverlay.style.height = DropdownCellOverlay.HIDDEN_PX;
      }
    });
  }

  private static setHorizontalDimensions(columnDetails: ColumnDetailsT) {
    const {columnDropdownCellOverlay, elements} = columnDetails;
    const onePercentWidth = elements[0].offsetWidth / 100;
    columnDropdownCellOverlay.style.width = `${onePercentWidth * 50}px`;
    columnDropdownCellOverlay.style.right = `${onePercentWidth * 25}px`;
  }

  public static display(columnDetails: ColumnDetailsT) {
    columnDetails.columnDropdownCellOverlay.style.height = DropdownCellOverlay.VISIBLE_PX;
    ColumnDropdownCellOverlay.setHorizontalDimensions(columnDetails);
  }

  private static isDisplayed(columnDropdownCellOverlay: HTMLElement) {
    return columnDropdownCellOverlay.style.height === DropdownCellOverlay.VISIBLE_PX;
  }

  public static updateIfDisplayed(columnDetails: ColumnDetailsT) {
    if (ColumnDropdownCellOverlay.isDisplayed(columnDetails.columnDropdownCellOverlay)) {
      ColumnDropdownCellOverlay.setHorizontalDimensions(columnDetails);
    }
  }

  private static create(overlayStyle?: DropdownCellOverlayStyle) {
    const columnDropdownCellOverlay = document.createElement('div');
    columnDropdownCellOverlay.classList.add(DropdownCellOverlay.DROPDOWN_CELL_OVERLAY_CLASS);
    columnDropdownCellOverlay.classList.add(ColumnDropdownCellOverlay.COLUMN_DROPDOWN_CELL_OVERLAY_CLASS);
    columnDropdownCellOverlay.style.height = DropdownCellOverlay.HIDDEN_PX;
    ColumnDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    return columnDropdownCellOverlay;
  }

  public static add(at: ActiveTable, columnIndex: number) {
    const columnDropdownCellOverlay = ColumnDropdownCellOverlay.create(at.columnDropdownDisplaySettings.overlayStyle);
    const headerCell = at.columnsDetails[columnIndex].elements[0];
    const cellDividerElement = headerCell.nextSibling as HTMLElement;
    cellDividerElement.appendChild(columnDropdownCellOverlay);
    return columnDropdownCellOverlay;
  }
}
