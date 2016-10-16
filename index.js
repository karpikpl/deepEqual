/*jshint esversion: 6, node: true */
'use strict';

module.exports = function deepEqual(a, b) {
    if (typeof a !== typeof b) {
        return false;
    } else {
        if (typeof a === 'object') {
            if (a && b && Object.keys(a).length != Object.keys(b).length) {
                return false;
            }

            for (let p in a) {
                if (!deepEqual(a[p], b[p])) {
                    return false;
                }
            }

            if (a === null && b !== null || (b === null && a !== null)) {
                return false;
            }

            if (a && b && Object.getPrototypeOf(a) != Object.getPrototypeOf(b)) {
                return false;
            }

        } else if (a !== b) {
            return false;
        }
    }

    return true;
};
