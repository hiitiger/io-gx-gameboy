import { VRamSize, VRamOffset, OAMffset, OAMSize } from "./specs.js";

export class Gpu {
  public vram: Uint8Array;
  public oam: Uint8Array;
  constructor() {
    this.vram = new Uint8Array(VRamSize);
    this.oam = new Uint8Array(OAMSize);
  }

  public readByte(addr: number) {
    if (addr >= VRamOffset && addr < VRamOffset + VRamSize) {
      return this.vram[addr];
    } else if (addr >= OAMffset && addr < OAMffset + OAMSize) {
      return this.oam[addr];
    } else {
      throw new Error("invalid read addr");
    }
  }
}
