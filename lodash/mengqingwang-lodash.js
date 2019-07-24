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

function property(propName) {
    return function(obj) {
        return obj[propName]
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
    for (var i = 0; i < array.length; i++) {
        if(findIn(newvalues, array[i]) == -1) {
            result.push(array[i])
        }
    }
    return result
}

function differenceBy(array, ...values) {
    //有多种情况要判断
    if (Array.isArray(values[values.length - 1])) {
        return difference(array, ...values)
    }
    var result = []
    var func = iteratee(values[values.length - 1])
    var newvalues = func(values[0])
    for (var j = 1 ; j < values.length - 1; j++) {
        newvalues = newvalues.concat(func(values[j]))
    }
    for (var i = 0; i < array.length; i++) {
        if(findIn(newvalues, func(array[i])) == -1) {
            result.push(array[i])
        }
    }
    return result
}

function drop(array, n = 1) {
    return array.slice(n)
}

function dropRight(array, n = 1) {
    if (n >= array.length) {
        n = array.length
    }
    return array.slice(0, array.length - n)
}

function fill(array, value, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
        array[i] = value
    }
    return array
}

function findIndex(array, predicate, fromIndex = 0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1;
}

function findLastIndex(array, predicate, fromIndex = array.length - 1) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i--) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1
}

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

function fromPairs(pairs) {
    var obj = {}
    for (var i = 0; i < pairs.length; i++) {
        obj[pairs[i][0]] = pairs[i][1]
    }
    return obj
}

function head(array) {
    if (array.length == 0) {
        return undefined
    } else return array[0]
}

function indexOf(array, value, fromIndex = 0) {
    if (fromIndex < 0) {
        fromIndex = fromIndex + array.length
    }
    for (var i = fromIndex; i < array.length; i++) {
        if (array[i] === value)
            return i
    }
    return -1
}

function initial(array) {
    array.pop()
    return array
}

function intersection(arrays) {
    //有点烦这个   先空着
}


function join(array, separator=',') {
    let s = array[0]
    for (let i = 1; i < array.length; i++) {
        // 从下标为 1 的元素开始, 把数组中每个元素拿出来
        // 加上分隔符之后再累加到 s 上
        let e = array[i]
        s += (separator + e)
    }
    return s
}

function last(array) {
    return array.pop()
}

function lastIndexOf(array, value, fromIndex=array.length-1) {
    if (fromIndex < 0) {
        fromIndex = fromIndex + array.length
    }
    for (var i = fromIndex; i < array.length; i--) {
        if (array[i] === value)
            return i
    }
    return -1
}

function nth(array, n = 0) {
    if (n < 0) {
        n = n + array.length
    }
    return array[n]
}

function pull(array, ...values) {
    for (var i = 0; i < array.length; i++) {
        if (findIn(values, array[i])) {
            array.splice(i, 1)
        }
    }
    return array
}

function pullAll(array, values) {
    for (var i = 0; i < array.length; i++) {
        if (findIn(values, array[i])) {
            array.splice(i, 1)
        }
    }
    return array
}

function reverse(array) {
    var result = [];
    for (var i = array.length - 1, i >= 0; i--) {
        result.push(array[i])
    }
    return result;
}

function sortedIndex(array, value) {
    var index = 0
    for (var i = 0, i < array.length; i++) {
        if (value >= array[i]) {
            index = i + 1
            break
        }
    return index
}

function sortedIndexOf(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}

function sortedLastIndex(array, value) {
    var index = 0
    for (var i = array.length - 1, i >= 0; i--) {
        if (value >= array[i]) {
            index = i + 1
            break
        }
    return index
}

function sortedLastIndexOf(array, value) {
    for (var i = array.length - 1, i >= 0; i--) {
        if (array[i] === value) {
            return i
        }
    }
    return -1
}

function sortedUniq(array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== array[i + 1]) {
            result.push(array[i])
        }
    }
    return result
}

function tail(array) {
    return array.slice(1)
}

function take(array, n = 1) {
    return array.slice(0, n)
}

function takeRight(array, n = 1) {
    if (n > array.length) {
        n = array.length
    }
    return array.slice(n - array.length)
}

// function union(...array) {
//
// }

function filter(ary,predicate) {
    //这句话没用
    // predicate = iteratee(predicate)
    var result = []
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            result.push(ary[i])
        }
    return result
    }
}

function every(ary, predicate) {
    //这句话有用   虽然我也不知道是什么意思
    predicate = iteratee(predicate)
    for (var i = 0; i < ary.length; i++) {
        if (!predicate(ary[i], i , ary)) {
            return false
        }
    }
    return true
}

function some(ary, predicate) {
    //这句话有用   虽然我也不知道是什么意思
    predicate = iteratee(predicate)
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            return true
        }
    }
    return false
}

function negate(f) {
    return function(...args) {
        return !f(...args)
    }
}

//返回一个函数   它调用原函数的时候参数顺序是倒过来的   但其实对求值结果没有什么影响
function flip(func) {
    return function(...args) {
        return func(...args.reverse())
    }
}

//调用func 函数n次      之后不再调用  返回第n次的结果
function before(n, func) {
    var times = 0
    var lastResult
    return function(...args) {
        times++
        if (times < n) {
            return lastResult = func(...args)
        } else {
            return lastResult
        }
    }
}

//调用func 函数n次      之后不再调用  返回第n次的结果
function after(n, func) {
    var times = 0
    return function(...args) {
        times++
        if (times < n) {
            return
        } else {
            return func(...args)
        }
    }
}

//调用func最多n参数   n后面的参数将被忽略
function ary(f, n = f.length) {
    return function (...args) {
        return f(...args.slice(0,n))
    }
}

//创建一个最多接受一个参数的函数，忽略任何其他参数。
function unary(f) {
    return ary(f, 1)
}

function spread(f) {
    return function(ary) {
        return f(...ary)
    }
}

function memoize(f) {
    var cache = {}
    return function(arg) {
        if (arg in cache) {
            return cache[arg]
        } else {
            return cache[arg] = f(arg)
        }
    }
}

//遍历数组，将符合条件的数据放在一起，最后返回一个分组后的二维数组
//https://blog.csdn.net/mafan121/article/details/83418116
function groupBy(ary, predicate) {
    //这句话有用   虽然我也不知道是什么意思
    predicate = iteratee(predicate)
    var result = {}
    for (var i = 0; i < ary.length; i++) {
        var groupKey = predicate(ary[i], i , ary)
        if (groupKey in result) {
            result[groupKey].push(ary[i])
        } else {
            result[groupKey] = [ary[i]]
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
    differenceBy,
    drop,
    dropRight,
    fill,
    findIndex,
    findLastIndex,
    flatten,
    flattenDeep,
    flattenDepth,
    fromPairs,
    head,
    indexOf,
    initial,
    // intersection,
    join,
    last,
    lastIndexOf,
    nth,
    pull,
    pullAll,
    reverse,
    sortedIndex,
    sortedIndexOf,
    sortedLastIndex,
    sortedLastIndexOf,
    sortedUniq,
    tail,
    take,
    takeRight,
    filter,
    every,
    some,
    negate,
    flip,
    before,
    after,
    ary,
    unary,
    spread,
    memoize,
    groupBy,
}

}()
