import {fixture, assert} from '@open-wc/testing';
import {ActiveTable} from '../activeTable.js';
import {html} from 'lit/static-html.js';
import {suite, test} from 'mocha';

// active table currently holds no tests, but this is kept here in-case they will be added in the future

suite('active-table tests', () => {
  test('is defined', () => {
    const el = document.createElement('active-table');
    assert.instanceOf(el, ActiveTable);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<active-table></active-table>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<active-table name="Test"></active-table>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = (await fixture(html`<active-table></active-table>`)) as ActiveTable;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });

  test('styling applied', async () => {
    const el = (await fixture(html`<active-table></active-table>`)) as ActiveTable;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
