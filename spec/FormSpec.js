describe("Form", function () {

    // this is a simple form
    (function () {
        var vm = {
            form: ko.track({
                Name: "John Smith"
            })
        };

        ko.track(vm);

        var $el, el;

        $scope = $('<div><s-form data="form"></s-form></div>');

        ko.applyBindings(vm, $scope.get(0));

        // we do this after applyBindings because the node is replaced
        $el = $scope.children().first();
        el = $el.get(0);

        it("should have an input", function () {
            expect($el.find("input").length).toBe(1);
        });

        it("should default value is set", function () {
            expect($el.find("input").val()).toBe("John Smith");
        });

        it("should have a placeholder", function () {
            expect($el.find("input").attr("placeholder")).toBe("Name");
        });

        it("should change the input value if the observable changes", function () {
            expect($el.find("input").val()).toBe("John Smith");

            vm.form.Name = "Jack";
            expect($el.find("input").val()).toBe("Jack");
        });

        it("should change the observable if the input changes", function () {
            $el.find("input").val("Changed");
            $el.find("input").trigger("blur");
            $el.find("input").trigger("change");

            expect($el.find("input").val()).toBe("Changed");
        });
    })();
});