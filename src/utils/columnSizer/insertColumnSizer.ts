import {ColumnsDetails, ColumnSizerStateT, ColumnDetailsT, ColumnDetailsTPartial} from '../../types/columnDetails';
import {ColumnSizerElementOverlay} from '../../elements/columnSizerElement/columnSizerElementOverlay';
import {ColumnSizerElement} from '../../elements/columnSizerElement/columnSizerElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerState} from './columnSizerState';

export class InsertColumnSizer {
  private static updateIdsOfAllNext(columnsDetails: ColumnsDetails, columnIndex: number) {
    const nextIndex = columnIndex + 1;
    columnsDetails.slice(nextIndex).forEach((columnDetails: ColumnDetailsT, index: number) => {
      const relativeIndex = nextIndex + index;
      ColumnSizerElement.setElementId(columnDetails.columnSizer.element, relativeIndex);
    });
  }

  private static applySizerStateToElement(columnSizerElement: HTMLElement, columnSizer: ColumnSizerStateT) {
    ColumnSizerElement.setDefaultProperties(columnSizerElement, columnSizer.styles.default.width);
    ColumnSizerElementOverlay.setWidth(columnSizer.element.children[0] as HTMLElement, columnSizer.styles.default.width);
    ColumnSizerElement.setPermanentProperties(columnSizerElement, columnSizer.styles.permanent.marginLeft);
    ColumnSizerElement.setBackgroundImage(columnSizerElement, columnSizer.styles.default.backgroundImage);
  }

  private static insertAtIndex(etc: EditableTableComponent, newColumnDetails: ColumnDetailsTPartial, columnIndex: number) {
    // assuming this has already been added, otherwise pass it down through params
    const cellDividerElement = newColumnDetails.elements[0].nextSibling as HTMLElement;
    const columnSizer = ColumnSizerState.create(etc, columnIndex);
    newColumnDetails.columnSizer = columnSizer;
    // WORK - need this on delete to be working correctly
    cellDividerElement.appendChild(columnSizer.element);
    InsertColumnSizer.applySizerStateToElement(columnSizer.element, columnSizer);
  }

  private static updatePrevious(columnsDetails: ColumnsDetails, columnIndex: number) {
    const previousIndex = columnIndex - 1;
    if (previousIndex < 0) return;
    const {columnSizer} = columnsDetails[previousIndex];
    // no need for full creation as there is a need to retain the element and its bindings
    const newColumnSizer = ColumnSizerState.createObject(columnSizer.element, columnsDetails, previousIndex);
    InsertColumnSizer.applySizerStateToElement(newColumnSizer.element, newColumnSizer);
    // cannot simply overwright columnSizer it has already binded to elements
    Object.assign(columnSizer, newColumnSizer);
  }

  // prettier-ignore
  public static insert(etc: EditableTableComponent,
      columnsDetails: ColumnsDetails, newColumnDetails: ColumnDetailsTPartial, columnIndex: number) {
    InsertColumnSizer.updatePrevious(columnsDetails, columnIndex);
    InsertColumnSizer.insertAtIndex(etc, newColumnDetails, columnIndex);
    InsertColumnSizer.updateIdsOfAllNext(columnsDetails, columnIndex);
  }
}
