// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/binding-toggle");
bindingHandlers["steps"] = require("./bindings/binding-steps");
bindingHandlers["modal"] = require("./bindings/binding-modal");

module.exports = {
    Step: require("./classes/step.js"),
    Action: require("./classes/action.js")
};

if (typeof window !== "undefined") {
    window["semantic"] = module.exports;
}