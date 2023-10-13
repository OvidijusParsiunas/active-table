import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {CellElement} from '../../../elements/cell/cellElement';
import {ArrayUtils} from '../../array/arrayUtils';
import {ActiveTable} from '../../../activeTable';
import {MoveColumn} from '../moveColumn';

// WORK - test when no index column

export class DragRow {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly HEADER_CELL_HIDDEN_CLASS = 'header-cell-hidden';
  private static readonly ROW_CLONE_CLASS = 'row-clone';
  private static readonly HEADER_CELL_CLONE_ANIMATION_CLASS = 'header-cell-clone-animation';
  private static readonly DRAG_PX_TO_MOVE = 10;
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_ROW_TOP_PX = 0;
  private static IS_MOUSE_DOWN_ON_CELL = false;
  public static ACTIVE_ROW: HTMLElement | null = null;
  private static CLONE_CELLS: HTMLElement[] = [];
  private static REAL_CELLS: HTMLElement[] = [];
  private static DIVIDERS: HTMLElement[] = [];
  private static ACTIVE_INDEX = 0;
  private static ORIGINAL_INDEX = 0;
  private static THRESHOLD_RIGHT = 0;
  private static THRESHOLD_LEFT = 0;
  private static CAN_SWITCH_RIGHT = true;
  private static CAN_SWITCH_LEFT = true;
  private static MAX_UP = 0;

  private static move(at: ActiveTable) {
    const moveByNumber = DragRow.ACTIVE_INDEX - DragRow.ORIGINAL_INDEX - 1;
    if (moveByNumber === 0) return;
    const isMoveRight = moveByNumber > 0;
    const delta = isMoveRight ? 1 : -1;
    for (let i = 0; i < Math.abs(moveByNumber); i += 1) {
      MoveColumn.move(at, DragRow.ORIGINAL_INDEX + i * delta, isMoveRight);
      // in timeout to allow move to finish processing
      setTimeout(() => {
        FocusedCellUtils.purge(at._focusedElements.cell);
      }, 5);
    }
  }

  private static setHeaderElementsToDefault(cellElement: HTMLElement) {
    const row = cellElement.parentElement?.children;
    DragRow.CLONE_CELLS.forEach((cell) => cell.remove());
    (Array.from(row || []) as HTMLElement[]).forEach((headerCell) => {
      if (headerCell.tagName === CellElement.HEADER_TAG) {
        headerCell.classList.remove(DragRow.HEADER_CELL_HIDDEN_CLASS);
      }
    });
    DragRow.DIVIDERS.forEach((element) => {
      element.style.pointerEvents = '';
    });
  }

  private static applyCloneRow(cloneRow: HTMLElement, realRow: HTMLElement) {
    cloneRow.classList.add(DragRow.ROW_CLONE_CLASS);
    cloneRow.style.top = `${realRow.offsetTop}px`;
    const rowChildren = Array.from(realRow.children || []) as HTMLElement[];
    (Array.from(cloneRow.children) as HTMLElement[]).forEach((cloneCell, index) => {
      cloneCell.style.width = `${rowChildren[index].offsetWidth}px`;
    });
    rowChildren.forEach((dataCell) => {
      dataCell.classList.add(DragRow.HEADER_CELL_HIDDEN_CLASS);
    });
    // cloneCell.classList.add(DragRow.HEADER_CELL_CLONE_CLASS);
    // cloneCell.classList.add(DragRow.HEADER_CELL_CLONE_ANIMATION_CLASS);
    // cloneCell.style.left = `${dataCell.offsetLeft}px`;
    // cloneCell.style.width = `${dataCell.offsetWidth}px`;
    // last element does not have border right (.row > .cell:last-of-type) so we instead append before
    // lastElement?.insertAdjacentElement('beforebegin', cloneCell);
    // DragRow.CLONE_CELLS.push(cloneCell);
    // DragRow.REAL_CELLS.push(dataCell);
  }

  private static getThreshold(cellElement: HTMLElement, delta: number) {
    const nextCell = DragRow.REAL_CELLS[DragRow.ACTIVE_INDEX + delta];
    const dragOffset = Math.min(cellElement.offsetWidth / 2, nextCell.offsetWidth / 2) * delta;
    return cellElement.offsetLeft + dragOffset;
  }

  private static initiateDragState(cloneRow: HTMLElement, realRow: HTMLElement) {
    DragRow.ACTIVE_ROW_TOP_PX = realRow.offsetTop;
    DragRow.ACTIVE_ROW = cloneRow;
    // DragRow.ACTIVE_INDEX = DragRow.REAL_CELLS.findIndex((element) => cellElement === element);
    // DragRow.ACTIVE_CELL = DragRow.CLONE_CELLS[DragRow.ACTIVE_INDEX];
    // DragRow.ACTIVE_CELL.classList.remove(DragRow.HEADER_CELL_CLONE_ANIMATION_CLASS);
    // DragRow.ACTIVE_CELL_TOP_PX = cellElement.offsetTop;
    // DragRow.THRESHOLD_LEFT = DragRow.getThreshold(cellElement, -1);
    // DragRow.THRESHOLD_RIGHT = DragRow.getThreshold(cellElement, 1);
    // const lastCell = DragRow.REAL_CELLS[DragRow.REAL_CELLS.length - 1];
    // DragRow.MAX_UP = lastCell.offsetLeft + lastCell.offsetWidth - cellElement.offsetWidth;
    // DragRow.ORIGINAL_INDEX = DragRow.ACTIVE_INDEX - 1;
    // DragRow.CAN_SWITCH_LEFT = true;
    // DragRow.CAN_SWITCH_RIGHT = true;
  }

  private static processRowCellsToDrag(cellElement: HTMLElement) {
    const realRow = cellElement.parentElement as HTMLElement;
    const cloneRow = realRow.cloneNode(true) as HTMLElement; // also clones the index and add column cells
    realRow?.insertAdjacentElement('afterend', cloneRow);
    DragRow.applyCloneRow(cloneRow, realRow);
    DragRow.initiateDragState(cloneRow, realRow);
  }

  public static applyEventsToCell(at: ActiveTable, draggableElement: HTMLElement, cellElement: HTMLElement) {
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    draggableElement.onmousedown = () => {
      DragRow.IS_MOUSE_DOWN_ON_CELL = true;
    };
    draggableElement.onmousemove = () => {
      if (DragRow.IS_MOUSE_DOWN_ON_CELL && !DragRow.ACTIVE_ROW) {
        DragRow.INITIALISING_DRAG_PX += 1;
        if (DragRow.INITIALISING_DRAG_PX > DragRow.DRAG_PX_TO_MOVE) {
          DragRow.processRowCellsToDrag(cellElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, DragRow.ORIGINAL_INDEX);
        }
      }
    };
  }

  private static switch(delta: number) {
    const currentCell = DragRow.CLONE_CELLS[DragRow.ACTIVE_INDEX];
    const nextCell = DragRow.CLONE_CELLS[DragRow.ACTIVE_INDEX + delta];
    if (delta > 0) {
      DragRow.THRESHOLD_LEFT = DragRow.THRESHOLD_RIGHT - 5;
      DragRow.THRESHOLD_RIGHT = currentCell.offsetLeft + nextCell.offsetWidth;
      nextCell.style.left = `${nextCell.offsetLeft - currentCell.offsetWidth}px`;
    } else {
      DragRow.THRESHOLD_RIGHT = DragRow.THRESHOLD_LEFT + 5;
      DragRow.THRESHOLD_LEFT = currentCell.offsetLeft - nextCell.offsetWidth;
      nextCell.style.left = `${nextCell.offsetLeft + currentCell.offsetWidth}px`;
    }
    // swapping as need to manipulate real reference
    ArrayUtils.swap(DragRow.CLONE_CELLS, DragRow.ACTIVE_INDEX, DragRow.ACTIVE_INDEX + delta);
    DragRow.ACTIVE_INDEX += delta;
  }

  public static windowDrag(dragRow: HTMLElement, event: MouseEvent) {
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    const newDimension = Math.max(0, DragRow.ACTIVE_ROW_TOP_PX + event.movementY);
    // newDimension = Math.min(newDimension, DragRow.MAX_UP);
    DragRow.ACTIVE_ROW_TOP_PX = newDimension;
    dragRow.style.top = `${DragRow.ACTIVE_ROW_TOP_PX}px`;
    // if (DragRow.ACTIVE_CELL_TOP_PX > DragRow.THRESHOLD_RIGHT) {
    //   if (!DragRow.CAN_SWITCH_RIGHT) return;
    //   DragRow.switch(1);
    //   DragRow.CAN_SWITCH_LEFT = true;
    //   DragRow.CAN_SWITCH_RIGHT = DragRow.ACTIVE_INDEX + 2 < DragRow.CLONE_CELLS.length;
    // } else if (DragRow.ACTIVE_CELL_TOP_PX < DragRow.THRESHOLD_LEFT) {
    //   if (!DragRow.CAN_SWITCH_LEFT) return;
    //   DragRow.switch(-1);
    //   DragRow.CAN_SWITCH_RIGHT = true;
    //   DragRow.CAN_SWITCH_LEFT = DragRow.ACTIVE_INDEX - 1 > 0;
    // }
  }

  public static windowMouseUp(at: ActiveTable) {
    DragRow.IS_MOUSE_DOWN_ON_CELL = false;
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    if (DragRow.ACTIVE_ROW) {
      DragRow.setHeaderElementsToDefault(DragRow.ACTIVE_ROW);
      DragRow.ACTIVE_ROW = null;
      DragRow.INITIALISING_DRAG_PX = 0;
      DragRow.ACTIVE_ROW_TOP_PX = 0;
      DragRow.CLONE_CELLS = [];
      DragRow.REAL_CELLS = [];
      DragRow.DIVIDERS = [];
      DragRow.move(at);
    }
  }
}
