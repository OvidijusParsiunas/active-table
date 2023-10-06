import {CellElement} from '../../../elements/cell/cellElement';

export class DragColumn {
  // WORK - should hold this as component state
  private static readonly IS_DRAGGING_ALLOWED = false;
  private static readonly HEADER_CELL_HIDDEN_CLASS = 'header-cell-hidden';
  private static readonly HEADER_CELL_CLONE_CLASS = 'header-cell-clone';
  private static readonly DRAG_PX_TO_MOVE = 15;
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_CELL_LEFT_PX = 0;
  private static IS_MOUSE_DOWN_ON_CELL = false;
  public static ACTIVE_CELL: HTMLElement | null = null;
  private static CLONE_ELEMENTS: HTMLElement[] = [];

  private static processHeaderCellsToDefault(cellElement: HTMLElement) {
    const row = cellElement.parentElement?.children;
    DragColumn.CLONE_ELEMENTS.forEach((cell) => cell.remove());
    (Array.from(row || []) as HTMLElement[]).forEach((headerCell) => {
      if (headerCell.tagName === CellElement.HEADER_TAG) {
        headerCell.classList.remove(DragColumn.HEADER_CELL_HIDDEN_CLASS);
      }
    });
  }

  private static applyCloneHeaderCell(cloneCell: HTMLElement, headerCell: HTMLElement, lastElement: HTMLElement) {
    headerCell.classList.add(DragColumn.HEADER_CELL_HIDDEN_CLASS);
    cloneCell.classList.add(DragColumn.HEADER_CELL_CLONE_CLASS);
    cloneCell.style.left = `${headerCell.offsetLeft}px`;
    // last element does not have border right (.row > .cell:last-of-type) so we instead append before
    lastElement?.insertAdjacentElement('beforebegin', cloneCell);
    DragColumn.CLONE_ELEMENTS.push(cloneCell);
  }

  private static initiateDragState(cloneCell: HTMLElement, headerCell: HTMLElement) {
    DragColumn.ACTIVE_CELL = cloneCell;
    DragColumn.ACTIVE_CELL_LEFT_PX = headerCell.offsetLeft;
  }

  // WORK - disable dividers
  private static processHeaderCellsToDrag(cellElement: HTMLElement, lastElement: HTMLElement) {
    (Array.from(cellElement.parentElement?.children || []) as HTMLElement[]).forEach((headerCell) => {
      if (headerCell.tagName === CellElement.HEADER_TAG) {
        const cloneCell = headerCell.cloneNode(true) as HTMLElement;
        if (cellElement === headerCell) DragColumn.initiateDragState(cloneCell, headerCell);
        DragColumn.applyCloneHeaderCell(cloneCell, headerCell, lastElement);
      }
    });
  }

  // WORK - drag for the overlayClick method
  public static applyEventsToCell(cellElement: HTMLElement) {
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    cellElement.onmousedown = () => {
      DragColumn.IS_MOUSE_DOWN_ON_CELL = true;
    };
    cellElement.onmousemove = () => {
      if (DragColumn.IS_MOUSE_DOWN_ON_CELL && !DragColumn.ACTIVE_CELL) {
        DragColumn.INITIALISING_DRAG_PX += 1;
        if (DragColumn.INITIALISING_DRAG_PX > DragColumn.DRAG_PX_TO_MOVE) {
          const lastElement = cellElement.parentElement?.children[cellElement.parentElement.children.length - 1];
          DragColumn.processHeaderCellsToDrag(cellElement, lastElement as HTMLElement);
        }
      }
    };
  }

  public static windowDrag(dragCell: HTMLElement, event: MouseEvent) {
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    DragColumn.ACTIVE_CELL_LEFT_PX += event.movementX;
    dragCell.style.left = `${DragColumn.ACTIVE_CELL_LEFT_PX}px`;
  }

  public static windowMouseUp() {
    if (!DragColumn.IS_DRAGGING_ALLOWED) return;
    if (DragColumn.ACTIVE_CELL) {
      DragColumn.processHeaderCellsToDefault(DragColumn.ACTIVE_CELL);
      DragColumn.ACTIVE_CELL = null;
      DragColumn.INITIALISING_DRAG_PX = 0;
      DragColumn.ACTIVE_CELL_LEFT_PX = 0;
      DragColumn.IS_MOUSE_DOWN_ON_CELL = false;
    }
  }
}
