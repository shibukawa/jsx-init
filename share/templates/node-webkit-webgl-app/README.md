{{& OriginalName }}
===========================================

Synopsis
---------------

{{& description }}

Motivation
---------------

Write a short description of the motivation behind the creation and maintenance of the project.
This should explain why the project exists.

Installation
---------------

```sh
$ npm install {{& name}}
```

Usage
---------------

```sh
$ {{& filebasename }} [option] files...
```

### option

*   [sample] `-h`, `--help``

    Display help

Usage Sample
-------------------

### Show Help

```sh
$ {{& filebasename }} --help
```

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
# Build application
$ grunt build

# Generate API reference
$ grunt doc
```

Build task includes following task:

* Install needed npm package of client application (`appsrc/package.json`)
* Compile JSX source code and copy to `appsrc` folder.
* Download prebuild node-webkit modules if needed.
* Bake appsrc files into zip and create executable file. Resulting files are in `build/releases`.

## Edit source code

*   `src`

    It includes JSX source files.

*   `gruntfile.js`

    It includes `grunt-node-webkit-builder` setting.

*   `appsrc/package.json`

    It is an important file for the final application. It includes npm package name that are needed in runtime
    and node-webkit setting. Detail information is described in the [node-webkit's manifest format](https://github.com/rogerwang/node-webkit/wiki/Manifest-format)
    page.

*   `appsrc/`

    It includes assets (image, html, css etc) these are bundled with final application.

Author
---------

* {{& author }} / {{& mail }}

License
------------

{{& licensename }}

Complete license is written in `LICENSE.md`.
