import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {ActiveTable} from '../../../activeTable';
import {MoveRow} from '../moveRow';

// WORK - test when no index column

export class DragRow {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly CELL_HIDDEN_CLASS = 'cell-hidden';
  private static readonly ROW_CLONE_CLASS = 'row-clone';
  private static readonly DRAG_PX_TO_MOVE = 10;
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_ROW_TOP_PX = 0;
  private static IS_MOUSE_DOWN = false;
  public static ROW: HTMLElement | null = null;
  private static ORIGINAL_INDEX = 0;
  public static CLONE_ROW: HTMLElement | null = null;
  private static ACTIVE_INDEX = 0;
  private static THRESHOLD_UP = 0;
  private static THRESHOLD_DOWN = 0;
  private static TARGET_UP_ROW?: HTMLElement;
  private static TARGET_DOWN_ROW?: HTMLElement;
  private static CAN_SWITCH_UP = true;
  private static CAN_SWITCH_DOWN = true;
  private static MAX_DOWN = 0;
  // think these can be set at the start
  private static THRESHOLD_TO_NO_LINE_DOWN = -1;
  private static THRESHOLD_TO_NO_LINE_UP = -1;
  private static TARGET_LINE?: HTMLElement;

  private static move(at: ActiveTable) {
    const moveByNumber = DragRow.ACTIVE_INDEX;
    if (moveByNumber === 0) return;
    const isMoveDown = moveByNumber > 0;
    const delta = isMoveDown ? 1 : -1;
    for (let i = 0; i < Math.abs(moveByNumber); i += 1) {
      MoveRow.move(at, DragRow.ORIGINAL_INDEX + i * delta, isMoveDown);
    }
    // in timeout to allow move to finish processing
    setTimeout(() => FocusedCellUtils.purge(at._focusedElements.cell), 5);
  }

  private static resetElements(realRow: HTMLElement) {
    DragRow.CLONE_ROW?.remove();
    const rowChildren = Array.from(realRow.children || []) as HTMLElement[];
    rowChildren.forEach((dataCell) => {
      dataCell.classList.remove(DragRow.CELL_HIDDEN_CLASS);
    });
    DragRow.TARGET_LINE?.remove();
  }

  private static appendTargetLine(tableBody: HTMLElement) {
    DragRow.TARGET_LINE = document.createElement('div');
    DragRow.TARGET_LINE.classList.add('row-drag-target-line');
    DragRow.TARGET_LINE.style.opacity = '0';
    tableBody.appendChild(DragRow.TARGET_LINE);
  }

  private static prepareElements(tableBody: HTMLElement, cloneRow: HTMLElement, realRow: HTMLElement) {
    cloneRow.classList.add(DragRow.ROW_CLONE_CLASS);
    cloneRow.style.top = `${realRow.offsetTop}px`;
    const rowChildren = Array.from(realRow.children || []) as HTMLElement[];
    (Array.from(cloneRow.children) as HTMLElement[]).forEach((cloneCell, index) => {
      cloneCell.style.width = `${rowChildren[index].offsetWidth}px`;
    });
    rowChildren.forEach((dataCell) => {
      dataCell.classList.add(DragRow.CELL_HIDDEN_CLASS);
    });
    DragRow.appendTargetLine(tableBody);
  }

  private static initiateDragState(tableBody: HTMLElement, cloneRow: HTMLElement, realRow: HTMLElement) {
    DragRow.ACTIVE_ROW_TOP_PX = realRow.offsetTop;
    DragRow.ACTIVE_INDEX = 0;
    DragRow.CLONE_ROW = cloneRow;
    DragRow.ROW = realRow;
    DragRow.ORIGINAL_INDEX = Array.from(tableBody.children).findIndex((element) => element === DragRow.ROW);
    const previousRow = DragRow.ROW.previousSibling as HTMLElement;
    DragRow.TARGET_UP_ROW = previousRow;
    if (DragRow.TARGET_UP_ROW) DragRow.THRESHOLD_UP = previousRow.offsetTop + previousRow.offsetHeight / 2;
    const nextRow = DragRow.ROW.nextSibling?.nextSibling as HTMLElement;
    DragRow.THRESHOLD_DOWN = nextRow.offsetTop + nextRow.offsetHeight / 2 - DragRow.ROW.offsetHeight;
    DragRow.TARGET_DOWN_ROW = nextRow;
    DragRow.CAN_SWITCH_UP = !!previousRow?.previousSibling;
    DragRow.CAN_SWITCH_DOWN = (nextRow as HTMLElement).id !== 'last-visible-row';
    DragRow.MAX_DOWN = tableBody.offsetHeight - DragRow.ROW.offsetHeight;
  }

  private static processRowCellsToDrag(tableBody: HTMLElement, cellElement: HTMLElement) {
    const realRow = cellElement.parentElement as HTMLElement;
    const cloneRow = realRow.cloneNode(true) as HTMLElement; // also clones the index and add column cells
    realRow?.insertAdjacentElement('afterend', cloneRow);
    DragRow.prepareElements(tableBody, cloneRow, realRow);
    DragRow.initiateDragState(tableBody, cloneRow, realRow);
  }

  public static applyEventsToCell(at: ActiveTable, draggableElement: HTMLElement, cellElement: HTMLElement) {
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    draggableElement.onmousedown = () => {
      DragRow.IS_MOUSE_DOWN = true;
    };
    draggableElement.onmousemove = () => {
      if (DragRow.IS_MOUSE_DOWN && !DragRow.ROW) {
        DragRow.INITIALISING_DRAG_PX += 1;
        if (DragRow.INITIALISING_DRAG_PX > DragRow.DRAG_PX_TO_MOVE) {
          DragRow.processRowCellsToDrag(at._tableBodyElementRef as HTMLElement, cellElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, DragRow.ORIGINAL_INDEX);
        }
      }
    };
  }

  public static windowDrag(event: MouseEvent) {
    if (!DragRow.IS_DRAGGING_ALLOWED || !DragRow.TARGET_LINE || !DragRow.ROW || !DragRow.CLONE_ROW) return;
    let newDimension = Math.max(0, DragRow.ACTIVE_ROW_TOP_PX + event.movementY);
    newDimension = Math.min(newDimension, DragRow.MAX_DOWN);
    DragRow.ACTIVE_ROW_TOP_PX = newDimension;
    DragRow.CLONE_ROW.style.top = `${DragRow.ACTIVE_ROW_TOP_PX}px`;
    if (DragRow.ACTIVE_ROW_TOP_PX > DragRow.THRESHOLD_DOWN) {
      if (DragRow.TARGET_DOWN_ROW && DragRow.CAN_SWITCH_DOWN) {
        console.log('down');
        if (DragRow.TARGET_DOWN_ROW.nextSibling === DragRow.ROW) {
          DragRow.THRESHOLD_TO_NO_LINE_DOWN = DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2;
          DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
          DragRow.THRESHOLD_UP = DragRow.TARGET_UP_ROW.offsetTop - DragRow.TARGET_UP_ROW.offsetHeight / 2;
          DragRow.TARGET_DOWN_ROW = DragRow.ROW.nextSibling?.nextSibling as HTMLElement;
          DragRow.THRESHOLD_DOWN =
            DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2 - DragRow.ROW.offsetHeight;
        } else {
          DragRow.TARGET_LINE.style.opacity = '1';
          DragRow.TARGET_LINE.style.top = `${
            DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight - 3
          }px`;
          DragRow.THRESHOLD_UP = DragRow.THRESHOLD_DOWN;
          DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
          DragRow.TARGET_DOWN_ROW = DragRow.TARGET_DOWN_ROW.nextSibling as HTMLElement;
          DragRow.THRESHOLD_DOWN =
            DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2 - DragRow.ROW.offsetHeight;
        }
        if (DragRow.TARGET_DOWN_ROW.id === 'last-visible-row') {
          DragRow.CAN_SWITCH_DOWN = false;
        }
        DragRow.CAN_SWITCH_UP = true;
        DragRow.ACTIVE_INDEX += 1;
      }
    } else if (DragRow.ACTIVE_ROW_TOP_PX < DragRow.THRESHOLD_UP) {
      if (DragRow.TARGET_UP_ROW && DragRow.CAN_SWITCH_UP) {
        console.log('up');
        if (DragRow.TARGET_UP_ROW.previousSibling?.previousSibling === DragRow.ROW) {
          DragRow.THRESHOLD_TO_NO_LINE_UP = DragRow.ROW.offsetTop + DragRow.ROW.offsetHeight / 2;
          DragRow.THRESHOLD_DOWN = DragRow.TARGET_UP_ROW.offsetTop + DragRow.TARGET_UP_ROW.offsetHeight / 2;
          DragRow.TARGET_DOWN_ROW = DragRow.TARGET_UP_ROW;
          DragRow.TARGET_UP_ROW = DragRow.ROW.previousSibling as HTMLElement;
          const previousRow = DragRow.ROW.previousSibling as HTMLElement;
          DragRow.THRESHOLD_UP = previousRow ? previousRow.offsetTop + previousRow.offsetHeight / 2 : -1;
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
        DragRow.ACTIVE_INDEX -= 1;
      }
    } else if (DragRow.THRESHOLD_TO_NO_LINE_DOWN >= 0 && DragRow.THRESHOLD_TO_NO_LINE_DOWN < DragRow.ACTIVE_ROW_TOP_PX) {
      console.log('3');
      DragRow.TARGET_LINE.style.opacity = '0';
      const previousRow = DragRow.ROW.previousSibling as HTMLElement;
      if (DragRow.TARGET_UP_ROW) {
        DragRow.THRESHOLD_UP = previousRow.offsetTop + previousRow.offsetHeight / 2;
      }
      DragRow.THRESHOLD_TO_NO_LINE_DOWN = -1;
    } else if (DragRow.THRESHOLD_TO_NO_LINE_UP >= 0 && DragRow.THRESHOLD_TO_NO_LINE_UP > DragRow.ACTIVE_ROW_TOP_PX) {
      DragRow.TARGET_LINE.style.opacity = '0';
      const nextRow = DragRow.ROW.nextSibling?.nextSibling as HTMLElement;
      DragRow.THRESHOLD_DOWN = nextRow.offsetTop + nextRow.offsetHeight / 2 - DragRow.ROW.offsetHeight;
      DragRow.THRESHOLD_TO_NO_LINE_UP = -1;
    }
  }

  public static windowMouseUp(at: ActiveTable) {
    DragRow.IS_MOUSE_DOWN = false;
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    if (DragRow.ROW) {
      DragRow.resetElements(DragRow.ROW);
      DragRow.ROW = null;
      DragRow.INITIALISING_DRAG_PX = 0;
      DragRow.move(at);
    }
  }
}
