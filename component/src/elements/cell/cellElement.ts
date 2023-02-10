import {DateCellCalendarIconElement} from './cellsWithTextDiv/dateCell/dateCellCalendarIconElement';
import {ColumnSettingsBorderUtils} from '../../utils/columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from '../../utils/columnSettings/columnSettingsStyleUtils';
import {ColumnSettingsWidthUtils} from '../../utils/columnSettings/columnSettingsWidthUtils';
import {DateCellInputElement} from './cellsWithTextDiv/dateCell/dateCellInputElement';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {CellTextElement} from './cellsWithTextDiv/text/cellTextElement';
import {CheckboxCellElement} from './checkboxCell/checkboxCellElement';
import {CaretDisplayFix} from '../../utils/browser/caretDisplayFix';
import {_Widths} from '../../types/columnsSettingsInternal';
import {NoDimensionCSSStyle} from '../../types/cssStyle';
import {CellText} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';

export class CellElement {
  public static readonly CELL_CLASS = 'cell';
  private static readonly HEADER_CELL_CLASS = 'header-cell';
  public static readonly HEADER_TAG = 'TH';
  public static readonly DATA_TAG = 'TD';

  // prettier-ignore
  public static setDefaultCellStyle(cellElement: HTMLElement,
      cellStyle?: NoDimensionCSSStyle, customStyle?: NoDimensionCSSStyle) {
    Object.assign(cellElement.style, cellStyle, customStyle);
  }

  public static createBaseCell(isHeader: boolean): HTMLTableCellElement {
    const cellElement = document.createElement(isHeader ? CellElement.HEADER_TAG : CellElement.DATA_TAG);
    if (isHeader) cellElement.classList.add(CellElement.HEADER_CELL_CLASS);
    cellElement.classList.add(CellElement.CELL_CLASS);
    return cellElement as HTMLTableCellElement;
  }

  // prettier-ignore
  public static createContentCell(isHeader: boolean, cellStyle?: NoDimensionCSSStyle, customStyle?: NoDimensionCSSStyle,
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

  public static setCursor(textContainerElement: HTMLElement, isCellTextEditable: boolean) {
    textContainerElement.style.cursor = isCellTextEditable ? 'text' : 'default';
  }

  public static prepContentEditable(textContainerElement: HTMLElement, isEditable: boolean, isUsedAsAButton = false) {
    if (CaretDisplayFix.isIssueBrowser()) {
      if (isEditable) CaretDisplayFix.setTabIndex(textContainerElement);
      CaretDisplayFix.removeContentEditable(textContainerElement);
    } else {
      textContainerElement.contentEditable = String(isEditable); // REF-15
    }
    if (!isUsedAsAButton) CellElement.setCursor(textContainerElement, isEditable);
  }

  // prettier-ignore
  // this is used for cases where element could be the cell element or the text inside a select/label cell
  public static getCellElement(element: HTMLElement) {
    // if cselect/label cell text or date cell text/input container
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
    // if select/label cell or date cell
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
  public static setNewText(at: ActiveTable, textContainerElement: HTMLElement, text: CellText,
      isCellBeingBuilt: boolean, isUndo: boolean, setText = true) {
    if (setText) CellElement.setText(textContainerElement, text as string);
    // whilst it is primarily used for firefox - we use it consistently for all browsers
    if (isCellBeingBuilt) {
      // in a timeout as text elements may not be populated upfront (data)
      setTimeout(() => CaretDisplayFix.toggleCellTextBRPadding(at, textContainerElement, isUndo));
    } else {
      CaretDisplayFix.toggleCellTextBRPadding(at, textContainerElement, isUndo);
    }
  }

  // REF-36
  private static setColumnWidth(at: ActiveTable, cellElement: HTMLElement, customWidths?: _Widths, defWidths?: _Widths) {
    if (!at._tableElementRef) return;
    const widths = customWidths?.widths || defWidths?.widths;
    if (widths?.staticWidth) {
      ColumnSettingsWidthUtils.updateColumnWidth(at, cellElement, widths, true);
    } else if (widths?.initialWidth) {
      const result = ColumnSettingsWidthUtils.getSettingsWidthNumber(at._tableElementRef, widths, false);
      cellElement.style.width = `${result.number}px`;
    } else {
      cellElement.style.width = `${at._tableDimensions.newColumnWidth}px`;
    }
  }

  // prettier-ignore
  public static createCellElement(at: ActiveTable, text: CellText, colIndex: number, isHeader: boolean) {
    const {_defaultColumnsSettings: {cellStyle, headerStyles}, _columnsDetails} = at;
    const columnDetails = _columnsDetails[colIndex];
    const isOpenViaCellClick = at._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.cellClick;
    const cellElement = CellElement.createContentCell(isHeader, cellStyle,
      isHeader ? headerStyles?.default : {}, isOpenViaCellClick);
    const {settings} = columnDetails;
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, cellElement, isHeader);
    ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [cellElement]); // REF-23
    const isEditable = isHeader ? !isOpenViaCellClick && settings.isHeaderTextEditable : settings.isCellTextEditable;
    CellElement.prepContentEditable(cellElement, Boolean(isEditable), isOpenViaCellClick);
    // overwritten again if static table
    if (isHeader) CellElement.setColumnWidth(at, cellElement, settings, at._defaultColumnsSettings as _Widths);
    CellElement.setNewText(at, cellElement, text, true, false);
    return cellElement;
  }
}
