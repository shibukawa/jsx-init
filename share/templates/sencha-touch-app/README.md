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

## Build and run

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
