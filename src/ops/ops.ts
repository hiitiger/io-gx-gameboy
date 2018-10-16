import { Cpu } from "../cpu.js";

import { IOpcodeDescription } from "./iops.js";

export const buildOpMap = (ops: any[]): IOpcodeDescription[] => {
  ops[0x00] = {
    fn: (cpu: Cpu) => cpu.NOOP()
  };

  //INC r
  ops[0x3c] = {
    fn: (cpu: Cpu) => cpu.INC_r("A")
  };
  ops[0x04] = {
    fn: (cpu: Cpu) => cpu.INC_r("B")
  };
  ops[0x0c] = {
    fn: (cpu: Cpu) => cpu.INC_r("C")
  };
  ops[0x14] = {
    fn: (cpu: Cpu) => cpu.INC_r("D")
  };
  ops[0x1c] = {
    fn: (cpu: Cpu) => cpu.INC_r("E")
  };
  ops[0x24] = {
    fn: (cpu: Cpu) => cpu.INC_r("H")
  };
  ops[0x2c] = {
    fn: (cpu: Cpu) => cpu.INC_r("L")
  };
  ops[0x34] = {
    fn: (cpu: Cpu) => cpu.INC_HL_()
  };


  //DEC r
  ops[0x3d] = {
    fn: (cpu: Cpu) => cpu.DEC_r("A")
  };
  ops[0x05] = {
    fn: (cpu: Cpu) => cpu.DEC_r("B")
  };
  ops[0x0d] = {
    fn: (cpu: Cpu) => cpu.DEC_r("C")
  };
  ops[0x15] = {
    fn: (cpu: Cpu) => cpu.DEC_r("D")
  };
  ops[0x1d] = {
    fn: (cpu: Cpu) => cpu.DEC_r("E")
  };
  ops[0x25] = {
    fn: (cpu: Cpu) => cpu.DEC_r("H")
  };
  ops[0x2d] = {
    fn: (cpu: Cpu) => cpu.DEC_r("L")
  };
  ops[0x35] = {
    fn: (cpu: Cpu) => cpu.DEC_HL_()
  };

  //LD r, n
  ops[0x06] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("B")
  };
  ops[0x0e] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("C")
  };
  ops[0x16] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("D")
  };
  ops[0x1e] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("E")
  };
  ops[0x26] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("H")
  };
  ops[0x2e] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("L")
  };

  //LD A, n
  ops[0x7f] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "A")
  };
  ops[0x78] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "B")
  };
  ops[0x79] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "C")
  };
  ops[0x7a] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "D")
  };
  ops[0x7b] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "E")
  };
  ops[0x7c] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "H")
  };
  ops[0x7d] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("A", "L")
  };
  ops[0x7e] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("A")
  };
  ops[0x3e] = {
    fn: (cpu: Cpu) => cpu.LD_r_n("A")
  };

  //LD A, n
  ops[0x0a] = {
    fn: (cpu: Cpu) => cpu.LDA_rr_("BC")
  };
  ops[0x1a] = {
    fn: (cpu: Cpu) => cpu.LDA_rr_("DE")
  };
  ops[0xfa] = {
    fn: (cpu: Cpu) => cpu.LDA_nn_()
  };

  ops[0xaf] = {
    fn: (cpu: Cpu) => cpu.XOR_A()
  };

  //JR CC
  ops[0x20] = {
    fn: (cpu: Cpu) => cpu.JR_CC_e("Z", false)
  };
  ops[0x28] = {
    fn: (cpu: Cpu) => cpu.JR_CC_e("Z", true)
  };
  ops[0x30] = {
    fn: (cpu: Cpu) => cpu.JR_CC_e("C", false)
  };
  ops[0x38] = {
    fn: (cpu: Cpu) => cpu.JR_CC_e("C", true)
  };

  //LD r1, r2

  ops[0x40] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "B")
  };
  ops[0x41] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "C")
  };
  ops[0x42] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "D")
  };
  ops[0x43] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "E")
  };
  ops[0x44] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "H")
  };
  ops[0x45] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "L")
  };
  ops[0x46] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("B")
  };
  ops[0x48] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "B")
  };
  ops[0x49] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "C")
  };
  ops[0x4a] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "D")
  };
  ops[0x4b] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "E")
  };
  ops[0x4c] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "H")
  };
  ops[0x4d] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "L")
  };
  ops[0x4e] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("C")
  };
  ops[0x50] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "B")
  };
  ops[0x51] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "C")
  };
  ops[0x52] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "D")
  };
  ops[0x53] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "E")
  };
  ops[0x54] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "H")
  };
  ops[0x55] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "L")
  };
  ops[0x56] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("D")
  };
  ops[0x58] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "B")
  };
  ops[0x59] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "C")
  };
  ops[0x5a] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "D")
  };
  ops[0x5b] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "E")
  };
  ops[0x5c] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "H")
  };
  ops[0x5d] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "L")
  };
  ops[0x5e] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("E")
  };
  ops[0x60] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "B")
  };
  ops[0x61] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "C")
  };
  ops[0x62] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "D")
  };
  ops[0x63] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "E")
  };
  ops[0x64] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "H")
  };
  ops[0x65] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "L")
  };
  ops[0x66] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("H")
  };
  ops[0x68] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "B")
  };
  ops[0x69] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "C")
  };
  ops[0x6a] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "D")
  };
  ops[0x6b] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "E")
  };
  ops[0x6c] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "H")
  };
  ops[0x6d] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "L")
  };
  ops[0x6e] = {
    fn: (cpu: Cpu) => cpu.LD_r_HL_("L")
  };
  ops[0x70] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("B")
  };
  ops[0x71] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("C")
  };
  ops[0x72] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("D")
  };
  ops[0x73] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("E")
  };
  ops[0x74] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("H")
  };
  ops[0x75] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("L")
  };

  //LD n, A
  ops[0x47] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("B", "A")
  };
  ops[0x4f] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("C", "A")
  };
  ops[0x57] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("D", "A")
  };
  ops[0x5f] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("E", "A")
  };
  ops[0x67] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("H", "A")
  };
  ops[0x6f] = {
    fn: (cpu: Cpu) => cpu.LD_r_r("L", "A")
  };
  ops[0x02] = {
    fn: (cpu: Cpu) => cpu.LD_BC_A()
  };
  ops[0x12] = {
    fn: (cpu: Cpu) => cpu.LD_DE_A()
  };
  ops[0x77] = {
    fn: (cpu: Cpu) => cpu.LD_HL_r("A")
  };
  ops[0xea] = {
    fn: (cpu: Cpu) => cpu.LD_nn_A()
  };

  // LD A, (c)
  ops[0xf2] = {
    fn: (cpu: Cpu) => cpu.LD_A_0xFF00C_()
  };

  //LD (c), A
  ops[0xe2] = {
    fn: (cpu: Cpu) => cpu.LD_0xFF00C_A()
  };

  //LDD A, (HL)
  ops[0x3a] = {
    fn: (cpu: Cpu) => cpu.LDD_A_HL_()
  };

  //LDD (HL), A
  ops[0x32] = {
    fn: (cpu: Cpu) => cpu.LDD_HL_A()
  };

  //LDI A, (HL)
  ops[0x2a] = {
    fn: (cpu: Cpu) => cpu.LDI_A_HL_()
  };
  //LDI (HL), A
  ops[0x22] = {
    fn: (cpu: Cpu) => cpu.LDI_HL_A()
  };

  //LD (n), A
  ops[0xe0] = {
    fn: (cpu: Cpu) => cpu.LD_0xFF00n_A()
  };

  //LD A, (n)
  ops[0xf0] = {
    fn: (cpu: Cpu) => cpu.LD_A_0xFF00n_()
  };

  //LD rr, nn
  ops[0x01] = {
    fn: (cpu: Cpu) => cpu.LD_BC_nn()
  };
  ops[0x11] = {
    fn: (cpu: Cpu) => cpu.LD_DE_nn()
  };
  ops[0x21] = {
    fn: (cpu: Cpu) => cpu.LD_HL_nn()
  };
  ops[0x31] = {
    fn: (cpu: Cpu) => cpu.LD_SP_nn()
  };

  //LD SP, HL
  ops[0xf9] = {
    fn: (cpu: Cpu) => cpu.LD_rr_rr("SP", "HL")
  };

  //LDHL SP, n
  ops[0xf8] = {
    fn: (cpu: Cpu) => cpu.LDHL_SP_n()
  };

  //LD (nn), SP
  ops[0x08] = {
    fn: (cpu: Cpu) => cpu.LD_nn_SP()
  };

  //PUSH nn
  ops[0xf5] = {
    fn: (cpu: Cpu) => cpu.PUSH_rr("AF")
  };
  ops[0xc5] = {
    fn: (cpu: Cpu) => cpu.PUSH_rr("BC")
  };
  ops[0xd5] = {
    fn: (cpu: Cpu) => cpu.PUSH_rr("DE")
  };
  ops[0xe5] = {
    fn: (cpu: Cpu) => cpu.PUSH_rr("HL")
  };

  //POP nn
  ops[0xf1] = {
    fn: (cpu: Cpu) => cpu.POP_rr("AF")
  };
  ops[0xc1] = {
    fn: (cpu: Cpu) => cpu.POP_rr("BC")
  };
  ops[0xd1] = {
    fn: (cpu: Cpu) => cpu.POP_rr("DE")
  };
  ops[0xe1] = {
    fn: (cpu: Cpu) => cpu.POP_rr("HL")
  };

  //ADD A, n
  ops[0x87] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("A")
  };
  ops[0x80] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("B")
  };
  ops[0x81] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("C")
  };
  ops[0x82] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("D")
  };
  ops[0x83] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("E")
  };
  ops[0x84] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("H")
  };
  ops[0x85] = {
    fn: (cpu: Cpu) => cpu.ADD_A_r("L")
  };
  ops[0x86] = {
    fn: (cpu: Cpu) => cpu.ADD_A_HL_()
  };
  ops[0xc6] = {
    fn: (cpu: Cpu) => cpu.ADD_A_n()
  };

  //ADC A, n
  ops[0x8f] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("A")
  };
  ops[0x88] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("B")
  };
  ops[0x89] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("C")
  };
  ops[0x8a] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("D")
  };
  ops[0x8b] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("E")
  };
  ops[0x8c] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("H")
  };
  ops[0x8d] = {
    fn: (cpu: Cpu) => cpu.ADC_A_r("L")
  };
  ops[0x8e] = {
    fn: (cpu: Cpu) => cpu.ADC_A_HL_()
  };
  ops[0xce] = {
    fn: (cpu: Cpu) => cpu.ADC_A_n()
  };

  //SUB n
  ops[0x97] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("A")
  };
  ops[0x90] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("B")
  };
  ops[0x91] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("C")
  };
  ops[0x92] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("D")
  };
  ops[0x93] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("E")
  };
  ops[0x94] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("H")
  };
  ops[0x95] = {
    fn: (cpu: Cpu) => cpu.SUB_A_r("L")
  };
  ops[0x96] = {
    fn: (cpu: Cpu) => cpu.SUB_A_HL_()
  };
  ops[0xd6] = {
    fn: (cpu: Cpu) => cpu.SUB_A_n()
  };

  //SBC A, n
  ops[0x9f] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("A")
  };
  ops[0x98] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("B")
  };
  ops[0x99] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("C")
  };
  ops[0x9a] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("D")
  };
  ops[0x9b] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("E")
  };
  ops[0x9c] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("H")
  };
  ops[0x9d] = {
    fn: (cpu: Cpu) => cpu.SBC_A_r("L")
  };
  ops[0x9e] = {
    fn: (cpu: Cpu) => cpu.SBC_A_HL_()
  };
  ops[0xde] = {
    fn: (cpu: Cpu) => cpu.SBC_A_n()
  };

  //AND n
  ops[0xa7] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("A")
  };
  ops[0xa0] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("B")
  };
  ops[0xa1] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("C")
  };
  ops[0xa2] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("D")
  };
  ops[0xa3] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("E")
  };
  ops[0xa4] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("H")
  };
  ops[0xa5] = {
    fn: (cpu: Cpu) => cpu.AND_A_r("L")
  };
  ops[0xa6] = {
    fn: (cpu: Cpu) => cpu.AND_A_HL_()
  };
  ops[0xe6] = {
    fn: (cpu: Cpu) => cpu.AND_A_n()
  };

  //OR n
  ops[0xb7] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("A")
  };
  ops[0xb0] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("B")
  };
  ops[0xb1] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("C")
  };
  ops[0xb2] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("D")
  };
  ops[0xb3] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("E")
  };
  ops[0xb4] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("H")
  };
  ops[0xb5] = {
    fn: (cpu: Cpu) => cpu.OR_A_r("L")
  };
  ops[0xb6] = {
    fn: (cpu: Cpu) => cpu.OR_A_HL_()
  };
  ops[0xf6] = {
    fn: (cpu: Cpu) => cpu.OR_A_n()
  };

  //XOR n
  ops[0xaf] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("A")
  };
  ops[0xa8] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("B")
  };
  ops[0xa9] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("C")
  };
  ops[0xaa] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("D")
  };
  ops[0xab] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("E")
  };
  ops[0xac] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("H")
  };
  ops[0xad] = {
    fn: (cpu: Cpu) => cpu.XOR_A_r("L")
  };
  ops[0xae] = {
    fn: (cpu: Cpu) => cpu.XOR_A_HL_()
  };
  ops[0xee] = {
    fn: (cpu: Cpu) => cpu.XOR_A_n()
  };

  //CP n
  ops[0xbf] = {
    fn: (cpu: Cpu) => cpu.CP_r("A")
  };
  ops[0xb8] = {
    fn: (cpu: Cpu) => cpu.CP_r("B")
  };
  ops[0xb9] = {
    fn: (cpu: Cpu) => cpu.CP_r("C")
  };
  ops[0xba] = {
    fn: (cpu: Cpu) => cpu.CP_r("D")
  };
  ops[0xbb] = {
    fn: (cpu: Cpu) => cpu.CP_r("E")
  };
  ops[0xbc] = {
    fn: (cpu: Cpu) => cpu.CP_r("H")
  };
  ops[0xbd] = {
    fn: (cpu: Cpu) => cpu.CP_r("L")
  };
  ops[0xbe] = {
    fn: (cpu: Cpu) => cpu.CP_HL_()
  };
  ops[0xfe] = {
    fn: (cpu: Cpu) => cpu.CP_n()
  };

  //16bit 
  //ADD HL, n
  ops[0x09] = {
    fn: (cpu: Cpu) => cpu.ADD_HL_rr("BC")
  };
  ops[0x19] = {
    fn: (cpu: Cpu) => cpu.ADD_HL_rr("DE")
  };
  ops[0x29] = {
    fn: (cpu: Cpu) => cpu.ADD_HL_rr("HL")
  };
  ops[0x39] = {
    fn: (cpu: Cpu) => cpu.ADD_HL_rr("SP")
  };

  //ADD SP, n
  ops[0xe8] = {
    fn: (cpu: Cpu) => cpu.ADD_SP_n()
  };

  //INC rr
  ops[0x03] = {
    fn: (cpu: Cpu) => cpu.INC_rr("BC")
  };
  ops[0x13] = {
    fn: (cpu: Cpu) => cpu.INC_rr("DE")
  };
  ops[0x23] = {
    fn: (cpu: Cpu) => cpu.INC_rr("HL")
  };
  ops[0x33] = {
    fn: (cpu: Cpu) => cpu.INC_rr("SP")
  };

  //DEC rr
  ops[0x0B] = {
    fn: (cpu: Cpu) => cpu.DEC_rr("BC")
  };
  ops[0x1B] = {
    fn: (cpu: Cpu) => cpu.DEC_rr("DE")
  };
  ops[0x2B] = {
    fn: (cpu: Cpu) => cpu.DEC_rr("HL")
  };
  ops[0x3B] = {
    fn: (cpu: Cpu) => cpu.DEC_rr("SP")
  };

  //DAA 
  ops[0x27] = {
    fn: (cpu: Cpu) => cpu.DAA()
  };

  //CPL
  ops[0x2f] = {
    fn: (cpu: Cpu) => cpu.CPL()
  };

  //
  ops[0x36] = {
    fn: (cpu: Cpu) => cpu.LD_HL_n()
  };

  return ops;
};
