import {RowsPerPageDropdownItem} from '../../../elements/pagination/rowsPerPageSelect/dropdown/rowsPerPageDropdownItem';
import {RowsPerPageSelect, PaginationPositions, PageButtonStyles, Pagination} from '../../../types/pagination';
import {PageButtonElement} from '../../../elements/pagination/pageButtons/pageButtonElement';
import {IPaginationStyles, PaginationInternal} from '../../../types/paginationInternal';
import {FilterInternalUtils} from '../filter/rows/filterInternalUtils';
import {OuterContentPosition} from '../../../types/outerContainer';
import {StatefulCSS} from '../../../types/cssStyle';
import {ActiveTable} from '../../../activeTable';

interface DefaultBackgroundColors {
  def: string;
  hover: string;
  click: string;
}

type StatefulStyle = {[key: string]: StatefulCSS};

export class PaginationInternalUtils {
  private static readonly DEFAULT_POSITION = 'bottom-right';
  // prettier-ignore
  private static readonly POSITIONS: Set<OuterContentPosition> = new Set([
    'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', PaginationInternalUtils.DEFAULT_POSITION,
  ]);

  public static getTotalNumberOfRows(at: ActiveTable) {
    const {content, _visiblityInternal, _tableBodyElementRef} = at;
    return _visiblityInternal?.rows
      ? FilterInternalUtils.extractUnfilteredRows(_tableBodyElementRef as HTMLElement, content.length).length
      : content.length;
  }

  private static insertNewRowsPerPageOption(newRowsPerPageNumber: number, rowsPerPageOptionsItemText: string[]) {
    let insertionIndex = rowsPerPageOptionsItemText.findIndex((option) => {
      const optionNumber = Number.parseInt(option);
      return isNaN(optionNumber) || newRowsPerPageNumber < optionNumber;
    });
    if (insertionIndex === -1) insertionIndex = 0;
    rowsPerPageOptionsItemText.splice(insertionIndex, 0, String(newRowsPerPageNumber));
  }

  private static setFirstOptionAsRowsPerPage(at: ActiveTable) {
    const {_pagination, dataStartsAtHeader} = at;
    const firstItemText = _pagination.rowsPerPageOptionsItemText[0];
    if (firstItemText.toLocaleLowerCase() === RowsPerPageDropdownItem.ALL_ITEM_TEXT) {
      _pagination.isAllRowsOptionSelected = true;
      const totalNumberOfRows = PaginationInternalUtils.getTotalNumberOfRows(at);
      _pagination.rowsPerPage = dataStartsAtHeader ? totalNumberOfRows : totalNumberOfRows - 1;
    } else {
      _pagination.rowsPerPage = Number(firstItemText);
    }
  }

  private static processRowsPerPage(at: ActiveTable, pagination: Pagination) {
    const {rowsPerPageSelect} = pagination;
    // the user might set rowsPerPage as string (even if we need type) so this makes sure its a string
    at._pagination.rowsPerPage = Number.parseInt(String(at._pagination.rowsPerPage));
    if (rowsPerPageSelect || rowsPerPageSelect === undefined) {
      const {rowsPerPageOptionsItemText, rowsPerPage} = at._pagination;
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
      const defaultOptions = (at._pagination.rowsPerPageSelect as RowsPerPageSelect).options;
      let options = (rowsPerPageSelect === undefined || rowsPerPageSelect === true
        || !rowsPerPageSelect.options || rowsPerPageSelect.options.length === 0
          ? defaultOptions : rowsPerPageSelect.options) as (number|string)[];
      if (at.stripedRows) options = PaginationInternalUtils.changeOptionNumberToEven(options);
      at._pagination.rowsPerPageOptionsItemText = options
        .map((option) => PaginationInternalUtils.processOptionsItemText(option));
    }
  }

  private static processRowsPerPageOptions(at: ActiveTable) {
    const pagination = at.pagination as Pagination;
    const {rowsPerPageSelect} = pagination;
    if (rowsPerPageSelect !== undefined && typeof rowsPerPageSelect !== 'boolean' && rowsPerPageSelect.prefixText) {
      (at._pagination.rowsPerPageSelect as RowsPerPageSelect).prefixText = rowsPerPageSelect.prefixText;
    }
    PaginationInternalUtils.setRowsPerPageOptionsText(at);
    delete pagination.rowsPerPageSelect;
  }

  private static setDefaultBackgroundColors(style: Required<StatefulCSS>, defaultBackgrounds: DefaultBackgroundColors) {
    // if default backgroundColor is set, then setStatefulCSS has used it for all already
    const {def, hover, click} = defaultBackgrounds;
    style.click.backgroundColor ??= style.hover.backgroundColor || style.default.backgroundColor || click;
    style.hover.backgroundColor ??= style.default.backgroundColor || hover;
    style.default.backgroundColor ??= def;
    (['click', 'hover', 'default'] as (keyof StatefulCSS)[]).forEach((key) => {
      style[key].backgroundColor === undefined ? delete style[key].backgroundColor : {};
    });
  }

  private static setStatefulCSS<T extends StatefulStyle>(style: T, elementType: keyof T) {
    (style[elementType] as unknown as StatefulStyle) ??= {};
    // deep copy to allow setDefaultBackgroundColor to overwrite objects
    style[elementType].click ??= JSON.parse(JSON.stringify(style[elementType].hover || style[elementType].default || {}));
    style[elementType].hover ??= JSON.parse(JSON.stringify(style[elementType].default || {}));
    style[elementType].default ??= {};
  }

  // prettier-ignore
  private static setRowsPerPageOptionsStyle(style: IPaginationStyles) {
    PaginationInternalUtils.setStatefulCSS(style.rowsPerPageSelect as StatefulStyle, 'button');
    const defButtonsBackgroundColors = {def: '', hover: '#f5f5f5', click: '#f5f5f5'};
    PaginationInternalUtils.setDefaultBackgroundColors(style.rowsPerPageSelect?.button as Required<StatefulCSS>,
      defButtonsBackgroundColors);
  }

  // activeButtons reuse buttons style
  private static mergeButtonsStyleWithActiveStyle(statefulStyle: PageButtonStyles) {
    const {buttons, actionButtons, activeButton} = statefulStyle as Required<PageButtonStyles<Required<StatefulCSS>>>;
    const buttonsClone = JSON.parse(JSON.stringify(buttons)) as typeof actionButtons;
    buttonsClone.default.backgroundColor = '#e8e8e8';
    buttonsClone.hover.backgroundColor = '#d6d6d6';
    buttonsClone.click.backgroundColor = '#c8c8c8';
    if (activeButton) {
      Object.assign(buttonsClone.default, activeButton.default);
      buttonsClone.hover = activeButton.hover;
      buttonsClone.click = activeButton.click;
    }
    return buttonsClone;
  }

  // actionButtons reuse buttons style
  private static mergeButtonsStylesWithActionStyles(pageButtonsStyles: PageButtonStyles) {
    (pageButtonsStyles as unknown as StatefulStyle).actionButtons ??= {};
    const {buttons, actionButtons} = pageButtonsStyles as Required<PageButtonStyles<Required<StatefulCSS>>>;
    // structuredClone does not seem to work properly
    const buttonsClone = JSON.parse(JSON.stringify(buttons)) as typeof actionButtons;
    Object.assign(buttonsClone.default, actionButtons.default);
    Object.assign(buttonsClone.hover, actionButtons.hover);
    Object.assign(buttonsClone.click, actionButtons.click);
    buttonsClone.previousText = actionButtons.previousText;
    buttonsClone.nextText = actionButtons.nextText;
    buttonsClone.firstText = actionButtons.firstText;
    buttonsClone.lastText = actionButtons.lastText;
    return buttonsClone;
  }

  // prettier-ignore
  private static processPageButtonStyles(pagination: PaginationInternal) {
    (pagination.styles.pageButtons as unknown as StatefulStyle) ??= {};
    const statefulStyle = pagination.styles.pageButtons as unknown as StatefulStyle;
    // buttons
    const defButtonsBackgroundColors = {def: 'white', hover: '#f5f5f5', click: '#c8c8c8'};
    PaginationInternalUtils.setStatefulCSS(statefulStyle, 'buttons');
    PaginationInternalUtils.setDefaultBackgroundColors(pagination.styles.pageButtons.buttons, defButtonsBackgroundColors);
    // actionButtons
    PaginationInternalUtils.setStatefulCSS(statefulStyle, 'actionButtons');
    PaginationInternalUtils.setDefaultBackgroundColors(pagination.styles.pageButtons.actionButtons,
      {} as DefaultBackgroundColors);
    const newActionButtons = PaginationInternalUtils.mergeButtonsStylesWithActionStyles(statefulStyle);
    pagination.styles.pageButtons.actionButtons = newActionButtons;
    // activeButton
    const newActiveButtons = PaginationInternalUtils.mergeButtonsStyleWithActiveStyle(statefulStyle);
    pagination.styles.pageButtons.activeButton = newActiveButtons;
    // disabledButtons - this inherits the 'buttons' style when using the PageButtonStyle.setDisabled method
    pagination.styles.pageButtons.disabledButtons ??= {backgroundColor: '#f9f9f9', color: '#9d9d9d', stroke: '#9d9d9d'};
    // first overrides
    const defFirstVisibleOverride = {
      borderLeft: '1px solid #0000004d', borderTopLeftRadius: '2px', borderBottomLeftRadius: '2px'};
    pagination.styles.pageButtons.firstVisibleButtonOverride ??= defFirstVisibleOverride;
    // last overrides
    const defLastVisibleOverride = {
      borderRight: '1px solid #0000004d', borderTopRightRadius: '2px', borderBottomRightRadius: '2px'};
    pagination.styles.pageButtons.lastVisibleButtonOverride ??= defLastVisibleOverride;
    // active style
    pagination.styles.pageButtons.activeButtonClass = pagination.styles.pageButtons.activeButtonPrecedence
      ? PageButtonElement.PRECEDENCE_ACTIVE_PAGINATION_BUTTON_CLASS : PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS;
  }

  private static processStyle(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.styles) Object.assign(paginationInternal.styles, pagination.styles);
    PaginationInternalUtils.processPageButtonStyles(paginationInternal);
    if (pagination.rowsPerPageSelect !== false) {
      paginationInternal.styles.rowsPerPageSelect ??= {};
      PaginationInternalUtils.setRowsPerPageOptionsStyle(paginationInternal.styles);
    }
    paginationInternal.styles.numberOfVisibleRows ??= {};
    delete pagination.styles; // deleted so that Object.assign wouldn't apply it
  }

  private static processPositions(positions: Required<PaginationPositions>) {
    Object.keys(positions).forEach((componentName) => {
      const component = positions[componentName as keyof PaginationPositions];
      if (!PaginationInternalUtils.POSITIONS.has(component.position))
        component.position = PaginationInternalUtils.DEFAULT_POSITION;
    });
  }

  private static processPosition(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.positions) Object.assign(paginationInternal.positions, pagination.positions);
    PaginationInternalUtils.processPositions(paginationInternal.positions);
    delete pagination.positions; // deleted so that Object.assign wouldn't apply it
  }

  public static process(at: ActiveTable) {
    const {_pagination} = at;
    if (!at.pagination) return;
    const pagination: Pagination = typeof at.pagination === 'boolean' ? {} : at.pagination;
    if (pagination.maxNumberOfVisiblePageButtons !== undefined && pagination.maxNumberOfVisiblePageButtons < 1) {
      pagination.maxNumberOfVisiblePageButtons = 1;
    }
    PaginationInternalUtils.processPosition(pagination, _pagination);
    PaginationInternalUtils.processStyle(pagination, _pagination);
    if (pagination.rowsPerPageSelect !== false) PaginationInternalUtils.processRowsPerPageOptions(at);
    Object.assign(_pagination, pagination);
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
      styles: {}, // this is going to be populated during the call of processInternal method
      visibleEdgeButtons: [],
      numberOfActionButtons: 0,
      dropdownWidth: 24,
      positions: {
        pageButtons: {
          position: PaginationInternalUtils.DEFAULT_POSITION,
          order: 3,
        },
        numberOfVisibleRows: {
          position: PaginationInternalUtils.DEFAULT_POSITION,
          order: 2,
        },
        rowsPerPageSelect: {
          position: PaginationInternalUtils.DEFAULT_POSITION,
          order: 1,
        },
      },
      visibleRows: [],
      activePageNumber: 1,
      isAllRowsOptionSelected: false,
    } as unknown as PaginationInternal;
  }
}
