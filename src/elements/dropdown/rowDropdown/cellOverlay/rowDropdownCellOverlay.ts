import {DropdownCellOverlayStyle, DropdownDisplaySettings} from '../../../../types/dropdownDisplaySettings';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DropdownCellOverlay} from '../../cellOverlay/dropdownCellOverlay';
import {ColumnDetailsT} from '../../../../types/columnDetails';

export class RowDropdownCellOverlay {
  private static readonly ROW_DROPDOWN_CELL_OVERLAY_CLASS = 'row-dropdown-cell-overlay';

  private static setDefault(columnDropdownCellOverlay: HTMLElement, overlayStyle?: DropdownCellOverlayStyle) {
    columnDropdownCellOverlay.style.backgroundColor = overlayStyle?.default?.backgroundColor || '';
  }

  public static resetDefaultColor(displaySettings: DropdownDisplaySettings, columnDropdownCellOverlay: HTMLElement) {
    const overlayStyle = displaySettings.overlayStyle;
    if (overlayStyle?.hover?.backgroundColor) {
      RowDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    }
  }

  public static setHoverColor(displaySettings: DropdownDisplaySettings, columnDetails: ColumnDetailsT) {
    const hoverBackgroundColor = displaySettings.overlayStyle?.hover?.backgroundColor;
    if (hoverBackgroundColor) columnDetails.columnDropdownCellOverlay.style.backgroundColor = hoverBackgroundColor;
  }

  public static hide(etc: EditableTableComponent, rowIndex: number) {
    const currentIndexCell = etc.hoveredElements.leftMostCell;
    setTimeout(() => {
      if (currentIndexCell !== etc.hoveredElements.leftMostCell) {
        const overlayElement = etc.rowDropdownCellOverlays[rowIndex].element;
        overlayElement.style.width = DropdownCellOverlay.HIDDEN_PX;
      }
    });
  }

  public static display(etc: EditableTableComponent, rowIndex: number) {
    const firstColumn = etc.columnsDetails[0];
    const rowDropdownCellOverlay = etc.rowDropdownCellOverlays[rowIndex].element;
    rowDropdownCellOverlay.style.width = DropdownCellOverlay.VISIBLE_PX;
    const firstColElement = firstColumn.elements[rowIndex];
    const {displayIndexColumn} = etc.auxiliaryTableContentInternal;
    const leftMostElement = (displayIndexColumn ? firstColElement.previousSibling : firstColElement) as HTMLElement;
    const onePercentWidth = leftMostElement.offsetHeight / 100;
    rowDropdownCellOverlay.style.height = `${onePercentWidth * 60}px`;
    rowDropdownCellOverlay.style.top = `${onePercentWidth * 20}px`;
    const left = displayIndexColumn ? firstColumn.elements[0].offsetWidth : 0;
    rowDropdownCellOverlay.style.left = `-${leftMostElement.offsetWidth + left}px`;
  }

  private static create(overlayStyle?: DropdownCellOverlayStyle) {
    const rowDropdownCellOverlay = document.createElement('div');
    rowDropdownCellOverlay.classList.add(RowDropdownCellOverlay.ROW_DROPDOWN_CELL_OVERLAY_CLASS);
    rowDropdownCellOverlay.classList.add(DropdownCellOverlay.DROPDOWN_CELL_OVERLAY_CLASS);
    rowDropdownCellOverlay.style.width = DropdownCellOverlay.HIDDEN_PX;
    // RowDropdownCellOverlay.setDefault(columnDropdownCellOverlay, overlayStyle);
    return rowDropdownCellOverlay;
  }

  private static getCellDividerElement(element: HTMLElement, displayIndexColumn: boolean) {
    let cellDividerElement = element.nextSibling as HTMLElement;
    // index column does not have a cell divider so using the first data column divider instead
    if (displayIndexColumn) cellDividerElement = cellDividerElement.nextSibling as HTMLElement;
    return cellDividerElement;
  }

  public static add(etc: EditableTableComponent, element: HTMLElement, rowIndex: number) {
    const rowDropdownCellOverlay = RowDropdownCellOverlay.create(etc.columnDropdownDisplaySettings.overlayStyle);
    const {displayIndexColumn} = etc.auxiliaryTableContentInternal;
    const cellDividerElement = RowDropdownCellOverlay.getCellDividerElement(element, displayIndexColumn);
    cellDividerElement.appendChild(rowDropdownCellOverlay);
    etc.rowDropdownCellOverlays.splice(rowIndex, 0, {
      element: rowDropdownCellOverlay,
      // these events are stubs and will be replaced by real ones in RowDropdownCellOverlayEvents.addCellEvents
      enter: () => {},
      leave: () => {},
    });
  }
}
