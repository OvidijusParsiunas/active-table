import {NoContentStubElement} from './noContentStubElement';
import {ActiveTable} from '../../../../activeTable';

type ToggleWhenContent = (at: ActiveTable, isInsert: boolean) => void;

// IMPORTANT - this should not be executed in a timeout as it would cause a stutter on the UI
// REF-18
export class ToggleAdditionElements {
  public static update(at: ActiveTable, isInsert: boolean, toggleWhenContent: ToggleWhenContent) {
    if (at.contents.length === 0) {
      NoContentStubElement.display(at);
    } else {
      toggleWhenContent(at, isInsert);
    }
  }
}
