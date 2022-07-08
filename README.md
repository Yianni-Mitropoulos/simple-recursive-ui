# simple-recursive-ui
SRUI is a simple UI framework for JavaScript that makes recursively locating your HTML elements a breeze. Each node in your UI keeps track of its SRUI_parent, its SRUI_children, and its SRUI_properUndernodes. The latter is a dictionary of nodes strictly below the current node that have been given an SRUI_name for ease of access.

# example
The file example.html illustrates how to use the library.

# common gotchas
1. To specify an event handler, you have to use the "function" keyword. Do not use arrow functions, or your code will probably not work.
2. TEXT_NODE objects cannot respond to onclick events. Use a PARAGRAPH object instead.
3. Giving a "finalize" parameter to the BODY element currently doesn't work, due to the overall dodginess of the current implementation.