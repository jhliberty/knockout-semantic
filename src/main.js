// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/toggle");
bindingHandlers["steps"] = require("./bindings/steps");
bindingHandlers["modal"] = require("./bindings/modal");

// this module registers it self, so we just need to make sure it runs
require("./suiBindingProvider.js");

module.exports = {
    Step: require("./classes/step.js"),
    Action: require("./classes/action.js")
};

if (typeof window !== "undefined") {
    window["semantic"] = module.exports;
}