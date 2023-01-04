// eslint-disable-next-line max-len
import {NumberOfRowsDropdownItem} from '../../elements/pagination/numberOfRowsOptions/optionsButton/numberOfRowsDropdownItem';
import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {DefaultContainerPositions} from './defaultContainerPositions';
import {EditableTableComponent} from '../../editable-table-component';
import {StatefulCSSS} from '../../types/cssStyle';
import {
  PaginationPositions,
  NumberOfRowsOptions,
  PageButtonStyle,
  ContainerStyle,
  Pagination,
} from '../../types/pagination';

interface DefaultBackgroundColors {
  def: string;
  hover: string;
  click: string;
}

type PositionProps = {
  [key in keyof Required<PaginationPositions>]: ContainerStyle;
};

type StatefulStyle = {[key: string]: StatefulCSSS};

export class PaginationInternalUtils {
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

  private static processNumberOfRows(etc: EditableTableComponent) {
    const {pagination, paginationInternal} = etc;
    const {numberOfRowsOptions, numberOfRows} = pagination;
    if (numberOfRowsOptions || numberOfRowsOptions === undefined) {
      const {numberOfRowsOptionsItemText: InumberOfRowsOptionsItemText} = paginationInternal;
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
    const defButtonsBackgroundColors = {def: '', hover: '#f5f5f5', click: '#f5f5f5'};
    style.numberOfRowsOptions ??= {};
    const statefulStyle = style.numberOfRowsOptions as StatefulStyle;
    PaginationInternalUtils.setStatefulCSS(statefulStyle, defButtonsBackgroundColors, 'button');
  }

  private static setContainerStyle(pageButtonsStyle: PageButtonStyle, positionProperties: ContainerStyle) {
    const {container} = pageButtonsStyle;
    const containerStyle: ContainerStyle = {
      border: container?.border || '1px solid black',
      margin: container?.margin || '0px',
      marginTop: container?.marginTop || positionProperties.marginTop || '0px',
      marginLeft: container?.marginLeft || positionProperties.marginLeft || '0px',
      marginRight: container?.marginRight || positionProperties.marginRight || '0px',
      marginBottom: container?.marginBottom || positionProperties.marginBottom || '0px',
      float: container?.float || positionProperties.float || '',
    };
    pageButtonsStyle.container = containerStyle;
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

  // prettier-ignore
  private static processStyle(pagination: Pagination, paginationInternal: PaginationInternal,
      positionProperties: PositionProps) {
    if (pagination.style) Object.assign(paginationInternal.style, pagination.style);
    PaginationInternalUtils.processPageButtonStyle(paginationInternal);
    PaginationInternalUtils.setContainerStyle(paginationInternal.style.pageButtons, positionProperties.container);
    PaginationInternalUtils.setNumberOfRowsOptionsStyle(paginationInternal.style);
    delete pagination.style; // deleted so that Object.assign wouldn't apply it
  }

  private static processPosition(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.positions) Object.assign(paginationInternal.positions, pagination.positions);
    delete pagination.positions; // deleted so that Object.assign wouldn't apply it
    const positionProperties: PositionProps = {
      container: DefaultContainerPositions.POSITIONS[paginationInternal.positions.container],
    };
    return positionProperties;
  }

  public static process(etc: EditableTableComponent) {
    const {pagination, paginationInternal} = etc;
    if (pagination.maxNumberOfButtons !== undefined && pagination.maxNumberOfButtons < 1) {
      pagination.maxNumberOfButtons = 1;
    }
    const positionProperties = PaginationInternalUtils.processPosition(pagination, paginationInternal);
    PaginationInternalUtils.processStyle(pagination, paginationInternal, positionProperties);
    PaginationInternalUtils.processNumberOfRowsOptions(pagination, paginationInternal);
    Object.assign(paginationInternal, pagination);
    PaginationInternalUtils.processNumberOfRows(etc);
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
        container: 'bottom-right',
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
