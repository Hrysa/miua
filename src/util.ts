export function randomString(length: number) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let s = '';
  for (let i = 0; i < length; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export function randomNumber(length: number) {
  const list = [];
  for (let i = 0; i < 10; i++) {
    list.push(Math.random().toString().slice(2));
  }
  return Number(list.join('').replace(/0/g, '').slice(0, length));
}
