var utils = require("../utils");
var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/form.html");

module.exports = {
    init: function dropdownBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData);

        var formObject = ko.unwrap(obs);

        var context = Object.keys(formObject).map(function(key){


            var itemObservable = formObject[key];
            if (!ko.isObservable(itemObservable)) {
                itemObservable = ko.getObservable(formObject, key);
            }
            var itemDefault = ko.unwrap(itemObservable);

            var obj = {
                key: key,
                type: "unknown",
                value: itemObservable
            };

            console.log();

            if (typeof itemDefault === "boolean") {
                obj.type = "boolean";
            }
            if (typeof itemDefault === "string") {
                obj.type = "string";
            }
            if (itemDefault && itemDefault.constructor.name === "Array") {
                obj.type = "array";

                if (itemDefault.selected === undefined) {
                    // it must have a selected property and we want it to be observable
                    itemDefault.selected = itemDefault[0];
                    ko.track(itemDefault, ["selected"]);
                }

                // for arrays we need to make the usual dropdown object
                obj.value = {
                    options: itemObservable
                };

                // the selcted property needs to stay in sync with the selected property on the array
                ko.defineProperty(obj.value, "selected", {
                    get: function(){
                        return itemDefault.selected;
                    },
                    set: function(val) {
                        itemDefault.selected = val;
                    }
                });
            }
            if (typeof itemDefault === "number") {
                obj.type = "number";

                // we need to make sure it stays a number
                var originalObservable = itemObservable;
                obj.value = ko.computed({
                    read: function(){
                        return ko.unwrap(originalObservable);
                    },
                    write: function(val) {
                        if (typeof val === "string") {
                            // remove all non-numeric characters and convert it to a string
                            originalObservable(
                                Number(
                                    val.replace(/[^0-9.]+/g, '')
                                )
                            );
                        }
                    }
                });
            }

            return obj;
        });

        var innerBindingContext = bindingContext.createChildContext(context);

        element.innerHTML = template;

        ko.applyBindingsToDescendants(innerBindingContext, element);
        return { controlsDescendantBindings: true };
    },
    makeRealNode: utils.makeRealNode({
        classes: "ui form"
    }),
    preprocess: utils.preprocess
};
