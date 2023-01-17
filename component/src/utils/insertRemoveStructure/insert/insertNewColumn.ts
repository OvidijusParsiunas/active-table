import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {MaximumColumns} from './maximum/maximumColumns';
import {TableRow} from '../../../types/tableContent';
import {EMPTY_STRING} from '../../../consts/text';
import {ActiveTable} from '../../../activeTable';
import {LastColumn} from '../shared/lastColumn';
import {InsertNewCell} from './insertNewCell';

export class InsertNewColumn {
  private static updateColumns(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = {element: rowElement, index: rowIndex};
    const lastColumn: ElementDetails = LastColumn.getDetails(at.columnsDetails, rowIndex);
    UpdateCellsForColumns.rebindAndFireUpdates(at, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  private static insertToAllRows(at: ActiveTable, columnIndex: number, columnData?: TableRow) {
    const rowElements = ExtractElements.textRowsArrFromTBody(at.tableBodyElementRef as HTMLElement, at.content);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      const cellText = columnData ? columnData[rowIndex] : EMPTY_STRING;
      InsertNewCell.insertToRow(at, rowElement as HTMLElement, rowIndex, columnIndex, cellText as string, true);
      setTimeout(() => InsertNewColumn.updateColumns(at, rowElement as HTMLElement, rowIndex, columnIndex));
    });
  }

  // columnData is in a row format to populate the column by iterating through each row
  public static insert(at: ActiveTable, columnIndex: number, columnData?: TableRow) {
    if (MaximumColumns.canAddMore(at)) {
      FocusedCellUtils.incrementColumnIndex(at.focusedElements.cell, columnIndex);
      InsertNewColumn.insertToAllRows(at, columnIndex, columnData);
      ToggleAdditionElements.update(at, true, AddNewColumnElement.toggle);
      setTimeout(() => {
        at.onTableUpdate(at.content);
        at.columnsDetails.slice(columnIndex).forEach((columnDetails, index) => {
          const relativeIndex = columnIndex + index;
          at.onColumnTypeUpdate({columnIndex: relativeIndex, typeName: columnDetails.activeType.name});
        });
      });
    }
  }

  public static insertEvent(this: ActiveTable) {
    InsertNewColumn.insert(this, this.columnsDetails.length);
  }
}
