function isMatch(obj, src) {  //src是source的意思
  if (obj === src) {
    return true
} //两个都是原始类型  isMatch(2,2)
  for(var key in src) {//   {a:1},  2
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
var matches = src => bind(isMatch, null, window, src)


var isMale = matches({gender: 'male'})
isMale({
  name:'zhangshan',
  age: 18,
  gender: 'male',
})

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
function get(obj, path, defaultVal) {
  if (obj === undefined) {
    return defaultVal
  }
  return get(obj[path[0]], path.slice(1))
}

//第三种写法   没有考虑undefined的情况   暂时就这么写了
function get(obj, path, defaultVal) {
  return path.reduce((obj, propName) => {
    return obj[propName]
  }, obj)
}


// matchesProperty('a.b')
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


function iteratee(value) {
  if (typeof value == 'string') {
    return property(value)
  }
  if (Array.isArray(value)) {
    return matchesProperty(value)
  }
  if (typeof value == 'object') {
    return matches(value)
  }
  return value
}


//应用举例
function map(ary, predicate) {
  predicate = iteratee(predicate)
}

function dropWhile(ary, predicate) {
  predicate = iteratee(predicate)

}

function dropRightWhile(ary, predicate) {
  predicate = iteratee(predicate)
}



//函数柯里化   头条的笔试题
function curry(f) {

}

function add(a,b,c,d,e,f) {
  return a + b + c + d + e + f
}

add2 = curry(add)

function curry(f, length = f.length) {
  return function(...args) {
    if (args.length >= length) {
      return f(...args)
    } else {
      return curry(f.bind(null, ...args), length - args.length)
  } //递归
  }
}

add2(1,2,3,4)(5)(6)



function compose(funcs) {
  return function(...args) {
    var value = funcs[0](...args)
    for(var i = 1; i < funcs.length; i++) {
      value = funcs[i](value)
    }
    return value
  }
}
