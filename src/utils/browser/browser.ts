import {DateCellInputElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';

export class Browser {
  public static readonly IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  public static readonly IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  public static readonly IS_INPUT_DATE_SUPPORTED =
    DateCellInputElement.createInputElement().type === DateCellInputElement.ELEMENT_TYPE &&
    'showPicker' in HTMLInputElement.prototype;
}
