// function flatten(ary) {
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
