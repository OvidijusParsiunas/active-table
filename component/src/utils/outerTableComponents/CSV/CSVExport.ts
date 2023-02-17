import {ActiveTable} from '../../../activeTable';

export class CSVExport {
  public static export(at: ActiveTable, fileName?: string) {
    const csvContent = 'data:text/csv;charset=utf-8,' + at.content.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', encodedUri);
    linkElement.setAttribute('download', fileName || 'table_data.csv');
    document.body.appendChild(linkElement); // Required for FF
    linkElement.click();
  }
}
