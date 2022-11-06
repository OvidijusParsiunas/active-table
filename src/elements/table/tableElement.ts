import {MaximumColumns} from '../../utils/insertRemoveStructure/insert/maximumColumns';
import {StaticTableWidthUtils} from '../../utils/staticTable/staticTableWidthUtils';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {OverlayElements} from '../../types/overlayElements';
import {AddNewRowElement} from '../row/addNewRowElement';
import {Browser} from '../../utils/browser/browser';
import {TableRow} from '../../types/tableContents';
import {TableEvents} from './tableEvents';

export class TableElement {
  // prettier-ignore
  public static addAuxiliaryElements(etc: EditableTableComponent,
      tableElement: HTMLElement, overlayElementsState: OverlayElements, areHeadersEditable: boolean) {
    // full table overlay for column dropdown
    const fullTableOverlay = FullTableOverlayElement.create(etc);
    tableElement.appendChild(fullTableOverlay);
    overlayElementsState.fullTableOverlay = fullTableOverlay;
    // column dropdown
    const columnDropdownElement = ColumnDropdown.create(etc, areHeadersEditable);
    tableElement.appendChild(columnDropdownElement);
    overlayElementsState.columnDropdown = columnDropdownElement;
  }

  private static addAuxiliaryBodyElements(etc: EditableTableComponent) {
    // add new row element
    if (etc.displayAddRowCell) {
      const addNewRowElement = AddNewRowElement.create(etc);
      etc.tableBodyElementRef?.appendChild(addNewRowElement);
    }
  }

  private static processWidths(etc: EditableTableComponent) {
    setTimeout(() => {
      // in a timeout for optimization and it must come before the next method as it uses the etc.contents
      MaximumColumns.cleanupContentsThatDidNotGetAdded(etc.contents, etc.columnsDetails);
      // REF-14 has to be in a timeout method as custom table border style via etc.tableStyle will not be applied yet
      // setting isSafari to false because its processing is done in the setInitialTableWidth method called earlier
      StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true, false);
    });
  }

  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    // needs to be set before inserting the cells in order to check if each row can be added
    StaticTableWidthUtils.setInitialTableWidth(etc, Browser.IS_SAFARI);
    // header/data rows
    etc.contents.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(etc, rowIndex, false, row));
    TableElement.processWidths(etc);
    // new row row and full table overlay
    TableElement.addAuxiliaryBodyElements(etc);
  }

  private static createTableBody() {
    return document.createElement('tbody');
  }

  private static createTableElement(etc: EditableTableComponent) {
    const tableElement = document.createElement('table');
    // REF-14 placing it in a timeout for firefox
    setTimeout(() => Object.assign(tableElement.style, etc.tableStyle));
    tableElement.onmousedown = TableEvents.onMouseDown.bind(etc);
    tableElement.onmouseup = TableEvents.onMouseUp.bind(etc);
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
