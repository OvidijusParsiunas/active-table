import {EditableTableComponent} from '../../../../editable-table-component';
import {NoContentStubElement} from './noContentStubElement';

type ToggleWhenContent = (etc: EditableTableComponent, isInsert: boolean) => void;

// IMPORTANT - this should not be executed in a timeout as it would cause a stutter on the UI
// REF-18
export class ToggleAdditionElements {
  public static update(etc: EditableTableComponent, isInsert: boolean, toggleWhenContent: ToggleWhenContent) {
    if (etc.contents.length === 0) {
      NoContentStubElement.display(etc);
    } else {
      toggleWhenContent(etc, isInsert);
    }
  }
}
