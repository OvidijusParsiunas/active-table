import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {OverlayElements} from '../../types/overlayElements';
import {ObjectUtils} from '../../utils/object/objectUtils';
import {AddNewRowElement} from '../row/addNewRowElement';
import {GenericObject} from '../../types/genericObject';
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

  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    // header/data rows
    etc.contents.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(etc, rowIndex, false, row));
    // new row row and full table overlay
    TableElement.addAuxiliaryBodyElements(etc);
  }

  private static createTableBody() {
    return document.createElement('tbody');
  }

  private static createTableElement(etc: EditableTableComponent) {
    const tableElement = document.createElement('table');
    // Object.assign did not work as it needs to be in a timeout for firefox and we need it immediately to set
    // TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH, hence assigning the values manually
    ObjectUtils.assignViaIteration(etc.tableStyle as GenericObject, tableElement.style as unknown as GenericObject);
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
