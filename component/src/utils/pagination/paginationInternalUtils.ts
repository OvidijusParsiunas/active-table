import {RowsPerPageDropdownItem} from '../../elements/pagination/rowsPerPageSelect/dropdown/rowsPerPageDropdownItem';
import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {StatefulCSSS} from '../../types/cssStyle';
import {ActiveTable} from '../../activeTable';
import {
  PaginationPositionSide,
  RowsPerPageSelect,
  PaginationPositions,
  PageButtonStyle,
  Pagination,
} from '../../types/pagination';

interface DefaultBackgroundColors {
  def: string;
  hover: string;
  click: string;
}

type StatefulStyle = {[key: string]: StatefulCSSS};

export class PaginationInternalUtils {
  private static readonly DEFAULT_SIDE = 'bottom-right';
  // prettier-ignore
  private static readonly SIDES: Set<PaginationPositionSide> = new Set([
    'top-left', 'top-middle', 'top-right', 'bottom-left', 'bottom-middle', PaginationInternalUtils.DEFAULT_SIDE,
  ]);

  private static insertNewRowsPerPageOption(newRowsPerPageNumber: number, rowsPerPageOptionsItemText: string[]) {
    let insertionIndex = rowsPerPageOptionsItemText.findIndex((option) => {
      const optionNumber = Number.parseInt(option);
      return isNaN(optionNumber) || newRowsPerPageNumber < optionNumber;
    });
    if (insertionIndex === -1) insertionIndex = 0;
    rowsPerPageOptionsItemText.splice(insertionIndex, 0, String(newRowsPerPageNumber));
  }

  private static setFirstOptionAsRowsPerPage(at: ActiveTable) {
    const {paginationInternal, content, dataStartsAtHeader} = at;
    const firstItemText = paginationInternal.rowsPerPageOptionsItemText[0];
    if (firstItemText.toLocaleLowerCase() === RowsPerPageDropdownItem.ALL_ITEM_TEXT) {
      paginationInternal.isAllRowsOptionSelected = true;
      paginationInternal.rowsPerPage = dataStartsAtHeader ? content.length : content.length - 1;
    } else {
      paginationInternal.rowsPerPage = Number(firstItemText);
    }
  }

  private static processRowsPerPage(at: ActiveTable, pagination: Pagination) {
    const {rowsPerPageSelect} = pagination;
    // the user might set rowsPerPage as string (even if we need type) so this makes sure its a string
    at.paginationInternal.rowsPerPage = Number.parseInt(String(at.paginationInternal.rowsPerPage));
    if (rowsPerPageSelect || rowsPerPageSelect === undefined) {
      const {rowsPerPageOptionsItemText, rowsPerPage} = at.paginationInternal;
      if (!rowsPerPageOptionsItemText.find((value) => value === String(rowsPerPage))) {
        const rowsPerPageNumber = Number.parseInt(String(rowsPerPage));
        if (isNaN(rowsPerPageNumber)) {
          PaginationInternalUtils.setFirstOptionAsRowsPerPage(at);
        } else {
          PaginationInternalUtils.insertNewRowsPerPageOption(rowsPerPageNumber, rowsPerPageOptionsItemText);
        }
      }
    }
  }

  private static processOptionsItemText(userNumber: number | string) {
    const number = Number(userNumber);
    if (!isNaN(number) && number < 1) return '2';
    return String(userNumber);
  }

  // REF-32
  private static changeOptionNumberToEven(options: (number | string)[]) {
    return options.map((option) => {
      const number = Number(option);
      if (Number.isNaN(number)) return option;
      return number % 2 === 1 ? number + 1 : number;
    });
  }

  // prettier-ignore
  private static setRowsPerPageOptionsText(at: ActiveTable) {
    const pagination = at.pagination as Pagination;
    const {rowsPerPageSelect} = pagination;
    if (rowsPerPageSelect || rowsPerPageSelect === undefined) {
      const defaultOptions = (at.paginationInternal.rowsPerPageSelect as RowsPerPageSelect).options;
      let options = (rowsPerPageSelect === undefined || rowsPerPageSelect === true
        || !rowsPerPageSelect.options || rowsPerPageSelect.options.length === 0
          ? defaultOptions : rowsPerPageSelect.options) as (number|string)[];
      if (at.stripedRows) options = PaginationInternalUtils.changeOptionNumberToEven(options);
      at.paginationInternal.rowsPerPageOptionsItemText = options
        .map((option) => PaginationInternalUtils.processOptionsItemText(option));
    }
  }

  private static processRowsPerPageOptions(at: ActiveTable) {
    const pagination = at.pagination as Pagination;
    const {rowsPerPageSelect} = pagination;
    if (rowsPerPageSelect !== undefined && typeof rowsPerPageSelect !== 'boolean' && rowsPerPageSelect.prefixText) {
      (at.paginationInternal.rowsPerPageSelect as RowsPerPageSelect).prefixText = rowsPerPageSelect.prefixText;
    }
    PaginationInternalUtils.setRowsPerPageOptionsText(at);
    delete pagination.rowsPerPageSelect;
  }

  private static setRowsPerPageOptionsStyle(style: IPaginationStyle) {
    // only adding stateful style for button as it is the only one that has default stategful css
    const defButtonsBackgroundColors = {def: '', hover: '#f5f5f5', click: '#f5f5f5'};
    const statefulStyle = style.rowsPerPageSelect as StatefulStyle;
    PaginationInternalUtils.setStatefulCSS(statefulStyle, defButtonsBackgroundColors, 'button');
  }

  // prettier-ignore
  private static setStatefulCSS<T extends StatefulStyle>(style: T, defaultBackgrounds: DefaultBackgroundColors,
      elementType: keyof T) {
    (style[elementType] as unknown as StatefulStyle) ??= {};
    const {def, hover, click} = defaultBackgrounds;
    style[elementType].click ??= style[elementType].hover || style[elementType].default || {backgroundColor: click};
    style[elementType].hover ??= style[elementType].default || {backgroundColor: hover};
    style[elementType].default ??= {backgroundColor: def};
  }

  // actionButtons reuse buttons style
  private static mergeActionButtonsStyleWithNewButtons(pageButtonsStyle: PageButtonStyle) {
    (pageButtonsStyle as unknown as StatefulStyle).actionButtons ??= {};
    const {buttons, actionButtons} = pageButtonsStyle as Required<PageButtonStyle<Required<StatefulCSSS>>>;
    // structuredClone does not seem to work properly
    const buttonsClone = JSON.parse(JSON.stringify(buttons)) as typeof actionButtons;
    Object.assign(buttonsClone.default, actionButtons.default);
    Object.assign(buttonsClone.hover, actionButtons.hover);
    Object.assign(buttonsClone.click, actionButtons.click);
    buttonsClone.previousText = actionButtons.previousText || '&#60';
    buttonsClone.nextText = actionButtons.nextText || '&#62';
    buttonsClone.firstText = actionButtons.firstText || '&#8810';
    buttonsClone.lastText = actionButtons.lastText || '&#8811';
    return buttonsClone;
  }

  private static processPageButtonStyle(paginationInternal: PaginationInternal) {
    (paginationInternal.style.pageButtons as unknown as StatefulStyle) ??= {};
    const statefulStyle = paginationInternal.style.pageButtons as StatefulStyle;
    // buttons
    const defButtonsBackgroundColors = {def: 'yellow', hover: 'orange', click: 'red'};
    PaginationInternalUtils.setStatefulCSS(statefulStyle, defButtonsBackgroundColors, 'buttons');
    // actionButtons
    const newActionButtons = PaginationInternalUtils.mergeActionButtonsStyleWithNewButtons(statefulStyle);
    paginationInternal.style.pageButtons.actionButtons = newActionButtons;
    const defActionBackgroundColors = {def: 'green', hover: 'blue', click: 'deepskyblue'};
    PaginationInternalUtils.setStatefulCSS(statefulStyle, defActionBackgroundColors, 'actionButtons');
    // activeButton
    const defBackgroundColors = {def: 'brown', hover: 'violet', click: 'purple'};
    PaginationInternalUtils.setStatefulCSS(statefulStyle, defBackgroundColors, 'activeButton');
    // disabledButtons
    paginationInternal.style.pageButtons.disabledButtons ??= {backgroundColor: 'grey'};
  }

  private static processStyle(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.style) Object.assign(paginationInternal.style, pagination.style);
    PaginationInternalUtils.processPageButtonStyle(paginationInternal);
    if (pagination.rowsPerPageSelect !== false) {
      paginationInternal.style.rowsPerPageSelect ??= {};
      PaginationInternalUtils.setRowsPerPageOptionsStyle(paginationInternal.style);
    }
    paginationInternal.style.numberOfVisibleRows ??= {};
    delete pagination.style; // deleted so that Object.assign wouldn't apply it
  }

  private static processSides(positions: Required<PaginationPositions>) {
    Object.keys(positions).forEach((componentName) => {
      const component = positions[componentName as keyof PaginationPositions];
      if (!PaginationInternalUtils.SIDES.has(component.side)) component.side = PaginationInternalUtils.DEFAULT_SIDE;
    });
  }

  private static processPosition(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.positions) Object.assign(paginationInternal.positions, pagination.positions);
    PaginationInternalUtils.processSides(paginationInternal.positions);
    delete pagination.positions; // deleted so that Object.assign wouldn't apply it
  }

  public static process(at: ActiveTable) {
    const {pagination, paginationInternal} = at;
    if (!pagination) return;
    if (pagination.maxNumberOfVisiblePageButtons !== undefined && pagination.maxNumberOfVisiblePageButtons < 1) {
      pagination.maxNumberOfVisiblePageButtons = 1;
    }
    PaginationInternalUtils.processPosition(pagination, paginationInternal);
    PaginationInternalUtils.processStyle(pagination, paginationInternal);
    if (pagination.rowsPerPageSelect !== false) PaginationInternalUtils.processRowsPerPageOptions(at);
    Object.assign(paginationInternal, pagination);
    if (pagination.displayNumberOfVisibleRows !== false) PaginationInternalUtils.processRowsPerPage(at, pagination);
  }

  public static getDefault(): PaginationInternal {
    return {
      rowsPerPage: 10,
      rowsPerPageSelect: {
        options: [10, 25, 50, 'All'],
        prefixText: 'Rows per page:',
      },
      maxNumberOfVisiblePageButtons: 8,
      displayPrevNext: true,
      displayFirstLast: true,
      displayNumberOfVisibleRows: true,
      style: {}, // this is going to be populated during the call of processInternal method
      positions: {
        pageButtons: {
          side: PaginationInternalUtils.DEFAULT_SIDE,
          order: 3,
        },
        numberOfVisibleRows: {
          side: PaginationInternalUtils.DEFAULT_SIDE,
          order: 2,
        },
        rowsPerPageSelect: {
          side: PaginationInternalUtils.DEFAULT_SIDE,
          order: 1,
        },
      },
      visibleRows: [],
      activePageNumber: 1,
      isAllRowsOptionSelected: false,
    } as unknown as PaginationInternal;
  }
}
