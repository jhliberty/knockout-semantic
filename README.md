knockout-semantic
=================

knockoutjs and semantic-ui working together

### Warning: this plugin isn't complete yet

I'll release a v1.0.0 when I think it's ready to use.  Please help with development!

## Install

The easiest way to get Knockout-Semantic is to use bower.

```bash
bower install knockout-semantic
```

You can just download [knockout-semantic.js](http://brigand.github.io/knockout-semantic/build/knockout-semantic.js).
Either right click that link, and choose Save As, or download it on the command line.

    wget http://brigand.github.io/knockout-semantic/build/knockout-semantic.js

In your HTML, you need to link things in a the correct order (or use AMD).  Knockout
and Semantic are interchangable.

```html
<script src="jquery.js"></script>
<script src="knockout.js"></script>
<script src="semantic.js"></script>
<script src="knockout-semantic.js"></script>
```

## What is it?

It's a library of custom bindings that allow you to interact with Semantic-UI in a less
jQuery fashion.

Most components can be used in one of two ways.

 - manual/foreach
 - using our templates and a config option

For some elements, like checkboxes, and buttons, you can just use Knockout as you would normally
with value/click bindings.

There are templates included which aim to be the most common use of the components.  For example,
the modal allows you to set a title, a two-way observable representing the visibility
of the modal, and an array of buttons with functions attached to them.

For examples of everything go to the [main page](http://brigand.github.io/knockout-semantic/).

## Developing

### Getting Ready

Fork and clone the repository.  Download and install [node.js and npm](http://nodejs.org/download/).

Install grunt if you don't already have it (you may need to prefix this with `sudo`):

    npm install grunt-cli -g

In the project directory, install the dependencies:

    npm install

Try to build the project.  It'll automatically rebuild when you change any `.js` file in
the `src/` directory.

    grunt

### Bugs and Documentation

Bug fixes and doc changes can go straight into the gh-pages branch.
Go into the project directory, and do the following.

1. get the updated code
    -`git pull git@github.com:brigand/knockout-semantic.git gh-pages`
1. make your change
1. commit it with a descriptive name
1. in bower.json and package.json, increment the bugfix number
   - if it's 1.2.3, make it 1.2.4; if it's 1.2.9 make it 1.2.10
1. `git push origin gh-pages`
1. send a pull request on github

## New or Changed Functions

If you're changing functionality at all, you need to create a new branch.  Assuming you're
in the project directory on gh-pages...

1. get the updated code
    -`git pull git@github.com:brigand/knockout-semantic.git gh-pages`
1. `git checkout -b feature-something`
1. make your change(s)
1. **don't** change the version numbers
1. commit each **related** change individually; be descriptive
1. `git push origin gh-pages`
1. send a pull request on github

Feature changes may take a while to be accepted, because they require a minor-version
update.

---

Make sure to add your name to the copyright list when you contribute!

## License

The MIT License (MIT)

Copyright (c) 2013 Frankie Bagnardi (brigand)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
