"use strict";

export default {
    toUpperCaseFirst(string) {
        return string.charAt(0).toUpperCase()+string.slice(1);
    },
    slugify(string) {
        return String(string)
            .toLowerCase()

            // Start replacing diacritics
            .replace( /[èéêë]/g, 'e' )
            .replace( /[àáâãäå]/g, 'a')
            .replace( /æ/g, 'ae')
            .replace( /ç/g, 'c')
            .replace( /[èéêë]/g, 'e')
            .replace( /[ìíîï]/g, 'i')
            .replace( /ñ/g, 'n')
            .replace( /[òóôõö]/g, 'o')
            .replace( /œ/g, 'oe')
            .replace( /[ùúûü]/g, 'u')
            .replace( /[ýÿ]/g, 'y')
            // End replacing diacritics

            .replace( /[^\w.]+/g, '-' )
            .replace( /^-+/, '' )
            .replace( /-+$/, '' );
    }
};
