import {AuxiliaryTableContentColors} from '../../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {StaticTableWidthUtils} from '../../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnSettingsBorderUtils} from '../../../../utils/columnSettings/columnSettingsBorderUtils';
import {MaximumColumns} from '../../../../utils/insertRemoveStructure/insert/maximumColumns';
import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {AddNewColumnEvents} from './addNewColumnEvents';
import {CellElement} from '../../../cell/cellElement';
import {TableElement} from '../../tableElement';

export class AddNewColumnElement {
  public static readonly ADD_COLUMN_CELL_CLASS = 'add-column-cell';
  public static readonly DEFAULT_WIDTH = 20;
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

  private static createCell(etc: EditableTableComponent, tag: 'th' | 'td') {
    const cell = document.createElement(tag);
    cell.classList.add(CellElement.CELL_CLASS, AddNewColumnElement.ADD_COLUMN_CELL_CLASS);
    // backgroundColor controlled by column group - REF-17
    Object.assign(cell.style, etc.defaultColumnsSettings.cellStyle, {backgroundColor: ''});
    AddNewColumnEvents.setEvents(etc, cell);
    return cell;
  }

  private static createHeaderCell(etc: EditableTableComponent) {
    const headerCell = AddNewColumnElement.createCell(etc, 'th');
    headerCell.style.width = AddNewColumnElement.DEFAULT_WIDTH_PX;
    headerCell.innerText = '+';
    Object.assign(
      headerCell.style,
      etc.defaultColumnsSettings.headerStyleProps?.default,
      AuxiliaryTableContentColors.CELL_COLORS.header.default
    );
    return headerCell;
  }

  private static createDataCell(etc: EditableTableComponent) {
    return AddNewColumnElement.createCell(etc, 'td');
  }

  private static isDisplayed(addColumnCellsElementsRef: HTMLElement[]) {
    return GenericElementUtils.doesElementExistInDom(addColumnCellsElementsRef[0]);
  }

  public static createAndAppendToRow(etc: EditableTableComponent, row: HTMLElement, rowIndex: number) {
    const {addColumnCellsElementsRef, columnsDetails} = etc;
    // if statement needs to be before the addition of the new cell to addColumnCellsElementsRef
    const isDisplay = addColumnCellsElementsRef.length === 0 || AddNewColumnElement.isDisplayed(addColumnCellsElementsRef);
    const cell = rowIndex === 0 ? AddNewColumnElement.createHeaderCell(etc) : AddNewColumnElement.createDataCell(etc);
    addColumnCellsElementsRef.splice(rowIndex, 0, cell);
    // REF-23
    const columnDetails = columnsDetails[columnsDetails.length - 1];
    ColumnSettingsBorderUtils.unsetSubjectBorder(addColumnCellsElementsRef, columnDetails.elements, 'left', rowIndex);
    if (isDisplay) row.appendChild(cell);
  }

  // prettier-ignore
  private static toggleEachCell(canAddMore: boolean,
      tableBodyElement: HTMLElement, addColumnCellsElementsRef: HTMLElement[], columnGroupElement: HTMLElement) {
    addColumnCellsElementsRef.forEach((cell, rowIndex) => {
      AddNewColumnElement.setDisplay(cell, canAddMore, tableBodyElement, rowIndex);
    });
    if (!canAddMore) {
      // remove does not trigger mouse leave event, hence need to trigger it manually
      setTimeout(() => AddNewColumnEvents.toggleColor(columnGroupElement, false, addColumnCellsElementsRef))
    }
  }

  private static changeTableWidths(etc: EditableTableComponent, canAddMore: boolean, isInsert: boolean) {
    TableElement.changeStaticWidthTotal(
      canAddMore ? AddNewColumnElement.DEFAULT_WIDTH : -AddNewColumnElement.DEFAULT_WIDTH
    );
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, isInsert);
  }

  // prettier-ignore
  public static toggle(etc: EditableTableComponent, isInsert: boolean) {
    const {addColumnCellsElementsRef, tableBodyElementRef, columnGroupRef,
      auxiliaryTableContentInternal: {displayAddColumnCell}} = etc;
    if (!displayAddColumnCell || !tableBodyElementRef || !columnGroupRef) return;
    const canAddMore = MaximumColumns.canAddMore(etc);
    // do not toggle if already in the intended state
    if (canAddMore === AddNewColumnElement.isDisplayed(addColumnCellsElementsRef)) return;
    // for isTableAtMaxWidth to be triggered correctly for maxWidth, add cells before it and remove after it
    if (canAddMore) {
      AddNewColumnElement.toggleEachCell(canAddMore, tableBodyElementRef, addColumnCellsElementsRef, columnGroupRef);
      AddNewColumnElement.changeTableWidths(etc, canAddMore, isInsert);
    } else {
      AddNewColumnElement.changeTableWidths(etc, canAddMore, isInsert);
      AddNewColumnElement.toggleEachCell(canAddMore, tableBodyElementRef, addColumnCellsElementsRef, columnGroupRef);
    }
  }
}
