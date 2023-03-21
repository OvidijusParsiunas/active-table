<br />

<p align="center"> 
    <img style="margin-left: -15px" src="https://raw.githubusercontent.com/OvidijusParsiunas/active-table/HEAD/assets/readme/title.png" alt="Logo">
</p>

<b>Active Table</b> is a fully customizable web component built with a focus on delivering the best editable table experience possible. Whether you need a simple table or a complex real-time data visualization grid, this component can be tailored to suit your specific needs! Explore [activetable.io](https://activetable.io/) to view all of the available features, how to use them, examples and more!

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
- Overflow scrollbar
- Import/Export/Paste from CSV
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
<active-table content='[["Planet", "Diameter"], ["Earth", 12756]]'/>
```

The exact syntax for the above example will vary depending on the framework of your choice ([see here](https://activetable.io/examples/frameworks)).

### :dart: Roadmap

- [ ] Code refactoring (<b>In Progress</b>)
- [ ] Move row/column by dragging
- [ ] Pick mode
- [ ] Data filtering
- [ ] Unit tests
- [ ] Undo/Redo

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
