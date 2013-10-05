module.exports = {
    /**
     * @param {HTMLElement} element
     * @param valueAccessor
     */
    init: function(element, valueAccessor){
        var $el = $(element);

        // Toggle the observable on click
        $(element).click(function(){
            var observable = valueAccessor();
            observable(!ko.unwrap(observable));
        });

        valueAccessor().subscribe(function(){
            // if we set it to true, add the "active" class
            if (!!ko.unwrap(valueAccessor())) {
                $el.addClass('active');
            }

            // otherwise, remove it
            else {
                $el.removeClass('active');
            }
        });
    }
};
