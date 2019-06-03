const moment = require('moment')

let playPause = ['play', 'pause'];
let workTime = $('#work-time').val() * 60
let shortRestTime = $('#short-rest-time').val() * 60
let longRestTime = $('#long-rest-time').val() * 60

let timer = $('.timer>h1')
let timerSeconds = 0;
let timerInterval = null;


$('.play-pause').on('click', () => {
    if (playPause[0] === 'play') {
        console.log('play')
        playPause = playPause.reverse()
        $('#play-icon').hide()
        $('#pause-icon').show()
        $('#play-pause-text').text('Pause')
        new Notification('Contador Iniciado')
        timerInterval = setInterval(incrementSeconds, 1000)
        return
    }
    if (playPause[0] === 'pause') {
        console.log('pause')
        playPause = playPause.reverse()
        $('#pause-icon').hide()
        $('#play-icon').show()
        $('#play-pause-text').text('Play')
        new Notification('Contador Parado')
        clearInterval(timerInterval)
        return
    }
})

incrementSeconds = () => {
    let timerSeconds = moment.duration('00:' + timer.text()).asSeconds()
    timerSeconds++
    let timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    timer.text(timerText)
    console.log(timerText)
}

