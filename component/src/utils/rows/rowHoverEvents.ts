import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {DefaultCellHoverColors} from '../../types/cellStateColors';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {RowHoverStyles} from '../../types/rowHoverStyles';
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

  private static canStyleBeApplied(rowHoverStyles: RowHoverStyles, rowElement: HTMLElement, rowIndex: number) {
    return (
      rowHoverStyles?.style &&
      (rowIndex > 0 || rowHoverStyles.header) &&
      (!AddNewRowElement.isAddNewRowRow(rowElement) || rowHoverStyles.addNewRowButton)
    );
  }

  // prettier-ignore
  public static addEvents(rowHoverStyles: RowHoverStyles, rowElement: HTMLElement, rowIndex: number,
      defaultStyle?: CSSStyle) {
    if (RowHoverEvents.canStyleBeApplied(rowHoverStyles, rowElement, rowIndex)) {
      rowElement.onmouseenter = RowHoverEvents.mouseEnterRow.bind(this, rowElement, rowHoverStyles.style);
      rowElement.onmouseleave = RowHoverEvents.mouseLeaveRow.bind(this, rowElement, rowHoverStyles.style, defaultStyle);
    }
  }

  public static process(rowHoverStyles: RowHoverStyles | null, defaultCellHoverColors: DefaultCellHoverColors) {
    if (rowHoverStyles?.style) {
      rowHoverStyles.header ??= true;
      rowHoverStyles.addNewRowButton ??= true;
      CellHighlightUtils.unsetDefaultHoverProperties(defaultCellHoverColors);
    }
  }
}
