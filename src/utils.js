module.exports = {
    byIndexOrName: function(index, array) {
        if (!isNaN(parseInt(index))) {
            return parseInt(index);
        }
        else {
            return array.indexOf(index);
        }
    },
    hashToBindingString: function(hash) {
        var bindings = [];

        ko.utils.objectForEach(hash, function(key, value){
            if (value != null) {
                bindings.push(key + ": " + value);
            }
        });
        return bindings.join(", ").replace(/\\?"/g, "'");
    },
    /**
     *
     * @param {String} extra new classes, seperated by spaces
     * @param {HTMLElement} source the element to copy classes from
     * @param {HTMLElement} dest the element to assign the new classes to
     */
    mergeClasses: function(extra, source, dest) {
        var sourceClasses = source.classNames;
        if (sourceClasses) {
            dest.className = extra + " " + sourceClasses;
        }
        else {
            dest.className = extra;
        }
    }
};
