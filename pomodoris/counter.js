let workRestBase = [1, 2, 3, 4]
let faseBase = ['w', 'sr', 'w', 'sr', 'w', 'sr', 'w', 'lr']
let workCounter = workRestBase.slice().reverse()
let restCounter = workRestBase.slice().reverse()
let faseCounter = faseBase.slice().reverse()

module.exports = {
    workCounterNext: () => {
        if (workCounter.length === 0) {
            workCounter = workRestBase.slice().reverse()
        }
        return workCounter.pop()
    },
    restCounterNext: () => {
        if (restCounter.length === 0) {
            restCounter = workRestBase.slice().reverse()
        }
        return restCounter.pop()
    },
    faseCounterNext: () => {
        if (faseCounter.length === 0) {
            faseCounter = faseBase.slice().reverse()
        }
        return [faseCounter.pop(), faseCounter]
    },
    resetFaseCounter: () => {
        faseCounter = faseBase.slice().reverse()
        return [faseCounter.pop(), faseCounter]
    },
    resetWorkCounter: () => {
        workCounter = workRestBase.slice().reverse()
        return workCounter.pop()
    },
    resetRestCounter: () => {
        restCounter = workRestBase.slice().reverse()
        return restCounter.pop()
    },
}

