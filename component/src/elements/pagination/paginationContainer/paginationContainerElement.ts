import {PaginationPositions, PaginationPositionSide} from '../../../types/pagination';
import {ActiveTable} from '../../../activeTable';

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

  private static setContainerHeightBasedOnMiddleColumn(container: HTMLElement) {
    if (container.getBoundingClientRect().height === 0) {
      container.style.height = `${container.children[1].getBoundingClientRect().height}px`;
    }
  }

  private static setHeightsWhenOnlyMiddleColumns(containers: Containers) {
    setTimeout(() => {
      if (containers.bottom) PaginationContainerElement.setContainerHeightBasedOnMiddleColumn(containers.bottom);
      if (containers.top) PaginationContainerElement.setContainerHeightBasedOnMiddleColumn(containers.top);
    });
  }

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

  private static createContainerColumn(sideClass: string, columnNumber: string) {
    const column = document.createElement('div');
    column.style.gridColumn = columnNumber;
    column.classList.add(PaginationContainerElement.COLUMN_CLASS, sideClass);
    return column;
  }

  private static createContainerElement() {
    const container = document.createElement('div');
    container.classList.add(PaginationContainerElement.CONTAINER_CLASS);
    const left = PaginationContainerElement.createContainerColumn(PaginationContainerElement.LEFT_COLUMN_CLASS, '1');
    container.appendChild(left);
    const middle = PaginationContainerElement.createContainerColumn(PaginationContainerElement.MIDDLE_COLUMN_CLASS, '2');
    container.appendChild(middle);
    const right = PaginationContainerElement.createContainerColumn(PaginationContainerElement.RIGHT_COLUMN_CLASS, '3');
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
  public static addPaginationContainers(at: ActiveTable) {
    const containers: Containers = {};
    const isTopRequired = PaginationContainerElement.isContainerRequired(at._pagination.positions, 'top');
    const isBottomRequired = PaginationContainerElement.isContainerRequired(at._pagination.positions, 'bottom');
    const {_tableElementRef} = at;
    const parentEl = at._overflow?.overflowContainer || _tableElementRef;
    if (!parentEl) return containers;
    if (isTopRequired) {
      const container = PaginationContainerElement.addContainer(parentEl, PaginationContainerElement.TOP_CONTAINER_ID);
      containers.top = container;
    }
    if (isBottomRequired) {
      const container = PaginationContainerElement.addContainer(parentEl, PaginationContainerElement.BOTTOM_CONTAINER_ID);
      containers.bottom = container;
    }
    PaginationContainerElement.setHeightsWhenOnlyMiddleColumns(containers);
    return containers;
  }
}
