import {CellElement} from '../elements/cell/cellElement';
import {ColumnsDetailsT} from '../types/columnDetails';
import {CellText} from '../types/tableContents';

export class NumberOfIdenticalCells {
  // columnsDetails instead of row from contents because during startup - contents is already be populated and
  // not yet added to the table, hence we are automatically marking headers as duplicate and setting them
  // to default, however the end headers that are not duplicate may not be displayed due to max columns,
  // hence using columnsDetails to mark duplicates as headers are added instead
  // prettier-ignore
  public static get(targetText: CellText, columnsDetails: ColumnsDetailsT) {
    return columnsDetails.map((columnDetails) => {
      return columnDetails.elements.length > 0 ? CellElement.getText(columnDetails.elements[0]) : '';
    }).filter((cellText: CellText) => cellText === targetText).length;
  }
}
