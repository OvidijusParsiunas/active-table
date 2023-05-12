export class GoogleFont {
  public static appendStyleSheetToHead() {
    const head = document.getElementsByTagName('head')[0];
    const linkExists = Array.from(head.getElementsByTagName('link')).some(
      (link) =>
        link.getAttribute('href') === 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap'
    );
    if (!linkExists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap';
      head.appendChild(link);
    }
  }
}
