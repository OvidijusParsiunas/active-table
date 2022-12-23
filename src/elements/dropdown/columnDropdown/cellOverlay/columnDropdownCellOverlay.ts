import {ColumnDropdownSettings, DropdownCellOverlayStyle} from '../../../../types/columnDropdownSettings';
import {ColumnDropdownCellOverlayEvents} from './columnDropdownCellOverlayEvents';
import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnDetailsT} from '../../../../types/columnDetails';

export class ColumnDropdownCellOverlay {
  private static readonly HIDDEN_WIDTH_PX = '0px';
  private static readonly VISIBLE_WIDTH_PX = '8px';
  private static readonly COLUMN_DROPDOWN_CELL_OVERLAY_CLASS = 'column-dropdown-cell-overlay';

  private static setDefault(columnDropdownCellOverlay: HTMLElement, overlayStyle?: DropdownCellOverlayStyle) {
    columnDropdownCellOverlay.style.backgroundColor = overlayStyle?.default?.backgroundColor || '';
  }

  public static resetDefaultColor(columnDropdownSettings: ColumnDropdownSettings, columnDropdownCellOverlay: HTMLElement) {
    const overlayStyle = columnDropdownSettings.overlayStyle;
    if (overlayStyle?.hover?.backgroundColor) {
      ColumnDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    }
  }

  public static setHoverColor(columnDropdownSettings: ColumnDropdownSettings, columnDetails: ColumnDetailsT) {
    const hoverBackgroundColor = columnDropdownSettings.overlayStyle?.hover?.backgroundColor;
    if (hoverBackgroundColor) columnDetails.columnDropdownCellOverlay.style.backgroundColor = hoverBackgroundColor;
  }

  public static hide(etc: EditableTableComponent, columnDetails: ColumnDetailsT) {
    const {columnDropdownCellOverlay} = columnDetails;
    const currentHeader = etc.hoveredElements.headerCell;
    setTimeout(() => {
      if (currentHeader !== etc.hoveredElements.headerCell) {
        columnDropdownCellOverlay.style.height = ColumnDropdownCellOverlay.HIDDEN_WIDTH_PX;
      }
    });
  }

  // what happens when sizer is removed etc
  public static display(columnDetails: ColumnDetailsT) {
    const {columnDropdownCellOverlay, elements} = columnDetails;
    columnDropdownCellOverlay.style.height = ColumnDropdownCellOverlay.VISIBLE_WIDTH_PX;
    const onePercentWidth = elements[0].offsetWidth / 100;
    columnDropdownCellOverlay.style.width = `${onePercentWidth * 50}px`;
    columnDropdownCellOverlay.style.right = `${onePercentWidth * 25}px`;
  }

  private static create(overlayStyle?: DropdownCellOverlayStyle) {
    const columnDropdownCellOverlay = document.createElement('div');
    columnDropdownCellOverlay.classList.add(ColumnDropdownCellOverlay.COLUMN_DROPDOWN_CELL_OVERLAY_CLASS);
    columnDropdownCellOverlay.style.height = ColumnDropdownCellOverlay.HIDDEN_WIDTH_PX;
    ColumnDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    return columnDropdownCellOverlay;
  }

  public static add(etc: EditableTableComponent, columnIndex: number) {
    const columnDropdownCellOverlay = ColumnDropdownCellOverlay.create(etc.columnDropdownSettings.overlayStyle);
    const headerCell = etc.columnsDetails[columnIndex].elements[0];
    const cellDividerElement = headerCell.nextSibling as HTMLElement;
    cellDividerElement.appendChild(columnDropdownCellOverlay);
    ColumnDropdownCellOverlayEvents.setEvents(etc, columnIndex, columnDropdownCellOverlay);
    return columnDropdownCellOverlay;
  }
}
