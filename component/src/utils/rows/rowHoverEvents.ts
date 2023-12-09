import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {UpdateRowElement} from '../insertRemoveStructure/update/updateRowElement';
import {DefaultCellHoverColors} from '../../types/cellStateColors';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {RowHoverStyles} from '../../types/rowHoverStyles';
import {ElementStyle} from '../elements/elementStyle';
import {ActiveTable} from '../../activeTable';
import {CSSStyle} from '../../types/cssStyle';

export class RowHoverEvents {
  private static canStyleBeApplied(rowHoverStyles: RowHoverStyles, rowElement: HTMLElement, rowIndex: number) {
    return (
      (rowIndex > 0 || rowHoverStyles.header) &&
      (!AddNewRowElement.isAddNewRowRow(rowElement) || rowHoverStyles.addNewRowButton)
    );
  }

  private static getRemoveColorFunc(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, defaultStyle?: CSSStyle) {
    const rowHoverStyles = at.rowHoverStyles;
    if (rowHoverStyles?.style && RowHoverEvents.canStyleBeApplied(rowHoverStyles, rowElement, rowIndex)) {
      return () => {
        ElementStyle.unsetStyle(rowElement, rowHoverStyles.style);
        Object.assign(rowElement.style, defaultStyle);
      };
    }
    return undefined;
  }

  private static addMouseLeaveEvent(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, defaultStyle?: CSSStyle) {
    const removeStyleFunc = RowHoverEvents.getRemoveColorFunc(at, rowElement, rowIndex, defaultStyle);
    const unsetHeightFunc = UpdateRowElement.getUnsetHeightFunc(rowElement, rowIndex);
    rowElement.onmouseleave = () => {
      removeStyleFunc?.();
      unsetHeightFunc?.();
    };
  }

  // prettier-ignore
  private static addMouseEnterEvent(at: ActiveTable, rowElement: HTMLElement, rowIndex: number) {
    const {rowHoverStyles, _focusedElements: {rowDragEl}} = at;
    const applyStyleFunc = rowHoverStyles?.style && RowHoverEvents.canStyleBeApplied(rowHoverStyles, rowElement, rowIndex)
      ? () => Object.assign(rowElement.style, rowHoverStyles?.style) : undefined;
    rowElement.onmouseenter = () => {
      if (!rowDragEl) applyStyleFunc?.();
    };
  }

  public static addEvents(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, defaultStyle?: CSSStyle) {
    RowHoverEvents.addMouseEnterEvent(at, rowElement, rowIndex);
    RowHoverEvents.addMouseLeaveEvent(at, rowElement, rowIndex, defaultStyle);
  }

  public static process(rowHoverStyles: RowHoverStyles | null, defaultCellHoverColors: DefaultCellHoverColors) {
    if (rowHoverStyles?.style) {
      rowHoverStyles.header ??= true;
      rowHoverStyles.addNewRowButton ??= true;
      CellHighlightUtils.unsetDefaultHoverProperties(defaultCellHoverColors);
    }
  }
}
