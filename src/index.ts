import { randomString, randomNumber } from './util';

export interface genOptions {
  length?: number;
  variables?: any;
}

type IdentType = 'string' | 'boolean' | 'number' | 'serial';

type Ident = [IdentType, number, string];

let path: string[] = [];
const state = {
  serial: {} as any,
  lastSerialPath: '',
};

export function gen(src: any, rawOpts: genOptions = {}) {
  path = [];
  state.serial = {};

  const opts = Object.assign({}, { variables: {} }, rawOpts);
  const result: any[] = [];
  const length = opts.length || 1;
  for (let i = 0; i < length; i++) {
    result.push(rawGen(src, opts));
  }

  if (opts.length) return result;
  return result.pop();
}

function rawGen(src: any, opts: genOptions) {
  let result: any;
  if (typeof src === 'object') {
    result = {};
    for (const key in src) {
      path.push(key);
      const keyTokens = key.split('|');
      if (keyTokens[1] !== void 0) {
        const tmp = [];
        for (let i = 0; i < (Number(keyTokens[1]) || 1); i++) {
          tmp.push(rawGen(src[key], opts));
        }
        delete state.serial[state.lastSerialPath];
        result[keyTokens[0]] = tmp;
      } else {
        result[key] = rawGen(src[key], opts);
      }
      path.pop();
    }
    return result;
  }

  result = src
    .toString()
    .split(' ')
    .map((v: any) => parseIdent(v, opts))
    .join('');

  // parse number
  if (!isNaN(Number(result))) result = Number(result);

  // parse boolean and null
  if (result === 'true' || result === 'false' || result === 'null') {
    result = JSON.parse(result);
  }

  return result;
}

function parseIdent(ident: string, opts: genOptions) {
  if (ident === '') return ' ';

  const tokens: Ident = ident.split('|') as any;

  let [type, length, fn] = tokens,
    variables = opts.variables;

  if ((length as any) === '' || isNaN(Number(length))) {
    length = 1;
  }

  // if ident not match all rules, just return type
  let result: any = type;

  // parse variables
  // Important: return `null` string because return `null` will disappear
  // when string array join
  if (type[0] === '$') {
    result = variables[type.slice(1)] || 'null';
  }

  if (type === 'boolean') {
    const map: any = { 2: true, 3: false };
    result = length in map ? map[length] : Math.random() > 0.5;
  }

  if (type === 'number') {
    result = randomNumber(length);
  }

  if (type === 'string') {
    result = randomString(length);
  }

  if (type === 'serial') {
    const key = path.join('-');
    result = state.serial[key] || length;
    state.serial[key] = result + 1;
    state.lastSerialPath = key;
  }

  try {
    if (fn) {
      if ((global as any)[fn]) result = (global as any)[fn](result);
      if (result[fn]) result = result[fn]();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return result;
}

export default { gen };
