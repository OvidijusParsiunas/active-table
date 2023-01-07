import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnTypeInternal} from '../../../../types/columnTypeInternal';
import {SelectCellElement} from './selectCellElement';
import {LabelCellElement} from './labelCellElement';

export class ConvertToSelectCell {
  // prettier-ignore
  public static convertCell(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, newCellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (columnDetails.activeType.isSelect) {
      SelectCellElement.setCellSelectStructure(etc, newCellElement, rowIndex, columnIndex);
      SelectCellElement.finaliseEditedText(etc, newCellElement.children[0] as HTMLElement, columnIndex);
    } else {
      LabelCellElement.setCellCategoryStructure(etc, newCellElement, rowIndex, columnIndex);
      LabelCellElement.finaliseEditedText(etc, newCellElement.children[0] as HTMLElement, columnIndex, true);
    }
  }

  public static convertColumn(etc: EditableTableComponent, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.isSelect) {
      SelectCellElement.setColumnSelectStructure(etc, columnIndex);
    } else {
      LabelCellElement.setColumnCategoryStructure(etc, columnIndex);
    }
  }
}
