describe("Form", function () {

    (function () {
        var vm = {
            form: ko.track({
                Name: "John Smith",
                Num: 5,
                Sex: ["Male", "Female"]
            })
        };

        ko.track(vm);

        var $el, el;

        $scope = $('<div><s-form data="form"></s-form></div>');

        ko.applyBindings(vm, $scope.get(0));

        // we do this after applyBindings because the node is replaced
        $el = $scope.children().first();
        el = $el.get(0);

        /** Text Input Spec **/

        it("should have an input", function () {
            expect($el.find("input").length).toBeGreaterThan(1);
        });

        it("should default value is set", function () {
            expect($el.find("input").first().val()).toBe("John Smith");
        });

        it("should have a placeholder", function () {
            expect($el.find("input").first().attr("placeholder")).toBe("Name");
        });

        it("should change the input value if the observable changes", function () {
            expect($el.find("input").first().val()).toBe("John Smith");

            vm.form.Name = "Jack";
            expect($el.find("input").first().val()).toBe("Jack");
        });

        it("should change the observable if the input changes", function () {
            var $input = $el.find("input").first();
            $input.val("Changed");
            $input.trigger("blur");
            $input.trigger("change");

            expect($input.val()).toBe("Changed");
        });

        /** Numeric input spec **/
        it("should not modify the number initially", function(){
            expect(vm.form.Num).toBe(5);
        });

        it("should have the correct placeholder", function(){
            var $number = $el.find("input").eq(1);

            expect($number.attr("placeholder")).toBe("Num");
        });

        it("should change the input value when the observable is changed", function(){
            var $number = $el.find("input").eq(1);

            vm.form.Num = 11;
            expect($number.val()).toEqual("11");
        });

        it("should change the observable when the input is changed and remain a number", function(){
            var $number = $el.find("input").eq(1);

            $number.val("42");
            $number.trigger("blur");
            $number.trigger("change");

            expect(vm.form.Num).toBe(42);
        });

        /** Dropdown Tests **/

        it("should have one .ui.dropdown", function(){
            var $dropdown = $el.find('.ui.dropdown');

            expect($dropdown.length).toBe(1);
        });

        it("should set the `selected` property", function(){
            expect(vm.form.Sex.selected).toBeTruthy();
        });

        it("should change the visible text when the observable is changed", function(){
            var $dropdown = $el.find('.ui.dropdown');

            vm.form.Sex.selected = "Female";
            expect($dropdown.children('.text').text()).toEqual("Female");
            vm.form.Sex.selected = "Male";
            expect($dropdown.children('.text').text()).toEqual("Male");
        });

        it("should change the observable when the dropdown is clicked", function(){
            var $dropdown = $el.find('.ui.dropdown'), $items = $dropdown.find('.item');

            $items.eq(1).click();
            expect(vm.form.Sex.selected).toEqual("Female");
            $items.eq(0).click();
            expect(vm.form.Sex.selected).toEqual("Male");
            $items.eq(1).click();
            expect(vm.form.Sex.selected).toEqual("Female");
            $items.eq(0).click();
            expect(vm.form.Sex.selected).toEqual("Male");
        });
    })();
});
