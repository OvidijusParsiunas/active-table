import {PaginationPositions, PaginationPositionSide} from '../../../types/pagination';
import {EditableTableComponent} from '../../../editable-table-component';

export interface Containers {
  top?: HTMLElement;
  bottom?: HTMLElement;
}

export class PaginationContainerElement {
  private static readonly CONTAINER_CLASS = 'pagination-container';
  private static readonly TOP_CONTAINER_ID = 'pagination-top-container';
  private static readonly BOTTOM_CONTAINER_ID = 'pagination-bottom-container';
  private static readonly COLUMN_CLASS = 'pagination-container-column';
  private static readonly LEFT_COLUMN_CLASS = 'pagination-container-left-column';
  private static readonly MIDDLE_COLUMN_CLASS = 'pagination-container-middle-column';
  private static readonly RIGHT_COLUMN_CLASS = 'pagination-container-right-column';

  public static addToContainer(side: PaginationPositionSide, containers: Containers, element: HTMLElement) {
    const container = (side.indexOf('top') >= 0 ? containers.top : containers.bottom) as HTMLElement;
    if (side.indexOf('left') >= 0) {
      container.children[0].appendChild(element);
    } else if (side.indexOf('middle') >= 0) {
      container.children[1].appendChild(element);
    } else {
      container.children[2].appendChild(element);
    }
  }

  private static createContainerColumn(columnNumber: string) {
    const column = document.createElement('div');
    column.style.gridColumn = columnNumber;
    column.classList.add(PaginationContainerElement.COLUMN_CLASS);
    return column;
  }

  private static createContainerElement() {
    const container = document.createElement('div');
    container.classList.add(PaginationContainerElement.CONTAINER_CLASS);
    const left = PaginationContainerElement.createContainerColumn('1');
    left.classList.add(PaginationContainerElement.LEFT_COLUMN_CLASS);
    container.appendChild(left);
    const middle = PaginationContainerElement.createContainerColumn('2');
    middle.classList.add(PaginationContainerElement.MIDDLE_COLUMN_CLASS);
    container.appendChild(middle);
    const right = PaginationContainerElement.createContainerColumn('3');
    right.classList.add(PaginationContainerElement.RIGHT_COLUMN_CLASS);
    container.appendChild(right);
    return container;
  }

  private static addContainer(parentEl: HTMLElement, id: string) {
    const container = PaginationContainerElement.createContainerElement();
    container.id = id;
    const insertionLocation = id === PaginationContainerElement.TOP_CONTAINER_ID ? 'beforebegin' : 'afterend';
    parentEl.insertAdjacentElement(insertionLocation, container);
    return container;
  }

  private static isContainerRequired(positions: Required<PaginationPositions>, containerPosition: 'top' | 'bottom') {
    const searchResult = Object.keys(positions).find((componentName) => {
      const position = positions[componentName as keyof PaginationPositions].side;
      return position.indexOf(containerPosition) >= 0;
    });
    return !!searchResult;
  }

  // we add a top and a bottom container if they are required
  public static addPaginationContainers(etc: EditableTableComponent) {
    const containers: Containers = {};
    const isTopRequired = PaginationContainerElement.isContainerRequired(etc.paginationInternal.positions, 'top');
    const isBottomRequired = PaginationContainerElement.isContainerRequired(etc.paginationInternal.positions, 'bottom');
    const {tableElementRef: table} = etc;
    const parentEl = etc.overflowInternal?.overflowContainer || table;
    if (!parentEl) return containers;
    if (isTopRequired) {
      const container = PaginationContainerElement.addContainer(parentEl, PaginationContainerElement.TOP_CONTAINER_ID);
      containers.top = container;
    }
    if (isBottomRequired) {
      const container = PaginationContainerElement.addContainer(parentEl, PaginationContainerElement.BOTTOM_CONTAINER_ID);
      containers.bottom = container;
    }
    return containers;
  }
}
