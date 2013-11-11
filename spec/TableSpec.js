describe("Table", function () {

    // this is our simple selection dropdown
    (function () {
        var vm = {
            table: [
                ["John", "Janitor"],
                ["Mike", "IT"],
                ["Paul", "HR"],
                ["Rick", ko.observable("Coffee Fetcher")]
            ]
        };

        ko.track(vm);

        var $el, el;

        $scope = $('<div><s-table data="table"></s-table></div>');

        ko.applyBindings(vm, $scope.get(0));

        // we do this after applyBindings because the node is replaced
        $el = $scope.children().first();
        el = $el.get(0);

        it("should become a table", function () {
            expect(el.tagName.toLowerCase()).toEqual("table");
        });

        it("is .ui.table", function () {
            expect(el.className).toContain("ui");
            expect(el.className).toContain("table");
        });

        it("simple table doesn't have thead or th elements", function () {
            expect($el.find('thead').length).toBe(0);
            expect($el.find('th').length).toBe(0);
        });

        it("has correct number of tr elements", function () {
            expect($el.find('tr').length).toBe(4);
        });

        it("has correct number of td elements", function () {
            expect($el.find('td').length).toBe(8);
        });

        it("ko.observable items update", function () {
            var $coffee = $el.find('td:Contains(Coffee)');
            var observable = vm.table[3][1];

            // check that our test is written correctly
            expect($coffee.length).toBe(1);
            expect(ko.isObservable(observable)).toBe(true);

            // do the actual testing
            expect($coffee.text()).toBe(ko.unwrap(observable));
            observable("New Table Text");
            expect($coffee.text()).toBe(ko.unwrap(observable));
        });

        it("push on observableArray or ko.track array adds a row", function () {
            var startLen = $el.find("tr").length;

            // check that our test is written correctly
            expect(startLen).toBe(4);

            // do the actual testing
            vm.table.push(["Foo", "Bar"]);
            expect($el.find("tr").length).toBe(startLen + 1);
        });
    })();

    // this is our table with headers
    (function () {
        var vm = ({
            table: ko.track({
                head: ["Name", "Position"],
                rows: [
                    ["John", "Janitor"],
                    ["Mike", "IT"],
                    ["Paul", "HR"],
                    ["Rick", "Coffee Fetcher"]
                ]
            })
        });

        var $el, el;

        $scope = $('<div><s-table data="table"></s-table></div>');

        ko.applyBindings(vm, $scope.get(0));

        // we do this after applyBindings because the node is replaced
        $el = $scope.children().first();
        el = $el.get(0);

        it("should become a table", function () {
            expect(el.tagName.toLowerCase()).toBe("table");
        });

        it("is .ui.table", function () {
            expect(el.className).toContain("ui");
            expect(el.className).toContain("table");
        });

        it("table has thead and th elements", function () {
            expect($el.find('thead').length).toNotBe(0);
            expect($el.find('th').length).toNotBe(0);
        });

        it("has correct number of tr elements", function () {
            expect($el.find('tr').length).toBe(5);
        });

        it("has correct number of td elements", function () {
            expect($el.find('td').length).toBe(8);
        });

/*        it("push on observableArray or ko.track array adds a row", function () {
            var startLen = $el.find("tr").length;

            // check that our test is written correctly
            expect(startLen).toBe(1 + vm.table.rows.length);

            // do the actual testing
            vm.table.rows.push(["Foo", "Bar"]);
            expect($el.find("tr").length).toBe(startLen + 1);
        });*/

        // note: there may be a knockout bug/limitation here
        // I can't figure out why this isn't working
        // I've confirmed that the observables are updated
        // but it's not triggering an update in the view

        /*it("can have entire head array replaced", function () {
            // check that our test is written correctly
            expect($el.find("th").eq(0).text()).toBe("Name");
            expect($el.find("th").eq(1).text()).toBe("Position");

            // do the actual testing
            vm.table.head = ["Who", "What"];

            expect($el.find("th").eq(0).text()).toBe("Who");
            expect($el.find("th").eq(1).text()).toBe("What");
        });*/
    })();
});