var mengqingwang = function() {

function isMatch(obj, src) {  //src是source的意思
  if (obj === src) {
    return true
} //两个都是原始类型  isMatch(2,2)
  for(var key in src) {  // {a:1},  2
    if (typeof src[key] == 'object' && src[key] !== null) {
      if (!isMatch(obj[key], src[key])) {
        return false
    } //深度对比
    } else {
      if (obj[key] != src[key]) {
        return false
      }
    }
  }
  return true
}

//实现带占位符的bind   这里占位符用的是window本身 不是window字符串   lodash里面的占位符是 _   这也不是字符串   是一个lodash函数
//看这个参考  http://lodash.think2011.net/bind
function bind(f, thisArg, ...fixedArgs) {//1, window, window, 3,
  return function(...args) {//4, 5
    var acturalArgs = [...fixedArgs]
    for(var i = 0; i < acturalArgs.length; i++) {
      if (acturalArgs[i] === window) {
        acturalArgs[i] = args.shift()
      }
    }
    acturalArgs.push(...args)
    return f.apply(thisArg, acturalArgs)
  }
}

function matches(src) { // 相当于isMatch的第二个参数被绑定为了src 所以后面尝试用bind来写
  return function(obj) {
    return isMatch(obj, src)
  }
}
//var matches = src => bind(isMatch, null, window, src)

//拆路径
//http://lodash.think2011.net/toPath
//直接用正则表达式写    考虑到所有的情况
//转义点号  或者转义左中括号  或者转义右中括号  /g全局
function toPath(str) {//a.b.0.c[fooo][bar].d
  return str.split(/\.|\[|\]./g)
}

function get(obj, path, defaultVal) {//[a,b,c,d]
  var path = toPath(path)
  for(var i = 0; i < path.length; i++) {
    if (obj === undefined) {
      return defaultVal
    }
    obj = obj[path[i]]
} // 举个例子  var object = { 'a': [{ 'b': { 'c': 3 } }] }
//循环取就是object["a"][0]["b"]["c"]
  return obj
}

//第二种写法    递归
// function get(obj, path, defaultVal) {
//   if (obj === undefined) {
//     return defaultVal
//   }
//   return get(obj[path[0]], path.slice(1))
// }

//第三种写法   没有考虑undefined的情况   暂时就这么写了
// function get(obj, path, defaultVal) {
//   return path.reduce((obj, propName) => {
//     return obj[propName]
//   }, obj)
// }

// isEqual   深度对比  以前写过了？？  isMatch和isEqual的区别
// 没有考虑path, value不止一对的情况
function matchesProperty(path, value) {
  return function (obj) {
    return isEqual(get(obj, path), value)
  }
}

function property(path) {
  return function(obj) {
    return get(obj, path)
    //return bind(get, null, window, path)
    //第二种写法
  }
}

//常用的迭代器函数
function iteratee(args) {
    if (Object.prototype.toString.call(args) === "[object String]") {
        return function (object) {
            return object[args]
        }
    } else if (Object.prototype.toString.call(args) === "[object Object]") {
        return function (object) { //这里用for(var key of args) 就不行
            for(var key in args) {
                if(args[key] !== object[key]) {
                    return false
                }
            }
            return true
        }
    } else if (Object.prototype.toString.call(args) === "[object Array]") {
        return function (object) {
            for (var i = 0; i < args.length - 1; i += 2) {
                if (object[args[i]] !== args[i + 1]) {
                    return false
                }
            }
            return true
        }
    } else if (Object.prototype.toString.call(args) === "[object RegExp]") {
        return function(object) {
            return args.test(object)
        }
    }
    else if (Object.prototype.toString.call(args) === "[object Function]") {
        return args
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
    // 先展开展平然后对每一个应用func
    var newvalues = []
    for (var i = 0 ; i < values.length - 1; i++) {
        newvalues = newvalues.concat(values[i])
    }
    newvalues = newvalues.map(it => func(it))
    console.log(newvalues)
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

//返回一个新的数组  数组起点从predicate返回flase的那个值开始一直到最后
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

//返回一个新的数组  数组起点从predicate返回flase的那个值开始一直往前
function dropRightWhile(array, predicate) {
    predicate = iteratee(predicate)
    var index = 0
    for (var i = array.length - 1; i >= 0; i--) {
        console.log(i , predicate(array[i]))
        if (!predicate(array[i])) {
            index = i
            break
        }
    }
    console.log(index)
    return array.slice(0, index + 1)
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
    // if (fromIndex < 0) {
    //     fromIndex = fromIndex + array.length
    // }
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

function intersection(...arrays) {
    //并没有考虑有个数在某个数组里面出现了两次  而在某个数组里没有出现的情况  暂时先这样吧
    var arr = [].concat(...arrays)
    console.log(arr)
    var unique = uniq(arr) //这里不能用new Set   因为Set返回的是一个对象   不是数组
    //console.log(unique, typeof unique)
    var count = Array(unique.length).fill(0) //计数器数组 跟去重数组的下标一一对应 表示的是unique数组中每个数字出现的次数
    var result = []
    var l = arrays.length
    for (var i = 0; i < arr.length; i++) {
        var index = findIn(unique, arr[i])
        count[index] += 1
    }
    console.log(count)
    for (var i = 0; i < count.length; i++) {
        if (count[i] == l) {
            result.push(unique[i])
        } //返回出现了l次的数字   也就是在每个小数组里面都出现
    }
    return result
}

function join(array, separator=',') {
    var s = array[0]
    for (let i = 1; i < array.length; i++) {
        // 从下标为 1 的元素开始, 把数组中每个元素拿出来
        // 加上分隔符之后再累加到 s 上
        let e = array[i]
        s += (separator.toString() + e)
    }
    return s
}

function last(array) {
    return array.pop()
}

function lastIndexOf(array, value, fromIndex = array.length - 1) {
    // if (fromIndex < 0) {
    //     fromIndex = fromIndex + array.length
    // }
    for (var i = fromIndex; i >= 0; i--) {
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
    var result = []
    for (var i = 0; i < array.length; i++) {
        if (findIn(values, array[i]) == -1) {
            result.push(array[i])
            //splice会改变原数组   进而改变下标  所以这题不能用splice
            // array.splice(i, 1)
        }
    }
    return result
}

function pullAll(array, values) {
    var result = []
    for (var i = 0; i < array.length; i++) {
        if (findIn(values, array[i]) == -1) {
            result.push(array[i])
            //splice会改变原数组   进而改变下标  所以这题不能用splice
            // array.splice(i, 1)
        }
    }
    return result
}

function reverse(array) {
    var result = [];
    for (var i = array.length - 1; i >= 0; i--) {
        result.push(array[i])
    }
    return result;
}

function sortedIndex(array, value) {
    var index = 0
    for (var i = 0; i < array.length; i++) {
        if (value >= array[i]) {
            index = i + 1
            break
        }
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
    for (var i = array.length - 1; i >= 0; i--) {
        if (value >= array[i]) {
            index = i + 1
            break
        }
    }
    return index
}

function sortedLastIndexOf(array, value) {
    for (var i = array.length - 1; i >= 0; i--) {
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
    return array.slice(array.length - n)
}

function union(...array) {
    var result = []
    var newarray = [].concat(...array)
    newarray.forEach(val => {
        if (!result.includes(val)) {
            result.push(val)
        }
    })
    return result
}

function uniq(array) {
    return union(array)
}

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

// function without(array, ...values) {
//     var result = []
//     for (var i = 0; i < array.length; i++) {
//         if (findIn(values, array[i]) === -1) {
//             result.push(array[i])
//         }
//     }
//     return result
// }

//尝试使用filter的写法   凡是代码格式跟filter差不多的都可以用filter
function without(array, ...values) {
    return array.filter(it => findIn(values, it) === -1)
}

// function xor(...arrays) {
//     var obj = {}
//     var arr = [].concat(...arrays)
//     for (var i = 0; i < arr.length; i++) {
//         if (!Object.keys(obj).includes(arr[i] + '')) {
//             obj[arr[i]] = 1
//         } else obj[arr[i]] += 1
//     } //利用obj计数 每个数字对应它出现的次数
//     for (var i in obj) {
//         if (obj[i] !== 1) {
//             delete obj[i]
//         } //对应的出现的次数大于1   就删除这个键值对
//     }
//     return Object.keys(obj)
// } //想用对象做  但是Object.keys(obj)返回的是一个由字符串组成的数组
//
// console.log(xor([2, 1], [2, 3]))

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
        } //返回只出现了一次的数字
    }
    return result
}

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
console.log(zipped) //[['fred', 30, true], ['barney', 40, false]]
console.log(unzip(zipped)) //[['fred', 'barney'], [30, 40], [true, false]]

function zipObject(props = [], values = []) {
    var map = {}
    for (var i = 0; i < props.length; i++) {
        map[props[i]] = values[i];
    }
    return map;
}

function countBy(collection, predicate = identity) {
    var map = {}
    predicate = iteratee(predicate)
    collection = collection.map(it => predicate(it))
    for (var i = 0; i < collection.length; i++) {
        //console.log(predicate(collection[i]))
        if (collection[i] in map) {
            map[collection[i]]++
        } else {
            map[collection[i]] = 1
        }
    }
    return map
}
// countBy([6.1, 4.2, 6.3], Math.floor)
// countBy(['one', 'two', 'three'], 'length')
// 举个例子
// var a = 'one'
// a["length"]
//输出3

//有一个测试没通过   先放放   好像是iteratee在搞鬼
//https://lodash.com/docs/4.17.15#iteratee
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

function find(collection, predicate, fromIndex=0) {
    predicate = iteratee(predicate)
    for (var i = fromIndex; i < collection.length; i++) {
        if (predicate(collection[i])) {
            return collection[i]
        }
    }
}

//以下三个函数分别和flatten  flattenDeep   flattenDepth  相对应
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

function every(ary, predicate) {
    predicate = iteratee(predicate)
    for (var i = 0; i < ary.length; i++) {
        if (!predicate(ary[i], i , ary)) {
            return false
        }
    }
    return true
}

function some(ary, predicate) {
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

//函数柯里化   头条的笔试题
function curry(f, length = f.length) {
  return function(...args) {
    if (args.length >= length) {
      return f(...args)
    } else {
      return curry(f.bind(null, ...args), length - args.length)
  } //递归
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
    if (Array.isArray(collection)) { //如果collection是一个数组
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
        var key = Object.keys(collection[i])[0]
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

function sample(ary) {
    var a = Math.random()
    a = a * ary.length
    var idx = Math.floor(a)
    return ary[idx]
}

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

// function eq(value, other) {
//     if (isNaN(value) && isNaN(other)) {
//         return true
//     }
//     return value === other
// }
function eq(value, other) {
  return value === other || (value !== value && other !== other)
}
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

function isError(val) {
    return Object.prototype.toString.call(val) === "[object Error]"
}

function isFinite(val) {
    return Number.isFinite(val)
}

function isFunction(val) {
    return Object.prototype.toString.call(val) === "[object Function]"
}

function isInteger(val) { // 介绍里面已经说了这个方法基于 Number.isInteger
    return Number.isInteger(val)
}

//先保证是个数字   然后不能是负数  不能是小数
//Number.MAX_SAFE_INTEGER常量表示在 JavaScript 中最大的安全整数
//MIN_VALUE 属性是 JavaScript 里最接近 0 的正值，而不是最小的负值。MIN_VALUE 的值约为 5e-324。
function isLength(value) {
    return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

function isMap(val) {
    return Object.prototype.toString.call(val) === "[object Map]"
}

//需要写递归
// function isMatch(val) {
//
// }

//检查 value 是否是 NaN   意思就是仅 NaN 返回真
// An `NaN` primitive is the only value that is not equal to itself.
//_.isNumber(NaN)返回 true    _.isNumber(9) 也是返回 true
// function isNaN(value) {
//   return isNumber(value) && value != +value
// }

// console.log(isNaN(NaN))
// console.log(isNaN(null))
// console.log(isNaN(undefined))

//chrome的js引擎时c++写的, Array是JS中基础组件, 其中的方法应该都是c++实现的, 所以你打印时直接告诉你这是native code
function isNative(val) {
    return val.toString().includes("[native code]")
}

function isNil(val) {
    return val === undefined || val === null
}

function isNull(val) {
    return val === null
}

// function isNumber(value) {
//   return typeof value == 'number' ||
//     (isObjectLike(value) && baseGetTag(value) == numberTag)
// }
function isNumber(val) {
    return Object.prototype.toString.call(val) === "[object Number]"
}

function isObject(val) {
  var type = typeof val
  return val != null && (type == 'object' || type == 'function')
}

function isObjectLike(value) {
  return value != null && typeof value == 'object'
}

//检查 value 是否是普通对象。
//也就是说该对象由 Object 构造函数创建或者 [[Prototype]] 为空。
//Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。
function isPlainObject(val) {
    let proto = Object.getPrototypeOf(val)
    return proto == null || proto.constructor == Object;
}

function isRegExp(val) {
    return Object.prototype.toString.call(val) === "[object RegExp]";
}

return {
    isMatch,
    bind,
    toPath,
    get,
    property,
    matches,
    matchesProperty,
    iteratee,
    chunk,
    compact,
    findIn,
    difference,
    differenceBy,
    drop,
    dropRight,
    dropWhile,
    dropRightWhile,
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
    intersection,
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
    union,
    uniq,
    unionBy,
    uniqBy,
    without,
    xor,
    zip,
    unzip,
    zipObject,
    countBy,
    filter,
    find,
    flatMap,
    flatMapDeep,
    flatMapDepth,
    every,
    some,
    negate,
    flip,
    before,
    after,
    ary,
    unary,
    spread,
    curry,
    memoize,
    groupBy,
    keyBy,
    map,
    partition,
    reduce,
    reject,
    sample,
    sampleSize,
    shuffle,
    size,
    defer,
    delay,
    eq,
    gt,
    gte,
    isArguments,
    isArray,
    isArrayBuffer,
    isBoolean,
    isDate,
    isElement,
    isEmpty,
    isError,
    isFinite,
    isFunction,
    isInteger,
    isLength,
    isMap,
    isNative,
    isNil,
    isNull,
    isNumber,
    isObject,
    isObjectLike,
    isPlainObject,
    isRegExp,
}

}()
