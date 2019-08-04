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

function findIndex(array, predicate, fromIndex = 0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
            return i
        }
    }
    return -1;
}

var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];

console.log(findIndex(users, { 'user': 'fred', 'active': false }))
