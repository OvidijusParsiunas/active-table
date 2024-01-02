import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CellElement} from '../../../elements/cell/cellElement';
import {ArrayUtils} from '../../array/arrayUtils';
import {ActiveTable} from '../../../activeTable';
import {MoveColumn} from '../moveColumn';
import {DragRow} from './dragRow';
import {Drag} from './drag';

export class DragColumn extends Drag {
  private static readonly HEADER_CELL_CLONE_CLASS = 'header-cell-clone';
  private static readonly HEADER_CELL_CLONE_ANIMATION_CLASS = 'header-cell-clone-animation';
  private static INITIALISING_DRAG_PX = 0;
  private static ACTIVE_CELL_LEFT_PX = 0;
  private static IS_MOUSE_DOWN = false;
  private static CLONE_CELLS: HTMLElement[] = [];
  private static REAL_CELLS: HTMLElement[] = [];
  private static DIVIDERS: HTMLElement[] = [];
  private static ACTIVE_INDEX = 0;
  private static THRESHOLD_RIGHT = 0;
  private static THRESHOLD_LEFT = 0;
  private static MAX_LEFT = 0;
  private static MIN_LEFT = 0;

  private static setHeaderElementsToDefault(cellElement: HTMLElement) {
    const row = cellElement.parentElement?.children;
    DragColumn.CLONE_CELLS.forEach((cell) => cell.remove());
    (Array.from(row || []) as HTMLElement[]).forEach((headerCell) => {
      if (headerCell.tagName === CellElement.HEADER_TAG) {
        headerCell.classList.remove(Drag.CELL_HIDDEN_CLASS);
      }
    });
    DragColumn.DIVIDERS.forEach((element) => {
      element.style.pointerEvents = '';
    });
  }

  private static applyCloneHeaderCell(clone: HTMLElement, header: HTMLElement, lastElement: HTMLElement, height: string) {
    header.classList.add(Drag.CELL_HIDDEN_CLASS);
    clone.classList.add(DragColumn.HEADER_CELL_CLONE_CLASS);
    clone.classList.add(DragColumn.HEADER_CELL_CLONE_ANIMATION_CLASS);
    clone.style.left = `${header.offsetLeft}px`;
    clone.style.height = height; // cannot set style to 100% as it does not work in safari
    // last element does not have border right (.row > .cell:last-of-type) so we instead append before
    lastElement?.insertAdjacentElement('beforebegin', clone);
    DragColumn.CLONE_CELLS.push(clone);
    DragColumn.REAL_CELLS.push(header);
  }

  private static getThreshold(cellElement: HTMLElement, delta: number) {
    const nextCell = DragColumn.REAL_CELLS[DragColumn.ACTIVE_INDEX + delta];
    const dragOffset = Math.min(cellElement.offsetWidth / 2, nextCell?.offsetWidth / 2) * delta;
    return cellElement.offsetLeft + dragOffset;
  }

  private static initiateDragState(at: ActiveTable, cellElement: HTMLElement) {
    DragColumn.ACTIVE_INDEX = DragColumn.REAL_CELLS.findIndex((element) => cellElement === element);
    if (DragColumn.ACTIVE_INDEX + 2 >= DragColumn.CLONE_CELLS.length && DragColumn.ACTIVE_INDEX - 1 <= 0) return;
    at._focusedElements.colDragEl = DragColumn.CLONE_CELLS[DragColumn.ACTIVE_INDEX];
    at._focusedElements.colDragEl.classList.remove(DragColumn.HEADER_CELL_CLONE_ANIMATION_CLASS);
    DragColumn.ACTIVE_CELL_LEFT_PX = cellElement.offsetLeft;
    DragColumn.THRESHOLD_LEFT = DragColumn.getThreshold(cellElement, -1);
    DragColumn.THRESHOLD_RIGHT = DragColumn.getThreshold(cellElement, 1);
    const firstCell = DragColumn.REAL_CELLS[0];
    DragColumn.MIN_LEFT = firstCell.classList.contains(IndexColumn.INDEX_CELL_CLASS) ? firstCell.offsetWidth : 0;
    const lastCell = DragColumn.REAL_CELLS[DragColumn.REAL_CELLS.length - 1];
    const maxOffset = lastCell.classList.contains(AddNewColumnElement.ADD_COLUMN_CELL_CLASS) ? 0 : lastCell.offsetWidth;
    DragColumn.MAX_LEFT = lastCell.offsetLeft + maxOffset - cellElement.offsetWidth;
    const isIndexDisplayed = DragColumn.REAL_CELLS[0].classList.contains(IndexColumn.INDEX_CELL_CLASS);
    Drag.ORIGINAL_INDEX = DragColumn.ACTIVE_INDEX - (isIndexDisplayed ? 1 : 0);
  }

  private static processHeaderCellsToDrag(at: ActiveTable, cellElement: HTMLElement, lastElement: HTMLElement) {
    const cellHeight = `${cellElement.offsetHeight}px`;
    (Array.from(cellElement.parentElement?.children || []) as HTMLElement[]).forEach((headerElement) => {
      if (headerElement.tagName === CellElement.HEADER_TAG) {
        const cloneCell = headerElement.cloneNode(true) as HTMLElement; // also clones the index and add column cells
        DragColumn.applyCloneHeaderCell(cloneCell, headerElement, lastElement, cellHeight);
      } else {
        headerElement.style.pointerEvents = 'none';
        DragColumn.DIVIDERS.push(headerElement);
      }
    });
    DragColumn.initiateDragState(at, cellElement);
  }

  public static applyEventsToElement(at: ActiveTable, draggableElement: HTMLElement, cellElement: HTMLElement) {
    if (at.dragColumns === false) return;
    draggableElement.onmousedown = () => {
      DragColumn.IS_MOUSE_DOWN = true;
    };
    draggableElement.onmousemove = () => {
      if (DragColumn.IS_MOUSE_DOWN && !at._focusedElements.colDragEl) {
        DragColumn.INITIALISING_DRAG_PX += 1;
        if (DragColumn.INITIALISING_DRAG_PX > Drag.DRAG_PX_TO_MOVE) {
          const lastElement = cellElement.parentElement?.children[cellElement.parentElement.children.length - 1];
          DragColumn.processHeaderCellsToDrag(at, cellElement, lastElement as HTMLElement);
          FocusedCellUtils.set(at._focusedElements.cell, cellElement, 0, Drag.ORIGINAL_INDEX);
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

  public static windowDrag(at: ActiveTable, dragCell: HTMLElement, event: MouseEvent) {
    if (at.dragColumns === false) return;
    const minimumLeft = Math.max(DragColumn.MIN_LEFT, DragColumn.ACTIVE_CELL_LEFT_PX + event.movementX);
    const newDimension = Math.min(minimumLeft, DragColumn.MAX_LEFT);
    DragColumn.ACTIVE_CELL_LEFT_PX = newDimension;
    dragCell.style.left = `${DragColumn.ACTIVE_CELL_LEFT_PX}px`;
    if (DragColumn.ACTIVE_CELL_LEFT_PX > DragColumn.THRESHOLD_RIGHT) {
      DragColumn.switch(1);
    } else if (DragColumn.ACTIVE_CELL_LEFT_PX < DragColumn.THRESHOLD_LEFT) {
      DragColumn.switch(-1);
    }
  }

  public static windowMouseUp(at: ActiveTable) {
    DragColumn.IS_MOUSE_DOWN = false;
    if (at.dragColumns === false || !at._focusedElements.colDragEl) return;
    DragColumn.setHeaderElementsToDefault(at._focusedElements.colDragEl);
    delete at._focusedElements.colDragEl;
    DragColumn.INITIALISING_DRAG_PX = 0;
    DragColumn.ACTIVE_CELL_LEFT_PX = 0;
    DragColumn.CLONE_CELLS = [];
    DragColumn.DIVIDERS = [];
    const isIndexDisplayed = DragColumn.REAL_CELLS[0].classList.contains(IndexColumn.INDEX_CELL_CLASS);
    DragRow.move(at, DragColumn.ACTIVE_INDEX - Drag.ORIGINAL_INDEX - (isIndexDisplayed ? 1 : 0), MoveColumn.move);
    DragColumn.REAL_CELLS = [];
  }
}
