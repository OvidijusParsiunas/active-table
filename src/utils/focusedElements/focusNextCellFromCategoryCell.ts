import {FocusNextColumnCellFromTextDiv} from './focusNextColumnCellFromTextDiv';
import {EditableTableComponent} from '../../editable-table-component';

export class FocusNextCellFromCategoryCell {
  public static focusOrBlurRowNextCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    FocusNextColumnCellFromTextDiv.focusOrBlurNext(etc, columnIndex, rowIndex);
  }

  public static focusOrBlurColumnNextCell(elements: HTMLElement[], rowIndex: number) {
    const nextColumnCell = elements[rowIndex + 1];
    if (nextColumnCell) {
      // needs to be mousedown in order to set focusedCell
      nextColumnCell.dispatchEvent(new Event('mousedown'));
      nextColumnCell.scrollIntoView({block: 'nearest'});
    } else {
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (elements[rowIndex].children[0] as HTMLElement).blur();
    }
  }
}
