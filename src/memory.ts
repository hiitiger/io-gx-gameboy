import { RamSize, BiosSize } from "./specs.js";
import { Cartridge } from "./cartridge.js";

export class Memory {
  private inboot: boolean = true;
  data: Uint8Array = new Uint8Array(RamSize);
  rom: Cartridge;

  public load(addr: number, data: Uint8Array) {
    this.data.set(data, addr);
  }

  public loadRom(rom: Cartridge) {
    this.rom = rom;
  }

  public readByte(addr: number) {
    if (addr < 0 || addr > RamSize) {
      throw new Error("out of bounds");
    }

    if (this.inboot) {
      if (addr < BiosSize) {
        return this.data[addr];
      } else {
        this.inboot = false;
      }
    }

    return this.rom.readByte(addr);
  }

  public readWord(addr: number) {
    const low = this.readByte(addr);
    const high = this.readByte(addr + 1);
    return (high << 8) + low;
  }

  public writeByte(addr: number, value: number) {
  
  }

  public writeWord(addr: number, value: number) {
    this.writeByte(addr, value & 0xff);
    this.writeByte((addr + 1) & 0xffff, value >> 8);
  }
}
