
const moment = require('moment')
const utils = require('./utils')
const renderer = require('./renderer')



$('[data-toggle="tooltip"]').tooltip();
let audio = new Audio('../sounds/alarm.mp3')

let workTooltipElement = $('div.total-work')
let restTooltipElement = $('div.total-rest')

let timerFrontGeneralNewArea = 0;
let timerFrontRelativeNewArea = 0;

let playPause = ['play', 'pause'];
let workRest = ['work', 'rest']

let generalWorkElement = $('div.total-work > h4')
let genrealRestElement = $('div.total-rest > h4')

let workTimeValue = $('#work-time')
let shortRestTimeValue = $('#short-rest-time')
let longRestTimeValue = $('#long-rest-time')

let workTime = workTimeValue.val() * 60
let shortRestTime = shortRestTimeValue.val() * 60
let longRestTime = longRestTimeValue.val() * 60

let generalCount = $('div.general-count > h4')

let generalWorkTime = workTime * 4
let generalRestTime = (3 * shortRestTime + longRestTime)

let generalWorkCountTotal = 0
let generalRestCountTotal = 0

let generalWorkTimeTotal = 0
let generalRestTimeTotal = 0

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

let generalWorkTimeTotalText = '00:00:00';
let generalRestTimeTotalText = '00:00:00';

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

let resetRelativeTimer = () => {
    console.log('reseted')
    timer.text('00:00')
    timerSeconds = 0
    timerRelativePercentage.text('00%')
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeArea)
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralArea)
}

$('.reset').on('click', resetRelativeTimer)

$('.button-save').on('click', () => {
    renderer.save({
        workTimeValue: workTimeValue.val(),
        shortRestTimeValue: shortRestTimeValue.val(),
        longRestTimeValue: longRestTimeValue.val(),
        faseWorkCount: faseWorkCount,
        faseRestCount: faseRestCount,
        generalQueue: generalQueue,
        generalWorkCountTotal: generalWorkCountTotal,
        generalRestCountTotal: generalRestCountTotal,
        generalWorkTimeTotalText: generalWorkTimeTotalText,
        generalRestTimeTotalText: generalRestTimeTotalText,
        fase: fase,
    })
    $('.close').click()
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
        let stopNotification = new Notification('Stopped Counter')
        console.log(stopNotification)
        clearInterval(timerInterval)
        stopNotification.onclose = function () {
            utils.stopAudio(audio)
        }
        return
    }
})

incrementSeconds = () => {
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



    if (timerSeconds >= maximunRelativeTimer - 1) {
        console.log(timerSeconds)
        if (fase === 'w') {
            faseWorkCount++;
            generalWorkCountTotal++
            auxContGeneralWorkTimer += workTime

            generalWorkTimeTotal = generalWorkCountTotal * workTime
            generalWorkTimeTotalText = moment().startOf('day').seconds(generalWorkTimeTotal).format("HH:mm:ss");
            workTooltipElement.attr('data-original-title', generalWorkTimeTotalText)
        }
        if (fase === 'sr') {
            faseRestCount++;
            generalRestCountTotal++
            auxContGeneralRestTimer += shortRestTime

            let auxRestCountTotal = Math.floor(generalRestCountTotal / 4)
            generalRestTimeTotal = (generalRestCountTotal - auxRestCountTotal) * shortRestTime + auxRestCountTotal * longRestTime
            generalRestTimeTotalText = moment().startOf('day').seconds(generalRestTimeTotal).format("HH:mm:ss");
            restTooltipElement.attr('data-original-title', generalRestTimeTotalText)
        }
        if (fase === 'lr') {
            faseRestCount++;
            generalRestCountTotal++
            auxContGeneralRestTimer += longRestTime

            let auxRestCountTotal = Math.floor(generalRestCountTotal / 4)
            generalRestTimeTotal = (generalRestCountTotal - auxRestCountTotal) * shortRestTime + auxRestCountTotal * longRestTime
            generalRestTimeTotalText = moment().startOf('day').seconds(generalRestTimeTotal).format("HH:mm:ss");
            restTooltipElement.attr('data-original-title', generalRestTimeTotalText)
        }

        if (generalQueue.length === 0) {
            faseWorkCount = 1;
            faseRestCount = 1;
            auxContGeneralWorkTimer = 0;
            auxContGeneralRestTimer = 0;
            generalQueue = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
        }


        fase = generalQueue.pop()
        workRest = utils.changeIcon(workRest)
        $('.play-pause').click()
        utils.playAudio(audio, 4)
        setTimeout(() => {
            resetRelativeTimer();
        }, 1000)
        renderer.save({
            workTimeValue: workTimeValue.val(),
            shortRestTimeValue: shortRestTimeValue.val(),
            longRestTimeValue: longRestTimeValue.val(),
            faseWorkCount: faseWorkCount,
            faseRestCount: faseRestCount,
            generalQueue: generalQueue,
            generalWorkCountTotal: generalWorkCountTotal,
            generalRestCountTotal: generalRestCountTotal,
            generalWorkTimeTotalText: generalWorkTimeTotalText,
            generalRestTimeTotalText: generalRestTimeTotalText,
            fase: fase,
        })

    }


    timerSeconds = moment.duration('00:' + timer.text()).asSeconds()
    timerSeconds++
    timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    timer.text(timerText)

    timerFrontRelativeNewArea = timerFrontRelativeArea * (1 - timerSeconds / maximunRelativeTimer);
    timerFrontRelative.attr('stroke-dashoffset', timerFrontRelativeNewArea)


    timerFrontGeneralNewArea = timerFrontGeneralArea * (1 - (timerSeconds + auxContGeneralTimer) / maximunGeneralTimer);
    timerFrontGeneral.attr('stroke-dashoffset', timerFrontGeneralNewArea)

    let percentage = utils.adjustZeros(Math.floor(100 * timerSeconds / maximunRelativeTimer).toString())
    timerRelativePercentage.text(percentage + '%')

    generalWorkElement.text(utils.adjustZeros(generalWorkCountTotal.toString()))
    genrealRestElement.text(utils.adjustZeros(generalRestCountTotal.toString()))




}

