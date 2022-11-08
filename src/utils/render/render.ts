import {StaticTableWidthUtils} from '../staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {TableElement} from '../../elements/table/tableElement';

export class Render {
  private static refreshTableState(etc: EditableTableComponent) {
    etc.tableElementEventState = {};
    // overwriting this causes the whole table to refresh and subsequently - an infinite render loop
    etc.columnsDetails.splice(0);
  }

  public static renderTable(etc: EditableTableComponent) {
    etc.tableDimensionsInternal.recordedParentWidth = (etc.parentElement as HTMLElement).offsetWidth;
    Render.refreshTableState(etc);
    // needs to be in the render function as props are not updated in the connectedCallback function in Firefox
    StaticTableWidthUtils.setInternalTableDimensions(etc);
    TableElement.populateBody(etc);
  }
}
