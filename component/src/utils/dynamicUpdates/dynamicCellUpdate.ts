import {ColumnDropdown} from '../../elements/dropdown/columnDropdown/columnDropdown';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {DynamicCellUpdateT} from '../../types/dynamicCellUpdateT';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {Dropdown} from '../../elements/dropdown/dropdown';
import {ObjectUtils} from '../object/objectUtils';
import {ActiveTable} from '../../activeTable';

export class DynamicCellUpdate {
  public static updateText(at: ActiveTable, dynamicCellUpdate: DynamicCellUpdateT) {
    const {newText, rowIndex, columnIndex} = dynamicCellUpdate;
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
