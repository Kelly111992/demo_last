import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("static HIERRO uses the approved real catalog", async () => {
  const [html, css, script] = await Promise.all([
    readFile(new URL("demos-ia/sitios/hierro/index.html", root), "utf8"),
    readFile(new URL("demos-ia/sitios/hierro/styles.css", root), "utf8"),
    readFile(new URL("demos-ia/sitios/hierro/script.js", root), "utf8"),
  ]);

  for (const model of ["DCH133B XR 20V", "M18 FUEL 2953-20", "DHP485 LXT 18V", "GSB 18V-50"]) {
    assert.match(html, new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /class="product-photo"/);
  assert.doesNotMatch(html, /mini-tool/);
  assert.match(css, /\.product-card:hover\s+\.product-photo/);
  assert.match(script, /item\.image/);

  await Promise.all([
    "dewalt-dch133b.jpg",
    "milwaukee-2953-20.webp",
    "makita-dhp485.png",
    "bosch-gsb-18v-50.png",
  ].map((name) => access(new URL(`demos-ia/sitios/hierro/assets/products/${name}`, root))));
});
