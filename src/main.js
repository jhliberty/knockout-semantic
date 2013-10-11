// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/toggle");
bindingHandlers["steps"] = require("./bindings/steps");
bindingHandlers["modal"] = require("./bindings/modal");

// this module registers it self, so we just need to make sure it runs
require("./suiBindingProvider.js");

var previousNamespace = window.sui;

module.exports = require("./classes");

/* not sure what other libs use the 'semantic' global, but it's good practice */
module.exports.noConflict = function () {
    window["semantic"] = previousNamespace;
    return module.exports;
};

if ( typeof window !== "undefined" ) {
    window.sui = module.exports;
}
