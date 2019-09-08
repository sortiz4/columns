# Columns
Columns is a fast, simple, column-based layout implementation (for fixed width
elements) written in ECMAScript 6. This is a no-frills implementation and does
not include any animations or depend on any third-party library.

<p align="center">
    <img src="http://stevenortiz.me/static/github/columns.png">
</p>

## Usage

Add the GitHub URL to your dependencies in `project.json`.

```json
"columns": "sortiz4/columns"
```

Container heights and each child's offset will be modified. The user must
control the width of each child manually and should account for the size of the
gutter (media queries are the recommended approach).

```html
<div id="container">
    <div>1</div>
    <div>2</div>
    ...
    <div>n</div>
</div>
```

Import the class and create a new instance. `el` is the container and may be a
node or a CSS selector. `sizes` must be an array (see `Settings` for more
details).

```js
import Columns from 'columns';
const columns = new Columns(el, sizes);
```

Instances can be destroyed, detached, and reset by calling `destroy`, `detach`,
and `reset` respectively. `detach` removes the `resize` event listener from the
`window`. `reset` removes the style properties that were added to the container
and its children. `destroy` simply calls `reset` and `detach`.

## Settings

`sizes` must be an array of objects describing the layout. Each object contains
a number of `columns`, a `gutter` size in pixels, and a `min` size in pixels
(minimum window width). The first object is the default layout and does not
require a `min` property. Additional layouts are optional, but must be provided
in ascending order of `min`.

### Example

```js
const sizes = [{
    columns: 1,
    gutter: 20,
}, {
    min: 640,
    columns: 2,
    gutter: 25,
}, {
    min: 960,
    columns: 3,
    gutter: 30,
}];
```
