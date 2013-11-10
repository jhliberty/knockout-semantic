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