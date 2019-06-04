const moment = require('moment')
const utils = require('./utils')

$('[data-toggle="tooltip"]').tooltip();

let timerFrontGeneralNewArea = 0;
let timerFrontRelativeNewArea = 0;

let playPause = ['play', 'pause'];
let workRest = ['work', 'rest']

let generalWorkElement = $('div.total-work > h4')
let genrealRestElement = $('div.total-rest > h4')

let workTime = $('#work-time').val() * 60
let shortRestTime = $('#short-rest-time').val() * 60
let longRestTime = $('#long-rest-time').val() * 60

let generalCount = $('div.general-count > h4')

let generalWorkTime = workTime * 4
let generalRestTime = (3 * shortRestTime + longRestTime)

let generalWorkCountTime = 0
let generalRestCountTime = 0

let faseWorkCount = 1;
let faseRestCount = 1;

let timer = $('.timer>h1')
let timerSeconds = 0;
let timerText = '';
let timerInterval = null;

let generalQueue = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
let fase = generalQueue.pop()

let maximunRelativeTimer = 0;
let maximunGeneralTimer = 0;
let auxContGeneralTimer = 0;
let auxContGeneralWorkTimer = 0;
let auxContGeneralRestTimer = 0;

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
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralArea)
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeArea)
    return
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
    console.log(timerSeconds)
    if (fase === 'w') {
        maximunRelativeTimer = workTime
        maximunGeneralTimer = generalWorkTime;
        auxContGeneralTimer = auxContGeneralWorkTimer
        generalCount.text(faseWorkCount.toString() + '/4')
    }
    if (fase === 'sr') {
        maximunRelativeTimer = shortRestTime
        maximunGeneralTimer = generalRestTime
        auxContGeneralTimer = auxContGeneralRestTimer
        generalCount.text(faseRestCount.toString() + '/4')
    }
    if (fase === 'lr') {
        maximunRelativeTimer = longRestTime
        maximunGeneralTimer = generalRestTime
        auxContGeneralTimer = auxContGeneralRestTimer
        generalCount.text(faseRestCount.toString() + '/4')
    }



    if (timerSeconds >= maximunRelativeTimer) {
        if (fase === 'w') {
            faseWorkCount++;
            generalWorkCountTime++
            auxContGeneralWorkTimer += workTime
        }
        if (fase === 'sr') {
            faseRestCount++;
            generalRestCountTime++
            auxContGeneralRestTimer += shortRestTime
        }
        if (fase === 'lr') {
            faseRestCount++;
            generalRestCountTime++
            auxContGeneralRestTimer += longRestTime
        }

        if (generalQueue.length === 0) {
            faseWorkCount = 1;
            faseRestCount = 1;
            auxContGeneralWorkTimer = 0;
            auxContGeneralRestTimer = 0;
            generalQueue = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
            fase = generalQueue.pop()
        }


        fase = generalQueue.pop()
        workRest = utils.changeIcon(workRest)
        $('.play-pause').click()
        $('.reset').click()

    }


    timerSeconds = moment.duration('00:' + timer.text()).asSeconds()
    timerSeconds++
    timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    timer.text(timerText)

    timerFrontRelativeNewArea = timerFrontRelativeArea * (1 - timerSeconds / maximunRelativeTimer);
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeNewArea)


    timerFrontGeneralNewArea = timerFrontGeneralArea * (1 - (timerSeconds + auxContGeneralTimer) / maximunGeneralTimer);
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralNewArea)
    console.log(maximunGeneralTimer)

    let percentage = utils.adjustZeros(Math.floor(100 * timerSeconds / maximunRelativeTimer).toString())
    timerRelativePercentage.text(percentage + '%')

    generalWorkElement.text(utils.adjustZeros(generalWorkCountTime.toString()))
    genrealRestElement.text(utils.adjustZeros(generalRestCountTime.toString()))

}

