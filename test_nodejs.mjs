// test_base32.mjs
//  test base32.mjs with Node.js v12
//

//import { encode32, encode32str, decode32, decode32str } from './js/base32.mjs';
import { testEncodeStr, testDecodeStr, testEncodeDecode, testEncodeDecodeArray } from './test_base32_util.mjs';

// =================

let erros = 0;
let cases = 0;
console.log('----test encode-----');
erros += testEncodeStr('', ''); cases++;
erros += testEncodeStr('fooba', 'CSQPYRK1'); cases++;
erros += testEncodeStr('foobar', 'CSQPYRK1E8'); cases++;
erros += testEncodeStr('Hello, world!', '91JPRV3F5GG7EVVJDHJ22'); cases++;
erros += testEncodeStr('The quick brown fox jumps over the lazy dog.', 'AHM6A83HENMP6TS0C9S6YXVE41K6YY10D9TPTW3K41QQCSBJ41T6GS90DHGQMY90CHQPEBG'); cases++;
erros += testEncodeStr('Wow, it really works!', 'AXQQEB10D5T20WK5C5P6RY90EXQQ4TVK44'); cases++;

console.log('----test decode-----');
erros += testDecodeStr('', ''); cases++;
erros += testDecodeStr('fooba', 'CSQPYRK1'); cases++;
erros += testDecodeStr('foobar', 'CSQPYRK1E8'); cases++;
erros += testDecodeStr('Hello, world!', '91JPRV3F5GG7EVVJDHJ22'); cases++;
erros += testDecodeStr('The quick brown fox jumps over the lazy dog.', 'AHM6A83HENMP6TS0C9S6YXVE41K6YY10D9TPTW3K41QQCSBJ41T6GS90DHGQMY90CHQPEBG'); cases++;
erros += testDecodeStr('Wow, it really works!', 'AXQQEB10D5T20WK5C5P6RY90EXQQ4TVK44'); cases++;

console.log('----test string-----');
erros += testEncodeDecode(''); cases++;
erros += testEncodeDecode('A'); cases++;
erros += testEncodeDecode('abc'); cases++;
erros += testEncodeDecode('fooba'); cases++;
erros += testEncodeDecode('foobar'); cases++;
erros += testEncodeDecode('Hello, mjs world!'); cases++;
erros += testEncodeDecode('this is clockwork base32'); cases++;


console.log('----test array-----');
erros += testEncodeDecodeArray(new Uint8Array([])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1, 2])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1, 2, 3])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1, 2, 3, 4])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1, 2, 3, 4, 5])); cases++;
erros += testEncodeDecodeArray(new Uint8Array([1, 2, 3, 4, 5, 6])); cases++;

// --- report ---
console.log('--- total errors=%d/cases=%s ---', erros, cases);

// ---- exit ---
if (erros > 0) {
  process.exit(1);
}