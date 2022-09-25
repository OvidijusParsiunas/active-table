export class ElementSiblingIterator {
  public static create(element: HTMLElement) {
    let currentElement = element;
    return {
      next: () => {
        const nextSibling = currentElement.nextSibling as HTMLElement;
        if (nextSibling) {
          currentElement = nextSibling;
        }
        return nextSibling;
      },
      currentElement: () => currentElement,
    };
  }
}
