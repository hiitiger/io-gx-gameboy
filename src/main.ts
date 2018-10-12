import { Memory } from "./memory.js";
import { loadRom, loadBoot } from "./loader.js";
import { Cartridge } from "./cartridge.js";
import { logBuffer } from "./utils.js";
import { Cpu } from "./cpu.js";

function run(cpu: Cpu) {
  cpu.tick();
  cpu.printReg();

  setTimeout(() => run(cpu), 16);
}

async function main() {
  const mem = new Memory();
  const bios = await loadBoot();
  mem.load(0, bios);

  const rombin = await loadRom("Tetris");
  const rom = new Cartridge(rombin);
  mem.loadRom(rom);

  console.log(rom.type);
  // logBuffer(bios);
  // logBuffer(rombin);

  const cpu = new Cpu(mem, rom);
  cpu.init();
  cpu.printReg();
  run(cpu);
}

main();
