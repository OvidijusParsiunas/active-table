import {OuterContentPosition, OuterContainers} from '../../types/outerContainer';
import {FilesUtils} from './files/filesInternalUtils';
import {ActiveTable} from '../../activeTable';

type ContainerPositions = 'top' | 'bottom';

type PositionalComponents = {[key: string]: {position: OuterContentPosition}};

export class OuterContainerElements {
  private static readonly CONTAINER_CLASS = 'outer-container';
  private static readonly TOP_CONTAINER_ID = 'outer-top-container';
  private static readonly BOTTOM_CONTAINER_ID = 'outer-bottom-container';
  // REF-38
  private static readonly COLUMN_CLASS = 'outer-container-column';
  private static readonly COLUMN_INNER_CLASS = 'outer-container-column-inner';
  private static readonly COLUMN_CONTENT_CLASS = 'outer-container-column-content';
  private static readonly LEFT_COLUMN_CLASS = 'outer-container-left-column';
  private static readonly MIDDLE_COLUMN_CLASS = 'outer-container-middle-column';
  private static readonly RIGHT_COLUMN_CLASS = 'outer-container-right-column';

  // REF-38
  private static getColumnContentContainer(column: HTMLElement) {
    return column.children[0].children[0];
  }

  private static setContainerHeightBasedOnMiddleColumn(container: HTMLElement) {
    if (container.getBoundingClientRect().height === 0) {
      const contentContainer = OuterContainerElements.getColumnContentContainer(container.children[1] as HTMLElement);
      container.style.height = `${contentContainer.getBoundingClientRect().height}px`;
    }
  }

  private static setHeightsWhenOnlyMiddleColumns(containers: OuterContainers) {
    setTimeout(() => {
      if (containers.top) OuterContainerElements.setContainerHeightBasedOnMiddleColumn(containers.top);
      if (containers.bottom) OuterContainerElements.setContainerHeightBasedOnMiddleColumn(containers.bottom);
    });
  }

  // REF-38
  private static appendChildToColumn(column: HTMLElement, child: HTMLElement) {
    const contentContainer = OuterContainerElements.getColumnContentContainer(column);
    contentContainer.appendChild(child);
  }

  // REF-38
  public static addToContainer(position: OuterContentPosition, containers: OuterContainers, element: HTMLElement) {
    const container = (position.indexOf('top') >= 0 ? containers.top : containers.bottom) as HTMLElement;
    if (position.indexOf('left') >= 0) {
      OuterContainerElements.appendChildToColumn(container.children[0] as HTMLElement, element);
    } else if (position.indexOf('middle') >= 0) {
      OuterContainerElements.appendChildToColumn(container.children[1] as HTMLElement, element);
    } else {
      OuterContainerElements.appendChildToColumn(container.children[2] as HTMLElement, element);
    }
  }

  // REF-38
  // need an inner divs in order for the inserted components 'width' properties to work as CONTAINER_CLASS has width: 0px
  private static createContainerColumn(positionClass: string, columnNumber: string) {
    const column = document.createElement('div');
    column.classList.add(OuterContainerElements.COLUMN_CLASS, positionClass);
    const columnInnerContainer = document.createElement('div');
    columnInnerContainer.classList.add(OuterContainerElements.COLUMN_INNER_CLASS);
    const contentContainer = document.createElement('div');
    contentContainer.classList.add(OuterContainerElements.COLUMN_CONTENT_CLASS);
    columnInnerContainer.appendChild(contentContainer);
    column.appendChild(columnInnerContainer);
    column.style.gridColumn = columnNumber;
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

  private static addContainer(parentEl: HTMLElement, id: string, tableElement?: HTMLElement) {
    const container = OuterContainerElements.createContainerElement();
    container.id = id;
    if (tableElement?.style.fontFamily) container.style.fontFamily = tableElement.style.fontFamily; // REF-41
    const insertionLocation = id === OuterContainerElements.TOP_CONTAINER_ID ? 'beforebegin' : 'afterend';
    parentEl.insertAdjacentElement(insertionLocation, container);
    return container;
  }

  // can be reused for other positional components
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
    if (!isRequired && at.files?.buttons) {
      isRequired = !!at.files.buttons.find((button) => {
        const position = button.position || FilesUtils.DEFAULT_BUTTON_POSITION;
        return position.indexOf(containerPosition) >= 0;
      });
    }
    if (!isRequired && at.filter) isRequired = true; // WORK
    return isRequired;
  }

  // we create a top and a bottom container only if they are required
  public static create(at: ActiveTable) {
    const containers: OuterContainers = {};
    const isTopRequired = OuterContainerElements.isContainerRequired(at, 'top');
    const isBottomRequired = OuterContainerElements.isContainerRequired(at, 'bottom');
    const {_tableElementRef: tableEl} = at;
    const parentEl = at._overflow?.overflowContainer || tableEl;
    if (!parentEl) return containers;
    if (isTopRequired) {
      const container = OuterContainerElements.addContainer(parentEl, OuterContainerElements.TOP_CONTAINER_ID, tableEl);
      containers.top = container;
    }
    if (isBottomRequired) {
      const container = OuterContainerElements.addContainer(parentEl, OuterContainerElements.BOTTOM_CONTAINER_ID, tableEl);
      containers.bottom = container;
    }
    OuterContainerElements.setHeightsWhenOnlyMiddleColumns(containers);
    return containers;
  }
}
