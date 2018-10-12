
export function toTable(arr: any[], size: number) {
  const res = [];
  for (var i = 0; i < arr.length; i = i + size)
    res.push(arr.slice(i, i + size));
  return res;
}

export function buf2hexArray(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map(x =>
    ("00" + x.toString(16)).slice(-2)
  );
}

export function logBuffer(data: Uint8Array) {
  const buffer = data.buffer;
  console.table(toTable(buf2hexArray(buffer), 8));
}
