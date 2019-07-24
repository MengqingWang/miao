function takeRight(array, n = 1) {
    if (n > array.length) {
        n = array.length
    }
    return array.slice(array.length - n)
}

console.log(sortedIndex([30,50],40))
