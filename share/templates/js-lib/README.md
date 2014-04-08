{{& OriginalName }}
===========================================

Synopsis
---------------

{{& description }}

Motivation
---------------

Write a short description of the motivation behind the creation and maintenance of the project.
This should explain why the project exists.

Code Example
---------------

### Use from JSX

```js
import "{{& filebasename }}.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // Write simple usage here!
    }
}
```

### Use from node.js

```js
var {{& name }} = require('{{& filebasename }}.common.js').{{& filebasename }};

// Write simple usage here!
```

### Use from require.js

```js
// use {{& filebasename }}.amd.js
define(['{{& filebasename }}'], function ({{& filebasename }}) {

    // Write simple usage here!
});
```

### Use via standard JSX function

```html
<script src="{{& filebasename }}.js" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var classObj = JSX.require("src/{{& filebasename }}.js").{{& filebasename }};
    var obj = new classObj();
});
</script>
```

### Use via global variables

```html
<script src="{{& filebasename }}.global.js" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var obj = new {{& filebasename }}();
});
</script>
```

Installation
---------------

```sh
$ npm install {{& name }}
```

If you want to use this library from other JSX project, install like the following:

```sh
$ npm install {{& name}} --save-dev
```

API Reference
------------------

Write reference here!

Development
-------------

## JSX

Don't be afraid [JSX](http://jsx.github.io)! If you have an experience of JavaScript, you can learn JSX
quickly.

* Static type system and unified class syntax.
* All variables and methods belong to class.
* JSX includes optimizer. You don't have to write tricky unreadalbe code for speed.
* You can use almost all JavaScript API as you know. Some functions become static class functions. See [reference](http://jsx.github.io/doc/stdlibref.html).

## Setup

To create development environment, call following command:

```sh
$ npm install
```

## Repository

* Repository: {{& repository }}
* Issues: {{& issuetracker }}

## Run Test

```sh
$ grunt test
```

## Build

```sh
$ grunt build
```

## Generate API reference

```sh
$ grunt doc
```

Author
---------

* {{& author }} / {{& mail }}

License
------------

{{& licensename }}

Complete license is written in `LICENSE.md`.
