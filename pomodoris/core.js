const moment = require('moment')
const utils = require('./utils')

$('[data-toggle="tooltip"]').tooltip();


let playPause = ['play', 'pause'];
let workRest = ['work', 'rest']

let workTime = $('#work-time').val() * 60
let shortRestTime = $('#short-rest-time').val() * 60
let longRestTime = $('#long-rest-time').val() * 60


let timer = $('.timer>h1')
let timerSeconds = 0;
let timerText = '';
let timerInterval = null;

let generalQueue = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
let fase = generalQueue.pop()

let maximunRelativeTimer = 0;

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

$('.reset').on('click', () => {
    console.log('reseted')
    timer.text('00:00')
    timerRelativePercentage.text('00%')
})

$('.play-pause').on('click', () => {
    if (playPause[0] === 'play') {
        console.log('play')
        playPause = playPause.reverse()
        $('#play-icon').hide()
        $('#pause-icon').show()
        $('#play-pause-text').text('Pause')
        new Notification('Counter Started')
        timerInterval = setInterval(incrementSeconds, 1000)
        return
    }
    if (playPause[0] === 'pause') {
        console.log('pause')
        playPause = playPause.reverse()
        $('#pause-icon').hide()
        $('#play-icon').show()
        $('#play-pause-text').text('Play')
        new Notification('Stopped Counter')
        clearInterval(timerInterval)
        return
    }
})

incrementSeconds = () => {
    if (fase === 'w') {
        maximunRelativeTimer = workTime;
    }
    if (fase === 'sr') {
        maximunRelativeTimer = shortRestTime;
    }
    if (fase === 'lr') {
        maximunRelativeTimer = longRestTime;
    }

    if (timerSeconds >= maximunRelativeTimer) {
        fase = generalQueue.pop()
        console.log(fase)
        $('.reset').click()
        workRest = utils.changeIcon(workRest)
    }


    timerSeconds = moment.duration('00:' + timer.text()).asSeconds()
    timerSeconds++
    timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    timer.text(timerText)

    let timerFrontRelativeNewArea = timerFrontRelativeArea * (1 - timerSeconds / maximunRelativeTimer);
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeNewArea)


    let timerFrontGeneralNewArea = timerFrontGeneralArea * (1 - timerSeconds / maximunRelativeTimer);
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralNewArea)

    let percentage = utils.adjustZeros(Math.floor(100 * timerSeconds / maximunRelativeTimer).toString())
    timerRelativePercentage.text(percentage + '%')

}

