import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {CellElement} from '../../../elements/cell/cellElement';
import {ActiveTable} from '../../../activeTable';
import {MoveColumn} from '../moveColumn';

// WORK - test when no index column

export class DragRow {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly HEADER_CELL_HIDDEN_CLASS = 'header-cell-hidden';
  private static readonly ROW_CLONE_CLASS = 'row-clone';
  private static readonly DRAG_PX_TO_MOVE = 10;
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_ROW_TOP_PX = 0;
  private static IS_MOUSE_DOWN_ON_CELL = false;
  public static ACTIVE_ROW: HTMLElement | null = null;
  private static CLONE_CELLS: HTMLElement[] = [];
  private static DIVIDERS: HTMLElement[] = [];
  private static ACTIVE_INDEX = 0;
  private static ORIGINAL_INDEX = 0;
  private static THRESHOLD_UP = 0;
  private static THRESHOLD_DOWN = 0;
  private static TARGET_UP_ROW?: HTMLElement;
  private static TARGET_DOWN_ROW?: HTMLElement;
  private static CAN_SWITCH_UP = true;
  private static CAN_SWITCH_DOWN = true;
  private static MAX_DOWN = 0;

  private static TARGET_LINE?: HTMLElement;

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
  }

  private static initiateDragState(tableBody: HTMLElement, cloneRow: HTMLElement, realRow: HTMLElement) {
    DragRow.ACTIVE_ROW_TOP_PX = realRow.offsetTop;
    DragRow.ACTIVE_ROW = cloneRow;
    const previousRow = realRow.previousSibling as HTMLElement;
    const nextRow = realRow.nextSibling?.nextSibling as HTMLElement;
    DragRow.TARGET_UP_ROW = previousRow;
    if (DragRow.TARGET_UP_ROW) {
      DragRow.THRESHOLD_UP = previousRow.offsetTop + previousRow.offsetHeight / 2;
    }
    DragRow.THRESHOLD_DOWN = nextRow.offsetTop + nextRow.offsetHeight / 2 - realRow.offsetHeight;
    DragRow.TARGET_DOWN_ROW = nextRow;
    DragRow.CAN_SWITCH_UP = true;
    DragRow.CAN_SWITCH_DOWN = true;
    const targetLine = document.createElement('div');
    targetLine.classList.add('row-drag-target-line');
    targetLine.style.opacity = '0';
    DragRow.TARGET_LINE = targetLine;
    tableBody.appendChild(targetLine);
    DragRow.MAX_DOWN = tableBody.offsetHeight - realRow.offsetHeight;
  }

  private static processRowCellsToDrag(tableBody: HTMLElement, cellElement: HTMLElement) {
    const realRow = cellElement.parentElement as HTMLElement;
    const cloneRow = realRow.cloneNode(true) as HTMLElement; // also clones the index and add column cells
    realRow?.insertAdjacentElement('afterend', cloneRow);
    DragRow.applyCloneRow(cloneRow, realRow);
    DragRow.initiateDragState(tableBody, cloneRow, realRow);
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
          DragRow.processRowCellsToDrag(at._tableBodyElementRef as HTMLElement, cellElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, DragRow.ORIGINAL_INDEX);
        }
      }
    };
  }

  public static windowDrag(dragRow: HTMLElement, event: MouseEvent) {
    if (!DragRow.IS_DRAGGING_ALLOWED || !DragRow.TARGET_LINE) return;
    let newDimension = Math.max(0, DragRow.ACTIVE_ROW_TOP_PX + event.movementY);
    newDimension = Math.min(newDimension, DragRow.MAX_DOWN);
    DragRow.ACTIVE_ROW_TOP_PX = newDimension;
    dragRow.style.top = `${DragRow.ACTIVE_ROW_TOP_PX}px`;
    if (DragRow.ACTIVE_ROW_TOP_PX > DragRow.THRESHOLD_DOWN) {
      console.log('down');
      if (DragRow.TARGET_DOWN_ROW && DragRow.CAN_SWITCH_DOWN) {
        if ((DragRow.TARGET_DOWN_ROW.nextSibling as HTMLElement).id === 'last-visible-row') {
          DragRow.CAN_SWITCH_DOWN = false;
        }
        if (DragRow.TARGET_DOWN_ROW.nextSibling?.nextSibling === dragRow) {
          DragRow.TARGET_LINE.style.opacity = '0';
          DragRow.THRESHOLD_UP = DragRow.THRESHOLD_DOWN;
          DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
          DragRow.TARGET_DOWN_ROW = dragRow.nextSibling as HTMLElement;
          DragRow.THRESHOLD_DOWN = DragRow.TARGET_DOWN_ROW.offsetTop - DragRow.TARGET_DOWN_ROW.offsetHeight / 2;
        } else {
          DragRow.TARGET_LINE.style.opacity = '1';
          DragRow.TARGET_LINE.style.top = `${
            DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight - 3
          }px`;
          // if (DragRow.THRESHOLD_DOWN > DragRow.TARGET_DOWN_ROW.offsetTop) {
          DragRow.THRESHOLD_UP = DragRow.THRESHOLD_DOWN;
          DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
          DragRow.TARGET_DOWN_ROW = DragRow.TARGET_DOWN_ROW.nextSibling as HTMLElement;
          DragRow.THRESHOLD_DOWN =
            DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2 - dragRow.offsetHeight;
        }
        DragRow.CAN_SWITCH_UP = true;
      }
    } else if (DragRow.ACTIVE_ROW_TOP_PX < DragRow.THRESHOLD_UP) {
      console.log('up');
      if (DragRow.TARGET_UP_ROW && DragRow.CAN_SWITCH_UP) {
        if (DragRow.TARGET_UP_ROW.previousSibling === dragRow) {
          DragRow.TARGET_LINE.style.opacity = '0';
          DragRow.THRESHOLD_DOWN = DragRow.THRESHOLD_UP;
          DragRow.TARGET_DOWN_ROW = DragRow.TARGET_UP_ROW;
          DragRow.TARGET_UP_ROW = dragRow.previousSibling?.previousSibling as HTMLElement;
          if (DragRow.TARGET_UP_ROW) {
            DragRow.THRESHOLD_UP = DragRow.TARGET_UP_ROW.offsetTop + DragRow.TARGET_UP_ROW.offsetHeight / 2;
          }
        } else {
          DragRow.TARGET_LINE.style.opacity = '1';
          DragRow.TARGET_LINE.style.top = `${DragRow.TARGET_UP_ROW.offsetTop - 3}px`;
          DragRow.THRESHOLD_DOWN = DragRow.THRESHOLD_UP;
          DragRow.TARGET_DOWN_ROW = DragRow.TARGET_UP_ROW;
          DragRow.TARGET_UP_ROW = DragRow.TARGET_UP_ROW.previousSibling as HTMLElement;
          DragRow.THRESHOLD_UP = DragRow.TARGET_UP_ROW.offsetTop + DragRow.TARGET_UP_ROW.offsetHeight / 2;
        }
        if (!DragRow.TARGET_UP_ROW?.previousSibling) {
          DragRow.CAN_SWITCH_UP = false;
        }
        DragRow.CAN_SWITCH_DOWN = true;
      }
    }
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
      DragRow.DIVIDERS = [];
      DragRow.move(at);
    }
  }
}
