module.exports = {
    adjustZeros(string) {
        if (string.length === 1) {
            return '0' + string
        }
        else {
            return string
        }
    }
}