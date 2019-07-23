h// function flatten(ary) {
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
    //slice返回新的数组
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

//写完    写完之后发现函数可以相互调用
function flatten(ary) {
    return flattenDeep(ary)
}

function flattenDeep(ary) {
    return flattenDepth(ary, Infinity)
}

//flatten  还能简化
function flatten(ary) { //[1,2,3,[4,5],[6,7]]
    return [].concat(...ary)
}

//用循环写
function flattenDepth(ary, depth = 1) {
    for (var i = 0; i < depth; i++) {
        ary = flatten(ary)
    }
    return ary
}

//拿到一个depth这么长长度的数组 然后reduce开始flatten
//Array有多长  reduce就转多少圈
//reduce本来是处理Array这个数组的  但是传进去reduce并没有用这个数组
//于是每次传一个   传完之后reduce结束   Array这个数组相当于计数器
//这个写法等同于上面的循环写法
function flattenDepth(ary, depth) {
    return Array(depth).fill(0).reduce((ary) => {
        return flatten(ary)
    }, ary.slice())
}

flattenDepth([1, 2, [3, [4]], 5], 1)

function filter(ary,predicate) {
    var result = []
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            result.push(ary[i])
        }
    return result
    }
}

function every(ary, predicate) {
    for (var i = 0; i < ary.length; i++) {
        if (!predicate(ary[i], i , ary)) {
            return false
        }
    }
    return true
}

function every(ary, predicate) {
    return ary.redcuce((result, item, val, ary) => {
        return result && predicate(item, val, ary)
    }, true)
}

function some(ary, predicate) {
    for (var i = 0; i < ary.length; i++) {
        if (predicate(ary[i], i , ary)) {
            return true
        }
    }
    return false
}

function some(ary, predicate) {
    return ary.redcuce((result, item, val, ary) => {
        return result || predicate(item, val, ary)
    }, false)
}

//用some写every  用every写some
function some(ary, predicate) {
    return !every(ary, function(...args) {
        return !predicate(...args)
    })
}

function every(ary, predicate) {
    return !some(ary, function(...args) {
        return !predicate(...args)
    })
}

//注意这样子写是错误的    运算符不能直接对函数求反函数   不是数学上的反函数、、、
// function some(ary, predicate) {
//     return !every(ary, !predicate)
// }

function negate(f) {
    return function(...args) {
        return !f(...args)
    }
}

function some(ary, predicate) {
    return !every(ary, negate(predicate))
}

function every(ary, predicate) {
    return !some(ary, negate(predicate))
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

function spread(f) {
    return function(ary) {
        return f.apply(null, ary)
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

function head(array) {
    if (array.length == 0) {
        return undefined
    } else return array[0]
}

//
function Vector(x, y) {
  this.x = x
  this.y = y
}

Vector.prototype.plus = function(v) {
  var x = this.x + v.x
  var y = this.y + v.y
  return new Vector(x, y)
}

Vector.prototype.minus = function(v) {
  var x = this.x - v.x
  var y = this.y - v.y
  return new Vector(x, y)
}

Object.defineProperty(Vector.prototype, 'length', {
  get: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
})//向量的长度

//
function Vector(x, y) {
  this.x = x
  this.y = y
}

Vector.prototype = {
  plus(v) {

  },
  minus(v) {

  },
  get length() {

  }
}

//
function Complex(real, imag) {
  this.real = real
  this.imag = imag
}

Complex.fromString = function(str) {
  var real = xxxx
  var imag = yyyy
  return new Complex(real, imag)
}

Complex.copy = function (c) {
  return new Complex(c.real, c.imag)
}

Complex.prototype = {
  plus(c) {
    var real = this.real + c.real
    var imag = this.imag + c.imag
    return new Complex(real, imag)
  },
  minus(c) {
    var real = this.real - c.real
    var imag = this.imag - c.imag
    return new Complex(real, imag)
  },
  mul(c) {
    var real = this.real * c.real - this.imag * c.imag
    var imag = this.real * c.imag + this.imag * c.real
    return new Complex(real, imag)
  },
  division(c) {
    var factor = c.real * c.real + c.imag * c.imag
    var real = this.real * c.real + this.imag * c.imag
    var imag = this.imag * c.real - this.real * c.imag
    return new Complex(real / factor, imag / factor)
  },
  toString() {
    if (this.imag < 0) {
      return '' + this.real + this.imag + 'i'
    } else {
      return '' + this.real + '+' + this.imag + 'i'
    }
  }
}


//
function Stack() {
  this._top = null
  this._elementCount = 0
}

Stack.prototype = {
  pop() {
    if (this._top) {
      var node = this._top
      this._top = this._top.next
      this._elementCount--
      return node.val
    } else {
      return undefined
    }
  },
  push(val) {
    this._elementCount++
    var node = {
      val: val,
      next: this._top,
    }
    this._top = node
    return this
  },
  get size() {
    return this._elementCount
  }
}

//
function Queue() {
  this._head = null
  this._tail = null
}

Queue.prototype = {
  add(val) {
    var node = {
      val: val,
      next: null,
    }
    if (this._head == null) {
      this._head = this._tail = node
    } else {
      this._tail.next = node
      this._tail = node
    }
    return this
  },
  remove() {
    if (!this._head) {
      return undefined
    }
    var node = this._head
    this._head = this._head.next
    if (this._head == null) {
      this._tail = null
    }
    return node.val
  }
}

//
function Queue(initVals = []) {
  this._head = null
  this._tail = null

  for (var val of ary) {
    this.add(val)
  }
}

Queue.prototype = {
  add(val) {
    var node = {
      val: val,
      next: null,
    }
    if (this._head == null) {
      this._head = this._tail = node
    } else {
      this._tail.next = node
      this._tail = node
    }
    return this
  },
  remove() {
    if (!this._head) {
      return undefined
    }
    var node = this._head
    this._head = this._head.next
    if (this._head == null) {
      this._tail = null
    }
    return node.val
  }
}

//
class MySet {
  constructor() {
    this._values = []
  }

  get size() {
    return this._values.length
  }

  has(val) {
    return this._values.includes(val)
  }

  add(val) {
    if (!this.has(val)) {
      this._values.push(val)
    }
    return this
  }

  clear() {
    this._values.length = 0
    return this
  }

  delete(val) {
    var idx = this._values.indexOf(val)
    if (idx >= 0) {
      this._values.splice(idx, 1)
    }
    return this
  }
}
