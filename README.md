jsx-init
================

Synopsis
---------------

This tool helps creating project scaffolding for JSX.
JSX(http://jsx.github.io/) is a altJS programming language to achieve faster, safer code and make it easier.

This tool creates folders and copies following contents:

* package.json for npm
* README file
* License file
* Build setting file (Grunt)
* `.gitignore` file

Motivation
---------------

This tool accelerates to jump in JSX programming. You can start programming, testing, building
by using generated settings.

Installation
---------------

You can install jsx-init by using npm command:

```sh
$ npm install jsx-init
```

You can install to global too.

```sh
$ npm install -g jsx-init
```

Usage
---------------

Run the following command in your working folder:

```sh
$ mkdir awesomeproject
$ cde awesomeproject
$ jsx-init
```

There are no options. jsx-init asks you some questions like license, repository and so on.

Before running command, creating repository on github or bitbucket is prefered.

### Templates

* `jsx-lib`: Library for JSX code.
* `node-app`: node.js cli application.

How to develop in the generated project
--------------------------------------------

Add source files under the `lib` folder and `src` folder and add tests under the `test` folder.
`lib` folder is for library files and `src` folder is for executable source files.
Reusable modules should be in `lib` folder.

You can run test by using prove command:

```sh
# Run test (-v shows detail error information)
$ grunt test
```

Following default Grunt commands are available:

```sh
# Generate API reference
$ grunt doc

# Build application or library for JS project
$ grunt build
```

If there are some needed modules, use `npm` command:

``sh
$ npm install <package> --save
``

Publish to github
--------------------

Before publishing, update synopsis and other descriptions to `README.md`.

After creating project repository on github, you can register files to repository like this:

```sh
$ git init
$ git add -a
$ git commit -m "first commit"
$ git remote add origin git@github.com:[your name]/[your project name].git
$ git push -u origin master
```

Publish to npm
------------------

Update `package.json` version string then type following command:

```sh
$ npm publish
```

Development jsx-init
-----------------------

## Repository

* Repository: git@github.com:shibukawa/jsx-init.git
* Issues: https://github.org/shibukawa/jsx-init/issues

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

* Yoshiki Shibukawa / yoshiki@shibu.jp

License
------------

MIT

Complete license is written in `LICENSE.md`.

Reference
--------------

* JSX: http://jsx.github.io/
* Grunt: http://gruntjs.com/
* Grunt-JSX: https://npmjs.org/package/grunt-jsx

Thanks
------------

*   JSX guys are cool guys! Thank you `@kazuho`, `@__gfx__`, `@wasabiz`!

*   grunt-jsx simplify grunt setting file. Thank you `@yosuke_furukawa`!

*   README.md templates were created from following template:

    https://gist.github.com/jxson/1784669

*   MIT and GPLv2 license files are copied and modified from here:

    https://github.com/nevir/readable-licenses

*   Other licenses are copied and modifed from here:

    http://choosealicense.com/licenses/
