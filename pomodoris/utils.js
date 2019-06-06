module.exports = {
    adjustZeros(string) {
        if (string.length === 1) {
            return '0' + string
        }
        else {
            return string
        }
    },
    changeIcon(fase) {
        if (fase === 'w') {
            $('#work-icon').show()
            $('#rest-icon').hide()
        }
        else {
            $('#work-icon').hide()
            $('#rest-icon').show()
        }

    },
    playAudio(audio, time) {
        audio.play();
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, time * 1000);
    },
    stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}