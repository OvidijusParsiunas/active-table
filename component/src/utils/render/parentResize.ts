import {ActiveTable} from '../../activeTable';
import {Render} from './render';

// CAUTION-2
export class ParentResize {
  private static doesOverflowNeedRerender(at: ActiveTable, parentElement: HTMLElement) {
    if (!at._overflow) return false;
    const {isHeightPercentage, isWidthPercentage} = at._overflow;
    return (
      (isHeightPercentage && at._tableDimensions.recordedParentHeight !== parentElement.offsetHeight) ||
      (isWidthPercentage && at._tableDimensions.recordedParentWidth !== parentElement.offsetWidth)
    );
  }

  private static shouldRerenderTable(at: ActiveTable) {
  if (!at) return false; // Ensure 'at' is not null
  const parentElement = at.parentElement as HTMLElement;
  if (!parentElement) return false; // Ensure 'parentElement' is not null

  if (ParentResize.doesOverflowNeedRerender(at, parentElement)) return true;

  return (
    at._tableDimensions.isPercentage &&
    // Resize callback gets triggered on multiple occasions when the parent width has not changed:
    // on startup, after table has been resized, when parent height is changed and when column height is changed
    // This condition prevents the table from re-rendering itself when the above occurs
    at._tableDimensions.recordedParentWidth !== parentElement.offsetWidth &&
    // If the parent is resized to a width that does not impact the table width, do not bother re-rendering it
    (at._tableDimensions.maxWidth === undefined || at.offsetWidth > parentElement.offsetWidth)
  );
}


  public static resizeCallback() {
    const at = this as unknown as ActiveTable;
    if (!ParentResize.shouldRerenderTable(at)) return;
    // preventing the removal of columns that are too narrow
    if (!at._tableDimensions.preserveNarrowColumns) {
      at._tableDimensions.preserveNarrowColumns = true;
      setTimeout(() => (at._tableDimensions.preserveNarrowColumns = false));
    }
    Render.renderTable(at);
  }
}
