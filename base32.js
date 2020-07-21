// https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8

/**
 * byte arrayを受け取り、clockwork base32 エンコーディングした文字列を返します
 * @param {Uint8Array} arr - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32(arr) {
  const buffer = arr.buffer;
  let str = '';

  const step = 5;
  for (let offset = 0; offset < arr.length; offset += step) {
    const chunkArray = new Uint8Array(buffer, offset, Math.min((arr.length - offset), step));
    str += _encode5bytesArray(chunkArray);
  }
  return str;
}

/**
 * stringを受け取り、clockwork base32 エンコーディングしたbyte arrayを返します
 * @param {Uint8Array} str - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32str(str) {
  const textEncoder = new TextEncoder();
  const arr = textEncoder.encode(str);
  //console.log('%s -->', str, arr);
  return encode32(arr);
}


/**
 * stringを受け取り、clockwork base32 デコードした文字列を返します
 * @param {string}} str - 入力バイト列
 * @return {Uint8Array} - エンコード結果
 */
function decode32(str) {
  const arr = [];

  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    const n = _decodeByte(s);
    console.log(s + ' --> ' + n);
    arr.push(n);
  }
  const array5bits = new Uint8Array(arr);
  return array5bits;
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

function encode5bytes(b0, b1, b2, b3, b4) {
  const arr = _split40bits(b0, b1, b2, b3, b4);
  //const arr = _split40bitsByStr(b0, b1, b2, b3, b4);
  let str = '';
  arr.forEach(b => { str += _encodeByte(b) });
  return str;
}

function _encode5bytesArray(arr) {
  const newArr = _split5bytesBy5bits(arr);
  //console.log('newArr:', newArr);
  //const arr = _split40bitsByStr(b0, b1, b2, b3, b4);
  let str = '';
  newArr.forEach(b => { str += _encodeByte(b) });
  return str;
}

function _split5bytesBy5bits(arr) {
  const len = arr.length;
  //console.log('_split5bytesBy5bits len=', len)
  if (len > 5) {
    console.warn('WARN: _split5bytesBy5bits() more than 5 bytes, cut 5 bytes only')
  }
  const b0 = (len > 0) ? arr[0] : 0;
  const b1 = (len > 1) ? arr[1] : 0;
  const b2 = (len > 2) ? arr[2] : 0;
  const b3 = (len > 3) ? arr[3] : 0;
  const b4 = (len > 4) ? arr[4] : 0;

  // ---- split by 5bits --> ８bytes ---
  const r0 = (b0 & 0b11111000) >> 3;
  const r1 = ((b0 & 0b00000111) << 2) | ((b1 & 0b11000000) >> 6);
  const r2 = (b1 & 0b00111110) >> 1;
  const r3 = ((b1 & 0b00000001) << 4) | ((b2 & 0b11110000) >> 4);
  const r4 = ((b2 & 0b00001111) << 1) | ((b3 & 0b10000000) >> 7);
  const r5 = ((b3 & 0b01111100) >> 2);
  const r6 = ((b3 & 0b00000011) << 3) | ((b4 & 0b11100000) >> 5);
  const r7 = (b4 & 0b00011111);

  // --- pack to array ---
  let newArr = null;
  if (len >= 5) {
    newArr = new Uint8Array([r0, r1, r2, r3, r4, r5, r6, r7]);
  }
  else if (len === 4) {
    newArr = new Uint8Array([r0, r1, r2, r3, r4, r5, r6]);
  }
  else if (len === 3) {
    newArr = new Uint8Array([r0, r1, r2, r3, r4]);
  }
  else if (len === 2) {
    newArr = new Uint8Array([r0, r1, r2, r3]);
  }
  else if (len === 1) {
    newArr = new Uint8Array([r0, r1]);
  }
  else {
    newArr = new Uint8Array();
  }

  return newArr;
}

function _split40bits(b0, b1, b2, b3, b4) {
  const r0 = (b0 & 0b11111000) >> 3;
  const r1 = ((b0 & 0b00000111) << 2) | ((b1 & 0b11000000) >> 6);
  const r2 = (b1 & 0b00111110) >> 1;
  const r3 = ((b1 & 0b00000001) << 4) | ((b2 & 0b11110000) >> 4);
  const r4 = ((b2 & 0b00001111) << 1) | ((b3 & 0b10000000) >> 7);
  const r5 = ((b3 & 0b01111100) >> 2);
  const r6 = ((b3 & 0b00000011) << 3) | ((b4 & 0b11100000) >> 5);
  const r7 = (b4 & 0b00011111);

  const arr = new Uint8Array([r0, r1, r2, r3, r4, r5, r6, r7]);
  return arr;
}

function _split40bitsByStr(b0, b1, b2, b3, b4) {
  let src = _byteTobitString(b0);
  src += _byteTobitString(b1);
  src += _byteTobitString(b2);
  src += _byteTobitString(b3);
  src += _byteTobitString(b4);

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
  ];
  if (encodeTable.length !== 32) {
    console.error('TABLE error');
    throw 'TABLE error';
  }

  if ((b < 0) || (b >= 32)) {
    console.error('Byte value range ERROR', b);
    throw 'Byte value range ERROR';
  }

  return encodeTable[b];
}

function _decodeByte(s) {
  const decodeHash = {
    '0': 0,
    'O': 0,

    '1': 1,
    'L': 1,
    'I': 1,

    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,

    'A': 10,
    'B': 11,
    'C': 11,
    'D': 13,
    'E': 14,
    'F': 15,
    'G': 16,
    'H': 17,

    'J': 18,
    'K': 19,

    'M': 20,
    'N': 21,

    'P': 22,
    'Q': 23,
    'R': 24,
    'S': 25,
    'T': 26,

    'V': 27,
    'W': 28,
    'X': 29,
    'Y': 30,
    'Z': 31,
  };

  const sUpper = s.toUpperCase();
  const n = decodeHash[sUpper];
  if (!n) {
    console.error('Byte string decode ERROR', s, n);
    throw 'Byte string decode ERROR';
  }

  return n;
}

// ----------------------

//encode32str('ABC');

const b0 = 0b11110000, b1 = 0b00001111;
//const b0 = 0b11110000, b1=0b11110000;
//const b0 = 0b00001111, b1=0b00001111;
const arr = _split40bits(b0, b1, b0, b1, b0);
let line = '';
for (let i = 0; i < arr.length; i++) {
  const str = ('0000' + arr[i].toString(2)).substr(-5);
  line += str;
  line += ' ';
}
console.log(line);

const arr2 = _split40bitsByStr(b0, b1, b0, b1, b0);
line = '';
for (let i = 0; i < arr.length; i++) {
  const str = ('0000' + arr[i].toString(2)).substr(-5);
  line += str;
  line += ' ';
}
console.log(line);

line = encode5bytes(b0, b1, b0, b1, b0);
console.log('encoded=', line);

const fooba = (new TextEncoder).encode('fooba');
console.log('fooba:', fooba);

line = encode5bytes(fooba[0], fooba[1], fooba[2], fooba[3], fooba[4]);
console.log('encoded=', line);

const r = (new TextEncoder).encode('r');
console.log('r:', r);
line += _encode5bytesArray(r);
console.log('encoded=', line);

const foobar = (new TextEncoder).encode('foobar');
line = encode32(foobar);
console.log('foobar encoded=', line);

const helloworld = (new TextEncoder).encode('Hello, world');
line = encode32(helloworld);
console.log('Hello, world=', line);

const helloworld2 = (new TextEncoder).encode('Hello, world!');
line = encode32(helloworld2);
console.log('Hello, world!=', line);

line = encode32str('Hello, world!');
console.log('str:Hello, world!=', line);
if (line !== '91JPRV3F5GG7EVVJDHJ22') {
  throw 'hello world';
}

line = encode32str('The quick brown fox jumps over the lazy dog.');
console.log('str:lazy dog=', line);
if (line !== 'AHM6A83HENMP6TS0C9S6YXVE41K6YY10D9TPTW3K41QQCSBJ41T6GS90DHGQMY90CHQPEBG') {
  throw 'lazy dog NOT MATCH';
}

console.log('------ decode --------');
let ret = decode32('CSQPYRK1');
console.log(ret);
