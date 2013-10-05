function Step(text, activeTest){
    this.text = ko.observable(text);

    if (typeof activeTest === "functon") {
        this.active = ko.computed(activeTest);
    }
    else {
        this.active = activeTest;
    }
}

module.exports = Step;