import {ColumnsDetailsT, ColumnSizerT, ColumnDetailsT, ColumnDetailsTPartial} from '../../types/columnDetails';
import {ColumnSizerElementOverlay} from '../../elements/columnSizer/columnSizerElementOverlay';
import {ColumnSizerElement} from '../../elements/columnSizer/columnSizerElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizer} from './columnSizer';

export class InsertRemoveColumnSizer {
  private static updateIdsOfAllSubsequent(columnsDetails: ColumnsDetailsT, nextIndex: number) {
    columnsDetails.slice(nextIndex).forEach((columnDetails: ColumnDetailsT, index: number) => {
      const relativeIndex = nextIndex + index;
      ColumnSizerElement.setElementId(columnDetails.columnSizer.element, relativeIndex);
    });
  }

  private static applySizerStateToElement(columnSizerElement: HTMLElement, columnSizer: ColumnSizerT) {
    ColumnSizerElement.setDefaultProperties(columnSizerElement, columnSizer.styles.default.width);
    ColumnSizerElementOverlay.setWidth(columnSizer.element.children[0] as HTMLElement, columnSizer.styles.default.width);
    ColumnSizerElement.setPermanentProperties(columnSizerElement, columnSizer.styles.permanent.marginLeft);
    ColumnSizerElement.setBackgroundImage(columnSizerElement, columnSizer.styles.default.backgroundImage);
  }

  private static insertAtIndex(etc: EditableTableComponent, newColumnDetails: ColumnDetailsTPartial, columnIndex: number) {
    // assuming this has already been added, otherwise pass it down through params
    const cellDividerElement = newColumnDetails.elements[0].nextSibling as HTMLElement;
    const columnSizer = ColumnSizer.create(etc, columnIndex);
    newColumnDetails.columnSizer = columnSizer;
    cellDividerElement.appendChild(columnSizer.element);
    InsertRemoveColumnSizer.applySizerStateToElement(columnSizer.element, columnSizer);
  }

  private static updatePrevious(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    const previousIndex = columnIndex - 1;
    if (previousIndex < 0) return;
    const {columnSizer} = columnsDetails[previousIndex];
    // no need for full creation as there is a need to retain the element and its bindings
    const newColumnSizer = ColumnSizer.createObject(columnSizer.element, columnsDetails, previousIndex);
    InsertRemoveColumnSizer.applySizerStateToElement(newColumnSizer.element, newColumnSizer);
    // cannot simply overwright columnSizer it has already binded to elements
    Object.assign(columnSizer, newColumnSizer);
  }

  // prettier-ignore
  public static insert(etc: EditableTableComponent,
      columnsDetails: ColumnsDetailsT, newColumnDetails: ColumnDetailsTPartial, columnIndex: number) {
    InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex);
    InsertRemoveColumnSizer.insertAtIndex(etc, newColumnDetails, columnIndex);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex + 1);
  }

  public static remove(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    InsertRemoveColumnSizer.updatePrevious(columnsDetails, columnIndex);
    InsertRemoveColumnSizer.updateIdsOfAllSubsequent(columnsDetails, columnIndex);
  }
}
