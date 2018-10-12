import { Cpu } from "./cpu";

interface IOpcodeDescription {
  fn: (cpu: Cpu) => void;
  cycles: number;
}

interface IOpcodeTable {
  [key: string]: IOpcodeDescription;
}

const XOR_n: IOpcodeTable = {
  "0xAF": {
    fn: (cpu: Cpu) => cpu.XOR_n("A"),
    cycles: 4
  }
};

const LDD_HL_A : IOpcodeTable = {
  "0x32": {
    fn: (cpu: Cpu) => cpu.LDD_HL_A(),
    cycles: 8
  }
}

const CB: IOpcodeTable = {
  "0xCB": {
    fn: (cpu: Cpu) => cpu.excute_ext_opcode(),
    cycles: 0
  }
}

const LD_nn_n: IOpcodeTable = {
  "0x06": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("B"),
    cycles: 8
  },
  "0x0E": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("C"),
    cycles: 8
  },
  "0x16": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("D"),
    cycles: 8
  },
  "0x1E": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("E"),
    cycles: 8
  },
  "0x26": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("H"),
    cycles: 8
  },
  "0x2E": {
    fn: (cpu: Cpu) => cpu.LD_nn_n("L"),
    cycles: 8
  }
};

const LD_A_n: IOpcodeTable = {
  "0x0A": {
    fn: (cpu: Cpu) => cpu.LD_A_n("(BC)"),
    cycles: 8
  },
  "0x1A": {
    fn: (cpu: Cpu) => cpu.LD_A_n("(DE)"),
    cycles: 8
  },
  "0xFA": {
    fn: (cpu: Cpu) => cpu.LD_A_n("(nn)"),
    cycles: 16
  },
  "0x3E": {
    fn: (cpu: Cpu) => cpu.LD_A_n("#"),
    cycles: 8
  }
};

const LD_n_A: IOpcodeTable = {
  "0x02": {
    fn: (cpu: Cpu) => cpu.LD_n_A("(BC)"),
    cycles: 8
  },
  "0x12": {
    fn: (cpu: Cpu) => cpu.LD_n_A("(DE)"),
    cycles: 8
  },
  "0xEA": {
    fn: (cpu: Cpu) => cpu.LD_n_A("(nn)"),
    cycles: 16
  }
};

const LD_r1_r2: IOpcodeTable = {
  "0x7F": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "A"),
    cycles: 4
  },
  "0x78": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "B"),
    cycles: 4
  },
  "0x79": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "C"),
    cycles: 4
  },
  "0x7A": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "D"),
    cycles: 4
  },
  "0x7B": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "E"),
    cycles: 4
  },
  "0x7C": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "H"),
    cycles: 4
  },
  "0x7D": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "L"),
    cycles: 4
  },
  "0x7E": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("A", "(HL)"),
    cycles: 8
  },
  "0x40": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "B"),
    cycles: 4
  },
  "0x41": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "C"),
    cycles: 4
  },
  "0x42": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "D"),
    cycles: 4
  },
  "0x43": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "E"),
    cycles: 4
  },
  "0x44": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "H"),
    cycles: 4
  },
  "0x45": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "L"),
    cycles: 4
  },
  "0x46": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("B", "(HL)"),
    cycles: 8
  },
  "0x48": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "B"),
    cycles: 4
  },
  "0x49": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "C"),
    cycles: 4
  },
  "0x4A": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "D"),
    cycles: 4
  },
  "0x4B": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "E"),
    cycles: 4
  },
  "0x4C": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "H"),
    cycles: 4
  },
  "0x4D": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "L"),
    cycles: 4
  },
  "0x4E": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("C", "(HL)"),
    cycles: 8
  },
  "0x50": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "B"),
    cycles: 4
  },
  "0x51": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "C"),
    cycles: 4
  },
  "0x52": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "D"),
    cycles: 4
  },
  "0x53": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "E"),
    cycles: 4
  },
  "0x54": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "H"),
    cycles: 4
  },
  "0x55": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "L"),
    cycles: 4
  },
  "0x56": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("D", "(HL)"),
    cycles: 8
  },
  "0x58": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "B"),
    cycles: 4
  },
  "0x59": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "C"),
    cycles: 4
  },
  "0x5A": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "D"),
    cycles: 4
  },
  "0x5B": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "E"),
    cycles: 4
  },
  "0x5C": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "H"),
    cycles: 4
  },
  "0x5d": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "L"),
    cycles: 4
  },
  "0x5E": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("E", "(HL)"),
    cycles: 8
  },
  "0x60": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "B"),
    cycles: 4
  },
  "0x61": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "C"),
    cycles: 4
  },
  "0x62": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "D"),
    cycles: 4
  },
  "0x63": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "E"),
    cycles: 4
  },
  "0x64": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "H"),
    cycles: 4
  },
  "0x65": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "L"),
    cycles: 4
  },
  "0x66": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("H", "(HL)"),
    cycles: 8
  },
  "0x68": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "B"),
    cycles: 4
  },
  "0x69": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "C"),
    cycles: 4
  },
  "0x6A": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "D"),
    cycles: 4
  },
  "0x6B": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "E"),
    cycles: 4
  },
  "0x6C": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "H"),
    cycles: 4
  },
  "0x6D": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "L"),
    cycles: 4
  },
  "0x6E": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("L", "(HL)"),
    cycles: 8
  },
  "0x70": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "B"),
    cycles: 8
  },
  "0x71": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "C"),
    cycles: 8
  },
  "0x72": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "D"),
    cycles: 8
  },
  "0x73": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "E"),
    cycles: 8
  },
  "0x74": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "H"),
    cycles: 8
  },
  "0x75": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "L"),
    cycles: 8
  },

  "0x36": {
    fn: (cpu: Cpu) => cpu.LD_r1_r2("(HL)", "n"),
    cycles: 12
  }
};

const LD_n_nn: IOpcodeTable = {
  "0x01": {
    fn: (cpu: Cpu) => cpu.LD_n_nn("BC"),
    cycles: 12
  },
  "0x11": {
    fn: (cpu: Cpu) => cpu.LD_n_nn("DE"),
    cycles: 12
  },
  "0x21": {
    fn: (cpu: Cpu) => cpu.LD_n_nn("HL"),
    cycles: 12
  },
  "0x31": {
    fn: (cpu: Cpu) => cpu.LD_n_nn("SP"),
    cycles: 12
  }
};

export const OpcodeTable: IOpcodeTable = {
  ...LD_nn_n,
  ...LD_A_n,
  ...LD_n_A,
  ...LD_r1_r2,
  ...LD_n_nn,
  ...XOR_n,
  ...LDD_HL_A,
  ...CB
}

const EXT_SWAP_n = {
  "0x37": {
    fn: (cpu: Cpu) => cpu.SWAP_n("A"),
    cycles: 8 
  }
}

export const EXT_OpcodeTable: IOpcodeTable = {
  ...EXT_SWAP_n,
}