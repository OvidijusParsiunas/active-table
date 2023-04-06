export class WebComponentStyleUtils {
  public static apply(additionalStyle: string, shadowRoot: ShadowRoot) {
    if (!shadowRoot || !additionalStyle) return;
    try {
      WebComponentStyleUtils.applyStyleSheet(additionalStyle, shadowRoot);
    } catch (err) {
      // fallback for if CSSStyleSheet is not supported (Safari)
      WebComponentStyleUtils.addStyleElement(additionalStyle, shadowRoot);
    }
  }

  private static applyStyleSheet(style: string, shadowRoot: ShadowRoot) {
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
