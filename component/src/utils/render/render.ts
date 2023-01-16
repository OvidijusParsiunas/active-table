import {TableBorderDimensionsUtils} from '../../elements/table/tableBorderDimensionsUtils';
import {UpdateIndexColumnWidth} from '../../elements/indexColumn/updateIndexColumnWidth';
import {TableDimensionsUtils} from '../tableDimensions/tableDimensionsUtils';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {TableElement} from '../../elements/table/tableElement';
import {OverflowUtils} from '../overflow/overflowUtils';
import {ActiveTable} from '../../activeTable';

export class Render {
  // CAUTION-4 overwriting properties causes the whole table to refresh and subsequently - an infinite render loop
  // prettier-ignore
  private static refreshTableState(at: ActiveTable) {
    at.selectDropdownContainer?.replaceChildren();
    at.columnsDetails.splice(0, at.columnsDetails.length);
    UpdateIndexColumnWidth.WIDTH = IndexColumn.DEFAULT_WIDTH;
    at.addColumnCellsElementsRef.splice(0, at.addColumnCellsElementsRef.length);
    if (at.overflowInternal) {
      TableElement.BORDER_DIMENSIONS = TableBorderDimensionsUtils.generateUsingElement(
        at.overflowInternal.overflowContainer); // unsetBorderDimensions unsets dimensions so need this every render
    }
  }

  public static renderTable(at: ActiveTable) {
    TableDimensionsUtils.record(at);
    Render.refreshTableState(at);
    if (at.overflowInternal) OverflowUtils.applyDimensions(at);
    TableElement.setStaticWidthContentTotal(at);
    // needs to be in render trigger as user props are not set in the connectedCallback function in Firefox
    TableDimensionsUtils.setTableDimensions(at);
    TableElement.populateBody(at);
  }
}
