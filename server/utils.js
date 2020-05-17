/**
 * Turn normal string into hex string
 * @param str Normal string
 */
//function str2hexstr(str: string) {
function str2hexstr(str) {
  return ab2hexstring(str2ab(str));
};

/**
 * Turn normal string into ArrayBuffer
 * @param str Normal string
 */
//function str2ab(str: string) {
function str2ab(str) {
  const buf = new ArrayBuffer(str.length); // 每个字符占用1个字节
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

/**
 * Turn array buffer into hex string
 * @param arr Array like value
 */
//function ab2hexstring(arr: any): string {
function ab2hexstring(arr) {
  let result = '';
//  const uint8Arr: Uint8Array = new Uint8Array(arr);
  const uint8Arr = new Uint8Array(arr);
  for (let i = 0; i < uint8Arr.byteLength; i++) {
    let str = uint8Arr[i].toString(16);
    str = str.length === 0
        ? '00'
        : str.length === 1
            ? '0' + str
            : str;
    result += str;
  }
  return result;
};

/**
 * Reverses a hex string, 2 chars as 1 byte
 * @example
 * reverseHex('abcdef') = 'efcdab'
 * @param {string} hex - HEX string
 * @return {string} reversed hex string.
 */
//function reverseHex(hex: string) {
function reverseHex(hex) {
    if (hex.length % 2 !== 0) {
        throw new Error(`Incorrect Length: ${hex}`);
    }
    let out = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2);
    }
    return out;
};

/**
 * Turn hex string into normal string
 * @param str Hex string
 */
//function hexstr2str(str: string) {
function hexstr2str(str) {
    return ab2str(hexstring2ab(str));
}

/**
 * Turn hex string into array buffer
 * @param str hex string
 */
//function hexstring2ab(str: string): number[] {
function hexstring2ab(str) {
    const result = [];

    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
}

/**
 * @class StringReader
 * @classdesc A string helper used to read given string as bytes.2 chars as one byte.
 * @param {string} str - The string to read.
 */
class StringReader {
//    str: string;
//    pos: number;
//    size: number;
    constructor(str = '') {
        if (str.length % 2 !== 0) {
            throw new Error('Param\'s length is not even.');
        }
        this.str = str;
        this.pos = 0;
        this.size = this.str.length / 2;
    }

    /**
     * Checks if reached the end of the string.
     */
    isEmpty() {
        return this.pos >= this.str.length;
    }

    /**
     * Reads some bytes.
     * @param {number} bytes - Number of bytes to read
     */
//     read(bytes: number) {
    read(bytes) {
        if (this.isEmpty()) {
            throw new Error('StringReader reached the end.');
        }
        const out = this.str.substr(this.pos, bytes * 2);
        this.pos += bytes * 2;
        return out;
    }

//    unreadBytes(bytes: number) {
    unreadBytes(bytes) {
        if ((this.pos - bytes * 2) < 0) {
            throw new Error('Can not unread too many bytes.');
        }
        this.pos -= bytes * 2;
        return;
    }

    /**
     * Reads string terminated by NULL.
     */
//     readNullTerminated(): string {
    readNullTerminated() {
        const index = this.str.indexOf('00', this.pos);
        if (index === -1) {
            throw new Error('No ending NULL found');
        }

        const out = this.str.substring(this.pos, index);
        this.pos = index + 2;
        return out;
    }

    readNextByte() {
        return this.read(1);
    }

    /**
     * First, read one byte as the length of bytes to read. Then read the following bytes.
     */
    readNextBytes() {
        const bytesToRead = this.readNextLen();
        if (bytesToRead === 0) {
            return '';
        }

        return this.read(bytesToRead);
    }

    /**
     * Reads one byte as int, which may indicates the length of following bytes to read.
     * @returns {number}
     */
    readNextLen() {
        let len = parseInt(this.read(1), 16);

        if (len === 0xfd) {
            len = parseInt(reverseHex(this.read(2)), 16);
        } else if (len === 0xfe) {
            len = parseInt(reverseHex(this.read(4)), 16);
        } else if (len === 0xff) {
            len = parseInt(reverseHex(this.read(8)), 16);
        }

        return len;
    }

    readVarUint() {
        return this.readNextLen();
    }

    /**
     * Read Uint8
     */
    readUint8() {
        return parseInt(reverseHex(this.read(1)), 16);
    }

    /**
     * read 2 bytes as uint16 in littleEndian
     */
    readUint16() {
        return parseInt(reverseHex(this.read(2)), 16);
    }

    /**
     * Read 4 bytes as uint32 in littleEndian
     */
    readUint32() {
        return parseInt(reverseHex(this.read(4)), 16);
    }

    /**
     * Read 8 bytes as uint64 in littleEndian
     */
    readUint64() {
        return parseInt(reverseHex(this.read(8)), 16);
    }

    /**
     * Read 4 bytes as int in littleEndian
     */
    readInt() {
        return parseInt(reverseHex(this.read(4)), 16);
    }

    /**
     * Read 8 bytes as long in littleEndian
     */
    readLong() {
        return parseInt(reverseHex(this.read(8)), 16);
    }

    readBoolean() {
        return parseInt(this.read(1), 16) !== 0;
    }
}

/*
* Turn ArrayBuffer or array-like oject into normal string
* @param buf
*/
//function ab2str(buf: ArrayBuffer | number[]): string {
function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint8Array(buf));
}

module.exports.str2hexstr = str2hexstr;
module.exports.str2ab = str2ab;
module.exports.ab2hexstring = ab2hexstring;
module.exports.reverseHex = reverseHex;
module.exports.hexstr2str = hexstr2str;
module.exports.hexstring2ab = hexstring2ab;
module.exports.ab2str = ab2str;
module.exports.StringReader = StringReader;
