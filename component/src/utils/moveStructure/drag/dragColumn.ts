import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {CellElement} from '../../../elements/cell/cellElement';
import {ArrayUtils} from '../../array/arrayUtils';
import {ActiveTable} from '../../../activeTable';
import {MoveColumn} from '../moveColumn';

export class DragColumn {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly CELL_HIDDEN_CLASS = 'cell-hidden';
  private static readonly HEADER_CELL_CLONE_CLASS = 'header-cell-clone';
  private static readonly HEADER_CELL_CLONE_ANIMATION_CLASS = 'header-cell-clone-animation';
  private static readonly DRAG_PX_TO_MOVE = 10;
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_CELL_LEFT_PX = 0;
  private static IS_MOUSE_DOWN = false;
  public static CELL: HTMLElement | null = null;
  private static CLONE_CELLS: HTMLElement[] = [];
  private static REAL_CELLS: HTMLElement[] = [];
  private static DIVIDERS: HTMLElement[] = [];
  private static ACTIVE_INDEX = 0;
  private static ORIGINAL_INDEX = 0;
  private static THRESHOLD_RIGHT = 0;
  private static THRESHOLD_LEFT = 0;
  private static CAN_SWITCH_RIGHT = true;
  private static CAN_SWITCH_LEFT = true;
  private static MAX_LEFT = 0;

  private static move(at: ActiveTable) {
    const moveByNumber = DragColumn.ACTIVE_INDEX - DragColumn.ORIGINAL_INDEX - 1;
    if (moveByNumber === 0) return;
    const isMoveRight = moveByNumber > 0;
    const delta = isMoveRight ? 1 : -1;
    for (let i = 0; i < Math.abs(moveByNumber); i += 1) {
      MoveColumn.move(at, DragColumn.ORIGINAL_INDEX + i * delta, isMoveRight);
    }
    // in timeout to allow move to finish processing
    setTimeout(() => FocusedCellUtils.purge(at._focusedElements.cell), 5);
  }

  private static setHeaderElementsToDefault(cellElement: HTMLElement) {
    const row = cellElement.parentElement?.children;
    DragColumn.CLONE_CELLS.forEach((cell) => cell.remove());
    (Array.from(row || []) as HTMLElement[]).forEach((headerCell) => {
      if (headerCell.tagName === CellElement.HEADER_TAG) {
        headerCell.classList.remove(DragColumn.CELL_HIDDEN_CLASS);
      }
    });
    DragColumn.DIVIDERS.forEach((element) => {
      element.style.pointerEvents = '';
    });
  }

  private static applyCloneHeaderCell(cloneCell: HTMLElement, headerCell: HTMLElement, lastElement: HTMLElement) {
    headerCell.classList.add(DragColumn.CELL_HIDDEN_CLASS);
    cloneCell.classList.add(DragColumn.HEADER_CELL_CLONE_CLASS);
    cloneCell.classList.add(DragColumn.HEADER_CELL_CLONE_ANIMATION_CLASS);
    cloneCell.style.left = `${headerCell.offsetLeft}px`;
    // last element does not have border right (.row > .cell:last-of-type) so we instead append before
    lastElement?.insertAdjacentElement('beforebegin', cloneCell);
    DragColumn.CLONE_CELLS.push(cloneCell);
    DragColumn.REAL_CELLS.push(headerCell);
  }

  private static getThreshold(cellElement: HTMLElement, delta: number) {
    const nextCell = DragColumn.REAL_CELLS[DragColumn.ACTIVE_INDEX + delta];
    const dragOffset = Math.min(cellElement.offsetWidth / 2, nextCell.offsetWidth / 2) * delta;
    return cellElement.offsetLeft + dragOffset;
  }

  private static initiateDragState(cellElement: HTMLElement) {
    DragColumn.ACTIVE_INDEX = DragColumn.REAL_CELLS.findIndex((element) => cellElement === element);
    DragColumn.CELL = DragColumn.CLONE_CELLS[DragColumn.ACTIVE_INDEX];
    DragColumn.CELL.classList.remove(DragColumn.HEADER_CELL_CLONE_ANIMATION_CLASS);
    DragColumn.ACTIVE_CELL_LEFT_PX = cellElement.offsetLeft;
    DragColumn.THRESHOLD_LEFT = DragColumn.getThreshold(cellElement, -1);
    DragColumn.THRESHOLD_RIGHT = DragColumn.getThreshold(cellElement, 1);
    const lastCell = DragColumn.REAL_CELLS[DragColumn.REAL_CELLS.length - 1];
    DragColumn.MAX_LEFT = lastCell.offsetLeft + lastCell.offsetWidth - cellElement.offsetWidth;
    DragColumn.ORIGINAL_INDEX = DragColumn.ACTIVE_INDEX - 1;
    DragColumn.CAN_SWITCH_LEFT = true;
    DragColumn.CAN_SWITCH_RIGHT = true;
  }

  private static processHeaderCellsToDrag(cellElement: HTMLElement, lastElement: HTMLElement) {
    (Array.from(cellElement.parentElement?.children || []) as HTMLElement[]).forEach((headerElement) => {
      if (headerElement.tagName === CellElement.HEADER_TAG) {
        const cloneCell = headerElement.cloneNode(true) as HTMLElement; // also clones the index and add column cells
        DragColumn.applyCloneHeaderCell(cloneCell, headerElement, lastElement);
      } else {
        headerElement.style.pointerEvents = 'none';
        DragColumn.DIVIDERS.push(headerElement);
      }
    });
    DragColumn.initiateDragState(cellElement);
  }

  public static applyEventsToElement(at: ActiveTable, draggableElement: HTMLElement, cellElement: HTMLElement) {
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    draggableElement.onmousedown = () => {
      DragColumn.IS_MOUSE_DOWN = true;
    };
    draggableElement.onmousemove = () => {
      if (DragColumn.IS_MOUSE_DOWN && !DragColumn.CELL) {
        DragColumn.INITIALISING_DRAG_PX += 1;
        if (DragColumn.INITIALISING_DRAG_PX > DragColumn.DRAG_PX_TO_MOVE) {
          const lastElement = cellElement.parentElement?.children[cellElement.parentElement.children.length - 1];
          DragColumn.processHeaderCellsToDrag(cellElement, lastElement as HTMLElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, DragColumn.ORIGINAL_INDEX);
        }
      }
    };
  }

  private static switch(delta: number) {
    const currentCell = DragColumn.CLONE_CELLS[DragColumn.ACTIVE_INDEX];
    const nextCell = DragColumn.CLONE_CELLS[DragColumn.ACTIVE_INDEX + delta];
    if (delta > 0) {
      DragColumn.THRESHOLD_LEFT = DragColumn.THRESHOLD_RIGHT - 5;
      DragColumn.THRESHOLD_RIGHT = currentCell.offsetLeft + nextCell.offsetWidth;
      nextCell.style.left = `${nextCell.offsetLeft - currentCell.offsetWidth}px`;
    } else {
      DragColumn.THRESHOLD_RIGHT = DragColumn.THRESHOLD_LEFT + 5;
      DragColumn.THRESHOLD_LEFT = currentCell.offsetLeft - nextCell.offsetWidth;
      nextCell.style.left = `${nextCell.offsetLeft + currentCell.offsetWidth}px`;
    }
    // swapping as need to manipulate real reference
    ArrayUtils.swap(DragColumn.CLONE_CELLS, DragColumn.ACTIVE_INDEX, DragColumn.ACTIVE_INDEX + delta);
    DragColumn.ACTIVE_INDEX += delta;
  }

  public static windowDrag(dragCell: HTMLElement, event: MouseEvent) {
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    let newDimension = Math.max(0, DragColumn.ACTIVE_CELL_LEFT_PX + event.movementX);
    newDimension = Math.min(newDimension, DragColumn.MAX_LEFT);
    DragColumn.ACTIVE_CELL_LEFT_PX = newDimension;
    dragCell.style.left = `${DragColumn.ACTIVE_CELL_LEFT_PX}px`;
    if (DragColumn.ACTIVE_CELL_LEFT_PX > DragColumn.THRESHOLD_RIGHT) {
      if (!DragColumn.CAN_SWITCH_RIGHT) return;
      DragColumn.switch(1);
      DragColumn.CAN_SWITCH_LEFT = true;
      DragColumn.CAN_SWITCH_RIGHT = DragColumn.ACTIVE_INDEX + 2 < DragColumn.CLONE_CELLS.length;
    } else if (DragColumn.ACTIVE_CELL_LEFT_PX < DragColumn.THRESHOLD_LEFT) {
      if (!DragColumn.CAN_SWITCH_LEFT) return;
      DragColumn.switch(-1);
      DragColumn.CAN_SWITCH_RIGHT = true;
      DragColumn.CAN_SWITCH_LEFT = DragColumn.ACTIVE_INDEX - 1 > 0;
    }
  }

  public static windowMouseUp(at: ActiveTable) {
    DragColumn.IS_MOUSE_DOWN = false;
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    if (DragColumn.CELL) {
      DragColumn.setHeaderElementsToDefault(DragColumn.CELL);
      DragColumn.CELL = null;
      DragColumn.INITIALISING_DRAG_PX = 0;
      DragColumn.ACTIVE_CELL_LEFT_PX = 0;
      DragColumn.CLONE_CELLS = [];
      DragColumn.REAL_CELLS = [];
      DragColumn.DIVIDERS = [];
      DragColumn.move(at);
    }
  }
}
