import {DateCellCalendarIconElement} from './cellsWithTextDiv/dateCell/dateCellCalendarIconElement';
import {ColumnSettingsBorderUtils} from '../../utils/columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from '../../utils/columnSettings/columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from '../../utils/columnSettings/columnSettingsWidthUtils';
import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {DateCellInputElement} from './cellsWithTextDiv/dateCell/dateCellInputElement';
import {CellTextElement} from './cellsWithTextDiv/text/cellTextElement';
import {ColumnDetails} from '../../utils/columnDetails/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {HeaderCellEvents} from './headerCell/headerCellEvents';
import {DataCellEvents} from './dataCell/dataCellEvents';
import {Browser} from '../../utils/browser/browser';
import {CellText} from '../../types/tableContents';
import {CellCSSStyle} from '../../types/cssStyle';

export class CellElement {
  public static readonly CELL_CLASS = 'cell';
  private static readonly HEADER_CELL_CLASS = 'header-cell';
  public static readonly NOT_SELECTABLE_CLASS = 'not-selectable';

  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0 && etc.isColumnDropdownDisplayed) {
      HeaderCellEvents.setEvents(etc, cellElement, columnIndex);
    } else {
      DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    }
  }

  public static setDefaultCellStyle(cellElement: HTMLElement, cellStyle?: CellCSSStyle, customStyle?: CellCSSStyle) {
    Object.assign(cellElement.style, cellStyle, customStyle);
  }

  public static createBaseCell(isHeader: boolean) {
    const cellElement = document.createElement(isHeader ? 'th' : 'td');
    if (isHeader) cellElement.classList.add(CellElement.HEADER_CELL_CLASS);
    cellElement.classList.add(CellElement.CELL_CLASS);
    return cellElement;
  }

  // prettier-ignore
  public static createContentCell(isHeader: boolean, cellStyle?: CellCSSStyle, customStyle?: CellCSSStyle,
      isColumnDropdownDisplayed?: boolean) {
    const cellElement = CellElement.createBaseCell(isHeader);
    if (isHeader && isColumnDropdownDisplayed) cellElement.classList.add(CellElement.NOT_SELECTABLE_CLASS);
    // role for assistive technologies
    cellElement.setAttribute('role', 'textbox');
    // should probably remove border width from headerStyle if cellStyle contains it as it will affect the sizer position
    // but the table looks off when the header and data cells have different border styles so it is not expected that
    // users will desire headerstyle it, hence not implementending headerStyle preprocessing functionality
    CellElement.setDefaultCellStyle(cellElement, cellStyle, customStyle);
    return cellElement;
  }

  public static setCursor(cellElement: HTMLElement, isCellTextEditable: boolean) {
    cellElement.style.cursor = isCellTextEditable ? 'text' : 'default';
  }

  // many methods that call this pass down isColumnDropdownDisplayed as false because they only work with data cells
  // prettier-ignore
  public static prepContentEditable(cellElement: HTMLElement, isHeader: boolean, isCellTextEditable: boolean,
      isColumnDropdownDisplayed: boolean) {
    const isEditable = !isHeader || !isColumnDropdownDisplayed;
    if (Browser.IS_FIREFOX) {
      if (isCellTextEditable && isEditable) FirefoxCaretDisplayFix.setTabIndex(cellElement);
      FirefoxCaretDisplayFix.removeContentEditable(cellElement);
    } else {
      cellElement.contentEditable = !isEditable ? 'false' : String(isCellTextEditable);
    }
    if (isEditable) CellElement.setCursor(cellElement, isCellTextEditable);
  }

  // prettier-ignore
  // this is used for cases where element could be the cell element or the text inside a category cell
  public static getCellElement(element: HTMLElement) {
    // if category cell text or date cell text/input container
    if (element.classList.contains(CellTextElement.CELL_TEXT_DIV_CLASS) ||
        element.classList.contains(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS)) {
      return element.parentElement as HTMLElement;
      // if date cell input
    } else if (element.classList.contains(DateCellInputElement.DATE_INPUT_CLASS) ||
        element.classList.contains(DateCellCalendarIconElement.CALENDAR_ICON_CONTAINER_CLASS)) {
      return (element.parentElement as HTMLElement).parentElement as HTMLElement;
    }
    // if cell
    return element;
  }

  public static getTextElement(element: HTMLElement): HTMLElement {
    // if category or date cell
    if (element.children[0]?.classList.contains(CellTextElement.CELL_TEXT_DIV_CLASS)) {
      return element.children[0] as HTMLElement;
      // if header with icon
    } else if (element.children[1]?.classList.contains(CellTextElement.CELL_TEXT_DIV_CLASS)) {
      return element.children[1] as HTMLElement;
    }
    return element;
  }

  // The reason why .trim() is used is because innerText/textContent property does not just return the cell text, but
  // additionally the new line characters (\n) which represent <br> elements within the cell that make it difficult
  // to compare cell text to other strings or use them for other programmatic purposes.
  // CAUTION-1 - The returned string should not be used to set text on other cells as .trim() removes \n chars for
  // <br> tags which are used to set the pointer position.
  public static getText(element: HTMLElement) {
    return element.innerText.trim();
  }

  // this is used for case where element could be cell element that contains a text div element,
  // hence we need to set the text into the correct container
  // CAUTION-1 - be careful that the text does not come from above method
  private static setText(element: HTMLElement, text: CellText) {
    const textElement = CellElement.getTextElement(element);
    textElement.innerText = text as string;
  }

  // set text is optional as some elements may only need to toggle the BR padding
  // prettier-ignore
  public static processCellWithNewText(etc: EditableTableComponent, textContainerElement: HTMLElement, text: CellText,
      isCellBeingBuilt: boolean, isUndo: boolean, setText = true) {
    if (setText) CellElement.setText(textContainerElement, text as string);
    // whilst it is primarily used for firefox - we use it consistently for all browsers
    if (isCellBeingBuilt) {
      // in a timeout as text elements may not be populated upfront (data or category)
      setTimeout(() => FirefoxCaretDisplayFix.toggleCellTextBRPadding(etc, textContainerElement, isUndo));
    } else {
      FirefoxCaretDisplayFix.toggleCellTextBRPadding(etc, textContainerElement, isUndo);
    }
  }

  private static setColumnWidth(tableElement: HTMLElement, cellElement: HTMLElement, settings?: ColumnSettingsInternal) {
    if (settings && ColumnSettingsWidthUtils.isWidthDefined(settings)) {
      ColumnSettingsWidthUtils.updateColumnWidth(tableElement, cellElement, settings, true);
    } else {
      cellElement.style.width = `${ColumnDetails.NEW_COLUMN_WIDTH}px`;
    }
  }

  // prettier-ignore
  private static createCellDOMElement(etc: EditableTableComponent, text: CellText, colIndex: number, isHeader: boolean) {
    const {defaultColumnsSettings: {cellStyle, headerStyleProps}, columnsDetails, tableElementRef} = etc;
    const columnDetails = columnsDetails[colIndex];
    const cellElement = CellElement.createContentCell(isHeader, cellStyle,
      isHeader ? headerStyleProps?.default : {}, etc.isColumnDropdownDisplayed);
    const {settings} = columnDetails;
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, cellElement, isHeader);
    ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [cellElement]); // REF-23
    CellElement.prepContentEditable(cellElement, isHeader, settings.isCellTextEditable, etc.isColumnDropdownDisplayed);
    // overwritten again if static table
    if (isHeader) CellElement.setColumnWidth(tableElementRef as HTMLElement, cellElement, settings);
    CellElement.processCellWithNewText(etc, cellElement, text, true, false);
    return cellElement;
  }

  public static createCellElement(etc: EditableTableComponent, cellText: CellText, rowIndex: number, columnIndex: number) {
    const cellElement = CellElement.createCellDOMElement(etc, cellText, columnIndex, rowIndex === 0);
    CellElement.setCellEvents(etc, cellElement, rowIndex, columnIndex);
    return cellElement;
  }
}
