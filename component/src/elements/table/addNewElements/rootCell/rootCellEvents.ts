import {StatefulCSSEvents} from '../../../../utils/elements/statefulCSSEvents';
import {ElementEvents} from '../../../../utils/elements/elementEvents';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {EventFunctions} from '../../../../types/eventFunctions';
import {AddNewRowElement} from '../row/addNewRowElement';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';
import {RootCellElement} from './rootCellElement';

export class RootCellEvents {
  public static removeEvents(addRowCellElement: HTMLElement, rootCellEvents: EventFunctions['rootCell']) {
    AddNewRowElement.setDefaultStyle(addRowCellElement);
    ElementEvents.toggleListeners(addRowCellElement, rootCellEvents.styles, false);
    addRowCellElement.dispatchEvent(new MouseEvent('mouseenter'));
    delete rootCellEvents.applied;
  }

  // setting, not apply here as this is only triggered once
  private static setEventFunctions(at: ActiveTable, addNewRowElement: HTMLElement, styles?: StatefulCSS) {
    if (styles) {
      at._eventFunctions.rootCell.styles = ElementEvents.convertToArrayObj(
        StatefulCSSEvents.getEvents(addNewRowElement, styles)
      );
    }
    if (at._frameComponents.displayAddNewRow) {
      const convertFunction = RootCellElement.convertFromRootCell.bind(this, at);
      const {styles} = at._eventFunctions.rootCell;
      styles['click'] ??= [];
      styles['click'].push(convertFunction);
    }
  }

  private static applyStyles(element: HTMLElement, styles: StatefulCSS, tableElement: HTMLElement) {
    const statefulStyles = ElementStyle.generateStatefulCSS(styles, {}, {});
    // width can only be controlled via table
    // no need to unset later as adding new item will recalculate the table width
    if (statefulStyles.default?.width) tableElement.style.width = statefulStyles.default.width;
    delete statefulStyles.default?.width;
    delete statefulStyles.hover?.width;
    delete statefulStyles.click?.width;
    Object.assign(element.style, statefulStyles.default);
  }

  // prettier-ignore
  public static applyEvents(at: ActiveTable, addNewRowElement: HTMLElement) {
    const {_tableElementRef, rootCell, _eventFunctions: {rootCell: rootCellEvents}} = at;
    const styles = rootCell?.styles ? JSON.parse(JSON.stringify(rootCell.styles)) : null;
    if (styles && _tableElementRef) RootCellEvents.applyStyles(addNewRowElement, styles, _tableElementRef);
    if (Object.keys(rootCellEvents.styles).length === 0) RootCellEvents.setEventFunctions(at, addNewRowElement, styles);
    ElementEvents.toggleListeners(addNewRowElement, rootCellEvents.styles, true);
    rootCellEvents.applied = true;
  }
}
