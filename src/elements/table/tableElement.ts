import {OverlayElementsParent} from '../overlaysElements/overlayElementsParent';
import {EditableTableComponent} from '../../editable-table-component';
import {AddNewRowElement} from '../row/addNewRowElement';
import {HeaderElement} from '../header/headerElement';
import {DataElement} from '../data/dataElement';
import {TableEvents} from './tableEvents';

export class TableElement {
  public static populate(etc: EditableTableComponent) {
    const headerElement = HeaderElement.create(etc);
    const dataElement = DataElement.create(etc);
    const overlayElementsParent = OverlayElementsParent.create(etc);
    const addRowElement = AddNewRowElement.create(etc);
    etc.coreElementsParentRef?.replaceChildren(headerElement, dataElement, addRowElement, overlayElementsParent);
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
    etc.tableElementRef = tableElement;
    const coreElementsParent = TableElement.createCoreElementsParent(tableElement);
    etc.coreElementsParentRef = coreElementsParent;
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
