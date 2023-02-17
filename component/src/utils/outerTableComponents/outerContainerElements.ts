import {OuterContainerContentPosition, OuterContainers} from '../../types/outerContainer';
import {CSVButtonsInternal} from '../../types/CSVInternal';
import {ActiveTable} from '../../activeTable';

type ContainerPositions = 'top' | 'bottom';

type PositionalComponents = {[key: string]: {position: OuterContainerContentPosition}};

export class OuterContainerElements {
  private static readonly CONTAINER_CLASS = 'outer-container';
  private static readonly TOP_CONTAINER_ID = 'outer-top-container';
  private static readonly BOTTOM_CONTAINER_ID = 'outer-bottom-container';
  private static readonly COLUMN_CLASS = 'outer-container-column';
  private static readonly LEFT_COLUMN_CLASS = 'outer-container-left-column';
  private static readonly MIDDLE_COLUMN_CLASS = 'outer-container-middle-column';
  private static readonly RIGHT_COLUMN_CLASS = 'outer-container-right-column';

  private static setContainerHeightBasedOnMiddleColumn(container: HTMLElement) {
    if (container.getBoundingClientRect().height === 0) {
      container.style.height = `${container.children[1].getBoundingClientRect().height}px`;
    }
  }

  private static setHeightsWhenOnlyMiddleColumns(containers: OuterContainers) {
    setTimeout(() => {
      if (containers.bottom) OuterContainerElements.setContainerHeightBasedOnMiddleColumn(containers.bottom);
      if (containers.top) OuterContainerElements.setContainerHeightBasedOnMiddleColumn(containers.top);
    });
  }

  // prettier-ignore
  public static addToContainer(position: OuterContainerContentPosition,
      containers: OuterContainers, element: HTMLElement) {
    const container = (position.indexOf('top') >= 0 ? containers.top : containers.bottom) as HTMLElement;
    if (position.indexOf('left') >= 0) {
      container.children[0].appendChild(element);
    } else if (position.indexOf('middle') >= 0) {
      container.children[1].appendChild(element);
    } else {
      container.children[2].appendChild(element);
    }
  }

  private static createContainerColumn(positionClass: string, columnNumber: string) {
    const column = document.createElement('div');
    column.style.gridColumn = columnNumber;
    column.classList.add(OuterContainerElements.COLUMN_CLASS, positionClass);
    return column;
  }

  private static createContainerElement() {
    const container = document.createElement('div');
    container.classList.add(OuterContainerElements.CONTAINER_CLASS);
    const left = OuterContainerElements.createContainerColumn(OuterContainerElements.LEFT_COLUMN_CLASS, '1');
    container.appendChild(left);
    const middle = OuterContainerElements.createContainerColumn(OuterContainerElements.MIDDLE_COLUMN_CLASS, '2');
    container.appendChild(middle);
    const right = OuterContainerElements.createContainerColumn(OuterContainerElements.RIGHT_COLUMN_CLASS, '3');
    container.appendChild(right);
    return container;
  }

  private static addContainer(parentEl: HTMLElement, id: string) {
    const container = OuterContainerElements.createContainerElement();
    container.id = id;
    const insertionLocation = id === OuterContainerElements.TOP_CONTAINER_ID ? 'beforebegin' : 'afterend';
    parentEl.insertAdjacentElement(insertionLocation, container);
    return container;
  }

  private static isRequired(object: PositionalComponents, conPosition: ContainerPositions) {
    return !!Object.keys(object).find((componentName) => {
      const {position} = object[componentName];
      return position.indexOf(conPosition) >= 0;
    });
  }

  private static isContainerRequired(at: ActiveTable, containerPosition: ContainerPositions) {
    let isRequired = false;
    // checking client object as _pagination has default properties
    if (at.pagination) {
      isRequired = OuterContainerElements.isRequired(at._pagination.positions, containerPosition);
    }
    if (!isRequired && at._csvButtons) {
      isRequired = OuterContainerElements.isRequired(at._csvButtons as Required<CSVButtonsInternal>, containerPosition);
    }
    return isRequired;
  }

  // we create a top and a bottom container only if they are required
  public static create(at: ActiveTable) {
    const containers: OuterContainers = {};
    const isTopRequired = OuterContainerElements.isContainerRequired(at, 'top');
    const isBottomRequired = OuterContainerElements.isContainerRequired(at, 'bottom');
    const {_tableElementRef} = at;
    const parentEl = at._overflow?.overflowContainer || _tableElementRef;
    if (!parentEl) return containers;
    if (isTopRequired) {
      const container = OuterContainerElements.addContainer(parentEl, OuterContainerElements.TOP_CONTAINER_ID);
      containers.top = container;
    }
    if (isBottomRequired) {
      const container = OuterContainerElements.addContainer(parentEl, OuterContainerElements.BOTTOM_CONTAINER_ID);
      containers.bottom = container;
    }
    OuterContainerElements.setHeightsWhenOnlyMiddleColumns(containers);
    return containers;
  }
}
