import {ActiveTable} from '../../../../activeTable';

export class CSVExport {
  public static export(at: ActiveTable, fileName?: string) {
    const csvData = 'data:text/csv;charset=utf-8,' + at.data.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvData);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', encodedUri);
    linkElement.setAttribute('download', fileName || 'table_data.csv');
    document.body.appendChild(linkElement); // Required for FF
    linkElement.click();
  }
}
