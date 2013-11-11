function TicketViewModel(){
    var self = this;

    self.ticketInfo = {
        head: ["Ticket Type", "Sales End", "Price", "Fee", "Quantity"],
        rows: [
            ["Developers", "December 2193", "$2.00", "$0.00", "100"],
            ["Early Bird", "January 2014", "$3.00", "$1.00", "100"],
            ["Regular", "December 2193", "$1,000.00", "$5.00", "100,000"]
        ]
    };

    self.promo = ko.track({
        hasPromo: false,
        code: "",
        isValid: function(){
            return self.promo.code === "semantic";
        },
        askForPromo: function(){
            self.promo.hasPromo = true;
        }
    });

    ko.track(self);
}

