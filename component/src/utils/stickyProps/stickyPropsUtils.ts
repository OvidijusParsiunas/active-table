import {ElementStyle} from '../elements/elementStyle';
import {ActiveTable} from '../../activeTable';

export class StickyPropsUtils {
  // REF-37
  private static readonly NO_OVERFLOW_STICKY_HEADER_BODY_CLASS = 'no-overflow-sticky-header-body';

  public static process(at: ActiveTable) {
    if (typeof at.stickyHeader === 'boolean') {
      at._stickyProps.header = at.stickyHeader;
      // not using _overflow as an indicator as it has yet not been processed
    } else if (at.overflow?.maxHeight) {
      at._stickyProps.header = true;
    }
  }

  // REF-37
  // prettier-ignore
  public static moveTopBorderToHeaderCells(at: ActiveTable) {
    const {_tableElementRef, _tableBodyElementRef} = at;
    if (!_tableElementRef || !_tableBodyElementRef) return;
    _tableBodyElementRef.classList.add(StickyPropsUtils.NO_OVERFLOW_STICKY_HEADER_BODY_CLASS);
    if (_tableElementRef.style.border) {
      _tableBodyElementRef.style.borderTop = _tableElementRef.style.border;
    }
    if (_tableElementRef.style.borderColor) {
      _tableBodyElementRef.style.borderTopColor = _tableElementRef.style.borderColor;
    }
    ElementStyle.moveStyles(_tableElementRef, _tableBodyElementRef,
      'borderTop', 'borderTopColor', 'borderTopWidth', 'borderTopStyle');
    _tableElementRef.style.borderTop = 'unset';
  }
}
