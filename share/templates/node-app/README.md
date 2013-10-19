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

Don't afraid [JSX](http://jsx.github.io)! If you have an experience of JavaScript, you can learn JSX
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
# Build application or library for JS project
$ grunt build

# Generate API reference
$ grunt doc

```

Author
---------

* {{& author }} / {{& mail }}

License
------------

{{& licensename }}

Complete license is written in `LICENSE.md`.
