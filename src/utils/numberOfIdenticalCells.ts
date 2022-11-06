import {ColumnsDetailsT} from '../types/columnDetails';
import {TableCellText} from '../types/tableContents';

export class NumberOfIdenticalCells {
  // columnsDetails instead of row from contents because during startup - contents is already be populated and
  // not yet added to the table, hence we are automatically marking headers as duplicate and setting them
  // to default, however the end headers that are not duplicate may not be displayed due to max columns,
  // hence using columnsDetails to mark duplicates as headers are added instead
  // prettier-ignore
  public static get(targetText: string, columnsDetails: ColumnsDetailsT) {
    return columnsDetails.map((columnDetails) => {
      return columnDetails.elements[0].textContent as TableCellText;
    }).filter((cellText: TableCellText) => cellText === targetText).length;
  }
}
