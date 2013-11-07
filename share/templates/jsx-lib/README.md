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

```js
import "{{& filebasename }}.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // Write simple usage here!
    }
}
```

Installation
---------------

```sh
$ npm install {{& name}}
```

If you want to use this library from other project, install like the following:

```sh
$ npm install {{& name}} --save-dev
```

or add like these lines to your parent project's `package.json`:

```js
   devDependencies: {
       "{{& name }}": "~0.1.0"
   },
   peerDepenencies: {
       "{{& name }}": "~0.1.0"
   }
```

And add `node_modules/{{& name }}/src` as a search path.

API Reference
------------------

Write reference here!

Development
-------------

## Repository

* Repository: {{& repository }}
* Issues: {{& issuetracker }}

## Run Test

```sh
$ grunt test
```

## Build Sample

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
