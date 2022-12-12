import {AuxiliaryTableContentElements} from '../../utils/auxiliaryTableContent/auxiliaryTableContentElements';
import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {InitialContentsProcessing} from '../../utils/contents/initialContentsProcessing';
import {ToggleAdditionElements} from './addNewElements/shared/toggleAdditionElements';
import {InsertRemoveColumnSizer} from '../columnSizer/utils/insertRemoveColumnSizer';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {AddNewColumnElement} from './addNewElements/column/addNewColumnElement';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {ColumnGroupElement} from './addNewElements/column/columnGroupElement';
import {UpdateIndexColumnWidth} from '../indexColumn/updateIndexColumnWidth';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {TableBorderDimensions} from '../../types/tableBorderDimensions';
import {TableBorderDimensionsUtils} from './tableBorderDimensionsUtils';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {AddNewRowElement} from './addNewElements/row/addNewRowElement';
import {EditableTableComponent} from '../../editable-table-component';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {IndexColumn} from '../indexColumn/indexColumn';
import {TableRow} from '../../types/tableContents';
import {TableEvents} from './tableEvents';

export class TableElement {
  // this includes index column, add column and columns with a width in their settings
  public static STATIC_WIDTH_CONTENT_TOTAL = UNSET_NUMBER_IDENTIFIER;
  public static BORDER_DIMENSIONS: TableBorderDimensions = TableBorderDimensionsUtils.generateDefault();

  public static changeStaticWidthTotal(delta: number) {
    TableElement.STATIC_WIDTH_CONTENT_TOTAL += delta;
  }

  // prettier-ignore
  public static setStaticWidthContentTotal(etc: EditableTableComponent) {
    const {auxiliaryTableContentInternal: {displayAddColumnCell, displayIndexColumn}} = etc;
    TableElement.STATIC_WIDTH_CONTENT_TOTAL =
      TableElement.BORDER_DIMENSIONS.leftWidth + TableElement.BORDER_DIMENSIONS.rightWidth;
    if (displayAddColumnCell) TableElement.STATIC_WIDTH_CONTENT_TOTAL += AddNewColumnElement.DEFAULT_WIDTH;
    if (displayIndexColumn) TableElement.STATIC_WIDTH_CONTENT_TOTAL += IndexColumn.DEFAULT_WIDTH;
  }

  // prettier-ignore
  public static addOverlayElements(etc: EditableTableComponent,
      tableElement: HTMLElement, activeOverlayElements: ActiveOverlayElements, areHeadersEditable: boolean) {
    // full table overlay for column dropdown
    const fullTableOverlay = FullTableOverlayElement.create(etc);
    tableElement.appendChild(fullTableOverlay);
    activeOverlayElements.fullTableOverlay = fullTableOverlay;
    // column dropdown
    const columnDropdownElement = ColumnDropdown.create(etc, areHeadersEditable);
    tableElement.appendChild(columnDropdownElement);
    activeOverlayElements.columnDropdown = columnDropdownElement;
    // row dropdown
    // WORK - option to not display dropdowns
    // WORK - need option to not show specific items in row dropdown
    const rowDropdownElement = RowDropdown.create(etc);
    tableElement.appendChild(rowDropdownElement);
    activeOverlayElements.rowDropdown = rowDropdownElement;
  }

  private static addCells(etc: EditableTableComponent) {
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(etc, true);
    etc.contents.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(etc, rowIndex, false, row));
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(etc, false);
  }

  private static postProcessColumns(etc: EditableTableComponent) {
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true); // REF-11
    InitialContentsProcessing.postProcess(etc.contents, etc.columnsDetails);
    setTimeout(() => InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, etc.columnsDetails.length - 1));
  }

  public static populateBody(etc: EditableTableComponent) {
    // removes all the current children
    etc.tableBodyElementRef?.replaceChildren();
    // needs to be set before inserting the cells to prevent adding columns when too small
    StaticTableWidthUtils.setTableWidth(etc);
    // header/data
    TableElement.addCells(etc);
    TableElement.postProcessColumns(etc);
    // new row row
    AuxiliaryTableContentElements.addAuxiliaryBodyElements(etc);
    if (etc.auxiliaryTableContentInternal.displayIndexColumn) UpdateIndexColumnWidth.update(etc);
    // needs to be after UpdateIndexColumnWidth.update as the new index column width can impact the add new column display
    ToggleAdditionElements.update(etc, true, AddNewColumnElement.toggle);
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

  // CAUTION-4 - add row cell is created and ref assigned here - then it is added post render in addAuxiliaryBodyElements
  public static createInfrastructureElements(etc: EditableTableComponent) {
    AuxiliaryTableContentColors.setEventColors(etc); // needs to be before the creation of column group element
    etc.tableElementRef = TableElement.createTableElement(etc);
    if (etc.auxiliaryTableContentInternal.displayAddColumnCell) {
      // needs to be appended before the body
      etc.columnGroupRef = ColumnGroupElement.create();
      etc.tableElementRef.appendChild(etc.columnGroupRef);
    }
    etc.tableBodyElementRef = TableElement.createTableBody();
    etc.addRowCellElementRef = AddNewRowElement.create(etc); // REF-18
    etc.tableElementRef.appendChild(etc.tableBodyElementRef);
    etc.categoryDropdownContainer = CategoryDropdown.createContainerElement();
    etc.tableElementRef.appendChild(etc.categoryDropdownContainer);
    TableElement.BORDER_DIMENSIONS = TableBorderDimensionsUtils.generateUsingElement(etc.tableElementRef as HTMLElement);
    return etc.tableElementRef;
  }
}
