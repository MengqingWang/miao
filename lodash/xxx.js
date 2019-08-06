// function union(...array) {
//     var result = []
//     var newarray = [].concat(...array)
//     newarray.forEach(val => {
//         if (!result.includes(val)) {
//             result.push(val)
//         }
//     })
//     return result
// }
//
// function uniq(array) {
//     return union(array)
// }
//
// function findIn(s1, s2) {
//     /* s2 长度为 1 */
//     let index = -1
//     for (var i = 0; i < s1.length; i++) {
//         var n = s1[i]
//         if (n === s2) {
//             index = i
//             break
//         }
//     }
//     return index
// }
//
// function xor(...arrays) {
//     var arr = [].concat(...arrays)
//     var unique = uniq(arr)
//     var count = Array(unique.length).fill(0) //计数器数组 跟去重数组的下标一一对应 表示的是unique数组中每个数字出现的次数
//     var result = []
//     for (var i = 0; i < arr.length; i++) {
//         var index = findIn(unique, arr[i])
//         count[index] += 1
//     }
//     for (var i = 0; i < count.length; i++) {
//         if (count[i] == 1) {
//             result.push(unique[i])
//         }
//     }
//     return result
// }
//
// console.log(xor([2, 1], [2, 3]))

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
// function zip(...arrays) {
//   return arrays[0].map((_,index)=>arrays.map(row=>row[index]))
// }
//
// console.log(zip(['fred', 'barney'], [30, 40], [true, false]))


// function zipObject(props = [], values = []) {
//     var map = {}
//     for (var i = 0; i < props.length; i++) {
//         map[props[i]] = values[i];
//     }
//     return map;
// }

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
