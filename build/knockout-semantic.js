;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],2:[function(require,module,exports){
var utils = require("../utils");
var fs = require('fs');
var template = "<input type=\"hidden\" />\r\n<div class=\"default text\" data-bind=\"text: context.text || context.selected || context.defaultText\"></div>\r\n<i class=\"dropdown icon\"></i>\r\n<div class=\"menu\" data-bind=\"foreach: context.options\">\r\n    <!-- ko if: typeof $data === \"object\" -->\r\n    <div class=\"item\" data-bind=\"click: $data.go || $.noop\">\r\n        <!-- ko if: $data.icon -->\r\n        <i data-bind=\"attr: {'class': 'icon ' + $data.icon}\"></i>\r\n        <!-- /ko -->\r\n        <!-- ko text: $data.text --><!-- /ko -->\r\n    </div>\r\n    <!-- /ko -->\r\n    <!-- ko if: typeof $data === \"string\" -->\r\n    <div class=\"item\" data-bind=\"text: $rawData\"></div>\r\n    <!-- /ko -->\r\n</div>\r\n<!--\r\ncontext.data[$index() | 0]-->\r\n";

module.exports = {
    init: function dropdownBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), suppressUpdate;

        var obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData),
            selectedObservable = utils.getBindingObservable('selected', obs());

        var updateSelection = function () {
            var selected = selectedObservable();

            if (suppressUpdate) {
                suppressUpdate = false;
            } else {
                suppressUpdate = true;
                $el.find('.menu .item:contains(' + selected + ')').click();
            }
        };

        // watch for changes
        var obj = obs();
        obj.defaultText = obj.defaultText || element.textContent || "";


        selectedObservable.subscribe(updateSelection);

        // apply the template
        utils.applyTemplateIfNoChildren(element, template);

        var innerBindingContext = bindingContext.createChildContext({
            context: obj
        });

        ko.applyBindingsToDescendants(innerBindingContext, element);
        // invoke immediately to get the initial selection
        updateSelection();

        $el.dropdown({
            onChange: function (value, text) {
                suppressUpdate = true;
                selectedObservable(text);
            }
        });

        return { controlsDescendantBindings: true };
    },
    makeRealNode: utils.makeRealNode({
        classes: "ui selection dropdown"
    }),
    preprocess: utils.preprocess
};

},{"../utils":12,"fs":1}],3:[function(require,module,exports){
var fs = require('fs');
var template = "<i class=\"close icon\"></i>\r\n<div class=\"header\" data-bind=\"text: title\">\r\n\r\n</div>\r\n<div class=\"content\" data-bind=\"html: content\">\r\n    <div class=\"left\">\r\n        Content can appear on left\r\n    </div>\r\n    <div class=\"right\">\r\n        Content can appear on right\r\n    </div>\r\n</div>\r\n<div class=\"actions\" data-bind=\"foreach: buttons\">\r\n    <div class=\"ui button\" data-bind=\"text: name, click: go\"></div>\r\n</div>";
var Action = require("../classes").Action;
var utils = require("../utils.js");


module.exports = {
    init: function modalBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // We need to figure out if we have a boolean variable/observable, or an object variable/observable
        var obj = valueAccessor();

        // if we have our own buttons config, we don't want to
        // have Semantic-UI hide when a button is pressed
        if (obj.buttons) {
            // Some nonexistent element
            obj.selector = "#fake-" + new Date().getTime();
        }

        var context = ko.utils.extend({
            title: "",
            content: "",
            buttons: [
                new Action("Cancel", $.noop), new Action("Okay", $.noop)
            ],
            show: false
        }, obj);

        // Patch the buttons so they get the element as the `this`
        ko.utils.arrayForEach(context.buttons, function (action) {
            // but only do this once
            action.go = action.callback.bind(element);
            action.go._wasAlreadyPatched = true;
        });


        // if we've already applied bindings, we need to clean up first
        ko.cleanNode(element);


        utils.applyTemplateIfNoChildren(element, template);

        var observable = ko.getObservable(obj, "show");

        var showing = false, hiding = false;

        observable.subscribe(function () {

            // We don't want these to fire if we're in the process
            // of showing or hiding already
            if (obj.show && !showing) {
                setTimeout(function () {
                    showing = false;
                }, 430);

                $(element).modal("show");
            } else if (!obj.show && !hiding) {
                setTimeout(function () {
                    if (!obj.show) {
                        hiding = false;
                    }
                }, 430);

                $(element).modal("hide").modal("hide dimmer");
            } else {
                console.log("fake", showing, hiding);
            }
        });

        // we need our own onHide and onShow methods to make sure
        // our observable stays in check
        context.onShow = function () {
            console.log("onshow", showing, hiding);
            showing = true;
            obj.show = true;
        };
        context.onHide = function () {
            console.log("onhide", showing, hiding);
            hiding = true;
            obj.show = false;
        };

        var innerBindingContext = bindingContext.createChildContext(context);

        // not sure if this is even possible with Knockout-ES5
        // but I suppose they could still use ko.observable(thingImPassingToModalParam)
        ko.applyBindingsToDescendants(innerBindingContext, element);

        $(element).modal(context);


        return { controlsDescendantBindings: true };

    },
    makeRealNode: utils.makeRealNode({
        classes: "ui modal"
    }),
    preprocess: utils.preprocess
};
},{"../classes":8,"../utils.js":12,"fs":1}],4:[function(require,module,exports){
var utils = require("../utils");

module.exports = {
    init: function popupBinding(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $el = $(element), obs = utils.getBindingObservable(valueAccessor, bindingContext.$rawData);

        var updatePopup = function () {
            var data = obs();

            if (typeof data === "string") {
                $el.popup({
                    content: data
                });
            }
            else if (data) {
                $el.popup(data);
            }
        };

// watch for changes
        obs.subscribe(updatePopup);

// invoke immediately to get the initial class correct
        updatePopup();
    },
    makeRealNode: utils.makeRealNode({}),
    preprocess: utils.preprocess
}
;

},{"../utils":12}],5:[function(require,module,exports){
var fs = require('fs');
var template = "<!-- ko foreach: data -->\r\n<!-- ko if: $parent.disabled -->\r\n\r\n<div class=\"step\" data-bind=\"text: $data,\r\n    css: {\r\n        active: $parent.active === $index() || $parent.active === $data,\r\n        disabled: $parent.active !== $index() && $parent.active !== $data\r\n    }\"></div>\r\n<!-- /ko -->\r\n<!-- ko ifnot: $parent.disabled -->\r\n<div class=\"step\" data-bind=\"text: $data,\r\n    css: { active: $parent.active === $index() || $parent.active === $data },\r\n    click: function(){ typeof $parent.active === 'number' ? $parent.active = $index() : $parent.active = $data }\"></div>\r\n<!-- /ko -->\r\n\r\n<!-- /ko -->";

var utils = require("../utils");

var binding = {
    'init': function stepsBingindInit(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var obj = valueAccessor(), $el = $(element);

        // if we've already applied bindings, we need to clean up first
        ko.cleanNode(element);

        // load our module template
        element.innerHTML = template;

        var innerBindingContext = bindingContext.createChildContext(obj);

        // not sure if this is even possible with Knockout-ES5
        // but I suppose they could still use ko.observable(thingImPassingToModalParam)
        ko.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    },
    makeRealNode: function (node, attributes) {
        var steps, data = node.getAttribute("data");

        if (!data) {
            return {required: "data"};
        }

        steps = document.createElement("div");

        utils.mergeClasses("ui steps", node, steps);

        steps.setAttribute("data-bind", utils.hashToBindingString({
            steps: data
        }));

        return steps;
    }

};

module.exports = binding;
},{"../utils":12,"fs":1}],6:[function(require,module,exports){
var utils = require("../utils");
var fs = require('fs');
var template = "<!-- ko if: head && head.length -->\r\n<thead>\r\n<tr data-bind=\"foreach: head\">\r\n    <th data-bind=\"text: $rawData\"></th>\r\n</tr>\r\n</thead>\r\n<!-- /ko -->\r\n\r\n<tbody data-bind=\"foreach: rows\">\r\n<tr data-bind=\"foreach: $rawData\">\r\n    <td data-bind=\"text: $rawData\"></td>\r\n</tr>\r\n</tbody>\r\n";


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


},{"../utils":12,"fs":1}],7:[function(require,module,exports){
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

},{"../utils":12}],8:[function(require,module,exports){
/**
 * @constructor
 */
function Steps(obj) {
    ko.utils.extend(this, obj);
    ko.track(this);
}

/**
 * An action.  Call action.go to do the action.
 * @param {String} name
 * @param {Function} callback
 * @param {String} icon an icon name, which will be rendered with the action (where applicable)
 * @constructor
 */
function Action(name, callback, icon) {
    var _this = this;

    this.name = name;
    this.icon = icon || false;
    this.callback = callback || $.noop;

    _this.go = function () {
        _this.callback.apply(_this, arguments);
    };

    ko.track(this, ["name", "icon"]);
}

/**
 * @constructor
 */
function Toggle(bool) {
    this.on = bool || false;
    ko.track(this);
}

/**
 * @constructor
 */
function Dropdown(obj) {
    ko.utils.extend(this, obj);
    this.selected = obj.selected || null;
    ko.track(this);
}

module.exports = {
    Action: Action,
    Steps: Steps,
    Toggle: Toggle,
    Dropdown: Dropdown,
    utils: require('./utils')
};
},{"./utils":12}],9:[function(require,module,exports){
var config = {
    namespace: "s-"
}

module.exports = config;
},{}],10:[function(require,module,exports){
// Load up our binding handlers
var bindingHandlers = window.ko.bindingHandlers;
bindingHandlers["toggle"] = require("./bindings/toggle");
bindingHandlers["steps"] = require("./bindings/steps");
bindingHandlers["modal"] = require("./bindings/modal");
bindingHandlers["dropdown"] = require("./bindings/dropdown");
bindingHandlers["popup"] = require("./bindings/popup");
bindingHandlers["table"] = require("./bindings/table");

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

},{"./bindings/dropdown":2,"./bindings/modal":3,"./bindings/popup":4,"./bindings/steps":5,"./bindings/table":6,"./bindings/toggle":7,"./classes":8,"./suiBindingProvider.js":11}],11:[function(require,module,exports){
var config = require("./config");

var NamespaceBindingProvider = function () {
    this.constructor = NamespaceBindingProvider;

    this.preprocessNode = function (node) {
        // first, let's get out of here if we don't have a node with a tagName
        if (!node.tagName) return;

        // e.g. if config.namespace is "KO-", namespace is "ko-"
        // if config.namespace is falsy, namespace is ""
        var tagName = node.tagName.toLowerCase(),
            namespace = config.namespace ? config.namespace.toLowerCase() : "";

        // we only want to do this for element nodes
        if (node.nodeType === Node.ELEMENT_NODE && tagName.indexOf(namespace) === 0) {
            var bindingName = namespace ? tagName.split(namespace)[1] : tagName;

            // if there's a binding with the correct name
            if (ko.bindingHandlers[bindingName] && ko.bindingHandlers[bindingName].makeRealNode) {
                result = ko.bindingHandlers[bindingName].makeRealNode(node);
            }

            // they tried to use an element which is now just sitting in the dom
            // we should warn developers about this...
            else {
                window.console && console.warn("WARNING: no binding handler " + tagName +
                    " which implements makeRealNode.  You may have made a typo.");
                return;
            }

            // check for errors
            if (result && result.constructor.name === "Object" && result.required) {

            }

            // did they return a node?  sweet! insert it into the DOM
            else if (result && result.nodeType) {
                node.parentNode.insertBefore(result, node);
                node.parentNode.removeChild(node);
                return result;
            }
        }
    };
};

var bpInstance = ko.bindingProvider.instance;

bpInstance.others = bpInstance.others || [];

// did someone go ahead and stick themselves in the preprocessNode function?
if (typeof bpInstance.preprocessNode === "function"
    && !bpInstance.preprocessNode._thisIsTheRightOne) {
    bpInstance.others.push(
        bpInstance.preprocessNode.bind(bpInstance)
    );
}

/**
 * calls all other node preprocessors
 * @param {HTMLElement} node the node to process
 */
bpInstance.preprocessNode = function (node) {
    var result;

    ko.utils.arrayForEach(bpInstance.others, function (callback) {
        result = callback(node);

        // if they explicitly return false, don't do any more processing on this node
        if (result === false) {
            return false;
        }

        // if they return a node, that's the new node we're working with
        else if (result && result.nodeType) {
            node = result;
        }

        // otherwise do nothing special, the same node will be used in the next preprocessor
    });
}

// set a flag so it's not set again if this is for some reason executed twice
bpInstance.preprocessNode._thisIsTheRightOne = true;

NamespaceBindingProvider.prototype = bpInstance;

var nsProvider = new NamespaceBindingProvider();
bpInstance.others.push(nsProvider.preprocessNode.bind(nsProvider));
},{"./config":9}],12:[function(require,module,exports){
var utils = module.exports = {
    byIndexOrName: function (index, array) {
        if (!isNaN(parseInt(index))) {
            return parseInt(index);
        }
        else {
            return array.indexOf(index);
        }
    },
    hashToBindingString: function (hash) {
        var bindings = [];

        ko.utils.objectForEach(hash, function (key, value) {
            if (value != null) {
                bindings.push(key + ": " + value);
            }
        });
        return bindings.join(", "); //.replace(/\\?"/g, "'");
    },
    /**
     *
     * @param {String} extra new classes, seperated by spaces
     * @param {HTMLElement} source the element to copy classes from
     * @param {HTMLElement} dest the element to assign the new classes to
     */
    mergeClasses: function (extra, source, dest) {
        var classList = [];

        if (source.className) {
            classList.push(source.className);
        }

        if (dest.className) {
            classList.push(dest.className);
        }

        if (extra) {
            classList.push(extra);
        }

        dest.className = classList.join(" ");
    },

    moveChildren: function (from, to) {
        var nodes = Array.prototype.slice.call(from.childNodes, 0);

        for (var i = 0; i < nodes.length; i++) {
            var log = to.appendChild(nodes[i]);
        }
    },

    makeRealNode: function (settings) {
        return function (node) {
            var newElement, i, attrs = node.attributes;

            newElement = document.createElement(settings.tag || "div");

            utils.mergeClasses(settings.classes, node, newElement);

            var dataHash = {};

            for (i = 0; i < attrs.length; i++) {
                dataHash[attrs[i].name] = attrs[i].value;
            }

            var data = dataHash.data;

            delete dataHash.data;
            delete dataHash["class"];

            // move the id
            if (dataHash.id) {
                node.removeAttribute("id");
                newElement.id = dataHash.id;
                delete dataHash.id;
            }

            var mainBinding = node.tagName.split("-")[1].toLowerCase();
            dataHash[mainBinding] = data;

            newElement.setAttribute("data-bind", utils.hashToBindingString(dataHash));
            utils.moveChildren(node, newElement);

            return newElement;
        }
    },
    applyTemplateIfNoChildren: function(element, template) {
        // the easiest is if we have no children
        if (element.childNodes.length === 0) {
            element.innerHTML = template;
            return true;
        }

        // sometimes we get an empty text node
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && !element.textContent.trim()) {
            element.innerHTML = template;
            return true;
        }

        return false;
    },
    getBindingObservable: function (valueAccessor, viewModel) {
        var value, obs;

        if (typeof valueAccessor === "function") {
            value = valueAccessor();
        }
        else {
            value = valueAccessor;
        }

        // for subproperties, they'll ask for the property directly
        if (typeof value === "string") {
            obs = ko.getObservable(viewModel, value);
            if (ko.isSubscribable(obs)) {
                return obs;
            }
        }

        // did preprocess make our special object?
        if (typeof value === "object" && value._kosui) {
            var obs = ko.getObservable(viewModel, value._kosui);

            // this will be true if ko.track was called on the context
            if (obs && ko.isSubscribable(obs)) {
                return obs
            }

            // otherwise, we just want the property
            else {
                value = viewModel[value._kosui];
            }
        }

        // old school observable
        if (ko.isSubscribable(value)) {
            return value;
        }

        else {
            return ko.observable(value);
        }

    },
    preprocess: function (stringFromBinding) {
        if (/^\w+$/.test(stringFromBinding)) {
            return "{ _kosui: '" + stringFromBinding + "'}"
        }
        else {
            return stringFromBinding;
        }
    }
};

},{}]},{},[2,3,4,5,6,7,8,9,11,10,12])
;