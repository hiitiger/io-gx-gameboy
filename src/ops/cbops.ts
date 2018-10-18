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

  //BIT b, r
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

  //RLC r
  ops[0x07] = {
    fn: (cpu: Cpu) => cpu.RLC_r("A")
  };
  ops[0x00] = {
    fn: (cpu: Cpu) => cpu.RLC_r("B")
  };
  ops[0x01] = {
    fn: (cpu: Cpu) => cpu.RLC_r("C")
  };
  ops[0x02] = {
    fn: (cpu: Cpu) => cpu.RLC_r("D")
  };
  ops[0x03] = {
    fn: (cpu: Cpu) => cpu.RLC_r("E")
  };
  ops[0x04] = {
    fn: (cpu: Cpu) => cpu.RLC_r("H")
  };
  ops[0x05] = {
    fn: (cpu: Cpu) => cpu.RLC_r("L")
  };
  ops[0x06] = {
    fn: (cpu: Cpu) => cpu.RLC_HL_()
  };

  //RL n
  ops[0x17] = {
    fn: (cpu: Cpu) => cpu.RL_r("A")
  };
  ops[0x10] = {
    fn: (cpu: Cpu) => cpu.RL_r("B")
  };
  ops[0x11] = {
    fn: (cpu: Cpu) => cpu.RL_r("C")
  };
  ops[0x12] = {
    fn: (cpu: Cpu) => cpu.RL_r("D")
  };
  ops[0x13] = {
    fn: (cpu: Cpu) => cpu.RL_r("E")
  };
  ops[0x14] = {
    fn: (cpu: Cpu) => cpu.RL_r("H")
  };
  ops[0x15] = {
    fn: (cpu: Cpu) => cpu.RL_r("L")
  };
  ops[0x16] = {
    fn: (cpu: Cpu) => cpu.RL_HL_()
  };

  //RRC r
  ops[0x0f] = {
    fn: (cpu: Cpu) => cpu.RRC_r("A")
  };
  ops[0x08] = {
    fn: (cpu: Cpu) => cpu.RRC_r("B")
  };
  ops[0x09] = {
    fn: (cpu: Cpu) => cpu.RRC_r("C")
  };
  ops[0x0a] = {
    fn: (cpu: Cpu) => cpu.RRC_r("D")
  };
  ops[0x0b] = {
    fn: (cpu: Cpu) => cpu.RRC_r("E")
  };
  ops[0x0c] = {
    fn: (cpu: Cpu) => cpu.RRC_r("H")
  };
  ops[0x0d] = {
    fn: (cpu: Cpu) => cpu.RRC_r("L")
  };
  ops[0x0e] = {
    fn: (cpu: Cpu) => cpu.RRC_HL_()
  };

  //RR r
  ops[0x1f] = {
    fn: (cpu: Cpu) => cpu.RR_r("A")
  };
  ops[0x18] = {
    fn: (cpu: Cpu) => cpu.RR_r("B")
  };
  ops[0x19] = {
    fn: (cpu: Cpu) => cpu.RR_r("C")
  };
  ops[0x1a] = {
    fn: (cpu: Cpu) => cpu.RR_r("D")
  };
  ops[0x1b] = {
    fn: (cpu: Cpu) => cpu.RR_r("E")
  };
  ops[0x1c] = {
    fn: (cpu: Cpu) => cpu.RR_r("H")
  };
  ops[0x1d] = {
    fn: (cpu: Cpu) => cpu.RR_r("L")
  };
  ops[0x1e] = {
    fn: (cpu: Cpu) => cpu.RR_HL_()
  };

  //SLA r
  ops[0x27] = {
    fn: (cpu: Cpu) => cpu.SLA_r("A")
  };
  ops[0x20] = {
    fn: (cpu: Cpu) => cpu.SLA_r("B")
  };
  ops[0x21] = {
    fn: (cpu: Cpu) => cpu.SLA_r("C")
  };
  ops[0x22] = {
    fn: (cpu: Cpu) => cpu.SLA_r("D")
  };
  ops[0x23] = {
    fn: (cpu: Cpu) => cpu.SLA_r("E")
  };
  ops[0x24] = {
    fn: (cpu: Cpu) => cpu.SLA_r("H")
  };
  ops[0x25] = {
    fn: (cpu: Cpu) => cpu.SLA_r("L")
  };
  ops[0x26] = {
    fn: (cpu: Cpu) => cpu.SLA_HL_()
  };

  //SRA r
  ops[0x2f] = {
    fn: (cpu: Cpu) => cpu.SRA_r("A")
  };
  ops[0x28] = {
    fn: (cpu: Cpu) => cpu.SRA_r("B")
  };
  ops[0x29] = {
    fn: (cpu: Cpu) => cpu.SRA_r("C")
  };
  ops[0x2a] = {
    fn: (cpu: Cpu) => cpu.SRA_r("D")
  };
  ops[0x2b] = {
    fn: (cpu: Cpu) => cpu.SRA_r("E")
  };
  ops[0x2c] = {
    fn: (cpu: Cpu) => cpu.SRA_r("H")
  };
  ops[0x2d] = {
    fn: (cpu: Cpu) => cpu.SRA_r("L")
  };
  ops[0x2e] = {
    fn: (cpu: Cpu) => cpu.SRA_HL_()
  };

  //SRL r
  ops[0x3f] = {
    fn: (cpu: Cpu) => cpu.SRL_r("A")
  };
  ops[0x38] = {
    fn: (cpu: Cpu) => cpu.SRL_r("B")
  };
  ops[0x39] = {
    fn: (cpu: Cpu) => cpu.SRL_r("C")
  };
  ops[0x3a] = {
    fn: (cpu: Cpu) => cpu.SRL_r("D")
  };
  ops[0x3b] = {
    fn: (cpu: Cpu) => cpu.SRL_r("E")
  };
  ops[0x3c] = {
    fn: (cpu: Cpu) => cpu.SRL_r("H")
  };
  ops[0x3d] = {
    fn: (cpu: Cpu) => cpu.SRL_r("L")
  };
  ops[0x3e] = {
    fn: (cpu: Cpu) => cpu.SRL_HL_()
  };

  //SET b, r
  ops[0xc7] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("A", 0)
  };
  ops[0xc0] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("B", 0)
  };
  ops[0xc1] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("C", 0)
  };
  ops[0xc2] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("D", 0)
  };
  ops[0xc3] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("E", 0)
  };
  ops[0xc4] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("H", 0)
  };
  ops[0xc5] = {
    fn: (cpu: Cpu) => cpu.SET_b_r("L", 0)
  };
  ops[0xc6] = {
    fn: (cpu: Cpu) => cpu.SET_b_HL_(0)
  };

  //RES b, r
  ops[0x87] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("A", 0)
  };
  ops[0x80] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("B", 0)
  };
  ops[0x81] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("C", 0)
  };
  ops[0x82] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("D", 0)
  };
  ops[0x83] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("E", 0)
  };
  ops[0x84] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("H", 0)
  };
  ops[0x85] = {
    fn: (cpu: Cpu) => cpu.RES_b_r("L", 0)
  };
  ops[0x86] = {
    fn: (cpu: Cpu) => cpu.RES_b_HL_(0)
  };

  //RLC r
  ops[0x00] = {
    fn: (cpu: Cpu) => cpu.RLC_r("B")
  };

  return ops;
};
