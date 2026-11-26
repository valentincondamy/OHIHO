// usage : node work/shoot.mjs <dossier> <l>x<h> [port] : capture haut de page + après défilement à mi-page et en bas
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const [outdir, size = "1440x900", port = "3101"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
fs.mkdirSync(outdir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h });
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 200)); });
await page.goto("http://localhost:" + port + "/", { waitUntil: "networkidle0", timeout: 120000 });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: `${outdir}/01-accueil.png` });
for (const [i, id] of ["offres", "methode", "projets", "contact"].entries()) {
  await page.evaluate((id) => document.getElementById(id).scrollIntoView({ behavior: "instant" }), id);
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: `${outdir}/0${i + 2}-${id}.png` });
}
console.log(errs.length ? "erreurs : " + errs.join(" | ") : "aucune erreur js");
await browser.close();
