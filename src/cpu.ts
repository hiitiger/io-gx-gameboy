import { Memory } from "./memory.js";
import { Cartridge } from "./cartridge.js";
import { h2i, w2h, b2b, opcodeHex, b2h } from "./utils.js";
import { FLAGOFFSETS } from "./specs.js";
import { OpcodeTable, EXT_OpcodeTable } from "./opcodes.js";
import { Register, Registers } from "./register.js";
import * as logger from "./logger.js";

function trimRegAddr(s: string) {
  return s.replace(/[\\(\\)]/g, "");
}

export class Cpu {
  private mem: Memory;
  private rom: Cartridge;

  private registers: Registers;

  constructor(mem: Memory, rom: Cartridge) {
    this.mem = mem;
    this.rom = rom;
    this.registers = new Registers();
    this.registers.reset();
  }

  public printReg() {
    logger.log(`AF: ${w2h(this.registers.AF)}`);
    logger.log(`BC: ${w2h(this.registers.BC)}`);
    logger.log(`DE: ${w2h(this.registers.DE)}`);
    logger.log(`HL: ${w2h(this.registers.HL)}`);
    logger.log(`SP: ${w2h(this.registers.SP)}`);
    logger.log(`PC: ${w2h(this.registers.PC)}`);
    logger.log(`FLAG: ${b2b(this.registers.F)}`);
  }

  public init() {
    this.registers.PC = 0;
    this.registers.F = h2i("B0");
    this.writeReg16bit("SP", h2i("0000"));
    this.writeReg16bit("AF", h2i("0001"));
    this.writeReg16bit("BC", h2i("0013"));
    this.writeReg16bit("DE", h2i("00D8"));
    this.writeReg16bit("HL", h2i("014D"));
  }

  public reset() {
    this.registers.reset();
  }

  public tick() {
    this.excute_next_opcode();
  }

  public excute_next_opcode() {
    const opcode = this.cpu_mem8bitRead();
    logger.log(`opcode: ${opcodeHex(opcode)}`);

    const instruction = OpcodeTable[opcodeHex(opcode)];

    const cpu = this;
    instruction.fn(cpu);
  }

  public excute_ext_opcode() {
    const opcode = this.cpu_mem8bitRead();
    logger.log(`opcode: ${opcodeHex(opcode)}`);

    const instruction = EXT_OpcodeTable[opcodeHex(opcode)];

    const cpu = this;
    instruction.fn(cpu);
  }

  public SWAP_n(reg: string) {
    if (reg === "(HL)") {
    } else {
      let value = this.readReg8bit(reg);
      value = ((value & 0xf0) >> 4) | ((value & 0x0f) << 4);
      this.writeReg8bit(reg, value);
      this.resetFlags();
      if (value === 0) {
        this.setFlag("Z");
      }
    }
  }

  public LD_nn_n(reg: string) {
    this.cpu_reg8bitLoad(reg);
  }

  public LD_r1_r2(r1: string, r2: string) {
    if (r1 === "(HL)") {
      if (r2 === "n") {
        this.mem.writeByte(this.registers.HL, this.cpu_mem8bitRead());
      } else {
        this.mem.writeByte(this.registers.HL, this.readReg8bit(r2));
      }
    } else if (r2 === "(HL)") {
      this.cpu_reg8bitLoadMem(r1, this.readReg16bit("HL"));
    } else {
      this.cpu_reg8bitLoadReg(r1, r2);
    }
  }

  public LD_A_n(a: string) {
    if (a.startsWith("(")) {
      if (a === "(BC)" || a === "(DE)" || a === "(HL)") {
        this.cpu_reg8bitLoadMem("A", this.readReg16bit(trimRegAddr(a)));
      } else if (a === "(nn)") {
        this.cpu_reg8bitLoadMem(
          "A",
          this.mem.readByte(this.cpu_mem16bitRead())
        );
      }
    } else if (a === "#") {
      this.cpu_reg8bitLoadMem("A", this.cpu_mem8bitRead());
    }
  }

  public LD_n_A(a: string) {
    if (a === "(BC)" || a === "(DE)" || a === "(HL)") {
      this.mem.writeByte(
        this.readReg16bit(trimRegAddr(a)),
        this.readReg8bit("A")
      );
    } else if (a === "(nn)") {
      this.mem.writeByte(this.cpu_mem16bitRead(), this.readReg8bit("A"));
    }
  }

  //16bit load
  public LD_n_nn(reg: string) {
    this.cpu_reg16bitLoad(reg);
  }

  public XOR_n(reg: string) {
    if (reg === "(HL)") {
    } else if (reg === "*") {
    } else {
      this.writeReg8bit("A", this.readReg8bit("A") ^ this.readReg8bit(reg));
      this.resetFlags();
      if (this.readReg8bit("A") === 0) {
        this.setFlag("Z");
      }
    }
  }

  public LDD_HL_A() {
    this.mem.writeByte(
      this.mem.readWord(this.readReg16bit("HL")),
      this.readReg8bit("A")
    );

    this.writeReg16bit("HL", this.readReg16bit("HL") - 1);
  }

  public cpu_mem8bitRead() {
    const value = this.mem.readByte(this.registers.PC);
    this.registers.PC += 1;
    return value;
  }

  public cpu_mem16bitRead() {
    const value = this.mem.readWord(this.registers.PC);
    this.registers.PC += 2;
    return value;
  }

  public cpu_mem8bitWrite(value: number) {
    this.mem.writeWord(this.registers.PC, value);
    this.registers.PC += 1;
  }

  public cpu_mem16bitWrite(value: number) {
    this.mem.writeWord(this.registers.PC, value);
    this.registers.PC += 2;
  }

  public cpu_reg8bitLoad(r1: string) {
    this.writeReg8bit(r1, this.cpu_mem8bitRead());
  }

  public cpu_reg8bitLoadReg(r1: string, r2: string) {
    this.writeReg8bit(r1, this.readReg8bit(r2));
  }

  public cpu_reg8bitLoadMem(r1: string, addr: number) {
    this.writeReg8bit(r1, this.mem.readByte(addr));
  }

  public cpu_reg16bitLoad(r1: string) {
    const value = this.cpu_mem16bitRead();
    this.writeReg16bit(r1, value);
  }

  public readFlag(name: string) {
    return this.registers.F & FLAGOFFSETS[name];
  }

  public setFlag(name: string) {
    this.registers.F = this.registers.F | FLAGOFFSETS[name];
  }

  public resetFlag(name: string) {
    this.registers.F = this.registers.F & ~FLAGOFFSETS[name];
  }

  public resetFlags() {
    this.registers.F = 0;
  }

  public writeReg8bit(name: string, val: number) {
    const reg8bitWrite = {
      A: v => (this.registers.A = v),
      B: v => (this.registers.B = v),
      C: v => (this.registers.C = v),
      D: v => (this.registers.D = v),
      E: v => (this.registers.E = v),
      H: v => (this.registers.H = v),
      L: v => (this.registers.L = v),

      F: v => (this.registers.FLAG = v)
    };

    reg8bitWrite[name](val);
  }

  public readReg8bit(name: string) {
    const reg8bitRead = {
      A: () => this.registers.A,
      B: () => this.registers.B,
      C: () => this.registers.C,
      D: () => this.registers.D,
      E: () => this.registers.E,
      H: () => this.registers.H,
      L: () => this.registers.L,

      F: () => this.registers.FLAG
    };

    return reg8bitRead[name]();
  }

  public writeReg16bit(name: string, val: number) {
    const reg16bitWrite = {
      AF: v => (this.registers.AF = v),
      BC: v => (this.registers.BC = v),
      DE: v => (this.registers.DE = v),
      HL: v => (this.registers.HL = v),
      SP: v => (this.registers.SP = v)
    };

    reg16bitWrite[name](val);
  }

  public readReg16bit(name: string) {
    const reg16bitRead = {
      AF: () => this.registers.AF,
      BC: () => this.registers.BC,
      DE: () => this.registers.DE,
      HL: () => this.registers.HL
    };

    return reg16bitRead[name]();
  }
}
