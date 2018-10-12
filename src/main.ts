import { Memory } from "./memory.js";
import { loadRom, loadBoot } from "./loader.js";
import { logBuffer } from "./utils.js";

async function main() {
  const mem = new Memory();
  const bios = await loadBoot();
  mem.load(0, bios);

  logBuffer(bios);
}

main();
