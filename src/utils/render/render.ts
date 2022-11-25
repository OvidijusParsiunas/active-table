import {UpdateIndexColumnWidth} from '../../elements/indexColumn/updateIndexColumnWidth';
import {TableDimensionsUtils} from '../tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {TableElement} from '../../elements/table/tableElement';

export class Render {
  // CAUTION-4 overwriting properties causes the whole table to refresh and subsequently - an infinite render loop
  private static refreshTableState(etc: EditableTableComponent) {
    etc.categoryDropdownContainer?.replaceChildren();
    etc.columnsDetails.splice(0, etc.columnsDetails.length);
    UpdateIndexColumnWidth.WIDTH = IndexColumn.DEFAULT_WIDTH;
    etc.addColumnCellsElementsRef.splice(0, etc.addColumnCellsElementsRef.length);
  }

  public static renderTable(etc: EditableTableComponent) {
    etc.tableDimensionsInternal.recordedParentWidth = (etc.parentElement as HTMLElement).offsetWidth;
    Render.refreshTableState(etc);
    TableElement.setStaticWidthContentTotal(etc);
    // needs to be in render trigger as user props are not set in the connectedCallback function in Firefox
    TableDimensionsUtils.setInternalTableDimensions(etc);
    TableElement.populateBody(etc);
  }
}
