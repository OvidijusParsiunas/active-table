import {TableBorderDimensionsUtils} from '../../elements/table/tableBorderDimensionsUtils';
import {UpdateIndexColumnWidth} from '../../elements/indexColumn/updateIndexColumnWidth';
import {TableDimensionsUtils} from '../tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {TableElement} from '../../elements/table/tableElement';
import {OverflowUtils} from '../overflow/overflowUtils';

export class Render {
  // CAUTION-4 overwriting properties causes the whole table to refresh and subsequently - an infinite render loop
  // prettier-ignore
  private static refreshTableState(etc: EditableTableComponent) {
    etc.categoryDropdownContainer?.replaceChildren();
    etc.columnsDetails.splice(0, etc.columnsDetails.length);
    UpdateIndexColumnWidth.WIDTH = IndexColumn.DEFAULT_WIDTH;
    etc.addColumnCellsElementsRef.splice(0, etc.addColumnCellsElementsRef.length);
    if (etc.overflowInternal) {
      TableElement.BORDER_DIMENSIONS = TableBorderDimensionsUtils.generateUsingElement(
        etc.overflowInternal.overflowContainer); // unsetBorderDimensions unsets dimensions so need this every render
    }
  }

  public static renderTable(etc: EditableTableComponent) {
    TableDimensionsUtils.record(etc);
    Render.refreshTableState(etc);
    if (etc.overflowInternal) OverflowUtils.applyDimensions(etc);
    TableElement.setStaticWidthContentTotal(etc);
    // needs to be in render trigger as user props are not set in the connectedCallback function in Firefox
    TableDimensionsUtils.setInternalTableDimensions(etc);
    TableElement.populateBody(etc);
  }
}
