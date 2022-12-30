import {PaginationNumberButtonElement} from '../../elements/pagination/buttons/number/paginationNumberButtonElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationSideButtonUtils} from './paginationSideButtonUtils';
import {PaginationUtils} from './paginationUtils';

export class PaginationUpdateButtons {
  public static getExpectedNumberOfButtons(etc: EditableTableComponent, isBeforeInsert = false) {
    const {numberOfEntries} = etc.paginationInternal;
    const numberOfDataRows = Math.max(etc.contents.length - 1, 0);
    const expectedNumberOfDataRows = isBeforeInsert ? numberOfDataRows + 1 : numberOfDataRows;
    return Math.ceil(expectedNumberOfDataRows / numberOfEntries);
  }

  private static getLastNumberButtonAndTheirQuantity(etc: EditableTableComponent, isInsert: boolean) {
    const buttonContainer = etc.paginationInternal.buttonContainer as HTMLElement;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    const expectedTotal = PaginationUpdateButtons.getExpectedNumberOfButtons(etc, isInsert);
    return {lastNumberButton, expectedTotal};
  }

  public static updateOnRowRemove(etc: EditableTableComponent) {
    const {buttonContainer, activeButtonNumber} = etc.paginationInternal;
    const {lastNumberButton, expectedTotal} = PaginationUpdateButtons.getLastNumberButtonAndTheirQuantity(etc, false);
    if (buttonContainer && Number(lastNumberButton.innerText) > expectedTotal) {
      if (PaginationUtils.getNumberButtons(buttonContainer).length > 1) {
        lastNumberButton.remove();
        PaginationSideButtonUtils.toggleSideButtons(buttonContainer, activeButtonNumber);
      } else {
        PaginationButtonElement.setDisabled(buttonContainer);
      }
    }
  }

  public static updateOnRowInsert(etc: EditableTableComponent) {
    const {buttonContainer} = etc.paginationInternal;
    const {lastNumberButton, expectedTotal} = PaginationUpdateButtons.getLastNumberButtonAndTheirQuantity(etc, true);
    if (buttonContainer && etc.contents.length === 1) {
      PaginationButtonElement.unsetDisabled(buttonContainer);
    } else if (Number(lastNumberButton.innerText) < expectedTotal) {
      const buttonElement = PaginationNumberButtonElement.create(etc, expectedTotal);
      lastNumberButton.insertAdjacentElement('afterend', buttonElement);
    }
  }

  // prettier-ignore
  private static shiftLeftwards(etc: EditableTableComponent, numberButtons: HTMLElement[],
      firstNonLeftShiftNumber: number) {
    const {activeButtonNumber} = etc.paginationInternal;
    const firstVisibleButton = numberButtons[0];
    const firstVisibleButtonNumber = Number(firstVisibleButton.innerText);
    // if buttons [1,2,3,4] - clicking 1,2,3 should not change anything
    // however if [2,3,4] - clicking 2,3 should shift to the left
    // if active number is lower than 3 - shift buttons needed to get to 1, if higher
    // shift buttons to get active number button close to middle
    const numberOfButtonsToShift = activeButtonNumber <= numberButtons.length / 2
      ? firstVisibleButtonNumber - 1 : firstNonLeftShiftNumber - activeButtonNumber;
    numberButtons.slice(numberButtons.length - numberOfButtonsToShift).forEach((button) => button.remove());
    for (let i = numberOfButtonsToShift - 1; i >= 0; i -= 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, firstVisibleButtonNumber - i - 1);
      firstVisibleButton.insertAdjacentElement('beforebegin', buttonElement);
    }
  }

  // prettier-ignore
  private static shiftRightwards(etc: EditableTableComponent, numberButtons: HTMLElement[],
      lastVisibleButtonNumber: number, lastNonRightShiftNumber: number) {
    const {activeButtonNumber} = etc.paginationInternal;
    const lastButtonNumber = PaginationUtils.getLastPossibleButtonNumber(etc);
    // if buttons [3,4,5,6] when there are 6 possible buttons - clicking 5,6 should not change anything
    // however if [2,3,4,5] - clicking 5 shifts to the right
    // if active number higher than 4 - shift buttons needed to get to the last possible number (5),
    // if lower shift buttons to get active number button close to the middle
    const numberOfButtonsToRemove = activeButtonNumber > lastButtonNumber - numberButtons.length / 2
      ? lastButtonNumber - lastVisibleButtonNumber : activeButtonNumber - lastNonRightShiftNumber;
    numberButtons.slice(0, numberOfButtonsToRemove).forEach((button) => button.remove());
    const lastVisibleButton = numberButtons[numberButtons.length - 1];
    for (let i = numberOfButtonsToRemove - 1; i >= 0; i -= 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, i + lastVisibleButtonNumber + 1);
      lastVisibleButton.insertAdjacentElement('afterend', buttonElement);
    }
  }

  // prettier-ignore
  public static updateOnNewActive(etc: EditableTableComponent) {
    const {activeButtonNumber, buttonContainer, maxNumberOfButtons} = etc.paginationInternal;
    if (!buttonContainer) return;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    if (numberButtons.length < maxNumberOfButtons) return;
    const lastVisibleButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    // number that should not trigger shift to the right
    const lastNonRightShiftNumber = Math.floor(lastVisibleButtonNumber - numberButtons.length / 2) + 1;
    if (activeButtonNumber > lastNonRightShiftNumber) {
      PaginationUpdateButtons.shiftRightwards(etc, numberButtons, lastVisibleButtonNumber, lastNonRightShiftNumber);
    } else {
      // number that should not trigger shift to the left
      const firstNonLeftShiftNumber = Math.ceil(lastVisibleButtonNumber - numberButtons.length / 2);
      if (activeButtonNumber < firstNonLeftShiftNumber) {
        PaginationUpdateButtons.shiftLeftwards(etc, numberButtons, firstNonLeftShiftNumber);
      }
    }
  }
}
