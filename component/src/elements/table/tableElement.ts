import {AuxiliaryTableContentElements} from '../../utils/auxiliaryTableContent/auxiliaryTableContentElements';
import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ToggleAdditionElements} from './addNewElements/shared/toggleAdditionElements';
import {StringDimensionUtils} from '../../utils/tableDimensions/stringDimensionUtils';
import {InitialContentProcessing} from '../../utils/content/initialContentProcessing';
import {InsertRemoveColumnSizer} from '../columnSizer/utils/insertRemoveColumnSizer';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {AddNewColumnElement} from './addNewElements/column/addNewColumnElement';
import {ColumnDetailsUtils} from '../../utils/columnDetails/columnDetailsUtils';
import {ColumnGroupElement} from './addNewElements/column/columnGroupElement';
import {UpdateIndexColumnWidth} from '../indexColumn/updateIndexColumnWidth';
import {StickyPropsUtils} from '../../utils/stickyProps/stickyPropsUtils';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {CustomRowProperties} from '../../utils/rows/customRowProperties';
import {TableBorderDimensionsUtils} from './tableBorderDimensionsUtils';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {AddNewRowElement} from './addNewElements/row/addNewRowElement';
import {CellDropdown} from '../dropdown/cellDropdown/cellDropdown';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {TableDimensions} from '../../types/tableDimensions';
import {IndexColumn} from '../indexColumn/indexColumn';
import {TableRow} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';
import {TableEvents} from './tableEvents';

export class TableElement {
  public static changeStaticWidthTotal(tableDimensions: TableDimensions, delta: number) {
    tableDimensions.staticWidth += delta;
  }

  // prettier-ignore
  public static setStaticWidthContentTotal(at: ActiveTable) {
    const {auxiliaryTableContentInternal: {displayAddColumnCell, displayIndexColumn}, tableDimensions} = at;
    tableDimensions.staticWidth = tableDimensions.border.leftWidth + tableDimensions.border.rightWidth;
    if (displayAddColumnCell) tableDimensions.staticWidth += AddNewColumnElement.DEFAULT_WIDTH;
    if (displayIndexColumn) tableDimensions.staticWidth += IndexColumn.DEFAULT_WIDTH;
  }

  // prettier-ignore
  public static addOverlayElements(at: ActiveTable,
      tableElement: HTMLElement, activeOverlayElements: ActiveOverlayElements) {
    // full table overlay for column dropdown
    const fullTableOverlay = FullTableOverlayElement.create(at);
    activeOverlayElements.fullTableOverlay = fullTableOverlay;
    (at.overflowInternal?.overflowContainer || tableElement).appendChild(fullTableOverlay);
    // column dropdown
    const columnDropdownElement = ColumnDropdown.create(at);
    tableElement.appendChild(columnDropdownElement);
    activeOverlayElements.columnDropdown = columnDropdownElement;
    // row dropdown
    if (at.rowDropdown.displaySettings.isAvailable) {
      const rowDropdownElement = RowDropdown.create(at);
      tableElement.appendChild(rowDropdownElement);
      activeOverlayElements.rowDropdown = rowDropdownElement; 
    }
  }

  private static addCells(at: ActiveTable) {
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(at, true);
    at.content.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(at, rowIndex, false, row));
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(at, false);
  }

  private static postProcessColumns(at: ActiveTable) {
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true); // REF-11
    InitialContentProcessing.postProcess(at.content, at.columnsDetails);
    setTimeout(() => {
      at.columnsDetails.forEach((columnDetails) => ColumnDetailsUtils.fireUpdateEvent(columnDetails));
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(at, at.columnsDetails.length - 1);
    });
  }

  public static populateBody(at: ActiveTable) {
    // removes all the current children
    at.tableBodyElementRef?.replaceChildren();
    // needs to be set before inserting the cells to prevent adding columns when too small
    StaticTableWidthUtils.setTableWidth(at);
    // header/data
    TableElement.addCells(at);
    TableElement.postProcessColumns(at);
    // new row row
    AuxiliaryTableContentElements.addAuxiliaryBodyElements(at);
    if (at.auxiliaryTableContentInternal.displayIndexColumn) UpdateIndexColumnWidth.update(at);
    // needs to be after UpdateIndexColumnWidth.update as the new index column width can impact the add new column display
    ToggleAdditionElements.update(at, true, AddNewColumnElement.toggle);
    CustomRowProperties.update(at);
  }

  private static createTableBody(stickyHeader: boolean) {
    const body = document.createElement('tbody');
    if (stickyHeader) body.classList.add('sticky-header-body');
    return body;
  }

  private static createTableElement(at: ActiveTable) {
    const tableElement = document.createElement('table');
    tableElement.classList.add('table-controlled-width');
    // no dimension copy is used because dimensions will be used removed during the component render (renderTable)
    const noDimensionsStyleCopy = StringDimensionUtils.removeAllDimensions(JSON.parse(JSON.stringify(at.tableStyle)));
    Object.assign(tableElement.style, noDimensionsStyleCopy);
    tableElement.onmousedown = TableEvents.onMouseDown.bind(at);
    tableElement.onmouseup = TableEvents.onMouseUp.bind(at);
    return tableElement;
  }

  // CAUTION-4 - add row cell is created and ref assigned here - then it is added post render in addAuxiliaryBodyElements
  public static createInfrastructureElements(at: ActiveTable) {
    AuxiliaryTableContentColors.setEventColors(at); // needs to be before the creation of column group element
    at.tableElementRef = TableElement.createTableElement(at);
    if (at.auxiliaryTableContentInternal.displayAddColumnCell) {
      // needs to be appended before the body
      at.columnGroupRef = ColumnGroupElement.create(at.auxiliaryTableContentInternal.cellColors.data);
      at.tableElementRef.appendChild(at.columnGroupRef);
    }
    at.tableBodyElementRef = TableElement.createTableBody(at.stickyProps.header);
    at.addRowCellElementRef = AddNewRowElement.create(at); // REF-18
    at.tableElementRef.appendChild(at.tableBodyElementRef);
    at.cellDropdownContainer = CellDropdown.createContainerElement();
    at.tableElementRef.appendChild(at.cellDropdownContainer);
    if (!at.overflow && at.stickyProps.header) StickyPropsUtils.moveTopBorderToHeaderCells(at);
    at.tableDimensions.border = TableBorderDimensionsUtils.generateUsingElement(at.tableElementRef as HTMLElement);
    return at.tableElementRef;
  }
}
