var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/modal.html");
var Action = require("../classes").Action;
var utils = require("../utils.js");


module.exports = {
    init: function modalBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // We need to figure out if we have a boolean variable/observable, or an object variable/observable
        var obj = valueAccessor();

        // if we have our own buttons config, we don't want to
        // have Semantic-UI hide when a button is pressed
        if ( obj.buttons ) {
            // Some nonexistent element
            obj.selector = "#fake-" + new Date().getTime();
        }

        var context = ko.utils.extend({
            title: "",
            content: "",
            buttons: [
                new Action("Cancel", $.noop), new Action("Okay", $.noop)
            ],
            show: false
        }, obj);

        // Patch the buttons so they get the element as the `this`
        ko.utils.arrayForEach(context.buttons, function (action) {
            // but only do this once
            action.go = action.callback.bind(element);
            action.go._wasAlreadyPatched = true;
        });


        // if we've already applied bindings, we need to clean up first
        ko.cleanNode(element);


        // check if there are children
        // if so, we don't want to delete them
        if ( element.children.length === 0 ) {
            // load our module template
            element.innerHTML = template;
        }

        var observable = ko.getObservable(obj, "show");

        var showing = false, hiding = false;

        observable.subscribe(function () {

            // We don't want these to fire if we're in the process
            // of showing or hiding already
            if ( obj.show && !showing ) {
                setTimeout(function () {
                    showing = false;
                }, 430);

                $(element).modal("show");
            } else if ( !obj.show && !hiding ) {
                setTimeout(function () {
                    if ( !obj.show ) {
                        hiding = false;
                    }
                }, 430);

                $(element).modal("hide").modal("hide dimmer");
            } else {
                console.log("fake", showing, hiding);
            }
        });

        // we need our own onHide and onShow methods to make sure
        // our observable stays in check
        context.onShow = function () {
            console.log("onshow", showing, hiding);
            showing = true;
            obj.show = true;
        };
        context.onHide = function () {
            console.log("onhide", showing, hiding);
            hiding = true;
            obj.show = false;
        };

        var innerBindingContext = bindingContext.createChildContext(context);

        // not sure if this is even possible with Knockout-ES5
        // but I suppose they could still use ko.observable(thingImPassingToModalParam)
        ko.applyBindingsToDescendants(innerBindingContext, element);

        $(element).modal(context);


        return { controlsDescendantBindings: true };

    }, makeRealNode: function (node, attributes) {
        var modal, data = node.getAttribute("data");

        if ( !data ) {
            return {required: "data"};
        }

        modal = document.createElement("div");
        modal.className = "ui modal";

        modal.setAttribute("data-bind", utils.hashToBindingString({ modal: data}));

        return modal;
    }
};
