export const RamSize = 0x10000;

export enum REG8BIT {
  A = "A",
  F = "F",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  H = "H",
  L = "L"
}

export enum REG16BIT {
  AF = "AF",
  BC = "BC",
  DE = "DE",
  HL = "HL"
}

export enum FLAGOFFSETS {
  Z = 0x80,
  N = 0x40,
  H = 0x20,
  C = 0x10
}
