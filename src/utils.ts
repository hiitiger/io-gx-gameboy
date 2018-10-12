export function h2i(h: string) {
  return parseInt(h, 16);
}

export function opcodeHex(i: number) {
  return "0x" + ("00" + i.toString(16).toUpperCase()).slice(-2);
}

export function b2b(v: number) {
  return ("0".repeat(8) + v.toString(2)).slice(-8);
}

export function w2b(v: number) {
  return ("0".repeat(16) + v.toString(2)).slice(-16);
}

export function b2h(v: number) {
  return ("00" + v.toString(16).toUpperCase()).slice(-2);
}

export function w2h(v: number) {
  return ("0000" + v.toString(16).toUpperCase()).slice(-4);
}

export function toTable(arr: any[], size: number) {
  const res = [];
  for (var i = 0; i < arr.length; i = i + size)
    res.push(arr.slice(i, i + size));
  return res;
}

export function buf2hexArray(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map(x =>
    ("00" + x.toString(16).toUpperCase()).slice(-2)
  );
}

export function logBuffer(data: Uint8Array) {
  const buffer = data.buffer;
  console.table(toTable(buf2hexArray(buffer), 8));
}

