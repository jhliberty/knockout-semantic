/**
 * An action.  Call action.do to do the action.
 * @param {String} name
 * @param {Function} callback
 * @constructor
 */
function Action(name, callback) {
    var self = this;

    self.name = name;
    self.callback = callback || $.noop;

    self.go = function(){
        self.callback.apply(self, arguments);
    };
}

module.exports = Action;