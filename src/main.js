// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/toggle");
bindingHandlers["steps"] = require("./bindings/steps");
bindingHandlers["modal"] = require("./bindings/modal");
bindingHandlers["dropdown"] = require("./bindings/dropdown");
bindingHandlers["popup"] = require("./bindings/popup");
bindingHandlers["table"] = require("./bindings/table");
bindingHandlers["form"] = require("./bindings/form");

// this module registers it self, so we just need to make sure it runs
require("./suiBindingProvider.js");

var previousNamespace = window.sui;

module.exports = require("./classes");

/* not sure what other libs use the 'semantic' global, but it's good practice */
module.exports.noConflict = function () {
    if (previousNamespace != null) {
        window.sui = previousNamespace;
    }
    else {
        delete window.sui;
    }
    return module.exports;
};

if (typeof window !== "undefined") {
    window.sui = module.exports;
}
