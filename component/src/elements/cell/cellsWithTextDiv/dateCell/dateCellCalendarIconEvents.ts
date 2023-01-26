import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {Browser} from '../../../../utils/browser/browser';
import {ActiveTable} from '../../../../activeTable';
import {CellElement} from '../../cellElement';

// the actual calendar and date pocker are on the input element and this is a standin replacement icon to standardize
// how the calendars look across browsers as the date input tends to vary their look
export class DateCellCalendarIconEvents {
  // firefox date picker has a fade out animation which does not allow the user to open up another date picker
  // while the current one is open, hence need to wait for animation to finish
  private static readonly PICKER_DISPLAY_DELAY_ML = Browser.IS_FIREFOX ? 190 : 0;

  // prettier-ignore
  private static mouseDownIcon(this: ActiveTable, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const {focusedElements, columnsDetails, activeOverlayElements} = this;
    const svgImage = event.target as HTMLElement;
    const inputElement = svgImage.previousSibling as PickerInputElement;
    const cellElement = CellElement.getCellElement(inputElement);
    setTimeout(() => {
      // this is in a timeout as upon selecting text, then clicking on the icon causes the text blur to activate
      // which purges the selected cell ref
      FocusedCellUtils.set(
        focusedElements.cell, cellElement, rowIndex, columnIndex, columnsDetails[columnIndex].settings.types);
      // this is in a timeout because mouseDownIcon is triggered before window mouse down event which calls
      // delete activeOverlayElements.datePickerCell, thus this setter needs to be called after
      activeOverlayElements.datePickerCell = cellElement;
      // displaying the picker on mouse down in order to keep it consistent with mouse down display for cell dropdown,
      // however if it feels more natural to do it on mouse up, can move it to that, but keep in mind that it
      // does not feel right for firefox as there is an additional timeout - hence may need to keep it here
      // for this particular browser
      // firefox date picker has a fade out animation which does not allow the user to open up another date picker
      // while the current one is open, hence need to wait for animation to finish
      if (Browser.IS_SAFARI) {
        inputElement.dispatchEvent(new MouseEvent('click'));
      } else {
        inputElement.showPicker();
      }
    }, DateCellCalendarIconEvents.PICKER_DISPLAY_DELAY_ML);
  }

  public static setEvents(at: ActiveTable, calendarElement: HTMLElement, rowIndex: number, columnIndex: number) {
    calendarElement.onmousedown = DateCellCalendarIconEvents.mouseDownIcon.bind(at, rowIndex, columnIndex);
  }
}
