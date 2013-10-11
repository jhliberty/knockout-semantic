var utils = require("../utils");
var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/dropdown.html");

module.exports = {
    init: function dropdownBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), obj = valueAccessor(), suppressUpdate;

        console.log("initiating dropdown");

        var updateSelection = function () {
            var selected = obj.selected;

            if ( suppressUpdate ) {
                suppressUpdate = false;
            } else {
                suppressUpdate = true;
                $el.find('.menu .item:contains(' + selected + ')').click();
            }
        };

        // watch for changes
        var selectedObservable = ko.getObservable(obj, 'selected');

        if ( selectedObservable == null ) {
            ko.track(obj);
            selectedObservable = ko.getObservable(obj, 'selected');
        }

        obj.defaultText = obj.defaultText || element.textContent || "";


        selectedObservable.subscribe(updateSelection);

        // apply the template
        element.innerHTML = template;

        var innerBindingContext = bindingContext.createChildContext({
            context: obj
        });

        // not sure if this is even possible with Knockout-ES5
        // but I suppose they could still use ko.observable(thingImPassingToModalParam)

        ko.applyBindingsToDescendants(innerBindingContext, element);
        // invoke immediately to get the initial selection
        updateSelection();

        $el.dropdown({
            onChange: function (value, text) {

                if ( suppressUpdate ) {
                    suppressUpdate = false;
                } else {
                    suppressUpdate = true;
                    obj.selected = text;
                }
            }
        });

        return { controlsDescendantBindings: true };
    },
    makeRealNode: function (node) {
        var dropdown, data = node.getAttribute("data");

        if ( !data ) {
            return {required: "data"};
        }
        console.log(data, utils.hashToBindingString({ toggle: data}));


        dropdown = document.createElement("div");

        dropdown.className = ["ui dropdown", node.className];

        dropdown.setAttribute("data-bind", utils.hashToBindingString({
            toggle: data,
            text: node.getAttribute("text")
        }));

        // Preserve the text node if one exists
        if ( node.childNodes[0] && node.childNodes[0].nodeType === Node.TEXT_NODE ) {
            dropdown.appendChild(node.childNodes[0]);
        }

        return dropdown;
    }
};
