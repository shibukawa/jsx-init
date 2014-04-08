jsx-init
================

Synopsis
---------------

This tool helps to create project scaffolding for [JSX](http://jsx.github.io).
JSX is an altJS programming language to achieve faster, safer code more easily.

This tool creates folders and copies the following contents:

*   package.json

    Setting file for npm (Node Package Manager)

*   README file
*   License file
*   Build settings file for [Grunt](http://gruntjs.com/)
*   `.gitignore` file
*   `.npmignore` file
*   `.travis.yml` file to run test on [travis-ci](https://travis-ci.org/) (optional)

In addition to the above files, the generated folder includes an application source file, a library source file, a test code file and so on. They depend on the project type you select.

Motivation
---------------

This tool accelerates the start of JSX programming. You can begin programming, testing, building
by using the generated settings quickly.

Installation
---------------

You can install jsx-init by using npm command:

```sh
$ npm install jsx-init
```

You can install globally, too.

```sh
$ npm install -g jsx-init
```

Usage
---------------

Run the following command in your working folder:

```sh
$ mkdir awesomeproject
$ cd awesomeproject
$ jsx-init
```

There are no options. jsx-init asks you some questions like license, repository and so on.

Before running command, creating repository on github or bitbucket is prefered.

### Templates

* `js-lib` : Library for JS environment (common.js, AMD, Closure, etc). It can be used from JSX too.
* `jsx-lib`: Library for JSX code.
* `node-app`: node.js cli application.
* `node-webkit-app`: node-webkit GUI application.
* `node-webkit-webgl-app`: WebGL GUI application.
* `web-canvas-app`: HTML5 Canvas application.
* `sencha-touch-app`: Sencha Touch application. You should download [Sencha Touch SDK](http://www.sencha.com/products/touch) first (experimental).
* `webworker`: WebWorker program.

The following templates are under planning:

* `node-express`
* `chromeapps`
* `chromeapps-ext.js`
* `web-ext.js`
* `web-webgl`
* `jsfl` and so on.

### Licenses

* Apache License v2.0
* The Artistic License v2.0
* Simplified BSD License (BSD 2-clause)
* Modified BSD License (BSD 3-clause)
* Eclipse Public License (EPL) v1.0
* GNU Affero General Public License (AGPL) v3.0
* GNU Free Documentation License (FDL) v1.3
* GNU General Public License (GPL) v1.0
* GNU General Public License (GPL) v2.0
* GNU General Public License (GPL) v3.0
* GNU Lesser General Public License (LGPL) v2.1
* GNU Lesser General Public License (LGPL) v3.0
* The MIT License (MIT)
* Mozilla Public License (MPL) v2.0
* The Unlicense (Public Domain)

How to develop within the generated project
----------------------------------------------

Before doing something, type the following command to install build tools (JSX compiler, Grunt task runner, grunt-jsx):

```sh
$ npm install
```

Add source files under the `lib` folder and `src` folder and add tests under the `test` folder.
`lib` folder is for library files and `src` folder is for executable source files.
Reusable modules should be in the `lib` folder.

You can run tests by using the following command:

```sh
# Run test (-v shows detail error information)
$ grunt test
```

The following default Grunt commands are available:

```sh
# Generate API reference
$ grunt doc

# Build application or library for JS project
$ grunt build
```

Some templates (`web-canvas-app` and `sencha-touch-app`) includes setting to run local web server.
You can run your application on Google Chrome, that can't allow access to local file directly:

```
$ grunt connect
Running "connect:server" (connect) task
Waiting forever...
Started connect web server on 127.0.0.1:8080.
```

If there are some additional packages needed, use `npm` command:

``sh
# Needed package for runtime
$ npm install <package> --save
# Needed package for development
$ npm install <package> --save-dev
``

If you use any JSX library to wrap an exisiting JS library, JS library should be installed with `--save` option.
All JSX libraries should be installed with `--save-dev` option.

Publish to github
--------------------

Before publishing, update synopsis and other descriptions to `README.md`.

After creating the project repository on github, you can register files to the repository like this:

```sh
$ git init
$ git add -a
$ git commit -m "first commit"
$ git remote add origin git@github.com:[your name]/[your project name].git
$ git push -u origin master
```

Publish to npm
------------------

Update `package.json` version string then type the following command:

```sh
$ npm publish
```

### For Applications

Run `grunt build` before publishing.

### For JSX Libraries

Run `grunt doc` before publishing

### For JS Libraries

Run `grunt doc` before publishing

Development jsx-init
-----------------------

## Repository

* Repository: git@github.com:shibukawa/jsx-init.git
* Issues: https://github.org/shibukawa/jsx-init/issues

```sh
# Run test
$ grunt test
# Build jsx-init command
$ grunt build
```

Author
---------

* Yoshiki Shibukawa / yoshiki@shibu.jp

License
------------

This code is licensed under MIT.

Complete license is written in `LICENSE.md`.

### Exception

`sencha-touch-app/dest` folder contains many content generated by `sencha-cmd`. Use these content only for Sencha Touch application.

Reference
--------------

* JSX: http://jsx.github.io/
* Grunt: http://gruntjs.com/
* Grunt-JSX: https://npmjs.org/package/grunt-jsx

Thanks
------------

*   JSX guys are cool guys! Thank you `@kazuho`, `@__gfx__`, `@wasabiz`! And `web-canvas-app` sample is based on `@__gfx__`'s Danmaku application.

*   grunt-jsx simplifies grunt setting file. Thank you `@yosuke_furukawa`!

*   README.md templates were created from the following template:

    https://gist.github.com/jxson/1784669

*   Now, all license files are came from Andreas Renberg (IQAndreas)'s [markdown-licenses](https://github.com/IQAndreas/markdown-licenses).
