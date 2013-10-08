module.exports = {
    init: function(element, valueAccessor){
        var $el = $(element);

        // Toggle the observable on click
        $(element).click(function(){
            var observable = valueAccessor();

            // Update the observable (true or false)
            // this also effects the class change
            observable(!ko.unwrap(observable));
        });

        var updateClass = function(){
            // if we set it to true, add the "active" class
            if (!!ko.unwrap(valueAccessor())) {
                $el.addClass('active');
            }

            // otherwise, remove it
            else {
                $el.removeClass('active');
            }
        };

        valueAccessor().subscribe(updateClass);

        // invoke immediately to get the initial class correct
        updateClass();
    }
};
