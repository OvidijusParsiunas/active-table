import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {OverlayElements} from '../../types/overlayElements';
import {AddNewRowElement} from '../row/addNewRowElement';
import {TableRow} from '../../types/tableContents';
import {TableEvents} from './tableEvents';

export class TableElement {
  public static TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH = UNSET_NUMBER_IDENTIFIER;

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
    const addNewRowElement = AddNewRowElement.create(etc);
    etc.tableBodyElementRef?.appendChild(addNewRowElement);
    AddNewRowElement.toggle(etc);
  }

  private static addCells(etc: EditableTableComponent) {
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(etc, true);
    etc.contents.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(etc, rowIndex, false, row));
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(etc, false);
  }

  private static postProcessColumns(etc: EditableTableComponent) {
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true); // REF-11
    setTimeout(() => TableDimensionsUtils.cleanupContentsThatDidNotGetAdded(etc.contents, etc.columnsDetails));
  }

  public static calculateTotalHorizontalSideBorderWidth(tableElement: HTMLElement) {
    if (TableElement.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH === UNSET_NUMBER_IDENTIFIER) {
      TableElement.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH =
        GenericElementUtils.getElementTotalHorizontalSideBorderWidth(tableElement);
    }
  }

  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    TableElement.calculateTotalHorizontalSideBorderWidth(etc.tableElementRef as HTMLElement);
    // needs to be set before inserting the cells to prevent adding columns when too small
    StaticTableWidthUtils.setTableWidth(etc);
    // header/data
    TableElement.addCells(etc);
    TableElement.postProcessColumns(etc);
    // new row row and full table overlay
    TableElement.addAuxiliaryBodyElements(etc);
  }

  private static createTableBody() {
    return document.createElement('tbody');
  }

  private static createTableElement(etc: EditableTableComponent) {
    const tableElement = document.createElement('table');
    tableElement.classList.add('table-controlled-width');
    Object.assign(tableElement.style, etc.tableStyle);
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
