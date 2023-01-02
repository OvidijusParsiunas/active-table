import {ColumnDropdownCellOverlayEvents} from '../dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlayEvents';
import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {DateCellCalendarIconElement} from './cellsWithTextDiv/dateCell/dateCellCalendarIconElement';
import {ColumnSettingsBorderUtils} from '../../utils/columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from '../../utils/columnSettings/columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from '../../utils/columnSettings/columnSettingsWidthUtils';
import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {EditableHeaderCellEvents} from './headerCell/editable/editableHeaderCellEvents';
import {DateCellInputElement} from './cellsWithTextDiv/dateCell/dateCellInputElement';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {CellTextElement} from './cellsWithTextDiv/text/cellTextElement';
import {CheckboxCellElement} from './checkboxCell/checkboxCellElement';
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
  public static readonly HEADER_TAG = 'TH';
  public static readonly DATA_TAG = 'TD';

  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      if (etc.columnDropdownDisplaySettings.openMethod?.cellClick) {
        HeaderCellEvents.setEvents(etc, cellElement, columnIndex)
      } else {
        DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
        EditableHeaderCellEvents.setEvents(etc, cellElement, 0, columnIndex);
        ColumnDropdownCellOverlayEvents.setEvents(etc, columnIndex);
      }
    } else if (etc.columnsDetails[columnIndex].settings.isCellTextEditable) {
      DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    }
    if (!etc.auxiliaryTableContentInternal.displayIndexColumn && columnIndex === 0) {
      RowDropdownCellOverlayEvents.addCellEvents(etc, rowIndex, cellElement);
    }
  }

  public static setDefaultCellStyle(cellElement: HTMLElement, cellStyle?: CellCSSStyle, customStyle?: CellCSSStyle) {
    Object.assign(cellElement.style, cellStyle, customStyle);
  }

  public static createBaseCell(isHeader: boolean): HTMLTableCellElement {
    const cellElement = document.createElement(isHeader ? CellElement.HEADER_TAG : CellElement.DATA_TAG);
    if (isHeader) cellElement.classList.add(CellElement.HEADER_CELL_CLASS);
    cellElement.classList.add(CellElement.CELL_CLASS);
    return cellElement as HTMLTableCellElement;
  }

  // prettier-ignore
  public static createContentCell(isHeader: boolean, cellStyle?: CellCSSStyle, customStyle?: CellCSSStyle,
      isUsedAsAButton?: boolean) {
    const cellElement = CellElement.createBaseCell(isHeader);
    if (isHeader && isUsedAsAButton) cellElement.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
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

  public static prepContentEditable(cellElement: HTMLElement, isEditable: boolean, isUsedAsAButton = false) {
    if (Browser.IS_FIREFOX) {
      if (isEditable) FirefoxCaretDisplayFix.setTabIndex(cellElement);
      FirefoxCaretDisplayFix.removeContentEditable(cellElement);
    } else {
      // the reason why this is in a timeout is because when contentEditable is changed it fires blur on a text element
      // which is problematic when column settings are changed after header text is changed during multi row data paste
      setTimeout(() => (cellElement.contentEditable = String(isEditable)));
    }
    if (!isUsedAsAButton) CellElement.setCursor(cellElement, isEditable);
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
      // if checkbox cell
    } else if (CheckboxCellElement.isCheckboxCell(element)) {
      return element.children[0] as HTMLElement;
    }
    return element;
  }

  // The reason why .trim() is used is because innerText/textContent property does not just return the cell text, but
  // additionally the new line characters (\n) which represent <br> elements within the cell that make it difficult
  // to compare cell text to other strings or use them for other programmatic purposes.
  // CAUTION-1 - The returned string should not be used to set text on other cells as .trim() removes \n chars for
  // <br> tags which are used to set the pointer position.
  public static getText(element: HTMLElement) {
    const checkboxValue = CheckboxCellElement.getValue(element);
    if (checkboxValue !== undefined) return checkboxValue;
    return element.innerText.trim();
  }

  // this is used for case where element could be cell element that contains a text div element,
  // hence we need to set the text into the correct container
  // CAUTION-1 - be careful that the text does not come from above method
  private static setText(element: HTMLElement, text: CellText) {
    if (!CheckboxCellElement.setValue(element, text)) {
      const textElement = CellElement.getTextElement(element);
      textElement.innerText = text as string;
    }
  }

  // set text is optional as some elements may only need to toggle the BR padding
  // prettier-ignore
  public static setNewText(etc: EditableTableComponent, textContainerElement: HTMLElement, text: CellText,
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
  public static createCellElement(etc: EditableTableComponent, text: CellText, colIndex: number, isHeader: boolean) {
    const {defaultColumnsSettings: {cellStyle, headerStyleProps}, columnsDetails, tableElementRef} = etc;
    const columnDetails = columnsDetails[colIndex];
    const isOpenViaCellClick = etc.columnDropdownDisplaySettings.openMethod?.cellClick;
    const cellElement = CellElement.createContentCell(isHeader, cellStyle,
      isHeader ? headerStyleProps?.default : {}, isOpenViaCellClick);
    const {settings} = columnDetails;
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, cellElement, isHeader);
    ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [cellElement]); // REF-23
    const isEditable = isHeader ? !isOpenViaCellClick && settings.isHeaderTextEditable : settings.isCellTextEditable;
    CellElement.prepContentEditable(cellElement, Boolean(isEditable), isOpenViaCellClick);
    // overwritten again if static table
    if (isHeader) CellElement.setColumnWidth(tableElementRef as HTMLElement, cellElement, settings);
    CellElement.setNewText(etc, cellElement, text, true, false);
    return cellElement;
  }
}
