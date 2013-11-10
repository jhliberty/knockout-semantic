var utils = require("../utils");

module.exports = {
    init: function popupBinding(element, valueAccessor) {
        var $el = $(element), obs = utils.getBindingObservable(valueAccessor, viewModel);

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
