function chunk(array, size = 1) {
    var left = array.length
    var i = 0
    var result = []
    while (left >= size) {
        var arr = array.slice(i, i + size)
        result.push(arr)
        i = i + size
        left = left - size
    }
    if (left == 0) {
        return result
    } else {
        result.push(array.slice(i))
        return result
    }
}
