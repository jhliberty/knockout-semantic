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
    }
};
