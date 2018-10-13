import { Memory } from "./memory.js";
import { Cartridge } from "./cartridge.js";
import { h2i, w2h, b2b, opcodeHex, b2h } from "./utils.js";
import { FLAGOFFSETS } from "./specs.js";
import { Register, Registers } from "./register.js";
import * as logger from "./logger.js";
import { buildOpMap, IOpcodeDescription, buildCBOpMap } from "./ops/index.js";

function trimRegAddr(s: string) {
  return s.replace(/[\\(\\)]/g, "");
}

export class Cpu {
  private mem: Memory;
  private registers: Registers;
  private cycles: number;
  private ops: IOpcodeDescription[];
  private cbops: IOpcodeDescription[];

  constructor(mem: Memory) {
    this.cycles = 0;
    this.mem = mem;
    this.registers = new Registers();
    this.reset();
    this.ops = new Array(0xff).fill(null);
    this.cbops = new Array(0xff).fill(null);
    buildOpMap(this.ops);
    buildCBOpMap(this.cbops);
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
    this.cycles = 0;
    this.registers.reset();
  }

  public tick() {
    const cyclesPerFrame = 70224;
    while (this.cycles < cyclesPerFrame) {
      this.excute_next_opcode();
      // this.printReg();

      logger.log(`this.cycles ${this.cycles}`);
    }

    this.cycles -= cyclesPerFrame;
  }

  public excute_next_opcode() {
    const opcode = this.cpu_mem8bitRead();
    logger.log(`PC:${this.registers.PC}, opcode: ${opcodeHex(opcode)}`);

    if (opcode === 0xcb) {
      this.excute_ext_opcode();
    } else {
      const instruction = this.ops[opcode];

      const cpu = this;
      instruction.fn(cpu);
    }
  }

  public excute_ext_opcode() {
    const opcode = this.cpu_mem8bitRead();
    logger.log(`PC:${this.registers.PC}, exopcode: ${opcodeHex(opcode)}`);

    const instruction = this.cbops[opcode];

    const cpu = this;
    instruction.fn(cpu);
  }

  public NOOP() {
    this.cycles += 4;
  }

  public INC_r(r: string) {
    const value = (this.readReg8bit(r) + 1) & 0xff;
    this.writeReg8bit(r, value);

    this.registers.NF = false;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0xf) === 0;

    this.cycles += 4;
  }

  public INC_HL_() {
    const value = (this.readMemory8bit(this.registers.HL) + 1) & 0xff;
    this.writeMemory8bit(this.registers.HL, value);

    this.registers.NF = false;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0xf) === 0;
    this.cycles += 12;
  }

  public DEC_r(r: string) {
    const value = (this.readReg8bit(r) - 1) & 0xff;
    this.writeReg8bit(r, value);

    this.registers.NF = true;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0xf) === 0xf;

    this.cycles += 4;
  }

  public DEC_HL_() {
    const value = (this.readMemory8bit(this.registers.HL) - 1) & 0xff;
    this.writeMemory8bit(this.registers.HL, value);

    this.registers.NF = true;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0xf) === 0;
    this.cycles += 12;
  }

  public LD_rr_nn(rr: string) {
    this.writeReg16bit(rr, this.readMemory16bit(this.registers.PC));
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 12;
  }

  public LD_rr_rr(rr1: string, rr2: string) {
    this.writeReg16bit(rr1, this.readReg16bit(rr2));
    this.cycles += 8;
  }

  public LDHL_SP_n() {
    let value = (this.readMemory8bit(this.registers.PC) << 24) >> 24;
    this.registers.PC = (this.registers.PC + 1) & 0xffff;
    this.registers.HL = (this.registers.SP + value) & 0xffff;

    value = this.registers.SP ^ value ^ this.registers.HL;

    this.registers.ZF = false;
    this.registers.NF = false;
    this.registers.CF = (value & 0x100) === 0x100;
    this.registers.HF = (value & 0x10) === 0x10;
    this.cycles += 12;
  }

  public LD_nn_SP() {
    this.writeMemory16bit(
      this.readMemory16bit(this.registers.PC),
      this.registers.SP
    );
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 20;
  }

  public PUSH_rr(rr: string) {
    const value = this.readReg16bit(rr);
    this.registers.SP = this.registers.SP - 1;
    this.writeMemory8bit(this.registers.SP, value >> 8);
    this.registers.SP = this.registers.SP - 1;
    this.writeMemory8bit(this.registers.SP, value & 0xff);
    this.cycles += 16;
  }

  public POP_rr(rr: string) {
    const value = this.readMemory16bit(this.registers.SP);
    this.registers.SP = this.registers.SP + 2;
    this.writeReg16bit(rr, value);
    this.cycles += 12;
  }

  public ADD_A_r(r: string) {
    const oldValue = this.registers.A;
    const addValue = this.readReg8bit(r);
    const value = this.registers.A + addValue;
    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) > 0xf;
    this.registers.CF = value > 0xff;
    this.cycles += 4;
  }
  public ADD_A_HL_() {
    const oldValue = this.registers.A;
    const addValue = this.readMemory8bit(this.registers.HL);
    const value = this.registers.A + addValue;
    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 8;
  }
  public ADD_A_n() {
    const oldValue = this.registers.A;
    const addValue = this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;
    const value = this.registers.A + addValue;
    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 8;
  }

  public LD_BC_nn() {
    this.registers.BC = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 12;
  }

  public LD_DE_nn() {
    this.registers.DE = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 12;
  }

  public LD_HL_nn() {
    this.registers.HL = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 12;
  }

  public LD_SP_nn() {
    this.registers.SP = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 12;
  }

  public LD_BC_A() {
    this.writeMemory8bit(this.registers.BC, this.registers.A);
    this.cycles += 8;
  }

  public LD_DE_A() {
    this.writeMemory8bit(this.registers.DE, this.registers.A);
    this.cycles += 8;
  }

  public LD_nn_A() {
    this.writeMemory8bit(
      this.readMemory16bit(this.registers.PC),
      this.registers.A
    );
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 16;
  }

  public LD_A_0xFF00C_() {
    this.registers.A = this.readMemory8bit(this.registers.C + 0xff00);
    this.cycles += 8;
  }

  public LD_0xFF00C_A() {
    this.writeMemory8bit(this.registers.C + 0xff00, this.registers.A);
    this.cycles += 8;
  }

  public LD_0xFF00n_A() {
    this.writeMemory8bit(
      this.readMemory8bit(this.registers.PC) + 0xff00,
      this.registers.A
    );
    this.registers.PC = (this.registers.PC + 1) & 0xffff;
    this.cycles += 12;
  }

  public LD_A_0xFF00n_() {
    this.registers.A = this.readMemory8bit(
      this.readMemory8bit(this.registers.PC) + 0xff00
    );
    this.registers.PC = (this.registers.PC + 1) & 0xffff;
    this.cycles += 12;
  }

  public LDD_A_HL_() {
    this.registers.A = this.readMemory8bit(this.registers.HL);
    this.registers.HL = (this.registers.HL - 1) & 0xffff;
    this.cycles += 8;
  }

  public LDI_A_HL_() {
    this.registers.A = this.readMemory8bit(this.registers.HL);
    this.registers.HL = (this.registers.HL + 1) & 0xffff;
    this.cycles += 8;
  }

  public XOR_A() {
    this.registers.A = 0;
    this.registers.F = 0;
    this.registers.ZF = true;

    this.cycles += 4;
  }

  public LD_r_n(r: string) {
    this.writeReg8bit(r, this.readMemory8bit(this.registers.PC));
    this.registers.PC = (this.registers.PC + 1) & 0xffff;
    this.cycles += 8;
  }

  public LDA_rr_(rr: string) {
    this.registers.A = this.readMemory8bit(this.readReg16bit(rr));
    this.cycles += 8;
  }

  public LDA_nn_() {
    this.registers.A = this.readMemory8bit(
      this.readMemory16bit(this.registers.PC)
    );
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.cycles += 16;
  }

  public LDD_HL_A() {
    this.writeMemory8bit(this.registers.HL, this.registers.A);
    this.registers.HL = (this.registers.HL - 1) & 0xffff;
    this.cycles += 8;
  }

  public LDI_HL_A() {
    this.writeMemory8bit(this.registers.HL, this.registers.A);
    this.registers.HL = (this.registers.HL + 1) & 0xffff;
    this.cycles += 8;
  }

  public JR_CC_e(flag: string, cond: boolean) {
    if (this.readFlag(flag) === cond) {
      const add = (this.cpu_mem8bitRead() << 24) >> 24;
      this.registers.PC = (this.registers.PC + add) & 0xffff;
      this.cycles += 12;
    } else {
      this.registers.PC = (this.registers.PC + 1) & 0xffff;
      this.cycles += 8;
    }
  }

  public LD_r_r(r1: string, r2: string) {
    this.writeReg8bit(r1, this.readReg8bit(r2));
    this.cycles += 4;
  }

  public LD_r_HL_(r: string) {
    this.writeReg8bit(r, this.readMemory8bit(this.registers.HL));
    this.cycles += 8;
  }

  public LD_HL_r(r: string) {
    this.writeMemory8bit(this.registers.HL, this.readReg8bit(r));
    this.cycles += 8;
  }

  public LD_HL_n() {
    this.writeMemory8bit(
      this.registers.HL,
      this.readMemory8bit(this.registers.PC)
    );
    this.registers.PC += 1;
    this.cycles += 12;
  }

  public SWAP_r(r: string) {
    let value = this.readReg8bit(r);
    value = ((value & 0xf0) >> 4) | ((value & 0x0f) << 4);
    this.writeReg8bit(r, value);

    this.resetFlags();
    this.registers.ZF = value === 0;

    this.cycles += 8;
  }

  public SWAP_HL_() {
    let value = this.readMemory8bit(this.registers.HL);
    value = ((value & 0xf0) >> 4) | ((value & 0x0f) << 4);
    value = ((value & 0xf0) >> 4) | ((value & 0x0f) << 4);
    this.writeMemory8bit(this.registers.HL, value);

    this.resetFlags();
    this.registers.ZF = value === 0;

    this.cycles += 16;
  }

  public BIT_TEST(value: number, bit: number) {
    value = value & (1 << bit);

    this.registers.ZF = value === 0;
    this.registers.NF = false;
    this.registers.HF = false;
  }

  public BIT_b_r(reg: string, bit: number) {
    this.BIT_TEST(this.readReg8bit(reg), bit);
    this.cycles += 8;
  }

  public BIT_b_HL_(bit: number) {
    this.BIT_TEST(this.readMemory8bit(this.registers.HL), bit);
    this.cycles += 16;
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

  public readMemory8bit(addr: number) {
    return this.mem.readByte(addr);
  }

  public readMemory16bit(addr: number) {
    return this.mem.readWord(addr);
  }

  public writeMemory8bit(addr: number, val: number) {
    return this.mem.writeByte(addr, val);
  }

  public writeMemory16bit(addr: number, val: number) {
    return this.mem.writeWord(addr, val);
  }

  public readFlag(name: string) {
    return this.registers.F & FLAGOFFSETS[name] ? true : false;
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

  public readReg8bit(name: string): number {
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