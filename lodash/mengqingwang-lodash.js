// var mengqingwang = {
//
//     findIndex:function(array, callback) {
//         let index = -1
//         let l = array.length
//         for (let i = 0; i < l; i++) {
//             let s = array[i]
//             if (callback(s)) {
//                 index = i
//                 break
//             }
//         }
//         return index
//     }
//
// }
var mengqingwang = (function () {

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

function findIndex(array, predicate, fromIndex = 0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1
}

})()
