/**
 * byte arrayを受け取り、clockwork base32 エンコーディングした文字列を返します
 * @param {Uint8Array} arr - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32(arr) {
    return '';
}

/**
 * stringを受け取り、clockwork base32 エンコーディングしたbyte arrayを返します
 * @param {Uint8Array} str - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32str(str) {
    const textEncoder = new TextEncoder();
    const arr = textEncoder.encode(str);
    console.log('%s -->', str, arr);
    return encode32(arr);
}


/**
 * stringを受け取り、clockwork base32 デコードした文字列を返します
 * @param {string}} str - 入力バイト列
 * @return {Uint8Array} - エンコード結果
 */
function decode32(str) {
    const arr = new Uint8Array();
    return arr;
}

/**
 * バイトアレイを受け取り、5bit毎に分割、バイトアレイで返す
 *  4バイト(40bit)-->5バイトになる
 * @param {string}} str - 入力バイト列
 * @return {Uint8Array} - エンコード結果
 */
function _splitArray8to5bit(arr) {
    const newArr = new Uint8Array();
}


function _split40bits(b0, b1, b2, b3, b4) {
    const r0 = (b0 & 0b11111000) >> 3;
    const r1 = ((b0 & 0b00000111) << 2) | ((b1 & 0b11000000) >> 6);
    const r2 = (b1 & 0b00111110) >> 1;
    const r3 = ((b1 & 0b00000001) << 4) | ( (b2 & 0b11110000) >> 4);
    const r4 = ( (b2 & 0b00001111) << 1) | ( (b3 & 0b10000000) >> 7);
    const r5 = ( (b3 & 0b01111100) >> 2);
    const r6 = ( (b3 & 0b00000011) << 3) | ( (b4 & 0b11100000) >> 5);
    const r7 = (b4 & 0b00011111);

    const arr = new Uint8Array([r0, r1, r2, r3, r4, r5, r6, r7]);
    return arr;
}

function _split40bitsByStr(b0, b1, b2, b3, b4) {
    let src =  _byteTobitString(b0);
    src +=  _byteTobitString(b1);
    src +=  _byteTobitString(b2);
    src +=  _byteTobitString(b3);
    src +=  _byteTobitString(b4);

    const arr = new Uint8Array(8);
    let i = 0;
    while (src.length > 0) {
        const chunk = src.substr(0, 5);
        const rest = src.substr(5);
        src = rest;

        const byte = parseInt(chunk, 2);
        arr[i] = byte;
        i++;
    }

    return arr;
}

function _byteTobitString(b) {
    const str = ('0000000' + b.toString(2)).substr(-8);
    return str;
}

function _encodeByte(b) {
    const encodeTable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 
        'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
    ]
}


// ----------------------

encode32str('ABC');

const b0 = 0b11110000, b1=0b00001111;
//const b0 = 0b11110000, b1=0b11110000;
//const b0 = 0b00001111, b1=0b00001111;
const arr = _split40bits(b0, b1, b0, b1, b0);
let line = '';
for(let i = 0; i < arr.length; i++) {
    const str = ('0000' + arr[i].toString(2)).substr(-5);
    line += str;
    line += ' ';
}
console.log(line);

const arr2 = _split40bitsByStr(b0, b1, b0, b1, b0);
line = '';
for(let i = 0; i < arr.length; i++) {
    const str = ('0000' + arr[i].toString(2)).substr(-5);
    line += str;
    line += ' ';
}
console.log(line);

