import {PaginationStyle, Pagination, ContainerStyle, PaginationPositions} from '../../types/pagination';
import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {DefaultContainerPositions} from './defaultContainerPositions';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StatefulCSSS} from '../../types/cssStyle';

interface DefaultBackgroundColors {
  def: string;
  hover: string;
  click: string;
}

type PositionProps = {
  [key in keyof Required<PaginationPositions>]: ContainerStyle;
};

export class PaginationInternalUtils {
  private static setContainerStyle(style: IPaginationStyle, positionProperties: ContainerStyle) {
    const containerStyle: ContainerStyle = {
      border: style.container?.border || '1px solid black',
      margin: style.container?.margin || '0px',
      marginTop: style.container?.marginTop || positionProperties.marginTop || '0px',
      marginLeft: style.container?.marginLeft || positionProperties.marginLeft || '0px',
      marginRight: style.container?.marginRight || positionProperties.marginRight || '0px',
      marginBottom: style.container?.marginBottom || positionProperties.marginBottom || '0px',
      float: style.container?.float || positionProperties.float || '',
    };
    style.container = containerStyle;
  }

  // prettier-ignore
  private static setStatefulCSS(style: IPaginationStyle, defaultBackgrounds: DefaultBackgroundColors,
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

  private static processButtonStyle(paginationInternal: PaginationInternal) {
    // buttons
    const defButtonsBackgroundColors = {def: 'yellow', hover: 'orange', click: 'red'};
    PaginationInternalUtils.setStatefulCSS(paginationInternal.style, defButtonsBackgroundColors, 'buttons');
    // actionButtons
    const newActionButtons = PaginationInternalUtils.mergeActionButtonsStyleWithNewButtons(paginationInternal.style);
    paginationInternal.style.actionButtons = newActionButtons;
    const defActionBackgroundColors = {def: 'green', hover: 'blue', click: 'deepskyblue'};
    PaginationInternalUtils.setStatefulCSS(paginationInternal.style, defActionBackgroundColors, 'actionButtons');
    // activeButton
    const defBackgroundColors = {def: 'brown', hover: 'violet', click: 'purple'};
    PaginationInternalUtils.setStatefulCSS(paginationInternal.style, defBackgroundColors, 'activeButton');
    // disabledButtons
    paginationInternal.style.disabledButtons ??= {backgroundColor: 'grey'};
  }

  // prettier-ignore
  private static processStyle(pagination: Pagination, paginationInternal: PaginationInternal,
      positionProperties: PositionProps) {
    if (pagination.style) Object.assign(paginationInternal.style, pagination.style);
    PaginationInternalUtils.processButtonStyle(paginationInternal);
    PaginationInternalUtils.setContainerStyle(paginationInternal.style, positionProperties.container);
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

  public static process(pagination: Pagination, paginationInternal: PaginationInternal) {
    if (pagination.maxNumberOfButtons !== undefined && pagination.maxNumberOfButtons < 1) {
      pagination.maxNumberOfButtons = 1;
    }
    const positionProperties = PaginationInternalUtils.processPosition(pagination, paginationInternal);
    PaginationInternalUtils.processStyle(pagination, paginationInternal, positionProperties);
    Object.assign(paginationInternal, pagination);
  }
}
