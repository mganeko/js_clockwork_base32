// test_base32_util.mjs
//  test utility for test base32.mjs
//

import { encode32, encode32str, decode32, decode32str } from './js/base32.mjs';
export { testEncodeStr, testDecodeStr, testEncodeDecode, testEncodeDecodeArray }

function testEncodeStr(rowStr, encodedStr) {
  const encodeTry = encode32str(rowStr);
  const test = (encodeTry === encodedStr);
  console.assert(test, 'encode32str Error: "%s" --> "%s"(len=%d) !== "%s"(len=%d)', rowStr, encodeTry, encodeTry.length, encodedStr, encodedStr.length);

  if (test) {
    console.log('-PASS- ("%s", "%s")', rowStr, encodedStr);
    return 0; // OK
  }
  else {
    return 1; // ERROR
  }
}

function testDecodeStr(rowStr, encodedStr) {
  const decodeTry = decode32str(encodedStr);
  const test = (decodeTry === rowStr);
  console.assert(test, 'decode32str Error: "%s" --> "%s"(len=%d) !== "%s"(len=%d)', encodedStr, decodeTry, decodeTry.length, rowStr, rowStr.length);

  if (test) {
    console.log('-PASS- ("%s", "%s")', rowStr, encodedStr);
    return 0; // OK
  }
  else {
    return 1; // ERROR
  }
}


function testEncodeDecode(str) {
  const encodedStr = encode32str(str);
  const decodedStr = decode32str(encodedStr);
  const test = (str === decodedStr);
  console.assert(test, 'Encode-Decode Error: (%d) "%s"(len=%d) --> "%s"(len=%d)', (str === decodedStr), str, str.length, decodedStr, decodedStr.length);

  if (test) {
    console.log('-PASS- ("%s")', str);
    return 0; // OK
  }
  else {
    return 1; // ERROR
  }
}

function testEncodeDecodeArray(arr) {
  const encodedStr = encode32(arr);
  const decodedArr = decode32(encodedStr);
  const test = compareAarray(arr, decodedArr)
  console.assert(test, 'Encode-Decode Error:', arr, '-->', decodedArr);

  if (test) {
    console.log('-PASS-', arr);
    return 0; // OK
  }
  else {
    return 1; // ERROR
  }
}

//----- inner func ---
function compareAarray(arr1, arr2) {
  //console.log('---compareArray----');
  //console.log(arr1);
  //console.log(arr2);
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

