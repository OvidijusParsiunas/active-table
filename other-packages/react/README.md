<br />

<p align="center"> 
    <img style="margin-left: -15px" src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/assets/readme/title.png" alt="Logo">
</p>

<b>Active Table</b> is a fully customizable web component built with a focus on delivering the best editable table experience possible. Whether you need a simple table or a complex real-time data visualization grid, this component can be tailored to suit your specific needs! Explore [activetable.io](https://activetable.io/) to view all of the available features, how to use them, examples and more!

This package is an [Active Table](https://www.npmjs.com/package/active-table) component wrapper for [React](https://react.dev/).

### :rocket: Main Features

- Add/Remove/Move rows/columns
- Max rows/columns
- Index column
- Resizable column widths
- Striped rows
- Sorting
- Text validation
- Column types: Text/Number/Currency/Select/Label/Date/Checkbox
- API for building custom column types
- Programmatic cell updates
- Pagination
- Data filtering
- Overflow scrollbar
- Import/Export/Paste/Drag&Drop csv, xls, xlsx, ods, txt files
- Everything is customizable!

### :tada: Latest update: Drag & Drop

<p align="center"> 
    <img style="margin-left: -15px" width="70%" src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/assets/readme/drag-and-drop.gif" alt="drag-and-drop">
</p>

### :computer: Getting started

```
npm install active-table-react
```

Then simply add this to your markup:

```
<ActiveTable content={[["Planet", "Diameter"], ["Earth", 12756]]} />
```

Explore live examples for React and other frameworks [here](https://activetable.io/examples/frameworks).

### :dart: Roadmap

- [x] Support csv, xls, xlsx, ods, txt files
- [x] Data filtering
- [ ] Column visibility
- [ ] Move row/column by dragging
- [ ] Pick mode
- [ ] Undo/Redo
- [ ] Code refactoring
- [ ] Unit tests

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
