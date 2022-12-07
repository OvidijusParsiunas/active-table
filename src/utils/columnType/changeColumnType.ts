import {CategoryCellElement} from '../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {DateCellElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {DataCellElement} from '../../elements/cell/dataCell/dataCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {CellEvents} from '../../elements/cell/cellEvents';

export class ChangeColumnType {
  private static purgeInvalidCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number) {
    const relativeRowIndex = rowIndex + 1;
    const cellElement = etc.columnsDetails[columnIndex].elements[relativeRowIndex];
    return CellEvents.setCellToDefaultIfNeeded(etc, relativeRowIndex, columnIndex, cellElement, false);
  }

  private static purgeInvalidCells(etc: EditableTableComponent, columnIndex: number) {
    let updateTableEvent = false;
    etc.contents.slice(1).forEach((_, rowIndex) => {
      const isUpdated = ChangeColumnType.purgeInvalidCell(etc, rowIndex, columnIndex);
      if (isUpdated && !updateTableEvent) updateTableEvent = true;
    });
    if (updateTableEvent) etc.onTableUpdate(etc.contents);
  }

  private static setNew(etc: EditableTableComponent, newType: string, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.activeType = columnDetails.types.find((type) => type.name === newType) as ColumnTypeInternal;
    return columnDetails.activeType;
  }

  public static change(this: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const previousType = this.columnsDetails[columnIndex].activeType;
    if (newTypeName !== previousType.name) {
      const newType = ChangeColumnType.setNew(this, newTypeName, columnIndex);
      if (newType.validation) ChangeColumnType.purgeInvalidCells(this, columnIndex);
      if (newType.categories) {
        CategoryDropdown.setUpDropdown(this, columnIndex);
        CategoryCellElement.setColumnCategoryStructure(this, columnIndex);
      } else if (newType.calendar) {
        DateCellElement.setColumnDateStructure(this, columnIndex);
      } else {
        DataCellElement.setColumnDataStructure(this, columnIndex);
      }
    }
  }
}
