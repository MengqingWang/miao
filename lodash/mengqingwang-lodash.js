var mengqingwang = {

    findindex:function(array, callback) {
        let index = -1
        let l = array.length
        for (let i = 0; i < l; i++) {
            let s = array[i]
            if (callback(s)) {
                index = i
                break
            }
        }
        return index
    }

}
