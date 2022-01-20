"use strict";

export default {
    hexToRgb(hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return (result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null);
    },
    getContrastColor(r, g, b) {
        if ((r * 0.299 + g * 0.587 + b * 0.114 ) > 186) {
            return '#000000';
        }
        return '#ffffff';
    }
};
