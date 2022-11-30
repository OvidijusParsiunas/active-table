import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {Browser} from '../../../../utils/browser/browser';
import {CellElement} from '../../cellElement';

// stops tsc from complaining
interface HTMLInputDateElement extends HTMLInputElement {
  showPicker: () => void;
}

// the actual calendar and date pocker are on the input element and this is a standin replacement icon to standardize
// how the calendars look across browsers as the date input tends to vary their look
export class DateCellCalendarIconEvents {
  // firefox date picker has a fade out animation which does not allow the user to open up another date picker
  // while the current one is open, hence need to wait for animation to finish
  private static readonly PICKER_DISPLAY_DELAY_ML = Browser.IS_FIREFOX ? 190 : 0;

  private static mouseDownIcon(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const svgImage = event.target as HTMLElement;
    const inputElement = svgImage.previousSibling as HTMLInputDateElement;
    const cellElement = CellElement.extractCellElement(inputElement);
    setTimeout(() => {
      // this is in a timeout as upon selecting text, then clicking on the icon causes the text blur to activate
      // which purges the selected cell ref
      FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex);
      // this is in a timeout because mouseDownIcon is triggered before window mouse down event which calls
      // delete this.overlayElementsState.datePickerCell, thus this setter needs to be called after
      this.overlayElementsState.datePickerCell = cellElement;
      // displaying the picker on mouse down in order to keep it consistent with mouse down display for category,
      // however if it feels more natural to do it on mouse up, can move it to that, but keep in mind that it
      // does not feel right for firefox as there is an additional timeout - hence may need to keep it here
      // for this particular browser
      // firefox date picker has a fade out animation which does not allow the user to open up another date picker
      // while the current one is open, hence need to wait for animation to finish
      inputElement.showPicker();
    }, DateCellCalendarIconEvents.PICKER_DISPLAY_DELAY_ML);
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, calendarElement: HTMLElement, rowIndex: number,
      columnIndex: number) {
    calendarElement.onmousedown = DateCellCalendarIconEvents.mouseDownIcon.bind(etc, rowIndex, columnIndex);
  }
}
