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

function difference(array, ...values) {
    //要排除的数组不止一个
    var result = []
    var newvalues = values[0]
    for (var j = 1 ; j < values.length; j++) {
        newvalues = newvalues.concat(values[j])
    }
    console.log(newvalues)
    for (var i = 0; i < array.length; i++) {
        if(findIn(newvalues, array[i]) == -1) {
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

// function flatten(ary) {
//     var result = []
//     for (var item of ary) {
//         if (Array.isArray(item)) {
//             for (var val of item) {
//                 result.push(val)
//             }
//         } else {
//             result.push(item)
//         }
//     }
//     return result
// }

function flatten(ary) {
    var result = []
    for (var item of ary) {
        if (Array.isArray(item)) {
            result.push(...item)
        } else {
            result.push(item)
        }
    }
    return result
}

function flattenDeep(ary) {
    var result = []
    for (var item of ary) {
        if (Array.isArray(item)) {
            //递归
            var flattedItem = flattenDeep(item)
            result.push(...flattedItem)
        } else {
            result.push(item)
        }
    }
    return result
}

function flattenDepth(ary, depth = 1) {
    if (depth == 0) {
        return ary.slice()
    }
    var result = []
    for (var item of ary) {
        if (Array.isArray(item)) {
            //递归
            var flattedItem = flattenDepth(item, depth - 1)
            result.push(...flattedItem)
        } else {
            result.push(item)
        }
    }
    return result
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
    flatten,
    flattenDeep,
    flattenDepth,
}

}()
