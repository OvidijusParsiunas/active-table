import {PageNumberButtonElement} from '../../elements/pagination/pageButtons/buttons/number/pageNumberButtonElement';
import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {PaginationUtils} from './paginationUtils';
import {ActiveTable} from '../../activeTable';

export class PaginationUpdatePageButtons {
  private static removeLastNumberButton(at: ActiveTable, numberButtons: HTMLElement[]) {
    numberButtons[numberButtons.length - 1].remove();
    const firstNumberButton = numberButtons[0];
    const firstNumber = Number(firstNumberButton.innerText);
    if (firstNumber > 1) {
      const buttonElement = PageNumberButtonElement.create(at, firstNumber - 1);
      firstNumberButton.insertAdjacentElement('beforebegin', buttonElement);
    }
  }

  public static updateOnRowRemove(at: ActiveTable) {
    const {buttonContainer, style} = at.paginationInternal;
    const numberButtons = PaginationUtils.getPageNumberButtons(buttonContainer);
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    if (Number(lastNumberButton.innerText) > PaginationUtils.getLastPossiblePageNumber(at)) {
      if (numberButtons.length > 1) {
        PaginationUpdatePageButtons.removeLastNumberButton(at, numberButtons);
      } else {
        PageButtonElement.setDisabled(buttonContainer, style.pageButtons);
      }
    }
  }

  private static addNewNumberButtonAtEndIfNeeded(at: ActiveTable, numberButtons: HTMLElement[]) {
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    const lastPossibleNumber = PaginationUtils.getLastPossiblePageNumber(at, true);
    if (Number(lastNumberButton.innerText) < lastPossibleNumber) {
      const buttonElement = PageNumberButtonElement.create(at, lastPossibleNumber);
      lastNumberButton.insertAdjacentElement('afterend', buttonElement);
    }
  }

  public static updateOnRowInsert(at: ActiveTable) {
    const {buttonContainer, style, maxNumberOfVisiblePageButtons} = at.paginationInternal;
    const expectedItemsBeforeInsert = at.dataBeginsAtHeader ? 0 : 1;
    if (at.content.length === expectedItemsBeforeInsert) {
      PageButtonElement.unsetDisabled(buttonContainer, style.pageButtons);
    } else {
      const numberButtons = PaginationUtils.getPageNumberButtons(buttonContainer);
      // if number of buttons is at limit - updateOnNewActive will handle it
      if (numberButtons.length < maxNumberOfVisiblePageButtons) {
        PaginationUpdatePageButtons.addNewNumberButtonAtEndIfNeeded(at, numberButtons);
      }
    }
  }

  // prettier-ignore
  private static shiftLeftwards(at: ActiveTable, numberButtons: HTMLElement[], firstNonLeftShiftNumber: number) {
    const {activePageNumber} = at.paginationInternal;
    const firstVisibleButton = numberButtons[0];
    const firstVisibleButtonNumber = Number(firstVisibleButton.innerText);
    // if buttons [1,2,3,4] - clicking 1,2,3 should not change anything
    // however if [2,3,4] - clicking 2,3 should shift to the left
    // if active number is lower than 3 - shift buttons needed to get to 1, if higher
    // shift buttons to get active number button close to middle
    let numberOfButtonsToShift = activePageNumber <= numberButtons.length / 2
      ? firstVisibleButtonNumber - 1 : firstNonLeftShiftNumber - activePageNumber;
    let firstAddedButtonNumber = firstVisibleButtonNumber;
    if (numberOfButtonsToShift > numberButtons.length) {
      numberOfButtonsToShift = numberButtons.length;
      firstAddedButtonNumber = numberButtons.length + 1;
    }
    for (let i = numberOfButtonsToShift - 1; i >= 0; i -= 1) {
      const buttonElement = PageNumberButtonElement.create(at, firstAddedButtonNumber - i - 1);
      firstVisibleButton.insertAdjacentElement('beforebegin', buttonElement);
    }
    numberButtons.slice(numberButtons.length - numberOfButtonsToShift).forEach((button) => button.remove());
  }

  // prettier-ignore
  private static shiftRightwards(at: ActiveTable,
      numberButtons: HTMLElement[], lastVisibleButtonNumber: number, lastNonRightShiftNumber: number) {
    const {activePageNumber} = at.paginationInternal;
    const lastButtonNumber = PaginationUtils.getLastPossiblePageNumber(at);
    // if buttons [3,4,5,6] when there are 6 possible buttons - clicking 5,6 should not change anything
    // however if [2,3,4,5] - clicking 5 shifts to the right
    // if active number higher than 4 - shift buttons needed to get to the last possible number (5),
    // if lower shift buttons to get active number button close to the middle
    let numberOfButtonsToShift = activePageNumber > lastButtonNumber - numberButtons.length / 2
      ? lastButtonNumber - lastVisibleButtonNumber : activePageNumber - lastNonRightShiftNumber;
    let firstAddedButtonNumber = lastVisibleButtonNumber;
    if (numberOfButtonsToShift > numberButtons.length) {
      numberOfButtonsToShift = numberButtons.length;
      firstAddedButtonNumber = activePageNumber - numberButtons.length;
    }
    const lastVisibleButton = numberButtons[numberButtons.length - 1];
    for (let i = numberOfButtonsToShift - 1; i >= 0; i -= 1) {
      const buttonElement = PageNumberButtonElement.create(at, i + firstAddedButtonNumber + 1);
      lastVisibleButton.insertAdjacentElement('afterend', buttonElement);
    }
    numberButtons.slice(0, numberOfButtonsToShift).forEach((button) => button.remove());
  }

  public static updateOnNewActive(at: ActiveTable, buttonContainer: HTMLElement) {
    const {activePageNumber, maxNumberOfVisiblePageButtons} = at.paginationInternal;
    const numberButtons = PaginationUtils.getPageNumberButtons(buttonContainer);
    if (numberButtons.length < maxNumberOfVisiblePageButtons) return;
    const lastVisibleButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    // number that should not trigger shift to the right
    const lastNonRightShiftNumber = Math.floor(lastVisibleButtonNumber - numberButtons.length / 2) + 1;
    if (activePageNumber > lastNonRightShiftNumber) {
      PaginationUpdatePageButtons.shiftRightwards(at, numberButtons, lastVisibleButtonNumber, lastNonRightShiftNumber);
    } else {
      // number that should not trigger shift to the left
      const firstNonLeftShiftNumber = Math.ceil(lastVisibleButtonNumber - numberButtons.length / 2);
      if (activePageNumber < firstNonLeftShiftNumber) {
        PaginationUpdatePageButtons.shiftLeftwards(at, numberButtons, firstNonLeftShiftNumber);
      }
    }
  }
}
