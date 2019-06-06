// requires 
const moment = require('moment')
const utils = require('./utils')
const renderer = require('./renderer')
const element = require('./element')
const counter = require('./counter')

// Initialize tooltip
$('[data-toggle="tooltip"]').tooltip();
// Initialize audio tag
let audio = new Audio('../sounds/alarm.mp3')

// Array to change play pause icons
let playPause = ['play', 'pause'];
// Array to chagen work rest icons
let workRest = ['work', 'rest']

// Initialize fase counters
let faseWorkCount = counter.workCounterNext();
let faseRestCount = counter.restCounterNext();

// Pass de value of form to seconds
let workTime = element.workTimeValue.val() * 60 // Work time
let shortRestTime = element.shortRestTimeValue.val() * 60 // short rest time
let longRestTime = element.longRestTimeValue.val() * 60 // long rest time

// Total work time in a cicle (seconds)
let generalWorkTime = workTime * 4
// Total rest time in a cicle (seconds)
let generalRestTime = (3 * shortRestTime + longRestTime)

// Initializate sumatorium 
let sumRestGeneralTime = 0;
let sumWorkGeneralTime = 0;
// Initialize sum general time
let sumGeneralTime;

// Initialize general counters
let generalWorkCountTotal = 0
let generalRestCountTotal = 0

// Initialize timer areas
let timerGeneralNewArea;
let timerRelativeNewArea;

// Initialize relative area and radius
const timerRelativeRadius = parseFloat(element.timerFrontRelative.attr('r'))
const timerRelativeArea = 2 * Math.PI * timerRelativeRadius;

// Initialize general area and radius
const timerGeneralRadius = parseFloat(element.timerFrontGeneral.attr('r'))
const timerGeneralArea = 2 * Math.PI * timerGeneralRadius;

// Initialize stroke from relative and general
element.timerFrontRelative.attr('stroke-dasharray', timerRelativeArea)
element.timerFrontRelative.attr('stroke-dashoffset', timerRelativeArea)
element.timerFrontGeneral.attr('stroke-dasharray', timerGeneralArea)
element.timerFrontGeneral.attr('stroke-dashoffset', timerGeneralArea)

// Initialize timer seconds
let timerSeconds;
// Initialize timer text
let timerText;
// Initialize timer interval
let timerInterval;

// Initialize fase and faseList
[fase, faseList] = counter.faseCounterNext()

// Initialize maximun relative timer
let maximunRelativeTimer;

// Initialize maximun general timer
let maximunGeneralTimer;

// Initialize timers total text
let generalWorkTimeTotalText = '00:00:00';
let generalRestTimeTotalText = '00:00:00';

// Initialize percentage
let percentage;


let resetRelativeTimer = () => {
    element.timer.text('00:00')
    element.timerRelativePercentage.text('00%')
    element.timerFrontRelative.attr('stroke-dasharray', timerRelativeArea)
    element.timerFrontRelative.attr('stroke-dashoffset', timerRelativeArea)
    element.timerFrontGeneral.attr('stroke-dasharray', timerGeneralArea)
    element.timerFrontGeneral.attr('stroke-dashoffset', timerGeneralArea)
}

isCicleComplete = () => {
    if (faseList.length === 0) {
        return true
    }
    else {
        return false
    }
}

isEndFase = () => {
    if (timerSeconds >= maximunRelativeTimer) {
        return true
    }
    else {
        return false
    }
}

calculate = () => {
    console.log(sumWorkGeneralTime, sumRestGeneralTime)
    // increment seconds
    timerSeconds = moment.duration('00:' + element.timer.text()).asSeconds()
    timerSeconds++
    // Select maximun relative time to fase
    switch (fase) {
        case 'w':
            maximunRelativeTimer = workTime // Maximun relative time in work fase
            maximunGeneralTimer = generalWorkTime; // Maximun general time in work fase
            sumGeneralTime = sumWorkGeneralTime
            break;
        case 'sr':
            maximunRelativeTimer = shortRestTime
            maximunGeneralTimer = generalRestTime;
            sumGeneralTime = sumRestGeneralTime
            break;
        case 'lr':
            maximunRelativeTimer = longRestTime
            maximunGeneralTimer = generalRestTime;
            sumGeneralTime = sumRestGeneralTime
            break;
    }
    // calculate percentage
    percentage = utils.adjustZeros(Math.floor(100 * timerSeconds / maximunRelativeTimer).toString())

    // Calculate area from relative timer
    timerRelativeNewArea = timerRelativeArea * (1 - timerSeconds / maximunRelativeTimer);

    // Calculate area from general tiemer
    timerGeneralNewArea = timerGeneralArea * (1 - (timerSeconds + sumGeneralTime) / maximunGeneralTimer);

    // Calculate tooltip rest timer total
    auxRestCountTotal = Math.floor(generalRestCountTotal / 4)
    generalRestTimeTotal = (generalRestCountTotal - auxRestCountTotal) * shortRestTime + auxRestCountTotal * longRestTime
    generalRestTimeTotalText = moment().startOf('day').seconds(generalRestTimeTotal).format("HH:mm:ss");

    // Calculate work time total tooltip
    generalWorkTimeTotal = generalWorkCountTotal * workTime
    generalWorkTimeTotalText = moment().startOf('day').seconds(generalWorkTimeTotal).format("HH:mm:ss");

    // Verify if fase is ended
    if (isEndFase()) {
        // Increment counter for fase
        switch (fase) {
            case 'w':
                faseWorkCount = counter.workCounterNext()
                sumWorkGeneralTime += workTime
                generalWorkCountTotal++
                break;
            case 'sr':
                faseRestCount = counter.restCounterNext()
                sumRestGeneralTime += shortRestTime
                generalRestCountTotal++
                break;
            case 'lr':
                faseRestCount = counter.restCounterNext()
                sumRestGeneralTime += longRestTime
                generalRestCountTotal++
                break;
        }
        // Get Next Fase
        [fase, faseList] = counter.faseCounterNext()
        // Change work rest icon
        workRest = utils.changeIcon(workRest)
        // Pause timer
        element.playPause.click()
        // Play audio tag
        // utils.playAudio(audio, 4)
        // Reset the timer
        setTimeout(() => {
            resetRelativeTimer();
        }, 1000)

        // If is pomodoris cicle complete
        if (isCicleComplete()) {
            sumRestGeneralTime = 0
            sumWorkGeneralTime = 0
        }
    }
}

render = () => {
    // Render timer
    timerText = moment().startOf('day').seconds(timerSeconds).format("mm:ss");
    element.timer.text(timerText)

    // Render pecentage
    element.timerRelativePercentage.text(percentage + '%')

    // Render timer Relative
    element.timerFrontRelative.attr('stroke-dashoffset', timerRelativeNewArea)

    // Render timer general
    element.timerFrontGeneral.attr('stroke-dashoffset', timerGeneralNewArea)

    // Render work count total
    element.generalWorkElement.text(utils.adjustZeros(generalWorkCountTotal.toString()))

    // Render rest count total
    element.genrealRestElement.text(utils.adjustZeros(generalRestCountTotal.toString()))

    // Render work tooltip
    element.workTooltipElement.attr('data-original-title', generalWorkTimeTotalText)

    // Render rest tooltip
    element.restTooltipElement.attr('data-original-title', generalRestTimeTotalText)

    // Render genral count according to the fase
    switch (fase) {
        case 'w':
            element.generalCount.text(faseWorkCount.toString() + '/4')
            break;
        case 'sr':
            element.generalCount.text(faseRestCount.toString() + '/4')
            break;
        case 'lr':
            element.generalCount.text(faseRestCount.toString() + '/4')
            break;
    }
}

// renderer.init().then((data) => {
//     fase = data.fase
//     faseRestCount = data.faseRestCount
//     faseWorkCount = data.faseWorkCount
//     generalQueue = data.generalQueue
//     generalRestCountTotal = data.generalRestCountTotal
//     generalRestTimeTotalText = data.generalRestTimeTotalText
//     generalWorkCountTotal = data.generalWorkCountTotal
//     generalWorkTimeTotalText = data.generalWorkTimeTotalText

//     longRestTime = data.longRestTimeValue * 60
//     shortRestTime = data.shortRestTimeValue * 60
//     workTime = data.workTimeValue * 60

//     element.longRestTimeValue.val(data.longRestTimeValue)
//     element.shortRestTimeValue.val(data.shortRestTimeValue)
//     element.workTimeValue.val(data.workTimeValue)

//     element.workTooltipElement.attr('data-original-title', generalWorkTimeTotalText)
//     element.restTooltipElement.attr('data-original-title', generalRestTimeTotalText)
// })

element.buttonClear.on('click', () => {
    generalWorkCountTotal = 0
    generalRestCountTotal = 0
    generalWorkTimeTotalText = "00:00:00"
    generalRestTimeTotalText = "00:00:00"
    sumWorkGeneralTime = 0
    sumRestGeneralTime = 0
    [fase, faseList] = counter.resetFaseCounter()
    console.log(fase, faseList)
    faseWorkCount = counter.resetWorkCounter()
    faseRestCount = counter.resetRestCounter()
    resetRelativeTimer()




    // renderer.save({
    //     workTimeValue: workTimeValue.val(),
    //     shortRestTimeValue: shortRestTimeValue.val(),
    //     longRestTimeValue: longRestTimeValue.val(),
    //     faseWorkCount: faseWorkCount,
    //     faseRestCount: faseRestCount,
    //     generalQueue: generalQueue,
    //     generalWorkCountTotal: generalWorkCountTotal,
    //     generalRestCountTotal: generalRestCountTotal,
    //     generalWorkTimeTotalText: generalWorkTimeTotalText,
    //     generalRestTimeTotalText: generalRestTimeTotalText,
    //     fase: fase,
    // })
    element.buttonClose.click()

})
element.reset.on('click', resetRelativeTimer)
element.buttonSave.on('click', () => {
    // renderer.save({
    //     workTimeValue: workTimeValue.val(),
    //     shortRestTimeValue: shortRestTimeValue.val(),
    //     longRestTimeValue: longRestTimeValue.val(),
    //     faseWorkCount: faseWorkCount,
    //     faseRestCount: faseRestCount,
    //     generalQueue: generalQueue,
    //     generalWorkCountTotal: generalWorkCountTotal,
    //     generalRestCountTotal: generalRestCountTotal,
    //     generalWorkTimeTotalText: generalWorkTimeTotalText,
    //     generalRestTimeTotalText: generalRestTimeTotalText,
    //     fase: fase,
    // })
    element.buttonClose.click()
})

element.playPause.on('click', () => {
    if (playPause[0] === 'play') {
        playPause = playPause.reverse()
        element.playIcon.hide()
        element.pauseIcon.show()
        element.playPauseText.text('Pause')
        new Notification('Counter Started')
        timerInterval = setInterval(incrementSeconds, 1000)
        return
    }
    if (playPause[0] === 'pause') {
        playPause = playPause.reverse()
        element.pauseIcon.hide()
        element.playIcon.show()
        element.playPauseText.text('Play')
        let stopNotification = new Notification('Stopped Counter')
        clearInterval(timerInterval)
        stopNotification.onclose = function () {
            utils.stopAudio(audio)
        }
        return
    }
})

incrementSeconds = () => {
    calculate()
    render()
}

