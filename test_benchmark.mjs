// test_base32.mjs
//  test base32.mjs with Node.js v12
//

import { encode32, encode32str, decode32, decode32str } from './js/base32.mjs';
//import { encode32, encode32str, decode32, decode32str } from './bak/base32_bak.mjs';

//import { testEncodeStr, testDecodeStr, testEncodeDecode, testEncodeDecodeArray } from './test_base32_util.mjs';


// =================

console.time('bench');

const arr = new Uint8Array([0, 0]);
//const arr = new Uint8Array([0, 0, 0, 0, 0]);
for (let ii = 0; ii <= 255; ii++) {
  for (let i = 0; i <= 255; i++) {
    arr[0] = i;
    for (let j = 0; j <= 255; j++) {
      arr[1] = j;
      const encoded = encode32(arr);
      const decoded = decode32(encoded);
    }
  }
}
console.timeEnd('bench');

// v1.0
// bench: 13581.801ms
// bench: 13560.301ms
// 5byte, 100x255x255 : bench: 7816.865ms

// v0.9
// bench: 21177.535ms
// bench: 21441.191ms
// 5byte, 100x255x255 : bench: 10716.648ms

// ---- exit ---
process.exit(0);
