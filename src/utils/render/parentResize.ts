import {EditableTableComponent} from '../../editable-table-component';
import {Render} from './render';

// CAUTION-2
export class ParentResize {
  private static shouldRerenderTable(etc: EditableTableComponent) {
    return (
      etc.tableDimensionsInternal.isPercentage &&
      // resize callback gets triggered on multiple occassions when the parent width has not changed:
      // on startup, after table has been resized, when parent height is changed and when column height is changed
      // this condition prevents the table from re-rendering itself when the above occurs
      etc.tableDimensionsInternal.recordedParentWidth !== (etc.parentElement as HTMLElement).offsetWidth
    );
  }

  public static resizeCallback() {
    const etc = this as unknown as EditableTableComponent;
    if (!ParentResize.shouldRerenderTable(etc)) return;
    // preventing the removal of columns that are too narrow
    if (!etc.tableDimensionsInternal.preserveNarrowColumns) {
      etc.tableDimensionsInternal.preserveNarrowColumns = true;
      setTimeout(() => (etc.tableDimensionsInternal.preserveNarrowColumns = false));
    }
    Render.renderTable(etc);
  }
}
