# simple-recursive-ui
SRUI is a simple UI framework for JavaScript that makes recursively locating your HTML elements a breeze. In theory, that is - note that this is a pre-alpha library.

# example
The file example.html illustrates how to use the library.

# gotchas
1. To specify an event handler, do not use arrow functions! You have to use the "function" keyword. Otherwise your code will probably not work.
2. TEXT_NODE objects cannot respond to onclick events. Use a PARAGRAPH object instead.
