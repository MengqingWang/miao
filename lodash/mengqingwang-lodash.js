var mengqingwang = function() {

function iteratee(action) {
    if (typeof action === 'string') {
        return property(action)
    } else if (Array.isArray(action)) {
        return matches(action)
    } else if (typeof action === 'object') {
        return matchProperty(action)
    } else return action
}

function property(str) {
    return function(obj) {
        return obj[str]
    }
}

function matches(arr) {
    return function (obj) {
        return obj[arr[0]] === arr[1]
    }
}

function matchProperty(m) {
    return function (obj) {
        for (let key in m) {
            if (obj[key] != m[key]) {
                return false
            }
        }
        return true
    }
}

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

function compact(array) {
    return array.filter(it => it)
}

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

function findIndex(array, predicate, fromIndex = 0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1
}

return {
    iteratee,
    property,
    matches,
    matchProperty,
    chunk,
    compact,
    findIn,
    difference,
    findIndex,
}

}()
