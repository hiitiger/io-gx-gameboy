import { RamSize } from "./specs.js";
import { Cartridge } from "./cartridge.js";

export class Memory {
  data: Uint8Array = new Uint8Array(RamSize);

  rom: Cartridge;

  public load(addr: number, data: Uint8Array) {
    this.data.set(data, addr);
  }

  public loadRom(rom: Cartridge) {
    this.rom = rom;
  }

  public readByte(addr: number) {
    if (addr < 0 || addr >= RamSize) {
      throw new Error("out of bounds");
    }

    return this.data[addr];
  }

  public readWord(addr: number) {
    const low = this.readByte(addr);
    const high = this.readByte(addr + 1);
    return (high << 8) + low;
  }

  public writeByte( addr: number, value: number,) {}

  public writeWord( addr: number, value: number,) {}
}
