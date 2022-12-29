import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {EditableTableComponent} from '../../editable-table-component';

export class PaginationUpdateButtons {
  public static getExpectedNumberOfButtons(etc: EditableTableComponent, isBeforeInsert = false) {
    const {numberOfEntries} = etc.paginationInternal;
    const numberOfDataRows = Math.max(etc.contents.length - 1, 0);
    const expectedNumberOfDataRows = isBeforeInsert ? numberOfDataRows + 1 : numberOfDataRows;
    return Math.ceil(expectedNumberOfDataRows / numberOfEntries);
  }

  private static getLastButtonAndNumberOfButtons(etc: EditableTableComponent, isInsert: boolean) {
    const buttonContainer = etc.paginationInternal.buttonContainer as HTMLElement;
    const lastButton = buttonContainer.children[buttonContainer.children.length - 1] as HTMLElement;
    const numberOfButtons = PaginationUpdateButtons.getExpectedNumberOfButtons(etc, isInsert);
    return {lastButton, numberOfButtons};
  }

  public static updateOnRowRemove(etc: EditableTableComponent) {
    const {lastButton, numberOfButtons} = PaginationUpdateButtons.getLastButtonAndNumberOfButtons(etc, false);
    if (Number(lastButton.innerText) > numberOfButtons) {
      if ((etc.paginationInternal.buttonContainer as HTMLElement).children.length > 1) {
        lastButton.remove();
      } else {
        PaginationButtonElement.setDisabled(lastButton);
      }
    }
  }

  public static updateOnRowInsert(etc: EditableTableComponent) {
    const {lastButton, numberOfButtons} = PaginationUpdateButtons.getLastButtonAndNumberOfButtons(etc, true);
    if (etc.contents.length === 1) {
      PaginationButtonElement.unsetDisabled(lastButton);
    } else if (Number(lastButton.innerText) < numberOfButtons) {
      const buttonElement = PaginationButtonElement.create(etc, numberOfButtons);
      (etc.paginationInternal.buttonContainer as HTMLElement).appendChild(buttonElement);
    }
  }
}
