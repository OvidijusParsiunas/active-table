import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {MaximumColumns} from '../../utils/insertRemoveStructure/insert/maximum/maximumColumns';
import {FrameComponentsElements} from '../../utils/frameComponents/frameComponentsElements';
import {FrameComponentsColors} from '../../utils/frameComponents/frameComponentsColors';
import {ToggleAdditionElements} from './addNewElements/shared/toggleAdditionElements';
import {StringDimensionUtils} from '../../utils/tableDimensions/stringDimensionUtils';
import {InitialContentProcessing} from '../../utils/content/initialContentProcessing';
import {InsertRemoveColumnSizer} from '../columnSizer/utils/insertRemoveColumnSizer';
import {FullTableOverlayElement} from '../fullTableOverlay/fullTableOverlayElement';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {AddNewColumnElement} from './addNewElements/column/addNewColumnElement';
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
import {FireEvents} from '../../utils/events/fireEvents';
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
    const {_frameComponents: {displayAddNewColumn, displayIndexColumn}, _tableDimensions} = at;
    _tableDimensions.staticWidth = _tableDimensions.border.leftWidth + _tableDimensions.border.rightWidth;
    if (displayAddNewColumn) _tableDimensions.staticWidth += AddNewColumnElement.DEFAULT_WIDTH;
    if (displayIndexColumn) _tableDimensions.staticWidth += IndexColumn.DEFAULT_WIDTH;
  }

  // prettier-ignore
  public static addOverlayElements(at: ActiveTable,
      tableElement: HTMLElement, activeOverlayElements: ActiveOverlayElements) {
    // full table overlay for column dropdown
    const fullTableOverlay = FullTableOverlayElement.create(at);
    activeOverlayElements.fullTableOverlay = fullTableOverlay;
    (at._overflow?.overflowContainer || tableElement).appendChild(fullTableOverlay);
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
    if (!MaximumColumns.canAddMore(at)) return;
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(at, true);
    at.content.map((row: TableRow, rowIndex: number) => InsertNewRow.insert(at, rowIndex, false, row));
    StaticTableWidthUtils.toggleWidthUsingMaxWidth(at, false);
  }

  private static postProcessColumns(at: ActiveTable) {
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true); // REF-11
    InitialContentProcessing.postProcess(at.content, at._columnsDetails);
    setTimeout(() => {
      FireEvents.onColumnsUpdate(at);
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(at, at._columnsDetails.length - 1);
    });
  }

  public static populateBody(at: ActiveTable) {
    // removes all the current children
    at._tableBodyElementRef?.replaceChildren();
    // needs to be set before inserting the cells to prevent adding columns when too small
    StaticTableWidthUtils.setTableWidth(at);
    // header/data
    TableElement.addCells(at);
    TableElement.postProcessColumns(at);
    // new row row
    FrameComponentsElements.addFrameBodyElements(at);
    if (at._frameComponents.displayIndexColumn) UpdateIndexColumnWidth.update(at);
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
    // no dimension copy is used because dimensions will be still be reused when table is re-rendered
    const noDimensionsStyleCopy = StringDimensionUtils.removeAllDimensions(JSON.parse(JSON.stringify(at.tableStyle)));
    Object.assign(tableElement.style, noDimensionsStyleCopy);
    tableElement.onmousedown = TableEvents.onMouseDown.bind(at);
    tableElement.onmouseup = TableEvents.onMouseUp.bind(at);
    return tableElement;
  }

  // CAUTION-4 - add row cell is created and ref assigned here - then it is added post render in addFrameBodyElements
  public static createInfrastructureElements(at: ActiveTable) {
    FrameComponentsColors.setEventColors(at);
    at._tableElementRef = TableElement.createTableElement(at);
    at._tableBodyElementRef = TableElement.createTableBody(at._stickyProps.header);
    at._addRowCellElementRef = AddNewRowElement.create(at); // REF-18
    at._tableElementRef.appendChild(at._tableBodyElementRef);
    at._cellDropdownContainer = CellDropdown.createContainerElement();
    at._tableElementRef.appendChild(at._cellDropdownContainer);
    if (!at.overflow && at._stickyProps.header) StickyPropsUtils.moveTopBorderToHeaderCells(at);
    at._tableDimensions.border = TableBorderDimensionsUtils.generateUsingElement(at._tableElementRef as HTMLElement);
    return at._tableElementRef;
  }
}
