import {CategoryCellElement} from '../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {DateCellElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {DataCellElement} from '../../elements/cell/dataCell/dataCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ProcessedDataTextStyle} from './processedDataTextStyle';
import {CellEvents} from '../../elements/cell/cellEvents';

export class ChangeColumnType {
  private static setInvalidCellToDefault(etc: EditableTableComponent, rowIndex: number, columnIndex: number) {
    const relativeRowIndex = rowIndex + 1;
    const cellElement = etc.columnsDetails[columnIndex].elements[relativeRowIndex];
    return CellEvents.setCellToDefaultIfNeeded(etc, relativeRowIndex, columnIndex, cellElement, false);
  }

  private static setInvalidCellsToDefault(etc: EditableTableComponent, columnIndex: number) {
    let updateTableEvent = false;
    etc.contents.slice(1).forEach((_, rowIndex) => {
      const isUpdated = ChangeColumnType.setInvalidCellToDefault(etc, rowIndex, columnIndex);
      if (isUpdated && !updateTableEvent) updateTableEvent = true;
    });
    if (updateTableEvent) etc.onTableUpdate(etc.contents);
  }

  private static setNew(etc: EditableTableComponent, newType: string, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.activeType = columnDetails.types.find((type) => type.name === newType) as ColumnTypeInternal;
    return columnDetails.activeType;
  }

  public static setNewStructureBasedOnType(etc: EditableTableComponent, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.categories) {
      CategoryDropdown.setUpDropdown(etc, columnIndex);
      CategoryCellElement.setColumnCategoryStructure(etc, columnIndex);
    } else if (newType.calendar) {
      DateCellElement.setColumnDateStructure(etc, columnIndex);
    } else {
      DataCellElement.setColumnDataStructure(etc, columnIndex);
    }
  }

  private static resetAndChangeFunc(etc: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const newType = ChangeColumnType.setNew(etc, newTypeName, columnIndex);
    if (newType.textValidation.func && newType.textValidation.setTextToDefaultOnFail) {
      ChangeColumnType.setInvalidCellsToDefault(etc, columnIndex);
    }
    ChangeColumnType.setNewStructureBasedOnType(etc, columnIndex, newType);
  }

  // prettier-ignore
  public static change(this: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const previousType = this.columnsDetails[columnIndex].activeType;
    if (newTypeName !== previousType.name) {
      ProcessedDataTextStyle.resetDataCellsStyle(this, columnIndex,
        ChangeColumnType.resetAndChangeFunc.bind(this, this, newTypeName, columnIndex));
    }
  }
}
