var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/steps.html");

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