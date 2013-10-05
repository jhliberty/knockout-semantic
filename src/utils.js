module.exports = {
    byIndexOrName: function(index, array) {
        if (!isNaN(parseInt(index))) {
            return parseInt(index);
        }
        else {
            return array.indexOf(index);
        }
    }
};
