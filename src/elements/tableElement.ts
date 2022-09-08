import {EditableTableComponent} from '../editable-table-component';
import {AddNewRowElement} from './row/addNewRowElement';
import {HeaderElement} from './header/headerElement';
import {TableEvents} from './table/tableEvents';
import {DataElement} from './data/dataElement';

export class TableElement {
  public static populate(etc: EditableTableComponent) {
    HeaderElement.create(etc);
    DataElement.create(etc);
    const addRowElement = AddNewRowElement.create(etc);
    etc.coreElementsParentRef?.replaceChildren(
      etc.headerElementRef as HTMLElement,
      etc.dataElementRef as HTMLElement,
      addRowElement
    );
  }

  private static addOverlayElements(tableElement: HTMLElement) {
    const overlayElementsParent = document.createElement('div');
    tableElement.appendChild(overlayElementsParent);
    return overlayElementsParent;
  }

  private static createCoreElementsParent(tableElement: HTMLElement) {
    const coreElements = document.createElement('div');
    tableElement.appendChild(coreElements);
    return coreElements;
  }

  private static createTableElement(etc: EditableTableComponent) {
    const tableElement = document.createElement('div');
    tableElement.classList.add('table');
    tableElement.onmousedown = TableEvents.onMouseDown.bind(etc);
    tableElement.onmouseup = TableEvents.onMouseUp.bind(etc);
    tableElement.onmousemove = TableEvents.onMouseMove.bind(etc);
    tableElement.onmouseleave = TableEvents.onMouseLeave.bind(etc);
    return tableElement;
  }

  public static createBase(etc: EditableTableComponent) {
    const tableElement = TableElement.createTableElement(etc);
    const coreElementsParent = TableElement.createCoreElementsParent(tableElement);
    etc.coreElementsParentRef = coreElementsParent;
    const overlayElementsParent = TableElement.addOverlayElements(tableElement);
    etc.overlayElementsParentRef = overlayElementsParent;
    return tableElement;
  }
}

// strategy for adding a new column element

// table must contain a child component to encapsulate header, data, add new row button
// const innerContentsElement = document.createElement('div');
// tableElement.appendChild(innerContentsElement);
// .table class must have display: flex

// the populate method must be updated as follows
// etc.coreElementsParentRef?.children[0].replaceChildren(etc.headerElementRef, etc.dataElementRef, addRowElement);
// const addColumnElement = document.createElement('div');
// addColumnElement.style.width = '20px';
// addColumnElement.textContent = '+';
// etc.coreElementsParentRef?.appendChild(addColumnElement);
