var utils = require("../utils");
var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/table.html");


module.exports = {
    init: function tableBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData);

        // apply the template
        utils.applyTemplateIfNoChildren(element, template);

        var obj = obs(), context;

        if (obj && obj.constructor && obj.constructor.name === "Array") {
            context = {
                head: null,
                rows: obs
            };
        }
        else if (obj && obj.head && obj.rows) {
            context = obs;
        }
        else {
            context = {
                head: null,
                rows: []
            };
        }

        var innerBindingContext = bindingContext.extend(context);

        ko.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    },
    makeRealNode: utils.makeRealNode({
        classes: "ui table",
        tag: "table"
    }),
    preprocess: utils.preprocess
};

