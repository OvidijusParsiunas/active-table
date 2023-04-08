export class WebComponentStyleUtils {
  public static add(auxiliaryStyle: string, shadowRoot: ShadowRoot) {
    if (!shadowRoot || !auxiliaryStyle) return;
    try {
      WebComponentStyleUtils.addStyleSheet(auxiliaryStyle, shadowRoot);
    } catch (err) {
      // fallback for if CSSStyleSheet is not supported (Safari)
      WebComponentStyleUtils.addStyleElement(auxiliaryStyle, shadowRoot);
    }
  }

  private static addStyleSheet(style: string, shadowRoot: ShadowRoot) {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(style);
    shadowRoot.adoptedStyleSheets.push(styleSheet);
  }

  private static addStyleElement(style: string, shadowRoot: ShadowRoot) {
    const stylesDocument = document.createElement('style');
    stylesDocument.innerHTML = style;
    shadowRoot.appendChild(stylesDocument);
  }
}
