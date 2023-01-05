import {CellHighlightUtils} from '../../../../utils/color/cellHighlightUtils';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {CSSStyle} from '../../../../types/cssStyle';
import {RowHover} from '../../../../types/rowHover';

export class RowHoverEvents {
  private static mouseLeaveRow(rowElement: HTMLElement, style: CSSStyle) {
    ElementStyle.unsetStyle(rowElement, style);
  }

  private static mouseEnterRow(rowElement: HTMLElement, style: CSSStyle) {
    Object.assign(rowElement.style, style);
  }

  public static addEvents(rowHover: RowHover | null, rowElement: HTMLElement, rowIndex: number) {
    if (rowHover?.style && (rowIndex > 0 || rowHover.hoverHeader)) {
      rowElement.onmouseenter = RowHoverEvents.mouseEnterRow.bind(this, rowElement, rowHover.style);
      rowElement.onmouseleave = RowHoverEvents.mouseLeaveRow.bind(this, rowElement, rowHover.style);
    }
  }

  public static process(rowHover: RowHover | null) {
    if (rowHover?.style) {
      rowHover.hoverHeader ??= true;
      rowHover.hoverAddNewRowButton ??= true;
      CellHighlightUtils.unsetDefaultHoverProperties();
    }
  }
}
