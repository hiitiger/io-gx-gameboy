import { FLAGOFFSETS } from "./specs.js";

export class Register {
  low: number = 0;
  high: number = 0;

  get word() {
    return (this.high << 8) + this.low;
  }

  set word(val: number) {
    this.low = val & 0xff;
    this.high = (val >> 8) & 0xff;
  }
}

export class Registers {
  private rAF: Register;
  private rBC: Register;
  private rDE: Register;
  private rHL: Register;

  PC: number;
  SP: number;

  FLAG: number;

  public reset() {
    this.rAF = new Register();
    this.rBC = new Register();
    this.rDE = new Register();
    this.rHL = new Register();
    this.SP = 0;
    this.PC = 0;

    this.FLAG = 0;
  }

  public incrementPC() {
    this.PC = (this.PC + 1) & 0xffff;
  }

  public decrementPC() {
    this.PC = (this.PC - 1) & 0xffff;
  }

  public incrementSP() {
    this.SP = (this.SP + 1) & 0xffff;
  }

  public decrementSP() {
    this.SP = (this.SP - 1) & 0xffff;
  }

  get AF() {
    return (this.rAF.high << 8) + this.FLAG;
  }

  set AF(val: number) {
    this.F = val & 0xff;
    this.A = (val >> 8) & 0xff;
  }

  get BC() {
    return this.rBC.word;
  }

  set BC(val: number) {
    this.rBC.word = val;
  }

  get DE() {
    return this.rDE.word;
  }

  set DE(val: number) {
    this.rDE.word = val;
  }

  get HL() {
    return this.rHL.word;
  }

  set HL(val: number) {
    this.rHL.word = val;
  }

  get A() {
    return this.rAF.high;
  }

  set A(val: number) {
    this.rAF.high = val & 0xff;
  }

  get F() {
    return this.FLAG;
  }

  set F(val: number) {
    this.FLAG = val & 0xf0;
  }

  get B() {
    return this.rBC.high;
  }

  set B(val: number) {
    this.rBC.high = val & 0xff;
  }

  get C() {
    return this.rBC.low;
  }

  set C(val: number) {
    this.rBC.low = val & 0xff;
  }

  get D() {
    return this.rDE.high;
  }

  set D(val: number) {
    this.rDE.high = val & 0xff;
  }

  get E() {
    return this.rDE.low;
  }

  set E(val: number) {
    this.rDE.low = val & 0xff;
  }

  get H() {
    return this.rHL.high;
  }

  set H(val: number) {
    this.rHL.high = val & 0xff;
  }

  get L() {
    return this.rHL.low;
  }

  set L(val: number) {
    this.rHL.low = val & 0xff;
  }

  get ZF() {
    return this.FLAG & FLAGOFFSETS.Z ? true : false;
  }

  set ZF(val: boolean) {
    if (val) {
      this.FLAG = this.FLAG | FLAGOFFSETS.Z;
    } else {
      this.FLAG = this.FLAG & ~FLAGOFFSETS.Z;
    }
  }

  get NF() {
    return this.FLAG & FLAGOFFSETS.N ? true : false;
  }

  set NF(val: boolean) {
    if (val) {
      this.FLAG = this.FLAG | FLAGOFFSETS.N;
    } else {
      this.FLAG = this.FLAG & ~FLAGOFFSETS.N;
    }
  }

  get HF() {
    return this.FLAG & FLAGOFFSETS.H ? true : false;
  }

  set HF(val: boolean) {
    if (val) {
      this.FLAG = this.FLAG | FLAGOFFSETS.H;
    } else {
      this.FLAG = this.FLAG & ~FLAGOFFSETS.H;
    }
  }

  get CF() {
    return this.FLAG & FLAGOFFSETS.C ? true : false;
  }

  set CF(val: boolean) {
    if (val) {
      this.FLAG = this.FLAG | FLAGOFFSETS.C;
    } else {
      this.FLAG = this.FLAG & ~FLAGOFFSETS.C;
    }
  }
}
