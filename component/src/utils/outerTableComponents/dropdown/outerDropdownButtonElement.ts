export class OuterDropdownButtonElement {
  // used to allow automatic control of button icon styling, buttons that do not have this have to control their styles
  public static readonly AUTO_STYLING = 'outer-container-button-auto-styling';

  private static readonly ACTIVE_BUTTON_ICON_CLASS = 'outer-container-icon-button-active';

  public static toggleIcon(button: HTMLElement) {
    const isActive = !!button.classList.contains(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
    if (isActive) {
      button.classList.remove(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
    } else {
      button.classList.add(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
    }
    return isActive;
  }
}
