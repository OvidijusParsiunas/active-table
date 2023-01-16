import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {NumberOfRowsOptionsButtonEvents} from './numberOfRowsOptionsButtonEvents';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {NumberOfRowsOptionsStyle} from '../../../../types/pagination';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {Browser} from '../../../../utils/browser/browser';
import {StatefulCSSS} from '../../../../types/cssStyle';

export class NumberOfRowsOptionsButtonElement {
  private static readonly BUTTON_ID = 'pagination-of-rows-options-button';
  private static readonly ARROW_ID = 'pagination-of-rows-options-button-arrow';
  private static readonly TEXT_ID = 'pagination-of-rows-options-button-text';

  // prettier-ignore
  private static reapplyStyle(element: HTMLElement, numberOfRowsOptions: NumberOfRowsOptionsStyle,
      elementName: keyof NumberOfRowsOptionsStyle, cssState: keyof StatefulCSSS) {
    const statefulStyle = numberOfRowsOptions[elementName] as StatefulCSSS;
    ElementStyle.unsetAllCSSStates(element, statefulStyle);
    Object.assign(element.style, statefulStyle[cssState]);
  }

  // prettier-ignore
  public static reapplyStylesOnElements(button: HTMLElement, cssState: keyof StatefulCSSS,
      numberOfRowsOptions?: NumberOfRowsOptionsStyle) {
    if (!numberOfRowsOptions) return;
    if (numberOfRowsOptions.button) {
      NumberOfRowsOptionsButtonElement.reapplyStyle(button, numberOfRowsOptions, 'button', cssState);
    }
    if (numberOfRowsOptions.buttonText) {
      const buttonText = button.children[0] as HTMLElement;
      NumberOfRowsOptionsButtonElement.reapplyStyle(buttonText, numberOfRowsOptions, 'buttonText', cssState);
    }
    if (numberOfRowsOptions.buttonArrow) {
      const buttonArrow = button.children[1] as HTMLElement;
      NumberOfRowsOptionsButtonElement.reapplyStyle(buttonArrow, numberOfRowsOptions, 'buttonArrow', cssState);
    }
  }

  private static createButtonArrow(pagination: PaginationInternal) {
    const arrow = document.createElement('div');
    arrow.id = NumberOfRowsOptionsButtonElement.ARROW_ID;
    arrow.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    if (Browser.IS_FIREFOX) {
      arrow.style.transform = 'translateY(-8%) scaleX(1.4)';
      arrow.style.fontSize = '14px';
      arrow.style.marginLeft = '5px';
    } else {
      arrow.style.transform = 'translateY(-16%)';
      arrow.style.fontSize = '15px';
      arrow.style.marginLeft = '4px';
    }
    Object.assign(arrow.style, pagination.style.numberOfRowsOptions?.buttonText?.default);
    arrow.innerHTML = '&#8964';
    return arrow;
  }

  public static updateButtonText(optionsButton: HTMLElement, numberOfRows: string) {
    const text = optionsButton.children[0] as HTMLElement;
    text.innerText = numberOfRows;
  }

  private static createButtonText(pagination: PaginationInternal) {
    const {isAllRowsOptionSelected, numberOfRowsOptionsItemText, numberOfRows, style} = pagination;
    const text = document.createElement('div');
    text.id = NumberOfRowsOptionsButtonElement.TEXT_ID;
    text.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    Object.assign(text.style, style.numberOfRowsOptions?.buttonText?.default);
    text.innerText = isAllRowsOptionSelected ? numberOfRowsOptionsItemText[0] : String(numberOfRows);
    return text;
  }

  private static createOptionsButton(pagination: PaginationInternal) {
    const optionsButton = document.createElement('div');
    optionsButton.id = NumberOfRowsOptionsButtonElement.BUTTON_ID;
    optionsButton.style.padding = Browser.IS_CHROMIUM ? '1px 5px' : '1px 6px';
    Object.assign(optionsButton.style, pagination.style.numberOfRowsOptions?.button?.default);
    return optionsButton;
  }

  public static create(etc: EditableTableComponent) {
    const optionsButton = NumberOfRowsOptionsButtonElement.createOptionsButton(etc.paginationInternal);
    optionsButton.appendChild(NumberOfRowsOptionsButtonElement.createButtonText(etc.paginationInternal));
    optionsButton.appendChild(NumberOfRowsOptionsButtonElement.createButtonArrow(etc.paginationInternal));
    NumberOfRowsOptionsButtonEvents.setEvents(etc, optionsButton);
    return optionsButton;
  }
}
