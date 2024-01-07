import {ActiveTable} from '../../activeTable';
import {CaretPosition} from './caretPosition';

export class FocusNextRowCell {
  // does not work in Safari
  public static focus(at: ActiveTable, rowIndex: number, elements: HTMLElement[], event: KeyboardEvent) {
    event.preventDefault();
    const nextRowCell = elements[rowIndex + 1];
    if (nextRowCell) {
      nextRowCell.focus(); // required for firefox browser
      CaretPosition.setToEndOfText(at, nextRowCell);
    }
  }

  public static focusOrBlurSelect(elements: HTMLElement[], rowIndex: number) {
    const nextColumnCell = elements[rowIndex + 1];
    if (nextColumnCell) {
      // needs to be mousedown in order to set focusedCell
      nextColumnCell.dispatchEvent(new Event('mousedown'));
      nextColumnCell.scrollIntoView({block: 'nearest'});
      return nextColumnCell;
    }
    // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
    (elements[rowIndex].children[0] as HTMLElement).blur();
    return undefined;
  }
}
