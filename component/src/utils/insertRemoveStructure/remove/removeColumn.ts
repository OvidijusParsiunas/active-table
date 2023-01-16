import {RowDropdownCellOverlay} from '../../../elements/dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlay';
import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {InsertRemoveColumnSizer} from '../../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnGroupElement} from '../../../elements/table/addNewElements/column/columnGroupElement';
import {StaticTableWidthUtils} from '../../tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnSettingsBorderUtils} from '../../columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsWidthUtils} from '../../columnSettings/columnSettingsWidthUtils';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {TableElement} from '../../../elements/table/tableElement';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {TableContents} from '../../../types/tableContents';
import {ActiveTable} from '../../../activeTable';
import {LastColumn} from '../shared/lastColumn';

export class RemoveColumn {
  private static updateAdditionElements(at: ActiveTable) {
    if (at.auxiliaryTableContentInternal.displayAddColumnCell) ColumnGroupElement.update(at);
    ToggleAdditionElements.update(at, false, AddNewColumnElement.toggle);
  }

  // prettier-ignore
  public static reduceStaticWidthTotal(at: ActiveTable, columnDetails: ColumnDetailsT) {
    if (columnDetails.settings && ColumnSettingsWidthUtils.isWidthDefined(columnDetails.settings)) {
      const {number} = ColumnSettingsWidthUtils.getSettingsWidthNumber(
        at.tableElementRef as HTMLElement, columnDetails.settings);
      TableElement.changeStaticWidthTotal(-number);
    }
  }

  private static updateTableDimensions(at: ActiveTable, columnDetails: ColumnDetailsT) {
    RemoveColumn.reduceStaticWidthTotal(at, columnDetails);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, false);
  }

  private static cleanUpContent(contents: TableContents) {
    // when is no data inside rows - remove them
    if (contents.length > 0 && contents[0].length === 0) {
      contents.splice(0);
    }
  }

  private static removeElements(rowElement: HTMLElement, columnIndex: number, displayIndexColumn: boolean) {
    const elementColumnIndex = CellElementIndex.getViaColumnIndex(columnIndex, displayIndexColumn);
    // remove the text element
    rowElement.children[elementColumnIndex].remove();
    // remove the divider element
    rowElement.children[elementColumnIndex].remove();
  }

  private static removeCell(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const lastColumn: ElementDetails = LastColumn.getDetails(at.columnsDetails, rowIndex);
    RemoveColumn.removeElements(rowElement, columnIndex, !!at.auxiliaryTableContentInternal.displayIndexColumn);
    at.contents[rowIndex].splice(columnIndex, 1);
    setTimeout(() => {
      const rowDetails: ElementDetails = {element: rowElement, index: rowIndex};
      UpdateCellsForColumns.rebindAndFireUpdates(at, rowDetails, columnIndex, CELL_UPDATE_TYPE.REMOVED, lastColumn);
    });
  }

  private static removeCellFromAllRows(at: ActiveTable, columnIndex: number) {
    const rowElements = ExtractElements.textRowsArrFromTBody(at.tableBodyElementRef as HTMLElement, at.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      RemoveColumn.removeCell(at, rowElement as HTMLElement, rowIndex, columnIndex);
    });
    RemoveColumn.cleanUpContent(at.contents);
    // needs to be after getDetails but before changeWidthsBasedOnColumnInsertRemove
    const removedColumnDetails = at.columnsDetails.splice(columnIndex, 1)[0];
    RemoveColumn.updateTableDimensions(at, removedColumnDetails);
    return removedColumnDetails;
  }

  public static remove(at: ActiveTable, columnIndex: number) {
    const removedColumnDetails = RemoveColumn.removeCellFromAllRows(at, columnIndex);
    RemoveColumn.updateAdditionElements(at);
    ColumnSettingsBorderUtils.updateSiblingColumns(at, columnIndex);
    setTimeout(() => {
      // CAUTION-2
      removedColumnDetails.selectDropdown.element.remove();
      InsertRemoveColumnSizer.remove(at, columnIndex);
      InsertRemoveColumnSizer.cleanUpCustomColumnSizers(at, columnIndex);
      if (columnIndex === 0 && at.columnsDetails.length > 0) RowDropdownCellOverlay.resetOverlays(at);
      at.onTableUpdate(at.contents);
    });
  }

  public static removeEvent(this: ActiveTable, columnIndex: number) {
    RemoveColumn.remove(this, columnIndex);
  }
}
