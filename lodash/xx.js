function findIn(s1, s2) {
    /* s2 长度为 1 */
    let index = -1
    for (var i = 0; i < s1.length; i++) {
        var n = s1[i]
        if (n === s2) {
            index = i
            break
        }
    }
    return index
}

function difference(array, values) {
    var result = []
    for (var i = 0; i < array.length; i++) {
        if(findIn(values, array[i]) == -1) {
            result.push(array[i])
        }
    }
    return result
}

console.log(difference([2, 1], [2, 3]))
