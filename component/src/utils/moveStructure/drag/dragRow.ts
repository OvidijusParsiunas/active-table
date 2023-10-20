import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {ActiveTable} from '../../../activeTable';
import {MoveRow} from '../moveRow';
import {Drag} from './drag';

// WORK - test when no index column

export class DragRow extends Drag {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly ROW_CLONE_CLASS = 'row-clone';
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_ROW_TOP_PX = 0;
  public static ROW: HTMLElement | null = null;
  public static CLONE_ROW: HTMLElement | null = null;
  private static IS_MOUSE_DOWN = false;
  private static ACTIVE_INDEX = 0;
  private static THRESHOLD_UP = 0;
  private static THRESHOLD_DOWN = 0;
  private static TARGET_UP_ROW?: HTMLElement;
  private static TARGET_DOWN_ROW?: HTMLElement;
  private static MAX_DOWN = 0;
  private static TARGET_LINE?: HTMLElement;
  // this are small interims where upon approaching the original row the target line is eventually hidden
  private static THRESHOLD_TO_NO_LINE_DOWN = -1;
  private static THRESHOLD_TO_NO_LINE_UP = -1;

  private static resetElements(realRow: HTMLElement) {
    DragRow.CLONE_ROW?.remove();
    const rowChildren = Array.from(realRow.children || []) as HTMLElement[];
    rowChildren.forEach((dataCell) => {
      dataCell.classList.remove(Drag.CELL_HIDDEN_CLASS);
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
    const height = `${(realRow.children[0] as HTMLElement).offsetHeight}px`;
    const rowChildren = Array.from(realRow.children || []) as HTMLElement[];
    (Array.from(cloneRow.children) as HTMLElement[]).forEach((cloneCell, index) => {
      cloneCell.style.width = `${rowChildren[index].offsetWidth}px`;
      cloneCell.style.height = height;
    });
    rowChildren.forEach((dataCell) => {
      dataCell.classList.add(Drag.CELL_HIDDEN_CLASS);
    });
    DragRow.appendTargetLine(tableBody);
  }

  private static calculateThresholdDown() {
    if (DragRow.TARGET_DOWN_ROW && DragRow.ROW) {
      DragRow.THRESHOLD_DOWN =
        DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2 - DragRow.ROW.offsetHeight;
    }
  }

  private static calculateThresholdUp() {
    if (DragRow.TARGET_UP_ROW) {
      DragRow.THRESHOLD_UP = DragRow.TARGET_UP_ROW.offsetTop + DragRow.TARGET_UP_ROW.offsetHeight / 2;
    }
  }

  private static initiateDragState(tableBody: HTMLElement, cloneRow: HTMLElement, realRow: HTMLElement) {
    DragRow.ROW = realRow;
    DragRow.TARGET_UP_ROW = DragRow.ROW.previousSibling as HTMLElement;
    DragRow.TARGET_DOWN_ROW = DragRow.ROW.nextSibling?.nextSibling as HTMLElement;
    if (!DragRow.TARGET_UP_ROW && DragRow.TARGET_DOWN_ROW?.children[0]?.id === AddNewRowElement.ID) return;
    DragRow.CLONE_ROW = cloneRow;
    DragRow.ACTIVE_ROW_TOP_PX = realRow.offsetTop;
    DragRow.ACTIVE_INDEX = 0;
    DragRow.calculateThresholdUp();
    DragRow.calculateThresholdDown();
    const rows = Array.from(tableBody.children) as HTMLElement[];
    Drag.ORIGINAL_INDEX = rows.findIndex((element) => element === DragRow.ROW);
    const addNewRowRow = rows[rows.length - 2].offsetHeight;
    DragRow.MAX_DOWN = tableBody.offsetHeight - DragRow.ROW.offsetHeight - addNewRowRow;
  }

  private static processRowCellsToDrag(tableBody: HTMLElement, cellElement: HTMLElement) {
    const realRow = cellElement.parentElement as HTMLElement;
    const cloneRow = realRow.cloneNode(true) as HTMLElement; // also clones the index and add column cells
    realRow?.insertAdjacentElement('afterend', cloneRow);
    DragRow.prepareElements(tableBody, cloneRow, realRow);
    DragRow.initiateDragState(tableBody, cloneRow, realRow);
  }

  public static applyEventsToElement(at: ActiveTable, draggableElement: HTMLElement, cellElement: HTMLElement) {
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    draggableElement.onmousedown = () => {
      DragRow.IS_MOUSE_DOWN = true;
    };
    draggableElement.onmousemove = () => {
      if (DragRow.IS_MOUSE_DOWN && !DragRow.ROW) {
        DragRow.INITIALISING_DRAG_PX += 1;
        if (DragRow.INITIALISING_DRAG_PX > Drag.DRAG_PX_TO_MOVE) {
          DragRow.processRowCellsToDrag(at._tableBodyElementRef as HTMLElement, cellElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, Drag.ORIGINAL_INDEX);
        }
      }
    };
  }

  private static moveTargetLine(targetLine: HTMLElement, top: number) {
    targetLine.style.opacity = '1';
    targetLine.style.top = `${top}px`;
  }

  // Upon approaching the original row the target line is hidden
  private static removeLineOnMoveDown(targetLine: HTMLElement) {
    targetLine.style.opacity = '0';
    DragRow.ACTIVE_INDEX = 0;
    DragRow.THRESHOLD_TO_NO_LINE_DOWN = -1;
    DragRow.calculateThresholdUp();
  }

  private static attemptSwitchUp(targetLine: HTMLElement) {
    if (DragRow.TARGET_UP_ROW && DragRow.ROW) {
      if (DragRow.TARGET_UP_ROW.previousSibling?.previousSibling === DragRow.ROW) {
        // this is small drag interim where upon approaching the original row the target line is eventually hidden
        DragRow.THRESHOLD_TO_NO_LINE_UP = DragRow.ROW.offsetTop + DragRow.ROW.offsetHeight / 2;
        DragRow.THRESHOLD_DOWN = DragRow.TARGET_UP_ROW.offsetTop + DragRow.TARGET_UP_ROW.offsetHeight / 2;
        DragRow.TARGET_DOWN_ROW = DragRow.TARGET_UP_ROW;
        DragRow.TARGET_UP_ROW = DragRow.ROW.previousSibling as HTMLElement;
        if (DragRow.TARGET_UP_ROW) {
          DragRow.calculateThresholdUp();
        } else {
          DragRow.THRESHOLD_UP = -1;
        }
      } else {
        DragRow.moveTargetLine(targetLine, DragRow.TARGET_UP_ROW.offsetTop - 3);
        DragRow.THRESHOLD_DOWN = DragRow.THRESHOLD_UP;
        DragRow.TARGET_DOWN_ROW = DragRow.TARGET_UP_ROW;
        DragRow.TARGET_UP_ROW = DragRow.TARGET_UP_ROW.previousSibling as HTMLElement;
        DragRow.calculateThresholdUp();
        DragRow.ACTIVE_INDEX -= 1;
      }
    }
  }

  // Upon approaching the original row the target line is hidden
  private static removeLineOnMoveUp(targetLine: HTMLElement) {
    targetLine.style.opacity = '0';
    DragRow.ACTIVE_INDEX = 0;
    DragRow.THRESHOLD_TO_NO_LINE_UP = -1;
    DragRow.calculateThresholdDown();
  }

  private static attemptSwitchDown(targetLine: HTMLElement) {
    if (DragRow.TARGET_DOWN_ROW) {
      if (DragRow.TARGET_DOWN_ROW.nextSibling === DragRow.ROW) {
        // this is small drag interim where upon approaching the original row the target line is eventually hidden
        DragRow.THRESHOLD_TO_NO_LINE_DOWN = DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight / 2;
        DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
        DragRow.THRESHOLD_UP = DragRow.TARGET_UP_ROW.offsetTop - DragRow.TARGET_UP_ROW.offsetHeight / 2;
        DragRow.TARGET_DOWN_ROW = DragRow.ROW?.nextSibling?.nextSibling as HTMLElement;
        DragRow.calculateThresholdDown();
      } else {
        DragRow.moveTargetLine(targetLine, DragRow.TARGET_DOWN_ROW.offsetTop + DragRow.TARGET_DOWN_ROW.offsetHeight - 3);
        DragRow.THRESHOLD_UP = DragRow.THRESHOLD_DOWN;
        DragRow.TARGET_UP_ROW = DragRow.TARGET_DOWN_ROW;
        DragRow.TARGET_DOWN_ROW = DragRow.TARGET_DOWN_ROW.nextSibling as HTMLElement;
        DragRow.calculateThresholdDown();
        DragRow.ACTIVE_INDEX += 1;
      }
    }
  }

  public static windowDrag(event: MouseEvent) {
    if (!DragRow.IS_DRAGGING_ALLOWED || !DragRow.TARGET_LINE || !DragRow.ROW || !DragRow.CLONE_ROW) return;
    const minimumDown = Math.max(0, DragRow.ACTIVE_ROW_TOP_PX + event.movementY);
    const newDimension = Math.min(minimumDown, DragRow.MAX_DOWN);
    DragRow.ACTIVE_ROW_TOP_PX = newDimension;
    DragRow.CLONE_ROW.style.top = `${DragRow.ACTIVE_ROW_TOP_PX}px`;
    if (DragRow.ACTIVE_ROW_TOP_PX > DragRow.THRESHOLD_DOWN) {
      DragRow.attemptSwitchDown(DragRow.TARGET_LINE);
    } else if (DragRow.ACTIVE_ROW_TOP_PX < DragRow.THRESHOLD_UP) {
      DragRow.attemptSwitchUp(DragRow.TARGET_LINE);
    } else if (DragRow.THRESHOLD_TO_NO_LINE_DOWN >= 0 && DragRow.THRESHOLD_TO_NO_LINE_DOWN < DragRow.ACTIVE_ROW_TOP_PX) {
      DragRow.removeLineOnMoveDown(DragRow.TARGET_LINE);
    } else if (DragRow.THRESHOLD_TO_NO_LINE_UP >= 0 && DragRow.THRESHOLD_TO_NO_LINE_UP > DragRow.ACTIVE_ROW_TOP_PX) {
      DragRow.removeLineOnMoveUp(DragRow.TARGET_LINE);
    }
  }

  public static windowMouseUp(at: ActiveTable) {
    DragRow.IS_MOUSE_DOWN = false;
    if (!DragRow.IS_DRAGGING_ALLOWED) return;
    if (DragRow.ROW) {
      DragRow.resetElements(DragRow.ROW);
      DragRow.ROW = null;
      DragRow.INITIALISING_DRAG_PX = 0;
      DragRow.move(at, DragRow.ACTIVE_INDEX, MoveRow.move);
    }
  }
}
