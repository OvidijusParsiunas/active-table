import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {DefaultCellHoverColors} from '../../types/cellStateColors';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {RowHoverStyle} from '../../types/rowHoverStyle';
import {ElementStyle} from '../elements/elementStyle';
import {CSSStyle} from '../../types/cssStyle';

export class RowHoverEvents {
  private static mouseLeaveRow(rowElement: HTMLElement, style: CSSStyle, defaultStyle?: CSSStyle) {
    ElementStyle.unsetStyle(rowElement, style);
    Object.assign(rowElement.style, defaultStyle);
  }

  private static mouseEnterRow(rowElement: HTMLElement, style: CSSStyle) {
    Object.assign(rowElement.style, style);
  }

  private static canStyleBeApplied(rowHoverStyle: RowHoverStyle, rowElement: HTMLElement, rowIndex: number) {
    return (
      rowHoverStyle?.style &&
      (rowIndex > 0 || rowHoverStyle.header) &&
      (!AddNewRowElement.isAddNewRowRow(rowElement) || rowHoverStyle.addNewRowButton)
    );
  }

  // prettier-ignore
  public static addEvents(rowHoverStyle: RowHoverStyle, rowElement: HTMLElement, rowIndex: number,
      defaultStyle?: CSSStyle) {
    if (RowHoverEvents.canStyleBeApplied(rowHoverStyle, rowElement, rowIndex)) {
      rowElement.onmouseenter = RowHoverEvents.mouseEnterRow.bind(this, rowElement, rowHoverStyle.style);
      rowElement.onmouseleave = RowHoverEvents.mouseLeaveRow.bind(this, rowElement, rowHoverStyle.style, defaultStyle);
    }
  }

  public static process(rowHoverStyle: RowHoverStyle | null, defaultCellHoverColors: DefaultCellHoverColors) {
    if (rowHoverStyle?.style) {
      rowHoverStyle.header ??= true;
      rowHoverStyle.addNewRowButton ??= true;
      CellHighlightUtils.unsetDefaultHoverProperties(defaultCellHoverColors);
    }
  }
}
