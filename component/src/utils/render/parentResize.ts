import {ActiveTable} from '../../activeTable';
import {Render} from './render';

// CAUTION-2
export class ParentResize {
  private static doesOverflowNeedRerender(at: ActiveTable, parentElement: HTMLElement) {
    if (!at.overflowInternal) return false;
    const {isHeightPercentage, isWidthPercentage} = at.overflowInternal;
    return (
      (isHeightPercentage && at.tableDimensions.recordedParentHeight !== parentElement.offsetHeight) ||
      (isWidthPercentage && at.tableDimensions.recordedParentWidth !== parentElement.offsetWidth)
    );
  }

  private static shouldRerenderTable(at: ActiveTable) {
    const parentElement = at.parentElement as HTMLElement;
    if (ParentResize.doesOverflowNeedRerender(at, parentElement)) return true;
    return (
      at.tableDimensions.isPercentage &&
      // resize callback gets triggered on multiple occassions when the parent width has not changed:
      // on startup, after table has been resized, when parent height is changed and when column height is changed
      // this condition prevents the table from re-rendering itself when the above occurs
      at.tableDimensions.recordedParentWidth !== parentElement.offsetWidth &&
      // if the parent is resized to a width that does not impact the table width, do not bother re-rendering it
      (at.tableDimensions.maxWidth === undefined || at.offsetWidth > parentElement.offsetWidth)
    );
  }

  public static resizeCallback() {
    const at = this as unknown as ActiveTable;
    if (!ParentResize.shouldRerenderTable(at)) return;
    // preventing the removal of columns that are too narrow
    if (!at.tableDimensions.preserveNarrowColumns) {
      at.tableDimensions.preserveNarrowColumns = true;
      setTimeout(() => (at.tableDimensions.preserveNarrowColumns = false));
    }
    Render.renderTable(at);
  }
}
