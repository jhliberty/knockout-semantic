var utils = require("../utils");
var template = fs.readFileSync(__dirname + "/templates/table.html");


module.exports = {
    init: function tableBinding(element, valueAccessor) {
        var $el = $(element), obs = utils.getBindingObservable(valueAccessor, viewModel);

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
        classes: "ui table",
        tag: "table"
    }),
    preprocess: utils.preprocess
};

