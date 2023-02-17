import {InsertNewRow} from '../../insertRemoveStructure/insert/insertNewRow';
import {RemoveRow} from '../../insertRemoveStructure/remove/removeRow';
import {OuterContainerElements} from '../outerContainerElements';
import {OuterContainers} from '../../../types/outerContainer';
import {ActiveTable} from '../../../activeTable';

export class CSV {
  public static export(at: ActiveTable, fileName?: string) {
    const csvContent = 'data:text/csv;charset=utf-8,' + at.content.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', encodedUri);
    linkElement.setAttribute('download', fileName || 'table_data.csv');
    document.body.appendChild(linkElement); // Required for FF
    linkElement.click();
  }

  private static processFile(at: ActiveTable, csvText: string) {
    const newContent = CSV.parseCSV(csvText);
    if (!newContent) return;
    for (let i = at.content.length - 1; i >= 0; i -= 1) {
      RemoveRow.remove(at, i);
    }
    // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
    setTimeout(() => {
      newContent.forEach((row, index) => InsertNewRow.insert(at, index, true, row));
    });
  }

  private static getPaddedArray(rowsOfData: string[][], largestRowLength: number) {
    return rowsOfData.map((row) => row.concat(Array(largestRowLength).fill('')).slice(0, largestRowLength));
  }

  private static parseDataFromRow(row: string, rowsOfData: string[][], largestRowLength: number) {
    const data = row.split(',').filter((cellValue) => cellValue.trim() !== '');
    if (data.length > 0) {
      rowsOfData.push(data);
      if (data.length > largestRowLength) largestRowLength = data.length;
    }
    return largestRowLength;
  }

  // TO-DO validation and error handling
  private static parseCSV(csvText: string) {
    try {
      const rows = csvText.split(/\r\n|\n/) as string[];
      const rowsOfData: string[][] = [];
      let largestRowLength = 0;
      rows.forEach((row) => {
        largestRowLength = CSV.parseDataFromRow(row, rowsOfData, largestRowLength);
      });
      return CSV.getPaddedArray(rowsOfData, largestRowLength);
    } catch (errorMessage) {
      console.error('Incorrect format');
      return null;
    }
  }

  private static upload(at: ActiveTable, event: Event) {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files?.[0] as Blob;
    reader.readAsText(file);
    reader.onload = (event) => CSV.processFile(at, event.target?.result as string);
  }

  private static clickInputElement(inputElement: HTMLInputElement) {
    inputElement.click();
  }

  private static createButtonElement(inputElement: HTMLInputElement) {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'Upload CSV';
    buttonElement.onclick = CSV.clickInputElement.bind(this, inputElement);
    return buttonElement;
  }

  private static createInputElement(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv';
    inputElement.hidden = true;
    inputElement.onchange = CSV.upload.bind(this, at);
    return inputElement;
  }

  private static createContainer() {
    const container = document.createElement('div') as HTMLElement;
    container.style.order = '0';
    return container;
  }

  public static createElementsAndEvents(at: ActiveTable, outerContainers: OuterContainers) {
    const buttonContainer = CSV.createContainer();
    const inputElement = CSV.createInputElement(at);
    const buttonElement = CSV.createButtonElement(inputElement);
    buttonContainer.appendChild(inputElement);
    buttonContainer.appendChild(buttonElement);
    OuterContainerElements.addToContainer('bottom-right', outerContainers, buttonContainer);
  }
}
