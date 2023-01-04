// eslint-disable-next-line max-len
import {NumberOfRowsDropdownItem} from '../../elements/pagination/numberOfRowsOptions/optionsButton/numberOfRowsDropdownItem';
import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {EditableTableComponent} from '../../editable-table-component';
import {StatefulCSSS} from '../../types/cssStyle';
import {
  PaginationPositionSide,
  NumberOfRowsOptions,
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

  private static setNumberOfRows(etc: EditableTableComponent) {
    const {paginationInternal, contents, auxiliaryTableContent} = etc;
    const firstItemText = paginationInternal.numberOfRowsOptionsItemText[0];
    if (firstItemText.toLocaleLowerCase() === NumberOfRowsDropdownItem.ALL_ITEM_TEXT) {
      paginationInternal.isAllRowsOptionSelected = true;
      paginationInternal.numberOfRows = auxiliaryTableContent.indexColumnCountStartsAtHeader
        ? contents.length
        : contents.length - 1;
    } else {
      paginationInternal.numberOfRows = Number(firstItemText);
    }
  }

  private static processNumberOfRows(etc: EditableTableComponent, pagination: Pagination) {
    const {numberOfRowsOptions, numberOfRows} = pagination;
    if (numberOfRowsOptions || numberOfRowsOptions === undefined) {
      const {numberOfRowsOptionsItemText: InumberOfRowsOptionsItemText} = etc.paginationInternal;
      if (!InumberOfRowsOptionsItemText.find((value) => value === String(numberOfRows))) {
        PaginationInternalUtils.setNumberOfRows(etc);
      }
    }
  }

  private static processOptionsItemText(userNumber: number | string) {
    const number = Number(userNumber);
    if (!isNaN(number) && number < 1) return '1';
    return String(userNumber);
  }

  // prettier-ignore
  private static setNumberOfRowsOptionsText(pagination: Pagination, paginationInternal: PaginationInternal) {
    const {numberOfRowsOptions} = pagination;
    if (numberOfRowsOptions || numberOfRowsOptions === undefined) {
      const defaultOptions = (paginationInternal.numberOfRowsOptions as NumberOfRowsOptions).options; // default options
      const options = numberOfRowsOptions === undefined || numberOfRowsOptions === true
        || !numberOfRowsOptions.options || numberOfRowsOptions.options.length === 0
          ? defaultOptions : numberOfRowsOptions.options;
      paginationInternal.numberOfRowsOptionsItemText = (options as (number|string)[])
        .map((option) => PaginationInternalUtils.processOptionsItemText(option));
    }
  }

  private static processNumberOfRowsOptions(pagination: Pagination, paginationInternal: PaginationInternal) {
    const {numberOfRowsOptions} = pagination;
    if (numberOfRowsOptions !== undefined && typeof numberOfRowsOptions !== 'boolean' && numberOfRowsOptions.prefixText) {
      (paginationInternal.numberOfRowsOptions as NumberOfRowsOptions).prefixText = numberOfRowsOptions.prefixText;
    }
    PaginationInternalUtils.setNumberOfRowsOptionsText(pagination, paginationInternal);
    delete pagination.numberOfRowsOptions;
  }

  private static setNumberOfRowsOptionsStyle(style: IPaginationStyle) {
    // only adding stateful style for button as it is the only one that has default stategful css
    const defButtonsBackgroundColors = {def: '', hover: '#f5f5f5', click: '#f5f5f5'};
    const statefulStyle = style.numberOfRowsOptions as StatefulStyle;
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
    if (pagination.numberOfRowsOptions !== false) {
      paginationInternal.style.numberOfRowsOptions ??= {};
      PaginationInternalUtils.setNumberOfRowsOptionsStyle(paginationInternal.style);
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

  public static process(etc: EditableTableComponent) {
    const {pagination, paginationInternal} = etc;
    if (!pagination) return;
    if (pagination.maxNumberOfButtons !== undefined && pagination.maxNumberOfButtons < 1) {
      pagination.maxNumberOfButtons = 1;
    }
    PaginationInternalUtils.processPosition(pagination, paginationInternal);
    PaginationInternalUtils.processStyle(pagination, paginationInternal);
    if (pagination.numberOfRowsOptions !== false) {
      PaginationInternalUtils.processNumberOfRowsOptions(pagination, paginationInternal);
    }
    Object.assign(paginationInternal, pagination);
    if (pagination.displayNumberOfVisibleRows !== false) {
      PaginationInternalUtils.processNumberOfRows(etc, pagination);
    }
  }

  public static getDefault(): PaginationInternal {
    return {
      numberOfRows: 10,
      maxNumberOfButtons: 8,
      activePageNumber: 1,
      visibleRows: [],
      displayPrevNext: true,
      displayFirstLast: true,
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
        numberOfRowsOptions: {
          side: PaginationInternalUtils.DEFAULT_SIDE,
          order: 1,
        },
      },
      displayNumberOfVisibleRows: true,
      numberOfRowsOptions: {
        options: [10, 25, 50, 'All'],
        prefixText: 'Rows per page:',
      },
      isAllRowsOptionSelected: false,
    } as unknown as PaginationInternal;
  }
}
