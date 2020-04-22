/**
 * Turn normal string into hex string
 * @param str Normal string
 */
export function str2hexstr(str: string) {
  return ab2hexstring(str2ab(str));
};

/**
 * Turn normal string into ArrayBuffer
 * @param str Normal string
 */
export function str2ab(str: string) {
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
export function ab2hexstring(arr: any): string {
  let result: string = '';
  const uint8Arr: Uint8Array = new Uint8Array(arr);
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
