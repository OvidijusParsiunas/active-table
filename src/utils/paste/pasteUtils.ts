export class PasteUtils {
  private static readonly TEXT_DATA_FORMAT = 'text/plain';

  public static sanitizePastedTextContent(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    document.execCommand?.('insertHTML', false, text);
  }

  public static extractClipboardText(event: ClipboardEvent) {
    return JSON.stringify(event.clipboardData?.getData(PasteUtils.TEXT_DATA_FORMAT));
  }
}
