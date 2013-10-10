var config = require("./config");

/* --- Namespace binding provider ---
 Allows <namespace:bindingHandler data="foo" /> to be replaced by
  a bindngHandler which implements makeRealNode

  simple example:

  ko.bindingHandlers.text.makeRealNode = function (node, attributes) {
      data = node.getAttribute("data");

      if (!data) {
        return {required: "data"};
      }

      var textElement = document.createElement("span");
      textElement.setAttribute("data-bind", "text: " + data);
      return textElement;
  }

  if the namespace is "ko", then this element
    <ko:text data="foo" />
  would become
    <span data-bind="text: foo" />

  actual cases will usually be more complicated
 */

var NamespaceBindingProvider = function() {
    this.constructor = NamespaceBindingProvider;

    this.preprocessNode = function(node) {
        // first, let's get out of here if we don't have a node with a tagName
        if (!node.tagName) return;

        // e.g. if config.namespace is "KO-", namespace is "ko-"
        // if config.namespace is falsy, namespace is ""
        var tagName = node.tagName.toLowerCase(),
            namespace = config.namespace ? config.namespace.toLowerCase() : "";

        if (node.nodeType === Node.ELEMENT_NODE && tagName.indexOf(namespace) === 0) {
            var bindingName = namespace ? tagName.split(namespace)[1] : tagName;

            // if there's a binding with the correct name
            if (ko.bindingHandlers[bindingName] && ko.bindingHandlers[bindingName].makeRealNode) {
                result = ko.bindingHandlers[bindingName].makeRealNode(node);
            }

            // they tried to use an element which is now just sitting in the dom
            // we should warn developers about this...
            else {
                window.console && console.log("WARNING: no binding handler " + tagName +
                    " which implements makeRealNode.  Fix this!");
                return;
            }

            if (result && result.constructor.name === "Object" && result.required) {

            }

            // did they return a node?  sweet! insert it into the DOM
            else if (result && result.nodeType) {
                node.parentNode.insertBefore(result, node);
                node.parentNode.removeChild(node);
                return result;
            }
        }
    };
};

var bpInstance = ko.bindingProvider.instance;

bpInstance.others = bpInstance.others || [];

// did someone go ahead and stick themselves in the preprocessNode function?
if (typeof bpInstance.preprocessNode === "function"
    && !bpInstance.preprocessNode._thisIsTheRightOne) {
    bpInstance.others.push(
        bpInstance.preprocessNode.bind(bpInstance)
    );
}

/**
 * calls all other node preprocessors
 * @param {HTMLElement} node the node to process
 */
bpInstance.preprocessNode = function(node) {
    var result;

    ko.utils.arrayForEach(bpInstance.others, function(callback){
        result = callback(node);

        // if they explicitly return false, don't do any more processing on this node
        if (result === false) {
            return false;
        }

        // if they return a node, that's the new node we're working with
        else if (result && result.nodeType) {
            node = result;
        }

        // otherwise do nothing special, the same node will be used in the next preprocessor
    });
}

// set a flag so it's not set again
bpInstance.preprocessNode._thisIsTheRightOne = true;

NamespaceBindingProvider.prototype = bpInstance;

var nsProvider = new NamespaceBindingProvider();
bpInstance.others.push(nsProvider.preprocessNode.bind(nsProvider));