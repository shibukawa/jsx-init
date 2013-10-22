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

## Build

JSX codes are built into `dest` folder. open `index.html` in this folder.

```sh
$ grunt build
```

If you use Chrome, run local web server and access to the following URL:

```sh
$ grunt runserver
Running "connect:server" (connect) task
Waiting forever...
Started connect web server on 127.0.0.1:8080.
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
