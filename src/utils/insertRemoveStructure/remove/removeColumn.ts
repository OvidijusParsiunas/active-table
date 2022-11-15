import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnGroupElement} from '../../../elements/table/addNewElements/column/columnGroupElement';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {StaticTableWidthUtils} from '../../tableDimensions/staticTable/staticTableWidthUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {TableContents} from '../../../types/tableContents';
import {LastColumn} from '../shared/lastColumn';

export class RemoveColumn {
  private static updateAdditionElements(etc: EditableTableComponent) {
    if (etc.displayAddColumnCell) ColumnGroupElement.update(etc.columnsDetails, etc.columnGroupRef);
    ToggleAdditionElements.update(etc, false, AddNewColumnElement.toggle);
  }

  private static cleanUpContent(contents: TableContents) {
    // when is no data inside rows - remove them
    if (contents.length > 0 && contents[0].length === 0) {
      contents.splice(0);
    }
  }

  private static removeElements(rowElement: HTMLElement, columnIndex: number, displayIndexColumn: boolean) {
    const elementColumnIndex = CellElementIndex.getViaColumnIndex(columnIndex, displayIndexColumn);
    // remove the text element
    rowElement.removeChild(rowElement.children[elementColumnIndex]);
    // remove the divider element
    rowElement.removeChild(rowElement.children[elementColumnIndex]);
  }

  private static removeCell(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const lastColumn: ElementDetails = LastColumn.getDetails(etc.columnsDetails, rowIndex);
    RemoveColumn.removeElements(rowElement, columnIndex, etc.displayIndexColumn);
    etc.contents[rowIndex].splice(columnIndex, 1);
    setTimeout(() => {
      const rowDetails: ElementDetails = {element: rowElement, index: rowIndex};
      UpdateCellsForColumns.rebindAndFireUpdates(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.REMOVED, lastColumn);
    });
  }

  private static removeCellFromAllRows(etc: EditableTableComponent, columnIndex: number) {
    const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      RemoveColumn.removeCell(etc, rowElement as HTMLElement, rowIndex, columnIndex);
    });
    RemoveColumn.cleanUpContent(etc.contents);
    // needs to be after getDetails but before changeWidthsBasedOnColumnInsertRemove
    const removedColumnDetails = etc.columnsDetails.splice(columnIndex, 1)[0];
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, false);
    return removedColumnDetails;
  }

  public static remove(etc: EditableTableComponent, columnIndex: number) {
    const removedColumnDetails = RemoveColumn.removeCellFromAllRows(etc, columnIndex);
    RemoveColumn.updateAdditionElements(etc);
    setTimeout(() => {
      // CAUTION-2
      CategoryDropdown.remove(etc.tableElementRef as HTMLElement, removedColumnDetails.categoryDropdown.element);
      InsertRemoveColumnSizer.remove(etc, columnIndex);
      etc.onTableUpdate(etc.contents);
    });
  }

  public static removeEvent(this: EditableTableComponent, columnIndex: number) {
    RemoveColumn.remove(this, columnIndex);
  }
}
