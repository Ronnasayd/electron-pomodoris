const moment = require('moment')
const utils = require('./utils')

let playPause = ['play', 'pause'];
let workTime = $('#work-time').val() * 60
let shortRestTime = $('#short-rest-time').val() * 60
let longRestTime = $('#long-rest-time').val() * 60

let timer = $('.timer>h1')
let timerSeconds = 0;
let timerText = '';
let timerInterval = null;


let timerFrontRelative = $('div.relative-timer-frente > svg > circle')
const timerFrontRelativeRadius = parseFloat(timerFrontRelative.attr('r'))
const timerFrontRelativeArea = 2 * Math.PI * timerFrontRelativeRadius;
timerFrontRelative.attr('stroke-dasharray', timerFrontRelativeArea)
timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeArea)


let timerFrontGeneral = $('div.general-timer-frente > svg > circle')
const timerFrontGeneralRadius = parseFloat(timerFrontGeneral.attr('r'))
const timerFrontGeneralArea = 2 * Math.PI * timerFrontGeneralRadius;
timerFrontGeneral.attr('stroke-dasharray', timerFrontGeneralArea)
timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralArea)


let timerRelativePercentage = $('div.percentege > h4')

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
    timerSeconds = moment.duration('00:' + timer.text()).asSeconds()
    timerSeconds++
    timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    timer.text(timerText)

    let timerFrontRelativeNewArea = timerFrontRelativeArea * (1 - timerSeconds / 60);
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeNewArea)


    let timerFrontGeneralNewArea = timerFrontGeneralArea * (1 - timerSeconds / 60);
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralNewArea)

    let percentage = utils.adjustZeros(Math.floor(100 * timerSeconds / 60).toString())
    timerRelativePercentage.text(percentage + '%')
    console.log(percentage)

}

