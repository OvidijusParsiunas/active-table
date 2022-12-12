import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ToggleAdditionElements} from '../table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../table/addNewElements/column/addNewColumnElement';
import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {ExtractElements} from '../../utils/elements/extractElements';
import {DEFAULT_COLUMN_WIDTH} from '../../consts/defaultColumnWidth';
import {Browser} from '../../utils/browser/browser';
import {TableElement} from '../table/tableElement';
import {IndexColumn} from './indexColumn';

export class UpdateIndexColumnWidth {
  // acts as the recorded column offsetWidth
  public static WIDTH = DEFAULT_COLUMN_WIDTH;

  private static wrapColumnTextAndGetDefaultWidth(etc: EditableTableComponent) {
    const {tableBodyElementRef, contents, tableDimensionsInternal} = etc;
    ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents).forEach((row) => {
      const indexCell = row.children[0] as HTMLElement;
      indexCell.classList.remove(IndexColumn.INDEX_CELL_OVERFLOW_CLASS);
    });
    tableDimensionsInternal.isColumnIndexCellTextWrapped = true;
    ToggleAdditionElements.update(etc, true, AddNewColumnElement.toggle);
    return IndexColumn.DEFAULT_WIDTH;
  }

  private static changeTableWidths(etc: EditableTableComponent, newWidth: number) {
    const difference = newWidth - UpdateIndexColumnWidth.WIDTH;
    UpdateIndexColumnWidth.WIDTH = newWidth;
    TableElement.changeStaticWidthTotal(difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }

  private static changeCellAndTableWidths(etc: EditableTableComponent, firstRow: HTMLElement, newWidth: number) {
    const headerCell = firstRow.children[0] as HTMLElement;
    UpdateIndexColumnWidth.changeTableWidths(etc, newWidth);
    // needs to be done after changeTableWidths because isTableAtMaxWidth would not return true
    headerCell.style.width = `${newWidth}px`;
  }

  private static forceWrap(etc: EditableTableComponent, firstRow: HTMLElement) {
    const newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(etc);
    UpdateIndexColumnWidth.changeCellAndTableWidths(etc, firstRow, newWidth);
  }

  private static shouldTextBeWrapped(etc: EditableTableComponent) {
    return (
      !etc.tableDimensionsInternal.isColumnIndexCellTextWrapped && TableDimensionsUtils.hasSetTableWidthBeenBreached(etc)
    );
  }

  // this works because the 'block' display style is not set on the table
  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  private static updateColumnWidthWhenOverflow(etc: EditableTableComponent, firstRow: HTMLElement, lastCell: HTMLElement) {
    // overflow width does not include the borderRightWidth - which the ChangeIndexColumnWidth.WIDTH does
    const overflowWidth = lastCell.scrollWidth + (Number.parseInt(lastCell.style.borderRightWidth) || 0);
    if (UpdateIndexColumnWidth.WIDTH !== overflowWidth) {
      // Firefox does not include lastCell paddingRight (4px) when setting the new width
      const newWidth = overflowWidth + (Browser.IS_FIREFOX ? 4 : 0);
      UpdateIndexColumnWidth.changeCellAndTableWidths(etc, firstRow, newWidth);
      // if the above has set the width too high
      if (UpdateIndexColumnWidth.shouldTextBeWrapped(etc)) UpdateIndexColumnWidth.forceWrap(etc, firstRow);
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the lastCell width is change automatically, all we do here is check if the expected width
  // (ChangeIndexColumnWidth.WIDTH) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthUpdate(etc: EditableTableComponent, lastCell: HTMLElement) {
    if (lastCell.offsetWidth !== UpdateIndexColumnWidth.WIDTH) {
      let newWidth = lastCell.offsetWidth;
      if (etc.offsetWidth !== etc.scrollWidth) {
        newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(etc);
      }
      UpdateIndexColumnWidth.changeTableWidths(etc, newWidth);
    }
  }

  private static updatedBasedOnTableStyle(etc: EditableTableComponent, lastCell: HTMLElement, forceWrap = false) {
    const firstRow = (etc.tableBodyElementRef as HTMLElement).children[0] as HTMLElement;
    if (forceWrap) {
      UpdateIndexColumnWidth.forceWrap(etc, firstRow);
      // when 'block' display style is not set on the table
    } else if (etc.tableDimensionsInternal.preserveNarrowColumns || etc.tableDimensionsInternal.maxWidth !== undefined) {
      UpdateIndexColumnWidth.updateColumnWidthWhenOverflow(etc, firstRow, lastCell);
    } else if (etc.tableDimensionsInternal.width !== undefined) {
      UpdateIndexColumnWidth.checkAutoColumnWidthUpdate(etc, lastCell);
    }
  }

  // used when a new row is added
  // forceWrap - REF-19
  public static update(etc: EditableTableComponent, textRowsArr?: Element[], forceWrap = false) {
    if (etc.tableDimensionsInternal.isColumnIndexCellTextWrapped) return;
    if (!textRowsArr) {
      const {tableBodyElementRef, contents} = etc;
      textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
    }
    const lastCell = textRowsArr[textRowsArr.length - 1]?.children[0] as HTMLElement;
    if (lastCell) UpdateIndexColumnWidth.updatedBasedOnTableStyle(etc, lastCell, forceWrap);
  }

  // used when a new column is added to see if wrapping is needed
  // CAUTION-2 - this runs before re-render but stay cautions
  public static wrapTextWhenNarrowColumnsBreached(etc: EditableTableComponent) {
    if (etc.auxiliaryTableContentInternal.displayIndexColumn && UpdateIndexColumnWidth.shouldTextBeWrapped(etc)) {
      UpdateIndexColumnWidth.update(etc, undefined, true);
    }
  }
}
