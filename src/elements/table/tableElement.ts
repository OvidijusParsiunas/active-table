import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../editable-table-component';
import {OverlayElements} from '../../types/overlayElements';
import {AddNewRowElement} from '../row/addNewRowElement';
import {TableRow} from '../../types/tableContents';
import {Dropdown} from '../dropdown/dropdown';
import {TableEvents} from './tableEvents';

export class TableElement {
  public static addAuxiliaryElements(tableElement: HTMLElement, overlayElementsState: OverlayElements) {
    const dropdownElenent = Dropdown.create();
    tableElement.appendChild(dropdownElenent);
    overlayElementsState.columnDropdown = dropdownElenent;
  }

  private static addAuxiliaryBodyElements(etc: EditableTableComponent) {
    // add new row element
    if (etc.displayAddRowCell) {
      const addNewRowElement = AddNewRowElement.create(etc);
      etc.tableBodyElementRef?.appendChild(addNewRowElement);
    }
    // full table overlay element
    etc.overlayElementsState.fullTableOverlay = FullTableOverlayElement.create(etc);
    etc.tableBodyElementRef?.appendChild(etc.overlayElementsState.fullTableOverlay);
  }

  // WORK - switch
  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    TableElement.addAuxiliaryBodyElements(etc);
    // header/data rows
    etc.contents.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(etc, rowIndex, false, row));
  }

  private static createTableBody() {
    return document.createElement('tbody');
  }

  private static createTableElement(etc: EditableTableComponent) {
    const tableElement = document.createElement('table');
    Object.assign(tableElement.style, etc.tableStyle);
    tableElement.onmousedown = TableEvents.onMouseDown.bind(etc);
    tableElement.onmouseup = TableEvents.onMouseUp.bind(etc);
    tableElement.onmousemove = TableEvents.onMouseMove.bind(etc);
    tableElement.onmouseleave = TableEvents.onMouseLeave.bind(etc);
    return tableElement;
  }

  public static createBase(etc: EditableTableComponent) {
    etc.tableElementRef = TableElement.createTableElement(etc);
    etc.tableBodyElementRef = TableElement.createTableBody();
    etc.tableElementRef.appendChild(etc.tableBodyElementRef);
    return etc.tableElementRef;
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
