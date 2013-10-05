;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],2:[function(require,module,exports){
var fs = require('fs');
var template = "<i class=\"close icon\"></i>\n<div class=\"header\" data-bind=\"text: title\">\n\n</div>\n<div class=\"content\" data-bind=\"html: content\">\n    <div class=\"left\">\n        Content can appear on left\n    </div>\n    <div class=\"right\">\n        Content can appear on right\n    </div>\n</div>\n<div class=\"actions\" data-bind=\"foreach: buttons\">\n    <div class=\"ui button\" data-bind=\"text: $data\"></div>\n</div>";


module.exports = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // We need to figure out if we have a boolean variable/observable, or an object variable/observable
        var value = valueAccessor(), isObservable = ko.isSubscribable(value),
            realValue = ko.unwrap(value);


        // Just a boolean value, so we'll watch it for changes and
        // show/hide the modal
        // the user is expected to handle the template
        if (typeof realValue === "boolean") {
            if (isObservable) {
                value.subscribe(function(newValue){
                    if (newValue) {
                        $(element).modal("show");
                    }
                    else {
                        $(element.modal("hide"));
                    }
                });
            }
        }

        // Maybe it's an object, so we'll be using our own template for this
        else if (typeof realValue === "object") {
            // this function handles the initial value, and the case of the object
            // being replaced
            var initializeModal = function(settings){
                var context = ko.utils.extend({
                    title: "",
                    content: "",
                    buttons: ["Cancel", "OK"],
                    show: false
                }, settings);

                // if we've already applied bindings, we need to clean up first
                //ko.cleanNode(element);

                // load our module template
                element.innerHTML = template;

                console.log(context);

                if (ko.isSubscribable(context.show)) {
                    context.show.subscribe(function(newValue){
                        console.log(element, "dasdasfa");
                        if (newValue) {
                            $(element).modal("show");
                        }
                        else {
                            $(element.modal("hide"));
                        }
                    });
                }

                // we need our own onHide and onShow methods to make sure
                // our observable stays in check, but we don't want to override
                // callbacks the user sets


                ko.applyBindingsToDescendants(context, element);
            };

            if (isObservable) {
                value.subscribe(initializeModal);
            }
            else {
                initializeModal(realValue);
            }

            return { controlsDescendantBindings: true };
        }

        var newProperties = valueAccessor(),
            innerBindingContext = bindingContext.extend(newProperties);



    }
};

},{"fs":1}],3:[function(require,module,exports){
var fs = require('fs');
var template = "<div class=\"step\" data-bind=\"text: step.text,\n            css: {active: step.active()}\"></div>";

var Step = require("../classes/step.js");
var util = require("../utils.js");

var binding = {
    makeTemplateValueAccessor: function(element, valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);

            // It's just an array, so we'll assume it's syntax sugar for foreach
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            ko.utils.unwrapObservable(modelValue);

            // Inject our template
            element.innerHTML = template;

            var data = unwrappedValue['data'], activeTest, original = data.slice(0);

            if (unwrappedValue.active != null) {
                activeTest = function(index){
                    // The active observable could hold the 0-based index, or the string
                    // matching the tab text
                    var foundIndex = util.byIndexOrName(ko.unwrap(unwrappedValue.active), original);
                    return index === foundIndex && foundIndex !== -1;
                };
            }

            for (var i=0; i<data.length; i++) {
                if (typeof data[i] === "string") {
                    data[i] = new Step(data[i], typeof activeTest === "function"
                                                ? activeTest.bind(null, i)
                                                : activeTest);
                }
            }

            a = data;

            return {
                'foreach': data,
                'as': 'step',
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor) {
        return ko.bindingHandlers['template']['init'](element, binding.makeTemplateValueAccessor(element, valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, binding.makeTemplateValueAccessor(element, valueAccessor), allBindings, viewModel, bindingContext);
    }
};

module.exports = binding;
},{"../classes/step.js":5,"../utils.js":8,"fs":1}],4:[function(require,module,exports){
module.exports = {
    init: function(element, valueAccessor){
        var $el = $(element);

        // Toggle the observable on click
        $(element).click(function(){
            var observable = valueAccessor();
            observable(!ko.unwrap(observable));
        });

        valueAccessor().subscribe(function(){
            // if we set it to true, add the "active" class
            if (!!ko.unwrap(valueAccessor())) {
                $el.addClass('active');
            }

            // otherwise, remove it
            else {
                $el.removeClass('active');
            }
        });
    }
};

},{}],5:[function(require,module,exports){
function Step(text, activeTest){
    this.text = ko.observable(text);

    if (typeof activeTest === "functon") {
        this.active = ko.computed(activeTest);
    }
    else {
        this.active = activeTest;
    }
}

module.exports = Step;
},{}],6:[function(require,module,exports){
$('.codeTarget').each(function () {
    var code = $(this).prev().html();
    var $pre = $("<pre class='prettyprint'>");

    code = html_beautify(code, {
        /*wrap_line_length: 78*/
    });

    code = code.replace(/[<"]|data-bind|>(?=\s*\w)/g, function(m){
        switch (m) {
            case "<": return "\n&lt;";
            case ">": return "&gt;\n  ";
            case '"': return "&quot;";
            case "data-bind": return "\n     data-bind";
        }
    }).trim();

    $pre.html(code);
    $(this).append($pre);
});

},{}],7:[function(require,module,exports){
// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/binding-toggle");
bindingHandlers["steps"] = require("./bindings/binding-steps");
bindingHandlers["modal"] = require("./bindings/binding-modal");

module.exports = {
    foo: 'bar'
};
},{"./bindings/binding-modal":2,"./bindings/binding-steps":3,"./bindings/binding-toggle":4}],8:[function(require,module,exports){
module.exports = {
    byIndexOrName: function(index, array) {
        if (!isNaN(parseInt(index))) {
            return parseInt(index);
        }
        else {
            return array.indexOf(index);
        }
    }
};

},{}]},{},[2,3,4,6,8,5,7])
;