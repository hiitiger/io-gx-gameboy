export function loadBinary(path: string): Promise<Uint8Array> {
    return fetch(path)
      .then(r => r.arrayBuffer())
      .then(buffer => new Uint8Array(buffer));
  }
  
  export function loadRom(name: string): Promise<Uint8Array> {
    return loadBinary(`roms/${name}.gb`);
  }
  
  export function loadBoot(): Promise<Uint8Array> {
    return loadBinary(`roms/bios.bin`);
  }
  