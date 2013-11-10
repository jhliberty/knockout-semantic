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
    getBindingObservable: function (valueAccessor, viewModel) {
        var value, obs;

        if (typeof valueAccessor === "function") {
            value = valueAccessor();
        }
        else {
            value = valueAccessor;
        }

        console.log(value, viewModel);

        // for subproperties, they'll ask for the property directly
        if (typeof value === "string") {
            obs = ko.getObservable(viewModel, value);
            if (ko.isSubscribable(obs)) {
                return obs;
            }
        }

        // did preprocess make our special object?
        if (typeof value === "object" && value._kosui) {
            return ko.getObservable(viewModel, value._kosui);
        }

        // old school observable
        else if (ko.isSubscribable(value)) {
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
