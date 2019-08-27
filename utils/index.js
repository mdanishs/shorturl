import { BASE_DIGITS } from "../constants";

export const validURL = (url) => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(url);
}

export const toBase62 = (n) => {
  if (n === 0) {
    return '0';
  }
  var result = '';
  while (n > 0) {
    result = BASE_DIGITS[n % BASE_DIGITS.length] + result;
    n = parseInt(n / BASE_DIGITS.length, 10);
  }
  return result;
}

export const fromBase62 = (s) => {
  var result = 0;
  for (var i = 0; i < s.length; i++) {
    var p = BASE_DIGITS.indexOf(s[i]);
    if (p < 0) {
      return NaN;
    }
    result += p * Math.pow(BASE_DIGITS.length, s.length - i - 1);
  }
  return result;
}