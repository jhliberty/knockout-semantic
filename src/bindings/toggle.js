var utils = require("../utils");

module.exports = {
    init: function toggleBinding(element, valueAccessor){
        var $el = $(element);

        // Toggle the observable on click
        $(element).click(function(){
            var obj = valueAccessor();

            // Update the observable (true or false)
            // this also effects the class change
            obj.on = !obj.on;
        });

        var updateClass = function(){
            // if we set it to true, add the "active" class
            if (valueAccessor().on) {
                $el.addClass('active');
            }

            // otherwise, remove it
            else {
                $el.removeClass('active');
            }
        };

        // watch for changes
        ko.getObservable(valueAccessor(), 'on').subscribe(updateClass);

        // invoke immediately to get the initial class correct
        updateClass();
    },
    makeRealNode: function(node, attributes) {
        var toggle,
            data = node.getAttribute("data");

        if (!data) {
            return {required: "data"};
        }

        toggle = document.createElement("div");
        utils.mergeClasses("ui toggle button", node, toggle);

        toggle.setAttribute("data-bind", utils.hashToBindingString({
            toggle: data,
            text: node.getAttribute("text")
        }));

        // preserve a text node if one exists
        if (node.childNodes[0] && node.childNodes[0].nodeType === Node.TEXT_NODE) {
            toggle.appendChild(node.childNodes[0]);
        }

        return toggle;
    }
};
