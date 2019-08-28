function xor(...arrays) {
    var arr = [].concat(...arrays)
    var unique = uniq(arr)
    var count = Array(unique.length).fill(0) //计数器数组 跟去重数组的下标一一对应 表示的是unique数组中每个数字出现的次数
    var result = []
    for (var i = 0; i < arr.length; i++) {
        var index = findIn(unique, arr[i])
        count[index] += 1
    }
    for (var i = 0; i < count.length; i++) {
        if (count[i] == 1) {
            result.push(unique[i])
        }
    }
    return result
}

//console.log(xor([2, 1], [2, 3]))

// function zip(...arrays) {
//     // 暂时不考虑各个数组里面元素个数不等的情况   也就是各个数组里面元素的个数相等
//     var result = []
//     var l = arrays[0].length
//     for (var i = 0; i < l; i++) {
//         result.push  //崩了  需要双重循环 不写下去了
//
// }

//arrays有三个小数组   每个小数组有两个元素
//这个好像就是力扣的867矩阵转置啊
function zip(...arrays) {
  return arrays[0].map((_,index)=>arrays.map(row=>row[index]))
}

//console.log(zip(['fred', 'barney'], [30, 40], [true, false]))

function zipObject(props = [], values = []) {
    var map = {}
    for (var i = 0; i < props.length; i++) {
        map[props[i]] = values[i];
    }
    return map;
}

// function iteratee(action) {
//     if (typeof action === 'string') {
//         return property(action)
//     } else if (Array.isArray(action)) {
//         return matches(action)
//     } else if (typeof action === 'object') {
//         return matchProperty(action)
//     } else return action
// }
//
// function property(propName) {
//     return function(obj) {
//         return obj[propName]
//     }
// } //如果 func 是一个属性名，传入包含这个属性名的对象，回调返回对应属性名的值。
//
// function matches(arr) {
//     return function (obj) {
//         return obj[arr[0]] === arr[1]
//     }
// }
//
// function matchProperty(m) {
//     return function (obj) {
//         for (let key in m) {
//             if (obj[key] != m[key]) {
//                 return false
//             }
//         }
//         return true
//     }
// }


// function iteratee(action) {
//     if (typeof action === 'string') {
//         return property(action)
//     } else if (typeof action === 'object') {
//         return matches(action)
//     } else if (Array.isArray(action)) {
//         return matchProperty(action)
//     } else return action
// }
//
// function property(propName) {
//     return function(obj) {
//         return obj[propName]
//     }
// } //如果 func 是一个属性名，传入包含这个属性名的对象，回调返回对应属性名的值。
//
// function matches(arg) {
//     return function (obj) {
//         return obj[arg[0]] === arg[1]
//     }
// }
//
// function matchProperty(arr) {
//     return function (obj) {
//         for (let key in array) {
//             if (obj[key] != arr[key]) {
//                 return false
//             }
//         }
//         return true
//     }
// }

function iteratee(argument) {
    if (Object.prototype.toString.call(argument) === "[object String]") {
        return function (object) {
            return object[argument]
        }
    } else if (Object.prototype.toString.call(argument) === "[object Object]") {
        return function (object) {
            for(var key in argument) {
                if(argument[key] !== object[key]) {
                    return false
                }
            }
            return true
        }
    } else if (Object.prototype.toString.call(argument) === "[object Array]") {
        return function (object) {
            for (var i = 0; i < argument.length - 1; i += 2) {
                if (object[argument[i]] !== argument[i + 1]) {
                    return false
                }
            }
            return true
        }
    } else if (Object.prototype.toString.call(argument) === "[object RegExp]") {
        return function(object) {
            return argument.test(object)
        }
    } else if (Object.prototype.toString.call(argument) === "[object Function]") {
        return argument
    }
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

function differenceBy(array, ...values) {
    //有多种情况要判断
    if (Array.isArray(values[values.length - 1])) {
        return difference(array, ...values)
    }
    var result = []
    var func = iteratee(values[values.length - 1])
    // 先展开展平然后对每一个应用func
    var newvalues = []
    for (var i = 0 ; i < values.length - 1; i++) {
        newvalues = newvalues.concat(values[i])
    }
    newvalues = newvalues.map(it => func(it))
    //console.log(newvalues)
    for (var i = 0; i < array.length; i++) {
        if(findIn(newvalues, func(array[i])) == -1) {
            result.push(array[i])
        }
    }
    return result
}

//console.log(differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x'))

function dropWhile(array, predicate) {
    predicate = iteratee(predicate)
    var index = 0
    for (var i = 0; i < array.length; i++) {
        if (!predicate(array[i])) {
            index = i
            break
        }
    }
    return array.slice(i)
}

function dropRightWhile(array, predicate) {
    predicate = iteratee(predicate)
    var index = 0
    for (var i = array.length - 1; i >= 0; i--) {
        //console.log(i , predicate(array[i]))
        if (!predicate(array[i])) {
            index = i
            break
        }
    }
    console.log(index)
    return array.slice(0, index + 1)
}

function union(...array) {
    var result = []
    var newarr = [].concat(...array)
    newarr.forEach(val => {
        if (!result.includes(val)) {
            result.push(val)
        }
    })
    return result
}

function uniq(array) {
    return union(array)
}

function intersection(...arrays) {
    //并没有考虑有个数在某个数组里面出现了两次  而在某个数组里没有出现的情况  暂时先这样吧
    var arr = [].concat(...arrays)
    //console.log(arr)
    var unique = uniq(arr) //这里不能用new Set   因为Set返回的是一个对象   不是数组
    var count = Array(unique.length).fill(0) //计数器数组 跟去重数组的下标一一对应 表示的是unique数组中每个数字出现的次数
    var result = []
    var l = arrays.length
    for (var i = 0; i < arr.length; i++) {
        var index = findIn(unique, arr[i])
        count[index] += 1
    }
    //console.log(count)
    for (var i = 0; i < count.length; i++) {
        if (count[i] == l) {
            result.push(unique[i])
        } //返回出现了l次的数字   也就是在每个小数组里面都出现
    }
    return result
}

//console.log(intersection([2, 1], [2, 3]))

function unionBy(...args) {
    var predicate = iteratee(args[args.length - 1])
    var arrays = args.slice(0, args.length - 1)
    var result = []
    var arr = [].concat(...arrays)
    arr.forEach(val => {
        if (!result.map(it => predicate(it)).includes(predicate(val))) {
            result.push(val)
        }
    })
    return result
}

//console.log(unionBy([2.1], [1.2, 2.3], Math.floor))

//console.log(unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x'))


// function zip(...arrays) {
//     // 暂时不考虑各个数组里面元素个数不等的情况   也就是各个数组里面元素的个数相等
//     var result = []
//     var l = arrays[0].length
//     for (var i = 0; i < l; i++) {
//         result.push  //需要双重循环 不写下去了
// }

//arrays有三个小数组   每个小数组有两个元素
//这个好像就是力扣的867矩阵转置啊
function zip(...arrays) {
    return arrays[0].map((_, idx) => {
        return arrays.map(row => row[idx])
    })
}

function unzip(arrays) {
    return arrays[0].map((_, idx) => {
        return arrays.map(row => row[idx])
    })
} //跟zip唯一的区别就是传参的时候 没有点点点


//区别就是一个zip传参的时候是(['fred', 'barney'], [30, 40], [true, false])   三个数组 三个数组看成一个整体就是...arrays
//而unzip传参传的是zip的结果  也就是 ([['fred', 30, true], ['barney', 40, false]])这本身就是一个大数组  所以传参的时候是arrays

var zipped = zip(['fred', 'barney'], [30, 40], [true, false])
//console.log(zipped) //[['fred', 30, true], ['barney', 40, false]]
//console.log(unzip(zipped)) //[['fred', 'barney'], [30, 40], [true, false]]

function unionBy(...args) {
    var predicate = iteratee(args[args.length - 1])
    var arrays = args.slice(0, args.length - 1)
    var result = []
    var arr = [].concat(...arrays)
    arr.forEach(val => {
        if (!result.map(it => predicate(it)).includes(predicate(val))) {
            result.push(val)
        }
    })
    return result
}

function uniqBy(array, predicate) {
    var args = [array, predicate]
    return unionBy(...args)
}

//console.log(uniqBy([2.1, 1.2, 2.3], Math.floor))
//console.log(uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x'))

function filter(ary,predicate) {
    predicate = iteratee(predicate)
    var result = []
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            result.push(ary[i])
        }
    }
    return result
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

function find(collection, predicate, fromIndex=0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < collection.length; i++) {
        if (predicate(collection[i])) {
            return collection[i]
        }
    }
}
var users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];
//console.log(find(users, function(o) { return o.age < 40; }))

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
// var array = [1, [2, [3, [4]], 5]]
// console.log(flattenDeep(array, 1))

function flatMap(collection, predicate) {
    var result = []
    for (var i = 0; i < collection.length; i++) {
        var value = predicate(collection[i], i , collection)
        result.push(value)
    }
    return flatten(result)
}
// function duplicate(n) {
//   return [n, n];
// }
// console.log(flatMap([1, 2], duplicate))

function flatMapDeep(collection, predicate) {
    var result = []
    for (var i = 0; i < collection.length; i++) {
        var value = predicate(collection[i], i , collection)
        result.push(value)
    }
    return flattenDeep(result)
}
// function duplicate(n) {
//   return [[[n, n]]];
// }
// console.log(flatMapDeep([1, 2], duplicate))
// => [1, 1, 2, 2]

function flatMapDepth(collection, predicate, depth = 1) {
    var result = []
    for (var i = 0; i < collection.length; i++) {
        var value = predicate(collection[i], i , collection)
        result.push(value)
    }
    return flattenDepth(result, depth)
}
// function duplicate(n) {
//   return [[[n, n]]];
// }
// console.log(flatMapDepth([1, 2], duplicate, 2))
// => [[1, 1], [2, 2]]

function keyBy(collection, predicate) {
    predicate = iteratee(predicate)
    var result = {}
    for (var i = 0; i < collection.length; i++) {
        result[predicate(collection[i])] = collection[i]
    }
    return result
}

// var array = [
//   { 'dir': 'left', 'code': 97 },
//   { 'dir': 'right', 'code': 100 }
// ];
//
// console.log(keyBy(array, function(o) {
//   return String.fromCharCode(o.code)
// }))
//
// console.log(keyBy(array, 'dir'))


function map(collection, predicate) {
    predicate = iteratee(predicate)
    var result = []
    if (Array.isArray(collection)) { //Array.isArray判断是否是数组
        for (var i = 0; i < collection.length; i++) {
            result.push(predicate(collection[i]))
        }
    } else {  //如果collection是一个对象 遍历对象  取出每一个value
        for(var key in collection) {
            result.push(predicate(collection[key]))
        }
    }
    return result
}

function partition(collection, predicate) {
    predicate = iteratee(predicate)
    var result = []
    var trueSet = []
    var falseSet = []
    for (var i = 0; i < collection.length; i++) {
        var key = Object.keys(collection[i])[0]   //Object.keys()括号里面要传的参数是对象本身
        if (predicate(collection[i])) {
            trueSet.push(collection[i][key])
        } else {
            falseSet.push(collection[i][key])
        }
    }
    result.push(trueSet)
    result.push(falseSet)
    return result
}

// var users = [
//   { 'user': 'barney',  'age': 36, 'active': false },
//   { 'user': 'fred',    'age': 40, 'active': true },
//   { 'user': 'pebbles', 'age': 1,  'active': false }
// ];
//
// console.log(partition(users, function(o) { return o.active; }))
//
// console.log(partition(users, { 'age': 1, 'active': false }))
//
// console.log(partition(users, ['active', false]))
//
// console.log(partition(users, 'active'))

function reduce(collection, combine, accumulator) {
    for (var key in collection) {
        if (accumulator === undefined) { //如果没有提供 accumulator，则集合中的第一个元素作为 accumulator
            accumulator = collection[key]
        }
        accumulator = combine(accumulator, collection[key], key, collection)
    }   //combine必须传递四个参数
    return accumulator
}

// console.log(reduce([1, 2], function(sum, n) {
//   return sum + n;
// }, 0))
//
// console.log(reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
//   (result[value] || (result[value] = [])).push(key)
//   return result
// }, {}))

function filter(ary,predicate) {
    predicate = iteratee(predicate)
    var result = []
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            result.push(ary[i])
        }
    }
    return result
}

function reject(ary,predicate) {
    predicate = iteratee(predicate)
    var result = []
    for (var i = 0; i < ary.length; i++) {
        if (!predicate(ary[i], i , ary)) {
            result.push(ary[i])
        }
    }
    return result
}

// var users = [
//   { 'user': 'barney', 'age': 36, 'active': false },
//   { 'user': 'fred',   'age': 40, 'active': true }
// ];
//
// console.log(reject(users, function(o) { return !o.active; }))
// console.log(reject(users, { 'age': 40, 'active': true }))
// console.log(reject(users, ['active', false]))
// console.log(reject(users, 'active'))

//从集合中随机获得元素  参考作业6  播放器choice函数
function sample(ary) {
    var a = Math.random()
    a = a * ary.length
    var idx = Math.floor(a)
    return ary[idx]
}

//前面的 includes 函数也可以写一下哦

function sampleSize(ary, n = 0) {
    var result = []
    if (n > ary.length) {
        n = ary.length
    }
    for (var i = 0; i < n; i++) {
        var element = sample(ary)
        if (!result.includes(element)) {
            result.push(element)
        }
    }
    return result
}
// console.log(sampleSize([1, 2, 3], 2))
// console.log(sampleSize([1, 2, 3], 4))

function shuffle(ary) {
    return sampleSize(ary, ary.length)
}

function size(array) {
    var count = 0;
    for (var i in array) {
        count++;
    }
    return count;
}

function defer(func, ...args) {
    return delay(func, 1, ...args)
}

function delay(func, wait, ...args) {
    return setTimeout(func(...args), wait)
}

function eq(value, other) {
    if (isNaN(value) && isNaN(other)) {
        return true
    }
    return value === other
}
//
// var object = { 'a': 1 };
// var other = { 'a': 1 };
//
// console.log(eq(object, object))
// console.log(eq(object, other))
// console.log(eq('a', 'a'))
// console.log(eq('a', Object('a')))
// console.log(eq(NaN, NaN))

function gt(value, other) {
    return value > other
}

function gte(value, other) {
    return value >= other
}

function isArguments(val) {
    return Object.prototype.toString.call(val) === "[object Arguments]"
}

//这个有两种写法
// function isArray(value) {
//     return Array.isArray(value)
// }
function isArray(val) {
    return Object.prototype.toString.call(val) === "[object Array]"
}

function isArrayBuffer(val) {
    return Object.prototype.toString.call(val) === "[object ArrayBuffer]"
}

//检查 value 是否是类数组。 如果是类数组的话，应该不是一个函数，而且 value.length 是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER
// function isArrayLike(val) {
//     return !isNil(val) && isLength(val.length) && !isFunction(val)
// }

// function isArrayLikeObject(val) {
//
// }

function isBoolean(val) {
    return Object.prototype.toString.call(val) === "[object Boolean]"
}

function isDate(val) {
    return Object.prototype.toString.call(val) === "[object Date]"
}

function isElement(val) {
    return Object.prototype.toString.call(val) === "[object Element]"
}

function isEmpty(val) {
    var i = 0
    for (key in val) {
        i++
    }
    return i == 0
}

// function isEqual(val) {
//
// }
