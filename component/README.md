<br />

<p align="center"> 
    <img style="margin-left: -15px" src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/assets/readme/title.png" alt="Logo">
</p>

<b>Active Table</b> is a fully customizable web component built with a focus on delivering the best editable table experience possible. Whether you need a simple table or a complex real-time data visualization grid, this component can be tailored to suit your specific needs! Explore [activetable.io](https://activetable.io/) to view all of the available features, how to use them, examples and more!

### :rocket: Main Features

- Add/Remove/Move/Edit rows/columns
- Text validation
- Sorting
- Pagination
- Filtering
- Column types: Text/Number/Currency/Select/Label/Date/Checkbox
- API for building custom column types
- Import/Export/Paste/Drag&Drop csv, xls, xlsx, ods, txt files
- Programmatic cell updates
- Reactive dimensions
- Overflow handling
- Everything is customizable!

### :computer: Getting started

```
npm install active-table
```

If using React, install the [following](https://www.npmjs.com/package/active-table-react) instead:

```
npm install active-table-react
```

Then simply add this to your markup:

```
<active-table data='[["Planet", "Diameter"], ["Earth", 12756]]'/>
```

The exact syntax for the above example will vary depending on the framework of your choice.

### :beginner: Examples

Check out the live codepen examples for your [UI framework/library](https://activetable.io/examples/frameworks) of choice:

| React                                                                                                                                                                                                                             | Vue 2                                                                                                                                                                                                                          | Vue 3                                                                                                                                                                                                                          | Angular                                                                                                                                                                                                                                              | Svelte                                                                                                                                                                                                                             | SvelteKit                                                                                                                                                                                                                                                     | Solid                                                                                                                                                                                                                                                    | Next                                                                                                                                                                                                                                                                                                                                                                           | VanillaJS                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a href="https://codesandbox.io/s/active-table-react-cstm7k?file=/src/App.tsx" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/reactLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vue2-32f04e?file=/src/App.vue" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vueLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vue3-z729vs?file=/src/App.vue" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vueLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-angular-9v8nfe?file=/src/app/app.component.html" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/angularLogo.png" width="66"/></a> | <a href="https://stackblitz.com/edit/vitejs-vite-cm6j23?file=src%2FApp.svelte" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/svelteLogo.png" width="45"/></a> | <div align="center"><a href="https://codesandbox.io/p/sandbox/active-table-sveltekit-forked-fy9wlf" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/svelteLogo.png" width="45"/></a></div> | <a href="https://codesandbox.io/p/sandbox/active-table-solidjs-wjg6h7?file=%2Fsrc%2FApp.tsx%3A41%2C5" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/solidLogo.png" width="60"/></a> | <a href="https://codesandbox.io/p/sandbox/deep-chat-nextjs-9pv25f?file=%2Fpackage.json%3A6%2C19&selection=%5B%7B%22endColumn%22%3A30%2C%22endLineNumber%22%3A28%2C%22startColumn%22%3A30%2C%22startLineNumber%22%3A28%7D%5D" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/nextLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vanillajs-62yrrj?file=/index.html" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vanillaJSLogo.png" width="60"/></a> |

### :dart: Roadmap

- [x] Support csv, xls, xlsx, ods, txt files
- [x] Data filtering
- [ ] Column visibility
- [ ] Move row/column by dragging
- [ ] Procedural pagination rendering
- [ ] Pick mode
- [ ] Undo/Redo
- [ ] Code refactoring
- [ ] Unit tests

## :construction_worker: Local setup

```
# Install node dependencies:
$ npm install

# Build the component:
$ npm run build

# Automatically build the component as soon as you make a change:
$ npm run build:watch

# Serve the component locally (from index.html):
$ npm run serve

# Bundle the component into a single file (dist/activeTable.bundle.js):
$ npm run build:bundle
```

## :heart: Contributions

Open source is built by the community for the community. All contributions to this project are welcome!
<br> Additionally, if you have any suggestions for enhancements, ideas on how to take the project further or have discovered a bug, do not hesitate to create a new issue ticket and we will look into it as soon as possible!
