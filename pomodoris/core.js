// requires 
const moment = require('moment')
const utils = require('./utils')
const renderer = require('./renderer')
const element = require('./element')

// Initialize tooltip
$('[data-toggle="tooltip"]').tooltip();
// Initialize audio tag
let audio = new Audio('../sounds/alarm.mp3')

// Array to change play pause icons
let playPause = ['play', 'pause'];

//Initialize fase and faselist
let faseList = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
let fase = faseList.pop()

// Fase count and list
let faseWorkCount = 1
let faseRestCount = 1

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
let timerSeconds = 0;
// Initialize timer text
let timerText;
// Initialize timer interval
let timerInterval;

// Initialize maximun relative timer
let maximunRelativeTimer;

// Initialize maximun general timer
let maximunGeneralTimer;

// Initialize timers total text
let generalWorkTimeTotalText = '00:00:00';
let generalRestTimeTotalText = '00:00:00';

// Initialize percentage
let percentage;

// Input values
let workTime
let shortRestTime
let longRestTime
let generalWorkTime
let generalRestTime

// Initialize the variables dependet of inputs
initializeInputValues = () => {
    // Pass de value of form to seconds
    workTime = element.workTimeValue.val() * 60 // Work time
    shortRestTime = element.shortRestTimeValue.val() * 60 // short rest time
    longRestTime = element.longRestTimeValue.val() * 60 // long rest time

    // Total work time in a cicle (seconds)
    generalWorkTime = workTime * 4
    // Total rest time in a cicle (seconds)
    generalRestTime = (3 * shortRestTime + longRestTime)
}

// Initialize variables with database
renderer.init().then((data) => {
    // if is first initialied database is empty
    if (Object.entries(data).length === 0 && data.constructor === Object) {
        console.log('Aplication First Init')
    }
    else {
        // get data of database
        generalRestCountTotal = data.generalRestCountTotal
        generalWorkCountTotal = data.generalWorkCountTotal
        generalRestTimeTotalText = data.generalRestTimeTotalText
        generalWorkTimeTotalText = data.generalWorkTimeTotalText
        fase = data.fase
        faseList = data.faseList
        faseRestCount = data.faseRestCount
        faseWorkCount = data.faseWorkCount
        element.workTimeValue.val(data.workTimeValue)
        element.shortRestTimeValue.val(data.shortRestTimeValue)
        element.longRestTimeValue.val(data.longRestTimeValue)

    }
    initializeInputValues()
    calculate()
    render()
    resetRelativeTimer()
})

// save variables in database
let saveDatabase = () => {
    renderer.save({
        workTimeValue: element.workTimeValue.val(),
        shortRestTimeValue: element.shortRestTimeValue.val(),
        longRestTimeValue: element.longRestTimeValue.val(),
        faseWorkCount: faseWorkCount,
        faseRestCount: faseRestCount,
        faseList: faseList,
        fase: fase,
        generalWorkCountTotal: generalWorkCountTotal,
        generalRestCountTotal: generalRestCountTotal,
        generalWorkTimeTotalText: generalWorkTimeTotalText,
        generalRestTimeTotalText: generalRestTimeTotalText,
    })
}

// Reset elements of relative timer
let resetRelativeTimer = () => {
    timerSeconds = 0;
    element.timer.text('00:00')
    element.timerRelativePercentage.text('00%')
    element.timerFrontRelative.attr('stroke-dasharray', timerRelativeArea)
    element.timerFrontRelative.attr('stroke-dashoffset', timerRelativeArea)
    element.timerFrontGeneral.attr('stroke-dasharray', timerGeneralArea)
    element.timerFrontGeneral.attr('stroke-dashoffset', timerGeneralArea)
}

// Reset fo factory
element.buttonClear.on('click', () => {
    generalWorkCountTotal = 0
    generalRestCountTotal = 0
    generalWorkTimeTotalText = "00:00:00"
    generalRestTimeTotalText = "00:00:00"
    sumWorkGeneralTime = 0
    sumRestGeneralTime = 0
    faseRestCount = 1
    faseWorkCount = 1
    faseList = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
    fase = faseList.pop()
    initializeInputValues()
    utils.changeIcon(fase)
    saveDatabase()
    render()
    resetRelativeTimer()
    element.buttonClose.click()
})
// Function verify is cicle complete
isCicleComplete = () => {
    if (faseList.length === 0) {
        return true
    }
    else {
        return false
    }
}
// Function verify is fase in end
isEndFase = () => {
    if (timerSeconds >= maximunRelativeTimer) {
        return true
    }
    else {
        return false
    }
}

// Calculate all changes
calculate = () => {
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


    // Verify if fase is ended
    if (isEndFase()) {
        // Increment counter for fase
        switch (fase) {
            case 'w':
                faseWorkCount++
                sumWorkGeneralTime += workTime
                generalWorkCountTotal++
                break;
            case 'sr':
                faseRestCount++
                sumRestGeneralTime += shortRestTime
                generalRestCountTotal++
                break;
            case 'lr':
                faseRestCount++
                sumRestGeneralTime += longRestTime
                generalRestCountTotal++
                break;
        }
        // Calculate tooltip rest timer total
        auxRestCountTotal = Math.floor(generalRestCountTotal / 4)
        generalRestTimeTotal = (generalRestCountTotal - auxRestCountTotal) * shortRestTime + auxRestCountTotal * longRestTime
        generalRestTimeTotalText = moment().startOf('day').seconds(generalRestTimeTotal).format("HH:mm:ss");

        // Calculate work time total tooltip
        generalWorkTimeTotal = generalWorkCountTotal * workTime
        generalWorkTimeTotalText = moment().startOf('day').seconds(generalWorkTimeTotal).format("HH:mm:ss");

        // If is pomodoris cicle complete
        if (isCicleComplete()) {
            sumRestGeneralTime = 0
            sumWorkGeneralTime = 0
            faseRestCount = 1
            faseWorkCount = 1
            faseList = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr'].reverse()
        }
        // Get Next Fase
        fase = faseList.pop()

        // Pause timer
        element.playPause.click()
        // Play audio tag
        // utils.playAudio(audio, 4)
        // Reset the timer
        setTimeout(() => {
            resetRelativeTimer();
        }, 1000)

        saveDatabase()

    }

}

// Render the elements
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
    // Change work rest icon
    utils.changeIcon(fase)
}

// Reset relative time 
element.reset.on('click', resetRelativeTimer)

// Save changes in configuration
element.buttonSave.on('click', () => {
    initializeInputValues()
    saveDatabase()
    element.buttonClose.click()
})

// Play pause button
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

