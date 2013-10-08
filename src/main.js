// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/toggle");
bindingHandlers["steps"] = require("./bindings/steps");
bindingHandlers["modal"] = require("./bindings/modal");

module.exports = {
    Step: require("./classes/step.js"),
    Action: require("./classes/action.js")
};

if (typeof window !== "undefined") {
    window["semantic"] = module.exports;
}