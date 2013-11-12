function TicketViewModel() {
    var self = this;

    self.ticketInfo = {
        head: ["Ticket Type", "Sales End", "Price", "Fee", "Quantity"],
        rows: [
            ["Developers", "December 2193", "$2.00", "$0.00", "100"],
            ["Early Bird", "January 2014", "$3.00", "$1.00", "100"],
            ["Regular", "December 2193", "$1,000.00", "$5.00", "100,000"]
        ]
    };

    /**
     * Handle the promo code and validation of it
     * You'd realistically do some AJAX in here to confirm that the code is valid
     * @type {Object}
     */
    self.promo = ko.track({
        hasPromo: false,
        code: "",
        isValid: function () {
            return self.promo.code === "semantic";
        },
        askForPromo: function () {
            self.promo.hasPromo = true;
        },
        /**
         * this lets us multiply the price depending on the if the promo is valid
         * @returns {number} the multiplier
         */
        priceMultiplier: function () {
            if (self.promo.isValid()) {
                // this could be hard coded, but I think it's easier to read like this
                // since it's advertised as "percent off", we need to change it to "percent of"
                return (100 - 99.3183) / 100;
            }
            // 1 is the normal price, because it won't modify the price when multiplied
            else {
                return 1;
            }
        }
    });

    /**
     * Allow toggling of some extra information
     * @type {Object}
     */
    self.help = ko.track({
        showing: false,
        show: function (data, event) {
            self.help.showing = !self.help.showing;

            event.preventDefault();
        }
    });

    /**
     * Buy a ticket
     * @param {String[]} which an array containing ticket info
     */
    self.buy = function (data) {

        // grab some data from the table
        var transaction = {
            name: data[0],

            // remove all characters except digits and the decimal; then cast them to numbers
            // so we may do math with them
            basePrice: Number(data[2].replace(/[^\d.]+/g, '')),
            fee: Number(data[3].replace(/[^\d.]+/g, ''))
        };

        // grab the ticket type
        transaction.kind = data[0];

        transaction.quantity = 1;

        // allow the user to buy more than one ticket
        transaction.increment = function(){
            transaction.quantity++;
        };

        // allow them to buy less, but no less than 1
        transaction.decrement = function(){
            var quantity = transaction.quantity;
            if (quantity > 1) {
                transaction.quantity--;
            }
        };

        // define a custom price property
        // this checks if they've typed a valid promo, and asks for the multiplier
        // it then figures out how much `quantity` tickets cost of this type,
        // and adds the processing fee
        ko.defineProperty(transaction, "price", function () {
            // then get the price by multiplying it by the promo price
            return self.promo.priceMultiplier() * transaction.basePrice * transaction.quantity + transaction.fee;
        });

        // only need to track the quantity because nothing else will change
        ko.track(transaction, ["quantity"]);

        // we set it at the end, because otherwise it'll try to update the view before it has all of the properties
        // which would throw errors
        self.transaction = transaction;
    };

    // default the transaction to nothing, which can be updated when `buy` is called
    self.transaction = null;

    ko.track(self);
}

