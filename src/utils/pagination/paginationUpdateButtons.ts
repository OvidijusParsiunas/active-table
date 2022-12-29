import {PaginationNumberButtonElement} from '../../elements/pagination/buttons/number/paginationNumberButtonElement';
import {PaginationButtonContainerElement} from '../../elements/pagination/paginationButtonContainerElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {EditableTableComponent} from '../../editable-table-component';

export class PaginationUpdateButtons {
  public static getExpectedNumberOfButtons(etc: EditableTableComponent, isBeforeInsert = false) {
    const {numberOfEntries} = etc.paginationInternal;
    const numberOfDataRows = Math.max(etc.contents.length - 1, 0);
    const expectedNumberOfDataRows = isBeforeInsert ? numberOfDataRows + 1 : numberOfDataRows;
    return Math.ceil(expectedNumberOfDataRows / numberOfEntries);
  }

  private static getLastNumberButtonAndTheirQuantity(etc: EditableTableComponent, isInsert: boolean) {
    const buttonContainer = etc.paginationInternal.buttonContainer as HTMLElement;
    const lastNumberButton = buttonContainer.children[
      buttonContainer.children.length - (PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS / 2 + 1)
    ] as HTMLElement;
    const expectedTotal = PaginationUpdateButtons.getExpectedNumberOfButtons(etc, isInsert);
    return {lastNumberButton, expectedTotal};
  }

  public static updateOnRowRemove(etc: EditableTableComponent) {
    const {buttonContainer} = etc.paginationInternal;
    const {lastNumberButton, expectedTotal} = PaginationUpdateButtons.getLastNumberButtonAndTheirQuantity(etc, false);
    if (buttonContainer && Number(lastNumberButton.innerText) > expectedTotal) {
      if (buttonContainer.children.length - PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS > 1) {
        lastNumberButton.remove();
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
}
