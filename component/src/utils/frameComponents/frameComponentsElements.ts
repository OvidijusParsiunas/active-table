import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsElements {
  // index and add column cells are added on row insertion
  // CAUTION-4
  public static addFrameBodyElements(at: ActiveTable) {
    // add new row element - REF-18 (the row element has already been created and cell added to it)
    at._tableBodyElementRef?.appendChild(at._addRowCellElementRef?.parentElement as HTMLElement);
    ToggleAdditionElements.update(at, true, AddNewRowElement.toggle);
  }
}
