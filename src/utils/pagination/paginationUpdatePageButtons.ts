import {PageNumberButtonElement} from '../../elements/pagination/pageButtons/buttons/number/pageNumberButtonElement';
import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationUtils} from './paginationUtils';

export class PaginationUpdatePageButtons {
  private static removeLastNumberButton(etc: EditableTableComponent, numberButtons: HTMLElement[]) {
    numberButtons[numberButtons.length - 1].remove();
    const firstNumberButton = numberButtons[0];
    const firstNumber = Number(firstNumberButton.innerText);
    if (firstNumber > 1) {
      const buttonElement = PageNumberButtonElement.create(etc, firstNumber - 1);
      firstNumberButton.insertAdjacentElement('beforebegin', buttonElement);
    }
  }

  public static updateOnRowRemove(etc: EditableTableComponent) {
    const {buttonContainer, style} = etc.paginationInternal;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    if (Number(lastNumberButton.innerText) > PaginationUtils.getLastPossiblePageNumber(etc)) {
      if (numberButtons.length > 1) {
        PaginationUpdatePageButtons.removeLastNumberButton(etc, numberButtons);
      } else {
        PageButtonElement.setDisabled(buttonContainer, style.pageButtons);
      }
    }
  }

  private static addNewNumberButtonAtEndIfNeeded(etc: EditableTableComponent, numberButtons: HTMLElement[]) {
    const lastNumberButton = numberButtons[numberButtons.length - 1];
    const lastPossibleNumber = PaginationUtils.getLastPossiblePageNumber(etc, true);
    if (Number(lastNumberButton.innerText) < lastPossibleNumber) {
      const buttonElement = PageNumberButtonElement.create(etc, lastPossibleNumber);
      lastNumberButton.insertAdjacentElement('afterend', buttonElement);
    }
  }

  public static updateOnRowInsert(etc: EditableTableComponent) {
    const {buttonContainer, style, maxNumberOfButtons} = etc.paginationInternal;
    const expectedItemsBeforeInsert = etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? 0 : 1;
    if (etc.contents.length === expectedItemsBeforeInsert) {
      PageButtonElement.unsetDisabled(buttonContainer, style.pageButtons);
    } else {
      const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
      // if number of buttons is at limit - updateOnNewActive will handle it
      if (numberButtons.length < maxNumberOfButtons) {
        PaginationUpdatePageButtons.addNewNumberButtonAtEndIfNeeded(etc, numberButtons);
      }
    }
  }

  // prettier-ignore
  private static shiftLeftwards(etc: EditableTableComponent, numberButtons: HTMLElement[],
      firstNonLeftShiftNumber: number) {
    const {activePageNumber} = etc.paginationInternal;
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
      const buttonElement = PageNumberButtonElement.create(etc, firstAddedButtonNumber - i - 1);
      firstVisibleButton.insertAdjacentElement('beforebegin', buttonElement);
    }
    numberButtons.slice(numberButtons.length - numberOfButtonsToShift).forEach((button) => button.remove());
  }

  // prettier-ignore
  private static shiftRightwards(etc: EditableTableComponent, numberButtons: HTMLElement[],
      lastVisibleButtonNumber: number, lastNonRightShiftNumber: number) {
    const {activePageNumber} = etc.paginationInternal;
    const lastButtonNumber = PaginationUtils.getLastPossiblePageNumber(etc);
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
      const buttonElement = PageNumberButtonElement.create(etc, i + firstAddedButtonNumber + 1);
      lastVisibleButton.insertAdjacentElement('afterend', buttonElement);
    }
    numberButtons.slice(0, numberOfButtonsToShift).forEach((button) => button.remove());
  }

  public static updateOnNewActive(etc: EditableTableComponent, buttonContainer: HTMLElement) {
    const {activePageNumber, maxNumberOfButtons} = etc.paginationInternal;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    if (numberButtons.length < maxNumberOfButtons) return;
    const lastVisibleButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    // number that should not trigger shift to the right
    const lastNonRightShiftNumber = Math.floor(lastVisibleButtonNumber - numberButtons.length / 2) + 1;
    if (activePageNumber > lastNonRightShiftNumber) {
      PaginationUpdatePageButtons.shiftRightwards(etc, numberButtons, lastVisibleButtonNumber, lastNonRightShiftNumber);
    } else {
      // number that should not trigger shift to the left
      const firstNonLeftShiftNumber = Math.ceil(lastVisibleButtonNumber - numberButtons.length / 2);
      if (activePageNumber < firstNonLeftShiftNumber) {
        PaginationUpdatePageButtons.shiftLeftwards(etc, numberButtons, firstNonLeftShiftNumber);
      }
    }
  }
}
