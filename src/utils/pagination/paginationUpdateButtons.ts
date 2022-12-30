import {PaginationNumberButtonElement} from '../../elements/pagination/buttons/number/paginationNumberButtonElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationSideButtonUtils} from './paginationSideButtonUtils';
import {PaginationUtils} from './paginationUtils';

export class PaginationUpdateButtons {
  private static removeLastNumberButton(etc: EditableTableComponent, numberButtons: HTMLElement[]) {
    const {buttonContainer, activeButtonNumber} = etc.paginationInternal;
    numberButtons[numberButtons.length - 1].remove();
    const firstNumberButton = numberButtons[0];
    const firstNumber = Number(firstNumberButton.innerText);
    if (firstNumber > 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, firstNumber - 1);
      firstNumberButton.insertAdjacentElement('beforebegin', buttonElement);
    }
    PaginationSideButtonUtils.toggleSideButtons(buttonContainer as HTMLElement, activeButtonNumber);
  }

  public static updateOnRowRemove(etc: EditableTableComponent) {
    const {buttonContainer} = etc.paginationInternal;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer as HTMLElement);
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    if (buttonContainer && Number(lastNumberButton.innerText) > PaginationUtils.getLastPossibleButtonNumber(etc)) {
      if (numberButtons.length > 1) {
        PaginationUpdateButtons.removeLastNumberButton(etc, numberButtons);
      } else {
        PaginationButtonElement.setDisabled(buttonContainer);
      }
    }
  }

  private static addNewNumberButtonAtEndIfNeeded(etc: EditableTableComponent, numberButtons: HTMLElement[]) {
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    const lastPossibleNumber = PaginationUtils.getLastPossibleButtonNumber(etc, true);
    if (Number(lastNumberButton.innerText) < lastPossibleNumber) {
      const buttonElement = PaginationNumberButtonElement.create(etc, lastPossibleNumber);
      lastNumberButton.insertAdjacentElement('afterend', buttonElement);
    }
  }

  public static updateOnRowInsert(etc: EditableTableComponent) {
    const {buttonContainer} = etc.paginationInternal;
    if (buttonContainer && etc.contents.length === 1) {
      PaginationButtonElement.unsetDisabled(buttonContainer);
    } else if (buttonContainer) {
      const {maxNumberOfButtons} = etc.paginationInternal;
      const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
      // if number of buttons is at limit - updateOnNewActive will handle it
      if (numberButtons.length < maxNumberOfButtons) {
        PaginationUpdateButtons.addNewNumberButtonAtEndIfNeeded(etc, numberButtons);
      }
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
    let numberOfButtonsToShift = activeButtonNumber <= numberButtons.length / 2
      ? firstVisibleButtonNumber - 1 : firstNonLeftShiftNumber - activeButtonNumber;
    let firstAddedButtonNumber = firstVisibleButtonNumber;
    if (numberOfButtonsToShift > numberButtons.length) {
      numberOfButtonsToShift = numberButtons.length;
      firstAddedButtonNumber = numberButtons.length + 1;
    }
    for (let i = numberOfButtonsToShift - 1; i >= 0; i -= 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, firstAddedButtonNumber - i - 1);
      firstVisibleButton.insertAdjacentElement('beforebegin', buttonElement);
    }
    numberButtons.slice(numberButtons.length - numberOfButtonsToShift).forEach((button) => button.remove());
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
    let numberOfButtonsToShift = activeButtonNumber > lastButtonNumber - numberButtons.length / 2
      ? lastButtonNumber - lastVisibleButtonNumber : activeButtonNumber - lastNonRightShiftNumber;
    let firstAddedButtonNumber = lastVisibleButtonNumber;
    if (numberOfButtonsToShift > numberButtons.length) {
      numberOfButtonsToShift = numberButtons.length;
      firstAddedButtonNumber = activeButtonNumber - numberButtons.length;
    }
    const lastVisibleButton = numberButtons[numberButtons.length - 1];
    for (let i = numberOfButtonsToShift - 1; i >= 0; i -= 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, i + firstAddedButtonNumber + 1);
      lastVisibleButton.insertAdjacentElement('afterend', buttonElement);
    }
    numberButtons.slice(0, numberOfButtonsToShift).forEach((button) => button.remove());
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
