//读lodash源码  4056行
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/slice
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) { //开始下标小于0    会被当做 length + start 看待
    start = -start > length ? 0 : (length + start);
} //三元运算符  给start赋值   把三元运算的结果赋给 start
  end = end > length ? length : end;
  if (end < 0) { //结束下标  如果该参数为负数，则被看作是 strLength + endIndex
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);  //做完上述两个if 正常情况下start是小于end的  否则就slice不出数字了 (end - start) >>> 0 是为了取整
  start >>>= 0; // 取整

  var result = Array(length); //建立一个length长度的 Array
  while (++index < length) { // ++index    index先自加1   然后再和length比较
    result[index] = array[index + start];
  }
  return result;
}

//8576行   读xor函数   下面牵出了那么多其它的函数
var xor = baseRest(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});

//595行
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

//4393行
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

//4260
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

//xor函数未读完  先来看看其他函数
//10944行  很好   这个函数跟我写的一模一样
function unary(func) {
  return ary(func, 1);
}

//11198行
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

//跟我自己写的有什么区别  ???
function eq(value, other) {
    if (isNaN(value) && isNaN(other)) {
        return true
    }
    return value === other
}

//从 isEmpty左右开始看  ???


//7467行  indexOf
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

//839行
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

//1292行
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

//818行
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
