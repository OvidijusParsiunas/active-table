<br />

<p align="center"> 
    <img style="margin-left: -15px" src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/assets/readme/title.png" alt="Logo">
</p>

<b>Active Table</b> is a fully customizable web component built with a focus on delivering the best editable table experience possible. Whether you need a simple table or a complex real-time data visualization grid, this component can be tailored to suit your specific needs! Explore [activetable.io](https://activetable.io/) to view all of the available features, how to use them, examples and more!

This package is an [Active Table](https://www.npmjs.com/package/active-table) component wrapper for [React](https://react.dev/).

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

### :tada: Latest update

Table [columns](https://activetable.io/docs/column#dragColumns) and [rows](https://activetable.io/docs/row#dragRows) can now be dragged using your mouse:

<p align="center">
    <img width="650" src="https://github.com/OvidijusParsiunas/active-table/assets/18709577/22095883-8beb-4be6-a75a-61beab3d6ea7" alt="Drag Feature">
</p>

### :computer: Getting started

```
npm install active-table-react
```

Then simply add this to your markup:

```
<ActiveTable data={[["Planet", "Diameter"], ["Earth", 12756]]} />
```

### :beginner: Examples

Check out the live codepen examples for your [UI framework/library](https://activetable.io/examples/frameworks) of choice:

| React                                                                                                                                                                                                                              | Vue 2                                                                                                                                                                                                                          | Vue 3                                                                                                                                                                                                                          | Angular                                                                                                                                                                                                                                              | Svelte                                                                                                                                                                                                                             | SvelteKit                                                                                                                                                                                                                                                     | Solid                                                                                                                                                                                                                        | Next                                                                                                                                                                                                                                                                                                                                                                           | VanillaJS                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a href="https://stackblitz.com/edit/deep-chat-react-bjtflv?file=src%2FApp.tsx" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/reactLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vue2-32f04e?file=/src/App.vue" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vueLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vue3-z729vs?file=/src/App.vue" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vueLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-angular-9v8nfe?file=/src/app/app.component.html" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/angularLogo.png" width="66"/></a> | <a href="https://stackblitz.com/edit/vitejs-vite-cm6j23?file=src%2FApp.svelte" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/svelteLogo.png" width="45"/></a> | <div align="center"><a href="https://codesandbox.io/p/sandbox/active-table-sveltekit-forked-fy9wlf" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/svelteLogo.png" width="45"/></a></div> | <a href="https://codesandbox.io/p/devbox/deep-chat-solidjs-forked-ngxphz" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/solidLogo.png" width="60"/></a> | <a href="https://codesandbox.io/p/sandbox/deep-chat-nextjs-9pv25f?file=%2Fpackage.json%3A6%2C19&selection=%5B%7B%22endColumn%22%3A30%2C%22endLineNumber%22%3A28%2C%22startColumn%22%3A30%2C%22startLineNumber%22%3A28%7D%5D" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/nextLogo.png" width="60"/></a> | <a href="https://codesandbox.io/s/active-table-vanillajs-62yrrj?file=/index.html" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/website/static/img/vanillaJSLogo.png" width="60"/></a> |

## :construction_worker: Local setup

```
# Install node dependencies:
$ npm install

# Build the wrapper:
$ npm run build
```

If you wish to edit the component functionality, please see the core [Active Table](https://www.npmjs.com/package/active-table) package and import your forked package into this component as has been done for `active-table`.

## :heart: Contributions

Open source is built by the community for the community. All contributions to this project are welcome!
<br> Additionally, if you have any suggestions for enhancements, ideas on how to take the project further or have discovered a bug, do not hesitate to create a new issue ticket and we will look into it as soon as possible!
