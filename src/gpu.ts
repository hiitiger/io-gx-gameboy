import * as logger from "./logger.js";

export class Gpu {
  public vram: Uint8Array;
  public oam: Uint8Array;

  public LcdControl: number; //0xff40
  public LcdStatus: number; //0xff41
  public ScrollY: number; //0xff42
  public ScrollX: number; //0xff43
  public Y: number; //0xff44
  public YCompare: number; //0xff45
  public WindowY: number; //0xff4a
  public WindowX: number; //0xff4b

  public BGPletteData: number; //0xff47
  public ObjectPalette0Data: number; //0xff48
  public ObjectPalette1Data: number; //0xff49

  public DMATransferAndStartAddr: number; //0xff46

  private lcdAddrFn: any;

  constructor() {
    this.vram = new Uint8Array(0x2000);
    this.oam = new Uint8Array(0xa0);

    this.LcdControl = 0;
    this.LcdStatus = 0;
    this.ScrollY = 0;
    this.ScrollX = 0;
    this.Y = 0;
    this.YCompare = 0;
    this.WindowY = 0;
    this.WindowX = 0;

    this.BGPletteData = 0;
    this.ObjectPalette0Data = 0;
    this.ObjectPalette1Data = 0;
    this.DMATransferAndStartAddr = 0;

    this.lcdAddrFn = {
      0xff40: {
        read: () => this.LcdControl,
        write: (val: number) => (this.LcdControl = val)
      },
      0xff41: {
        read: () => this.LcdStatus,
        write: (val: number) => (this.LcdStatus = val)
      },
      0xff42: {
        read: () => this.ScrollY,
        write: (val: number) => (this.ScrollY = val)
      },
      0xff43: {
        read: () => this.ScrollX,
        write: (val: number) => (this.ScrollX = val)
      },
      0xff44: {
        read: () => this.Y,
        write: (val: number) => (this.Y = val)
      },
      0xff45: {
        read: () => this.YCompare,
        write: (val: number) => (this.YCompare = val)
      },
      0xff4a: {
        read: () => this.WindowY,
        write: (val: number) => (this.WindowY = val)
      },
      0xff4b: {
        read: () => this.WindowX,
        write: (val: number) => (this.WindowX = val)
      },
      0xff47: {
        read: () => this.BGPletteData,
        write: (val: number) => (this.BGPletteData = val)
      },
      0xff48: {
        read: () => this.ObjectPalette0Data,
        write: (val: number) => (this.ObjectPalette0Data = val)
      },
      0xff49: {
        read: () => this.ObjectPalette1Data,
        write: (val: number) => (this.ObjectPalette1Data = val)
      },
      0xff46: {
        read: () => this.DMATransferAndStartAddr,
        write: (val: number) => (this.DMATransferAndStartAddr = val)
      }
    };
  }

  public readByte(addr: number) {
    if (addr >= 0x8000 && addr < 0x8000 + 0x2000) {
      return this.vram[addr];
    } else if (addr >= 0xfe00 && addr < 0xfe00 + 0xa0) {
      return this.oam[addr - 0xfe00];
    } else {
      const fn = this.lcdAddrFn[addr];
      if (fn) {
        return fn.read();
      } else {
        logger.error(`read from address 0x${addr.toString(16)}`);
      }
    }
  }

  public writeByte(addr: number, value: number) {
    if (addr >= 0x8000 && addr < 0x8000 + 0x2000) {
      this.vram[addr] = value;
    } else if (addr >= 0xfe00 && addr < 0xfe00 + 0xa0) {
      this.oam[addr - 0xfe00] = value;
    } else {
      const fn = this.lcdAddrFn[addr];
      if (fn) {
        fn.write(value);
      } else {
        logger.error(`write to address 0x${addr.toString(16)}`);
      }
    }
  }
}
