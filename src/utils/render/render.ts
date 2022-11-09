import {StaticTableWidthUtils} from '../staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {TableElement} from '../../elements/table/tableElement';

export class Render {
  // overwriting properties causes the whole table to refresh and subsequently - an infinite render loop
  private static refreshTableState(etc: EditableTableComponent) {
    etc.columnsDetails.splice(0);
  }

  public static renderTable(etc: EditableTableComponent) {
    etc.tableDimensionsInternal.recordedParentWidth = (etc.parentElement as HTMLElement).offsetWidth;
    Render.refreshTableState(etc);
    // needs to be in render trigger as user props are not set in the connectedCallback function in Firefox
    StaticTableWidthUtils.setInternalTableDimensions(etc);
    TableElement.populateBody(etc);
  }
}
