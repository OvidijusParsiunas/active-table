import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {PaginationStyle, Pagination} from '../../types/pagination';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StatefulCSSS} from '../../types/cssStyle';

interface DefaultBackgroundColors {
  def: string;
  hover: string;
  click: string;
}

export class PaginationInternalUtils {
  // prettier-ignore
  private static setInternalStyle(style: IPaginationStyle, defaultBackgrounds: DefaultBackgroundColors,
      buttonType: keyof PropertiesOfType<IPaginationStyle, Required<StatefulCSSS>>) {
    (style as PaginationStyle<StatefulCSSS>)[buttonType] ??= {};
    const {def, hover, click} = defaultBackgrounds;
    style[buttonType].click ??= style[buttonType].hover || style[buttonType].default || {backgroundColor: click};
    style[buttonType].hover ??= style[buttonType].default || {backgroundColor: hover};
    style[buttonType].default ??= {backgroundColor: def};
  }

  // actionButtons reuse buttons style
  private static mergeActionButtonsStyleWithNewButtons(style: IPaginationStyle) {
    (style as PaginationStyle<StatefulCSSS>).actionButtons ??= {};
    const {buttons, actionButtons} = style;
    const buttonsClone = JSON.parse(JSON.stringify(buttons)); // structuredClone does not seem to work properly
    Object.assign(buttonsClone.default, actionButtons.default);
    Object.assign(buttonsClone.hover, actionButtons.hover);
    Object.assign(buttonsClone.click, actionButtons.click);
    return buttonsClone;
  }

  private static processButtonStyle(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.style) Object.assign(paginationInternal.style, pagination.style);
    // buttons
    const defButtonsBackgroundColors = {def: 'yellow', hover: 'orange', click: 'red'};
    PaginationInternalUtils.setInternalStyle(paginationInternal.style, defButtonsBackgroundColors, 'buttons');
    // actionButtons
    const newActionButtons = PaginationInternalUtils.mergeActionButtonsStyleWithNewButtons(paginationInternal.style);
    paginationInternal.style.actionButtons = newActionButtons;
    const defActionBackgroundColors = {def: 'green', hover: 'blue', click: 'deepskyblue'};
    PaginationInternalUtils.setInternalStyle(paginationInternal.style, defActionBackgroundColors, 'actionButtons');
    // activeButton
    const defBackgroundColors = {def: 'brown', hover: 'violet', click: 'purple'};
    PaginationInternalUtils.setInternalStyle(paginationInternal.style, defBackgroundColors, 'activeButton');
    // disabledButtons
    paginationInternal.style.disabledButtons ??= {backgroundColor: 'grey'};
  }

  private static processStyle(pagination: Pagination, paginationInternal: PaginationInternal) {
    PaginationInternalUtils.processButtonStyle(pagination, paginationInternal);
    delete pagination.style; // deleted so that Object.assign wouldn't apply it
  }

  public static process(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.maxNumberOfButtons !== undefined && pagination.maxNumberOfButtons < 1) {
      pagination.maxNumberOfButtons = 1;
    }
    PaginationInternalUtils.processStyle(pagination, paginationInternal);
    Object.assign(paginationInternal, pagination);
  }
}
