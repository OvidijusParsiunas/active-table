import {DateCellInputElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';

export class Browser {
  public static readonly IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  // this has not been tested on non supported browsers and element may need to be added to the dom before the check
  // can be made to determine if input is supported
  public static readonly IS_INPUT_DATE_SUPPORTED =
    DateCellInputElement.creteInputElement().type === DateCellInputElement.ELEMENT_TYPE;
}
