import { MMU } from "./mmu.js";
import { loadRom, loadBoot } from "./loader.js";
import { Cartridge } from "./cartridge.js";
import { logBuffer } from "./utils.js";
import { Cpu } from "./cpu.js";
import { Gpu } from "./gpu.js";

function run(cpu: Cpu) {
  cpu.tick();

  setTimeout(() => run(cpu), 16);
}

async function main() {
  const mem = new MMU();
  const bios = await loadBoot();
  mem.loadBios(bios);

  const rombin = await loadRom("Tetris");
  const rom = new Cartridge(rombin);
  mem.loadRom(rom);

  const gpu = new Gpu();
  mem.loadGpu(gpu);

  console.log(rom.type);
  // logBuffer(bios);
  // logBuffer(rombin);

  const cpu = new Cpu(mem);
  cpu.init();
  cpu.printReg();
  run(cpu);
}

main();
