# simple-recursive-ui
SRUI is a simple UI framework for JavaScript that does two things:

(a) It overrides standard CSS position rules, so you can place your HTML elements with ease.
(b) It supports efficient lookup of nearby HTML elements by name. This makes handling click events (etc.) a breeze.

# common gotchas
1. Your top-level node must begin with the instruction ["setTagName", "body"], or your code probably won't do anything.
2. Components only accept ["setTagName", name] instructions as their first argument, or not at all. This will change in future versions.
3. To specify an event handler, you should use the "function" keyword. If you use an arrow function instead, your code will probably not work.