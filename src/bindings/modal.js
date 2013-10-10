var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/modal.html");
var Action = require("../classes/action.js");
var utils = require("../utils.js");


module.exports = {
    init: function modalBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // We need to figure out if we have a boolean variable/observable, or an object variable/observable
        var obj = valueAccessor();

        // Maybe it's an object, so we'll be using our own template for this
        if ( typeof obj === "object" ) {
            // this function handles the initial value, and the case of the object
            // being replaced
            var initializeModal = function (settings) {

                // if we have our own buttons config, we don't want to
                // have Semantic-UI hide when a button is pressed
                if ( settings.buttons ) {
                    // Some nonexistent element
                    settings.selector = "#fake-" + new Date().getTime();
                }

                var context = ko.utils.extend({
                    title: "",
                    content: "",
                    buttons: [
                        new Action("Cancel", $.noop), new Action("Okay", $.noop)
                    ],
                    show: false
                }, settings);

                // Patch the buttons so they get the element as the `this`
                ko.utils.arrayForEach(context.buttons, function (action) {
                    action.go = action.callback.bind(element);
                });


                // if we've already applied bindings, we need to clean up first
                ko.cleanNode(element);

                // load our module template
                element.innerHTML = template;

                var observable = ko.getObservable(context, "show");

                var showing = false, hiding = true, _fake = {};

                ko.defineProperty(_fake, "showSubscription", function () {

                    // We don't want these to fire if we're in the process
                    // of showing or hiding already
                    if ( obj.show && !showing ) {
                        $(element).modal("show");
                    } else if ( !obj.show && !hiding ) {
                        $(element).modal("hide").modal("hide dimmer");
                    } else {
                        console.log("fake")
                    }
                });

                // hackish way to set our initial subscription
                _fake.showSubscription;

                // we need our own onHide and onShow methods to make sure
                // our observable stays in check
                context.onShow = function () {
                    showing = true;

                    setTimeout(function () {
                        if ( obj.show ) {
                            showing = false;
                        }
                    }, 430);

                    obj.show = true;
                };
                context.onHide = function () {
                    hiding = true;

                    setTimeout(function () {
                        if ( !obj.show ) {
                            hiding = false;
                        }
                    }, 430);

                    obj.show = false;
                };

                var innerBindingContext = bindingContext.createChildContext(context);

                // not sure if this is even possible with Knockout-ES5
                // but I suppose they could still use ko.observable(thingImPassingToModalParam)
                ko.applyBindingsToDescendants(innerBindingContext, element);

                $(element).modal(context);
            };


            initializeModal(obj);


            return { controlsDescendantBindings: true };
        }
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
