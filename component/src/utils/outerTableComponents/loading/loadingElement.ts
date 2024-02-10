import {OuterContainerElements} from '../outerContainerElements';
import {LoadingStyles} from '../../../types/loadingStyles';
import {GenericObject} from '../../../types/genericObject';
import {TableStyle} from '../../../types/tableStyle';
import {CSSStyle} from '../../../types/cssStyle';
import {ActiveTable} from '../../../activeTable';

export class LoadingElement {
  private static readonly DEFAULT_LOADING_CONTAINER_CLASS = 'default-loading-container';

  private static createSpinner(spinnerStyle?: CSSStyle) {
    const spinnerElement = document.createElement('span');
    spinnerElement.className = 'loading-spinner';
    Object.assign(spinnerElement.style, spinnerStyle);
    return spinnerElement;
  }

  private static applyTableStyles(styles: (keyof CSSStyleDeclaration)[], tStyle: TableStyle, loadingElement: HTMLElement) {
    styles.forEach((style) => {
      if (tStyle[style]) {
        (loadingElement.style as unknown as GenericObject)[style as string] = tStyle[style] as string;
      }
    });
  }

  private static removeTableStyles(styles: (keyof CSSStyleDeclaration)[], loadingElement: HTMLElement) {
    styles.forEach((style) => {
      delete (loadingElement.style as unknown as GenericObject)[style as string];
    });
  }

  private static processCustom(element: HTMLElement, loadingStyles?: LoadingStyles) {
    if (element.style.display === 'none') element.style.display = 'block';
    Object.assign(element.style, loadingStyles?.container);
    return element;
  }

  // prettier-ignore
  private static createContainer(loadingStyles?: LoadingStyles, tableStyle?: TableStyle) {
    const containerElement = document.createElement('div');
    if (tableStyle) {
      LoadingElement.applyTableStyles(
        ['width', 'minWidth', 'maxHeight', 'height', 'minHeight', 'maxHeight', 'border', 'borderColor', 'borderWidth'],
        tableStyle, containerElement);
    }
    Object.assign(containerElement.style, loadingStyles?.container);
    return containerElement;
  }

  private static createNew(loadingStyles?: LoadingStyles, tableStyle?: TableStyle) {
    const containerElement = LoadingElement.createContainer(loadingStyles, tableStyle);
    containerElement.classList.add(LoadingElement.DEFAULT_LOADING_CONTAINER_CLASS);
    const spinnerElement = LoadingElement.createSpinner(loadingStyles?.spinner);
    containerElement.appendChild(spinnerElement);
    return containerElement;
  }

  private static processInitial(at: ActiveTable) {
    const {loadingStyles, tableStyle} = at;
    const childElement = at.children[0] as HTMLElement;
    return childElement
      ? LoadingElement.processCustom(childElement, loadingStyles)
      : LoadingElement.createNew(loadingStyles, tableStyle);
  }

  public static addInitial(at: ActiveTable) {
    at._activeOverlayElements.loading = LoadingElement.processInitial(at);
    at.shadowRoot?.appendChild(at._activeOverlayElements.loading);
  }

  private static update(loadingElement: HTMLElement, tableStyle?: TableStyle, loadingStyles?: LoadingStyles) {
    if (loadingElement.classList.contains(LoadingElement.DEFAULT_LOADING_CONTAINER_CLASS) && tableStyle) {
      LoadingElement.removeTableStyles(
        ['width', 'minWidth', 'maxHeight', 'height', 'minHeight', 'maxHeight', 'border', 'borderColor', 'borderWidth'],
        loadingElement
      );
      Object.assign(loadingElement.style, loadingStyles?.container);
    }
    if (loadingStyles?.loadingBackgroundColor) {
      loadingElement.style.backgroundColor = loadingStyles?.loadingBackgroundColor;
    }
  }

  public static addActive(at: ActiveTable) {
    const {loading} = at._activeOverlayElements;
    if (!loading) return;
    // this is also used to only update the styling once
    if (!loading.classList.contains(OuterContainerElements.ABSOULUTE_FULL_TABLE_CLASS)) {
      loading.classList.add(OuterContainerElements.ABSOULUTE_FULL_TABLE_CLASS);
      LoadingElement.update(loading, at.tableStyle, at.loadingStyles);
    }
    at._tableElementRef?.appendChild(loading);
  }
}
