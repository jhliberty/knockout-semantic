;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],2:[function(require,module,exports){
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
},{"../classes/step.js":4,"../utils.js":6,"fs":1}],3:[function(require,module,exports){
module.exports = {
    /**
     * @param {HTMLElement} element
     * @param valueAccessor
     */
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/binding-toggle");
bindingHandlers["steps"] = require("./bindings/binding-steps");

module.exports = {
    foo: 'bar'
};
},{"./bindings/binding-steps":2,"./bindings/binding-toggle":3}],6:[function(require,module,exports){
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

},{}]},{},[5,6])
;