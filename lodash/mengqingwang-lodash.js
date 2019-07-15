var mengqingwang = {

iteratee: function(action) {
    if (typeof action === 'string') {
        return property(action)
    } else if (Array.isArray(action)) {
        return matches(action)
    } else if (typeof action === 'object') {
        return matchProperty(action)
    } else return action
},

property: function(str) {
    return function(obj) {
        return obj[str]
    }
},

matches: function(arr) {
    return function (obj) {
        return obj[arr[0]] === arr[1]
    }
},

matchProperty: function(m) {
    return function (obj) {
        for (let key in m) {
            if (obj[key] != m[key]) {
                return false
            }
        }
        return true
    }
},

findIndex: function(array, predicate, fromIndex = 0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1
}

}
