/*jshint esversion: 6, node: true */
const assert = require('assert');
const deep = require('../index');

function deepEqualSafe(a, b) {
    try {
        assert.deepStrictEqual(a, b);
        return true;
    } catch (e) {
        return false;
    }
}

function test(f, g) {
    const args = Array.prototype.slice.call(arguments, 2);
    const reversed = args.reverse();

    function throwIfNotEqual(f, g, argumentsToUse) {
        const fResult = f.apply(this, argumentsToUse);
        const gResult = g.apply(this, argumentsToUse);
        if (fResult != gResult) {
            throw `comparison failed for ${JSON.stringify(argumentsToUse)} - f:${fResult} g:${gResult}`;
        }
        return true;
    }

    return function() {
        return throwIfNotEqual(f, g, args) && throwIfNotEqual(f, g, reversed);
    };
}

describe('deep equal comparison tests', function() {

    it('shoud compare scalar values', function() {
        assert.doesNotThrow(test(deep, deepEqualSafe, 2, 2));
        assert.doesNotThrow(test(deep, deepEqualSafe, 0, 0));
        assert.doesNotThrow(test(deep, deepEqualSafe, 0, -1));
        assert.doesNotThrow(test(deep, deepEqualSafe, 5, 10));
    });

    it('shoud compare with null and undefined', function() {
        assert.doesNotThrow(test(deep, deepEqualSafe, null, null));
        assert.doesNotThrow(test(deep, deepEqualSafe, undefined, undefined));
        assert.doesNotThrow(test(deep, deepEqualSafe, null, -1));
        assert.doesNotThrow(test(deep, deepEqualSafe, 5, null));
        assert.doesNotThrow(test(deep, deepEqualSafe, 5, undefined));
        assert.doesNotThrow(test(deep, deepEqualSafe, null, undefined));
    });

    it('shoud compare different types', function() {
        assert.doesNotThrow(test(deep, deepEqualSafe, false, false));
        assert.doesNotThrow(test(deep, deepEqualSafe, true, true));
        assert.doesNotThrow(test(deep, deepEqualSafe, false, null));
        assert.doesNotThrow(test(deep, deepEqualSafe, true, 10));
    });

    it('shoud compare objects', function() {
        assert.doesNotThrow(test(deep, deepEqualSafe, {}, {}), '{} == {}');
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: 1,
            b: 2
        }, {
            b: 2,
            a: 1
        }));
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: 1,
            b: {
                c: {
                    d: {
                        e: {
                            f: 9
                        }
                    }
                }
            }
        }, {
            a: 1,
            b: {
                c: {
                    d: {
                        e: {
                            f: 9
                        }
                    }
                }
            }
        }));
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: 1,
            b: 3
        }, {
            a: 1,
            b: 2
        }), 'deep({a:1, b:3}, {a:1, b:2})');
        assert.doesNotThrow(test(deep, deepEqualSafe, {}, true), '{} !== true');
        assert.doesNotThrow(test(deep, deepEqualSafe, {}, null), '{} !== null');
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: 1
        }, 1), '{a:1} !== 1');
    });

    it('shoud compare arrays', function() {
        assert.doesNotThrow(test(deep, deepEqualSafe, [], []), '[] === []');
        assert.doesNotThrow(test(deep, deepEqualSafe, [1, 2], [1, 2]), '[1,2], [1,2]');
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: [1, {
                d: [0, 6]
            }]
        }, {
            a: [1, {
                d: [0, 6]
            }]
        }), '{a:[1, {d:[0,6]}]}, {a:[1, {d:[0,6]}]}');
        assert.doesNotThrow(test(deep, deepEqualSafe, {}, []), '{} === []');
        assert.doesNotThrow(test(deep, deepEqualSafe, [1, 2, 3, 4], []), '[1,2,3,4], []');
        assert.doesNotThrow(test(deep, deepEqualSafe, [], [1, 2, 3, 4]), '[], [1,2,3,4]');
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: []
        }, {
            b: []
        }), '{a:[]}, {b:[]}');
        assert.doesNotThrow(test(deep, deepEqualSafe, {
            a: []
        }, {
            a: [1]
        }), '{a:[]}, {a:[1]}');
    });
});
