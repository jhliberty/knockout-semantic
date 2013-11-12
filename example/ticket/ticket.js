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
                return -2;
            }
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
     * @param which an array containing ticket info
     */
    self.buy = function (data) {
        var transaction = {
            name: data[0],
            basePrice: data[2]
        };

        // grab the ticket type
        transaction.kind = data[0];

        transaction.quantity = 1;

        // increment and decrement function
        transaction.increment = function(){
            transaction.quantity++;
        };

        transaction.decrement = function(){
            var quantity = transaction.quantity;
            if (quantity > 1) {
                transaction.quantity--;
            }
        };

        // define a custom price property
        ko.defineProperty(transaction, "price", function () {
            // remove all characters except digits and decimals
            var price = transaction.basePrice.replace(/[^\d.]+/g, '');

            console.log(price, transaction.quantity, self.promo.priceMultiplier());

            // then get the price by multiplying it by the promo price
            return self.promo.priceMultiplier() * price * transaction.quantity;
        });

        // only need to track the quantity
        ko.track(transaction, ["quantity"]);

        // we set it at the end, because otherwise it'll try to update the view before it's implemented
        self.transaction = transaction;
    };

    // default the transaction to nothing
    self.transaction = null;

    ko.track(self);
}

