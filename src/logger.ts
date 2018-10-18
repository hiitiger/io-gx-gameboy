export function debug(a) {
  console.log(`%c[DEBUG] %c${a}`, "font-size: 14px", "font-size: 12px");
}

export function info(a) {
  console.log(`%c[INFO] %c${a}`, "color:green; font-size: 14px", "font-size: 12px");
}
