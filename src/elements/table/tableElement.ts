import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {AddNewColumnElement} from './addNewElements/column/addNewColumnElement';
import {ColumnGroupElement} from './addNewElements/column/columnGroupElement';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {AddNewRowElement} from './addNewElements/row/addNewRowElement';
import {EditableTableComponent} from '../../editable-table-component';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {OverlayElements} from '../../types/overlayElements';
import {TableRow} from '../../types/tableContents';
import {TableEvents} from './tableEvents';

export class TableElement {
  public static AUXILIARY_TABLE_CONTENT_WIDTH = UNSET_NUMBER_IDENTIFIER;

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
  // add column cell element is technicaly an auxiliary element but it is populated differently inside each row
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

  public static changeAuxiliaryTableContentWidth(delta: number) {
    TableElement.AUXILIARY_TABLE_CONTENT_WIDTH += delta;
  }

  private static setAuxiliaryTableContentWidth(tableElement: HTMLElement, isAddColumnCellDisplayed: boolean) {
    if (TableElement.AUXILIARY_TABLE_CONTENT_WIDTH === UNSET_NUMBER_IDENTIFIER) {
      TableElement.AUXILIARY_TABLE_CONTENT_WIDTH =
        GenericElementUtils.getElementTotalHorizontalSideBorderWidth(tableElement);
      if (isAddColumnCellDisplayed) TableElement.AUXILIARY_TABLE_CONTENT_WIDTH += AddNewColumnElement.DEFAULT_WIDTH;
    }
  }

  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    TableElement.setAuxiliaryTableContentWidth(etc.tableElementRef as HTMLElement, etc.displayAddColumnCell);
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
    etc.columnGroupRef = ColumnGroupElement.create();
    etc.tableElementRef.appendChild(etc.columnGroupRef);
    etc.tableBodyElementRef = TableElement.createTableBody();
    etc.tableElementRef.appendChild(etc.tableBodyElementRef);
    return etc.tableElementRef;
  }
}
