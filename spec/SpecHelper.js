beforeEach(function () {
    this.addMatchers({
        toBePlaying: function (expectedSong) {
            var player = this.actual;
            return player.currentlyPlayingSong === expectedSong &&
                player.isPlaying;
        }
    });
});


utils = {
    getEl: function (id) {
        return $('#' + id);
    }
};
