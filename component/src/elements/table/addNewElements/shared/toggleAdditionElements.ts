import {ActiveTable} from '../../../../activeTable';
import {RootCellElement} from './rootCellElement';

type ToggleWhenContent = (at: ActiveTable, isInsert: boolean) => void;

// IMPORTANT - this should not be executed in a timeout as it would cause a stutter on the UI
// REF-18
export class ToggleAdditionElements {
  public static update(at: ActiveTable, isInsert: boolean, toggleWhenContent: ToggleWhenContent) {
    if (at.content.length === 0 || at._columnsDetails.length === 0) {
      RootCellElement.display(at);
    } else {
      toggleWhenContent(at, isInsert);
    }
  }
}
