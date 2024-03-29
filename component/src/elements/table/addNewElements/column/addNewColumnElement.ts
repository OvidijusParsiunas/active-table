import {StaticTableWidthUtils} from '../../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnSettingsBorderUtils} from '../../../../utils/columnSettings/columnSettingsBorderUtils';
import {MaximumColumns} from '../../../../utils/insertRemoveStructure/insert/maximum/maximumColumns';
import {FrameComponentsCellsColors} from '../../../../types/frameComponentsCellsColors';
import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {AddNewColumnEvents} from './addNewColumnEvents';
import {CellElement} from '../../../cell/cellElement';
import {ActiveTable} from '../../../../activeTable';
import {TableElement} from '../../tableElement';

export class AddNewColumnElement {
  public static readonly ADD_COLUMN_CELL_CLASS = 'add-column-cell';
  public static readonly DEFAULT_WIDTH = 25;
  private static readonly DEFAULT_WIDTH_PX = `${AddNewColumnElement.DEFAULT_WIDTH}px`;

  // the toggling of the add new column element is not a simple display style change because the following selector:
  // .row > .cell:last-of-type which is responsible for not adding a right-border for the rightmost cell can only
  // detect the last .cell element, so when this button is displayed we want the selector to recognise it and
  // not display a border on the right and not affect the css of the cell before it. When it is not displayed,
  // we want the previous cell to be recognised by the selector. Unfortunately this is not possible as even
  // renaming the class names on this button does not re-trigger selector to identify the previous cell as last.
  // The only way to do this is to remove the cell element when not visible, which is what the code below is doing
  // and re-adding the cell when it is visible. (The cell still remains in the addColumnCellsElementsRef object).
  private static setDisplay(cell: HTMLElement, isDisplay: boolean, tableBodyElement: HTMLElement, rowIndex: number) {
    if (isDisplay) {
      tableBodyElement.children[rowIndex].appendChild(cell);
    } else {
      cell.remove();
    }
  }

  private static createCell(at: ActiveTable, isHeader: boolean) {
    const cell = CellElement.createBaseCell(isHeader);
    cell.classList.add(
      CellElement.CELL_CLASS,
      GenericElementUtils.NOT_SELECTABLE_CLASS,
      AddNewColumnElement.ADD_COLUMN_CELL_CLASS
    );
    Object.assign(cell.style, at._defaultColumnsSettings.cellStyle, at._frameComponents.styles?.default);
    AddNewColumnEvents.setEvents(at, cell);
    return cell;
  }

  // prettier-ignore
  private static createHeaderCell(at: ActiveTable) {
    const {_defaultColumnsSettings: {headerStyles}, _frameComponents: {cellColors, inheritHeaderColors}} = at;
    const headerCell = AddNewColumnElement.createCell(at, true);
    headerCell.style.width = AddNewColumnElement.DEFAULT_WIDTH_PX;
    headerCell.innerText = '+';
    Object.assign(headerCell.style, inheritHeaderColors ? headerStyles?.default : {}, cellColors.header.default);
    return headerCell;
  }

  private static createDataCell(at: ActiveTable) {
    const dataCell = AddNewColumnElement.createCell(at, false);
    Object.assign(dataCell.style, at._frameComponents.cellColors.data.default);
    return dataCell;
  }

  private static isDisplayed(addColumnCellsElementsRef: HTMLElement[]) {
    return GenericElementUtils.doesElementExistInDom(addColumnCellsElementsRef[0]);
  }

  public static createAndAppendToRow(at: ActiveTable, row: HTMLElement, rowIndex: number) {
    const {_addColumnCellsElementsRef: addColumnCellsElementsRef, _columnsDetails} = at;
    // if statement needs to be before the addition of the new cell to addColumnCellsElementsRef
    const isDisplay = addColumnCellsElementsRef.length === 0 || AddNewColumnElement.isDisplayed(addColumnCellsElementsRef);
    const cell = rowIndex === 0 ? AddNewColumnElement.createHeaderCell(at) : AddNewColumnElement.createDataCell(at);
    addColumnCellsElementsRef.splice(rowIndex, 0, cell);
    // REF-23
    const columnDetails = _columnsDetails[_columnsDetails.length - 1];
    ColumnSettingsBorderUtils.unsetSubjectBorder(addColumnCellsElementsRef, columnDetails.elements, 'left', rowIndex);
    if (isDisplay) {
      if (MaximumColumns.canAddMore(at)) {
        row.appendChild(cell);
      } else if (rowIndex === 0) {
        TableElement.changeStaticWidthTotal(at._tableDimensions, -AddNewColumnElement.DEFAULT_WIDTH);
      }
    }
  }

  // prettier-ignore
  private static toggleEachCell(canAddMore: boolean, tableBodyElement: HTMLElement,
      addColumnCellsElementsRef: HTMLElement[], cellColors: FrameComponentsCellsColors) {
    addColumnCellsElementsRef.forEach((cell, rowIndex) => {
      AddNewColumnElement.setDisplay(cell, canAddMore, tableBodyElement, rowIndex);
    });
    if (!canAddMore) {
      // remove does not trigger mouse leave event, hence need to trigger it manually
      setTimeout(() => AddNewColumnEvents.toggleColor(false, addColumnCellsElementsRef, cellColors))
    }
  }

  private static changeTableWidths(at: ActiveTable, canAddMore: boolean, isInsert: boolean) {
    const delta = canAddMore ? AddNewColumnElement.DEFAULT_WIDTH : -AddNewColumnElement.DEFAULT_WIDTH;
    TableElement.changeStaticWidthTotal(at._tableDimensions, delta);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, isInsert);
  }

  // prettier-ignore
  public static toggle(at: ActiveTable, isInsert: boolean) {
    const {_addColumnCellsElementsRef: addColumnCellsElementsRef, _tableBodyElementRef,
      _frameComponents: {displayAddNewColumn, cellColors: colors}} = at;
    if (!displayAddNewColumn || !_tableBodyElementRef) return;
    const canAddMore = MaximumColumns.canAddMore(at);
    // do not toggle if already in the intended state
    if (canAddMore === AddNewColumnElement.isDisplayed(addColumnCellsElementsRef)) return;
    // for isTableAtMaxWidth to be triggered correctly for maxWidth, add cells before it and remove after it
    if (canAddMore) {
      AddNewColumnElement.toggleEachCell(canAddMore, _tableBodyElementRef, addColumnCellsElementsRef, colors);
      AddNewColumnElement.changeTableWidths(at, canAddMore, isInsert);
    } else {
      AddNewColumnElement.changeTableWidths(at, canAddMore, isInsert);
      AddNewColumnElement.toggleEachCell(canAddMore, _tableBodyElementRef, addColumnCellsElementsRef, colors);
    }
  }
}
