var utils = require("../utils");

module.exports = {
    init: function toggleBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData);

        // Toggle the observable on click
        $(element).click(function () {
            obs(!ko.unwrap(obs))
        });

        var updateClass = function () {
            // if we set it to true, add the "active" class
            if (obs()) {
                $el.addClass('active');
            }

            // otherwise, remove it
            else {
                $el.removeClass('active');
            }
        };

        // watch for changes
        obs.subscribe(updateClass);

        // invoke immediately to get the initial class correct
        updateClass();
    },
    makeRealNode: utils.makeRealNode({
        classes: "ui toggle button"
    }),
    preprocess: utils.preprocess
};
