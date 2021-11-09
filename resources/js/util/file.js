"use strict";

export default {
    filesize(size) {
        let i = Math.floor(Math.log(size) / Math.log(1000));
        return (size / Math.pow(1000, i)).toFixed() * 1 + ' ' + ['bytes', 'kB', 'MB', 'GB', 'TB'][i];
    }
};
