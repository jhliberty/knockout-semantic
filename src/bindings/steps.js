var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/steps.html");

var utils = require("../utils");

var binding = {
    'init': function stepsBingindInit(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var obj = valueAccessor(), $el = $(element);

        // if we've already applied bindings, we need to clean up first
        ko.cleanNode(element);

        // load our module template
        element.innerHTML = template;

        var innerBindingContext = bindingContext.createChildContext(obj);

        // not sure if this is even possible with Knockout-ES5
        // but I suppose they could still use ko.observable(thingImPassingToModalParam)
        ko.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    },
    makeRealNode: function (node, attributes) {
        var steps, data = node.getAttribute("data");

        if ( !data ) {
            return {required: "data"};
        }

        steps = document.createElement("div");

        steps.className = "ui steps";

        steps.setAttribute("data-bind", utils.hashToBindingString({
            steps: data
        }));

        if ( node.childNodes[0] && node.childNodes[0].nodeType === Node.TEXT_NODE ) {
            steps.appendChild(node.childNodes[0]);
        }

        return steps;
    }

};

module.exports = binding;