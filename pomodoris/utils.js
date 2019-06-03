module.exports = {
    adjustZeros(string) {
        if (string.length === 1) {
            return '0' + string
        }
        else {
            return string
        }
    },
    changeIcon(iconsList) {
        if (iconsList[0] === 'work') {
            $('#work-icon').hide()
            $('#rest-icon').show()
            return iconsList.reverse()
        }
        if (iconsList[0] === 'rest') {
            $('#work-icon').show()
            $('#rest-icon').hide()
            return iconsList.reverse()
        }
        return null

    }
}