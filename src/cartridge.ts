import { RamSize } from "./specs.js";

export enum CartridgeType {
  ROM = 0x00,
  ROM_MBC1 = 0x01,
  ROM_MBC1_RAM = 0x02,
  ROM_MBC1_RAM_BATTERY = 0x03,
  ROM_MBC2 = 0x05,
  ROM_MBC2_BATTERY = 0x06,
  ROM_RAM = 0x08,
  ROM_RAM_BATTERY = 0x09,
  ROM_MMM01 = 0x0b,
  ROM_MMM01_SRAM = 0x0c,
  ROM_MMM01_SRAM_BATTERY = 0x0d,
  ROM_MBC3_TIMER_BATTERY = 0x0f,
  ROM_MBC3_TIMER_RAM_BATTERY = 0x10,
  ROM_MBC3 = 0x11,
  ROM_MBC3_RAM = 0x12,
  ROM_MBC3_RAM_BATTERY = 0x13,
  ROM_MBC5 = 0x19,
  ROM_MBC5_RAM = 0x1a,
  ROM_MBC5_RAM_BATTERY = 0x01b,
  ROM_MBC5_RUMBLE = 0x1c,
  ROM_MBC5_RUMBLE_SRAM = 0x1d,
  ROM_MBC5_RUMBLE_SRAM_BATTERY = 0x1e
}

export function getCatridgeType(data: Uint8Array) {
  return CartridgeType[data[0x147]];
}

export class Cartridge {
  public data: Uint8Array;
  public type: string;

  constructor(data: Uint8Array) {
    this.data = data;
    this.type = getCatridgeType(data);
  }

  public readByte(addr: number) {
    if (addr < 0 || addr > RamSize) {
      throw new Error("out of bounds");
    }

    return this.data[addr];
  }
}
