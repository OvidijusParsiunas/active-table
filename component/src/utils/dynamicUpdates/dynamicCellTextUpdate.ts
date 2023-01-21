import {ColumnDropdown} from '../../elements/dropdown/columnDropdown/columnDropdown';
import {DynamicCellTextUpdateT} from '../../types/dynamicCellTextUpdateT';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {Dropdown} from '../../elements/dropdown/dropdown';
import {ObjectUtils} from '../object/objectUtils';
import {ActiveTable} from '../../activeTable';

export class DynamicCellTextUpdate {
  public static update(at: ActiveTable, dynamicCellTextUpdate: DynamicCellTextUpdateT) {
    const {newText, rowIndex, columnIndex} = dynamicCellTextUpdate;
    if (!ObjectUtils.areValuesFullyDefined(newText, rowIndex, columnIndex)) return;
    if (typeof newText !== 'string' && typeof newText !== 'number') return;
    const element = at.columnsDetails[columnIndex]?.elements[rowIndex];
    if (!element || newText === CellElement.getText(element)) return;
    CellEvents.updateCell(at, newText, rowIndex, columnIndex, {element, processText: rowIndex > 0});
    if (rowIndex === 0) {
      if (Dropdown.isDisplayed(at.activeOverlayElements.columnDropdown)) ColumnDropdown.processTextAndHide(at);
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, element, columnIndex);
    }
  }
}
