import {ColumnDropdown} from '../../elements/dropdown/columnDropdown/columnDropdown';
import {DynamicCellTextUpdateObj} from '../../types/dynamicCellTextUpdateObj';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {Dropdown} from '../../elements/dropdown/dropdown';
import {ObjectUtils} from '../object/objectUtils';

export class DynamicCellTextUpdate {
  public static update(etc: EditableTableComponent, dynamicCellTextUpdateObj: DynamicCellTextUpdateObj) {
    const {newText, rowIndex, columnIndex} = dynamicCellTextUpdateObj;
    if (!ObjectUtils.areValuesFullyDefined(newText, rowIndex, columnIndex)) return;
    if (typeof newText !== 'string' && typeof newText !== 'number') return;
    const element = etc.columnsDetails[columnIndex]?.elements[rowIndex];
    if (!element || newText === CellElement.getText(element)) return;
    CellEvents.updateCell(etc, newText, rowIndex, columnIndex, {element, processText: rowIndex > 0});
    if (rowIndex === 0) {
      if (Dropdown.isDisplayed(etc.activeOverlayElements.columnDropdown)) ColumnDropdown.processTextAndHide(etc);
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(etc, element, columnIndex);
    }
  }
}
