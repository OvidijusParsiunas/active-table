import {EditableTableComponent} from '../editable-table-component.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('editable-table-component', () => {
  test('is defined', () => {
    const el = document.createElement('editable-table-component');
    assert.instanceOf(el, EditableTableComponent);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<editable-table-component></editable-table-component>`);
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
    const el = await fixture(html`<editable-table-component name="Test"></editable-table-component>`);
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
    const el = (await fixture(html`<editable-table-component></editable-table-component>`)) as EditableTableComponent;
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
    const el = (await fixture(html`<editable-table-component></editable-table-component>`)) as EditableTableComponent;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
