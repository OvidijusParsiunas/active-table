import {TableContent} from '../../../types/tableContent';

export class ParseCSVClipboardText {
  private static readonly STRING_QUOTE_SYMBOL = '"';
  public static readonly TAB_SYMBOL = '\\t';
  public static readonly NEW_LINE_SYMBOL = '\\n';
  private static readonly EXPLICIT_TAB_SYMBOL = '\\\\t';
  private static readonly EXPLICIT_NEW_LINE_SYMBOL = '\\\\n';

  private static preprocessText(multiLineString: string): string {
    let newString = multiLineString;
    if (multiLineString.charAt(0) === ParseCSVClipboardText.STRING_QUOTE_SYMBOL) {
      newString = newString.substring(1);
    }
    if (multiLineString.charAt(multiLineString.length - 1) === ParseCSVClipboardText.STRING_QUOTE_SYMBOL) {
      newString = newString.substring(0, multiLineString.length - 2);
    }
    return newString;
  }

  private static getSeparatorSymbols(multiLineString: string): {newLine: string; tab: string} {
    // occurs when pasting string that contains actual \n or \t symbols
    if (
      multiLineString.indexOf(ParseCSVClipboardText.EXPLICIT_NEW_LINE_SYMBOL) > -1 ||
      multiLineString.indexOf(ParseCSVClipboardText.EXPLICIT_TAB_SYMBOL) > -1
    ) {
      return {newLine: ParseCSVClipboardText.EXPLICIT_NEW_LINE_SYMBOL, tab: ParseCSVClipboardText.EXPLICIT_TAB_SYMBOL};
    }
    return {newLine: ParseCSVClipboardText.NEW_LINE_SYMBOL, tab: ParseCSVClipboardText.TAB_SYMBOL};
  }

  public static parse(multiLineString: string): TableContent {
    const processedText = ParseCSVClipboardText.preprocessText(multiLineString);
    const {newLine, tab} = ParseCSVClipboardText.getSeparatorSymbols(processedText);
    const linesOfText: string[] = processedText.split(newLine);
    return linesOfText.map((lineOfText: string) => {
      // row indexes in worksheets end with \\t\\t\\t\\t\\t
      return lineOfText.split(tab);
    });
  }
}
