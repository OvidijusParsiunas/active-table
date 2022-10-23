import {DateCellElement} from './dateCellElement';

export class DateCellInputElement {
  public static readonly DATE_INPUT_CLASS = 'date-input';
  public static readonly DATE_INPUT_CONTAINER_CLASS = 'date-input-container';

  // TO-DO will need a way for user to define where is DD/MM etc when they define their custom cell type
  // try to use cell type title to create date - so if the user has / separator, use -
  public static convertToInput(chosenDate: string, defaultCellValue: string, dateType: string) {
    const integers = chosenDate?.match(/\d+/g) as RegExpMatchArray;
    if (integers?.length === 3) {
      const properties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const date = [
        integers[properties.structureIndexes.year],
        integers[properties.structureIndexes.month].padStart(2, '0'),
        integers[properties.structureIndexes.day].padStart(2, '0'),
      ];
      return date.join('-');
    }
    return defaultCellValue;
  }

  // WORK - need calendar icon
  // prettier-ignore
  public static addDateInputElement(cellElement: HTMLElement, textElement: HTMLElement, defaultCellValue: string,
      dateType: string) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS);
    const inputElement = document.createElement('input');
    inputElement.type = 'date';
    inputElement.value = DateCellInputElement.convertToInput(
      textElement.textContent as string, defaultCellValue, dateType);
    inputElement.classList.add(DateCellInputElement.DATE_INPUT_CLASS);
    inputContainer.style.display = 'none';
    inputContainer.appendChild(inputElement);
    cellElement.appendChild(inputContainer);
  }
}
