import {TableBorderDimensionsUtils} from '../../elements/table/tableBorderDimensionsUtils';
import {TableDimensionsUtils} from '../tableDimensions/tableDimensionsUtils';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {TableElement} from '../../elements/table/tableElement';
import {OverflowUtils} from '../overflow/overflowUtils';
import {ActiveTable} from '../../activeTable';

export class Render {
  // CAUTION-4 overwriting at properties causes the whole table to refresh and subsequently - an infinite render loop
  // prettier-ignore
  private static refreshTableState(at: ActiveTable) {
    at._cellDropdownContainer?.replaceChildren();
    at._columnsDetails.splice(0, at._columnsDetails.length);
    at._tableDimensions.indexColumnWidth = IndexColumn.DEFAULT_WIDTH;
    at._addColumnCellsElementsRef.splice(0, at._addColumnCellsElementsRef.length);
    if (at._overflow) {
       // unsetBorderDimensions unsets dimensions so need this every render
       at._tableDimensions.border = TableBorderDimensionsUtils.generateUsingElement(at._overflow.overflowContainer);
    }
  }

  public static renderTable(at: ActiveTable) {
    at._isRendering = true;
    TableDimensionsUtils.record(at);
    Render.refreshTableState(at);
    if (at._overflow) OverflowUtils.applyDimensions(at);
    TableElement.setStaticWidthContentTotal(at);
    // needs to be in render trigger as user props are not set in the connectedCallback function in Firefox
    TableDimensionsUtils.setTableDimensions(at);
    TableElement.populateBody(at);
    setTimeout(() => (at._isRendering = false));
  }
}
