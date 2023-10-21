import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {UpdateRowElement} from '../insertRemoveStructure/update/updateRowElement';
import {DefaultCellHoverColors} from '../../types/cellStateColors';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {RowHoverStyles} from '../../types/rowHoverStyles';
import {ElementStyle} from '../elements/elementStyle';
import {ActiveTable} from '../../activeTable';
import {CSSStyle} from '../../types/cssStyle';
import {StripedRows} from './stripedRows';

export class RowHoverEvents {
  private static canStyleBeApplied(rowHoverStyles: RowHoverStyles, rowElement: HTMLElement, rowIndex: number) {
    return (
      (rowIndex > 0 || rowHoverStyles.header) &&
      (!AddNewRowElement.isAddNewRowRow(rowElement) || rowHoverStyles.addNewRowButton)
    );
  }

  private static setStyle(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    if (etc._stripedRows) {
      if (isAddRowEven && AddNewRowElement.isAddNewRowRow(rowElement)) {
        rowIndex = Number(!etc.dataStartsAtHeader); // REF-32
      }
      return StripedRows.setRowStyle(rowElement, rowIndex, etc._stripedRows);
    }
    return undefined;
  }

  private static getRemoveColorFunc(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    const rowHoverStyles = etc.rowHoverStyles;
    if (rowHoverStyles?.style && RowHoverEvents.canStyleBeApplied(rowHoverStyles, rowElement, rowIndex)) {
      const defaultStyle: CSSStyle | undefined = RowHoverEvents.setStyle(etc, rowElement, rowIndex, isAddRowEven);
      return () => {
        ElementStyle.unsetStyle(rowElement, rowHoverStyles.style);
        Object.assign(rowElement.style, defaultStyle);
      };
    }
    return undefined;
  }

  private static addMouseLeaveEvent(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    const removeStyleFunc = RowHoverEvents.getRemoveColorFunc(etc, rowElement, rowIndex, isAddRowEven);
    const unsetHeightFunc = UpdateRowElement.getUnsetHeightFunc(rowElement, rowIndex);
    rowElement.onmouseleave = () => {
      removeStyleFunc?.();
      unsetHeightFunc?.();
    };
  }

  // prettier-ignore
  private static addMouseEnterEvent(rowElement: HTMLElement, rowIndex: number, rowHoverStyles?: RowHoverStyles) {
    const applyStyleFunc = rowHoverStyles?.style && RowHoverEvents.canStyleBeApplied(rowHoverStyles, rowElement, rowIndex)
      ? () => Object.assign(rowElement.style, rowHoverStyles?.style) : undefined;
    rowElement.onmouseenter = () => {
      applyStyleFunc?.();
    };
  }

  public static addEvents(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    RowHoverEvents.addMouseEnterEvent(rowElement, rowIndex, etc.rowHoverStyles);
    RowHoverEvents.addMouseLeaveEvent(etc, rowElement, rowIndex, isAddRowEven);
  }

  public static process(rowHoverStyles: RowHoverStyles | null, defaultCellHoverColors: DefaultCellHoverColors) {
    if (rowHoverStyles?.style) {
      rowHoverStyles.header ??= true;
      rowHoverStyles.addNewRowButton ??= true;
      CellHighlightUtils.unsetDefaultHoverProperties(defaultCellHoverColors);
    }
  }
}
