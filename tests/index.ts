// eslint-disable-next-line no-unused-vars
import miua, { genOptions } from '../src';
import YAML from 'yaml';

const gen = (s: string, opt?: genOptions) => miua.gen(YAML.parse(s), opt);

describe('test miua', () => {
  it('', () => {
    let r;
    r = gen(
      `
    code: NO serial
    data|10:
      id: NO serial|1
      uuid: string|8|toUpperCase - string|4|toUpperCase - string|4|toUpperCase - string|4|toUpperCase - string|12|toUpperCase
      payload: string|20
      success: boolean
        `,
      { variables: { id: '111' } },
    );
    expect(r.code.length).toEqual(3);
    expect(r.data.length).toEqual(10);
    expect(r.data[0].id).toEqual(r.code);
    expect(r.data[0].payload.length).toEqual(20);
    const uuidLen = [8, 4, 4, 4, 12];
    expect(r.data[0].uuid.split('-').map((v: any) => v.length)).toEqual(
      uuidLen,
    );

    r = gen(
      `
    data: number|10
        `,
      { length: 10 },
    );
    expect(r.length).toEqual(10);
    expect(r.filter((v: any) => v.data > 10 ** 8).length).toEqual(10);

    r = gen(`
    success|10: boolean|2
        `);
    expect(r.success.length).toEqual(10);
    expect(r.success.filter(Boolean).length).toEqual(10);

    r = gen(
      `
    data: $data
    `,
      { variables: { data: 1 } },
    );
    expect(r.data).toEqual(1);

    r = gen(`
data|2:
  list|2: serial
    `);
    expect(r.data.length).toEqual(2);
    r.data.forEach((row: any) => {
      expect(row.list).toEqual([1, 2]);
    });

    r = gen(`
data|: number|10
    `);
    expect(r.data.length).toEqual(1);

    r = gen(`
data: 11  aa
    `);
    expect(r.data).toEqual('11 aa');

    r = gen(`
data: $data
    `);
    expect(r.data).toEqual(null);

    r = gen(`
id: string|8|toUpperCase - string|4|toUpperCase - string|4|toUpperCase - string|4|toUpperCase - string|12|toUpperCase
    `);
    expect(r.id.split('-').map((v: any) => v.length)).toEqual([8, 4, 4, 4, 12]);

    r = gen(`
id: number||Boolean
    `);
    expect(!!r.id).toEqual(true);
  });
});
