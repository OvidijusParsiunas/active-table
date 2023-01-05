import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ElementStyle} from '../elements/elementStyle';
import {CSSStyle} from '../../types/cssStyle';
import {RowHover} from '../../types/rowHover';

export class RowHoverEvents {
  private static mouseLeaveRow(rowElement: HTMLElement, style: CSSStyle, defaultStyle?: CSSStyle) {
    ElementStyle.unsetStyle(rowElement, style);
    Object.assign(rowElement.style, defaultStyle);
  }

  private static mouseEnterRow(rowElement: HTMLElement, style: CSSStyle) {
    Object.assign(rowElement.style, style);
  }

  private static canStyleBeApplied(rowHover: RowHover, rowElement: HTMLElement, rowIndex: number) {
    return (
      rowHover?.style &&
      (rowIndex > 0 || rowHover.hoverHeader) &&
      (!AddNewRowElement.isAddNewRowRow(rowElement) || rowHover.hoverAddNewRowButton)
    );
  }

  // prettier-ignore
  public static addEvents(rowHover: RowHover, rowElement: HTMLElement, rowIndex: number,
      defaultStyle?: CSSStyle) {
    if (RowHoverEvents.canStyleBeApplied(rowHover, rowElement, rowIndex)) {
      rowElement.onmouseenter = RowHoverEvents.mouseEnterRow.bind(this, rowElement, rowHover.style);
      rowElement.onmouseleave = RowHoverEvents.mouseLeaveRow.bind(this, rowElement, rowHover.style, defaultStyle);
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
