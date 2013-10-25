{{& OriginalName }}
===========================================

Synopsis
---------------

{{& description }}

Motivation
--------------------

Write a short description of the motivation behind the creation and maintenance of the project.
This should explain why the project exists.

Code Example
---------------

### WebWorker Code Sample

```js

import "js/web.jsx";
import "webworker.jsx";

class _Main
{
    static var counter = 0;
    static function main(argv : string[]) : void
    {
        // called when loading.
    }

    static function onmessage (event : MessageEvent) : void
    {
        switch (event.data as string)
        {
        case "start":
            self.setInterval(() -> {
                _Main.counter++;
                self.postMessage(_Main.counter);
            }, 1000);
            break;

        case "reset":
            _Main.counter = 0;
            break;
        }
    }
}
```

### Client Code Sample

```js
import "js/web.jsx";
import "timer.jsx";
import "console.jsx";

class _Main
{
    static function main (argv : string[]) : void
    {
        var worker = new Worker('src/sample.js');

        worker.onmessage = (event)-> {
            dom.document.write((event as MessageEvent).data as string + '<br/>');
        };

        worker.postMessage("start");

        Timer.setInterval(()->{
            console.log("reset");
            worker.postMessage("reset");
        }, 10000);
    }
}
```

Installation
---------------

```sh
$ npm install {{& name}}
```

JavaScript code is in `dest/src` folder.

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

## Repository

* Repository: {{& repository }}
* Issues: {{& issuetracker }}

## Setup build environment

To create development environment, call following command:

```sh
$ npm install
```

## Run Test

```sh
$ grunt test
```

## Run Sample

```sh
# Build web worker and sample client
$ grunt build

# Launch webserver
$ grunt connect
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
