var utils = require("../utils");
var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/dropdown.html");

module.exports = {
    init: function dropdownBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), suppressUpdate;

        var obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData),
            selectedObservable = utils.getBindingObservable('selected', obs());

        var updateSelection = function () {
            var selected = selectedObservable();

            if (suppressUpdate) {
                suppressUpdate = false;
            } else {
                suppressUpdate = true;
                $el.find('.menu .item:contains(' + selected + ')').click();
            }
        };

        // watch for changes
        console.log(selectedObservable, selectedObservable());

        var obj = obs();
        obj.defaultText = obj.defaultText || element.textContent || "";


        selectedObservable.subscribe(updateSelection);

        // apply the template
        if (element.childNodes.length === 0) {
            element.innerHTML = template;
        }

        var innerBindingContext = bindingContext.createChildContext({
            context: obj
        });

        ko.applyBindingsToDescendants(innerBindingContext, element);
        // invoke immediately to get the initial selection
        updateSelection();

        $el.dropdown({
            onChange: function (value, text) {
                suppressUpdate = true;
                selectedObservable(text);
            }
        });

        return { controlsDescendantBindings: true };
    },
    makeRealNode: utils.makeRealNode({
        classes: "ui selection dropdown"
    }),
    preprocess: utils.preprocess
};
