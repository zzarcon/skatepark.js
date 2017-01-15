(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":5}],5:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":1,"ieee754":8,"isarray":11}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":10}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],11:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],12:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":14}],13:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":14}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":16}],16:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":18,"./_stream_writable":20,"core-util-is":6,"inherits":9,"process-nextick-args":13}],17:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":19,"core-util-is":6,"inherits":9}],18:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var StringDecoder;

util.inherits(Readable, Stream);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":16,"./internal/streams/BufferList":21,"_process":14,"buffer":5,"buffer-shims":4,"core-util-is":6,"events":7,"inherits":9,"isarray":11,"process-nextick-args":13,"string_decoder/":28,"util":2}],19:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":16,"core-util-is":6,"inherits":9}],20:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":16,"_process":14,"buffer":5,"buffer-shims":4,"core-util-is":6,"events":7,"inherits":9,"process-nextick-args":13,"util-deprecate":29}],21:[function(require,module,exports){
'use strict';

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};
},{"buffer":5,"buffer-shims":4}],22:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":17}],23:[function(require,module,exports){
(function (process){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":16,"./lib/_stream_passthrough.js":17,"./lib/_stream_readable.js":18,"./lib/_stream_transform.js":19,"./lib/_stream_writable.js":20,"_process":14}],24:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":19}],25:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":20}],26:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.skatejsDomDiff = global.skatejsDomDiff || {})));
}(this, (function (exports) {

var APPEND_CHILD = 1;
var REMOVE_CHILD = 2;
var REMOVE_ATTRIBUTE = 3;
var REPLACE_CHILD = 4;
var SET_ATTRIBUTE = 5;
var SET_EVENT = 6;
var SET_PROPERTY = 7;
var TEXT_CONTENT = 8;

var types = Object.freeze({
	APPEND_CHILD: APPEND_CHILD,
	REMOVE_CHILD: REMOVE_CHILD,
	REMOVE_ATTRIBUTE: REMOVE_ATTRIBUTE,
	REPLACE_CHILD: REPLACE_CHILD,
	SET_ATTRIBUTE: SET_ATTRIBUTE,
	SET_EVENT: SET_EVENT,
	SET_PROPERTY: SET_PROPERTY,
	TEXT_CONTENT: TEXT_CONTENT
});

function classToString(obj) {
  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.join(' ');
  }

  return Object.keys(obj).filter(function (key) {
    return obj[key] ? key : false;
  }).join(' ');
}

function styleToString(obj) {
  if (typeof obj === 'string') {
    return obj;
  }

  return Object.keys(obj).map(function (key) {
    return key + ': ' + obj[key] + ';';
  }).join(' ');
}

function getAccessor(node, name) {
  if (name === 'class') {
    return node.className;
  } else if (name === 'style') {
    return node.style.cssText;
    // most things
  } else if (name !== 'type' && name in node) {
    return node[name];
    // real DOM elements
  } else if (node.getAttribute) {
    return node.getAttribute(name);
    // vDOM nodes
  } else if (node.attributes && node.attributes[name]) {
    return node.attributes[name].value;
  }
}

function mapAccessor(node, name, value) {
  if (name === 'class') {
    node.className = classToString(value);
  } else if (name === 'style') {
    node.style = { cssText: styleToString(value) };
  }
}

function removeAccessor(node, name) {
  if (name === 'class') {
    node.className = '';
  } else if (name === 'style') {
    node.style.cssText = '';
    // most things
  } else if (name !== 'type' && name in node) {
    node[name] = '';
    // real DOM elements
  } else if (node.removeAttribute) {
    node.removeAttribute(name);
    // vDOM nodes
  } else if (node.attributes) {
    delete node.attributes[name];
  }
}

function setAccessor(node, name, value) {
  if (name === 'class') {
    node.className = value;
  } else if (name === 'style') {
    node.style.cssText = value;
    // most things
  } else if (name !== 'type' && name in node || typeof value !== 'string') {
    // We check if it's undefined or null because IE throws "invalid argument"
    // errors for some types of properties. Essentially this is the same as
    // removing the accessor.
    node[name] = value == null ? '' : value;
    // real DOM elements
  } else if (node.setAttribute) {
    node.setAttribute(name, value);
    // vDOM nodes
  } else if (node.attributes) {
    node.attributes[node.attributes.length] = node.attributes[name] = { name: name, value: value };
  }
}

var compareAttributes = function (src, dst) {
  var srcAttrs = src.attributes;
  var dstAttrs = dst.attributes;
  var srcAttrsLen = (srcAttrs || 0) && srcAttrs.length;
  var dstAttrsLen = (dstAttrs || 0) && dstAttrs.length;
  var instructions = [];

  // Bail early if possible.
  if (!srcAttrsLen && !dstAttrsLen) {
    return instructions;
  }

  // Merge attributes that exist in source with destination's.
  for (var a = 0; a < srcAttrsLen; a++) {
    var srcAttr = srcAttrs[a];
    var srcAttrName = srcAttr.name;
    var srcAttrValue = getAccessor(src, srcAttrName);
    var dstAttr = dstAttrs[srcAttrName];
    var dstAttrValue = getAccessor(dst, srcAttrName);

    if (!dstAttr) {
      instructions.push({
        data: { name: srcAttrName },
        destination: dst,
        source: src,
        type: REMOVE_ATTRIBUTE
      });
    } else if (srcAttrValue !== dstAttrValue) {
      instructions.push({
        data: { name: srcAttrName, value: dstAttrValue },
        destination: dst,
        source: src,
        type: SET_ATTRIBUTE
      });
    }
  }

  // We only need to worry about setting attributes that don't already exist
  // in the source.
  for (var _a = 0; _a < dstAttrsLen; _a++) {
    var _dstAttr = dstAttrs[_a];
    var dstAttrName = _dstAttr.name;
    var _dstAttrValue = getAccessor(dst, dstAttrName);
    var _srcAttr = srcAttrs[dstAttrName];

    if (!_srcAttr) {
      instructions.push({
        data: { name: dstAttrName, value: _dstAttrValue },
        destination: dst,
        source: src,
        type: SET_ATTRIBUTE
      });
    }
  }

  return instructions;
};

// Because weak map polyfills either are too big or don't use native if
// available properly.

var index$1 = 0;
var prefix = '__WEAK_MAP_POLYFILL_';

var WeakMap$1 = (function () {
  if (typeof WeakMap !== 'undefined') {
    return WeakMap;
  }

  function Polyfill() {
    this.key = prefix + index$1;
    ++index$1;
  }

  Polyfill.prototype = {
    get: function get(obj) {
      return obj[this.key];
    },
    set: function set(obj, val) {
      obj[this.key] = val;
    }
  };

  return Polyfill;
})();

var map = new WeakMap$1();

var eventMap = function (elem) {
  var events = map.get(elem);
  events || map.set(elem, events = {});
  return events;
};

var compareEvents = function (src, dst) {
  var dstEvents = dst.events;
  var srcEvents = eventMap(src);
  var instructions = [];

  // Remove any source events that aren't in the destination before seeing if
  // we need to add any from the destination.
  if (srcEvents) {
    for (var name in srcEvents) {
      if (dstEvents && dstEvents[name] !== srcEvents[name]) {
        instructions.push({
          data: { name: name, value: undefined },
          destination: dst,
          source: src,
          type: SET_EVENT
        });
      }
    }
  }

  // After instructing to remove any old events, we then can instruct to add
  // new events. This prevents the new events from being removed from earlier
  // instructions.
  if (dstEvents) {
    for (var _name in dstEvents) {
      var value = dstEvents[_name];
      if (srcEvents[_name] !== value) {
        instructions.push({
          data: { name: _name, value: value },
          destination: dst,
          source: src,
          type: SET_EVENT
        });
      }
    }
  }

  return instructions;
};

var compareElement = function (src, dst) {
  if (src.tagName === dst.tagName) {
    return compareAttributes(src, dst).concat(compareEvents(src, dst));
  }
};

var text = function (src, dst) {
  if (src.textContent === dst.textContent) {
    return [];
  }

  return [{
    destination: dst,
    source: src,
    type: TEXT_CONTENT
  }];
};

var NODE_COMMENT = 8;
var NODE_ELEMENT = 1;
var NODE_TEXT = 3;

var compareNode = function (src, dst) {
  var dstType = void 0,
      srcType = void 0;

  if (!dst || !src) {
    return;
  }

  dstType = dst.nodeType;
  srcType = src.nodeType;

  if (dstType !== srcType) {
    return;
  } else if (dstType === NODE_ELEMENT) {
    return compareElement(src, dst);
  } else if (dstType === NODE_TEXT) {
    return text(src, dst);
  } else if (dstType === NODE_COMMENT) {
    return text(src, dst);
  }
};

var realNodeMap = new WeakMap$1();

var _window$1 = window;
var Node$1 = _window$1.Node;


var realNode = function (node) {
  return node instanceof Node$1 ? node : realNodeMap.get(node);
};

var _window = window;
var Node = _window.Node;


function diffNode(source, destination) {
  var nodeInstructions = compareNode(source, destination);

  // If there are instructions (even an empty array) it means the node can be
  // diffed and doesn't have to be replaced. If the instructions are falsy
  // it means that the nodes are not similar (cannot be changed) and must be
  // replaced instead.
  if (nodeInstructions) {
    return nodeInstructions.concat(diff({ source: source, destination: destination }));
  }

  return [{
    destination: destination,
    source: source,
    type: REPLACE_CHILD
  }];
}

function diff() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var src = opts.source;
  var dst = opts.destination;

  if (!src || !dst) {
    return [];
  }

  var instructions = opts.root ? diffNode(src, dst) : [];

  var srcChs = src.childNodes;
  var dstChs = dst.childNodes;
  var srcChsLen = srcChs ? srcChs.length : 0;
  var dstChsLen = dstChs ? dstChs.length : 0;

  for (var a = 0; a < dstChsLen; a++) {
    var curSrc = srcChs[a];
    var curDst = dstChs[a];

    // If there is no matching destination node it means we need to remove the
    // current source node from the source.
    if (!curSrc) {
      instructions.push({
        destination: dstChs[a],
        source: src,
        type: APPEND_CHILD
      });
      continue;
    } else {
      // Ensure the real node is carried over even if the destination isn't used.
      // This is used in the render() function to keep track of the real node
      // that corresponds to a virtual node if a virtual tree is being used.
      if (!(curDst instanceof Node)) {
        realNodeMap.set(curDst, realNode(curSrc));
      }
    }

    instructions = instructions.concat(diffNode(curSrc, curDst));
  }

  if (dstChsLen < srcChsLen) {
    for (var _a = dstChsLen; _a < srcChsLen; _a++) {
      instructions.push({
        destination: srcChs[_a],
        source: src,
        type: REMOVE_CHILD
      });
    }
  }

  return instructions;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var _window$2 = window;
var Node$2 = _window$2.Node;


function createElement(el) {
  var realNode = document.createElement(el.tagName);
  var attributes = el.attributes;
  var events = el.events;
  var eventHandlers = eventMap(realNode);
  var children = el.childNodes;

  if (attributes) {
    var attributesLen = attributes.length;
    for (var a = 0; a < attributesLen; a++) {
      var attr = attributes[a];
      setAccessor(realNode, attr.name, attr.value);
    }
  }

  if (events) {
    for (var name in events) {
      realNode.addEventListener(name, eventHandlers[name] = events[name]);
    }
  }

  if (children) {
    var docfrag = document.createDocumentFragment();
    var childrenLen = children.length;

    for (var _a = 0; _a < childrenLen; _a++) {
      var ch = children[_a];
      ch && docfrag.appendChild(render(ch));
    }

    if (realNode.appendChild) {
      realNode.appendChild(docfrag);
    }
  }

  return realNode;
}

function createText(el) {
  return document.createTextNode(el.textContent);
}

function render(el) {
  if (el instanceof Node$2) {
    return el;
  }
  if (Array.isArray(el)) {
    var _ret = function () {
      var frag = document.createDocumentFragment();
      el.forEach(function (item) {
        return frag.appendChild(render(item));
      });
      return {
        v: frag
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  var realNode = el.tagName ? createElement(el) : createText(el);
  realNodeMap.set(el, realNode);
  return realNode;
}

var appendChild = function (src, dst) {
  realNode(src).appendChild(render(dst));
};

var removeAttribute = function (src, dst, data) {
  removeAccessor(realNode(src), data.name);
};

var removeChild = function (src, dst) {
  var realDst = realNode(dst);
  var realSrc = realNode(src);

  // We don't do parentNode.removeChild because parentNode may report
  // incorrectly in some prollyfills since it's impossible (?) to spoof.
  realSrc.removeChild(realDst);
};

var replaceChild = function (src, dst) {
  var realSrc = realNode(src);
  realSrc && realSrc.parentNode && realSrc.parentNode.replaceChild(render(dst), realSrc);
};

var setAttribute = function (src, dst, data) {
  setAccessor(realNode(src), data.name, data.value);
};

var setEvent = function (src, dst, data) {
  var realSrc = realNode(src);
  var eventHandlers = eventMap(realSrc);
  var name = data.name;
  var prevHandler = eventHandlers[name];
  var nextHandler = data.value;

  if (typeof prevHandler === 'function') {
    delete eventHandlers[name];
    realSrc.removeEventListener(name, prevHandler);
  }

  if (typeof nextHandler === 'function') {
    eventHandlers[name] = nextHandler;
    realSrc.addEventListener(name, nextHandler);
  }
};

var textContent = function (src, dst) {
  realNode(src).textContent = dst.textContent;
};

var patchers = {};
patchers[APPEND_CHILD] = appendChild;
patchers[REMOVE_ATTRIBUTE] = removeAttribute;
patchers[REMOVE_CHILD] = removeChild;
patchers[REPLACE_CHILD] = replaceChild;
patchers[SET_ATTRIBUTE] = setAttribute;
patchers[SET_EVENT] = setEvent;
patchers[TEXT_CONTENT] = textContent;

function patch(instruction) {
  patchers[instruction.type](instruction.source, instruction.destination, instruction.data);
}

var patch$1 = function (instructions) {
  instructions.forEach(patch);
};

var merge = function (opts) {
  var inst = diff(opts);
  patch$1(inst);
  return inst;
};

function createTextNode(item) {
  return {
    nodeType: 3,
    textContent: item
  };
}

function separateData(obj) {
  var attrs = {};
  var events = {};
  var node = {};
  var attrIdx = 0;

  for (var name in obj) {
    var value = obj[name];

    if (name.indexOf('on') === 0) {
      events[name.substring(2)] = value;
    } else {
      attrs[attrIdx++] = attrs[name] = { name: name, value: value };
      mapAccessor(node, name, value);
    }
  }

  attrs.length = attrIdx;
  return { attrs: attrs, events: events, node: node };
}

function ensureNodes(arr) {
  var out = [];
  if (!Array.isArray(arr)) {
    arr = [arr];
  }
  arr.filter(Boolean).forEach(function (item) {
    if (Array.isArray(item)) {
      out = out.concat(ensureNodes(item));
    } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
      out.push(translateFromReact(item));
    } else {
      out.push(createTextNode(item));
    }
  });
  return out;
}

function ensureTagName(name) {
  return (typeof name === 'function' ? name.id || name.name : name).toUpperCase();
}

function isChildren(arg) {
  return arg && (typeof arg === 'string' || Array.isArray(arg) || typeof arg.nodeType === 'number' || isReactNode(arg));
}

function isReactNode(item) {
  return item && item.type && item.props;
}

function translateFromReact(item) {
  if (isReactNode(item)) {
    var props = item.props;
    var chren = ensureNodes(props.children);
    delete props.children;
    return {
      nodeType: 1,
      tagName: item.type,
      attributes: props,
      childNodes: chren
    };
  }
  return item;
}

function element(name) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var isAttrsNode = isChildren(attrs);
  var data = separateData(isAttrsNode ? {} : attrs);
  var node = data.node;
  node.nodeType = 1;
  node.tagName = ensureTagName(name);
  node.attributes = data.attrs;
  node.events = data.events;

  for (var _len = arguments.length, chren = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    chren[_key - 2] = arguments[_key];
  }

  node.childNodes = ensureNodes(isAttrsNode ? [attrs].concat(chren) : chren);
  return node;
}

// Add an array factory that returns an array of virtual nodes.
element.array = ensureNodes;

// Generate built-in factories.
['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'bgsound', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  element[tag] = element.bind(null, tag);
});

function removeChildNodes(elem) {
  while (elem.firstChild) {
    var first = elem.firstChild;
    first.parentNode.removeChild(first);
  }
}

var mount = function (elem, tree) {
  removeChildNodes(elem);
  elem.appendChild(render(tree));
};

var _window$3 = window;
var Node$3 = _window$3.Node;

var oldTreeMap = new WeakMap$1();

var render$1 = function (render) {
  return function (elem) {
    elem = elem instanceof Node$3 ? elem : this;

    if (!(elem instanceof Node$3)) {
      throw new Error('No node provided to diff renderer as either the first argument or the context.');
    }

    // Create a new element to house the new tree since we diff / mount fragments.
    var newTree = element('div', null, render(elem));
    var oldTree = oldTreeMap.get(elem);

    if (oldTree) {
      merge({
        destination: newTree,
        source: oldTree
      });
    } else {
      mount(elem, newTree.childNodes);
    }

    oldTreeMap.set(elem, newTree);
  };
};

var vdom = {
  dom: render,
  element: element,
  mount: mount,
  text: createTextNode
};

var version = '0.3.1';

var index = {
  diff: diff,
  merge: merge,
  patch: patch$1,
  render: render$1,
  types: types,
  vdom: vdom,
  version: version
};

exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],27:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":7,"inherits":9,"readable-stream/duplex.js":15,"readable-stream/passthrough.js":22,"readable-stream/readable.js":23,"readable-stream/transform.js":24,"readable-stream/writable.js":25}],28:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":5}],29:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],31:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],32:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":31,"_process":14,"inherits":30}],33:[function(require,module,exports){
(function (process,global,__dirname){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stream = _interopDefault(require('stream'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var util = _interopDefault(require('util'));
var events = _interopDefault(require('events'));

const { HTMLElement: HTMLElement$1, MutationObserver: MutationObserver$1, navigator: navigator$1 } = window;
const { userAgent } = navigator$1;
const safari = userAgent.indexOf('Safari/60') !== -1;
const safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
const safariVersions = [0, 1].map(v => `10.0.${ v }`).concat(['10.0']);
const patch = safari && safariVersions.indexOf(safariVersion) > -1;

// Workaround for https://bugs.webkit.org/show_bug.cgi?id=160331
function fixSafari() {
  const oldAttachShadow = HTMLElement$1.prototype.attachShadow;

  // We observe a shadow root, but only need to know if the target that was mutated is a <style>
  // element as this is the only scenario where styles aren't recalculated.
  const moOpts = { childList: true, subtree: true };
  const mo = new MutationObserver$1(muts => {
    muts.forEach(mut => {
      const { target } = mut;
      if (target.tagName === 'STYLE') {
        const { nextSibling, parentNode } = target;

        // We actually have to remove and subsequently re-insert rather than doing insertBefore()
        // as it seems that doesn't trigger a recalc.
        parentNode.removeChild(target);
        parentNode.insertBefore(target, nextSibling);
      }
    });
  });

  // Our override simply calls the native (or overridden) attachShadow but it ensures that changes
  // to it are observed so that we can take any <style> elements and re-insert them.
  function newAttachShadow(opts) {
    const sr = oldAttachShadow.call(this, opts);
    mo.observe(sr, moOpts);
    return sr;
  }

  // We have to define a property because Safari won't take the override if it is set directly.
  Object.defineProperty(HTMLElement$1.prototype, 'attachShadow', {
    // Ensure polyfills can override it (hoping they call it back).
    configurable: true,
    enumerable: true,
    value: newAttachShadow,
    writable: true
  });
}

// We target a specific version of Safari instead of trying to but detect as it seems to involve
// contriving a breaking case and detecting computed styles. We can remove this code when Safari
// fixes the bug.
if (patch) {
  fixSafari();
}

window.customElements && eval(`/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of \`new.target\` to look up the custom
 * element definition for the currently called constructor. \`new.target\` is only
 * set when \`new\` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of \`SuperClass.call(this)\`\` only works
 * when extending other ES5-style classes, and does not propagate \`new.target\`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * \`customElements.define()\` and \`customElements.get()\` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * \`browserConstruction\` and \`userConstruction\` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      \`return SuperClass.call(this)\`
 *   3. The \`this\` reference should not be used before the emulated super() call
 *      just like \`this\` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
(() => {
  'use strict';

  const NativeHTMLElement = window.HTMLElement;
  const nativeDefine = window.customElements.define;
  const nativeGet = window.customElements.get;

  /**
   * Map of user-provided constructors to tag names.
   *
   * @type {Map<Function, string>}
   */
  const tagnameByConstructor = new Map();

  /**
   * Map of tag names to user-provided constructors.
   *
   * @type {Map<string, Function>}
   */
  const constructorByTagname = new Map();


  /**
   * Whether the constructors are being called by a browser process, ie parsing
   * or createElement.
   */
  let browserConstruction = false;

  /**
   * Whether the constructors are being called by a user-space process, ie
   * calling an element constructor.
   */
  let userConstruction = false;

  window.HTMLElement = function() {
    if (!browserConstruction) {
      const tagname = tagnameByConstructor.get(this.constructor);
      const fakeClass = nativeGet.call(window.customElements, tagname);

      // Make sure that the fake constructor doesn't call back to this constructor
      userConstruction = true;
      const instance = new (fakeClass)();
      return instance;
    }
    // Else do nothing. This will be reached by ES5-style classes doing
    // HTMLElement.call() during initialization
    browserConstruction = false;
  };

  window.HTMLElement.prototype = Object.create(NativeHTMLElement.prototype);
  window.HTMLElement.prototype.constructor = window.HTMLElement;

  window.customElements.define = (tagname, elementClass) => {
    const elementProto = elementClass.prototype;
    const StandInElement = class extends NativeHTMLElement {
      constructor() {
        // Call the native HTMLElement constructor, this gives us the
        // under-construction instance as \`this\`:
        super();

        // The prototype will be wrong up because the browser used our fake
        // class, so fix it:
        Object.setPrototypeOf(this, elementProto);

        if (!userConstruction) {
          // Make sure that user-defined constructor bottom's out to a do-nothing
          // HTMLElement() call
          browserConstruction = true;
          // Call the user-defined constructor on our instance:
          elementClass.call(this);
        }
        userConstruction = false;
      }
    };
    const standInProto = StandInElement.prototype;
    StandInElement.observedAttributes = elementClass.observedAttributes;
    standInProto.connectedCallback = elementProto.connectedCallback;
    standInProto.disconnectedCallback = elementProto.disconnectedCallback;
    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;
    standInProto.adoptedCallback = elementProto.adoptedCallback;

    tagnameByConstructor.set(elementClass, tagname);
    constructorByTagname.set(tagname, elementClass);
    nativeDefine.call(window.customElements, tagname, StandInElement);
  };

  window.customElements.get = (tagname) => constructorByTagname.get(tagname);

})();`);

/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function () {
  function c() {
    this.a = new Map();this.j = new Map();this.h = new Map();this.o = new Set();this.C = new MutationObserver(this.D.bind(this));this.f = null;this.F = new Set();this.enableFlush = !0;this.s = !1;this.m = null;
  }function g() {
    return h.customElements;
  }function k(a) {
    if (!/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a) || -1 !== r.indexOf(a)) return Error("The element name '" + a + "' is not valid.");
  }function l(a, b, e, d) {
    var c = g();a = e ? m.call(a, b, e) : m.call(a, b);(b = c.a.get(b.toLowerCase())) && c.u(a, b, d);c.b(a);return a;
  }
  function n(a, b, e, d) {
    b = b.toLowerCase();var c = a.getAttribute(b);d.call(a, b, e);1 == a.__$CE_upgraded && (d = g().a.get(a.localName), e = d.A, (d = d.i) && 0 <= e.indexOf(b) && (e = a.getAttribute(b), e !== c && d.call(a, b, c, e, null)));
  }var f = document,
      h = window;if (g() && (g().g = function () {}, !g().forcePolyfill)) return;var r = "annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ");c.prototype.L = function (a, b) {
    function e(a) {
      var b = f[a];if (void 0 !== b && "function" !== typeof b) throw Error(c + " '" + a + "' is not a Function");return b;
    }if ("function" !== typeof b) throw new TypeError("constructor must be a Constructor");var d = k(a);if (d) throw d;if (this.a.has(a)) throw Error("An element with name '" + a + "' is already defined");if (this.j.has(b)) throw Error("Definition failed for '" + a + "': The constructor is already used.");var c = a,
        f = b.prototype;if ("object" !== typeof f) throw new TypeError("Definition failed for '" + a + "': constructor.prototype must be an object");var d = e("connectedCallback"),
        g = e("disconnectedCallback"),
        h = e("attributeChangedCallback");this.a.set(c, { name: a, localName: c, constructor: b, v: d, w: g, i: h, A: h && b.observedAttributes || [] });this.j.set(b, c);this.K();if (a = this.h.get(c)) a.resolve(void 0), this.h.delete(c);
  };c.prototype.get = function (a) {
    return (a = this.a.get(a)) ? a.constructor : void 0;
  };c.prototype.M = function (a) {
    var b = k(a);if (b) return Promise.reject(b);if (this.a.has(a)) return Promise.resolve();if (b = this.h.get(a)) return b.N;var e,
        d = new Promise(function (a) {
      e = a;
    }),
        b = { N: d, resolve: e };this.h.set(a, b);return d;
  };c.prototype.g = function () {
    this.enableFlush && (this.l(this.m.takeRecords()), this.D(this.C.takeRecords()), this.o.forEach(function (a) {
      this.l(a.takeRecords());
    }, this));
  };c.prototype.K = function () {
    var a = this;if (!this.s) {
      this.s = !0;var b = function () {
        a.s = !1;a.m || (a.m = a.b(f));a.c(f.childNodes);
      };window.HTMLImports ? window.HTMLImports.whenReady(b) : b();
    }
  };c.prototype.I = function (a) {
    this.f = a;
  };c.prototype.b = function (a) {
    if (null != a.__$CE_observer) return a.__$CE_observer;a.__$CE_observer = new MutationObserver(this.l.bind(this));a.__$CE_observer.observe(a, { childList: !0, subtree: !0 });this.enableFlush && this.o.add(a.__$CE_observer);return a.__$CE_observer;
  };c.prototype.J = function (a) {
    null != a.__$CE_observer && (a.__$CE_observer.disconnect(), this.enableFlush && this.o.delete(a.__$CE_observer), a.__$CE_observer = null);
  };c.prototype.l = function (a) {
    for (var b = 0; b < a.length; b++) {
      var e = a[b];if ("childList" === e.type) {
        var d = e.removedNodes;this.c(e.addedNodes);this.H(d);
      }
    }
  };c.prototype.c = function (a, b) {
    b = b || new Set();for (var e = 0; e < a.length; e++) {
      var d = a[e];if (d.nodeType === Node.ELEMENT_NODE) {
        this.J(d);
        d = f.createTreeWalker(d, NodeFilter.SHOW_ELEMENT, null, !1);do this.G(d.currentNode, b); while (d.nextNode());
      }
    }
  };c.prototype.G = function (a, b) {
    if (!b.has(a)) {
      b.add(a);var e = this.a.get(a.localName);if (e) {
        a.__$CE_upgraded || this.u(a, e, !0);var d;if (d = a.__$CE_upgraded && !a.__$CE_attached) a: {
          d = a;do {
            if (d.__$CE_attached || d.nodeType === Node.DOCUMENT_NODE) {
              d = !0;break a;
            }d = d.parentNode || d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host;
          } while (d);d = !1;
        }d && (a.__$CE_attached = !0, e.v && e.v.call(a));
      }a.shadowRoot && this.c(a.shadowRoot.childNodes, b);"LINK" === a.tagName && a.rel && -1 !== a.rel.toLowerCase().split(" ").indexOf("import") && this.B(a, b);
    }
  };c.prototype.B = function (a, b) {
    var e = a.import;if (e) b.has(e) || (b.add(e), e.__$CE_observer || this.b(e), this.c(e.childNodes, b));else if (b = a.href, !this.F.has(b)) {
      this.F.add(b);var d = this,
          c = function () {
        a.removeEventListener("load", c);a.import.__$CE_observer || d.b(a.import);d.c(a.import.childNodes);
      };a.addEventListener("load", c);
    }
  };c.prototype.H = function (a) {
    for (var b = 0; b < a.length; b++) {
      var e = a[b];if (e.nodeType === Node.ELEMENT_NODE) {
        this.b(e);
        e = f.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, null, !1);do {
          var d = e.currentNode;if (d.__$CE_upgraded && d.__$CE_attached) {
            d.__$CE_attached = !1;var c = this.a.get(d.localName);c && c.w && c.w.call(d);
          }
        } while (e.nextNode());
      }
    }
  };c.prototype.u = function (a, b, e) {
    a.__proto__ = b.constructor.prototype;e && (this.I(a), new b.constructor(), a.__$CE_upgraded = !0, console.assert(!this.f));e = b.A;if ((b = b.i) && 0 < e.length) {
      this.C.observe(a, { attributes: !0, attributeOldValue: !0, attributeFilter: e });for (var d = 0; d < e.length; d++) {
        var c = e[d];if (a.hasAttribute(c)) {
          var f = a.getAttribute(c);b.call(a, c, null, f, null);
        }
      }
    }
  };c.prototype.D = function (a) {
    for (var b = 0; b < a.length; b++) {
      var c = a[b];if ("attributes" === c.type) {
        var d = c.target,
            f = this.a.get(d.localName),
            g = c.attributeName,
            h = c.oldValue,
            k = d.getAttribute(g);k !== h && f.i.call(d, g, h, k, c.attributeNamespace);
      }
    }
  };window.CustomElementRegistry = c;c.prototype.define = c.prototype.L;c.prototype.get = c.prototype.get;c.prototype.whenDefined = c.prototype.M;c.prototype.flush = c.prototype.g;c.prototype.polyfilled = !0;c.prototype._observeRoot = c.prototype.b;
  c.prototype._addImport = c.prototype.B;var p = h.HTMLElement;c.prototype.nativeHTMLElement = p;h.HTMLElement = function () {
    var a = g();if (a.f) {
      var b = a.f;a.f = null;return b;
    }if (this.constructor) return a = a.j.get(this.constructor), l(f, a, void 0, !1);throw Error("Unknown constructor. Did you call customElements.define()?");
  };h.HTMLElement.prototype = Object.create(p.prototype, { constructor: { value: h.HTMLElement, configurable: !0, writable: !0 } });var m = f.createElement;f.createElement = function (a, b) {
    return l(f, a, b, !0);
  };var t = f.createElementNS;f.createElementNS = function (a, b) {
    return "http://www.w3.org/1999/xhtml" === a ? f.createElement(b) : t.call(f, a, b);
  };var q = Element.prototype.attachShadow;q && Object.defineProperty(Element.prototype, "attachShadow", { value: function (a) {
      a = q.call(this, a);g().b(a);return a;
    } });var u = f.importNode;f.importNode = function (a, b) {
    a = u.call(f, a, b);g().c(a.nodeType === Node.ELEMENT_NODE ? [a] : a.childNodes);return a;
  };var v = Element.prototype.setAttribute;Element.prototype.setAttribute = function (a, b) {
    n(this, a, b, v);
  };
  var w = Element.prototype.removeAttribute;Element.prototype.removeAttribute = function (a) {
    n(this, a, null, w);
  };Object.defineProperty(window, "customElements", { value: new c(), configurable: !0, enumerable: !0 });window.CustomElements = { takeRecords: function () {
      g().g && g().g();
    } };
})();

(function () {
  'use strict';

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var settings = window.ShadyDOM || {};

  settings.hasNativeShadowDOM = Boolean(Element.prototype.attachShadow && Node.prototype.getRootNode);

  settings.inUse = settings.force || !settings.hasNativeShadowDOM;

  function isShadyRoot(obj) {
    return Boolean(obj.__localName === 'ShadyRoot');
  }

  var p = Element.prototype;
  var matches = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;

  function matchesSelector(element, selector) {
    return matches.call(element, selector);
  }

  function copyOwnProperty(name, source, target) {
    var pd = Object.getOwnPropertyDescriptor(source, name);
    if (pd) {
      Object.defineProperty(target, name, pd);
    }
  }

  function extend(target, source) {
    if (target && source) {
      var n$ = Object.getOwnPropertyNames(source);
      for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
        copyOwnProperty(n, source, target);
      }
    }
    return target || source;
  }

  function extendAll(target) {
    var sources = [],
        len = arguments.length - 1;
    while (len-- > 0) sources[len] = arguments[len + 1];

    for (var i = 0; i < sources.length; i++) {
      extend(target, sources[i]);
    }
    return target;
  }

  function mixin(target, source) {
    for (var i in source) {
      target[i] = source[i];
    }
    return target;
  }

  var setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };

  function patchPrototype(obj, mixin) {
    var proto = Object.getPrototypeOf(obj);
    if (!proto.hasOwnProperty('__patchProto')) {
      var patchProto = Object.create(proto);
      patchProto.__sourceProto = proto;
      extend(patchProto, mixin);
      proto.__patchProto = patchProto;
    }
    setPrototypeOf(obj, proto.__patchProto);
  }

  var common = {};

  // TODO(sorvell): actually rely on a real Promise polyfill...
  var promish;
  if (window.Promise) {
    promish = Promise.resolve();
  } else {
    promish = {
      then: function (cb) {
        var twiddle = document.createTextNode('');
        var observer = new MutationObserver(function () {
          observer.disconnect();
          cb();
        });
        observer.observe(twiddle, { characterData: true });
      }
    };
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  var ArraySplice = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var this$1 = this;

      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      // "Addition" rows. Initialize null column.
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (var j = 0; j < columnCount; j++) distances[0][j] = j;

      for (var i$1 = 1; i$1 < rowCount; i$1++) {
        for (var j$1 = 1; j$1 < columnCount; j$1++) {
          if (this$1.equals(current[currentStart + j$1 - 1], old[oldStart + i$1 - 1])) distances[i$1][j$1] = distances[i$1 - 1][j$1 - 1];else {
            var north = distances[i$1 - 1][j$1] + 1;
            var west = distances[i$1][j$1 - 1] + 1;
            distances[i$1][j$1] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;
      var splice;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];

      if (currentStart == currentEnd) {
        splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);

        return [splice];
      } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];

      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

      splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice) splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice) splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice) splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      var this$1 = this;

      for (var i = 0; i < searchLength; i++) if (!this$1.equals(current[i], old[i])) return i;
      return searchLength;
    },

    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;

      return count;
    },

    calculateSplices: function calculateSplices$1(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },

    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }

  };

  var calculateSplices = function (current, previous) {
    return ArraySplice.calculateSplices(current, previous);
  };

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // TODO(sorvell): circular (patch loads tree and tree loads patch)
  // for now this is stuck on `utils`
  //import {patchNode} from './patch'
  // native add/remove
  var nativeInsertBefore = Element.prototype.insertBefore;
  var nativeAppendChild = Element.prototype.appendChild;
  var nativeRemoveChild = Element.prototype.removeChild;

  /**
   * `tree` is a dom manipulation library used by ShadyDom to
   * manipulate composed and logical trees.
   */
  var tree = {

    // sad but faster than slice...
    arrayCopyChildNodes: function arrayCopyChildNodes(parent) {
      var copy = [],
          i = 0;
      for (var n = parent.firstChild; n; n = n.nextSibling) {
        copy[i++] = n;
      }
      return copy;
    },

    arrayCopyChildren: function arrayCopyChildren(parent) {
      var copy = [],
          i = 0;
      for (var n = parent.firstElementChild; n; n = n.nextElementSibling) {
        copy[i++] = n;
      }
      return copy;
    },

    arrayCopy: function arrayCopy(a$) {
      var l = a$.length;
      var copy = new Array(l);
      for (var i = 0; i < l; i++) {
        copy[i] = a$[i];
      }
      return copy;
    },

    saveChildNodes: function saveChildNodes(node) {
      tree.Logical.saveChildNodes(node);
      if (!tree.Composed.hasParentNode(node)) {
        tree.Composed.saveComposedData(node);
        //tree.Composed.saveParentNode(node);
      }
      tree.Composed.saveChildNodes(node);
    }

  };

  tree.Logical = {

    hasParentNode: function hasParentNode(node) {
      return Boolean(node.__dom && node.__dom.parentNode);
    },

    hasChildNodes: function hasChildNodes(node) {
      return Boolean(node.__dom && node.__dom.childNodes !== undefined);
    },

    getChildNodes: function getChildNodes(node) {
      // note: we're distinguishing here between undefined and false-y:
      // hasChildNodes uses undefined check to see if this element has logical
      // children; the false-y check indicates whether or not we should rebuild
      // the cached childNodes array.
      return this.hasChildNodes(node) ? this._getChildNodes(node) : tree.Composed.getChildNodes(node);
    },

    _getChildNodes: function _getChildNodes(node) {
      if (!node.__dom.childNodes) {
        node.__dom.childNodes = [];
        for (var n = this.getFirstChild(node); n; n = this.getNextSibling(n)) {
          node.__dom.childNodes.push(n);
        }
      }
      return node.__dom.childNodes;
    },

    // NOTE: __dom can be created under 2 conditions: (1) an element has a
    // logical tree, or (2) an element is in a logical tree. In case (1), the
    // element will store firstChild/lastChild, and in case (2), the element
    // will store parentNode, nextSibling, previousSibling. This means that
    // the mere existence of __dom is not enough to know if the requested
    // logical data is available and instead we do an explicit undefined check.
    getParentNode: function getParentNode(node) {
      return node.__dom && node.__dom.parentNode !== undefined ? node.__dom.parentNode : tree.Composed.getParentNode(node);
    },

    getFirstChild: function getFirstChild(node) {
      return node.__dom && node.__dom.firstChild !== undefined ? node.__dom.firstChild : tree.Composed.getFirstChild(node);
    },

    getLastChild: function getLastChild(node) {
      return node.__dom && node.__dom.lastChild !== undefined ? node.__dom.lastChild : tree.Composed.getLastChild(node);
    },

    getNextSibling: function getNextSibling(node) {
      return node.__dom && node.__dom.nextSibling !== undefined ? node.__dom.nextSibling : tree.Composed.getNextSibling(node);
    },

    getPreviousSibling: function getPreviousSibling(node) {
      return node.__dom && node.__dom.previousSibling !== undefined ? node.__dom.previousSibling : tree.Composed.getPreviousSibling(node);
    },

    getFirstElementChild: function getFirstElementChild(node) {
      return node.__dom && node.__dom.firstChild !== undefined ? this._getFirstElementChild(node) : tree.Composed.getFirstElementChild(node);
    },

    _getFirstElementChild: function _getFirstElementChild(node) {
      var n = node.__dom.firstChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.nextSibling;
      }
      return n;
    },

    getLastElementChild: function getLastElementChild(node) {
      return node.__dom && node.__dom.lastChild !== undefined ? this._getLastElementChild(node) : tree.Composed.getLastElementChild(node);
    },

    _getLastElementChild: function _getLastElementChild(node) {
      var n = node.__dom.lastChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.previousSibling;
      }
      return n;
    },

    getNextElementSibling: function getNextElementSibling(node) {
      return node.__dom && node.__dom.nextSibling !== undefined ? this._getNextElementSibling(node) : tree.Composed.getNextElementSibling(node);
    },

    _getNextElementSibling: function _getNextElementSibling(node) {
      var this$1 = this;

      var n = node.__dom.nextSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = this$1.getNextSibling(n);
      }
      return n;
    },

    getPreviousElementSibling: function getPreviousElementSibling(node) {
      return node.__dom && node.__dom.previousSibling !== undefined ? this._getPreviousElementSibling(node) : tree.Composed.getPreviousElementSibling(node);
    },

    _getPreviousElementSibling: function _getPreviousElementSibling(node) {
      var this$1 = this;

      var n = node.__dom.previousSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = this$1.getPreviousSibling(n);
      }
      return n;
    },

    // Capture the list of light children. It's important to do this before we
    // start transforming the DOM into "rendered" state.
    // Children may be added to this list dynamically. It will be treated as the
    // source of truth for the light children of the element. This element's
    // actual children will be treated as the rendered state once this function
    // has been called.
    saveChildNodes: function saveChildNodes$1(node) {
      if (!this.hasChildNodes(node)) {
        node.__dom = node.__dom || {};
        node.__dom.firstChild = node.firstChild;
        node.__dom.lastChild = node.lastChild;
        var c$ = node.__dom.childNodes = tree.arrayCopyChildNodes(node);
        for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
          n.__dom = n.__dom || {};
          n.__dom.parentNode = node;
          n.__dom.nextSibling = c$[i + 1] || null;
          n.__dom.previousSibling = c$[i - 1] || null;
          common.patchNode(n);
        }
      }
    },

    // TODO(sorvell): may need to patch saveChildNodes iff the tree has
    // already been distributed.
    // NOTE: ensure `node` is patched...
    recordInsertBefore: function recordInsertBefore(node, container, ref_node) {
      var this$1 = this;

      container.__dom.childNodes = null;
      // handle document fragments
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var c$ = tree.arrayCopyChildNodes(node);
        for (var i = 0; i < c$.length; i++) {
          this$1._linkNode(c$[i], container, ref_node);
        }
        // cleanup logical dom in doc fragment.
        node.__dom = node.__dom || {};
        node.__dom.firstChild = node.__dom.lastChild = null;
        node.__dom.childNodes = null;
      } else {
        this._linkNode(node, container, ref_node);
      }
    },

    _linkNode: function _linkNode(node, container, ref_node) {
      common.patchNode(node);
      ref_node = ref_node || null;
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (ref_node) {
        ref_node.__dom = ref_node.__dom || {};
      }
      // update ref_node.previousSibling <-> node
      node.__dom.previousSibling = ref_node ? ref_node.__dom.previousSibling : container.__dom.lastChild;
      if (node.__dom.previousSibling) {
        node.__dom.previousSibling.__dom.nextSibling = node;
      }
      // update node <-> ref_node
      node.__dom.nextSibling = ref_node;
      if (node.__dom.nextSibling) {
        node.__dom.nextSibling.__dom.previousSibling = node;
      }
      // update node <-> container
      node.__dom.parentNode = container;
      if (ref_node) {
        if (ref_node === container.__dom.firstChild) {
          container.__dom.firstChild = node;
        }
      } else {
        container.__dom.lastChild = node;
        if (!container.__dom.firstChild) {
          container.__dom.firstChild = node;
        }
      }
      // remove caching of childNodes
      container.__dom.childNodes = null;
    },

    recordRemoveChild: function recordRemoveChild(node, container) {
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (node === container.__dom.firstChild) {
        container.__dom.firstChild = node.__dom.nextSibling;
      }
      if (node === container.__dom.lastChild) {
        container.__dom.lastChild = node.__dom.previousSibling;
      }
      var p = node.__dom.previousSibling;
      var n = node.__dom.nextSibling;
      if (p) {
        p.__dom = p.__dom || {};
        p.__dom.nextSibling = n;
      }
      if (n) {
        n.__dom = n.__dom || {};
        n.__dom.previousSibling = p;
      }
      // When an element is removed, logical data is no longer tracked.
      // Explicitly set `undefined` here to indicate this. This is disginguished
      // from `null` which is set if info is null.
      node.__dom.parentNode = node.__dom.previousSibling = node.__dom.nextSibling = null;
      // remove caching of childNodes
      container.__dom.childNodes = null;
    }

  };

  // TODO(sorvell): composed tree manipulation is made available
  // (1) to maninpulate the composed tree, and (2) to track changes
  // to the tree for optional patching pluggability.
  tree.Composed = {

    hasParentNode: function hasParentNode$1(node) {
      return Boolean(node.__dom && node.__dom.$parentNode !== undefined);
    },

    hasChildNodes: function hasChildNodes$1(node) {
      return Boolean(node.__dom && node.__dom.$childNodes !== undefined);
    },

    getChildNodes: function getChildNodes$1(node) {
      return this.hasChildNodes(node) ? this._getChildNodes(node) : !node.__patched && tree.arrayCopy(node.childNodes);
    },

    _getChildNodes: function _getChildNodes$1(node) {
      if (!node.__dom.$childNodes) {
        node.__dom.$childNodes = [];
        for (var n = node.__dom.$firstChild; n; n = n.__dom.$nextSibling) {
          node.__dom.$childNodes.push(n);
        }
      }
      return node.__dom.$childNodes;
    },

    getComposedChildNodes: function getComposedChildNodes(node) {
      return node.__dom.$childNodes;
    },

    getParentNode: function getParentNode$1(node) {
      return this.hasParentNode(node) ? node.__dom.$parentNode : !node.__patched && node.parentNode;
    },

    getFirstChild: function getFirstChild$1(node) {
      return node.__patched ? node.__dom.$firstChild : node.firstChild;
    },

    getLastChild: function getLastChild$1(node) {
      return node.__patched ? node.__dom.$lastChild : node.lastChild;
    },

    getNextSibling: function getNextSibling$1(node) {
      return node.__patched ? node.__dom.$nextSibling : node.nextSibling;
    },

    getPreviousSibling: function getPreviousSibling$1(node) {
      return node.__patched ? node.__dom.$previousSibling : node.previousSibling;
    },

    getFirstElementChild: function getFirstElementChild$1(node) {
      return node.__patched ? this._getFirstElementChild(node) : node.firstElementChild;
    },

    _getFirstElementChild: function _getFirstElementChild$1(node) {
      var n = node.__dom.$firstChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.$nextSibling;
      }
      return n;
    },

    getLastElementChild: function getLastElementChild$1(node) {
      return node.__patched ? this._getLastElementChild(node) : node.lastElementChild;
    },

    _getLastElementChild: function _getLastElementChild$1(node) {
      var n = node.__dom.$lastChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.$previousSibling;
      }
      return n;
    },

    getNextElementSibling: function getNextElementSibling$1(node) {
      return node.__patched ? this._getNextElementSibling(node) : node.nextElementSibling;
    },

    _getNextElementSibling: function _getNextElementSibling$1(node) {
      var this$1 = this;

      var n = node.__dom.$nextSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = this$1.getNextSibling(n);
      }
      return n;
    },

    getPreviousElementSibling: function getPreviousElementSibling$1(node) {
      return node.__patched ? this._getPreviousElementSibling(node) : node.previousElementSibling;
    },

    _getPreviousElementSibling: function _getPreviousElementSibling$1(node) {
      var this$1 = this;

      var n = node.__dom.$previousSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = this$1.getPreviousSibling(n);
      }
      return n;
    },

    saveChildNodes: function saveChildNodes$2(node) {
      var this$1 = this;

      if (!this.hasChildNodes(node)) {
        node.__dom = node.__dom || {};
        node.__dom.$firstChild = node.firstChild;
        node.__dom.$lastChild = node.lastChild;
        var c$ = node.__dom.$childNodes = tree.arrayCopyChildNodes(node);
        for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
          this$1.saveComposedData(n);
        }
      }
    },

    saveComposedData: function saveComposedData(node) {
      node.__dom = node.__dom || {};
      if (node.__dom.$parentNode === undefined) {
        node.__dom.$parentNode = node.parentNode;
      }
      if (node.__dom.$nextSibling === undefined) {
        node.__dom.$nextSibling = node.nextSibling;
      }
      if (node.__dom.$previousSibling === undefined) {
        node.__dom.$previousSibling = node.previousSibling;
      }
    },

    recordInsertBefore: function recordInsertBefore$1(node, container, ref_node) {
      var this$1 = this;

      container.__dom.$childNodes = null;
      // handle document fragments
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        // TODO(sorvell): remember this for patching:
        // the act of setting this info can affect patched nodes
        // getters; therefore capture childNodes before patching.
        for (var n = this.getFirstChild(node); n; n = this.getNextSibling(n)) {
          this$1._linkNode(n, container, ref_node);
        }
      } else {
        this._linkNode(node, container, ref_node);
      }
    },

    _linkNode: function _linkNode$1(node, container, ref_node) {
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (ref_node) {
        ref_node.__dom = ref_node.__dom || {};
      }
      // update ref_node.previousSibling <-> node
      node.__dom.$previousSibling = ref_node ? ref_node.__dom.$previousSibling : container.__dom.$lastChild;
      if (node.__dom.$previousSibling) {
        node.__dom.$previousSibling.__dom.$nextSibling = node;
      }
      // update node <-> ref_node
      node.__dom.$nextSibling = ref_node;
      if (node.__dom.$nextSibling) {
        node.__dom.$nextSibling.__dom.$previousSibling = node;
      }
      // update node <-> container
      node.__dom.$parentNode = container;
      if (ref_node) {
        if (ref_node === container.__dom.$firstChild) {
          container.__dom.$firstChild = node;
        }
      } else {
        container.__dom.$lastChild = node;
        if (!container.__dom.$firstChild) {
          container.__dom.$firstChild = node;
        }
      }
      // remove caching of childNodes
      container.__dom.$childNodes = null;
    },

    recordRemoveChild: function recordRemoveChild$1(node, container) {
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (node === container.__dom.$firstChild) {
        container.__dom.$firstChild = node.__dom.$nextSibling;
      }
      if (node === container.__dom.$lastChild) {
        container.__dom.$lastChild = node.__dom.$previousSibling;
      }
      var p = node.__dom.$previousSibling;
      var n = node.__dom.$nextSibling;
      if (p) {
        p.__dom = p.__dom || {};
        p.__dom.$nextSibling = n;
      }
      if (n) {
        n.__dom = n.__dom || {};
        n.__dom.$previousSibling = p;
      }
      node.__dom.$parentNode = node.__dom.$previousSibling = node.__dom.$nextSibling = null;
      // remove caching of childNodes
      container.__dom.$childNodes = null;
    },

    clearChildNodes: function clearChildNodes(node) {
      var this$1 = this;

      var c$ = this.getChildNodes(node);
      for (var i = 0, c; i < c$.length; i++) {
        c = c$[i];
        this$1.recordRemoveChild(c, node);
        nativeRemoveChild.call(node, c);
      }
    },

    saveParentNode: function saveParentNode(node) {
      node.__dom = node.__dom || {};
      node.__dom.$parentNode = node.parentNode;
    },

    insertBefore: function insertBefore(parentNode, newChild, refChild) {
      this.saveChildNodes(parentNode);
      // remove from current location.
      this._addChild(parentNode, newChild, refChild);
      return nativeInsertBefore.call(parentNode, newChild, refChild || null);
    },

    appendChild: function appendChild(parentNode, newChild) {
      this.saveChildNodes(parentNode);
      this._addChild(parentNode, newChild);
      return nativeAppendChild.call(parentNode, newChild);
    },

    removeChild: function removeChild(parentNode, node) {
      var currentParent = this.getParentNode(node);
      this.saveChildNodes(parentNode);
      this._removeChild(parentNode, node);
      if (currentParent === parentNode) {
        return nativeRemoveChild.call(parentNode, node);
      }
    },

    _addChild: function _addChild(parentNode, newChild, refChild) {
      var this$1 = this;

      var isFrag = newChild.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
      var oldParent = this.getParentNode(newChild);
      if (oldParent) {
        this._removeChild(oldParent, newChild);
      }
      if (isFrag) {
        var c$ = this.getChildNodes(newChild);
        for (var i = 0; i < c$.length; i++) {
          var c = c$[i];
          // unlink document fragment children
          this$1._removeChild(newChild, c);
          this$1.recordInsertBefore(c, parentNode, refChild);
        }
      } else {
        this.recordInsertBefore(newChild, parentNode, refChild);
      }
    },

    _removeChild: function _removeChild(parentNode, node) {
      this.recordRemoveChild(node, parentNode);
    }

  };

  // for testing...
  var descriptors = {};
  function getNativeProperty(element, property) {
    if (!descriptors[property]) {
      descriptors[property] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, property) || Object.getOwnPropertyDescriptor(Element.prototype, property) || Object.getOwnPropertyDescriptor(Node.prototype, property);
    }
    return descriptors[property].get.call(element);
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // NOTE: normalize event contruction where necessary (IE11)
  var NormalizedEvent = typeof Event === 'function' ? Event : function (inType, params) {
    params = params || {};
    var e = document.createEvent('Event');
    e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
    return e;
  };

  var Distributor = function () {
    function anonymous(root) {
      this.root = root;
      this.insertionPointTag = 'slot';
    }

    anonymous.prototype.getInsertionPoints = function getInsertionPoints() {
      return this.root.querySelectorAll(this.insertionPointTag);
    };

    anonymous.prototype.hasInsertionPoint = function hasInsertionPoint() {
      return Boolean(this.root._insertionPoints && this.root._insertionPoints.length);
    };

    anonymous.prototype.isInsertionPoint = function isInsertionPoint(node) {
      return node.localName && node.localName == this.insertionPointTag;
    };

    anonymous.prototype.distribute = function distribute() {
      if (this.hasInsertionPoint()) {
        return this.distributePool(this.root, this.collectPool());
      }
      return [];
    };

    // Gather the pool of nodes that should be distributed. We will combine
    // these with the "content root" to arrive at the composed tree.
    anonymous.prototype.collectPool = function collectPool() {
      return tree.arrayCopy(tree.Logical.getChildNodes(this.root.host));
    };

    // perform "logical" distribution; note, no actual dom is moved here,
    // instead elements are distributed into storage
    // array where applicable.
    anonymous.prototype.distributePool = function distributePool(node, pool) {
      var this$1 = this;

      var dirtyRoots = [];
      var p$ = this.root._insertionPoints;
      for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
        this$1.distributeInsertionPoint(p, pool);
        // provoke redistribution on insertion point parents
        // must do this on all candidate hosts since distribution in this
        // scope invalidates their distribution.
        // only get logical parent.
        var parent = tree.Logical.getParentNode(p);
        if (parent && parent.shadyRoot && this$1.hasInsertionPoint(parent.shadyRoot)) {
          dirtyRoots.push(parent.shadyRoot);
        }
      }
      for (var i$1 = 0; i$1 < pool.length; i$1++) {
        var p$1 = pool[i$1];
        if (p$1) {
          p$1._assignedSlot = undefined;
          // remove undistributed elements from physical dom.
          var parent$1 = tree.Composed.getParentNode(p$1);
          if (parent$1) {
            tree.Composed.removeChild(parent$1, p$1);
          }
        }
      }
      return dirtyRoots;
    };

    anonymous.prototype.distributeInsertionPoint = function distributeInsertionPoint(insertionPoint, pool) {
      var this$1 = this;

      var prevAssignedNodes = insertionPoint._assignedNodes;
      if (prevAssignedNodes) {
        this.clearAssignedSlots(insertionPoint, true);
      }
      insertionPoint._assignedNodes = [];
      var needsSlotChange = false;
      // distribute nodes from the pool that this selector matches
      var anyDistributed = false;
      for (var i = 0, l = pool.length, node; i < l; i++) {
        node = pool[i];
        // skip nodes that were already used
        if (!node) {
          continue;
        }
        // distribute this node if it matches
        if (this$1.matchesInsertionPoint(node, insertionPoint)) {
          if (node.__prevAssignedSlot != insertionPoint) {
            needsSlotChange = true;
          }
          this$1.distributeNodeInto(node, insertionPoint);
          // remove this node from the pool
          pool[i] = undefined;
          // since at least one node matched, we won't need fallback content
          anyDistributed = true;
        }
      }
      // Fallback content if nothing was distributed here
      if (!anyDistributed) {
        var children = tree.Logical.getChildNodes(insertionPoint);
        for (var j = 0, node$1; j < children.length; j++) {
          node$1 = children[j];
          if (node$1.__prevAssignedSlot != insertionPoint) {
            needsSlotChange = true;
          }
          this$1.distributeNodeInto(node$1, insertionPoint);
        }
      }
      // we're already dirty if a node was newly added to the slot
      // and we're also dirty if the assigned count decreased.
      if (prevAssignedNodes) {
        // TODO(sorvell): the tracking of previously assigned slots
        // could instead by done with a Set and then we could
        // avoid needing to iterate here to clear the info.
        for (var i$1 = 0; i$1 < prevAssignedNodes.length; i$1++) {
          prevAssignedNodes[i$1].__prevAssignedSlot = null;
        }
        if (insertionPoint._assignedNodes.length < prevAssignedNodes.length) {
          needsSlotChange = true;
        }
      }
      this.setDistributedNodesOnInsertionPoint(insertionPoint);
      if (needsSlotChange) {
        this._fireSlotChange(insertionPoint);
      }
    };

    anonymous.prototype.clearAssignedSlots = function clearAssignedSlots(slot, savePrevious) {
      var n$ = slot._assignedNodes;
      if (n$) {
        for (var i = 0; i < n$.length; i++) {
          var n = n$[i];
          if (savePrevious) {
            n.__prevAssignedSlot = n._assignedSlot;
          }
          // only clear if it was previously set to this slot;
          // this helps ensure that if the node has otherwise been distributed
          // ignore it.
          if (n._assignedSlot === slot) {
            n._assignedSlot = null;
          }
        }
      }
    };

    anonymous.prototype.matchesInsertionPoint = function matchesInsertionPoint(node, insertionPoint) {
      var slotName = insertionPoint.getAttribute('name');
      slotName = slotName ? slotName.trim() : '';
      var slot = node.getAttribute && node.getAttribute('slot');
      slot = slot ? slot.trim() : '';
      return slot == slotName;
    };

    anonymous.prototype.distributeNodeInto = function distributeNodeInto(child, insertionPoint) {
      insertionPoint._assignedNodes.push(child);
      child._assignedSlot = insertionPoint;
    };

    anonymous.prototype.setDistributedNodesOnInsertionPoint = function setDistributedNodesOnInsertionPoint(insertionPoint) {
      var this$1 = this;

      var n$ = insertionPoint._assignedNodes;
      insertionPoint._distributedNodes = [];
      for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
        if (this$1.isInsertionPoint(n)) {
          var d$ = n._distributedNodes;
          if (d$) {
            for (var j = 0; j < d$.length; j++) {
              insertionPoint._distributedNodes.push(d$[j]);
            }
          }
        } else {
          insertionPoint._distributedNodes.push(n$[i]);
        }
      }
    };

    anonymous.prototype._fireSlotChange = function _fireSlotChange(insertionPoint) {
      // NOTE: cannot bubble correctly here so not setting bubbles: true
      // Safari tech preview does not bubble but chrome does
      // Spec says it bubbles (https://dom.spec.whatwg.org/#mutation-observers)
      insertionPoint.dispatchEvent(new NormalizedEvent('slotchange'));
      if (insertionPoint._assignedSlot) {
        this._fireSlotChange(insertionPoint._assignedSlot);
      }
    };

    anonymous.prototype.isFinalDestination = function isFinalDestination(insertionPoint) {
      return !insertionPoint._assignedSlot;
    };

    return anonymous;
  }();

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
    Implements a pared down version of ShadowDOM's scoping, which is easy to
    polyfill across browsers.
  */
  var ShadyRoot = function ShadyRoot(host) {
    if (!host) {
      throw 'Must provide a host';
    }
    // NOTE: this strange construction is necessary because
    // DocumentFragment cannot be subclassed on older browsers.
    var frag = document.createDocumentFragment();
    frag.__proto__ = ShadyFragmentMixin;
    frag._init(host);
    return frag;
  };

  var ShadyMixin = {

    _init: function _init(host) {
      // NOTE: set a fake local name so this element can be
      // distinguished from a DocumentFragment when patching.
      // FF doesn't allow this to be `localName`
      this.__localName = 'ShadyRoot';
      // root <=> host
      host.shadyRoot = this;
      this.host = host;
      // logical dom setup
      tree.Logical.saveChildNodes(host);
      tree.Logical.saveChildNodes(this);
      // state flags
      this._clean = true;
      this._hasRendered = false;
      this._distributor = new Distributor(this);
      this.update();
    },

    // async render the "top" distributor (this is all that is needed to
    // distribute this host).
    update: function update() {
      // TODO(sorvell): instead the root should always be enqueued to helps record that it is dirty.
      // Then, in `render`, the top most (in the distribution tree) "dirty" root should be rendered.
      var distributionRoot = this._findDistributionRoot(this.host);
      //console.log('update from', this.host, 'root', distributionRoot.host, distributionRoot._clean);
      if (distributionRoot._clean) {
        distributionRoot._clean = false;
        enqueue(function () {
          distributionRoot.render();
        });
      }
    },

    // TODO(sorvell): this may not return a shadowRoot (for example if the element is in a docFragment)
    // this should only return a shadowRoot.
    // returns the host that's the top of this host's distribution tree
    _findDistributionRoot: function _findDistributionRoot(element) {
      var root = element.shadyRoot;
      while (element && this._elementNeedsDistribution(element)) {
        root = element.getRootNode();
        element = root && root.host;
      }
      return root;
    },

    // Return true if a host's children includes
    // an insertion point that selects selectively
    _elementNeedsDistribution: function _elementNeedsDistribution(element) {
      var this$1 = this;

      var c$ = tree.Logical.getChildNodes(element);
      for (var i = 0, c; i < c$.length; i++) {
        c = c$[i];
        if (this$1._distributor.isInsertionPoint(c)) {
          return element.getRootNode();
        }
      }
    },

    render: function render() {
      if (!this._clean) {
        this._clean = true;
        if (!this._skipUpdateInsertionPoints) {
          this.updateInsertionPoints();
        } else if (!this._hasRendered) {
          this._insertionPoints = [];
        }
        this._skipUpdateInsertionPoints = false;
        // TODO(sorvell): previous ShadyDom had a fast path here
        // that would avoid distribution for initial render if
        // no insertion points exist. We cannot currently do this because
        // it relies on elements being in the physical shadowRoot element
        // so that native methods will be used. The current append code
        // simply provokes distribution in this case and does not put the
        // nodes in the shadowRoot. This could be done but we'll need to
        // consider if the special processing is worth the perf gain.
        // if (!this._hasRendered && !this._insertionPoints.length) {
        //   tree.Composed.clearChildNodes(this.host);
        //   tree.Composed.appendChild(this.host, this);
        // } else {
        // logical
        this.distribute();
        // physical
        this.compose();
        this._hasRendered = true;
      }
    },

    forceRender: function forceRender() {
      this._clean = false;
      this.render();
    },

    distribute: function distribute() {
      var dirtyRoots = this._distributor.distribute();
      for (var i = 0; i < dirtyRoots.length; i++) {
        dirtyRoots[i].forceRender();
      }
    },

    updateInsertionPoints: function updateInsertionPoints() {
      var this$1 = this;

      var i$ = this.__insertionPoints;
      // if any insertion points have been removed, clear their distribution info
      if (i$) {
        for (var i = 0, c; i < i$.length; i++) {
          c = i$[i];
          if (c.getRootNode() !== this$1) {
            this$1._distributor.clearAssignedSlots(c);
          }
        }
      }
      i$ = this._insertionPoints = this._distributor.getInsertionPoints();
      // ensure insertionPoints's and their parents have logical dom info.
      // save logical tree info
      // a. for shadyRoot
      // b. for insertion points (fallback)
      // c. for parents of insertion points
      for (var i$1 = 0, c$1; i$1 < i$.length; i$1++) {
        c$1 = i$[i$1];
        tree.Logical.saveChildNodes(c$1);
        tree.Logical.saveChildNodes(tree.Logical.getParentNode(c$1));
      }
    },

    get _insertionPoints() {
      if (!this.__insertionPoints) {
        this.updateInsertionPoints();
      }
      return this.__insertionPoints || (this.__insertionPoints = []);
    },

    set _insertionPoints(insertionPoints) {
      this.__insertionPoints = insertionPoints;
    },

    hasInsertionPoint: function hasInsertionPoint() {
      return this._distributor.hasInsertionPoint();
    },

    compose: function compose() {
      // compose self
      // note: it's important to mark this clean before distribution
      // so that attachment that provokes additional distribution (e.g.
      // adding something to your parentNode) works
      this._composeTree();
      // TODO(sorvell): See fast paths here in Polymer v1
      // (these seem unnecessary)
    },

    // Reify dom such that it is at its correct rendering position
    // based on logical distribution.
    _composeTree: function _composeTree() {
      var this$1 = this;

      this._updateChildNodes(this.host, this._composeNode(this.host));
      var p$ = this._insertionPoints || [];
      for (var i = 0, l = p$.length, p, parent; i < l && (p = p$[i]); i++) {
        parent = tree.Logical.getParentNode(p);
        if (parent !== this$1.host && parent !== this$1) {
          this$1._updateChildNodes(parent, this$1._composeNode(parent));
        }
      }
    },

    // Returns the list of nodes which should be rendered inside `node`.
    _composeNode: function _composeNode(node) {
      var this$1 = this;

      var children = [];
      var c$ = tree.Logical.getChildNodes(node.shadyRoot || node);
      for (var i = 0; i < c$.length; i++) {
        var child = c$[i];
        if (this$1._distributor.isInsertionPoint(child)) {
          var distributedNodes = child._distributedNodes || (child._distributedNodes = []);
          for (var j = 0; j < distributedNodes.length; j++) {
            var distributedNode = distributedNodes[j];
            if (this$1.isFinalDestination(child, distributedNode)) {
              children.push(distributedNode);
            }
          }
        } else {
          children.push(child);
        }
      }
      return children;
    },

    isFinalDestination: function isFinalDestination(insertionPoint, node) {
      return this._distributor.isFinalDestination(insertionPoint, node);
    },

    // Ensures that the rendered node list inside `container` is `children`.
    _updateChildNodes: function _updateChildNodes(container, children) {
      var composed = tree.Composed.getChildNodes(container);
      var splices = calculateSplices(children, composed);
      // process removals
      for (var i = 0, d = 0, s; i < splices.length && (s = splices[i]); i++) {
        for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
          // check if the node is still where we expect it is before trying
          // to remove it; this can happen if we move a node and
          // then schedule its previous host for distribution resulting in
          // the node being removed here.
          if (tree.Composed.getParentNode(n) === container) {
            tree.Composed.removeChild(container, n);
          }
          composed.splice(s.index + d, 1);
        }
        d -= s.addedCount;
      }
      // process adds
      for (var i$1 = 0, s$1, next; i$1 < splices.length && (s$1 = splices[i$1]); i$1++) {
        //eslint-disable-line no-redeclare
        next = composed[s$1.index];
        for (var j$1 = s$1.index, n$1; j$1 < s$1.index + s$1.addedCount; j$1++) {
          n$1 = children[j$1];
          tree.Composed.insertBefore(container, n$1, next);
          // TODO(sorvell): is this splice strictly needed?
          composed.splice(j$1, 0, n$1);
        }
      }
    },

    getInsertionPointTag: function getInsertionPointTag() {
      return this._distributor.insertionPointTag;
    }

  };

  var ShadyFragmentMixin = Object.create(DocumentFragment.prototype);
  extend(ShadyFragmentMixin, ShadyMixin);

  // let needsUpgrade = window.CustomElements && !CustomElements.useNative;

  // function upgradeLogicalChildren(children) {
  //   if (needsUpgrade && children) {
  //     for (let i=0; i < children.length; i++) {
  //       CustomElements.upgrade(children[i]);
  //     }
  //   }
  // }

  // render enqueuer/flusher
  var customElements = window.customElements;
  var flushList = [];
  var scheduled;
  var flushCount = 0;
  var flushMax = 100;
  function enqueue(callback) {
    if (!scheduled) {
      scheduled = true;
      promish.then(flush$1);
    }
    flushList.push(callback);
  }

  function flush$1() {
    scheduled = false;
    flushCount++;
    while (flushList.length) {
      flushList.shift()();
    }
    if (customElements && customElements.flush) {
      customElements.flush();
    }
    // continue flushing after elements are upgraded...
    var isFlushedMaxed = flushCount > flushMax;
    if (flushList.length && !isFlushedMaxed) {
      flush$1();
    }
    flushCount = 0;
    if (isFlushedMaxed) {
      throw new Error('Loop detected in ShadyDOM distribution, aborting.');
    }
  }

  flush$1.list = flushList;

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // Cribbed from ShadowDOM polyfill
  // https://github.com/webcomponents/webcomponentsjs/blob/master/src/ShadowDOM/wrappers/HTMLElement.js#L28
  /////////////////////////////////////////////////////////////////////////////
  // innerHTML and outerHTML

  // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
  var escapeAttrRegExp = /[&\u00A0"]/g;
  var escapeDataRegExp = /[&\u00A0<>]/g;

  function escapeReplace(c) {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\u00A0':
        return '&nbsp;';
    }
  }

  function escapeAttr(s) {
    return s.replace(escapeAttrRegExp, escapeReplace);
  }

  function escapeData(s) {
    return s.replace(escapeDataRegExp, escapeReplace);
  }

  function makeSet(arr) {
    var set = {};
    for (var i = 0; i < arr.length; i++) {
      set[arr[i]] = true;
    }
    return set;
  }

  // http://www.whatwg.org/specs/web-apps/current-work/#void-elements
  var voidElements = makeSet(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  var plaintextParents = makeSet(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);

  function getOuterHTML(node, parentNode, composed) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        {
          var tagName = node.localName;
          var s = '<' + tagName;
          var attrs = node.attributes;
          for (var i = 0, attr; attr = attrs[i]; i++) {
            s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
          }
          s += '>';
          if (voidElements[tagName]) {
            return s;
          }
          return s + getInnerHTML(node, composed) + '</' + tagName + '>';
        }
      case Node.TEXT_NODE:
        {
          var data = node.data;
          if (parentNode && plaintextParents[parentNode.localName]) {
            return data;
          }
          return escapeData(data);
        }
      case Node.COMMENT_NODE:
        {
          return '<!--' + node.data + '-->';
        }
      default:
        {
          window.console.error(node);
          throw new Error('not implemented');
        }
    }
  }

  function getInnerHTML(node, composed) {
    if (node.localName === 'template') {
      node = node.content;
    }
    var s = '';
    var c$ = composed ? composed(node) : node.childNodes;
    for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
      s += getOuterHTML(child, node, composed);
    }
    return s;
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var mixinImpl = {

    // Try to add node. Record logical info, track insertion points, perform
    // distribution iff needed. Return true if the add is handled.
    addNode: function addNode(container, node, ref_node) {
      var ownerRoot = this.ownerShadyRootForNode(container);
      if (ownerRoot) {
        // optimization: special insertion point tracking
        if (node.__noInsertionPoint && ownerRoot._clean) {
          ownerRoot._skipUpdateInsertionPoints = true;
        }
        // note: we always need to see if an insertion point is added
        // since this saves logical tree info; however, invalidation state
        // needs
        var ipAdded = this._maybeAddInsertionPoint(node, container, ownerRoot);
        // invalidate insertion points IFF not already invalid!
        if (ipAdded) {
          ownerRoot._skipUpdateInsertionPoints = false;
        }
      }
      if (tree.Logical.hasChildNodes(container)) {
        tree.Logical.recordInsertBefore(node, container, ref_node);
      }
      // if not distributing and not adding to host, do a fast path addition
      var handled = this._maybeDistribute(node, container, ownerRoot) || container.shadyRoot;
      return handled;
    },

    // Try to remove node: update logical info and perform distribution iff
    // needed. Return true if the removal has been handled.
    // note that it's possible for both the node's host and its parent
    // to require distribution... both cases are handled here.
    removeNode: function removeNode(node) {
      // important that we want to do this only if the node has a logical parent
      var logicalParent = tree.Logical.hasParentNode(node) && tree.Logical.getParentNode(node);
      var distributed;
      var ownerRoot = this.ownerShadyRootForNode(node);
      if (logicalParent) {
        // distribute node's parent iff needed
        distributed = this.maybeDistributeParent(node);
        tree.Logical.recordRemoveChild(node, logicalParent);
        // remove node from root and distribute it iff needed
        if (ownerRoot && (this._removeDistributedChildren(ownerRoot, node) || logicalParent.localName === ownerRoot.getInsertionPointTag())) {
          ownerRoot._skipUpdateInsertionPoints = false;
          ownerRoot.update();
        }
      }
      this._removeOwnerShadyRoot(node);
      return distributed;
    },

    _scheduleObserver: function _scheduleObserver(node, addedNode, removedNode) {
      var observer = node.__dom && node.__dom.observer;
      if (observer) {
        if (addedNode) {
          observer.addedNodes.push(addedNode);
        }
        if (removedNode) {
          observer.removedNodes.push(removedNode);
        }
        observer.schedule();
      }
    },

    removeNodeFromParent: function removeNodeFromParent(node, parent) {
      if (parent) {
        this._scheduleObserver(parent, null, node);
        this.removeNode(node);
      } else {
        this._removeOwnerShadyRoot(node);
      }
    },

    _hasCachedOwnerRoot: function _hasCachedOwnerRoot(node) {
      return Boolean(node.__ownerShadyRoot !== undefined);
    },

    getRootNode: function getRootNode$1(node) {
      if (!node || !node.nodeType) {
        return;
      }
      var root = node.__ownerShadyRoot;
      if (root === undefined) {
        if (isShadyRoot(node)) {
          root = node;
        } else {
          var parent = tree.Logical.getParentNode(node);
          root = parent ? this.getRootNode(parent) : node;
        }
        // memo-ize result for performance but only memo-ize
        // result if node is in the document. This avoids a problem where a root
        // can be cached while an element is inside a fragment.
        // If this happens and we cache the result, the value can become stale
        // because for perf we avoid processing the subtree of added fragments.
        if (document.documentElement.contains(node)) {
          node.__ownerShadyRoot = root;
        }
      }
      return root;
    },

    ownerShadyRootForNode: function ownerShadyRootForNode(node) {
      var root = this.getRootNode(node);
      if (isShadyRoot(root)) {
        return root;
      }
    },

    _maybeDistribute: function _maybeDistribute(node, container, ownerRoot) {
      // TODO(sorvell): technically we should check non-fragment nodes for
      // <content> children but since this case is assumed to be exceedingly
      // rare, we avoid the cost and will address with some specific api
      // when the need arises.  For now, the user must call
      // distributeContent(true), which updates insertion points manually
      // and forces distribution.
      var insertionPointTag = ownerRoot && ownerRoot.getInsertionPointTag() || '';
      var fragContent = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noInsertionPoint && insertionPointTag && node.querySelector(insertionPointTag);
      var wrappedContent = fragContent && tree.Logical.getParentNode(fragContent).nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
      var hasContent = fragContent || node.localName === insertionPointTag;
      // There are 3 possible cases where a distribution may need to occur:
      // 1. <content> being inserted (the host of the shady root where
      //    content is inserted needs distribution)
      // 2. children being inserted into parent with a shady root (parent
      //    needs distribution)
      // 3. container is an insertionPoint
      if (hasContent || container.localName === insertionPointTag) {
        if (ownerRoot) {
          // note, insertion point list update is handled after node
          // mutations are complete
          ownerRoot.update();
        }
      }
      var needsDist = this._nodeNeedsDistribution(container);
      if (needsDist) {
        container.shadyRoot.update();
      }
      // Return true when distribution will fully handle the composition
      // Note that if a content was being inserted that was wrapped by a node,
      // and the parent does not need distribution, return false to allow
      // the nodes to be added directly, after which children may be
      // distributed and composed into the wrapping node(s)
      return needsDist || hasContent && !wrappedContent;
    },

    /* note: parent argument is required since node may have an out
    of date parent at this point; returns true if a <content> is being added */
    _maybeAddInsertionPoint: function _maybeAddInsertionPoint(node, parent, root) {
      var this$1 = this;

      var added;
      var insertionPointTag = root.getInsertionPointTag();
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noInsertionPoint) {
        var c$ = node.querySelectorAll(insertionPointTag);
        for (var i = 0, n, np, na; i < c$.length && (n = c$[i]); i++) {
          np = tree.Logical.getParentNode(n);
          // don't allow node's parent to be fragment itself
          if (np === node) {
            np = parent;
          }
          na = this$1._maybeAddInsertionPoint(n, np, root);
          added = added || na;
        }
      } else if (node.localName === insertionPointTag) {
        tree.Logical.saveChildNodes(parent);
        tree.Logical.saveChildNodes(node);
        added = true;
      }
      return added;
    },

    _nodeNeedsDistribution: function _nodeNeedsDistribution(node) {
      return node && node.shadyRoot && node.shadyRoot.hasInsertionPoint();
    },

    _removeDistributedChildren: function _removeDistributedChildren(root, container) {
      var this$1 = this;

      var hostNeedsDist;
      var ip$ = root._insertionPoints;
      for (var i = 0; i < ip$.length; i++) {
        var insertionPoint = ip$[i];
        if (this$1._contains(container, insertionPoint)) {
          var dc$ = insertionPoint.assignedNodes({ flatten: true });
          for (var j = 0; j < dc$.length; j++) {
            hostNeedsDist = true;
            var node = dc$[j];
            var parent = tree.Composed.getParentNode(node);
            if (parent) {
              tree.Composed.removeChild(parent, node);
            }
          }
        }
      }
      return hostNeedsDist;
    },

    _contains: function _contains(container, node) {
      while (node) {
        if (node == container) {
          return true;
        }
        node = tree.Logical.getParentNode(node);
      }
    },

    _removeOwnerShadyRoot: function _removeOwnerShadyRoot(node) {
      var this$1 = this;

      // optimization: only reset the tree if node is actually in a root
      if (this._hasCachedOwnerRoot(node)) {
        var c$ = tree.Logical.getChildNodes(node);
        for (var i = 0, l = c$.length, n; i < l && (n = c$[i]); i++) {
          this$1._removeOwnerShadyRoot(n);
        }
      }
      node.__ownerShadyRoot = undefined;
    },

    // TODO(sorvell): This will fail if distribution that affects this
    // question is pending; this is expected to be exceedingly rare, but if
    // the issue comes up, we can force a flush in this case.
    firstComposedNode: function firstComposedNode(insertionPoint) {
      var n$ = insertionPoint.assignedNodes({ flatten: true });
      var root = this.getRootNode(insertionPoint);
      for (var i = 0, l = n$.length, n; i < l && (n = n$[i]); i++) {
        // means that we're composed to this spot.
        if (root.isFinalDestination(insertionPoint, n)) {
          return n;
        }
      }
    },

    clearNode: function clearNode(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    },

    maybeDistributeParent: function maybeDistributeParent(node) {
      var parent = tree.Logical.getParentNode(node);
      if (this._nodeNeedsDistribution(parent)) {
        parent.shadyRoot.update();
        return true;
      }
    },

    maybeDistributeAttributeChange: function maybeDistributeAttributeChange(node, name) {
      if (name === 'slot') {
        this.maybeDistributeParent(node);
      } else if (node.localName === 'slot' && name === 'name') {
        var root = this.ownerShadyRootForNode(node);
        if (root) {
          root.update();
        }
      }
    },

    // NOTE: `query` is used primarily for ShadyDOM's querySelector impl,
    // but it's also generally useful to recurse through the element tree
    // and is used by Polymer's styling system.
    query: function query(node, matcher, halter) {
      var list = [];
      this._queryElements(tree.Logical.getChildNodes(node), matcher, halter, list);
      return list;
    },

    _queryElements: function _queryElements(elements, matcher, halter, list) {
      var this$1 = this;

      for (var i = 0, l = elements.length, c; i < l && (c = elements[i]); i++) {
        if (c.nodeType === Node.ELEMENT_NODE && this$1._queryElement(c, matcher, halter, list)) {
          return true;
        }
      }
    },

    _queryElement: function _queryElement(node, matcher, halter, list) {
      var result = matcher(node);
      if (result) {
        list.push(node);
      }
      if (halter && halter(result)) {
        return result;
      }
      this._queryElements(tree.Logical.getChildNodes(node), matcher, halter, list);
    },

    activeElementForNode: function activeElementForNode(node) {
      var this$1 = this;

      var active = document.activeElement;
      if (!active) {
        return null;
      }
      var isShadyRoot$$1 = !!isShadyRoot(node);
      if (node !== document) {
        // If this node isn't a document or shady root, then it doesn't have
        // an active element.
        if (!isShadyRoot$$1) {
          return null;
        }
        // If this shady root's host is the active element or the active
        // element is not a descendant of the host (in the composed tree),
        // then it doesn't have an active element.
        if (node.host === active || !node.host.contains(active)) {
          return null;
        }
      }
      // This node is either the document or a shady root of which the active
      // element is a (composed) descendant of its host; iterate upwards to
      // find the active element's most shallow host within it.
      var activeRoot = this.ownerShadyRootForNode(active);
      while (activeRoot && activeRoot !== node) {
        active = activeRoot.host;
        activeRoot = this$1.ownerShadyRootForNode(active);
      }
      if (node === document) {
        // This node is the document, so activeRoot should be null.
        return activeRoot ? null : active;
      } else {
        // This node is a non-document shady root, and it should be
        // activeRoot.
        return activeRoot === node ? active : null;
      }
    }

  };

  var nativeCloneNode = Element.prototype.cloneNode;
  var nativeImportNode = Document.prototype.importNode;
  var nativeSetAttribute$1 = Element.prototype.setAttribute;
  var nativeRemoveAttribute = Element.prototype.removeAttribute;

  var setAttribute = function (attr, value) {
    // avoid scoping elements in non-main document to avoid template documents
    if (window.ShadyCSS && attr === 'class' && this.ownerDocument === document) {
      window.ShadyCSS.setElementClass(this, value);
    } else {
      nativeSetAttribute$1.call(this, attr, value);
    }
  };

  var NodeMixin = {};

  Object.defineProperties(NodeMixin, {

    parentElement: {
      get: function get() {
        return tree.Logical.getParentNode(this);
      },
      configurable: true
    },

    parentNode: {
      get: function get$1() {
        return tree.Logical.getParentNode(this);
      },
      configurable: true
    },

    nextSibling: {
      get: function get$2() {
        return tree.Logical.getNextSibling(this);
      },
      configurable: true
    },

    previousSibling: {
      get: function get$3() {
        return tree.Logical.getPreviousSibling(this);
      },
      configurable: true
    },

    nextElementSibling: {
      get: function get$4() {
        return tree.Logical.getNextElementSibling(this);
      },
      configurable: true
    },

    previousElementSibling: {
      get: function get$5() {
        return tree.Logical.getPreviousElementSibling(this);
      },
      configurable: true
    },

    assignedSlot: {
      get: function get$6() {
        return this._assignedSlot;
      },
      configurable: true
    }
  });

  var FragmentMixin = {

    appendChild: function appendChild(node) {
      return this.insertBefore(node);
    },

    // cases in which we may not be able to just do standard native call
    // 1. container has a shadyRoot (needsDistribution IFF the shadyRoot
    // has an insertion point)
    // 2. container is a shadyRoot (don't distribute, instead set
    // container to container.host.
    // 3. node is <content> (host of container needs distribution)
    insertBefore: function insertBefore(node, ref_node) {
      if (ref_node && tree.Logical.getParentNode(ref_node) !== this) {
        throw Error('The ref_node to be inserted before is not a child ' + 'of this node');
      }
      // remove node from its current position iff it's in a tree.
      if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        var parent = tree.Logical.getParentNode(node);
        mixinImpl.removeNodeFromParent(node, parent);
      }
      if (!mixinImpl.addNode(this, node, ref_node)) {
        if (ref_node) {
          // if ref_node is an insertion point replace with first distributed node
          var root = mixinImpl.ownerShadyRootForNode(ref_node);
          if (root) {
            ref_node = ref_node.localName === root.getInsertionPointTag() ? mixinImpl.firstComposedNode(ref_node) : ref_node;
          }
        }
        // if adding to a shadyRoot, add to host instead
        var container = isShadyRoot(this) ? this.host : this;
        if (ref_node) {
          tree.Composed.insertBefore(container, node, ref_node);
        } else {
          tree.Composed.appendChild(container, node);
        }
      }
      mixinImpl._scheduleObserver(this, node);
      return node;
    },

    /**
      Removes the given `node` from the element's `lightChildren`.
      This method also performs dom composition.
    */
    removeChild: function removeChild(node) {
      if (tree.Logical.getParentNode(node) !== this) {
        throw Error('The node to be removed is not a child of this node: ' + node);
      }
      if (!mixinImpl.removeNode(node)) {
        // if removing from a shadyRoot, remove form host instead
        var container = isShadyRoot(this) ? this.host : this;
        // not guaranteed to physically be in container; e.g.
        // undistributed nodes.
        var parent = tree.Composed.getParentNode(node);
        if (container === parent) {
          tree.Composed.removeChild(container, node);
        }
      }
      mixinImpl._scheduleObserver(this, null, node);
      return node;
    },

    replaceChild: function replaceChild(node, ref_node) {
      this.insertBefore(node, ref_node);
      this.removeChild(ref_node);
      return node;
    },

    // TODO(sorvell): consider doing native QSA and filtering results.
    querySelector: function querySelector(selector) {
      // match selector and halt on first result.
      var result = mixinImpl.query(this, function (n) {
        return matchesSelector(n, selector);
      }, function (n) {
        return Boolean(n);
      })[0];
      return result || null;
    },

    querySelectorAll: function querySelectorAll(selector) {
      return mixinImpl.query(this, function (n) {
        return matchesSelector(n, selector);
      });
    },

    cloneNode: function cloneNode(deep) {
      if (this.localName == 'template') {
        return nativeCloneNode.call(this, deep);
      } else {
        var n = nativeCloneNode.call(this, false);
        if (deep) {
          var c$ = this.childNodes;
          for (var i = 0, nc; i < c$.length; i++) {
            nc = c$[i].cloneNode(true);
            n.appendChild(nc);
          }
        }
        return n;
      }
    },

    importNode: function importNode(externalNode, deep) {
      // for convenience use this node's ownerDoc if the node isn't a document
      var doc = this instanceof Document ? this : this.ownerDocument;
      var n = nativeImportNode.call(doc, externalNode, false);
      if (deep) {
        var c$ = tree.Logical.getChildNodes(externalNode);
        common.patchNode(n);
        for (var i = 0, nc; i < c$.length; i++) {
          nc = doc.importNode(c$[i], true);
          n.appendChild(nc);
        }
      }
      return n;
    }
  };

  Object.defineProperties(FragmentMixin, {

    childNodes: {
      get: function get$7() {
        var c$ = tree.Logical.getChildNodes(this);
        return Array.isArray(c$) ? c$ : tree.arrayCopyChildNodes(this);
      },
      configurable: true
    },

    children: {
      get: function get$8() {
        if (tree.Logical.hasChildNodes(this)) {
          return Array.prototype.filter.call(this.childNodes, function (n) {
            return n.nodeType === Node.ELEMENT_NODE;
          });
        } else {
          return tree.arrayCopyChildren(this);
        }
      },
      configurable: true
    },

    firstChild: {
      get: function get$9() {
        return tree.Logical.getFirstChild(this);
      },
      configurable: true
    },

    lastChild: {
      get: function get$10() {
        return tree.Logical.getLastChild(this);
      },
      configurable: true
    },

    firstElementChild: {
      get: function get$11() {
        return tree.Logical.getFirstElementChild(this);
      },
      configurable: true
    },

    lastElementChild: {
      get: function get$12() {
        return tree.Logical.getLastElementChild(this);
      },
      configurable: true
    },

    // TODO(srovell): strictly speaking fragments do not have textContent
    // or innerHTML but ShadowRoots do and are not easily distinguishable.
    // textContent / innerHTML
    textContent: {
      get: function get$13() {
        if (this.childNodes) {
          var tc = [];
          for (var i = 0, cn = this.childNodes, c; c = cn[i]; i++) {
            if (c.nodeType !== Node.COMMENT_NODE) {
              tc.push(c.textContent);
            }
          }
          return tc.join('');
        }
        return '';
      },
      set: function set(text) {
        mixinImpl.clearNode(this);
        if (text) {
          this.appendChild(document.createTextNode(text));
        }
      },
      configurable: true
    },

    innerHTML: {
      get: function get$14() {
        return getInnerHTML(this);
      },
      set: function set$1(text) {
        var this$1 = this;

        mixinImpl.clearNode(this);
        var d = document.createElement('div');
        d.innerHTML = text;
        // here, appendChild may move nodes async so we cannot rely
        // on node position when copying
        var c$ = tree.arrayCopyChildNodes(d);
        for (var i = 0; i < c$.length; i++) {
          this$1.appendChild(c$[i]);
        }
      },
      configurable: true
    }

  });

  var ElementMixin = {

    // TODO(sorvell): should only exist on <slot>
    assignedNodes: function assignedNodes(options) {
      return (options && options.flatten ? this._distributedNodes : this._assignedNodes) || [];
    },

    setAttribute: function setAttribute$1(name, value) {
      setAttribute.call(this, name, value);
      mixinImpl.maybeDistributeAttributeChange(this, name);
    },

    removeAttribute: function removeAttribute(name) {
      nativeRemoveAttribute.call(this, name);
      mixinImpl.maybeDistributeAttributeChange(this, name);
    }

  };

  Object.defineProperties(ElementMixin, {

    shadowRoot: {
      get: function get$15() {
        return this.shadyRoot;
      }
    },

    slot: {
      get: function get$16() {
        return this.getAttribute('slot');
      },
      set: function set$2(value) {
        this.setAttribute('slot', value);
      }
    }

  });

  var activeElementDescriptor = {
    get: function get$17() {
      return mixinImpl.activeElementForNode(this);
    }
  };

  var ActiveElementMixin = {};
  Object.defineProperties(ActiveElementMixin, {
    activeElement: activeElementDescriptor
  });

  var UnderActiveElementMixin = {};
  Object.defineProperties(UnderActiveElementMixin, {
    _activeElement: activeElementDescriptor
  });

  var Mixins = {

    Node: extendAll({ __patched: 'Node' }, NodeMixin),

    Fragment: extendAll({ __patched: 'Fragment' }, NodeMixin, FragmentMixin, ActiveElementMixin),

    Element: extendAll({ __patched: 'Element' }, NodeMixin, FragmentMixin, ElementMixin, ActiveElementMixin),

    // Note: activeElement cannot be patched on document!
    Document: extendAll({ __patched: 'Document' }, NodeMixin, FragmentMixin, ElementMixin, UnderActiveElementMixin)

  };

  var getRootNode = function (node) {
    return mixinImpl.getRootNode(node);
  };

  function filterMutations(mutations, target) {
    var targetRootNode = getRootNode(target);
    return mutations.map(function (mutation) {
      var mutationInScope = targetRootNode === getRootNode(mutation.target);
      if (mutationInScope && mutation.addedNodes) {
        var nodes = Array.from(mutation.addedNodes).filter(function (n) {
          return targetRootNode === getRootNode(n);
        });
        if (nodes.length) {
          mutation = Object.create(mutation);
          Object.defineProperty(mutation, 'addedNodes', {
            value: nodes,
            configurable: true
          });
          return mutation;
        }
      } else if (mutationInScope) {
        return mutation;
      }
    }).filter(function (m) {
      return m;
    });
  }

  // const promise = Promise.resolve();

  var AsyncObserver = function AsyncObserver() {
    this._scheduled = false;
    this.addedNodes = [];
    this.removedNodes = [];
    this.callbacks = new Set();
  };

  AsyncObserver.prototype.schedule = function schedule() {
    var this$1 = this;

    if (!this._scheduled) {
      this._scheduled = true;
      promish.then(function () {
        this$1.flush();
      });
    }
  };

  AsyncObserver.prototype.flush = function flush() {
    if (this._scheduled) {
      this._scheduled = false;
      var mutations = this.takeRecords();
      if (mutations.length) {
        this.callbacks.forEach(function (cb) {
          cb(mutations);
        });
      }
    }
  };

  AsyncObserver.prototype.takeRecords = function takeRecords() {
    if (this.addedNodes.length || this.removedNodes.length) {
      var mutations = [{
        addedNodes: this.addedNodes,
        removedNodes: this.removedNodes
      }];
      this.addedNodes = [];
      this.removedNodes = [];
      return mutations;
    }
    return [];
  };

  var getComposedInnerHTML = function (node) {
    if (common.isNodePatched(node)) {
      return getInnerHTML(node, function (n) {
        return tree.Composed.getChildNodes(n);
      });
    } else {
      return node.innerHTML;
    }
  };

  var getComposedChildNodes$1 = function (node) {
    return common.isNodePatched(node) ? tree.Composed.getChildNodes(node) : node.childNodes;
  };

  // TODO(sorvell): consider instead polyfilling MutationObserver
  // directly so that users do not have to fork their code.
  // Supporting the entire api may be challenging: e.g. filtering out
  // removed nodes in the wrong scope and seeing non-distributing
  // subtree child mutations.
  var observeChildren = function (node, callback) {
    common.patchNode(node);
    if (!node.__dom.observer) {
      node.__dom.observer = new AsyncObserver();
    }
    node.__dom.observer.callbacks.add(callback);
    var observer = node.__dom.observer;
    return {
      _callback: callback,
      _observer: observer,
      _node: node,
      takeRecords: function takeRecords() {
        return observer.takeRecords();
      }
    };
  };

  var unobserveChildren = function (handle) {
    var observer = handle && handle._observer;
    if (observer) {
      observer.callbacks.delete(handle._callback);
      if (!observer.callbacks.size) {
        handle._node.__dom.observer = null;
      }
    }
  };

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * Patches elements that interacts with ShadyDOM
   * such that tree traversal and mutation apis act like they would under
   * ShadowDOM.
   *
   * This import enables seemless interaction with ShadyDOM powered
   * custom elements, enabling better interoperation with 3rd party code,
   * libraries, and frameworks that use DOM tree manipulation apis.
   */

  var patchedCount = 0;

  var log = false;

  var patchImpl = {

    canPatchNode: function (node) {
      switch (node) {
        case document.head:
        case document.documentElement:
          return false;
        default:
          return true;
      }
    },

    hasPrototypeDescriptors: Boolean(Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent')),

    patch: function (node) {
      patchedCount++;
      log && window.console.warn('patch node', node);
      if (this.hasPrototypeDescriptors) {
        patchPrototype(node, this.mixinForObject(node));
      } else {
        window.console.warn('Patching instance rather than prototype', node);
        extend(node, this.mixinForObject(node));
      }
    },

    mixinForObject: function (obj) {
      switch (obj.nodeType) {
        case Node.ELEMENT_NODE:
          return Mixins.Element;
        case Node.DOCUMENT_FRAGMENT_NODE:
          return Mixins.Fragment;
        case Node.DOCUMENT_NODE:
          return Mixins.Document;
        case Node.TEXT_NODE:
        case Node.COMMENT_NODE:
          return Mixins.Node;
      }
    },

    unpatch: function (obj) {
      if (obj.__sourceProto) {
        obj.__proto__ = obj.__sourceProto;
      }
      // TODO(sorvell): implement unpatching for non-proto patchable browsers
    }

  };

  function patchNode(node) {
    if (!settings.inUse) {
      return;
    }
    if (!isNodePatched(node) && patchImpl.canPatchNode(node)) {
      tree.saveChildNodes(node);
      patchImpl.patch(node);
    }
  }

  function canUnpatchNode() {
    return Boolean(patchImpl.hasPrototypeDescriptors);
  }

  function unpatchNode(node) {
    patchImpl.unpatch(node);
  }

  function isNodePatched(node) {
    return Boolean(node.__patched);
  }

  // TODO(sorvell): fake export
  common.patchNode = patchNode;
  common.canUnpatchNode = canUnpatchNode;
  common.isNodePatched = isNodePatched;

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var origAddEventListener = Element.prototype.addEventListener;
  var origRemoveEventListener = Element.prototype.removeEventListener;

  // https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
  var alwaysComposed = {
    blur: true,
    focus: true,
    focusin: true,
    focusout: true,
    click: true,
    dblclick: true,
    mousedown: true,
    mouseenter: true,
    mouseleave: true,
    mousemove: true,
    mouseout: true,
    mouseover: true,
    mouseup: true,
    wheel: true,
    beforeinput: true,
    input: true,
    keydown: true,
    keyup: true,
    compositionstart: true,
    compositionupdate: true,
    compositionend: true,
    touchstart: true,
    touchend: true,
    touchmove: true,
    touchcancel: true,
    pointerover: true,
    pointerenter: true,
    pointerdown: true,
    pointermove: true,
    pointerup: true,
    pointercancel: true,
    pointerout: true,
    pointerleave: true,
    gotpointercapture: true,
    lostpointercapture: true,
    dragstart: true,
    drag: true,
    dragenter: true,
    dragleave: true,
    dragover: true,
    drop: true,
    dragend: true,
    DOMActivate: true,
    DOMFocusIn: true,
    DOMFocusOut: true,
    keypress: true
  };

  function pathComposer(startNode, composed) {
    var composedPath = [];
    var current = startNode;
    var startRoot = startNode === window ? window : startNode.getRootNode();
    while (current) {
      composedPath.push(current);
      if (current.assignedSlot) {
        current = current.assignedSlot;
      } else if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
        current = current.host;
      } else {
        current = current.parentNode;
      }
    }
    // event composedPath includes window when startNode's ownerRoot is document
    if (composedPath[composedPath.length - 1] === document) {
      composedPath.push(window);
    }
    return composedPath;
  }

  function retarget(refNode, path$$1) {
    if (!isShadyRoot) {
      return refNode;
    }
    // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
    // shadow-including inclusive ancestor, return ANCESTOR.
    var refNodePath = pathComposer(refNode, true);
    var p$ = path$$1;
    for (var i = 0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
      ancestor = p$[i];
      root = ancestor === window ? window : ancestor.getRootNode();
      if (root !== lastRoot) {
        rootIdx = refNodePath.indexOf(root);
        lastRoot = root;
      }
      if (!isShadyRoot(root) || rootIdx > -1) {
        return ancestor;
      }
    }
  }

  var EventMixin = {

    __patched: 'Event',

    get composed() {
      if (this.isTrusted && this.__composed === undefined) {
        this.__composed = alwaysComposed[this.type];
      }
      return this.__composed || false;
    },

    composedPath: function composedPath() {
      if (!this.__composedPath) {
        this.__composedPath = pathComposer(this.__target, this.composed);
      }
      return this.__composedPath;
    },

    get target() {
      return retarget(this.currentTarget, this.composedPath());
    },

    // http://w3c.github.io/webcomponents/spec/shadow/#event-relatedtarget-retargeting
    get relatedTarget() {
      if (!this.__relatedTarget) {
        return null;
      }
      if (!this.__relatedTargetComposedPath) {
        this.__relatedTargetComposedPath = pathComposer(this.__relatedTarget, true);
      }
      // find the deepest node in relatedTarget composed path that is in the same root with the currentTarget
      return retarget(this.currentTarget, this.__relatedTargetComposedPath);
    },
    stopPropagation: function stopPropagation() {
      Event.prototype.stopPropagation.call(this);
      this.__propagationStopped = true;
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      Event.prototype.stopImmediatePropagation.call(this);
      this.__immediatePropagationStopped = true;
      this.__propagationStopped = true;
    }

  };

  function mixinComposedFlag(Base) {
    // NOTE: avoiding use of `class` here so that transpiled output does not
    // try to do `Base.call` with a dom construtor.
    var klazz = function (type, options) {
      var event = new Base(type, options);
      event.__composed = options && Boolean(options.composed);
      return event;
    };
    // put constructor properties on subclass
    mixin(klazz, Base);
    klazz.prototype = Base.prototype;
    return klazz;
  }

  var nonBubblingEventsToRetarget = {
    focus: true,
    blur: true
  };

  function fireHandlers(event, node, phase) {
    var hs = node.__handlers && node.__handlers[event.type] && node.__handlers[event.type][phase];
    if (hs) {
      for (var i = 0, fn; fn = hs[i]; i++) {
        fn.call(node, event);
        if (event.__immediatePropagationStopped) {
          return;
        }
      }
    }
  }

  function retargetNonBubblingEvent(e) {
    var path$$1 = e.composedPath();
    var node;
    // override `currentTarget` to let patched `target` calculate correctly
    Object.defineProperty(e, 'currentTarget', {
      get: function () {
        return node;
      },
      configurable: true
    });
    for (var i = path$$1.length - 1; i >= 0; i--) {
      node = path$$1[i];
      // capture phase fires all capture handlers
      fireHandlers(e, node, 'capture');
      if (e.__propagationStopped) {
        return;
      }
    }

    // set the event phase to `AT_TARGET` as in spec
    Object.defineProperty(e, 'eventPhase', { value: Event.AT_TARGET });

    // the event only needs to be fired when owner roots change when iterating the event path
    // keep track of the last seen owner root
    var lastFiredRoot;
    for (var i$1 = 0; i$1 < path$$1.length; i$1++) {
      node = path$$1[i$1];
      if (i$1 === 0 || node.shadowRoot && node.shadowRoot === lastFiredRoot) {
        fireHandlers(e, node, 'bubble');
        // don't bother with window, it doesn't have `getRootNode` and will be last in the path anyway
        if (node !== window) {
          lastFiredRoot = node.getRootNode();
        }
        if (e.__propagationStopped) {
          return;
        }
      }
    }
  }

  function addEventListener(type, fn, optionsOrCapture) {
    var this$1 = this;

    if (!fn) {
      return;
    }

    // The callback `fn` might be used for multiple nodes/events. Since we generate
    // a wrapper function, we need to keep track of it when we remove the listener.
    // It's more efficient to store the node/type/options information as Array in
    // `fn` itself rather than the node (we assume that the same callback is used
    // for few nodes at most, whereas a node will likely have many event listeners).
    // NOTE(valdrin) invoking external functions is costly, inline has better perf.
    var capture, once, passive;
    if (typeof optionsOrCapture === 'object') {
      capture = Boolean(optionsOrCapture.capture);
      once = Boolean(optionsOrCapture.once);
      passive = Boolean(optionsOrCapture.passive);
    } else {
      capture = Boolean(optionsOrCapture);
      once = false;
      passive = false;
    }
    if (fn.__eventWrappers) {
      // Stop if the wrapper function has already been created.
      for (var i = 0; i < fn.__eventWrappers.length; i++) {
        if (fn.__eventWrappers[i].node === this$1 && fn.__eventWrappers[i].type === type && fn.__eventWrappers[i].capture === capture && fn.__eventWrappers[i].once === once && fn.__eventWrappers[i].passive === passive) {
          return;
        }
      }
    } else {
      fn.__eventWrappers = [];
    }

    var wrapperFn = function (e) {
      // Support `once` option.
      if (once) {
        this.removeEventListener(type, fn, optionsOrCapture);
      }
      if (!e.__target) {
        e.__target = e.target;
        e.__relatedTarget = e.relatedTarget;
        patchPrototype(e, EventMixin);
      }
      // There are two critera that should stop events from firing on this node
      // 1. the event is not composed and the current node is not in the same root as the target
      // 2. when bubbling, if after retargeting, relatedTarget and target point to the same node
      if (e.composed || e.composedPath().indexOf(this) > -1) {
        if (e.eventPhase === Event.BUBBLING_PHASE) {
          if (e.target === e.relatedTarget) {
            e.stopImmediatePropagation();
            return;
          }
        }
        return fn(e);
      }
    };
    // Store the wrapper information.
    fn.__eventWrappers.push({
      node: this,
      type: type,
      capture: capture,
      once: once,
      passive: passive,
      wrapperFn: wrapperFn
    });

    if (nonBubblingEventsToRetarget[type]) {
      this.__handlers = this.__handlers || {};
      this.__handlers[type] = this.__handlers[type] || { capture: [], bubble: [] };
      this.__handlers[type][capture ? 'capture' : 'bubble'].push(wrapperFn);
    } else {
      origAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
    }
  }

  function removeEventListener(type, fn, optionsOrCapture) {
    var this$1 = this;

    if (!fn) {
      return;
    }

    // NOTE(valdrin) invoking external functions is costly, inline has better perf.
    var capture, once, passive;
    if (typeof optionsOrCapture === 'object') {
      capture = Boolean(optionsOrCapture.capture);
      once = Boolean(optionsOrCapture.once);
      passive = Boolean(optionsOrCapture.passive);
    } else {
      capture = Boolean(optionsOrCapture);
      once = false;
      passive = false;
    }
    // Search the wrapped function.
    var wrapperFn = undefined;
    if (fn.__eventWrappers) {
      for (var i = 0; i < fn.__eventWrappers.length; i++) {
        if (fn.__eventWrappers[i].node === this$1 && fn.__eventWrappers[i].type === type && fn.__eventWrappers[i].capture === capture && fn.__eventWrappers[i].once === once && fn.__eventWrappers[i].passive === passive) {
          wrapperFn = fn.__eventWrappers.splice(i, 1)[0].wrapperFn;
          // Cleanup.
          if (!fn.__eventWrappers.length) {
            fn.__eventWrappers = undefined;
          }
          break;
        }
      }
    }

    origRemoveEventListener.call(this, type, wrapperFn || fn, optionsOrCapture);
    if (wrapperFn && nonBubblingEventsToRetarget[type] && this.__handlers && this.__handlers[type]) {
      var arr = this.__handlers[type][capture ? 'capture' : 'bubble'];
      var idx = arr.indexOf(wrapperFn);
      if (idx > -1) {
        arr.splice(idx, 1);
      }
    }
  }

  function activateFocusEventOverrides() {
    for (var ev in nonBubblingEventsToRetarget) {
      window.addEventListener(ev, function (e) {
        if (!e.__target) {
          e.__target = e.target;
          e.__relatedTarget = e.relatedTarget;
          patchPrototype(e, EventMixin);
          retargetNonBubblingEvent(e);
          e.stopImmediatePropagation();
        }
      }, true);
    }
  }

  var PatchedEvent = mixinComposedFlag(Event);
  var PatchedCustomEvent = mixinComposedFlag(CustomEvent);
  var PatchedMouseEvent = mixinComposedFlag(MouseEvent);

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /**
   * Patches elements that interacts with ShadyDOM
   * such that tree traversal and mutation apis act like they would under
   * ShadowDOM.
   *
   * This import enables seemless interaction with ShadyDOM powered
   * custom elements, enabling better interoperation with 3rd party code,
   * libraries, and frameworks that use DOM tree manipulation apis.
   */

  if (settings.inUse) {

    window.ShadyDOM = {
      tree: tree,
      getNativeProperty: getNativeProperty,
      patch: patchNode,
      isPatched: isNodePatched,
      getComposedInnerHTML: getComposedInnerHTML,
      getComposedChildNodes: getComposedChildNodes$1,
      unpatch: unpatchNode,
      canUnpatch: canUnpatchNode,
      isShadyRoot: isShadyRoot,
      enqueue: enqueue,
      flush: flush$1,
      inUse: settings.inUse,
      filterMutations: filterMutations,
      observeChildren: observeChildren,
      unobserveChildren: unobserveChildren
    };

    var createRootAndEnsurePatched = function (node) {
      // TODO(sorvell): need to ensure ancestors are patched but this introduces
      // a timing problem with gathering composed children.
      // (1) currently the child list is crawled and patched when patching occurs
      // (this needs to change)
      // (2) we can only patch when an element has received its parsed children
      // because we cannot detect them when inserted by parser.
      // let ancestor = node;
      // while (ancestor) {
      //   patchNode(ancestor);
      //   ancestor = ancestor.parentNode || ancestor.host;
      // }
      patchNode(node);
      var root = new ShadyRoot(node);
      patchNode(root);
      return root;
    };

    Element.prototype.attachShadow = function () {
      return createRootAndEnsurePatched(this);
    };

    Node.prototype.addEventListener = addEventListener;
    Node.prototype.removeEventListener = removeEventListener;
    Event = PatchedEvent;
    CustomEvent = PatchedCustomEvent;
    MouseEvent = PatchedMouseEvent;
    activateFocusEventOverrides();

    Object.defineProperty(Node.prototype, 'isConnected', {
      get: function get() {
        return document.documentElement.contains(this);
      },
      configurable: true
    });

    Node.prototype.getRootNode = function (options) {
      return getRootNode(this, options);
    };

    Object.defineProperty(Element.prototype, 'slot', {
      get: function get$1() {
        return this.getAttribute('slot');
      },
      set: function set(value) {
        this.setAttribute('slot', value);
      },
      configurable: true
    });

    Object.defineProperty(Node.prototype, 'assignedSlot', {
      get: function get$2() {
        return this._assignedSlot || null;
      },
      configurable: true
    });

    var nativeSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = setAttribute;
    // NOTE: expose native setAttribute to allow hooking native method
    // (e.g. this is done in ShadyCSS)
    Element.prototype.__nativeSetAttribute = nativeSetAttribute;

    var classNameDescriptor = {
      get: function get$3() {
        return this.getAttribute('class');
      },
      set: function set$1(value) {
        this.setAttribute('class', value);
      },
      configurable: true
    };

    // Safari 9 `className` is not configurable
    var cn = Object.getOwnPropertyDescriptor(Element.prototype, 'className');
    if (cn && cn.configurable) {
      Object.defineProperty(Element.prototype, 'className', classNameDescriptor);
    } else {
      // on IE `className` is on Element
      var h = window.customElements && window.customElements.nativeHTMLElement || HTMLElement;
      cn = Object.getOwnPropertyDescriptor(h.prototype, 'className');
      if (cn && cn.configurable) {
        Object.defineProperty(h.prototype, 'className', classNameDescriptor);
      }
    }
  }
})();

(function () {
  'use strict';

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /*
  Extremely simple css parser. Intended to be not more than what we need
  and definitely not necessarily correct =).
  */

  // given a string of css, return a simple rule tree

  function parse(text) {
    text = clean(text);
    return parseCss(lex(text), text);
  }

  // remove stuff we don't care about that may hinder parsing
  function clean(cssText) {
    return cssText.replace(RX.comments, '').replace(RX.port, '');
  }

  // super simple {...} lexer that returns a node tree
  function lex(text) {
    var root = {
      start: 0,
      end: text.length
    };
    var n = root;
    for (var i = 0, l = text.length; i < l; i++) {
      if (text[i] === OPEN_BRACE) {
        if (!n.rules) {
          n.rules = [];
        }
        var p = n;
        var previous = p.rules[p.rules.length - 1];
        n = {
          start: i + 1,
          parent: p,
          previous: previous
        };
        p.rules.push(n);
      } else if (text[i] === CLOSE_BRACE) {
        n.end = i + 1;
        n = n.parent || root;
      }
    }
    return root;
  }

  // add selectors/cssText to node tree
  function parseCss(node, text) {
    var t = text.substring(node.start, node.end - 1);
    node.parsedCssText = node.cssText = t.trim();
    if (node.parent) {
      var ss = node.previous ? node.previous.end : node.parent.start;
      t = text.substring(ss, node.start - 1);
      t = _expandUnicodeEscapes(t);
      t = t.replace(RX.multipleSpaces, ' ');
      // TODO(sorvell): ad hoc; make selector include only after last ;
      // helps with mixin syntax
      t = t.substring(t.lastIndexOf(';') + 1);
      var s = node.parsedSelector = node.selector = t.trim();
      node.atRule = s.indexOf(AT_START) === 0;
      // note, support a subset of rule types...
      if (node.atRule) {
        if (s.indexOf(MEDIA_START) === 0) {
          node.type = types.MEDIA_RULE;
        } else if (s.match(RX.keyframesRule)) {
          node.type = types.KEYFRAMES_RULE;
          node.keyframesName = node.selector.split(RX.multipleSpaces).pop();
        }
      } else {
        if (s.indexOf(VAR_START) === 0) {
          node.type = types.MIXIN_RULE;
        } else {
          node.type = types.STYLE_RULE;
        }
      }
    }
    var r$ = node.rules;
    if (r$) {
      for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        parseCss(r, text);
      }
    }
    return node;
  }

  // conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
  // expanded form that doesn't require trailing space `\000033`
  function _expandUnicodeEscapes(s) {
    return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
      var code = arguments[1],
          repeat = 6 - code.length;
      while (repeat--) {
        code = '0' + code;
      }
      return '\\' + code;
    });
  }

  // stringify parsed css.
  function stringify(node, preserveProperties, text) {
    text = text || '';
    // calc rule cssText
    var cssText = '';
    if (node.cssText || node.rules) {
      var r$ = node.rules;
      if (r$ && !_hasMixinRules(r$)) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          cssText = stringify(r, preserveProperties, cssText);
        }
      } else {
        cssText = preserveProperties ? node.cssText : removeCustomProps(node.cssText);
        cssText = cssText.trim();
        if (cssText) {
          cssText = '  ' + cssText + '\n';
        }
      }
    }
    // emit rule if there is cssText
    if (cssText) {
      if (node.selector) {
        text += node.selector + ' ' + OPEN_BRACE + '\n';
      }
      text += cssText;
      if (node.selector) {
        text += CLOSE_BRACE + '\n\n';
      }
    }
    return text;
  }

  function _hasMixinRules(rules) {
    return rules[0].selector.indexOf(VAR_START) === 0;
  }

  function removeCustomProps(cssText) {
    cssText = removeCustomPropAssignment(cssText);
    return removeCustomPropApply(cssText);
  }

  function removeCustomPropAssignment(cssText) {
    return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
  }

  function removeCustomPropApply(cssText) {
    return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
  }

  var types = {
    STYLE_RULE: 1,
    KEYFRAMES_RULE: 7,
    MEDIA_RULE: 4,
    MIXIN_RULE: 1000
  };

  var OPEN_BRACE = '{';
  var CLOSE_BRACE = '}';

  // helper regexp's
  var RX = {
    comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
    port: /@import[^;]*;/gim,
    customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
    mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
    mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
    varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
    keyframesRule: /^@[^\s]*keyframes/,
    multipleSpaces: /\s+/g
  };

  var VAR_START = '--';
  var MEDIA_START = '@media';
  var AT_START = '@';

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var nativeShadow = !(window.ShadyDOM && window.ShadyDOM.inUse);
  // chrome 49 has semi-working css vars, check if box-shadow works
  // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
  var nativeCssVariables = !navigator.userAgent.match('AppleWebKit/601') && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)');

  // experimental support for native @apply
  function detectNativeApply() {
    var style = document.createElement('style');
    style.textContent = '.foo { @apply --foo }';
    document.head.appendChild(style);
    var nativeCssApply = style.sheet.cssRules[0].cssText.indexOf('apply') >= 0;
    document.head.removeChild(style);
    return nativeCssApply;
  }

  var nativeCssApply = false && detectNativeApply();

  function parseSettings(settings) {
    if (settings) {
      nativeCssVariables = nativeCssVariables && !settings.shimcssproperties;
      nativeShadow = nativeShadow && !settings.shimshadow;
    }
  }

  if (window.ShadyCSS) {
    parseSettings(window.ShadyCSS);
  } else if (window.WebComponents) {
    parseSettings(window.WebComponents.flags);
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  function toCssText(rules, callback) {
    if (typeof rules === 'string') {
      rules = parse(rules);
    }
    if (callback) {
      forEachRule(rules, callback);
    }
    return stringify(rules, nativeCssVariables);
  }

  function rulesForStyle(style) {
    if (!style.__cssRules && style.textContent) {
      style.__cssRules = parse(style.textContent);
    }
    return style.__cssRules;
  }

  // Tests if a rule is a keyframes selector, which looks almost exactly
  // like a normal selector but is not (it has nothing to do with scoping
  // for example).
  function isKeyframesSelector(rule) {
    return rule.parent && rule.parent.type === types.KEYFRAMES_RULE;
  }

  function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
    if (!node) {
      return;
    }
    var skipRules = false;
    if (onlyActiveRules) {
      if (node.type === types.MEDIA_RULE) {
        var matchMedia = node.selector.match(rx.MEDIA_MATCH);
        if (matchMedia) {
          // if rule is a non matching @media rule, skip subrules
          if (!window.matchMedia(matchMedia[1]).matches) {
            skipRules = true;
          }
        }
      }
    }
    if (node.type === types.STYLE_RULE) {
      styleRuleCallback(node);
    } else if (keyframesRuleCallback && node.type === types.KEYFRAMES_RULE) {
      keyframesRuleCallback(node);
    } else if (node.type === types.MIXIN_RULE) {
      skipRules = true;
    }
    var r$ = node.rules;
    if (r$ && !skipRules) {
      for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
      }
    }
  }

  // add a string of cssText to the document.
  function applyCss(cssText, moniker, target, contextNode) {
    var style = createScopeStyle(cssText, moniker);
    return applyStyle$1(style, target, contextNode);
  }

  function applyStyle$1(style, target, contextNode) {
    target = target || document.head;
    var after = contextNode && contextNode.nextSibling || target.firstChild;
    lastHeadApplyNode = style;
    return target.insertBefore(style, after);
  }

  function createScopeStyle(cssText, moniker) {
    var style = document.createElement('style');
    if (moniker) {
      style.setAttribute('scope', moniker);
    }
    style.textContent = cssText;
    return style;
  }

  var lastHeadApplyNode = null;

  // insert a comment node as a styling position placeholder.
  function applyStylePlaceHolder(moniker) {
    var placeHolder = document.createComment(' Shady DOM styles for ' + moniker + ' ');
    var after = lastHeadApplyNode ? lastHeadApplyNode.nextSibling : null;
    var scope = document.head;
    scope.insertBefore(placeHolder, after || scope.firstChild);
    lastHeadApplyNode = placeHolder;
    return placeHolder;
  }

  // cssBuildTypeForModule: function (module) {
  //   let dm = Polymer.DomModule.import(module);
  //   if (dm) {
  //     return getCssBuildType(dm);
  //   }
  // },
  //


  // Walk from text[start] matching parens
  // returns position of the outer end paren
  function findMatchingParen(text, start) {
    var level = 0;
    for (var i = start, l = text.length; i < l; i++) {
      if (text[i] === '(') {
        level++;
      } else if (text[i] === ')') {
        if (--level === 0) {
          return i;
        }
      }
    }
    return -1;
  }

  function processVariableAndFallback(str, callback) {
    // find 'var('
    var start = str.indexOf('var(');
    if (start === -1) {
      // no var?, everything is prefix
      return callback(str, '', '', '');
    }
    //${prefix}var(${inner})${suffix}
    var end = findMatchingParen(str, start + 3);
    var inner = str.substring(start + 4, end);
    var prefix = str.substring(0, start);
    // suffix may have other variables
    var suffix = processVariableAndFallback(str.substring(end + 1), callback);
    var comma = inner.indexOf(',');
    // value and fallback args should be trimmed to match in property lookup
    if (comma === -1) {
      // variable, no fallback
      return callback(prefix, inner.trim(), '', suffix);
    }
    // var(${value},${fallback})
    var value = inner.substring(0, comma).trim();
    var fallback = inner.substring(comma + 1).trim();
    return callback(prefix, value, fallback, suffix);
  }

  function setElementClassRaw(element, value) {
    // use native setAttribute provided by ShadyDOM when setAttribute is patched
    if (element.__nativeSetAttribute) {
      element.__nativeSetAttribute('class', value);
    } else {
      element.setAttribute('class', value);
    }
  }

  var rx = {
    VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,
    MIXIN_MATCH: /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
    VAR_CONSUMED: /(--[\w-]+)\s*([:,;)]|$)/gi,
    ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/,
    MEDIA_MATCH: /@media[^(]*(\([^)]*\))/,
    IS_VAR: /^--/,
    BRACKETED: /\{[^}]*\}/g,
    HOST_PREFIX: '(?:^|[^.#[:])',
    HOST_SUFFIX: '($|[.:[\\s>+~])'
  };

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /* Transforms ShadowDOM styling into ShadyDOM styling
  
  * scoping:
  
    * elements in scope get scoping selector class="x-foo-scope"
    * selectors re-written as follows:
  
      div button -> div.x-foo-scope button.x-foo-scope
  
  * :host -> scopeName
  
  * :host(...) -> scopeName...
  
  * ::slotted(...) -> scopeName > ...
  
  * ...:dir(ltr|rtl) -> [dir="ltr|rtl"] ..., ...[dir="ltr|rtl"]
  
  * :host(:dir[rtl]) -> scopeName:dir(rtl) -> [dir="rtl"] scopeName, scopeName[dir="rtl"]
  
  */
  var SCOPE_NAME = 'style-scope';

  var StyleTransformer = {

    // Given a node and scope name, add a scoping class to each node
    // in the tree. This facilitates transforming css into scoped rules.
    dom: function dom(node, scope, shouldRemoveScope) {
      // one time optimization to skip scoping...
      if (node.__styleScoped) {
        node.__styleScoped = null;
      } else {
        this._transformDom(node, scope || '', shouldRemoveScope);
      }
    },

    _transformDom: function _transformDom(node, selector, shouldRemoveScope) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.element(node, selector, shouldRemoveScope);
      }
      var c$ = node.localName === 'template' ? (node.content || node._content).childNodes : node.children || node.childNodes;
      if (c$) {
        for (var i = 0; i < c$.length; i++) {
          this._transformDom(c$[i], selector, shouldRemoveScope);
        }
      }
    },

    element: function element(_element, scope, shouldRemoveScope) {
      // note: if using classes, we add both the general 'style-scope' class
      // as well as the specific scope. This enables easy filtering of all
      // `style-scope` elements
      if (scope) {
        // note: svg on IE does not have classList so fallback to class
        if (_element.classList) {
          if (shouldRemoveScope) {
            _element.classList.remove(SCOPE_NAME);
            _element.classList.remove(scope);
          } else {
            _element.classList.add(SCOPE_NAME);
            _element.classList.add(scope);
          }
        } else if (_element.getAttribute) {
          var c = _element.getAttribute(CLASS);
          if (shouldRemoveScope) {
            if (c) {
              var newValue = c.replace(SCOPE_NAME, '').replace(scope, '');
              setElementClassRaw(_element, newValue);
            }
          } else {
            var _newValue = (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope;
            setElementClassRaw(_element, _newValue);
          }
        }
      }
    },

    elementStyles: function elementStyles(element, styleRules, callback) {
      var cssBuildType = element.__cssBuild;
      // no need to shim selectors if settings.useNativeShadow, also
      // a shady css build will already have transformed selectors
      // NOTE: This method may be called as part of static or property shimming.
      // When there is a targeted build it will not be called for static shimming,
      // but when the property shim is used it is called and should opt out of
      // static shimming work when a proper build exists.
      var cssText = nativeShadow || cssBuildType === 'shady' ? toCssText(styleRules, callback) : this.css(styleRules, element.is, element.extends, callback) + '\n\n';
      return cssText.trim();
    },

    // Given a string of cssText and a scoping string (scope), returns
    // a string of scoped css where each selector is transformed to include
    // a class created from the scope. ShadowDOM selectors are also transformed
    // (e.g. :host) to use the scoping selector.
    css: function css(rules, scope, ext, callback) {
      var hostScope = this._calcHostScope(scope, ext);
      scope = this._calcElementScope(scope);
      var self = this;
      return toCssText(rules, function (rule) {
        if (!rule.isScoped) {
          self.rule(rule, scope, hostScope);
          rule.isScoped = true;
        }
        if (callback) {
          callback(rule, scope, hostScope);
        }
      });
    },

    _calcElementScope: function _calcElementScope(scope) {
      if (scope) {
        return CSS_CLASS_PREFIX + scope;
      } else {
        return '';
      }
    },

    _calcHostScope: function _calcHostScope(scope, ext) {
      return ext ? '[is=' + scope + ']' : scope;
    },

    rule: function rule(_rule, scope, hostScope) {
      this._transformRule(_rule, this._transformComplexSelector, scope, hostScope);
    },

    // transforms a css rule to a scoped rule.
    _transformRule: function _transformRule(rule, transformer, scope, hostScope) {
      // NOTE: save transformedSelector for subsequent matching of elements
      // against selectors (e.g. when calculating style properties)
      rule.selector = rule.transformedSelector = this._transformRuleCss(rule, transformer, scope, hostScope);
    },

    _transformRuleCss: function _transformRuleCss(rule, transformer, scope, hostScope) {
      var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
      // we want to skip transformation of rules that appear in keyframes,
      // because they are keyframe selectors, not element selectors.
      if (!isKeyframesSelector(rule)) {
        for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
          p$[i] = transformer.call(this, p, scope, hostScope);
        }
      }
      return p$.join(COMPLEX_SELECTOR_SEP);
    },

    _transformComplexSelector: function _transformComplexSelector(selector, scope, hostScope) {
      var _this = this;

      var stop = false;
      selector = selector.trim();
      // Remove spaces inside of selectors like `:nth-of-type` because it confuses SIMPLE_SELECTOR_SEP
      selector = selector.replace(NTH, function (m, type, inner) {
        return ':' + type + '(' + inner.replace(/\s/g, '') + ')';
      });
      selector = selector.replace(SLOTTED_START, HOST + ' $1');
      selector = selector.replace(SIMPLE_SELECTOR_SEP, function (m, c, s) {
        if (!stop) {
          var info = _this._transformCompoundSelector(s, c, scope, hostScope);
          stop = stop || info.stop;
          c = info.combinator;
          s = info.value;
        }
        return c + s;
      });
      return selector;
    },

    _transformCompoundSelector: function _transformCompoundSelector(selector, combinator, scope, hostScope) {
      // replace :host with host scoping class
      var slottedIndex = selector.indexOf(SLOTTED);
      if (selector.indexOf(HOST) >= 0) {
        selector = this._transformHostSelector(selector, hostScope);
        // replace other selectors with scoping class
      } else if (slottedIndex !== 0) {
        selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
      }
      // mark ::slotted() scope jump to replace with descendant selector + arg
      // also ignore left-side combinator
      var slotted = false;
      if (slottedIndex >= 0) {
        combinator = '';
        slotted = true;
      }
      // process scope jumping selectors up to the scope jump and then stop
      var stop = void 0;
      if (slotted) {
        stop = true;
        if (slotted) {
          // .zonk ::slotted(.foo) -> .zonk.scope > .foo
          selector = selector.replace(SLOTTED_PAREN, function (m, paren) {
            return ' > ' + paren;
          });
        }
      }
      selector = selector.replace(DIR_PAREN, function (m, before, dir) {
        return '[dir="' + dir + '"] ' + before + ', ' + before + '[dir="' + dir + '"]';
      });
      return { value: selector, combinator: combinator, stop: stop };
    },

    _transformSimpleSelector: function _transformSimpleSelector(selector, scope) {
      var p$ = selector.split(PSEUDO_PREFIX);
      p$[0] += scope;
      return p$.join(PSEUDO_PREFIX);
    },

    // :host(...) -> scopeName...
    _transformHostSelector: function _transformHostSelector(selector, hostScope) {
      var m = selector.match(HOST_PAREN);
      var paren = m && m[2].trim() || '';
      if (paren) {
        if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
          // paren starts with a type selector
          var typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
          // if the type selector is our hostScope then avoid pre-pending it
          if (typeSelector === hostScope) {
            return paren;
            // otherwise, this selector should not match in this scope so
            // output a bogus selector.
          } else {
            return SELECTOR_NO_MATCH;
          }
        } else {
          // make sure to do a replace here to catch selectors like:
          // `:host(.foo)::before`
          return selector.replace(HOST_PAREN, function (m, host, paren) {
            return hostScope + paren;
          });
        }
        // if no paren, do a straight :host replacement.
        // TODO(sorvell): this should not strictly be necessary but
        // it's needed to maintain support for `:host[foo]` type selectors
        // which have been improperly used under Shady DOM. This should be
        // deprecated.
      } else {
        return selector.replace(HOST, hostScope);
      }
    },

    documentRule: function documentRule(rule) {
      // reset selector in case this is redone.
      rule.selector = rule.parsedSelector;
      this.normalizeRootSelector(rule);
      this._transformRule(rule, this._transformDocumentSelector);
    },

    normalizeRootSelector: function normalizeRootSelector(rule) {
      if (rule.selector === ROOT) {
        rule.selector = 'html';
      }
    },

    _transformDocumentSelector: function _transformDocumentSelector(selector) {
      return selector.match(SLOTTED) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
    },
    SCOPE_NAME: SCOPE_NAME
  };

  var NTH = /:(nth[-\w]+)\(([^)]+)\)/;
  var SCOPE_DOC_SELECTOR = ':not(.' + SCOPE_NAME + ')';
  var COMPLEX_SELECTOR_SEP = ',';
  var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g;
  var SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
  var HOST = ':host';
  var ROOT = ':root';
  var SLOTTED = '::slotted';
  var SLOTTED_START = new RegExp('^(' + SLOTTED + ')');
  // NOTE: this supports 1 nested () pair for things like
  // :host(:not([selected]), more general support requires
  // parsing which seems like overkill
  var HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
  // similar to HOST_PAREN
  var SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
  var DIR_PAREN = /(.*):dir\((?:(ltr|rtl))\)/;
  var CSS_CLASS_PREFIX = '.';
  var PSEUDO_PREFIX = ':';
  var CLASS = 'class';
  var SELECTOR_NO_MATCH = 'should_not_match';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var get$1 = function get$1(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get$1(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var set$1 = function set$1(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set$1(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var StyleInfo = function () {
    createClass(StyleInfo, null, [{
      key: 'get',
      value: function get(node) {
        return node.__styleInfo;
      }
    }, {
      key: 'set',
      value: function set(node, styleInfo) {
        node.__styleInfo = styleInfo;
        return styleInfo;
      }
    }]);

    function StyleInfo(ast, placeholder, ownStylePropertyNames, elementName, typeExtension, cssBuild) {
      classCallCheck(this, StyleInfo);

      this.styleRules = ast || null;
      this.placeholder = placeholder || null;
      this.ownStylePropertyNames = ownStylePropertyNames || [];
      this.overrideStyleProperties = null;
      this.elementName = elementName || '';
      this.cssBuild = cssBuild || '';
      this.typeExtension = typeExtension || '';
      this.styleProperties = null;
      this.scopeSelector = null;
      this.customStyle = null;
    }

    return StyleInfo;
  }();

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // TODO: dedupe with shady
  var p = window.Element.prototype;
  var matchesSelector = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;

  var IS_IE = navigator.userAgent.match('Trident');

  var StyleProperties = {

    // decorates styles with rule info and returns an array of used style
    // property names
    decorateStyles: function decorateStyles(rules) {
      var self = this,
          props = {},
          keyframes = [],
          ruleIndex = 0;
      forEachRule(rules, function (rule) {
        self.decorateRule(rule);
        // mark in-order position of ast rule in styles block, used for cache key
        rule.index = ruleIndex++;
        self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
      }, function onKeyframesRule(rule) {
        keyframes.push(rule);
      });
      // Cache all found keyframes rules for later reference:
      rules._keyframes = keyframes;
      // return this list of property names *consumes* in these styles.
      var names = [];
      for (var i in props) {
        names.push(i);
      }
      return names;
    },

    // decorate a single rule with property info
    decorateRule: function decorateRule(rule) {
      if (rule.propertyInfo) {
        return rule.propertyInfo;
      }
      var info = {},
          properties = {};
      var hasProperties = this.collectProperties(rule, properties);
      if (hasProperties) {
        info.properties = properties;
        // TODO(sorvell): workaround parser seeing mixins as additional rules
        rule.rules = null;
      }
      info.cssText = this.collectCssText(rule);
      rule.propertyInfo = info;
      return info;
    },

    // collects the custom properties from a rule's cssText
    collectProperties: function collectProperties(rule, properties) {
      var info = rule.propertyInfo;
      if (info) {
        if (info.properties) {
          Object.assign(properties, info.properties);
          return true;
        }
      } else {
        var m = void 0,
            rx$$1 = this.rx.VAR_ASSIGN;
        var cssText = rule.parsedCssText;
        var value = void 0;
        var any = void 0;
        while (m = rx$$1.exec(cssText)) {
          // note: group 2 is var, 3 is mixin
          value = (m[2] || m[3]).trim();
          // value of 'inherit' or 'unset' is equivalent to not setting the property here
          if (value !== 'inherit' || value !== 'unset') {
            properties[m[1].trim()] = value;
          }
          any = true;
        }
        return any;
      }
    },

    // returns cssText of properties that consume variables/mixins
    collectCssText: function collectCssText(rule) {
      return this.collectConsumingCssText(rule.parsedCssText);
    },

    // NOTE: we support consumption inside mixin assignment
    // but not production, so strip out {...}
    collectConsumingCssText: function collectConsumingCssText(cssText) {
      return cssText.replace(this.rx.BRACKETED, '').replace(this.rx.VAR_ASSIGN, '');
    },

    collectPropertiesInCssText: function collectPropertiesInCssText(cssText, props) {
      var m = void 0;
      while (m = this.rx.VAR_CONSUMED.exec(cssText)) {
        var name = m[1];
        // This regex catches all variable names, and following non-whitespace char
        // If next char is not ':', then variable is a consumer
        if (m[2] !== ':') {
          props[name] = true;
        }
      }
    },

    // turns custom properties into realized values.
    reify: function reify(props) {
      // big perf optimization here: reify only *own* properties
      // since this object has __proto__ of the element's scope properties
      var names = Object.getOwnPropertyNames(props);
      for (var i = 0, n; i < names.length; i++) {
        n = names[i];
        props[n] = this.valueForProperty(props[n], props);
      }
    },

    // given a property value, returns the reified value
    // a property value may be:
    // (1) a literal value like: red or 5px;
    // (2) a variable value like: var(--a), var(--a, red), or var(--a, --b) or
    // var(--a, var(--b));
    // (3) a literal mixin value like { properties }. Each of these properties
    // can have values that are: (a) literal, (b) variables, (c) @apply mixins.
    valueForProperty: function valueForProperty(property, props) {
      var _this = this;

      // case (1) default
      // case (3) defines a mixin and we have to reify the internals
      if (property) {
        if (property.indexOf(';') >= 0) {
          property = this.valueForProperties(property, props);
        } else {
          (function () {
            // case (2) variable
            var self = _this;
            var fn = function fn(prefix, value, fallback, suffix) {
              if (!value) {
                return prefix + suffix;
              }
              var propertyValue = self.valueForProperty(props[value], props);
              // if value is "initial", then the variable should be treated as unset
              if (!propertyValue || propertyValue === 'initial') {
                // fallback may be --a or var(--a) or literal
                propertyValue = self.valueForProperty(props[fallback] || fallback, props) || fallback;
              } else if (propertyValue === 'apply-shim-inherit') {
                // CSS build will replace `inherit` with `apply-shim-inherit`
                // for use with native css variables.
                // Since we have full control, we can use `inherit` directly.
                propertyValue = 'inherit';
              }
              return prefix + (propertyValue || '') + suffix;
            };
            property = processVariableAndFallback(property, fn);
          })();
        }
      }
      return property && property.trim() || '';
    },

    // note: we do not yet support mixin within mixin
    valueForProperties: function valueForProperties(property, props) {
      var parts = property.split(';');
      for (var i = 0, _p, m; i < parts.length; i++) {
        if (_p = parts[i]) {
          this.rx.MIXIN_MATCH.lastIndex = 0;
          m = this.rx.MIXIN_MATCH.exec(_p);
          if (m) {
            _p = this.valueForProperty(props[m[1]], props);
          } else {
            var colon = _p.indexOf(':');
            if (colon !== -1) {
              var pp = _p.substring(colon);
              pp = pp.trim();
              pp = this.valueForProperty(pp, props) || pp;
              _p = _p.substring(0, colon) + pp;
            }
          }
          parts[i] = _p && _p.lastIndexOf(';') === _p.length - 1 ?
          // strip trailing ;
          _p.slice(0, -1) : _p || '';
        }
      }
      return parts.join(';');
    },

    applyProperties: function applyProperties(rule, props) {
      var output = '';
      // dynamically added sheets may not be decorated so ensure they are.
      if (!rule.propertyInfo) {
        this.decorateRule(rule);
      }
      if (rule.propertyInfo.cssText) {
        output = this.valueForProperties(rule.propertyInfo.cssText, props);
      }
      rule.cssText = output;
    },

    // Apply keyframe transformations to the cssText of a given rule. The
    // keyframeTransforms object is a map of keyframe names to transformer
    // functions which take in cssText and spit out transformed cssText.
    applyKeyframeTransforms: function applyKeyframeTransforms(rule, keyframeTransforms) {
      var input = rule.cssText;
      var output = rule.cssText;
      if (rule.hasAnimations == null) {
        // Cache whether or not the rule has any animations to begin with:
        rule.hasAnimations = this.rx.ANIMATION_MATCH.test(input);
      }
      // If there are no animations referenced, we can skip transforms:
      if (rule.hasAnimations) {
        var transform = void 0;
        // If we haven't transformed this rule before, we iterate over all
        // transforms:
        if (rule.keyframeNamesToTransform == null) {
          rule.keyframeNamesToTransform = [];
          for (var keyframe in keyframeTransforms) {
            transform = keyframeTransforms[keyframe];
            output = transform(input);
            // If the transform actually changed the CSS text, we cache the
            // transform name for future use:
            if (input !== output) {
              input = output;
              rule.keyframeNamesToTransform.push(keyframe);
            }
          }
        } else {
          // If we already have a list of keyframe names that apply to this
          // rule, we apply only those keyframe name transforms:
          for (var i = 0; i < rule.keyframeNamesToTransform.length; ++i) {
            transform = keyframeTransforms[rule.keyframeNamesToTransform[i]];
            input = transform(input);
          }
          output = input;
        }
      }
      rule.cssText = output;
    },

    // Test if the rules in these styles matches the given `element` and if so,
    // collect any custom properties into `props`.
    propertyDataFromStyles: function propertyDataFromStyles(rules, element) {
      var props = {},
          self = this;
      // generates a unique key for these matches
      var o = [];
      // note: active rules excludes non-matching @media rules
      forEachRule(rules, function (rule) {
        // TODO(sorvell): we could trim the set of rules at declaration
        // time to only include ones that have properties
        if (!rule.propertyInfo) {
          self.decorateRule(rule);
        }
        // match element against transformedSelector: selector may contain
        // unwanted uniquification and parsedSelector does not directly match
        // for :host selectors.
        var selectorToMatch = rule.transformedSelector || rule.parsedSelector;
        if (element && rule.propertyInfo.properties && selectorToMatch) {
          if (matchesSelector.call(element, selectorToMatch)) {
            self.collectProperties(rule, props);
            // produce numeric key for these matches for lookup
            addToBitMask(rule.index, o);
          }
        }
      }, null, true);
      return { properties: props, key: o };
    },

    whenHostOrRootRule: function whenHostOrRootRule(scope, rule, cssBuild, callback) {
      if (!rule.propertyInfo) {
        this.decorateRule(rule);
      }
      if (!rule.propertyInfo.properties) {
        return;
      }
      var hostScope = scope.is ? StyleTransformer._calcHostScope(scope.is, scope.extends) : 'html';
      var parsedSelector = rule.parsedSelector;
      var isRoot = parsedSelector === ':host > *' || parsedSelector === 'html';
      var isHost = parsedSelector.indexOf(':host') === 0 && !isRoot;
      // build info is either in scope (when scope is an element) or in the style
      // when scope is the default scope; note: this allows default scope to have
      // mixed mode built and unbuilt styles.
      if (cssBuild === 'shady') {
        // :root -> x-foo > *.x-foo for elements and html for custom-style
        isRoot = parsedSelector === hostScope + ' > *.' + hostScope || parsedSelector.indexOf('html') !== -1;
        // :host -> x-foo for elements, but sub-rules have .x-foo in them
        isHost = !isRoot && parsedSelector.indexOf(hostScope) === 0;
      }
      if (cssBuild === 'shadow') {
        isRoot = parsedSelector === ':host > *' || parsedSelector === 'html';
        isHost = isHost && !isRoot;
      }
      if (!isRoot && !isHost) {
        return;
      }
      var selectorToMatch = hostScope;
      if (isHost) {
        // need to transform :host under ShadowDOM because `:host` does not work with `matches`
        if (nativeShadow && !rule.transformedSelector) {
          // transform :host into a matchable selector
          rule.transformedSelector = StyleTransformer._transformRuleCss(rule, StyleTransformer._transformComplexSelector, StyleTransformer._calcElementScope(scope.is), hostScope);
        }
        selectorToMatch = rule.transformedSelector || hostScope;
      }
      callback({
        selector: selectorToMatch,
        isHost: isHost,
        isRoot: isRoot
      });
    },

    hostAndRootPropertiesForScope: function hostAndRootPropertiesForScope(scope, rules) {
      var hostProps = {},
          rootProps = {},
          self = this;
      // note: active rules excludes non-matching @media rules
      var cssBuild = rules && rules.__cssBuild;
      forEachRule(rules, function (rule) {
        // if scope is StyleDefaults, use _element for matchesSelector
        self.whenHostOrRootRule(scope, rule, cssBuild, function (info) {
          var element = scope._element || scope;
          if (matchesSelector.call(element, info.selector)) {
            if (info.isHost) {
              self.collectProperties(rule, hostProps);
            } else {
              self.collectProperties(rule, rootProps);
            }
          }
        });
      }, null, true);
      return { rootProps: rootProps, hostProps: hostProps };
    },

    transformStyles: function transformStyles(element, properties, scopeSelector) {
      var self = this;
      var hostSelector = StyleTransformer._calcHostScope(element.is, element.extends);
      var rxHostSelector = element.extends ? '\\' + hostSelector.slice(0, -1) + '\\]' : hostSelector;
      var hostRx = new RegExp(this.rx.HOST_PREFIX + rxHostSelector + this.rx.HOST_SUFFIX);
      var rules = StyleInfo.get(element).styleRules;
      var keyframeTransforms = this._elementKeyframeTransforms(element, rules, scopeSelector);
      return StyleTransformer.elementStyles(element, rules, function (rule) {
        self.applyProperties(rule, properties);
        if (!nativeShadow && !isKeyframesSelector(rule) && rule.cssText) {
          // NOTE: keyframe transforms only scope munge animation names, so it
          // is not necessary to apply them in ShadowDOM.
          self.applyKeyframeTransforms(rule, keyframeTransforms);
          self._scopeSelector(rule, hostRx, hostSelector, scopeSelector);
        }
      });
    },

    _elementKeyframeTransforms: function _elementKeyframeTransforms(element, rules, scopeSelector) {
      var keyframesRules = rules._keyframes;
      var keyframeTransforms = {};
      if (!nativeShadow && keyframesRules) {
        // For non-ShadowDOM, we transform all known keyframes rules in
        // advance for the current scope. This allows us to catch keyframes
        // rules that appear anywhere in the stylesheet:
        for (var i = 0, keyframesRule = keyframesRules[i]; i < keyframesRules.length; keyframesRule = keyframesRules[++i]) {
          this._scopeKeyframes(keyframesRule, scopeSelector);
          keyframeTransforms[keyframesRule.keyframesName] = this._keyframesRuleTransformer(keyframesRule);
        }
      }
      return keyframeTransforms;
    },

    // Generate a factory for transforming a chunk of CSS text to handle a
    // particular scoped keyframes rule.
    _keyframesRuleTransformer: function _keyframesRuleTransformer(keyframesRule) {
      return function (cssText) {
        return cssText.replace(keyframesRule.keyframesNameRx, keyframesRule.transformedKeyframesName);
      };
    },

    // Transforms `@keyframes` names to be unique for the current host.
    // Example: @keyframes foo-anim -> @keyframes foo-anim-x-foo-0
    _scopeKeyframes: function _scopeKeyframes(rule, scopeId) {
      rule.keyframesNameRx = new RegExp(rule.keyframesName, 'g');
      rule.transformedKeyframesName = rule.keyframesName + '-' + scopeId;
      rule.transformedSelector = rule.transformedSelector || rule.selector;
      rule.selector = rule.transformedSelector.replace(rule.keyframesName, rule.transformedKeyframesName);
    },

    // Strategy: x scope shim a selector e.g. to scope `.x-foo-42` (via classes):
    // non-host selector: .a.x-foo -> .x-foo-42 .a.x-foo
    // host selector: x-foo.wide -> .x-foo-42.wide
    // note: we use only the scope class (.x-foo-42) and not the hostSelector
    // (x-foo) to scope :host rules; this helps make property host rules
    // have low specificity. They are overrideable by class selectors but,
    // unfortunately, not by type selectors (e.g. overriding via
    // `.special` is ok, but not by `x-foo`).
    _scopeSelector: function _scopeSelector(rule, hostRx, hostSelector, scopeId) {
      rule.transformedSelector = rule.transformedSelector || rule.selector;
      var selector = rule.transformedSelector;
      var scope = '.' + scopeId;
      var parts = selector.split(',');
      for (var i = 0, l = parts.length, _p2; i < l && (_p2 = parts[i]); i++) {
        parts[i] = _p2.match(hostRx) ? _p2.replace(hostSelector, scope) : scope + ' ' + _p2;
      }
      rule.selector = parts.join(',');
    },

    applyElementScopeSelector: function applyElementScopeSelector(element, selector, old) {
      var c = element.getAttribute('class') || '';
      var v = c;
      if (old) {
        v = c.replace(new RegExp('\\s*' + this.XSCOPE_NAME + '\\s*' + old + '\\s*', 'g'), ' ');
      }
      v += (v ? ' ' : '') + this.XSCOPE_NAME + ' ' + selector;
      if (c !== v) {
        // hook from ShadyDOM
        if (element.__nativeSetAttribute) {
          element.__nativeSetAttribute('class', v);
        } else {
          element.setAttribute('class', v);
        }
      }
    },

    applyElementStyle: function applyElementStyle(element, properties, selector, style) {
      // calculate cssText to apply
      var cssText = style ? style.textContent || '' : this.transformStyles(element, properties, selector);
      // if shady and we have a cached style that is not style, decrement
      var styleInfo = StyleInfo.get(element);
      var s = styleInfo.customStyle;
      if (s && !nativeShadow && s !== style) {
        s._useCount--;
        if (s._useCount <= 0 && s.parentNode) {
          s.parentNode.removeChild(s);
        }
      }
      // apply styling always under native or if we generated style
      // or the cached style is not in document(!)
      if (nativeShadow) {
        // update existing style only under native
        if (styleInfo.customStyle) {
          styleInfo.customStyle.textContent = cssText;
          style = styleInfo.customStyle;
          // otherwise, if we have css to apply, do so
        } else if (cssText) {
          // apply css after the scope style of the element to help with
          // style precedence rules.
          style = applyCss(cssText, selector, element.shadowRoot, styleInfo.placeholder);
        }
      } else {
        // shady and no cache hit
        if (!style) {
          // apply css after the scope style of the element to help with
          // style precedence rules.
          if (cssText) {
            style = applyCss(cssText, selector, null, styleInfo.placeholder);
          }
          // shady and cache hit but not in document
        } else if (!style.parentNode) {
          applyStyle$1(style, null, styleInfo.placeholder);
        }
      }
      // ensure this style is our custom style and increment its use count.
      if (style) {
        style._useCount = style._useCount || 0;
        // increment use count if we changed styles
        if (styleInfo.customStyle != style) {
          style._useCount++;
        }
        styleInfo.customStyle = style;
      }
      // @media rules may be stale in IE 10 and 11
      if (IS_IE) {
        style.textContent = style.textContent;
      }
      return style;
    },

    applyCustomStyle: function applyCustomStyle(style, properties) {
      var rules = rulesForStyle(style);
      var self = this;
      style.textContent = toCssText(rules, function (rule) {
        var css = rule.cssText = rule.parsedCssText;
        if (rule.propertyInfo && rule.propertyInfo.cssText) {
          // remove property assignments
          // so next function isn't confused
          // NOTE: we have 3 categories of css:
          // (1) normal properties,
          // (2) custom property assignments (--foo: red;),
          // (3) custom property usage: border: var(--foo); @apply(--foo);
          // In elements, 1 and 3 are separated for efficiency; here they
          // are not and this makes this case unique.
          css = removeCustomPropAssignment(css);
          // replace with reified properties, scenario is same as mixin
          rule.cssText = self.valueForProperties(css, properties);
        }
      });
    },

    rx: rx,
    XSCOPE_NAME: 'x-scope'
  };

  function addToBitMask(n, bits) {
    var o = parseInt(n / 32);
    var v = 1 << n % 32;
    bits[o] = (bits[o] || 0) | v;
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var templateMap = {};

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var placeholderMap = {};

  var ce = window.customElements;
  if (ce && !nativeShadow) {
    (function () {
      var origDefine = ce.define;
      ce.define = function (name, clazz, options) {
        placeholderMap[name] = applyStylePlaceHolder(name);
        return origDefine.call(ce, name, clazz, options);
      };
    })();
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  var StyleCache = function () {
    function StyleCache() {
      var typeMax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      classCallCheck(this, StyleCache);

      // map element name -> [{properties, styleElement, scopeSelector}]
      this.cache = {};
      this.typeMax = typeMax;
    }

    createClass(StyleCache, [{
      key: '_validate',
      value: function _validate(cacheEntry, properties, ownPropertyNames) {
        for (var idx = 0; idx < ownPropertyNames.length; idx++) {
          var pn = ownPropertyNames[idx];
          if (cacheEntry.properties[pn] !== properties[pn]) {
            return false;
          }
        }
        return true;
      }
    }, {
      key: 'store',
      value: function store(tagname, properties, styleElement, scopeSelector) {
        var list = this.cache[tagname] || [];
        list.push({ properties: properties, styleElement: styleElement, scopeSelector: scopeSelector });
        if (list.length > this.typeMax) {
          list.shift();
        }
        this.cache[tagname] = list;
      }
    }, {
      key: 'fetch',
      value: function fetch(tagname, properties, ownPropertyNames) {
        var list = this.cache[tagname];
        if (!list) {
          return;
        }
        // reverse list for most-recent lookups
        for (var idx = list.length - 1; idx >= 0; idx--) {
          var entry = list[idx];
          if (this._validate(entry, properties, ownPropertyNames)) {
            return entry;
          }
        }
      }
    }]);
    return StyleCache;
  }();

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  /**
   * The apply shim simulates the behavior of `@apply` proposed at
   * https://tabatkins.github.io/specs/css-apply-rule/.
   * The approach is to convert a property like this:
   *
   *    --foo: {color: red; background: blue;}
   *
   * to this:
   *
   *    --foo_-_color: red;
   *    --foo_-_background: blue;
   *
   * Then where `@apply --foo` is used, that is converted to:
   *
   *    color: var(--foo_-_color);
   *    background: var(--foo_-_background);
   *
   * This approach generally works but there are some issues and limitations.
   * Consider, for example, that somewhere *between* where `--foo` is set and used,
   * another element sets it to:
   *
   *    --foo: { border: 2px solid red; }
   *
   * We must now ensure that the color and background from the previous setting
   * do not apply. This is accomplished by changing the property set to this:
   *
   *    --foo_-_border: 2px solid red;
   *    --foo_-_color: initial;
   *    --foo_-_background: initial;
   *
   * This works but introduces one new issue.
   * Consider this setup at the point where the `@apply` is used:
   *
   *    background: orange;
   *    @apply --foo;
   *
   * In this case the background will be unset (initial) rather than the desired
   * `orange`. We address this by altering the property set to use a fallback
   * value like this:
   *
   *    color: var(--foo_-_color);
   *    background: var(--foo_-_background, orange);
   *    border: var(--foo_-_border);
   *
   * Note that the default is retained in the property set and the `background` is
   * the desired `orange`. This leads us to a limitation.
   *
   * Limitation 1:
  
   * Only properties in the rule where the `@apply`
   * is used are considered as default values.
   * If another rule matches the element and sets `background` with
   * less specificity than the rule in which `@apply` appears,
   * the `background` will not be set.
   *
   * Limitation 2:
   *
   * When using Polymer's `updateStyles` api, new properties may not be set for
   * `@apply` properties.
  
  */

  var MIXIN_MATCH = rx.MIXIN_MATCH;
  var VAR_ASSIGN = rx.VAR_ASSIGN;

  var APPLY_NAME_CLEAN = /;\s*/m;
  var INITIAL_INHERIT = /^\s*(initial)|(inherit)\s*$/;

  // separator used between mixin-name and mixin-property-name when producing properties
  // NOTE: plain '-' may cause collisions in user styles
  var MIXIN_VAR_SEP = '_-_';

  // map of mixin to property names
  // --foo: {border: 2px} -> {properties: {(--foo, ['border'])}, dependants: {'element-name': proto}}

  var MixinMap = function () {
    function MixinMap() {
      classCallCheck(this, MixinMap);

      this._map = {};
    }

    createClass(MixinMap, [{
      key: 'set',
      value: function set(name, props) {
        name = name.trim();
        this._map[name] = {
          properties: props,
          dependants: {}
        };
      }
    }, {
      key: 'get',
      value: function get(name) {
        name = name.trim();
        return this._map[name];
      }
    }]);
    return MixinMap;
  }();

  var ApplyShim = function () {
    function ApplyShim() {
      var _this = this;

      classCallCheck(this, ApplyShim);

      this._currentTemplate = null;
      this._measureElement = null;
      this._map = new MixinMap();
      this._separator = MIXIN_VAR_SEP;
      this._boundProduceCssProperties = function (matchText, propertyName, valueProperty, valueMixin) {
        return _this._produceCssProperties(matchText, propertyName, valueProperty, valueMixin);
      };
    }

    createClass(ApplyShim, [{
      key: 'transformStyle',
      value: function transformStyle(style, elementName) {
        var ast = rulesForStyle(style);
        this.transformRules(ast, elementName);
        return ast;
      }
    }, {
      key: 'transformRules',
      value: function transformRules(rules, elementName) {
        var _this2 = this;

        this._currentTemplate = templateMap[elementName];
        forEachRule(rules, function (r) {
          _this2.transformRule(r);
        });
        if (this._currentTemplate) {
          this._currentTemplate.__applyShimInvalid = false;
        }
        this._currentTemplate = null;
      }
    }, {
      key: 'transformRule',
      value: function transformRule(rule) {
        rule.cssText = this.transformCssText(rule.parsedCssText);
        // :root was only used for variable assignment in property shim,
        // but generates invalid selectors with real properties.
        // replace with `:host > *`, which serves the same effect
        if (rule.selector === ':root') {
          rule.selector = ':host > *';
        }
      }
    }, {
      key: 'transformCssText',
      value: function transformCssText(cssText) {
        // produce variables
        cssText = cssText.replace(VAR_ASSIGN, this._boundProduceCssProperties);
        // consume mixins
        return this._consumeCssProperties(cssText);
      }
    }, {
      key: '_getInitialValueForProperty',
      value: function _getInitialValueForProperty(property) {
        if (!this._measureElement) {
          this._measureElement = document.createElement('meta');
          this._measureElement.style.all = 'initial';
          document.head.appendChild(this._measureElement);
        }
        return window.getComputedStyle(this._measureElement).getPropertyValue(property);
      }
      // replace mixin consumption with variable consumption

    }, {
      key: '_consumeCssProperties',
      value: function _consumeCssProperties(text) {
        var m = void 0;
        // loop over text until all mixins with defintions have been applied
        while (m = MIXIN_MATCH.exec(text)) {
          var matchText = m[0];
          var mixinName = m[1];
          var idx = m.index;
          // collect properties before apply to be "defaults" if mixin might override them
          // match includes a "prefix", so find the start and end positions of @apply
          var applyPos = idx + matchText.indexOf('@apply');
          var afterApplyPos = idx + matchText.length;
          // find props defined before this @apply
          var textBeforeApply = text.slice(0, applyPos);
          var textAfterApply = text.slice(afterApplyPos);
          var defaults$$1 = this._cssTextToMap(textBeforeApply);
          var replacement = this._atApplyToCssProperties(mixinName, defaults$$1);
          // use regex match position to replace mixin, keep linear processing time
          text = [textBeforeApply, replacement, textAfterApply].join('');
          // move regex search to _after_ replacement
          MIXIN_MATCH.lastIndex = idx + replacement.length;
        }
        return text;
      }
      // produce variable consumption at the site of mixin consumption
      // @apply --foo; -> for all props (${propname}: var(--foo_-_${propname}, ${fallback[propname]}}))
      // Example:
      // border: var(--foo_-_border); padding: var(--foo_-_padding, 2px)

    }, {
      key: '_atApplyToCssProperties',
      value: function _atApplyToCssProperties(mixinName, fallbacks) {
        mixinName = mixinName.replace(APPLY_NAME_CLEAN, '');
        var vars = [];
        var mixinEntry = this._map.get(mixinName);
        // if we depend on a mixin before it is created
        // make a sentinel entry in the map to add this element as a dependency for when it is defined.
        if (!mixinEntry) {
          this._map.set(mixinName, {});
          mixinEntry = this._map.get(mixinName);
        }
        if (mixinEntry) {
          if (this._currentTemplate) {
            mixinEntry.dependants[this._currentTemplate.name] = this._currentTemplate;
          }
          var p = void 0,
              parts = void 0,
              f = void 0;
          for (p in mixinEntry.properties) {
            f = fallbacks && fallbacks[p];
            parts = [p, ': var(', mixinName, MIXIN_VAR_SEP, p];
            if (f) {
              parts.push(',', f);
            }
            parts.push(')');
            vars.push(parts.join(''));
          }
        }
        return vars.join('; ');
      }
    }, {
      key: '_replaceInitialOrInherit',
      value: function _replaceInitialOrInherit(property, value) {
        var match = INITIAL_INHERIT.exec(value);
        if (match) {
          if (match[1]) {
            // initial
            // replace `initial` with the concrete initial value for this property
            value = ApplyShim._getInitialValueForProperty(property);
          } else {
            // inherit
            // with this purposfully illegal value, the variable will be invalid at
            // compute time (https://www.w3.org/TR/css-variables/#invalid-at-computed-value-time)
            // and for inheriting values, will behave similarly
            // we cannot support the same behavior for non inheriting values like 'border'
            value = 'apply-shim-inherit';
          }
        }
        return value;
      }

      // "parse" a mixin definition into a map of properties and values
      // cssTextToMap('border: 2px solid black') -> ('border', '2px solid black')

    }, {
      key: '_cssTextToMap',
      value: function _cssTextToMap(text) {
        var props = text.split(';');
        var property = void 0,
            value = void 0;
        var out = {};
        for (var i = 0, p, sp; i < props.length; i++) {
          p = props[i];
          if (p) {
            sp = p.split(':');
            // ignore lines that aren't definitions like @media
            if (sp.length > 1) {
              property = sp[0].trim();
              // some properties may have ':' in the value, like data urls
              value = this._replaceInitialOrInherit(property, sp.slice(1).join(':'));
              out[property] = value;
            }
          }
        }
        return out;
      }
    }, {
      key: '_invalidateMixinEntry',
      value: function _invalidateMixinEntry(mixinEntry) {
        for (var elementName in mixinEntry.dependants) {
          if (elementName !== this._currentTemplate) {
            mixinEntry.dependants[elementName].__applyShimInvalid = true;
          }
        }
      }
    }, {
      key: '_produceCssProperties',
      value: function _produceCssProperties(matchText, propertyName, valueProperty, valueMixin) {
        var _this3 = this;

        // handle case where property value is a mixin
        if (valueProperty) {
          // form: --mixin2: var(--mixin1), where --mixin1 is in the map
          processVariableAndFallback(valueProperty, function (prefix, value) {
            if (value && _this3._map.get(value)) {
              valueMixin = '@apply ' + value + ';';
            }
          });
        }
        if (!valueMixin) {
          return matchText;
        }
        var mixinAsProperties = this._consumeCssProperties(valueMixin);
        var prefix = matchText.slice(0, matchText.indexOf('--'));
        var mixinValues = this._cssTextToMap(mixinAsProperties);
        var combinedProps = mixinValues;
        var mixinEntry = this._map.get(propertyName);
        var oldProps = mixinEntry && mixinEntry.properties;
        if (oldProps) {
          // NOTE: since we use mixin, the map of properties is updated here
          // and this is what we want.
          combinedProps = Object.assign(Object.create(oldProps), mixinValues);
        } else {
          this._map.set(propertyName, combinedProps);
        }
        var out = [];
        var p = void 0,
            v = void 0;
        // set variables defined by current mixin
        var needToInvalidate = false;
        for (p in combinedProps) {
          v = mixinValues[p];
          // if property not defined by current mixin, set initial
          if (v === undefined) {
            v = 'initial';
          }
          if (oldProps && !(p in oldProps)) {
            needToInvalidate = true;
          }
          out.push(propertyName + MIXIN_VAR_SEP + p + ': ' + v);
        }
        if (needToInvalidate) {
          this._invalidateMixinEntry(mixinEntry);
        }
        if (mixinEntry) {
          mixinEntry.properties = combinedProps;
        }
        // because the mixinMap is global, the mixin might conflict with
        // a different scope's simple variable definition:
        // Example:
        // some style somewhere:
        // --mixin1:{ ... }
        // --mixin2: var(--mixin1);
        // some other element:
        // --mixin1: 10px solid red;
        // --foo: var(--mixin1);
        // In this case, we leave the original variable definition in place.
        if (valueProperty) {
          prefix = matchText + ';' + prefix;
        }
        return prefix + out.join('; ') + ';';
      }
    }]);
    return ApplyShim;
  }();

  var applyShim = new ApplyShim();
  window['ApplyShim'] = applyShim;

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  var flush = function flush() {};

  if (!nativeShadow) {
    (function () {
      var elementNeedsScoping = function elementNeedsScoping(element) {
        return element.classList && !element.classList.contains(StyleTransformer.SCOPE_NAME) ||
        // note: necessary for IE11
        element instanceof SVGElement && (!element.hasAttribute('class') || element.getAttribute('class').indexOf(StyleTransformer.SCOPE_NAME) < 0);
      };

      var handler = function handler(mxns) {
        for (var x = 0; x < mxns.length; x++) {
          var mxn = mxns[x];
          if (mxn.target === document.documentElement || mxn.target === document.head) {
            continue;
          }
          for (var i = 0; i < mxn.addedNodes.length; i++) {
            var n = mxn.addedNodes[i];
            if (elementNeedsScoping(n)) {
              var root = n.getRootNode();
              if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // may no longer be in a shadowroot
                var host = root.host;
                if (host) {
                  var scope = host.is || host.localName;
                  StyleTransformer.dom(n, scope);
                }
              }
            }
          }
          for (var _i = 0; _i < mxn.removedNodes.length; _i++) {
            var _n = mxn.removedNodes[_i];
            if (_n.nodeType === Node.ELEMENT_NODE) {
              var classes = undefined;
              if (_n.classList) {
                classes = Array.from(_n.classList);
              } else if (_n.hasAttribute('class')) {
                classes = _n.getAttribute('class').split(/\s+/);
              }
              if (classes !== undefined) {
                // NOTE: relies on the scoping class always being adjacent to the
                // SCOPE_NAME class.
                var classIdx = classes.indexOf(StyleTransformer.SCOPE_NAME);
                if (classIdx >= 0) {
                  var _scope = classes[classIdx + 1];
                  if (_scope) {
                    StyleTransformer.dom(_n, _scope, true);
                  }
                }
              }
            }
          }
        }
      };

      var observer = new MutationObserver(handler);
      var start = function start(node) {
        observer.observe(node, { childList: true, subtree: true });
      };
      var nativeCustomElements = window.customElements && !window.customElements.flush;
      // need to start immediately with native custom elements
      // TODO(dfreedm): with polyfilled HTMLImports and native custom elements
      // excessive mutations may be observed; this can be optimized via cooperation
      // with the HTMLImports polyfill.
      if (nativeCustomElements) {
        start(document);
      } else {
        (function () {
          var delayedStart = function delayedStart() {
            start(document.body);
          };
          // use polyfill timing if it's available
          if (window.HTMLImports) {
            window.HTMLImports.whenReady(delayedStart);
            // otherwise push beyond native imports being ready
            // which requires RAF + readystate interactive.
          } else {
            requestAnimationFrame(function () {
              if (document.readyState === 'loading') {
                (function () {
                  var listener = function listener() {
                    delayedStart();
                    document.removeEventListener('readystatechange', listener);
                  };
                  document.addEventListener('readystatechange', listener);
                })();
              } else {
                delayedStart();
              }
            });
          }
        })();
      }

      flush = function flush() {
        handler(observer.takeRecords());
      };
    })();
  }

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  // TODO(dfreedm): consider spliting into separate global
  var styleCache = new StyleCache();

  var ShadyCSS = {
    flush: flush,
    scopeCounter: {},
    nativeShadow: nativeShadow,
    nativeCss: nativeCssVariables,
    nativeCssApply: nativeCssApply,
    _documentOwner: document.documentElement,
    _documentOwnerStyleInfo: StyleInfo.set(document.documentElement, new StyleInfo({ rules: [] })),
    _generateScopeSelector: function _generateScopeSelector(name) {
      var id = this.scopeCounter[name] = (this.scopeCounter[name] || 0) + 1;
      return name + '-' + id;
    },
    getStyleAst: function getStyleAst(style) {
      return rulesForStyle(style);
    },
    styleAstToString: function styleAstToString(ast) {
      return toCssText(ast);
    },
    _gatherStyles: function _gatherStyles(template) {
      var styles = template.content.querySelectorAll('style');
      var cssText = [];
      for (var i = 0; i < styles.length; i++) {
        var s = styles[i];
        cssText.push(s.textContent);
        s.parentNode.removeChild(s);
      }
      return cssText.join('').trim();
    },
    _getCssBuild: function _getCssBuild(template) {
      var style = template.content.querySelector('style');
      if (!style) {
        return '';
      }
      return style.getAttribute('css-build') || '';
    },
    prepareTemplate: function prepareTemplate(template, elementName, typeExtension) {
      if (template._prepared) {
        return;
      }
      template._prepared = true;
      template.name = elementName;
      template.extends = typeExtension;
      templateMap[elementName] = template;
      var cssBuild = this._getCssBuild(template);
      var cssText = this._gatherStyles(template);
      var info = {
        is: elementName,
        extends: typeExtension,
        __cssBuild: cssBuild
      };
      if (!this.nativeShadow) {
        StyleTransformer.dom(template.content, elementName);
      }
      var ast = parse(cssText);
      if (this.nativeCss && !this.nativeCssApply) {
        applyShim.transformRules(ast, elementName);
      }
      template._styleAst = ast;

      var ownPropertyNames = [];
      if (!this.nativeCss) {
        ownPropertyNames = StyleProperties.decorateStyles(template._styleAst, info);
      }
      if (!ownPropertyNames.length || this.nativeCss) {
        var root = this.nativeShadow ? template.content : null;
        var placeholder = placeholderMap[elementName];
        var style = this._generateStaticStyle(info, template._styleAst, root, placeholder);
        template._style = style;
      }
      template._ownPropertyNames = ownPropertyNames;
    },
    _generateStaticStyle: function _generateStaticStyle(info, rules, shadowroot, placeholder) {
      var cssText = StyleTransformer.elementStyles(info, rules);
      if (cssText.length) {
        return applyCss(cssText, info.is, shadowroot, placeholder);
      }
    },
    _prepareHost: function _prepareHost(host) {
      var is = host.getAttribute('is') || host.localName;
      var typeExtension = void 0;
      if (is !== host.localName) {
        typeExtension = host.localName;
      }
      var placeholder = placeholderMap[is];
      var template = templateMap[is];
      var ast = void 0;
      var ownStylePropertyNames = void 0;
      var cssBuild = void 0;
      if (template) {
        ast = template._styleAst;
        ownStylePropertyNames = template._ownPropertyNames;
        cssBuild = template._cssBuild;
      }
      return StyleInfo.set(host, new StyleInfo(ast, placeholder, ownStylePropertyNames, is, typeExtension, cssBuild));
    },
    applyStyle: function applyStyle(host, overrideProps) {
      var is = host.getAttribute('is') || host.localName;
      if (window.CustomStyle) {
        var CS = window.CustomStyle;
        if (CS._documentDirty) {
          CS.findStyles();
          if (!this.nativeCss) {
            this._updateProperties(this._documentOwner, this._documentOwnerStyleInfo);
          } else if (!this.nativeCssApply) {
            CS._revalidateApplyShim();
          }
          CS.applyStyles();
          CS._documentDirty = false;
        }
      }
      var styleInfo = StyleInfo.get(host);
      var hasApplied = Boolean(styleInfo);
      if (!styleInfo) {
        styleInfo = this._prepareHost(host);
      }
      if (overrideProps) {
        styleInfo.overrideStyleProperties = styleInfo.overrideStyleProperties || {};
        Object.assign(styleInfo.overrideStyleProperties, overrideProps);
      }
      if (this.nativeCss) {
        var template = templateMap[is];
        if (template && template.__applyShimInvalid && template._style) {
          // update template
          applyShim.transformRules(template._styleAst, is);
          template._style.textContent = StyleTransformer.elementStyles(host, styleInfo.styleRules);
          // update instance if native shadowdom
          if (this.nativeShadow) {
            var style = host.shadowRoot.querySelector('style');
            style.textContent = StyleTransformer.elementStyles(host, styleInfo.styleRules);
          }
          styleInfo.styleRules = template._styleAst;
        }
        this._updateNativeProperties(host, styleInfo.overrideStyleProperties);
      } else {
        this._updateProperties(host, styleInfo);
        if (styleInfo.ownStylePropertyNames && styleInfo.ownStylePropertyNames.length) {
          // TODO: use caching
          this._applyStyleProperties(host, styleInfo);
        }
      }
      if (hasApplied) {
        var root = this._isRootOwner(host) ? host : host.shadowRoot;
        // note: some elements may not have a root!
        if (root) {
          this._applyToDescendants(root);
        }
      }
    },
    _applyToDescendants: function _applyToDescendants(root) {
      var c$ = root.children;
      for (var i = 0, c; i < c$.length; i++) {
        c = c$[i];
        if (c.shadowRoot) {
          this.applyStyle(c);
        }
        this._applyToDescendants(c);
      }
    },
    _styleOwnerForNode: function _styleOwnerForNode(node) {
      var root = node.getRootNode();
      var host = root.host;
      if (host) {
        if (StyleInfo.get(host)) {
          return host;
        } else {
          return this._styleOwnerForNode(host);
        }
      }
      return this._documentOwner;
    },
    _isRootOwner: function _isRootOwner(node) {
      return node === this._documentOwner;
    },
    _applyStyleProperties: function _applyStyleProperties(host, styleInfo) {
      var is = host.getAttribute('is') || host.localName;
      var cacheEntry = styleCache.fetch(is, styleInfo.styleProperties, styleInfo.ownStylePropertyNames);
      var cachedScopeSelector = cacheEntry && cacheEntry.scopeSelector;
      var cachedStyle = cacheEntry ? cacheEntry.styleElement : null;
      var oldScopeSelector = styleInfo.scopeSelector;
      // only generate new scope if cached style is not found
      styleInfo.scopeSelector = cachedScopeSelector || this._generateScopeSelector(is);
      var style = StyleProperties.applyElementStyle(host, styleInfo.styleProperties, styleInfo.scopeSelector, cachedStyle);
      if (!this.nativeShadow) {
        StyleProperties.applyElementScopeSelector(host, styleInfo.scopeSelector, oldScopeSelector);
      }
      if (!cacheEntry) {
        styleCache.store(is, styleInfo.styleProperties, style, styleInfo.scopeSelector);
      }
      return style;
    },
    _updateProperties: function _updateProperties(host, styleInfo) {
      var owner = this._styleOwnerForNode(host);
      var ownerStyleInfo = StyleInfo.get(owner);
      var ownerProperties = ownerStyleInfo.styleProperties;
      var props = Object.create(ownerProperties || null);
      var hostAndRootProps = StyleProperties.hostAndRootPropertiesForScope(host, styleInfo.styleRules);
      var propertyData = StyleProperties.propertyDataFromStyles(ownerStyleInfo.styleRules, host);
      var propertiesMatchingHost = propertyData.properties;
      Object.assign(props, hostAndRootProps.hostProps, propertiesMatchingHost, hostAndRootProps.rootProps);
      this._mixinOverrideStyles(props, styleInfo.overrideStyleProperties);
      StyleProperties.reify(props);
      styleInfo.styleProperties = props;
    },
    _mixinOverrideStyles: function _mixinOverrideStyles(props, overrides) {
      for (var p in overrides) {
        var v = overrides[p];
        // skip override props if they are not truthy or 0
        // in order to fall back to inherited values
        if (v || v === 0) {
          props[p] = v;
        }
      }
    },
    _updateNativeProperties: function _updateNativeProperties(element, properties) {
      // remove previous properties
      for (var p in properties) {
        // NOTE: for bc with shim, don't apply null values.
        if (p === null) {
          element.style.removeProperty(p);
        } else {
          element.style.setProperty(p, properties[p]);
        }
      }
    },
    updateStyles: function updateStyles(properties) {
      if (window.CustomStyle) {
        window.CustomStyle._documentDirty = true;
      }
      this.applyStyle(this._documentOwner, properties);
    },

    /* Custom Style operations */
    _transformCustomStyleForDocument: function _transformCustomStyleForDocument(style) {
      var _this = this;

      var ast = rulesForStyle(style);
      forEachRule(ast, function (rule) {
        if (nativeShadow) {
          StyleTransformer.normalizeRootSelector(rule);
        } else {
          StyleTransformer.documentRule(rule);
        }
        if (_this.nativeCss && !_this.nativeCssApply) {
          applyShim.transformRule(rule);
        }
      });
      if (this.nativeCss) {
        style.textContent = toCssText(ast);
      } else {
        this._documentOwnerStyleInfo.styleRules.rules.push(ast);
      }
    },
    _revalidateApplyShim: function _revalidateApplyShim(style) {
      if (this.nativeCss && !this.nativeCssApply) {
        var ast = rulesForStyle(style);
        applyShim.transformRules(ast);
        style.textContent = toCssText(ast);
      }
    },
    _applyCustomStyleToDocument: function _applyCustomStyleToDocument(style) {
      if (!this.nativeCss) {
        StyleProperties.applyCustomStyle(style, this._documentOwnerStyleInfo.styleProperties);
      }
    },
    getComputedStyleValue: function getComputedStyleValue(element, property) {
      var value = void 0;
      if (!this.nativeCss) {
        // element is either a style host, or an ancestor of a style host
        var styleInfo = StyleInfo.get(element) || StyleInfo.get(this._styleOwnerForNode(element));
        value = styleInfo.styleProperties[property];
      }
      // fall back to the property value from the computed styling
      value = value || window.getComputedStyle(element).getPropertyValue(property);
      // trim whitespace that can come after the `:` in css
      // example: padding: 2px -> " 2px"
      return value.trim();
    },

    // given an element and a classString, replaces
    // the element's class with the provided classString and adds
    // any necessary ShadyCSS static and property based scoping selectors
    setElementClass: function setElementClass(element, classString) {
      var root = element.getRootNode();
      var classes = classString ? classString.split(/\s/) : [];
      var scopeName = root.host && root.host.localName;
      // If no scope, try to discover scope name from existing class.
      // This can occur if, for example, a template stamped element that
      // has been scoped is manipulated when not in a root.
      if (!scopeName) {
        var classAttr = element.getAttribute('class');
        if (classAttr) {
          var k$ = classAttr.split(/\s/);
          for (var i = 0; i < k$.length; i++) {
            if (k$[i] === StyleTransformer.SCOPE_NAME) {
              scopeName = k$[i + 1];
              break;
            }
          }
        }
      }
      if (scopeName) {
        classes.push(StyleTransformer.SCOPE_NAME, scopeName);
      }
      if (!this.nativeCss) {
        var styleInfo = StyleInfo.get(element);
        if (styleInfo && styleInfo.scopeSelector) {
          classes.push(StyleProperties.XSCOPE_NAME, styleInfo.scopeSelector);
        }
      }
      setElementClassRaw(element, classes.join(' '));
    },
    _styleInfoForNode: function _styleInfoForNode(node) {
      return StyleInfo.get(node);
    }
  };

  window['ShadyCSS'] = ShadyCSS;

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /*
  Wrapper over <style> elements to co-operate with ShadyCSS
  
  Example:
  <shady-style>
    <style>
    ...
    </style>
  </shady-style>
  */

  var ShadyCSS$1 = window.ShadyCSS;

  var enqueued = false;

  var customStyles = [];

  var hookFn = null;

  /*
  If a page only has <custom-style> elements, it will flash unstyled content,
  as all the instances will boot asynchronously after page load.
  
  Calling ShadyCSS.updateStyles() will force the work to happen synchronously
  */
  function enqueueDocumentValidation() {
    if (enqueued) {
      return;
    }
    enqueued = true;
    if (window.HTMLImports) {
      window.HTMLImports.whenReady(validateDocument);
    } else if (document.readyState === 'complete') {
      validateDocument();
    } else {
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
          validateDocument();
        }
      });
    }
  }

  function validateDocument() {
    requestAnimationFrame(function () {
      if (enqueued) {
        ShadyCSS$1.updateStyles();
        enqueued = false;
      }
    });
  }

  function CustomStyle() {
    /*
    Use Reflect to invoke the HTMLElement constructor, or rely on the
    CustomElement polyfill replacement that can be `.call`ed
    */
    var self = window.Reflect && Reflect.construct ? Reflect.construct(HTMLElement, [], this.constructor || CustomStyle) : HTMLElement.call(this);
    customStyles.push(self);
    enqueueDocumentValidation();
    return self;
  }

  Object.defineProperties(CustomStyle, {
    /*
    CustomStyle.processHook is provided to customize the <style> element child of
    a <custom-style> element before the <style> is processed by ShadyCSS
     The function must take a <style> element as input, and return nothing.
    */
    processHook: {
      get: function get() {
        return hookFn;
      },
      set: function set(fn) {
        hookFn = fn;
        return fn;
      }
    },
    _customStyles: {
      get: function get() {
        return customStyles;
      }
    },
    _documentDirty: {
      get: function get() {
        return enqueued;
      },
      set: function set(value) {
        enqueued = value;
        return value;
      }
    }
  });

  CustomStyle.findStyles = function () {
    for (var i = 0; i < customStyles.length; i++) {
      customStyles[i]._findStyle();
    }
  };

  CustomStyle._revalidateApplyShim = function () {
    for (var i = 0; i < customStyles.length; i++) {
      var s = customStyles[i];
      if (s._style) {
        ShadyCSS$1._revalidateApplyShim(s._style);
      }
    }
  };

  CustomStyle.applyStyles = function () {
    for (var i = 0; i < customStyles.length; i++) {
      customStyles[i]._applyStyle();
    }
  };

  CustomStyle.prototype = Object.create(HTMLElement.prototype, {
    'constructor': {
      value: CustomStyle,
      configurable: true,
      writable: true
    }
  });

  CustomStyle.prototype._findStyle = function () {
    if (!this._style) {
      var style = this.querySelector('style');
      if (!style) {
        return;
      }
      // HTMLImports polyfill may have cloned the style into the main document,
      // which is referenced with __appliedElement.
      // Also, we must copy over the attributes.
      if (style.__appliedElement) {
        for (var i = 0; i < style.attributes.length; i++) {
          var attr = style.attributes[i];
          style.__appliedElement.setAttribute(attr.name, attr.value);
        }
      }
      this._style = style.__appliedElement || style;
      if (hookFn) {
        hookFn(this._style);
      }
      ShadyCSS$1._transformCustomStyleForDocument(this._style);
    }
  };

  CustomStyle.prototype._applyStyle = function () {
    if (this._style) {
      ShadyCSS$1._applyCustomStyleToDocument(this._style);
    }
  };

  window.customElements.define('custom-style', CustomStyle);
  window['CustomStyle'] = CustomStyle;

  /**
  @license
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  /*
  Small module to load ShadyCSS and CustomStyle together
  */
})();

const { DocumentFragment: DocumentFragment$1, Node: Node$1, Promise: Promise$1 } = window;
const { slice } = [];

function startsWith(key, val) {
  return key.indexOf(val) === 0;
}

function shouldBeAttr(key, val) {
  return startsWith(key, 'aria-') || startsWith(key, 'data-');
}

function handleFunction(Fn) {
  return Fn.prototype instanceof HTMLElement$2 ? new Fn() : Fn();
}

function h(name, attrs, ...chren) {
  const node = typeof name === 'function' ? handleFunction(name) : document.createElement(name);
  Object.keys(attrs || []).forEach(attr => shouldBeAttr(attr, attrs[attr]) ? node.setAttribute(attr, attrs[attr]) : node[attr] = attrs[attr]);
  chren.forEach(child => node.appendChild(child instanceof Node$1 ? child : document.createTextNode(child)));
  return node;
}

const { customElements: customElements$1, HTMLElement: HTMLElement$2, NodeFilter: NodeFilter$1 } = window;
const { body } = document;
const { attachShadow } = HTMLElement$2.prototype;
const { diff } = require('skatejs-dom-diff').default;

// Ensure we can force sync operations in the polyfill.
if (customElements$1) {
  customElements$1.enableFlush = true;
}

// Create and add a fixture to append nodes to.
const fixture = document.createElement('div');
document.body.appendChild(fixture);

// Override to force mode "open" so we can query against all shadow roots.
HTMLElement$2.prototype.attachShadow = function () {
  return attachShadow.call(this, { mode: 'open' });
};

// Ensures polyfill operations are run sync.
function flush$1() {
  if (customElements$1 && typeof customElements$1.flush === 'function') {
    customElements$1.flush();
  }
}

// Abstraction for browsers not following the spec.
function matches(node, query) {
  return (node.matches || node.msMatchesSelector).call(node, query);
}

function nodeFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

class Wrapper {
  constructor(node, opts = {}) {
    this.node = typeof node === 'string' ? nodeFromHtml(node) : node;
    this.opts = opts;

    const customElementDefinition = customElements$1.get(this.node.localName);
    const isRootNode = !node.parentNode;

    // If this is a new node, clean up the fixture.
    if (isRootNode) {
      fixture.innerHTML = '';
      customElementDefinition && flush$1();
    }

    // If the fixture has been removed from the document, re-insert it.
    if (!body.contains(fixture)) {
      body.appendChild(fixture);
    }

    // Add the node to the fixture so it runs the connectedCallback().
    if (isRootNode) {
      fixture.appendChild(node);
      customElementDefinition && flush$1();
    }
  }

  get shadowRoot() {
    const { node } = this;
    return node.shadowRoot || node;
  }

  all(query) {
    const { shadowRoot } = this;
    let temp = [];

    // Custom element constructors
    if (query.prototype instanceof HTMLElement$2) {
      this.walk(shadowRoot, node => node instanceof query, node => temp.push(node));
      // Custom filtering function
    } else if (typeof query === 'function') {
      this.walk(shadowRoot, query, node => temp.push(node));
      // Diffing node trees
      //
      // We have to check if the node type is an element rather than checking
      // instanceof because the ShadyDOM polyfill seems to fail the prototype
      // chain lookup.
    } else if (query.nodeType === Node$1.ELEMENT_NODE) {
      this.walk(shadowRoot, node => diff({ destination: query, source: node, root: true }).length === 0, node => temp.push(node));
      // Using an object as criteria
    } else if (typeof query === 'object') {
      const keys = Object.keys(query);
      if (keys.length === 0) {
        return temp;
      }
      this.walk(shadowRoot, node => keys.every(key => node[key] === query[key]), node => temp.push(node));
      // Selector
    } else if (typeof query === 'string') {
      this.walk(shadowRoot, node => matches(node, query), node => temp.push(node), { skip: true });
    }

    return temp.map(n => new Wrapper(n, this.opts));
  }

  has(query) {
    return !!this.one(query);
  }

  one(query) {
    return this.all(query)[0];
  }

  wait(func) {
    return this.waitFor(wrap => !!wrap.node.shadowRoot).then(func);
  }

  waitFor(func, { delay } = { delay: 1 }) {
    return new Promise$1((resolve, reject) => {
      const check = () => {
        const ret = (() => {
          try {
            return func(this);
          } catch (e) {
            reject(e);
          }
        })();
        if (ret) {
          resolve(this);
        } else {
          setTimeout(check, delay);
        }
      };
      setTimeout(check, delay);
    }).catch(e => {
      throw e;
    });
  }

  walk(node, query, callback, opts = { root: false, skip: false }) {
    // The ShadyDOM polyfill creates a shadow root that is a <div /> but is an
    // instanceof a DocumentFragment. For some reason a tree walker can't
    // traverse it, so we must traverse each child. Due to this implementation
    // detail, we must also tell the walker to include the root node, which it
    // doesn't do with the default implementation.
    if (node instanceof DocumentFragment$1) {
      slice.call(node.children).forEach(child => {
        this.walk(child, query, callback, {
          root: true,
          skip: opts.skip
        });
      });
      return;
    }

    const acceptNode = node => query(node) ? NodeFilter$1.FILTER_ACCEPT : opts.skip ? NodeFilter$1.FILTER_SKIP : NodeFilter$1.FILTER_REJECT;

    // IE requires a function, standards compliant browsers require an object.
    acceptNode.acceptNode = acceptNode;

    // Last argument here is for IE.
    const tree = document.createTreeWalker(node, NodeFilter$1.SHOW_ELEMENT, acceptNode, true);

    // Include the main node.
    if (opts.root && query(node)) {
      callback(node);
    }

    // Call user callback for each node.
    while (tree.nextNode()) {
      callback(tree.currentNode);
    }
  }
}

function mount(elem) {
  return new Wrapper(elem);
}

const isFunction = val => typeof val === 'function';
const isObject = val => typeof val === 'object' && val !== null;
const isString = val => typeof val === 'string';
const isSymbol = val => typeof val === 'symbol';
const isUndefined = val => typeof val === 'undefined';

/**
 * Returns array of owned property names and symbols for the given object
 */
function getPropNamesAndSymbols(obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction(Object.getOwnPropertySymbols) ? listOfKeys.concat(Object.getOwnPropertySymbols(obj)) : listOfKeys;
}

// We are not using Object.assign if it is defined since it will cause problems when Symbol is polyfilled.
// Apparently Object.assign (or any polyfill for this method) does not copy non-native Symbols.
var assign = ((obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
});

var empty = function (val) {
  return typeof val === 'undefined' || val === null;
};

/**
 * Attributes value can only be null or string;
 */
const toNullOrString = val => empty(val) ? null : String(val);

const connected = '____skate_connected';
const created = '____skate_created';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
const name = '____skate_name';

// Used on the Constructor
const ctorCreateInitProps = '____skate_ctor_createInitProps';
const ctorObservedAttributes = '____skate_ctor_observedAttributes';
const ctorProps = '____skate_ctor_props';
const ctorPropsMap = '____skate_ctor_propsMap';

// Used on the Element
const props = '____skate_props';
const ref = '____skate_ref';
const renderer = '____skate_renderer';
const rendering = '____skate_rendering';
const rendererDebounced = '____skate_rendererDebounced';
const updated = '____skate_updated';

// DEPRECTAED
//
// We should not be relying on internals for symbols as this creates version
// coupling. We will move forward with platform agnostic ways of doing this.

/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A cached reference to the hasOwnProperty function.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A cached reference to the create function.
 */
var create$1 = Object.create;

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function (map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function () {
  return create$1(null);
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {?Object<string, !Element>}
   */
  this.keyMap = null;

  /**
   * Whether or not the keyMap is currently valid.
   * {boolean}
   */
  this.keyMapValid = true;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function (node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {Node} node The node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function (node) {
  var data = node['__incrementalDOMData'];

  if (!data) {
    var nodeName = node.nodeName.toLowerCase();
    var key = null;

    if (node instanceof Element) {
      key = node.getAttribute('key');
    }

    data = initData(node, nodeName, key);
  }

  return data;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default',

  placeholder: '__placeholder'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function (name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function (el, name, value) {
  el[name] = value;
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle$1 = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        elStyle[prop] = obj[prop];
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function (el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes[symbols.placeholder] = function () {};

attributes['style'] = applyStyle$1;

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element.
 * @return {!Element}
 */
var createElement = function (doc, parent, tag, key, statics) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
    }
  }

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function (doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {?Node} el
 * @return {!Object<string, !Element>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap = function (el) {
  var map = createMap();
  var child = el.firstElementChild;

  while (child) {
    var key = getData(child).key;

    if (key) {
      map[key] = child;
    }

    child = child.nextElementSibling;
  }

  return map;
};

/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {?Node} el
 * @return {!Object<string, !Node>} A mapping of keys to child Elements
 */
var getKeyMap = function (el) {
  var data = getData(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap(el);
  }

  return data.keyMap;
};

/**
 * Retrieves a child from the parent with the given key.
 * @param {?Node} parent
 * @param {?string=} key
 * @return {?Node} The child corresponding to the key.
 */
var getChild = function (parent, key) {
  return key ? getKeyMap(parent)[key] : null;
};

/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {?Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild = function (parent, key, child) {
  getKeyMap(parent)[key] = child;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
* Makes sure that keyed Element matches the tag name provided.
* @param {!string} nodeName The nodeName of the node that is being matched.
* @param {string=} tag The tag name of the Element.
* @param {?string=} key The key of the Element.
*/
var assertKeyedTagMatches = function (nodeName, tag, key) {
  if (nodeName !== tag) {
    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Element|?DocumentFragment} */
var root = null;

/** @type {?Document} */
var doc = null;

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
 * @template T
 */
var patchFactory = function (run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @template T
   */
  var f = function (node, fn, data) {
    var prevContext = context;
    var prevRoot = root;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    root = node;
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    run(node, fn, data);

    context.notifyChanges();

    context = prevContext;
    root = prevRoot;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  
});

/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
var matches$1 = function (nodeName, key) {
  var data = getData(currentNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 * @param {?Array<*>=} statics For an Element, this should be an array of
 *     name-value pairs.
 */
var alignWithDOM = function (nodeName, key, statics) {
  if (currentNode && matches$1(nodeName, key)) {
    return;
  }

  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    node = getChild(currentParent, key);
    if (node && 'production' !== 'production') {
      assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key, statics);
    }

    if (key) {
      registerChild(currentParent, key, node);
    }

    context.markCreated(node);
  }

  // If the node has a key, remove it from the DOM to prevent a large number
  // of re-orders in the case that it moved far or was completely removed.
  // Since we hold on to a reference through the keyMap, we can always add it
  // back.
  if (currentNode && getData(currentNode).key) {
    currentParent.replaceChild(node, currentNode);
    getData(currentParent).keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function () {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  if (data.attrs[symbols.placeholder] && node !== root) {
    return;
  }

  while (child !== currentNode) {
    node.removeChild(child);
    context.markDeleted( /** @type {!Node}*/child);

    key = getData(child).key;
    if (key) {
      delete keyMap[key];
    }
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function () {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function () {
  if (currentNode) {
    currentNode = currentNode.nextSibling;
  } else {
    currentNode = currentParent.firstChild;
  }
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function () {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function (tag, key, statics) {
  nextNode();
  alignWithDOM(tag, key, statics);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function () {
  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function () {
  nextNode();
  alignWithDOM('#text', null, null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
var skip = function () {
  currentNode = currentParent.lastChild;
};

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementOpen$1 = function (tag, key, statics, const_args) {
  var node = coreElementOpen(tag, key, statics);
  var data = getData(node);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var attrsChanged = false;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 1, j += 1) {
    if (attrsArr[j] !== arguments[i]) {
      attrsChanged = true;
      break;
    }
  }

  for (; i < arguments.length; i += 1, j += 1) {
    attrsArr[j] = arguments[i];
  }

  if (j < attrsArr.length) {
    attrsChanged = true;
    attrsArr.length = j;
  }

  /*
   * Actually perform the attribute update.
   */
  if (attrsChanged) {
    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
      newAttrs[arguments[i]] = arguments[i + 1];
    }

    for (var _attr in newAttrs) {
      updateAttribute(node, _attr, newAttrs[_attr]);
      newAttrs[_attr] = undefined;
    }
  }

  return node;
};

/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
var elementClose = function (tag) {
  var node = coreElementClose();

  return node;
};

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} const_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
var text = function (value, const_args) {
  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

var patchInner_1 = patchInner;
var skip_1 = skip;
var elementOpen_1 = elementOpen$1;
var elementClose_1 = elementClose;
var text_1 = text;
var symbols_1 = symbols;
var attributes_1 = attributes;
var applyProp_1 = applyProp;

function enter(object, props) {
  const saved = {};
  Object.keys(props).forEach(key => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit(object, saved) {
  assign(object, saved);
}

// Decorates a function with a side effect that changes the properties of an
// object during its execution, and restores them after. There is no error
// handling here, if the wrapped function throws an error, properties are not
// restored and all bets are off.
var propContext = function (object, props) {
  return func => (...args) => {
    const saved = enter(object, props);
    const result = func(...args);
    exit(object, saved);
    return result;
  };
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$3 = typeof self === 'object' && self.self === self && self || typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal || commonjsGlobal;

/* eslint no-plusplus: 0 */

const { customElements: customElements$2, HTMLElement: HTMLElement$3 } = index$3;
const applyDefault = attributes_1[symbols_1.default];

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren = [];

const $skip = '__skip';
const $currentEventHandlers = '__events';
const $stackCurrentHelperProps = '__props';

// The current function helper in the stack.
let stackCurrentHelper;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs;

// The number of levels deep after skipping a tree.
let skips = 0;

const noop = () => {};

// Adds or removes an event listener for an element.
function applyEvent(elem, ename, newFunc) {
  let events$$1 = elem[$currentEventHandlers];

  if (!events$$1) {
    events$$1 = elem[$currentEventHandlers] = {};
  }

  // Undefined indicates that there is no listener yet.
  if (typeof events$$1[ename] === 'undefined') {
    // We only add a single listener once. Originally this was a workaround for
    // the Webcomponents ShadyDOM polyfill not removing listeners, but it's
    // also a simpler model for binding / unbinding events because you only
    // have a single handler you need to worry about and a single place where
    // you only store one event handler
    elem.addEventListener(ename, function (e) {
      if (events$$1[ename]) {
        events$$1[ename].call(this, e);
      }
    });
  }

  // Not undefined indicates that we have set a listener, so default to null.
  events$$1[ename] = typeof newFunc === 'function' ? newFunc : null;
}

const attributesContext = propContext(attributes_1, {
  // Attributes that shouldn't be applied to the DOM.
  key: noop,
  statics: noop,

  // Attributes that *must* be set via a property on all elements.
  checked: applyProp_1,
  className: applyProp_1,
  disabled: applyProp_1,
  value: applyProp_1,

  // Ref handler.
  ref(elem, name$$1, value) {
    elem[ref] = value;
  },

  // Skip handler.
  skip(elem, name$$1, value) {
    if (value) {
      elem[$skip] = true;
    } else {
      delete elem[$skip];
    }
  },

  // Default attribute applicator.
  [symbols_1.default](elem, name$$1, value) {
    const { props: props$$1, prototype } = customElements$2.get(elem.localName) || {
      props: {},
      prototype: {}
    };

    // TODO when refactoring properties to not have to workaround the old
    // WebKit bug we can remove the "name in props" check below.
    //
    // NOTE: That the "name in elem" check won't work for polyfilled custom
    // elements that set a property that isn't explicitly specified in "props"
    // or "prototype" unless it is added to the element explicitly as a
    // property prior to passing the prop to the vdom function. For example, if
    // it were added in a lifecycle callback because it wouldn't have been
    // upgraded yet.
    //
    // We prefer setting props, so we do this if there's a property matching
    // name that was passed. However, certain props on SVG elements are
    // readonly and error when you try to set them.
    if ((name$$1 in props$$1 || name$$1 in elem || name$$1 in prototype) && !('ownerSVGElement' in elem)) {
      applyProp_1(elem, name$$1, value);
      return;
    }

    // Explicit false removes the attribute.
    if (value === false) {
      applyDefault(elem, name$$1);
      return;
    }

    // Handle built-in and custom events.
    if (name$$1.indexOf('on') === 0) {
      const firstChar = name$$1[2];
      let eventName;

      if (firstChar === '-') {
        eventName = name$$1.substring(3);
      } else if (firstChar === firstChar.toUpperCase()) {
        eventName = firstChar.toLowerCase() + name$$1.substring(3);
      }

      if (eventName) {
        applyEvent(elem, eventName, value);
        return;
      }
    }

    applyDefault(elem, name$$1, value);
  }
});

function resolveTagName(name$$1) {
  // We return falsy values as some wrapped IDOM functions allow empty values.
  if (!name$$1) {
    return name$$1;
  }

  // We try and return the cached tag name, if one exists.
  if (name$$1[name]) {
    return name$$1[name];
  }

  // If it's a custom element, we get the tag name by constructing it and
  // caching it.
  if (name$$1.prototype instanceof HTMLElement$3) {
    // eslint-disable-next-line
    const elem = new name$$1();
    return name$$1[name] = elem.localName;
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name$$1;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen$$1 = attributesContext(elementOpen_1);

function elementOpenStart$$1(tag, key = null, statics = null) {
  overrideArgs = [tag, key, statics];
}

function elementOpenEnd$$1() {
  const node = newElementOpen(...overrideArgs); // eslint-disable-line no-use-before-define
  overrideArgs = null;
  return node;
}

function wrapIdomFunc(func, tnameFuncHandler = noop) {
  return function wrap(...args) {
    args[0] = resolveTagName(args[0]);
    stackCurrentHelper = null;
    if (typeof args[0] === 'function') {
      // If we've encountered a function, handle it according to the type of
      // function that is being wrapped.
      stackCurrentHelper = args[0];
      return tnameFuncHandler(...args);
    } else if (stackChren.length) {
      // We pass the wrap() function in here so that when it's called as
      // children, it will queue up for the next stack, if there is one.
      stackChren[stackChren.length - 1].push([wrap, args]);
    } else {
      if (func === elementOpen$$1) {
        if (skips) {
          return ++skips;
        }

        const elem = func(...args);

        if (elem[$skip]) {
          ++skips;
        }

        return elem;
      }

      if (func === elementClose_1) {
        if (skips === 1) {
          skip_1();
        }

        // We only want to skip closing if it's not the last closing tag in the
        // skipped tree because we keep the element that initiated the skpping.
        if (skips && --skips) {
          return;
        }

        const elem = func(...args);
        const ref$$1 = elem[ref];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[ref];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof ref$$1 === 'function') {
          ref$$1(elem);
        }

        return elem;
      }

      // We must call elementOpenStart and elementOpenEnd even if we are
      // skipping because they queue up attributes and then call elementClose.
      if (!skips || func === elementOpenStart$$1 || func === elementOpenEnd$$1) {
        return func(...args);
      }
    }
  };
}

function newAttr(...args) {
  if (stackCurrentHelper) {
    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
  } else if (stackChren.length) {
    stackChren[stackChren.length - 1].push([newAttr, args]);
  } else {
    overrideArgs.push(args[0]);
    overrideArgs.push(args[1]);
  }
}

function stackOpen(tname, key, statics, ...attrs) {
  const props$$1 = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props$$1[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps] = props$$1;
  stackChren.push([]);
}

function stackClose(tname) {
  const chren = stackChren.pop();
  const props$$1 = tname[$stackCurrentHelperProps];
  delete tname[$stackCurrentHelperProps];
  const elemOrFn = tname(props$$1, () => chren.forEach(args => args[0](...args[1])));
  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
}

// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenStart = wrapIdomFunc(elementOpenStart$$1, stackOpen);
const newElementOpenEnd = wrapIdomFunc(elementOpenEnd$$1);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen = wrapIdomFunc(elementOpen$$1, stackOpen);
const newElementClose = wrapIdomFunc(elementClose_1, stackClose);

// Text override ensures their calls can queue if using function helpers.
const newText = wrapIdomFunc(text_1);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
function element$1(tname, attrs, ...chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren.unshift(attrs);
  }

  // Ensure the attributes are an object. Null is considered an object so we
  // have to test for this explicitly.
  if (attrs === null || atype !== 'object') {
    attrs = {};
  }

  // We open the element so we can set attrs after.
  newElementOpenStart(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name$$1 => newAttr(name$$1, attrs[name$$1]));

  // Close before we render the descendant tree.
  newElementOpenEnd(tname);

  chren.forEach(ch => {
    const ctype = typeof ch;
    if (ctype === 'function') {
      ch();
    } else if (ctype === 'string' || ctype === 'number') {
      newText(ch);
    } else if (Array.isArray(ch)) {
      ch.forEach(sch => sch());
    }
  });

  return newElementClose(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
function builder(...tags) {
  if (tags.length === 0) {
    return (...args) => element$1.bind(null, ...args);
  }
  return tags.map(tag => (...args) => element$1.bind(null, tag, ...args));
}

function createSymbol(description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}

var data = function (element, namespace = '') {
  const data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
};

const nativeHints = ['native code', '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
var native = (fn => nativeHints.map(hint => (fn || '').toString().indexOf([hint]) > -1).reduce((a, b) => a || b));

const { MutationObserver: MutationObserver$2 } = index$3;

function microtaskDebounce(cbFunc) {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver$2(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${ i }`;
      i += 1;
    }
  };
}

// We have to use setTimeout() for IE9 and 10 because the Mutation Observer
// polyfill requires that the element be in the document to trigger Mutation
// Events. Mutation Events are also synchronous and thus wouldn't debounce.
//
// The soonest we can set the timeout for in IE is 1 as they have issues when
// setting to 0.
function taskDebounce(cbFunc) {
  let scheduled = false;
  let cbArgs = [];
  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        cbFunc(...cbArgs);
      }, 1);
    }
  };
}
var debounce = native(MutationObserver$2) ? microtaskDebounce : taskDebounce;

function deprecated(elem, oldUsage, newUsage) {
  if (DEBUG) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ ownerName } ${ oldUsage } is deprecated. Use ${ newUsage }.`);
  }
}

/**
 * @internal
 * Attributes Manager
 *
 * Postpones attributes updates until when connected.
 */
class AttributesManager {
  constructor(elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates() {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates() {
    this.connected = true;
    const names = Object.keys(this.pendingValues);
    names.forEach(name => {
      const value = this.pendingValues[name];
      // Skip if already cleared
      if (!isUndefined(value)) {
        delete this.pendingValues[name];
        this._syncAttrValue(name, value);
      }
    });
  }

  /**
   * Returns true if the value is different from the one set internally
   * using setAttrValue()
   */
  onAttributeChanged(name, value) {
    value = toNullOrString(value);

    // A new attribute value voids the pending one
    this._clearPendingValue(name);

    const changed = this.lastSetValues[name] !== value;
    this.lastSetValues[name] = value;
    return changed;
  }

  /**
   * Updates or removes the attribute if value === null.
   *
   * When the component is not connected the value is saved and
   * the attribute is only updated when the component is re-connected.
   */
  setAttrValue(name, value) {
    value = toNullOrString(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue(name, value) {
    const currAttrValue = toNullOrString(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue(name) {
    if (name in this.pendingValues) {
      delete this.pendingValues[name];
    }
  }
}

// Only used by getAttrMgr
const $attributesMgr = '____skate_attributesMgr';

/**
 * @internal
 * Returns attribute manager instance for the given Component
 */
function getAttrMgr(elem) {
  let mgr = elem[$attributesMgr];
  if (!mgr) {
    mgr = new AttributesManager(elem);
    elem[$attributesMgr] = mgr;
  }
  return mgr;
}

var getOwnPropertyDescriptors = function (obj = {}) {
  return getPropNamesAndSymbols(obj).reduce((prev, nameOrSymbol) => {
    prev[nameOrSymbol] = Object.getOwnPropertyDescriptor(obj, nameOrSymbol);
    return prev;
  }, {});
};

var dashCase = function (str) {
  return str.split(/([A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    return `${ one }${ dash }${ two.toLowerCase() }`;
  });
};

function error(message) {
  throw new Error(message);
}

/**
 * @internal
 * Property Definition
 *
 * Internal meta data and strategies for a property.
 * Created from the options of a PropOptions config object.
 *
 * Once created a PropDefinition should be treated as immutable and final.
 * 'getPropsMap' function memoizes PropDefinitions by Component's Class.
 *
 * The 'attribute' option is normalized to 'attrSource' and 'attrTarget' properties.
 */
class PropDefinition {

  constructor(nameOrSymbol, propOptions) {
    this._nameOrSymbol = nameOrSymbol;

    propOptions = propOptions || {};

    // default 'attrSource': no observed source attribute (name)
    this.attrSource = null;

    // default 'attrTarget': no reflected target attribute (name)
    this.attrTarget = null;

    // default 'attrTargetIsNotSource'
    this.attrTargetIsNotSource = false;

    // default 'coerce': identity function
    this.coerce = value => value;

    // default 'default': set prop to 'null'
    this.default = null;

    // default 'deserialize': return attribute's value (string or null)
    this.deserialize = value => value;

    // default 'get': no function
    this.get = null;

    // 'initial' default: unspecified
    // 'initial' option is truly optional and it cannot be initialized.
    // Its presence is tested using: ('initial' in propDef)

    // 'serialize' default: return string value or null
    this.serialize = value => empty(value) ? null : String(value);

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          if (!isObject(optVal)) {
            this.attrSource = this.attrTarget = resolveAttrName(optVal, nameOrSymbol);
          } else {
            const { source, target } = optVal;
            if (!source && !target) {
              error(`${ option } 'source' or 'target' is missing.`);
            }
            this.attrSource = resolveAttrName(source, nameOrSymbol);
            this.attrTarget = resolveAttrName(target, nameOrSymbol);
            this.attrTargetIsNotSource = this.attrTarget !== this.attrSource;
          }
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (isFunction(optVal)) {
            this[option] = optVal;
          } else {
            error(`${ option } must be a function.`);
          }
          break;
        case 'default':
        case 'initial':
          this[option] = optVal;
          break;
        default:
          // TODO: undocumented options?
          this[option] = optVal;
          break;
      }
    });
  }

  get nameOrSymbol() {
    return this._nameOrSymbol;
  }

}

function resolveAttrName(attrOption, nameOrSymbol) {
  if (isSymbol(nameOrSymbol)) {
    error(`${ nameOrSymbol.toString() } symbol property cannot have an attribute.`);
  } else {
    if (attrOption === true) {
      return dashCase(String(nameOrSymbol));
    }
    if (isString(attrOption)) {
      return attrOption;
    }
  }
  return null;
}

/**
 * This is needed to avoid IE11 "stack size errors" when creating
 * a new property on the constructor of an HTMLElement
 */
function setCtorNativeProperty(Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}

/**
 * Memoizes a map of PropDefinition for the given component class.
 * Keys in the map are the properties name which can a string or a symbol.
 *
 * The map is created from the result of: static get props
 */
function getPropsMap(Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty(ctorPropsMap)) {
    const props$$1 = Ctor.props || {};

    const propsMap = getPropNamesAndSymbols(props$$1).reduce((result, nameOrSymbol) => {
      result[nameOrSymbol] = new PropDefinition(nameOrSymbol, props$$1[nameOrSymbol]);
      return result;
    }, {});
    setCtorNativeProperty(Ctor, ctorPropsMap, propsMap);
  }

  return Ctor[ctorPropsMap];
}

function get$1$1(elem) {
  const props$$1 = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach(nameOrSymbol => {
    props$$1[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props$$1;
}

function set$1$1(elem, newProps) {
  assign(elem, newProps);
  if (elem[renderer]) {
    elem[renderer]();
  }
}

var props$1 = function (elem, newProps) {
  return isUndefined(newProps) ? get$1$1(elem) : set$1$1(elem, newProps);
};

function getDefaultValue(elem, propDef) {
  return typeof propDef.default === 'function' ? propDef.default(elem, { name: propDef.nameOrSymbol }) : propDef.default;
}

function getInitialValue(elem, propDef) {
  return typeof propDef.initial === 'function' ? propDef.initial(elem, { name: propDef.nameOrSymbol }) : propDef.initial;
}

function getPropData(elem, name) {
  const elemData = data(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor(propDef) {
  const { nameOrSymbol } = propDef;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.beforeDefineProperty = elem => {
    const propData = getPropData(elem, nameOrSymbol);
    const attrSource = propDef.attrSource;

    // Store attrSource name to property link.
    if (attrSource) {
      data(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
    }

    // prop value before upgrading
    let initialValue = elem[nameOrSymbol];

    // Set up initial value if it wasn't specified.
    let valueFromAttrSource = false;
    if (empty(initialValue)) {
      if (attrSource && elem.hasAttribute(attrSource)) {
        valueFromAttrSource = true;
        initialValue = propDef.deserialize(elem.getAttribute(attrSource));
      } else if ('initial' in propDef) {
        initialValue = getInitialValue(elem, propDef);
      } else {
        initialValue = getDefaultValue(elem, propDef);
      }
    }

    initialValue = propDef.coerce(initialValue);

    propData.internalValue = initialValue;

    // Reflect to Target Attribute
    const mustReflect = propDef.attrTarget && !empty(initialValue) && (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get() {
    const propData = getPropData(this, nameOrSymbol);
    const { internalValue } = propData;
    return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue }) : internalValue;
  };

  prop.set = function set(newValue) {
    const propData = getPropData(this, nameOrSymbol);

    const useDefaultValue = empty(newValue);
    if (useDefaultValue) {
      newValue = getDefaultValue(this, propDef);
    }

    newValue = propDef.coerce(newValue);

    if (propDef.set) {
      let { oldValue } = propData;

      if (empty(oldValue)) {
        oldValue = null;
      }
      const changeData = { name: nameOrSymbol, newValue, oldValue };
      propDef.set(this, changeData);
    }

    // Queue a re-render.
    this[rendererDebounced](this);

    // Update prop data so we can use it next time.
    propData.internalValue = propData.oldValue = newValue;

    // Reflect to Target attribute.
    const mustReflect = propDef.attrTarget && (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
    if (mustReflect) {
      // Note: setting the prop to empty implies the default value
      // and therefore no attribute should be present!
      let serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
      getAttrMgr(this).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  return prop;
}

/**
 * Polyfill Object.is for IE
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
if (!Object.is) {
  Object.is = function (x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
var objectIs = Object.is;

const HTMLElement$4 = index$3.HTMLElement || class {};
const _prevName = createSymbol('prevName');
const _prevOldValue = createSymbol('prevOldValue');
const _prevNewValue = createSymbol('prevNewValue');

function preventDoubleCalling(elem, name$$1, oldValue, newValue) {
  return name$$1 === elem[_prevName] && oldValue === elem[_prevOldValue] && newValue === elem[_prevNewValue];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors(Ctor) {
  const propDefs = getPropsMap(Ctor);
  return getPropNamesAndSymbols(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps(Ctor) {
  const propDescriptors = createNativePropertyDescriptors(Ctor);

  return elem => {
    getPropNamesAndSymbols(propDescriptors).forEach(nameOrSymbol => {
      const propDescriptor = propDescriptors[nameOrSymbol];
      propDescriptor.beforeDefineProperty(elem);

      // We check here before defining to see if the prop was specified prior
      // to upgrading.
      const hasPropBeforeUpgrading = nameOrSymbol in elem;

      // This is saved prior to defining so that we can set it after it it was
      // defined prior to upgrading. We don't want to invoke the getter if we
      // don't need to, so we only get the value if we need to re-sync.
      const valueBeforeUpgrading = hasPropBeforeUpgrading && elem[nameOrSymbol];

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, nameOrSymbol, propDescriptor);

      // DEPRECATED
      //
      // We'll be removing get / set callbacks on properties. Use the
      // updatedCallback() instead.
      //
      // We re-set the prop if it was specified prior to upgrading because we
      // need to ensure set() is triggered both in polyfilled environments and
      // in native where the definition may be registerd after elements it
      // represents have already been created.
      if (hasPropBeforeUpgrading) {
        elem[nameOrSymbol] = valueBeforeUpgrading;
      }
    });
  };
}

var Component = class extends HTMLElement$4 {
  /**
   * Returns unique attribute names configured with props and
   * those set on the Component constructor if any
   */
  static get observedAttributes() {
    const attrsOnCtor = this.hasOwnProperty(ctorObservedAttributes) ? this[ctorObservedAttributes] : [];
    const propDefs = getPropsMap(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName => propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index) => all.indexOf(item) === index);
  }

  static set observedAttributes(value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props() {
    return assign({}, super.props, this[ctorProps]);
  }

  static set props(value) {
    setCtorNativeProperty(this, ctorProps, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor(...args) {
    super(...args);

    const { constructor } = this;

    // Used for the ready() function so it knows when it can call its callback.
    this[created] = true;

    // TODO refactor to not cater to Safari < 10. This means we can depend on
    // built-in property descriptors.
    // Must be defined on constructor and not from a superclass
    if (!constructor.hasOwnProperty(ctorCreateInitProps)) {
      setCtorNativeProperty(constructor, ctorCreateInitProps, createInitProps(constructor));
    }

    // Set up a renderer that is debounced for property sets to call directly.
    this[rendererDebounced] = debounce(this[renderer].bind(this));

    // Set up property lifecycle.
    const propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
    if (propDefsCount && constructor[ctorCreateInitProps]) {
      constructor[ctorCreateInitProps](this);
    }

    // DEPRECATED
    //
    // static render()
    // Note that renderCallback is an optional method!
    if (!this.renderCallback && constructor.render) {
      DEBUG && deprecated(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created: created$$1 } = constructor;
    if (isFunction(created$$1)) {
      DEBUG && deprecated(this, 'static created', 'constructor');
      created$$1(this);
    }

    // DEPRECATED
    //
    // Feature has rarely been used.
    //
    // Created should be set before invoking the ready listeners.
    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }

  // Custom Elements v1
  connectedCallback() {
    // Reflect attributes pending values
    getAttrMgr(this).resumeAttributesUpdates();

    // Used to check whether or not the component can render.
    this[connected] = true;

    // Render!
    this[rendererDebounced]();

    // DEPRECATED
    //
    // static attached()
    const { attached } = this.constructor;
    if (isFunction(attached)) {
      DEBUG && deprecated(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback() {
    // Suspend updating attributes until re-connected
    getAttrMgr(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[connected] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction(detached)) {
      DEBUG && deprecated(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback(name$$1, oldValue, newValue) {
    // Polyfill calls this twice.
    if (preventDoubleCalling(this, name$$1, oldValue, newValue)) {
      return;
    }

    // Set data so we can prevent double calling if the polyfill.
    this[_prevName] = name$$1;
    this[_prevOldValue] = oldValue;
    this[_prevNewValue] = newValue;

    const propNameOrSymbol = data(this, 'attrSourceLinks')[name$$1];
    if (propNameOrSymbol) {
      const changedExternally = getAttrMgr(this).onAttributeChanged(name$$1, newValue);
      if (changedExternally) {
        // Sync up the property.
        const propDef = getPropsMap(this.constructor)[propNameOrSymbol];
        const newPropVal = newValue !== null && propDef.deserialize ? propDef.deserialize(newValue) : newValue;

        const propData = data(this, 'props')[propNameOrSymbol];
        propData.settingPropFromAttrSource = true;
        this[propNameOrSymbol] = newPropVal;
        propData.settingPropFromAttrSource = false;
      }
    }

    // DEPRECATED
    //
    // static attributeChanged()
    const { attributeChanged } = this.constructor;
    if (isFunction(attributeChanged)) {
      DEBUG && deprecated(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name: name$$1, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback(prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      DEBUG && deprecated(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback() {
    if (this.constructor.hasOwnProperty('rendered')) {
      DEBUG && deprecated(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback() {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [renderer]() {
    if (this[rendering] || !this[connected]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    this[rendering] = true;
    if (this[updated]() && isFunction(this.renderCallback)) {
      this.rendererCallback();
      this.renderedCallback();
    }

    this[rendering] = false;
  }

  // Skate
  // @internal
  // Calls the updatedCallback() with previous props.
  [updated]() {
    const prevProps = this[props];
    this[props] = props$1(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend(definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors(definition);
    const prot = getOwnPropertyDescriptors(definition.prototype);

    // Prototype is non configurable (but is writable).
    delete opts.prototype;

    // Pass on static and instance members from the definition.
    Object.defineProperties(Ctor, opts);
    Object.defineProperties(Ctor.prototype, prot);

    return Ctor;
  }

  // Skate
  //
  // DEPRECATED
  //
  // Stubbed in case any subclasses are calling it.
  static rendered() {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer(elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner_1(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach(fn => {
          if (isFunction(fn)) {
            fn();
          }
        });
      }
    });
  }

  // Skate
  //
  // DEPRECATED
  //
  // Move this to updatedCallback() before removing.
  static updated(elem, previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The 'previousProps' will always contain all of the keys.
    //
    // Use classic loop because:
    // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
    // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
    const namesAndSymbols = getPropNamesAndSymbols(previousProps);
    for (let i = 0; i < namesAndSymbols.length; i++) {
      const nameOrSymbol = namesAndSymbols[i];

      // With Object.is NaN is equal to NaN
      if (!objectIs(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }

    return false;
  }
};

function uniqueId(prefix) {
  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
  const rand = 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-mixed-operators
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
  return `${ prefix || 'x' }-${ rand }`;
}

const Event$1 = (TheEvent => {
  if (TheEvent) {
    try {
      new TheEvent('emit-init'); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return TheEvent;
})(index$3.Event);

function createCustomEvent(name, opts = {}) {
  const { detail } = opts;
  delete opts.detail;

  let e;
  if (Event$1) {
    e = new Event$1(name, opts);
    Object.defineProperty(e, 'detail', { value: detail });
  } else {
    e = document.createEvent('CustomEvent');
    Object.defineProperty(e, 'composed', { value: opts.composed });
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, detail);
  }
  return e;
}

function getValue(elem) {
  const type = elem.type;
  if (type === 'checkbox' || type === 'radio') {
    return elem.checked ? elem.value || true : false;
  }
  return elem.value;
}

const h$1 = builder();

var define$1 = ((componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${ componentName } it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
});

var index$5 = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};

var isObj = index$5;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty$1.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty$1.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign$1(Object(to[key]), from[key]);
	}
}

function assign$1(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty$1.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}

	return to;
}

var styles$1 = `
/*
Common
 */
:host {
  height: 100%;
  width: 100%;
  position: relative;
  display: block;
  contain: content;
}
.spinner{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.spinner.overlay{
  background-color: rgba(0,0,0,0.5);
}
/*
  Circle
 */
.spinner.circle {
  width: 40px;
  height: 40px;  
}

.spinner.circle .bounce1, .spinner.circle .bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color);
  opacity: .6;
  position: absolute;
  top: 0;
  left: 0;  
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.spinner.circle .bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}

/*
  Rect
 */

.spinner.rect {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 10px;
}

.spinner.rect > div {
  background-color: var(--color);
  height: 100%;
  width: 6px;
  display: inline-block;
  margin: 0 3px 0 0;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner.rect .rect2 {
  animation-delay: -1.1s;
}

.spinner.rect .rect3 {
  animation-delay: -1.0s;
}

.spinner.rect .rect4 {
  animation-delay: -0.9s;
}

.spinner.rect .rect5 {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
  }
}

/*
Bounce
 */

.spinner.bounce {
  width: 70px;
  text-align: center;
}

.spinner.bounce > div {
  width: 18px;
  height: 18px;
  background-color: var(--color);
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner.bounce .bounce1 {
  animation-delay: -0.32s;
}

.spinner.bounce .bounce2 {
  animation-delay: -0.16s;
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
`;

var layout = ((type, extraClass = '') => {
  const layouts = {
    circle: [h$1('div', {
      class: `spinner circle ${ extraClass }`
    }, h$1('div', {
      class: `bounce1`
    }), h$1('div', {
      class: 'bounce2'
    }))],
    rect: [h$1('div', {
      class: `spinner rect ${ extraClass }`
    }, h$1('div', {
      class: 'rect1'
    }), h$1('div', {
      class: 'rect2'
    }), h$1('div', {
      class: 'rect3'
    }), h$1('div', {
      class: 'rect4'
    }), h$1('div', {
      class: 'rect5'
    }))],
    bounce: [h$1('div', {
      class: `spinner bounce ${ extraClass }`
    }, h$1('div', {
      class: `bounce1`
    }), h$1('div', {
      class: 'bounce2'
    }), h$1('div', {
      class: 'bounce3'
    }))]
  };

  return layouts[type];
});

class SKSpinner extends Component {
  static get props() {
    return {
      overlay: {
        attribute: true,
        default: false
      },
      type: {
        attribute: true,
        default: 'circle' //rect, bounce
      },
      //TODO: Implement
      size: {
        attribute: true,
        default: '30px'
      },
      color: {
        attribute: true,
        default: '#333'
      }
    };
  }

  renderCallback() {
    const mergedStyles = styles$1 + `:host {--color: ${ this.color };}`;
    const overlay = this.overlay ? 'overlay' : '';

    return [
    //TODO: pass proper .spinner width and height based on 'size' attribute
    h$1('style', mergedStyles), ...layout(this.type, overlay)];
  }
}

define$1('sk-spinner', SKSpinner);

var index$8 = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

var index$10 = createCommonjsModule(function (module, exports) {
var Stream = stream;

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through;
through.through = through;

//create a readable writable stream.

function through(write, end, opts) {
  write = write || function (data) {
    this.queue(data);
  };
  end = end || function () {
    this.queue(null);
  };

  var ended = false,
      destroyed = false,
      buffer = [],
      _ended = false;
  var stream$$1 = new Stream();
  stream$$1.readable = stream$$1.writable = true;
  stream$$1.paused = false;

  //  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream$$1.autoDestroy = !(opts && opts.autoDestroy === false);

  stream$$1.write = function (data) {
    write.call(this, data);
    return !stream$$1.paused;
  };

  function drain() {
    while (buffer.length && !stream$$1.paused) {
      var data = buffer.shift();
      if (null === data) return stream$$1.emit('end');else stream$$1.emit('data', data);
    }
  }

  stream$$1.queue = stream$$1.push = function (data) {
    //    console.error(ended)
    if (_ended) return stream$$1;
    if (data === null) _ended = true;
    buffer.push(data);
    drain();
    return stream$$1;
  };

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream$$1.on('end', function () {
    stream$$1.readable = false;
    if (!stream$$1.writable && stream$$1.autoDestroy) process.nextTick(function () {
      stream$$1.destroy();
    });
  });

  function _end() {
    stream$$1.writable = false;
    end.call(stream$$1);
    if (!stream$$1.readable && stream$$1.autoDestroy) stream$$1.destroy();
  }

  stream$$1.end = function (data) {
    if (ended) return;
    ended = true;
    if (arguments.length) stream$$1.write(data);
    _end(); // will emit or queue
    return stream$$1;
  };

  stream$$1.destroy = function () {
    if (destroyed) return;
    destroyed = true;
    ended = true;
    buffer.length = 0;
    stream$$1.writable = stream$$1.readable = false;
    stream$$1.emit('close');
    return stream$$1;
  };

  stream$$1.pause = function () {
    if (stream$$1.paused) return;
    stream$$1.paused = true;
    return stream$$1;
  };

  stream$$1.resume = function () {
    if (stream$$1.paused) {
      stream$$1.paused = false;
      stream$$1.emit('resume');
    }
    drain();
    //may have become paused again,
    //as drain emits 'data'.
    if (!stream$$1.paused) stream$$1.emit('drain');
    return stream$$1;
  };
  return stream$$1;
}
});

var through = index$10;
var fs$1 = fs;

var default_stream = function () {
    var line = '';
    var stream$$1 = through(write, flush);
    return stream$$1;

    function write(buf) {
        for (var i = 0; i < buf.length; i++) {
            var c = typeof buf === 'string' ? buf.charAt(i) : String.fromCharCode(buf[i]);
            if (c === '\n') flush();else line += c;
        }
    }

    function flush() {
        if (fs$1.writeSync && /^win/.test(process.platform)) {
            try {
                fs$1.writeSync(1, line + '\n');
            } catch (e) {
                stream$$1.emit('error', e);
            }
        } else {
            try {
                console.log(line);
            } catch (e) {
                stream$$1.emit('error', e);
            }
        }
        line = '';
    }
};

var keys$1 = createCommonjsModule(function (module, exports) {
exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

exports.shim = shim;
function shim(obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
});

var is_arguments = createCommonjsModule(function (module, exports) {
var supportsArgumentsClass = function () {
  return Object.prototype.toString.call(arguments);
}() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

exports.unsupported = unsupported;
function unsupported(object) {
  return object && typeof object == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
}
});

var index$12 = createCommonjsModule(function (module) {
var pSlice = Array.prototype.slice;
var objectKeys = keys$1;
var isArguments = is_arguments;

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {
    //happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length) return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}
});

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
});

var inherits$2 = createCommonjsModule(function (module) {
try {
  var util$$1 = util;
  if (typeof util$$1.inherits !== 'function') throw '';
  module.exports = util$$1.inherits;
} catch (e) {
  module.exports = inherits_browser;
}
});

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice$1 = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice$1.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice$1.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(that, args.concat(slice$1.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var implementation = implementation$1;

var index$16 = Function.prototype.bind || implementation;

var bind$2 = index$16;

var index$14 = bind$2.call(Function.call, Object.prototype.hasOwnProperty);

var toStr$3 = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr$3.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr$3.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

// modified from https://github.com/es-shims/es5-shim

var has$2 = Object.prototype.hasOwnProperty;
var toStr$2 = Object.prototype.toString;
var slice$2 = Array.prototype.slice;
var isArgs = isArguments;
var isEnumerable$1 = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable$1.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable$1.call(function () {}, 'prototype');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = function () {
	/* global window */
	if (typeof window === 'undefined') {
		return false;
	}
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has$2.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}();
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr$2.call(object) === '[object Function]';
	var isArguments$$1 = isArgs(object);
	var isString = isObject && toStr$2.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments$$1) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has$2.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments$$1 && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has$2.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has$2.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2);
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice$2.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

var index$22 = keysShim;

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var index$24 = function forEach(obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

var keys$3 = index$22;
var foreach = index$24;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr$1 = Object.prototype.toString;

var isFunction$1 = function (fn) {
	return typeof fn === 'function' && toStr$1.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
		/* eslint-disable no-unused-vars, no-restricted-syntax */
		for (var _ in obj) {
			return false;
		}
		/* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) {
		/* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction$1(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys$3(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var index$20 = defineProperties;

var _isNaN = Number.isNaN || function isNaN(a) {
	return a !== a;
};

var $isNaN$1 = Number.isNaN || function (a) {
  return a !== a;
};

var _isFinite = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN$1(x) && x !== Infinity && x !== -Infinity;
};

var sign$1 = function sign$1(number) {
	return number >= 0 ? 1 : -1;
};

var mod$1 = function mod$1(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) {
			return false;
		}
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$4 = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var index$26 = function isCallable(value) {
	if (!value) {
		return false;
	}
	if (typeof value !== 'function' && typeof value !== 'object') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	if (isES6ClassFn(value)) {
		return false;
	}
	var strClass = toStr$4.call(value);
	return strClass === fnClass || strClass === genClass;
};

var isPrimitive$1 = function isPrimitive$1(value) {
	return value === null || typeof value !== 'function' && typeof value !== 'object';
};

var toStr$5 = Object.prototype.toString;

var isPrimitive = isPrimitive$1;

var isCallable$1 = index$26;

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr$5.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable$1(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
var es5$2 = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

var $isNaN = _isNaN;
var $isFinite = _isFinite;

var sign = sign$1;
var mod = mod$1;

var IsCallable = index$26;
var toPrimitive = es5$2;

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) {
			return 0;
		}
		if (number === 0 || !$isFinite(number)) {
			return number;
		}
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) {
			// 0 === -0, but they are not identical.
			if (x === 0) {
				return 1 / x === 1 / y;
			}
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	}
};

var es5 = ES5;

var bind$4 = index$16;
var ES = es5;
var replace = bind$4.call(Function.call, String.prototype.replace);

var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;

var implementation$4 = function trim() {
	var S = ES.ToString(ES.CheckObjectCoercible(this));
	return replace(replace(S, leftWhitespace, ''), rightWhitespace, '');
};

var implementation$6 = implementation$4;

var zeroWidthSpace = '\u200b';

var polyfill = function getPolyfill() {
	if (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace) {
		return String.prototype.trim;
	}
	return implementation$6;
};

var define$3 = index$20;
var getPolyfill$2 = polyfill;

var shim$2 = function shimStringTrim() {
	var polyfill$$1 = getPolyfill$2();
	define$3(String.prototype, { trim: polyfill$$1 }, { trim: function () {
			return String.prototype.trim !== polyfill$$1;
		} });
	return polyfill$$1;
};

var bind$3 = index$16;
var define$2 = index$20;

var implementation$3 = implementation$4;
var getPolyfill$1 = polyfill;
var shim$1 = shim$2;

var boundTrim = bind$3.call(Function.call, getPolyfill$1());

define$2(boundTrim, {
	getPolyfill: getPolyfill$1,
	implementation: implementation$3,
	shim: shim$1
});

var index$18 = boundTrim;

var index$30 = isFunction$3;

var toString$2 = Object.prototype.toString;

function isFunction$3(fn) {
  var string = toString$2.call(fn);
  return string === '[object Function]' || typeof fn === 'function' && string !== '[object RegExp]' || typeof window !== 'undefined' && (
  // IE8 and below
  fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt);
}

var isFunction$2 = index$30;

var index$28 = forEach$2;

var toString$1 = Object.prototype.toString;
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

function forEach$2(list, iterator, context) {
    if (!isFunction$2(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    if (arguments.length < 3) {
        context = this;
    }

    if (toString$1.call(list) === '[object Array]') forEachArray(list, iterator, context);else if (typeof list === 'string') forEachString(list, iterator, context);else forEachObject(list, iterator, context);
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty$2.call(array, i)) {
            iterator.call(context, array[i], i, array);
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string);
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty$2.call(object, k)) {
            iterator.call(context, object[k], k, object);
        }
    }
}

var deepEqual = index$12;
var defined = index$8;
var path$1 = path;
var inherits$1 = inherits$2;
var EventEmitter = events.EventEmitter;
var has$1 = index$14;
var trim$1 = index$18;
var bind$1 = index$16;
var forEach$1 = index$28;
var isEnumerable = bind$1.call(Function.call, Object.prototype.propertyIsEnumerable);

var test$2 = Test$1;

var nextTick = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;
var safeSetTimeout = setTimeout;

inherits$1(Test$1, EventEmitter);

var getTestArgs = function (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var t = typeof arg;
        if (t === 'string') {
            name = arg;
        } else if (t === 'object') {
            opts = arg || opts;
        } else if (t === 'function') {
            cb = arg;
        }
    }
    return { name: name, opts: opts, cb: cb };
};

function Test$1(name_, opts_, cb_) {
    if (!(this instanceof Test$1)) {
        return new Test$1(name_, opts_, cb_);
    }

    var args = getTestArgs(name_, opts_, cb_);

    this.readable = true;
    this.name = args.name || '(anonymous)';
    this.assertCount = 0;
    this.pendingCount = 0;
    this._skip = args.opts.skip || false;
    this._timeout = args.opts.timeout;
    this._objectPrintDepth = args.opts.objectPrintDepth || 5;
    this._plan = undefined;
    this._cb = args.cb;
    this._progeny = [];
    this._ok = true;

    for (var prop in this) {
        this[prop] = function bind$1(self, val) {
            if (typeof val === 'function') {
                return function bound() {
                    return val.apply(self, arguments);
                };
            } else return val;
        }(this, this[prop]);
    }
}

Test$1.prototype.run = function () {
    if (this._skip) {
        this.comment('SKIP ' + this.name);
    }
    if (!this._cb || this._skip) {
        return this._end();
    }
    if (this._timeout != null) {
        this.timeoutAfter(this._timeout);
    }
    this.emit('prerun');
    this._cb(this);
    this.emit('run');
};

Test$1.prototype.test = function (name, opts, cb) {
    var self = this;
    var t = new Test$1(name, opts, cb);
    this._progeny.push(t);
    this.pendingCount++;
    this.emit('test', t);
    t.on('prerun', function () {
        self.assertCount++;
    });

    if (!self._pendingAsserts()) {
        nextTick(function () {
            self._end();
        });
    }

    nextTick(function () {
        if (!self._plan && self.pendingCount == self._progeny.length) {
            self._end();
        }
    });
};

Test$1.prototype.comment = function (msg) {
    var that = this;
    forEach$1(trim$1(msg).split('\n'), function (aMsg) {
        that.emit('result', trim$1(aMsg).replace(/^#\s*/, ''));
    });
};

Test$1.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test$1.prototype.timeoutAfter = function (ms) {
    if (!ms) throw new Error('timeoutAfter requires a timespan');
    var self = this;
    var timeout = safeSetTimeout(function () {
        self.fail('test timed out after ' + ms + 'ms');
        self.end();
    }, ms);
    this.once('end', function () {
        clearTimeout(timeout);
    });
};

Test$1.prototype.end = function (err) {
    var self = this;
    if (arguments.length >= 1 && !!err) {
        this.ifError(err);
    }

    if (this.calledEnd) {
        this.fail('.end() called twice');
    }
    this.calledEnd = true;
    this._end();
};

Test$1.prototype._end = function (err) {
    var self = this;
    if (this._progeny.length) {
        var t = this._progeny.shift();
        t.on('end', function () {
            self._end();
        });
        t.run();
        return;
    }

    if (!this.ended) this.emit('end');
    var pendingAsserts = this._pendingAsserts();
    if (!this._planError && this._plan !== undefined && pendingAsserts) {
        this._planError = true;
        this.fail('plan != count', {
            expected: this._plan,
            actual: this.assertCount
        });
    }
    this.ended = true;
};

Test$1.prototype._exit = function () {
    if (this._plan !== undefined && !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected: this._plan,
            actual: this.assertCount,
            exiting: true
        });
    } else if (!this.ended) {
        this.fail('test exited without ending', {
            exiting: true
        });
    }
};

Test$1.prototype._pendingAsserts = function () {
    if (this._plan === undefined) {
        return 1;
    } else {
        return this._plan - (this._progeny.length + this.assertCount);
    }
};

Test$1.prototype._assert = function assert(ok, opts) {
    var self = this;
    var extra = opts.extra || {};

    var res = {
        id: self.assertCount++,
        ok: Boolean(ok),
        skip: defined(extra.skip, opts.skip),
        name: defined(extra.message, opts.message, '(unnamed assert)'),
        operator: defined(extra.operator, opts.operator),
        objectPrintDepth: self._objectPrintDepth
    };
    if (has$1(opts, 'actual') || has$1(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has$1(opts, 'expected') || has$1(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);

    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }

    if (!ok) {
        var e = new Error('exception');
        var err = (e.stack || '').split('\n');
        var dir = path$1.dirname(__dirname) + path$1.sep;

        for (var i = 0; i < err.length; i++) {
            var m = /^[^\s]*\s*\bat\s+(.+)/.exec(err[i]);
            if (!m) {
                continue;
            }

            var s = m[1].split(/\s+/);
            var filem = /((?:\/|[A-Z]:\\)[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
            if (!filem) {
                filem = /((?:\/|[A-Z]:\\)[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[2]);

                if (!filem) {
                    filem = /((?:\/|[A-Z]:\\)[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);

                    if (!filem) {
                        continue;
                    }
                }
            }

            if (filem[1].slice(0, dir.length) === dir) {
                continue;
            }

            res.functionName = s[0];
            res.file = filem[1];
            res.line = Number(filem[2]);
            if (filem[3]) res.column = filem[3];

            res.at = m[1];
            break;
        }
    }

    self.emit('result', res);

    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }

    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected: self._plan,
            actual: self._plan - pendingAsserts
        });
    }
};

Test$1.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message: msg,
        operator: 'fail',
        extra: extra
    });
};

Test$1.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message: msg,
        operator: 'pass',
        extra: extra
    });
};

Test$1.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message: msg,
        operator: 'skip',
        skip: true,
        extra: extra
    });
};

Test$1.prototype.ok = Test$1.prototype['true'] = Test$1.prototype.assert = function (value, msg, extra) {
    this._assert(value, {
        message: defined(msg, 'should be truthy'),
        operator: 'ok',
        expected: true,
        actual: value,
        extra: extra
    });
};

Test$1.prototype.notOk = Test$1.prototype['false'] = Test$1.prototype.notok = function (value, msg, extra) {
    this._assert(!value, {
        message: defined(msg, 'should be falsy'),
        operator: 'notOk',
        expected: false,
        actual: value,
        extra: extra
    });
};

Test$1.prototype.error = Test$1.prototype.ifError = Test$1.prototype.ifErr = Test$1.prototype.iferror = function (err, msg, extra) {
    this._assert(!err, {
        message: defined(msg, String(err)),
        operator: 'error',
        actual: err,
        extra: extra
    });
};

Test$1.prototype.equal = Test$1.prototype.equals = Test$1.prototype.isEqual = Test$1.prototype.is = Test$1.prototype.strictEqual = Test$1.prototype.strictEquals = function (a, b, msg, extra) {
    this._assert(a === b, {
        message: defined(msg, 'should be equal'),
        operator: 'equal',
        actual: a,
        expected: b,
        extra: extra
    });
};

Test$1.prototype.notEqual = Test$1.prototype.notEquals = Test$1.prototype.notStrictEqual = Test$1.prototype.notStrictEquals = Test$1.prototype.isNotEqual = Test$1.prototype.isNot = Test$1.prototype.not = Test$1.prototype.doesNotEqual = Test$1.prototype.isInequal = function (a, b, msg, extra) {
    this._assert(a !== b, {
        message: defined(msg, 'should not be equal'),
        operator: 'notEqual',
        actual: a,
        notExpected: b,
        extra: extra
    });
};

Test$1.prototype.deepEqual = Test$1.prototype.deepEquals = Test$1.prototype.isEquivalent = Test$1.prototype.same = function (a, b, msg, extra) {
    this._assert(deepEqual(a, b, { strict: true }), {
        message: defined(msg, 'should be equivalent'),
        operator: 'deepEqual',
        actual: a,
        expected: b,
        extra: extra
    });
};

Test$1.prototype.deepLooseEqual = Test$1.prototype.looseEqual = Test$1.prototype.looseEquals = function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message: defined(msg, 'should be equivalent'),
        operator: 'deepLooseEqual',
        actual: a,
        expected: b,
        extra: extra
    });
};

Test$1.prototype.notDeepEqual = Test$1.prototype.notEquivalent = Test$1.prototype.notDeeply = Test$1.prototype.notSame = Test$1.prototype.isNotDeepEqual = Test$1.prototype.isNotDeeply = Test$1.prototype.isNotEquivalent = Test$1.prototype.isInequivalent = function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b, { strict: true }), {
        message: defined(msg, 'should not be equivalent'),
        operator: 'notDeepEqual',
        actual: a,
        notExpected: b,
        extra: extra
    });
};

Test$1.prototype.notDeepLooseEqual = Test$1.prototype.notLooseEqual = Test$1.prototype.notLooseEquals = function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b), {
        message: defined(msg, 'should be equivalent'),
        operator: 'notDeepLooseEqual',
        actual: a,
        expected: b,
        extra: extra
    });
};

Test$1.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }

    var caught = undefined;

    try {
        fn();
    } catch (err) {
        caught = { error: err };
        if (err != null && (!isEnumerable(err, 'message') || !has$1(err, 'message'))) {
            var message = err.message;
            delete err.message;
            err.message = message;
        }
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    if (typeof expected === 'function' && caught) {
        passed = caught.error instanceof expected;
        caught.error = caught.error.constructor;
    }

    this._assert(typeof fn === 'function' && passed, {
        message: defined(msg, 'should throw'),
        operator: 'throws',
        actual: caught && caught.error,
        expected: expected,
        error: !passed && caught && caught.error,
        extra: extra
    });
};

Test$1.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    } catch (err) {
        caught = { error: err };
    }
    this._assert(!caught, {
        message: defined(msg, 'should not throw'),
        operator: 'throws',
        actual: caught && caught.error,
        expected: expected,
        error: caught && caught.error,
        extra: extra
    });
};

Test$1.skip = function (name_, _opts, _cb) {
    var args = getTestArgs.apply(null, arguments);
    args.opts.skip = true;
    return Test$1(args.name, args.opts, args.cb);
};

// vim: set softtabstop=4 shiftwidth=4:

var through$2 = index$10;
var nextTick$2 = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;

var index$32 = function (write, end) {
    var tr = through$2(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;

    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };

    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };

    nextTick$2(function () {
        if (!paused) tr.resume();
    });

    return tr;
};

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var booleanValueOf = Boolean.prototype.valueOf;

var index$34 = function inspect_(obj, opts, depth, seen) {
    if (!opts) opts = {};

    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth >= maxDepth && maxDepth > 0 && obj && typeof obj === 'object') {
        return '[Object]';
    }

    if (seen === undefined) seen = [];else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'string') {
        return inspectString(obj);
    } else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    } else if (obj === null) {
        return 'null';
    } else if (isSymbol$1(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? 'Object(' + symString + ')' : symString;
    } else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    } else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has$4(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    } else if (isError(obj)) {
        var parts = [];
        for (var key in obj) {
            if (!has$4(obj, key)) continue;

            if (/[^\w$]/.test(key)) {
                parts.push(inspect(key) + ': ' + inspect(obj[key]));
            } else {
                parts.push(key + ': ' + inspect(obj[key]));
            }
        }
        if (parts.length === 0) return '[' + obj + ']';
        return '{ [' + obj + '] ' + parts.join(', ') + ' }';
    } else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    } else if (isMap(obj)) {
        var parts = [];
        mapForEach.call(obj, function (value, key) {
            parts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
        });
        return 'Map (' + mapSize.call(obj) + ') {' + parts.join(', ') + '}';
    } else if (isSet(obj)) {
        var parts = [];
        setForEach.call(obj, function (value) {
            parts.push(inspect(value, obj));
        });
        return 'Set (' + setSize.call(obj) + ') {' + parts.join(', ') + '}';
    } else if (typeof obj !== 'object') {
        return String(obj);
    } else if (isNumber(obj)) {
        return 'Object(' + Number(obj) + ')';
    } else if (isBoolean(obj)) {
        return 'Object(' + booleanValueOf.call(obj) + ')';
    } else if (isString$1(obj)) {
        return 'Object(' + inspect(String(obj)) + ')';
    } else if (!isDate(obj) && !isRegExp(obj)) {
        var xs = [],
            keys = [];
        for (var key in obj) {
            if (has$4(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            } else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    } else return String(obj);
};

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) {
    return toStr$6(obj) === '[object Array]';
}
function isDate(obj) {
    return toStr$6(obj) === '[object Date]';
}
function isRegExp(obj) {
    return toStr$6(obj) === '[object RegExp]';
}
function isError(obj) {
    return toStr$6(obj) === '[object Error]';
}
function isSymbol$1(obj) {
    return toStr$6(obj) === '[object Symbol]';
}
function isString$1(obj) {
    return toStr$6(obj) === '[object String]';
}
function isNumber(obj) {
    return toStr$6(obj) === '[object Number]';
}
function isBoolean(obj) {
    return toStr$6(obj) === '[object Boolean]';
}

var hasOwn$1 = Object.prototype.hasOwnProperty || function (key) {
    return key in this;
};
function has$4(obj, key) {
    return hasOwn$1.call(obj, key);
}

function toStr$6(obj) {
    return Object.prototype.toString.call(obj);
}

function nameOf(f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf(xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isMap(x) {
    if (!mapSize) {
        return false;
    }
    try {
        mapSize.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize) {
        return false;
    }
    try {
        setSize.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";

    function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

var EventEmitter$1 = events.EventEmitter;
var inherits$4 = inherits$2;
var through$1 = index$10;
var resumer = index$32;
var inspect = index$34;
var bind$5 = index$16;
var has$3 = index$14;
var regexpTest = bind$5.call(Function.call, RegExp.prototype.test);
var yamlIndicators = /\:|\-|\?/;
var nextTick$1 = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;

var results = Results;
inherits$4(Results, EventEmitter$1);

function Results() {
    if (!(this instanceof Results)) return new Results();
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this._stream = through$1();
    this.tests = [];
    this._only = null;
}

Results.prototype.createStream = function (opts) {
    if (!opts) opts = {};
    var self = this;
    var output,
        testId = 0;
    if (opts.objectMode) {
        output = through$1();
        self.on('_push', function ontest(t, extra) {
            if (!extra) extra = {};
            var id = testId++;
            t.once('prerun', function () {
                var row = {
                    type: 'test',
                    name: t.name,
                    id: id
                };
                if (has$3(extra, 'parent')) {
                    row.parent = extra.parent;
                }
                output.queue(row);
            });
            t.on('test', function (st) {
                ontest(st, { parent: id });
            });
            t.on('result', function (res) {
                res.test = id;
                res.type = 'assert';
                output.queue(res);
            });
            t.on('end', function () {
                output.queue({ type: 'end', test: id });
            });
        });
        self.on('done', function () {
            output.queue(null);
        });
    } else {
        output = resumer();
        output.queue('TAP version 13\n');
        self._stream.pipe(output);
    }

    nextTick$1(function next() {
        var t;
        while (t = getNextTest(self)) {
            t.run();
            if (!t.ended) return t.once('end', function () {
                nextTick$1(next);
            });
        }
        self.emit('done');
    });

    return output;
};

Results.prototype.push = function (t) {
    var self = this;
    self.tests.push(t);
    self._watch(t);
    self.emit('_push', t);
};

Results.prototype.only = function (t) {
    this._only = t;
};

Results.prototype._watch = function (t) {
    var self = this;
    var write = function (s) {
        self._stream.queue(s);
    };
    t.once('prerun', function () {
        write('# ' + t.name + '\n');
    });

    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count++;

        if (res.ok) self.pass++;else self.fail++;
    });

    t.on('test', function (st) {
        self._watch(st);
    });
};

Results.prototype.close = function () {
    var self = this;
    if (self.closed) self._stream.emit('error', new Error('ALREADY CLOSED'));
    self.closed = true;
    var write = function (s) {
        self._stream.queue(s);
    };

    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n');else write('\n# ok\n');

    self._stream.queue(null);
};

function encodeResult(res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';

    if (res.skip) output += ' # SKIP';else if (res.todo) output += ' # TODO';

    output += '\n';
    if (res.ok) return output;

    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + res.operator + '\n';

    if (has$3(res, 'expected') || has$3(res, 'actual')) {
        var ex = inspect(res.expected, { depth: res.objectPrintDepth });
        var ac = inspect(res.actual, { depth: res.objectPrintDepth });

        if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
            output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
        } else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
    }
    if (res.at) {
        output += inner + 'at: ' + res.at + '\n';
    }
    if (res.operator === 'error' && res.actual && res.actual.stack) {
        var lines = String(res.actual.stack).split('\n');
        output += inner + 'stack: |-\n';
        for (var i = 0; i < lines.length; i++) {
            output += inner + '  ' + lines[i] + '\n';
        }
    }

    output += outer + '...\n';
    return output;
}

function getNextTest(results) {
    if (!results._only) {
        return results.tests.shift();
    }

    do {
        var t = results.tests.shift();
        if (!t) continue;
        if (results._only === t) {
            return t;
        }
    } while (results.tests.length !== 0);
}

function invalidYaml(str) {
    return regexpTest(yamlIndicators, str);
}

var index$7 = createCommonjsModule(function (module, exports) {
var defined = index$8;
var createDefaultStream = default_stream;
var Test = test$2;
var createResult = results;
var through = index$10;

var canEmitExit = typeof process !== 'undefined' && process && typeof process.on === 'function' && process.browser !== true;
var canExit = typeof process !== 'undefined' && process && typeof process.exit === 'function';

var nextTick = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;

exports = module.exports = function () {
    var harness;
    var lazyLoad = function () {
        return getHarness().apply(this, arguments);
    };

    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };

    lazyLoad.createStream = function (opts) {
        if (!opts) opts = {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: opts.objectMode });
            return output;
        }
        return harness.createStream(opts);
    };

    lazyLoad.onFinish = function () {
        return getHarness().onFinish.apply(this, arguments);
    };

    lazyLoad.getHarness = getHarness;

    return lazyLoad;

    function getHarness(opts) {
        if (!opts) opts = {};
        opts.autoclose = !canEmitExit;
        if (!harness) harness = createExitHarness(opts);
        return harness;
    }
}();

function createExitHarness(conf) {
    if (!conf) conf = {};
    var harness = createHarness({
        autoclose: defined(conf.autoclose, false)
    });

    var stream$$1 = harness.createStream({ objectMode: conf.objectMode });
    var es = stream$$1.pipe(conf.stream || createDefaultStream());
    if (canEmitExit) {
        es.on('error', function (err) {
            harness._exitCode = 1;
        });
    }

    var ended = false;
    stream$$1.on('end', function () {
        ended = true;
    });

    if (conf.exit === false) return harness;
    if (!canEmitExit || !canExit) return harness;

    var inErrorState = false;

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (code !== 0) {
            return;
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (only && t !== only) continue;
                t._exit();
            }
        }
        harness.close();
        process.exit(code || harness._exitCode);
    });

    return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat
exports.test.skip = Test.skip;

var exitInterval;

function createHarness(conf_) {
    if (!conf_) conf_ = {};
    var results$$1 = createResult();
    if (conf_.autoclose !== false) {
        results$$1.once('done', function () {
            results$$1.close();
        });
    }

    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);

        (function inspectCode(st) {
            st.on('test', function sub(st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok && typeof r !== 'string') test._exitCode = 1;
            });
        })(t);

        results$$1.push(t);
        return t;
    };
    test._results = results$$1;

    test._tests = [];

    test.createStream = function (opts) {
        return results$$1.createStream(opts);
    };

    test.onFinish = function (cb) {
        results$$1.on('done', cb);
    };

    var only = false;
    test.only = function () {
        if (only) throw new Error('there can only be one only test');
        only = true;
        var t = test.apply(null, arguments);
        results$$1.only(t);
        return t;
    };
    test._exitCode = 0;

    test.close = function () {
        results$$1.close();
    };

    return test;
}
});

// import tapeDOM from 'tape-dom';

// tapeDOM(test);

index$7('Spinner # default options', t => {
  t.plan(1);

  mount(h(SKSpinner, null)).wait(w => {
    t.equal(w.node.tagName, 'SK-SPINNER');
  });
});

index$7.onFinish(() => {
  console.log('close window');
  // window.close();
});

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},"/test")
},{"_process":14,"events":7,"fs":3,"path":12,"skatejs-dom-diff":26,"stream":27,"util":32}]},{},[33]);
