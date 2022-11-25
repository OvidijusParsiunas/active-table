import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {AuxiliaryTableContentProps} from '../../types/auxiliaryTableContentProps';
import {EditableTableComponent} from '../../editable-table-component';
import {CellHighlightUtil} from '../color/cellHighlightUtil';
import {CellEventColors} from '../../types/cellEventColors';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContent {
  public static EVENT_COLORS: CellEventColors = {default: '', hover: ''};

  // index and add column cells are added on row insertion
  // CAUTION-4
  public static addAuxiliaryBodyElements(etc: EditableTableComponent) {
    // add new row element - REF-18 (the row element has already been created and cell added to it)
    etc.tableBodyElementRef?.appendChild(etc.addRowCellElementRef?.parentElement as HTMLElement);
    ToggleAdditionElements.update(etc, true, AddNewRowElement.toggle);
  }

  public static setAuxiliaryContentEventColors(etc: EditableTableComponent) {
    AuxiliaryTableContent.EVENT_COLORS = {
      default: etc.auxiliaryTableContentProps.style.backgroundColor || etc.cellStyle.backgroundColor || '',
      hover:
        etc.auxiliaryTableContentProps.hoverColor ||
        etc.cellStyle.backgroundColor ||
        CellHighlightUtil.DEFAULT_HIGHLIGHT_COLOR,
    };
  }

  public static createClientProps(): AuxiliaryTableContentProps {
    return {
      style: {},
    };
  }
}
