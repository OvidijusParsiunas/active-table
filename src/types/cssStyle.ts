export type CSSStyle = Partial<CSSStyleDeclaration>;

export interface StatefulCSSS<T = CSSStyle> {
  default?: T;
  hover?: T;
  click?: T;
}
