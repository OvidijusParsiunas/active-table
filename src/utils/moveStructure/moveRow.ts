import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';
import {MoveUtils} from './moveUtils';

export class MoveRow {
  // prettier-ignore
  private static overwrite(etc: EditableTableComponent, sourceText: string[], targetIndex: number) {
    const overwrittenText: string[] = [];
    etc.columnsDetails.forEach((columnDetails, columnIndex) => {
      const overwrittenDataText = MoveUtils.setNewElementText(etc, sourceText[columnIndex],
        columnDetails.elements[targetIndex], columnIndex, targetIndex);
      overwrittenText.push(overwrittenDataText);
    });
    return overwrittenText;
  }

  public static move(etc: EditableTableComponent, rowIndex: number, isToDown: boolean) {
    const {columnsDetails} = etc;
    const siblingIndex = isToDown ? rowIndex + 1 : rowIndex - 1;
    const siblingRowText = columnsDetails.map(({elements}) => CellElement.getText(elements[siblingIndex]));
    // overwrite current row using sibling row
    const overwrittenText = MoveRow.overwrite(etc, siblingRowText, rowIndex);
    // overwrite sibling row using overwritten row
    MoveRow.overwrite(etc, overwrittenText, siblingIndex);
  }
}
