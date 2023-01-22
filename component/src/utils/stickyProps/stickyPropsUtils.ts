import {GenericElementUtils} from '../elements/genericElementUtils';
import {ActiveTable} from '../../activeTable';

export class StickyPropsUtils {
  // REF-37
  private static readonly NO_OVERFLOW_STICKY_HEADER_BODY_CLASS = 'no-overflow-sticky-header-body';

  public static process(at: ActiveTable) {
    if (typeof at.stickyHeader === 'boolean') {
      at.stickyProps.header = at.stickyHeader;
    } else if (at.overflow?.maxHeight) {
      at.stickyProps.header = true;
    }
  }

  // REF-37
  // prettier-ignore
  public static moveTopBorderToHeaderCells(at: ActiveTable) {
    if (!at.tableElementRef || !at.tableBodyElementRef) return;
    at.tableBodyElementRef.classList.add(StickyPropsUtils.NO_OVERFLOW_STICKY_HEADER_BODY_CLASS);
    if (at.tableElementRef.style.border) {
      at.tableBodyElementRef.style.borderTop = at.tableElementRef.style.border;
    }
    if (at.tableElementRef.style.borderColor) {
      at.tableBodyElementRef.style.borderTopColor = at.tableElementRef.style.borderColor;
    }
    GenericElementUtils.moveStyles(at.tableElementRef, at.tableBodyElementRef,
      'borderTop', 'borderTopColor', 'borderTopWidth', 'borderTopStyle');
    at.tableElementRef.style.borderTop = 'unset';
  }
}
