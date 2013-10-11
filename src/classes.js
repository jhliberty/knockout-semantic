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
    var self = this;

    self.name = name;
    self.callback = callback || $.noop;

    self.go = function () {
        self.callback.apply(self, arguments);
    };
}

function Toggle(initial){
    this.on = initial || false;
    ko.track(this);
}


module.exports = {
    Action: Action,
    Steps: Steps,
    Toggle: Toggle
};