# simple-recursive-ui
SRUI is a simple UI framework for JavaScript that makes recursively locating your HTML elements a breeze.

# how it works
Each node in your UI keeps track of its SRUI_parent and its SRUI_children, resulting in a doubly-linked tree that can easily be traversed when event handlers fire. Additionally, each node stores a dictionary (called SRUI_properUndernodes) whose keys are names and whose values are lists of nodes lower in the tree baring that name. This makes it easy for event handlers to find the nearest node in the tree with a given name. Indeed, you can just call use myNode.SRUI_getNearestNode("anotherNode") to recursively search near myNode for the nearest node called "anotherNode". In more detail, calling myNode.SRUI_getNearestNode("anotherNode") has the effect of first searching for "anotherNode" in the SRUI_properUndernodes of myNode. If nothing is found, it searches for "anotherNode" in the SRUI_properUndernodes of myNode.SRUI_parent, and then myNode.SRUI_parent.SRUI_parent, etc.

# example
SRUI is heavily JavaScript-oriented. Hence, although the file example.html illustrates how to use the library, the majority of the code is to be found in examples.js.

# margination
The margination of a node controls the marginTop and marginBottom values of its child nodes. Calling the SRUI_setMargination method will automatically override these, and this process proceeds recursively through your tree. This process can be blocked by setting the SRUI_blockMargination property to true on the blocking node. There's two main reasons you might want to do this process. Firstly, if you're creating a component in which you want to control the topMargin and bottomMargin of the child nodes manually, you'll once again need to block this process. Secondly, if your nodes are arranged horizontally and not just vertically, you'll need to block the margination process, or things will end up looking very strange. Note that the HORIZONTAL_DIV component automatically carries the SRUI_blockMargination=true attribute.

# common gotchas
1. To specify an event handler, you have to use the "function" keyword. If you use an arrow function instead, your code will probably not work.
2. Keep in mind that TEXT objects cannot respond to click events. Use a PARAGRAPH object instead.
3. The SRUI_appendChild method works OK, but the SRUI_prependChild hasn't been implemented properly.