import { RamSize, BiosSize } from "./specs.js";
import { Cartridge } from "./cartridge.js";
import * as logger from "./logger.js";
import { Gpu } from "./gpu.js";

export class MMU {
  bios: Uint8Array;
  ram: Uint8Array = new Uint8Array(RamSize);
  rom: Cartridge;
  gpu: Gpu;


  public loadBios(data: Uint8Array) {
    this.bios = data;
  }

  public loadGpu(gpu: Gpu) {
    this.gpu = gpu;
  }

  public loadRom(rom: Cartridge) {
    this.rom = rom;
  }

  public readByte(addr: number) {
    if (addr < 0 || addr > RamSize) {
      throw new Error("out of bounds");
    }

    if (this.ram[0xff50] === 0) {
      if (addr <= 0xff) {
        return this.bios[addr];
      }
    }

    //Cartridge
    if (addr >= 0x0000 && addr <= 0x7fff) {
      return this.rom.readByte(addr);
    }
    //Cartridge
    else if (addr >= 0xa000 && addr <= 0xbfff) {
      return this.rom.readByte(addr);
    }
    //MMU ram
    else if (addr >= 0xc000 && addr <= 0xdfff) {
      return this.ram[addr];
    }
    //MMU ram mirror
    else if (addr >= 0xe000 && addr <= 0xfdff) {
      return this.ram[addr];
    }
    //GPU vram
    else if (addr >= 0x8000 && addr <= 0xbfff) {
      return this.gpu.readByte(addr);
    }
    //GPU sprite attribute table
    else if (addr >= 0xfe00 && addr <= 0xfe9f) {
      return this.gpu.readByte(addr);
    }
    //MMU
    else if (addr >= 0xfea0 && addr <= 0xfeff) {
      throw new Error("invalid read");
    }
    //joypad
    else if (addr === 0xff00) {
    }
    //Serial Data
    else if (addr >= 0xff01 && addr <= 0xff02) {
    }
    //Timer
    else if (addr >= 0xff04 && addr <= 0xff02) {
    }
    //Audio
    else if (addr >= 0xff10 && addr <= 0xff3f) {
    }
    //GPU LCD features
    else if (addr >= 0xff40 && addr < 0xff4c) {
      return this.gpu.readByte(addr);
    }
    else if (addr >= 0xff4e && addr < 0xff4f) {
      return this.gpu.readByte(addr);
    }
    else if (addr >= 0xff51 && addr < 0xff55) {
      return this.gpu.readByte(addr);
    }
    else if (addr >= 0xff57 && addr < 0xff6b) {
      return this.gpu.readByte(addr);
    }
    else if (addr >= 0xff6d && addr < 0xff6f) {
      return this.gpu.readByte(addr);
    }
    //boot flag
    else if (addr === 0xff50) {
      return this.ram[addr]
    }
    //MMU
    else if (addr >= 0xff80 && addr <= 0xfffe) {
      return this.ram[addr];
    } else if (addr === 0xffff) {
      return this.ram[addr];
    } else {
      throw new Error("invalid read addr");
    }
  }

  public readWord(addr: number) {
    const low = this.readByte(addr);
    const high = this.readByte(addr + 1);
    return (high << 8) + low;
  }

  public writeByte(addr: number, value: number) {
    if (addr < 0 || addr > RamSize) {
      throw new Error("out of bounds");
    }

    if (this.ram[0xff50] === 0) {
      if (addr <= 0xff) {
        logger.error(`write to address 0x${addr.toString(16)}`);
        return;
      }
    }

    //Cartridge
    if (addr >= 0x0000 && addr <= 0x7fff) {
      this.rom.writeByte(addr, value);
    }
    //Cartridge
    else if (addr >= 0xa000 && addr <= 0xbfff) {
      this.rom.writeByte(addr, value);
    }
    //MMU ram
    else if (addr >= 0xc000 && addr <= 0xdfff) {
      this.ram[addr] = value;
    }
    //MMU ram mirror
    else if (addr >= 0xe000 && addr <= 0xfdff) {
      this.ram[addr] = value;
      this.ram[addr - 0x2000] = value;
    }
    //GPU vram
    else if (addr >= 0x8000 && addr <= 0xbfff) {
      this.gpu.writeByte(addr, value);
    }
    //GPU sprite attribute table
    else if (addr >= 0xfe00 && addr <= 0xfe9f) {
      this.gpu.writeByte(addr, value);
    }
    //MMU
    else if (addr >= 0xfea0 && addr <= 0xfeff) {
      throw new Error("invalid read");
    }
    //joypad
    else if (addr === 0xff00) {
    }
    //Serial Data
    else if (addr >= 0xff01 && addr <= 0xff02) {
    }
    //Timer
    else if (addr >= 0xff04 && addr <= 0xff02) {
    }
    //Audio
    else if (addr >= 0xff10 && addr <= 0xff3f) {
    }
    //GPU LCD features
    else if (addr >= 0xff40 && addr < 0xff4c) {
      this.gpu.writeByte(addr, value);
    }
    else if (addr >= 0xff4e && addr < 0xff4f) {
      this.gpu.writeByte(addr, value);
    }
    else if (addr >= 0xff51 && addr < 0xff55) {
      this.gpu.writeByte(addr, value);
    }
    else if (addr >= 0xff57 && addr < 0xff6b) {
      this.gpu.writeByte(addr, value);
    }
    else if (addr >= 0xff6d && addr < 0xff6f) {
      this.gpu.writeByte(addr, value);
    }
    else if (addr === 0xff50) {
      this.ram[addr] = value
      debugger
    }
    //MMU
    else if (addr >= 0xff80 && addr <= 0xfffe) {
      this.ram[addr] = value;
    } else if (addr === 0xffff) {
      this.ram[addr] = value;
    } else {
      throw new Error("invalid read addr");
    }
  }

  public writeWord(addr: number, value: number) {
    this.writeByte(addr, value & 0xff);
    this.writeByte((addr + 1) & 0xffff, value >> 8);
  }
}
