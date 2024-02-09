import {ActiveOverlayElements} from '../../../types/activeOverlayElements';
import {LoadingStyles} from '../../../types/loadingStyles';
import {GenericObject} from '../../../types/genericObject';
import {TableStyle} from '../../../types/tableStyle';
import {CSSStyle} from '../../../types/cssStyle';
import {ActiveTable} from '../../../activeTable';

export class LoadingElement {
  public static get(overlayElements: ActiveOverlayElements) {
    const {loadingDefault, loadingCustom} = overlayElements;
    return loadingCustom || loadingDefault;
  }

  private static createSpinner(spinnerStyle?: CSSStyle) {
    const spinnerElement = document.createElement('span');
    spinnerElement.className = 'loading';
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

  private static processCustom(element: HTMLElement, overlays: ActiveOverlayElements, loadingStyles?: LoadingStyles) {
    if (element.style.display === 'none') element.style.display = 'block';
    Object.assign(element.style, loadingStyles?.container);
    overlays.loadingCustom = element;
    return overlays.loadingCustom;
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
    containerElement.className = 'loading-container';
    const spinnerElement = LoadingElement.createSpinner(loadingStyles?.spinner);
    containerElement.appendChild(spinnerElement);
    return containerElement;
  }

  private static processInitial(at: ActiveTable) {
    const {loadingStyles, tableStyle, _activeOverlayElements} = at;
    const childElement = at.children[0] as HTMLElement;
    _activeOverlayElements.loadingDefault = childElement
      ? LoadingElement.processCustom(childElement, _activeOverlayElements, loadingStyles)
      : LoadingElement.createNew(loadingStyles, tableStyle);
    return _activeOverlayElements.loadingDefault;
  }

  public static addInitial(at: ActiveTable) {
    const initialLoadingElement = LoadingElement.processInitial(at);
    at.shadowRoot?.appendChild(initialLoadingElement);
  }

  private static update(overlayEls: ActiveOverlayElements, tableStyle?: TableStyle, loadingStyles?: LoadingStyles) {
    const element = LoadingElement.get(overlayEls) as HTMLElement;
    const {loadingDefault} = overlayEls;
    if (loadingDefault && tableStyle) {
      LoadingElement.removeTableStyles(
        ['width', 'minWidth', 'maxHeight', 'height', 'minHeight', 'maxHeight', 'border', 'borderColor', 'borderWidth'],
        loadingDefault
      );
      Object.assign(loadingDefault.style, loadingStyles?.container);
    }
    if (loadingStyles?.loadingBackgroundColor) {
      element.style.backgroundColor = loadingStyles?.loadingBackgroundColor;
    }
  }

  public static addActive(at: ActiveTable) {
    const element = LoadingElement.get(at._activeOverlayElements) as HTMLElement;
    if (!element.classList.contains('loading-container-absolute')) {
      element.classList.add('loading-container-absolute');
      LoadingElement.update(at._activeOverlayElements, at.tableStyle, at.loadingStyles);
    }
    at._tableElementRef?.appendChild(element);
  }
}
