"use strict";

export default {
    move(array, srcIndex, dstIndex) {
        array.splice(dstIndex,0,array.splice(srcIndex,1)[0]);
        return array;
    }
};
