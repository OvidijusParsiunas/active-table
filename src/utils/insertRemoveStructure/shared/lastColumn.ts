import {ElementDetails} from '../../../types/elementDetails';

export class LastColumn {
  // the reason why last column details are used is because after removal of the last column element, its details are
  // no longer present update methods are run in setTimeouts, hence those details need to be captured before
  // their methods are executed
  public static getDetails(rowElement: HTMLElement): ElementDetails {
    // the text element is before the last divider
    const lastTextElementIndex = rowElement.children.length - 2;
    const lastTextElement = rowElement.children[lastTextElementIndex] as HTMLElement;
    // index is the data cell index not the element index, as there are divider elements we divide by 2
    return {element: lastTextElement, index: lastTextElementIndex / 2};
  }
}
