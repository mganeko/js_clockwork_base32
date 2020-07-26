// javascript implementation for Clockwork Base32
//
// -- refer ---
// https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
// https://medium.com/shiguredo/base32-の変種を作った話-d8da2e3102ec
// https://github.com/szktty/go-clockwork-base32
// ----------

export { encode32, encode32str, decode32, decode32str }

/**
 * バイト列(Uint8Array)を受け取り、clockwork base32 エンコーディングした文字列を返します
 * @param {Uint8Array} arr - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32(arr) {
  const newArr = _splitBytesBy5bits(arr);
  let str = '';
  newArr.forEach(b => { str += _encodeByte(b) });
  return str;
}

/**
 * stringを受け取り、clockwork base32 エンコーディングした文字列を返します
 * @param {string} str - 入力バイト列
 * @return {string} - エンコード結果
 */
function encode32str(str) {
  const textEncoder = new TextEncoder();
  const arr = textEncoder.encode(str);
  return encode32(arr);
}


/**
 * stringを受け取り、clockwork base32 デコードしたバイト列(Uint8Array)を返します
 * @param {string}} str - 入力文字列
 * @return {Uint8Array} - デコード結果
 */
function decode32(str) {
  const arr = [];

  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    const n = _decodeByte(s);
    arr.push(n);
  }
  const array5bits = new Uint8Array(arr);
  const decodedArray = _pack5bitsArrayAsBytes(array5bits);
  const byteArray = new Uint8Array(decodedArray);
  return byteArray;
}

/**
 * stringを受け取り、clockwork base32 デコードしたバイト列を文字列として返します
 * @param {string} str - 入力文字列
 * @return {string} - デコード結果
 */
function decode32str(str) {
  const arr = decode32(str);

  const decoder = new TextDecoder();
  const decodedStr = decoder.decode(arr);
  return decodedStr;
}

// split 8bit array --> 5bit array
//  5(bytes) --> 8(bytes)
//  4 --> 7
//  3 --> 5
//  2 --> 4
//  1 --> 2
//  0 --> 0
function _splitBytesBy5bits(srcArr) {
  const srcLen = srcArr.length;
  if (srcLen < 1) {
    //throw ' _split8BitsBytesBy5bits NO src byte';
    return new Uint8Array([]);
  }
  let destBitLength = 0;
  let destArr = [];
  let destByte = 0;

  for (let srcIdx = 0; srcIdx < srcLen; srcIdx++) {
    const srcByte = srcArr[srcIdx];
    for (let srcBitPos = 7; srcBitPos >= 0; srcBitPos--) { // srcBitPos : 76543210
      const bit1 = (srcByte >> srcBitPos) & 0b00000001;
      destByte = destByte << 1;
      destByte = destByte | bit1;
      destBitLength++;
      if (destBitLength >= 5) {
        // next dest byte
        destArr.push(destByte);
        destBitLength = 0;
        destByte = 0;
      }
    }
  }
  if (destBitLength > 0) {
    destByte = destByte << (5 - destBitLength);
    destArr.push(destByte);
  }

  return new Uint8Array(destArr);
}


// pack  8bit array  <-- 5bit array
//  5(bytes) <-- 8(bytes)
//  4 <-- 7 
//  3 <-- 5
//  2 <-- 4
//  1 <-- 2
//  0 <-- 0
function _pack5bitsArrayAsBytes(srcArr) {
  const srcLen = srcArr.length;
  //console.log('_pack5bitsArrayAsBytes srcLen=', srcLen);
  if (srcLen < 1) {
    //throw ' _pack5bitsArrayAsBytes NO src byte';
    return new Uint8Array([]);
  }
  let destBitLength = 0;
  let destArr = [];
  let destByte = 0;

  for (let srcIdx = 0; srcIdx < srcLen; srcIdx++) {
    const srcByte = srcArr[srcIdx];
    for (let srcBitPos = 4; srcBitPos >= 0; srcBitPos--) { // srcBitPos : xxx43210
      const bit1 = (srcByte >> srcBitPos) & 0b00000001;
      destByte = destByte << 1;
      destByte = destByte | bit1;
      destBitLength++;
      if (destBitLength >= 8) {
        // next dest byte
        destArr.push(destByte);
        destBitLength = 0;
        destByte = 0;
        //console.log('==_pack5bitsArrayAsBytes newDest byte');
      }
    }
  }

  // --- rest is padding, so leave them (not neet to append)
  // if (destBitLength > 0) {
  //   console.log('==_pack5bitsArrayAsBytes rest bitts=', destBitLength);
  //   destByte = destByte << (8 - destBitLength);
  //   destArr.push(destByte);
  // }

  //return new Uint8Array(destArr);
  return destArr;
}

const _encodeTable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M',
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

function _encodeByte(b) {
  if (_encodeTable.length !== 32) {
    console.error('TABLE error');
    throw 'TABLE error';
  }
  if ((b < 0) || (b >= 32)) {
    console.error('Byte value range ERROR', b);
    throw 'Byte value range ERROR';
  }

  return _encodeTable[b];
}

const _decodeHash = {
  '0': 0, 'O': 0,
  '1': 1, 'L': 1, 'I': 1,
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15,
  'G': 16, 'H': 17, 'J': 18, 'K': 19, 'M': 20, 'N': 21, 'P': 22, 'Q': 23,
  'R': 24, 'S': 25, 'T': 26, 'V': 27, 'W': 28, 'X': 29, 'Y': 30, 'Z': 31,
};


function _decodeByte(s) {
  const sUpper = s.toUpperCase();
  const n = _decodeHash[sUpper];
  if ((n === null) || n === undefined) {
    console.error('Byte string decode ERROR', s, n);
    throw 'Byte string decode ERROR';
  }
  return n;
}

