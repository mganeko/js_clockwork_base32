// javascript implementation for Clockwork Base32
//
// -- refer ---
// https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8
// https://medium.com/shiguredo/base32-の変種を作った話-d8da2e3102ec
// https://github.com/szktty/go-clockwork-base32
// ----------

export { encode32, encode32str, decode32, decode32str }

// -- double check with another bit operation logic ---
const _DOUBLE_CHECK = true;

/**
 * バイト列(Uint8Array)を受け取り、clockwork base32 エンコーディングした文字列を返します
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

  // const newArr = _splitBytesBy5bits(arr);
  // let str = '';
  // newArr.forEach(b => { str += _encodeByte(b) });
  // return str;
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

  let decodedArray = [];
  const buffer = array5bits.buffer;
  const step = 8;
  for (let offset = 0; offset < arr.length; offset += step) {
    const chunkArray = new Uint8Array(buffer, offset, Math.min((arr.length - offset), step));
    //const arr8 = _pack5bitArrayAs8bitArray(chunkArray);
    const arr8 = _pack5bitsArrayAsBytes(chunkArray);

    if (_DOUBLE_CHECK) {
      //const anotherArr = _pack5bitsArrayAsBytes(chunkArray);
      const anotherArr = _pack5bitArrayAs8bitArray(chunkArray);
      console.log('arr8=', arr8);
      console.log('anonter=', anotherArr);
      const check = _compareAarray(anotherArr, arr8);
      if (!check) {
        throw "_pack5bitArrayAs8bitArray double check ERROR";
      }
    }

    decodedArray = decodedArray.concat(arr8);
  }

  //const decodedArray = _pack5bitsArrayAsBytes(array5bits);

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

function _encode5bytesArray(arr) {
  //const newArr1 = _split5bytesBy5bits(arr);
  //console.log('newArr1:', newArr1);

  const newArr = _splitBytesBy5bits(arr);
  //console.log('newArr:', newArr1);

  if (_DOUBLE_CHECK) {
    const newArr1 = _split5bytesBy5bits(arr);
    const check = _compareAarray(newArr, newArr1);
    if (!check) {
      throw "_encode5bytesArray double check ERROR";
    }
  }

  let str = '';
  newArr.forEach(b => { str += _encodeByte(b) });
  return str;
}

// split 8bit-5bytes --> 5bit-8bytes
//  5 --> 8 
//  4 --> 7
//  3 --> 5
//  2 --> 4
//  1 --> 2
//  0 --> 0
function _split5bytesBy5bits(arr) {
  const len = arr.length;
  // if (len > 5) {
  //   console.warn('WARN: _split5bytesBy5bits() more than 5 bytes, cut 5 bytes only')
  // }
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

  // --- double check with another logic ---
  if (_DOUBLE_CHECK) {
    _dubleCheckSplit(r0, r1, r2, r3, r4, r5, r6, r7, b0, b1, b2, b3, b4);
  }

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
    newArr = new Uint8Array([]);
  }

  return newArr;
}

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

function _compareAarray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    console.error('compeareAarray length not same %d !== %d', arr1.length, arr2.length);
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      console.error('compeareAarray arr1[%d]=%d arr2[%d]=%d, NOT SAME', i, arr1[i], i, arr2[i]);
      return false;
    }
  }

  return true;
}

function _dubleCheckSplit(r0, r1, r2, r3, r4, r5, r6, r7, b0, b1, b2, b3, b4) {
  const arr = _split40bitsByStr(b0, b1, b2, b3, b4);
  if (arr[0] !== r0) {
    throw 'r0 not same';
  }
  if (arr[1] !== r1) {
    throw 'r1 not same';
  }
  if (arr[2] !== r2) {
    throw 'r2 not same';
  }
  if (arr[3] !== r3) {
    throw 'r3 not same';
  }
  if (arr[4] !== r4) {
    throw 'r4 not same';
  }
  if (arr[5] !== r5) {
    throw 'r5 not same';
  }
  if (arr[6] !== r6) {
    throw 'r6 not same';
  }
  if (arr[7] !== r7) {
    throw 'r7 not same';
  }

  return;
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


// pack  8bit-5bytes <-- 5bit-8bytes
//  5 <-- 8
//  4 <-- 7 
//  3 <-- 5
//  2 <-- 4
//  1 <-- 2
//  0 <-- 0
function _pack5bitArrayAs8bitArray(arr) {
  const len = arr.length;
  // if (len > 8) {
  //   console.warn('WARN: _pack5bitArrayAs8bitArray() more than 8 bytes, cut 8 bytes only')
  // }
  const b0 = (len > 0) ? arr[0] : 0;
  const b1 = (len > 1) ? arr[1] : 0;
  const b2 = (len > 2) ? arr[2] : 0;
  const b3 = (len > 3) ? arr[3] : 0;
  const b4 = (len > 4) ? arr[4] : 0;
  const b5 = (len > 5) ? arr[5] : 0;
  const b6 = (len > 6) ? arr[6] : 0;
  const b7 = (len > 7) ? arr[7] : 0;

  // --- pack by 8bits --> 5 bytes ---
  const r0 = ((b0 & 0b00011111) << 3) | ((b1 & 0b00011100) >> 2);
  const r1 = ((b1 & 0b00000011) << 6) | ((b2 & 0b00011111) << 1) | ((b3 & 0b00010000) >> 4);
  const r2 = ((b3 & 0b00001111) << 4) | ((b4 & 0b00011110) >> 1);
  const r3 = ((b4 & 0b00000001) << 7) | ((b5 & 0b00011111) << 2) | ((b6 & 0b00011000) >> 3);
  const r4 = ((b6 & 0b00000111) << 5) | (b7 & 0b00011111);

  // --- double check with another logic ---
  if (_DOUBLE_CHECK) {
    _dubleCheckPack(r0, r1, r2, r3, r4, b0, b1, b2, b3, b4, b5, b6, b7);
  }

  // --- pack to array ---
  let newArr = null;
  if (len >= 8) {
    newArr = [r0, r1, r2, r3, r4];
  }
  else if (len === 7) {
    newArr = [r0, r1, r2, r3];
  }
  else if (len === 6) {
    throw "BAD pack length:" + len;
  }
  else if (len === 5) {
    newArr = [r0, r1, r2];
  }
  else if (len === 4) {
    newArr = [r0, r1];
  }
  else if (len === 3) {
    throw "BAD pack length:" + len;
  }
  else if (len === 2) {
    newArr = [r0];
  }
  else if (len === 1) {
    throw "BAD pack length:" + len;
  }
  else {
    newArr = [];
  }

  return newArr;
}

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

function _dubleCheckPack(r0, r1, r2, r3, r4, b0, b1, b2, b3, b4, b5, b6, b7) {
  const arr = _pack40bitsByStr(b0, b1, b2, b3, b4, b5, b6, b7);
  if (arr[0] !== r0) {
    throw 'r0 not same';
  }
  if (arr[1] !== r1) {
    throw 'r1 not same';
  }
  if (arr[2] !== r2) {
    throw 'r2 not same';
  }
  if (arr[3] !== r3) {
    throw 'r3 not same';
  }
  if (arr[4] !== r4) {
    throw 'r4 not same';
  }

  return;
}

function _pack40bitsByStr(b0, b1, b2, b3, b4, b5, b6, b7) {
  let src = _byteTobitString(b0).substr(-5); // use only 5bits
  src += _byteTobitString(b1).substr(-5); // use only 5bits
  src += _byteTobitString(b2).substr(-5); // use only 5bits
  src += _byteTobitString(b3).substr(-5); // use only 5bits
  src += _byteTobitString(b4).substr(-5); // use only 5bits
  src += _byteTobitString(b5).substr(-5); // use only 5bits
  src += _byteTobitString(b6).substr(-5); // use only 5bits
  src += _byteTobitString(b7).substr(-5); // use only 5bits

  const arr = new Uint8Array(5);
  let i = 0;
  while (src.length > 0) {
    const chunk = src.substr(0, 8);
    const rest = src.substr(8);
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

