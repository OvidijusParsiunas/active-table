import {StaticTableWidthUtils} from '../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ExtractElements} from '../../../utils/elements/extractElements';
import {Browser} from '../../../utils/browser/browser';
import {TableElement} from '../tableElement';

export class UpdateIndexColumnWidth {
  // acts as the recorded column offsetWidth
  public static WIDTH = 30;

  private static changeColumnWidth(etc: EditableTableComponent, newWidth: number) {
    const difference = newWidth - UpdateIndexColumnWidth.WIDTH;
    UpdateIndexColumnWidth.WIDTH = newWidth;
    TableElement.changeAuxiliaryTableContentWidth(difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }

  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  private static updateColumnWidthWhenOverflow(etc: EditableTableComponent, firstRow: HTMLElement, lastCell: HTMLElement) {
    // overflow width does not include the borderRightWidth - which the ChangeIndexColumnWidth.WIDTH does
    const overflowWidth = lastCell.scrollWidth + (Number.parseInt(lastCell.style.borderRightWidth) || 0);
    if (UpdateIndexColumnWidth.WIDTH !== overflowWidth) {
      // Firefox does not include lastCell paddingRight (4px) when setting the new width
      const newWidth = overflowWidth + (Browser.IS_FIREFOX ? 4 : 0);
      const headerCell = firstRow.children[0] as HTMLElement;
      headerCell.style.width = `${newWidth}px`;
      UpdateIndexColumnWidth.changeColumnWidth(etc, newWidth);
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the lastCell width is change automatically, all we do here is check if the expected width
  // (ChangeIndexColumnWidth.WIDTH) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthUpdate(etc: EditableTableComponent, lastCell: HTMLElement) {
    if (lastCell.offsetWidth !== UpdateIndexColumnWidth.WIDTH) {
      UpdateIndexColumnWidth.changeColumnWidth(etc, lastCell.offsetWidth);
    }
  }

  // prettier-ignore
  private static updatedBasedOnTableStyle(etc: EditableTableComponent, lastCell: HTMLElement) {
    const firstRow = (etc.tableBodyElementRef as HTMLElement).children[0] as HTMLElement;
    if (etc.tableDimensionsInternal.maxWidth !== undefined ||
        (etc.tableDimensionsInternal.width !== undefined && etc.tableDimensionsInternal.preserveNarrowColumns)) {
      UpdateIndexColumnWidth.updateColumnWidthWhenOverflow(etc, firstRow, lastCell);
    } else if (etc.tableDimensionsInternal.width !== undefined) {
      UpdateIndexColumnWidth.checkAutoColumnWidthUpdate(etc, lastCell);
    }
  }

  public static update(etc: EditableTableComponent, textRowsArr?: Element[]) {
    if (!textRowsArr) {
      const {tableBodyElementRef, contents} = etc;
      textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
    }
    const lastCell = textRowsArr[textRowsArr.length - 1]?.children[0] as HTMLElement;
    if (lastCell) UpdateIndexColumnWidth.updatedBasedOnTableStyle(etc, lastCell);
  }
}
