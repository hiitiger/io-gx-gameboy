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

  private halted: boolean = false;
  private IME: boolean = true;

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
    logger.debug(`AF: ${w2h(this.registers.AF)}`);
    logger.debug(`BC: ${w2h(this.registers.BC)}`);
    logger.debug(`DE: ${w2h(this.registers.DE)}`);
    logger.debug(`HL: ${w2h(this.registers.HL)}`);
    logger.debug(`SP: ${w2h(this.registers.SP)}`);
    logger.debug(`PC: ${w2h(this.registers.PC)}`);
    logger.debug(`FLAG: ${b2b(this.registers.F)}`);
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
    if (this.halted) {
      return;
    }

    while (this.cycles < cyclesPerFrame) {
      this.excute_next_opcode();
      // this.printReg();

      if (this.registers.PC > 256) {
        debugger;
      }
      logger.debug(`this.cycles ${this.cycles}`);
    }

    this.cycles -= cyclesPerFrame;
  }

  public excute_next_opcode() {
    const opcode = this.cpu_mem8bitRead();
    logger.debug(`PC:${this.registers.PC}, opcode: ${opcodeHex(opcode)}`);

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
    logger.debug(`PC:${this.registers.PC}, exopcode: ${opcodeHex(opcode)}`);

    const instruction = this.cbops[opcode];

    const cpu = this;
    instruction.fn(cpu);
  }

  public NOOP() {
    this.cycles += 4;
  }

  public JP_nn() {
    const value = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;
    this.registers.PC = value;
    this.cycles += 12;
  }

  public JP_CC_nn(flag: string, cond: boolean) {
    const value = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;

    if (this.readFlag(flag) === cond) {
      this.registers.PC = value;
      this.cycles += 16;
    } else {
      this.cycles += 12;
    }
  }

  public JP_HL() {
    this.registers.PC = this.registers.HL;
    this.cycles += 4;
  }

  public JR_n() {
    this.registers.PC =
      (this.registers.PC + this.readMemory8bit(this.registers.PC) + 1) & 0xffff;
    this.cycles += 8;
  }

  public CALL_nn() {
    const value = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;

    this.PUSH_16bit(this.registers.PC);
    this.registers.PC = value;

    this.cycles += 12;
  }

  public CALL_CC_nn(flag: string, cond: boolean) {
    const value = this.readMemory16bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 2) & 0xffff;

    if (this.readFlag(flag) === cond) {
      this.PUSH_16bit(this.registers.PC);
      this.registers.PC = value;
      this.cycles += 24;
    } else {
      this.cycles += 12;
    }
  }

  public INC_r(r: string) {
    const value = (this.readReg8bit(r) + 1) & 0xff;
    this.writeReg8bit(r, value & 0xff);

    this.registers.NF = false;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0x0f) === 0;

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
    this.registers.HF = (value & 0x0f) === 0x0f;

    this.cycles += 4;
  }

  public DEC_HL_() {
    const value = (this.readMemory8bit(this.registers.HL) - 1) & 0xff;
    this.writeMemory8bit(this.registers.HL, value);

    this.registers.NF = true;
    this.registers.ZF = value === 0;
    this.registers.HF = (value & 0x0f) === 0x0f;
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
    const addValue = (this.readMemory8bit(this.registers.PC) << 24) >> 24;
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    const value = this.registers.SP + addValue;
    this.registers.HL = value & 0xffff;

    this.registers.ZF = false;
    this.registers.NF = false;
    this.registers.CF =
      (((this.registers.SP & 0xff) + (addValue & 0xff)) & 0x100) !== 0;
    this.registers.HF =
      (((this.registers.SP & 0x0f) + (addValue & 0x0f)) & 0x10) !== 0;
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

  public PUSH_16bit(value: number) {
    this.registers.SP = this.registers.SP - 1;
    this.writeMemory8bit(this.registers.SP, value >> 8);
    this.registers.SP = this.registers.SP - 1;
    this.writeMemory8bit(this.registers.SP, value & 0xff);
  }

  public POP_8bit() {
    let value = this.readMemory8bit(this.registers.SP);
    value |= (this.readMemory8bit(this.registers.SP + 1) << 8) & 0xff;
    this.registers.SP = this.registers.SP + 2;
    return value;
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
    const value = oldValue + addValue;
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
    const value = oldValue + addValue;
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
    const value = oldValue + addValue;
    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 8;
  }

  public ADC_A_r(r: string) {
    const carry = this.readFlag("C") ? 1 : 0;
    const oldValue = this.registers.A;
    const addValue = this.readReg8bit(r);
    const value = oldValue + addValue + carry;
    this.registers.A = value & 0xff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) + carry > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 4;
  }

  public ADC_A_HL_() {
    const carry = this.readFlag("C") ? 1 : 0;
    const oldValue = this.registers.A;
    const addValue = this.readMemory8bit(this.registers.HL);
    const value = oldValue + addValue + carry;
    this.registers.A = value & 0xff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) + carry > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 8;
  }

  public ADC_A_n() {
    const carry = this.readFlag("C") ? 1 : 0;
    const oldValue = this.registers.A;
    const addValue = this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    const value = oldValue + addValue + carry;
    this.registers.A = value & 0xff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = (oldValue & 0xf) + (addValue & 0xf) + carry > 0xf;
    this.registers.CF = value > 0xff;

    this.cycles += 8;
  }

  public SUB_A_r(r: string) {
    const oldValue = this.registers.A;
    const subValue = this.readReg8bit(r);
    const value = oldValue - subValue;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) < (subValue & 0xf);
    this.registers.CF = value < 0;

    this.cycles += 4;
  }

  public SUB_A_HL_() {
    const oldValue = this.registers.A;
    const subValue = this.readMemory8bit(this.registers.HL);
    const value = oldValue - subValue;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) < (subValue & 0xf);
    this.registers.CF = value < 0;

    this.cycles += 8;
  }

  public SUB_A_n() {
    const oldValue = this.registers.A;
    const subValue = this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    const value = oldValue - subValue;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) < (subValue & 0xf);
    this.registers.CF = value < 0;

    this.cycles += 8;
  }

  public SBC_A_r(r: string) {
    const oldValue = this.registers.A;
    const subValue = this.readReg8bit(r);
    const carry = this.registers.CF ? 1 : 0;
    const value = oldValue - subValue - carry;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) - (subValue & 0xf) - carry < 0;
    this.registers.CF = value < 0;

    this.cycles += 4;
  }

  public SBC_A_HL_() {
    const oldValue = this.registers.A;
    const subValue = this.readMemory8bit(this.registers.HL);
    const carry = this.registers.CF ? 1 : 0;
    const value = oldValue - subValue - carry;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) - (subValue & 0xf) - carry < 0;
    this.registers.CF = value < 0;

    this.cycles += 8;
  }

  public SBC_A_n() {
    const oldValue = this.registers.A;
    const subValue = this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    const carry = this.registers.CF ? 1 : 0;
    const value = oldValue - subValue - carry;

    this.registers.A = value & 0xff;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = true;
    this.registers.HF = (oldValue & 0xf) - (subValue & 0xf) - carry < 0;
    this.registers.CF = value < 0;

    this.cycles += 8;
  }

  public AND_A_r(r: string) {
    this.registers.A = this.registers.A & this.readReg8bit(r);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = true;
    this.registers.CF = false;
    this.cycles += 4;
  }

  public AND_A_HL_() {
    this.registers.A =
      this.registers.A & this.readMemory8bit(this.registers.HL);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = true;
    this.registers.CF = false;
    this.cycles += 4;
  }

  public AND_A_n() {
    this.registers.A =
      this.registers.A & this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = true;
    this.registers.CF = false;
    this.cycles += 4;
  }

  public OR_A_r(r: string) {
    this.registers.A = this.registers.A | this.readReg8bit(r);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 4;
  }

  public OR_A_HL_() {
    this.registers.A =
      this.registers.A | this.readMemory8bit(this.registers.HL);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 8;
  }

  public OR_A_n() {
    this.registers.A =
      this.registers.A | this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 8;
  }

  public XOR_A_r(r: string) {
    this.registers.A = this.registers.A ^ this.readReg8bit(r);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 4;
  }

  public XOR_A_HL_() {
    this.registers.A =
      this.registers.A ^ this.readMemory8bit(this.registers.HL);

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 8;
  }

  public XOR_A_n() {
    this.registers.A =
      this.registers.A ^ this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = false;
    this.cycles += 8;
  }

  public CP_r(r: string) {
    const subValue = this.readReg8bit(r);
    const value = this.registers.A - subValue;

    this.registers.ZF = value === 0;
    this.registers.NF = false;
    this.registers.HF = (this.registers.A & 0x0f) < (subValue & 0x0f);
    this.registers.CF = value < 0;
    this.cycles += 4;
  }

  public CP_HL_() {
    const subValue = this.readMemory8bit(this.registers.HL);
    const value = this.registers.A - subValue;

    this.registers.ZF = value === 0;
    this.registers.NF = false;
    this.registers.HF = (this.registers.A & 0x0f) < (subValue & 0x0f);
    this.registers.CF = value < 0;
    this.cycles += 8;
  }

  public CP_n() {
    const subValue = this.readMemory8bit(this.registers.PC);
    this.registers.PC = (this.registers.PC + 1) & 0xffff;

    const value = this.registers.A - subValue;

    this.registers.ZF = value === 0;
    this.registers.NF = false;
    this.registers.HF = (this.registers.A & 0x0f) < (subValue & 0x0f);
    this.registers.CF = value < 0;
    this.cycles += 4;
  }

  public ADD_HL_rr(rr: string) {
    const oldValue = this.registers.HL;
    const addValue = this.readReg16bit(rr);
    const value = oldValue + addValue;

    this.registers.HL = value & 0xffff;
    this.registers.NF = (oldValue & 0xfff) + (addValue & 0xfff) > 0xfff;
    this.registers.CF = value > 0xffff;

    this.cycles += 8;
  }

  public ADD_SP_n() {
    const addValue = (this.readMemory8bit(this.registers.PC) << 24) >> 24;
    this.registers.SP = (this.registers.SP + addValue) & 0xffff;

    this.registers.ZF = false;
    this.registers.NF = false;

    this.registers.HF =
      (((this.registers.SP & 0x0f) + (addValue & 0x0f)) & 0x10) !== 0;
    this.registers.CF =
      (((this.registers.SP & 0xff) + (addValue & 0xff)) & 0x100) !== 0;
    this.cycles += 16;
  }

  public INC_rr(rr: string) {
    const value = this.readReg16bit(rr) + 1;
    this.writeReg16bit(rr, value & 0xffff);
    this.cycles += 8;
  }

  public DEC_rr(rr: string) {
    const value = this.readReg16bit(rr) - 1;
    this.writeReg16bit(rr, value & 0xffff);
    this.cycles += 8;
  }

  public DAA() {
    let value = this.registers.A;
    if (this.registers.NF) {
      if (this.registers.HF || (this.registers.A & 0xf) > 9) {
        value = value - 6;
      }
      if (this.registers.CF || this.registers.A > 0x99) {
        value = value - 0x60;
      }
    } else {
      if (this.registers.HF || (this.registers.A & 0xf) > 9) {
        value = value + 6;
      }
      if (this.registers.CF || this.registers.A > 0x99) {
        value = value + 0x60;
      }
    }

    this.registers.A = value & 0xff;

    this.registers.ZF = this.registers.A === 0;
    this.registers.HF = false;

    if ((value & 0x100) === 0x100) {
      this.registers.CF = true;
    }

    this.cycles += 4;
  }

  public CPL() {
    this.registers.A = this.registers.A ^ 0xff;
    this.registers.NF = true;
    this.registers.HF = true;

    this.cycles += 4;
  }

  public CCF() {
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = !this.registers.C;
    this.cycles += 4;
  }

  public SCF() {
    this.registers.NF = false;
    this.registers.HF = false;
    this.registers.CF = true;
    this.cycles += 4;
  }

  public HALT() {
    this.halted = true;
    this.cycles += 4;
  }

  public STOP() {
    this.halted = true;
    this.registers.incrementPC();
    this.cycles += 4;
  }

  public DI() {
    this.IME = false;
    this.cycles += 4;
  }

  public EI() {
    this.IME = true;
    this.cycles += 4;
  }

  public RLCA() {
    const oldValue = this.registers.A;

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }

    this.registers.A = newValue;
    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 4;
  }

  public RLA() {
    const oldValue = this.registers.A;

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }

    this.registers.A = newValue;
    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 4;
  }

  public RRCA() {
    const oldValue = this.registers.A;

    let newValue = oldValue;

    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.registers.A = newValue;

    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 4;
  }

  public RRA() {
    const oldValue = this.registers.A;

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.registers.A = newValue;
    this.registers.CF = oldValue & 0x1 ? true : false;
    this.registers.ZF = this.registers.A === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 4;
  }

  public RLC_r(r: string) {
    const oldValue = this.readReg8bit(r);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }

    this.writeReg8bit(r, newValue);

    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 8;
  }

  public RLC_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }

    this.writeMemory8bit(this.registers.HL, newValue);

    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 16;
  }

  public RL_r(r: string) {
    const oldValue = this.readReg8bit(r);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }
    this.writeReg8bit(r, newValue);

    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 8;
  }

  public RL_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue << 1) & 0xff) | 0x01;
    } else {
      newValue = (oldValue << 1) & 0xff & ~0x01;
    }

    this.writeMemory8bit(this.registers.HL, newValue);

    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 16;
  }

  public RRC_r(r: string) {
    const oldValue = this.readReg8bit(r);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.writeReg8bit(r, newValue);

    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 8;
  }

  public RRC_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.writeMemory8bit(this.registers.HL, newValue);

    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 16;
  }

  public RR_r(r: string) {
    const oldValue = this.readReg8bit(r);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.writeReg8bit(r, newValue);

    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 8;
  }

  public RR_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);

    let newValue = oldValue;
    if (this.registers.CF) {
      newValue = ((oldValue >> 1) & 0xff) | 0x80;
    } else {
      newValue = (oldValue >> 1) & 0xff & ~0x80;
    }

    this.writeMemory8bit(this.registers.HL, newValue);

    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.ZF = newValue === 0;
    this.registers.NF = false;
    this.registers.HF = false;

    this.cycles += 8;
  }

  public SLA_r(r: string) {
    const oldValue = this.readReg8bit(r);
    const newValue = (oldValue << 1) & 0xff;
    this.writeReg8bit(r, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 8;
  }

  public SLA_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);
    const newValue = (oldValue << 1) & 0xff;
    this.writeMemory8bit(this.registers.HL, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x80 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 16;
  }

  public SRA_r(r: string) {
    const oldValue = this.readReg8bit(r);
    const newValue = (oldValue >> 1) | (oldValue & 0x80);
    this.writeReg8bit(r, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 8;
  }

  public SRA_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);
    const newValue = (oldValue >> 1) | (oldValue & 0x80);
    this.writeMemory8bit(this.registers.HL, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 16;
  }

  public SRL_r(r: string) {
    const oldValue = this.readReg8bit(r);
    const newValue = oldValue >> 1;
    this.writeReg8bit(r, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 8;
  }

  public SRL_HL_() {
    const oldValue = this.readMemory8bit(this.registers.HL);
    const newValue = oldValue >> 1;
    this.writeMemory8bit(this.registers.HL, newValue);
    this.registers.ZF = newValue === 0;
    this.registers.CF = oldValue & 0x01 ? true : false;
    this.registers.NF = false;
    this.registers.HF = false;
    this.cycles += 16;
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

  public SET_b_r(r: string, bit: number) {
    this.writeReg8bit(r, this.readReg8bit(r) | (1 << bit));
    this.cycles += 8;
  }

  public SET_b_HL_(bit: number) {
    this.writeMemory8bit(
      this.registers.HL,
      this.readMemory8bit(this.registers.HL) | (1 << bit)
    );
    this.cycles += 16;
  }

  public RES_b_r(r: string, bit: number) {
    this.writeReg8bit(r, this.readReg8bit(r) & ~(1 << bit));
    this.cycles += 8;
  }

  public RES_b_HL_(bit: number) {
    this.writeMemory8bit(
      this.registers.HL,
      this.readMemory8bit(this.registers.HL) & ~(1 << bit)
    );
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
