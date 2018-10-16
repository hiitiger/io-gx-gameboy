import { Cpu } from "../cpu.js";

import { IOpcodeDescription } from "./iops.js";

export const buildCBOpMap = (ops: any[]): IOpcodeDescription[] => {

  //SWAP r
  ops[0x30] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("B")
  };
  ops[0x31] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("C")
  };
  ops[0x32] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("D")
  };
  ops[0x33] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("E")
  };
  ops[0x34] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("H")
  };
  ops[0x35] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("L")
  };
  ops[0x36] = {
    fn: (cpu: Cpu) => cpu.SWAP_HL_()
  };
  ops[0x37] = {
    fn: (cpu: Cpu) => cpu.SWAP_r("A")
  };

  ops[0x40] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 0)
  };
  ops[0x41] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 0)
  };
  ops[0x42] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 0)
  };
  ops[0x43] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 0)
  };
  ops[0x44] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 0)
  };
  ops[0x45] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 0)
  };
  ops[0x46] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(0)
  };
  ops[0x47] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 0)
  };

  ops[0x48] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 1)
  };
  ops[0x49] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 1)
  };
  ops[0x4a] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 1)
  };
  ops[0x4b] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 1)
  };
  ops[0x4c] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 1)
  };
  ops[0x4d] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 1)
  };
  ops[0x4e] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(1)
  };
  ops[0x4f] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 1)
  };

  ops[0x50] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 2)
  };
  ops[0x51] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 2)
  };
  ops[0x52] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 2)
  };
  ops[0x53] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 2)
  };
  ops[0x54] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 2)
  };
  ops[0x55] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 2)
  };
  ops[0x56] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(2)
  };
  ops[0x57] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 2)
  };

  ops[0x58] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 3)
  };
  ops[0x59] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 3)
  };
  ops[0x5a] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 3)
  };
  ops[0x5b] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 3)
  };
  ops[0x5c] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 3)
  };
  ops[0x5d] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 3)
  };
  ops[0x5e] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(3)
  };
  ops[0x5f] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 3)
  };

  ops[0x60] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 4)
  };
  ops[0x61] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 4)
  };
  ops[0x62] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 4)
  };
  ops[0x63] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 4)
  };
  ops[0x64] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 4)
  };
  ops[0x65] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 4)
  };
  ops[0x66] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(4)
  };
  ops[0x67] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 4)
  };

  ops[0x68] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 5)
  };
  ops[0x69] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 5)
  };
  ops[0x6a] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 5)
  };
  ops[0x6b] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 5)
  };
  ops[0x6c] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 5)
  };
  ops[0x6d] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 5)
  };
  ops[0x6e] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(5)
  };
  ops[0x6f] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 5)
  };

  ops[0x70] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 6)
  };
  ops[0x71] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 6)
  };
  ops[0x72] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 6)
  };
  ops[0x73] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 6)
  };
  ops[0x74] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 6)
  };
  ops[0x75] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 6)
  };
  ops[0x76] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(6)
  };
  ops[0x77] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 6)
  };

  ops[0x78] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("B", 7)
  };
  ops[0x79] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("C", 7)
  };
  ops[0x7a] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("D", 7)
  };
  ops[0x7b] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("E", 7)
  };
  ops[0x7c] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("H", 7)
  };
  ops[0x7d] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("L", 7)
  };
  ops[0x7e] = {
    fn: (cpu: Cpu) => cpu.BIT_b_HL_(7)
  };
  ops[0x7f] = {
    fn: (cpu: Cpu) => cpu.BIT_b_r("A", 7)
  };

  return ops;
};
