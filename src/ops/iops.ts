import { Cpu } from "../cpu.js";

export interface IOpcodeDescription {
    fn: (cpu: Cpu) => void;
  }
  