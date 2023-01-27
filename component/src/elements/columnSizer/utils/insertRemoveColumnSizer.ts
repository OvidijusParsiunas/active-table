import {ColumnsDetailsT, ColumnDetailsT, ColumnDetailsNoSizer} from '../../../types/columnDetails';
import {ColumnSizerOverlayElement} from '../columnSizerOverlayElement';
import {MovableColumnSizerElement} from '../movableColumnSizerElement';
import {ColumnSizerFillerElement} from '../columnSizerFillerElement';
import {ColumnSizerElement} from '../columnSizerElement';
import {ColumnSizerT} from '../../../types/columnSizer';
import {ActiveTable} from '../../../activeTable';
import {ColumnSizer} from './columnSizer';

export class InsertRemoveColumnSizer {
  private static updateIdsOfAllSubsequent(columnsDetails: ColumnsDetailsT, nextIndex: number) {
    columnsDetails.slice(nextIndex).forEach((columnDetails: ColumnDetailsT, index: number) => {
      if (!columnDetails.columnSizer) return;
      const relativeIndex = nextIndex + index;
      ColumnSizerElement.setElementId(columnDetails.columnSizer.element, relativeIndex);
    });
  }

  private static applySizerStateToElements(columnSizer: ColumnSizerT) {
    const {element: sizerElement, movableElement, overlayElement, styles} = columnSizer;
    ColumnSizerElement.unsetElementsToDefault(sizerElement, styles.default.width);
    ColumnSizerFillerElement.setWidth(sizerElement.children[0] as HTMLElement, styles.default.width);
    ColumnSizerElement.setStaticProperties(sizerElement, styles.static.marginRight);
    ColumnSizerElement.setBackgroundImage(sizerElement, styles.default.backgroundImage);
    MovableColumnSizerElement.setStaticProperties(movableElement, styles.static.marginRight, styles.hover.width);
    ColumnSizerOverlayElement.setStaticProperties(overlayElement, styles.static.marginRight, styles.hover.width);
  }

  private static insertAtIndex(at: ActiveTable, newColumnDetails: ColumnDetailsNoSizer, columnIndex: number) {
    // assuming this has already been added, otherwise pass it down through params
    const cellDividerElement = newColumnDetails.elements[0].nextSibling as HTMLElement;
    const columnSizer = ColumnSizer.create(at, columnIndex);
    newColumnDetails.columnSizer = columnSizer;
    cellDividerElement.appendChild(columnSizer.element);
    cellDividerElement.appendChild(columnSizer.overlayElement);
    cellDividerElement.appendChild(columnSizer.movableElement);
    InsertRemoveColumnSizer.applySizerStateToElements(columnSizer);
  }

  // prettier-ignore
  public static updateSizer(columnSizer: ColumnSizerT, columnsDetails: ColumnsDetailsT, sizerIndex: number,
      tableElement: HTMLElement) {
    // no need for full creation as there is a need to retain the element and its bindings
    const newColumnSizer = ColumnSizer.createObject(columnSizer.element, columnsDetails, sizerIndex, tableElement);
    // cannot simply overwrite columnSizer object as it has already binded to elements
    // movableElement ref is not overwritten
    Object.assign(columnSizer, newColumnSizer);
    InsertRemoveColumnSizer.applySizerStateToElements(columnSizer);
  }

  private static updatePrevious(columnsDetails: ColumnsDetailsT, columnIndex: number, tableElement: HTMLElement) {
    const previousIndex = columnIndex - 1;
    if (previousIndex < 0) return;
    const {columnSizer} = columnsDetails[previousIndex];
    if (columnsDetails[previousIndex].settings.widths?.staticWidth !== undefined || !columnSizer) return;
    InsertRemoveColumnSizer.updateSizer(columnSizer, columnsDetails, columnIndex, tableElement);
  }

  private static getNewColumnIndexIfWidthSet(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    // if inserting at the end and the previous column has a sizer (happens when populating the table initially)
    // do not insert a new sizer, if no sizer - insert a new sizer
    if (columnsDetails.length - 1 === columnIndex) {
      return columnsDetails[columnIndex - 1]?.columnSizer ? -1 : columnIndex - 1;
    }
    return columnIndex;
  }

  // REF-13
  public static insert(at: ActiveTable, columnIndex: number) {
    const {columnsDetails} = at;
    if (columnsDetails[columnIndex].settings.widths?.staticWidth !== undefined) return;
    if (at.tableDimensions.width !== undefined) {
      columnIndex = InsertRemoveColumnSizer.getNewColumnIndexIfWidthSet(at.columnsDetails, columnIndex);
      if (columnIndex === -1 || columnsDetails[columnIndex].settings.widths?.staticWidth !== undefined) return;
    } else {
      // only dynamic width tables have a sizer on the last column - hence only their styles need to be changed
      InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex, at.tableElementRef as HTMLElement);
    }
    InsertRemoveColumnSizer.insertAtIndex(at, at.columnsDetails[columnIndex], columnIndex);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex + 1);
  }

  // this is only used for when table width is static, otherwise it is removed directly with the column
  private static removeSizer(newColumnDetails: ColumnDetailsNoSizer) {
    newColumnDetails.columnSizer?.element?.remove();
    newColumnDetails.columnSizer?.movableElement?.remove();
    newColumnDetails.columnSizer?.overlayElement?.remove();
    delete newColumnDetails.columnSizer;
  }

  // need to remove the sizer of the new last column as when width is set - last column does not have a sizer
  private static removeIfLastColumn(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    const isLastColumn = columnsDetails.length === columnIndex;
    if (isLastColumn && columnsDetails[columnIndex]) {
      columnIndex -= 1;
      InsertRemoveColumnSizer.removeSizer(columnsDetails[columnIndex]);
    }
    return columnIndex;
  }

  public static remove(at: ActiveTable, columnIndex: number) {
    const {tableDimensions, columnsDetails, tableElementRef} = at;
    if (tableDimensions.width !== undefined) {
      columnIndex = InsertRemoveColumnSizer.removeIfLastColumn(columnsDetails, columnIndex);
    }
    InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex, tableElementRef as HTMLElement);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex);
  }

  // This is used to cleanup sizers for columns that have or had static widths because they do not have sizers,
  // additionally when the table width is set the last column that is not static also does not have a sizer.
  public static cleanUpCustomColumnSizers(at: ActiveTable, changedColumnIndex: number) {
    const {tableDimensions, columnsDetails} = at;
    if (tableDimensions.width === undefined) return;
    let isLastDynamicColumnFound = false;
    // traversing backwards
    for (let i = columnsDetails.length - 1; i >= 0; i -= 1) {
      const columnDetails = columnsDetails[i];
      // if the column has a width or it is the last column, it should not have a sizer
      if (columnDetails.settings.widths?.staticWidth !== undefined) {
        if (columnDetails.columnSizer) InsertRemoveColumnSizer.removeSizer(columnDetails);
        // dynamic column traversal (columns without a set width in settings)
      } else if (isLastDynamicColumnFound === false) {
        isLastDynamicColumnFound = true;
        // last column index should not have a sizer
        if (columnDetails.columnSizer) InsertRemoveColumnSizer.removeSizer(columnDetails);
        // exit only if the first column without settings is before changedColumnIndex
        if (i < changedColumnIndex) break;
      } else {
        // if column does not have settings and it is not last, it should have a sizer
        if (!columnDetails.columnSizer && columnsDetails.length - 1 !== i) {
          InsertRemoveColumnSizer.insertAtIndex(at, columnDetails, i);
        }
        // if the last dynamic column has already been identified and we are beyond the changed index, can exit
        if (isLastDynamicColumnFound === true && i < changedColumnIndex) break;
      }
    }
  }
}
