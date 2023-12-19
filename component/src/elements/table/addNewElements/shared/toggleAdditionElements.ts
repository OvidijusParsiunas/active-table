import {RootCellElement} from '../rootCell/rootCellElement';
import {ActiveTable} from '../../../../activeTable';

type ToggleWhenData = (at: ActiveTable, isInsert: boolean) => void;

// IMPORTANT - this should not be executed in a timeout as it would cause a stutter on the UI
// REF-18
export class ToggleAdditionElements {
  public static update(at: ActiveTable, isInsert: boolean, toggleWhenData: ToggleWhenData) {
    if (at.data.length === 0 || at._columnsDetails.length === 0) {
      RootCellElement.display(at);
    } else {
      toggleWhenData(at, isInsert);
    }
  }
}
