import {StaticTableWidthUtils} from '../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {Browser} from '../../../utils/browser/browser';
import {TableElement} from '../tableElement';

export class ChangeIndexColumnWidth {
  // acts as the recorded column offsetWidth
  public static WIDTH = 30;

  private static changeColumnWidth(etc: EditableTableComponent, newWidth: number) {
    const difference = newWidth - ChangeIndexColumnWidth.WIDTH;
    ChangeIndexColumnWidth.WIDTH = newWidth;
    TableElement.changeAuxiliaryTableContentWidth(difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }

  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  private static changeColumnWidthWhenOverflow(etc: EditableTableComponent, firstRow: HTMLElement, cell: HTMLElement) {
    // overflow width does not include the borderRightWidth - which the ChangeIndexColumnWidth.WIDTH does
    const overflowWidth = cell.scrollWidth + (Number.parseInt(cell.style.borderRightWidth) || 0);
    if (ChangeIndexColumnWidth.WIDTH !== overflowWidth) {
      // Firefox does not include cell paddingRight (4px) when setting the new width
      const newWidth = overflowWidth + (Browser.IS_FIREFOX ? 4 : 0);
      const headerCell = firstRow.children[0] as HTMLElement;
      headerCell.style.width = `${newWidth}px`;
      ChangeIndexColumnWidth.changeColumnWidth(etc, newWidth);
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the cell width is change automatically, all we do here is check if the expected width
  // (ChangeIndexColumnWidth.WIDTH) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthChange(etc: EditableTableComponent, cell: HTMLElement) {
    if (cell.offsetWidth !== ChangeIndexColumnWidth.WIDTH) {
      ChangeIndexColumnWidth.changeColumnWidth(etc, cell.offsetWidth);
    }
  }

  // prettier-ignore
  public static change(etc: EditableTableComponent, cell: HTMLElement) {
    const firstRow = (etc.tableBodyElementRef as HTMLElement).children[0] as HTMLElement;
    if (etc.tableDimensionsInternal.maxWidth !== undefined ||
        (etc.tableDimensionsInternal.width !== undefined && etc.tableDimensionsInternal.preserveNarrowColumns)) {
      ChangeIndexColumnWidth.changeColumnWidthWhenOverflow(etc, firstRow, cell);
    } else if (etc.tableDimensionsInternal.width !== undefined) {
      ChangeIndexColumnWidth.checkAutoColumnWidthChange(etc, cell);
    }
  }
}
