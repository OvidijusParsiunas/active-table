import {ColumnsDetailsT} from '../../types/columnDetails';

// these methods are used by column sizer events and static table width column sizer events
export class ColumnSizerEventsUtils {
  public static changeElementWidth(columnElement: HTMLElement, newXMovement: number) {
    const newWidth = `${columnElement.offsetWidth + newXMovement}px`;
    columnElement.style.width = newWidth;
  }

  public static getSizerDetailsViaElementId(id: string, columnsDetails: ColumnsDetailsT) {
    const sizerNumber = Number(id.replace(/\D/g, ''));
    const columnDetails = columnsDetails[sizerNumber];
    return {columnSizer: columnDetails.columnSizer, headerCell: columnDetails.elements[0], sizerNumber};
  }
}
