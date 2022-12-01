import {EditableTableComponent} from '../../../editable-table-component';
import {TEXT_DIV_COLUMN_TYPE} from '../../../enums/columnType';

type ConvertFunc = (etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) => void;

export class CellWithTextElement {
  // prettier-ignore
  public static convertColumnToTextType(etc: EditableTableComponent, columnIndex: number, previousType: string,
      convertCell: ConvertFunc) {
    const {elements} = etc.columnsDetails[columnIndex];
    // if the previous column tyoe is not simple data
    const shouldResetContents = Boolean(TEXT_DIV_COLUMN_TYPE[previousType]);
    elements.slice(1).forEach((cellElement: HTMLElement, dataRowIndex: number) => {
      // this is a very simple way to clear the previous content inside the cell so it would be date-like
      // it may not be as efficient as text div element from date to category may not need to be wiped
      // and this if statement also called every time, however no efficiency issues have been seen on
      // the browser so far
      if (shouldResetContents) {
        const text = (cellElement.children[0] as HTMLElement).innerText as string; // CAUTION-1
        cellElement.innerText = text;
      }
      const relativeRowIndex = dataRowIndex + 1;
      convertCell(etc, relativeRowIndex, columnIndex, cellElement);
    });
  }
}
