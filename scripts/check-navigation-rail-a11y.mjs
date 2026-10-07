// Run against the dedicated Weft site, never the product or the package gallery.
import { chromium, expect } from "@playwright/test";
import axe from "axe-core";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const url = option("--url", "http://127.0.0.1:5179/#/labs/navigation-rail");
const output = option(
  "--output",
  "/tmp/weft-navigation-rail-accessibility.json"
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1490, height: 1091 },
  reducedMotion: "reduce",
});
const report = {
  date: new Date().toISOString(),
  url,
  scanner: `axe-core ${axe.version}`,
  browser: browser.version(),
  scans: [],
  checks: [],
  contrast: [],
  errors: [],
};
page.on("pageerror", (error) => report.errors.push(error.message));
const check = (name) => {
  report.checks.push(name);
  console.log(`PASS ${name}`);
};
async function settle() {
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {}))
    );
  });
}
async function scan(name) {
  await page.mouse.move(0, 0);
  await settle();
  const result = await page.evaluate(async () => {
    const results = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    const summarize = (rule) => ({
      id: rule.id,
      impact: rule.impact,
      help: rule.help,
      nodes: rule.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    });
    return {
      violations: results.violations.map(summarize),
      needsReview: results.incomplete.map((rule) => ({
        ...summarize(rule),
        nodeCount: rule.nodes.length,
        nodes: summarize(rule).nodes.slice(0, 3),
      })),
      passedRules: results.passes.length,
    };
  });
  report.scans.push({ name, ...result });
  console.log(
    `${result.violations.length ? "FAIL" : "PASS"} axe ${name}: ${
      result.violations.length
    } violations, ${result.needsReview.length} review rules`
  );
}
async function contrast(name) {
  const samples = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const rgba = (value) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].map((v, i) =>
        i === 3 ? v / 255 : v
      );
    };
    const blend = (fg, bg) =>
      fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
    const luminance = (rgb) =>
      rgb
        .slice(0, 3)
        .map((v) => v / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => {
      const x = luminance(a),
        y = luminance(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };
    return [
      ...document.querySelectorAll(
        '.rail-lab-title, .rail-lab-counters [data-slot="badge"], .rail-lab-account-initials, .rail-lab-note, .rail-lab-space-avatar, .weft-navigation-item-status'
      ),
    ]
      .filter(
        (el) =>
          el.getClientRects().length && !el.closest('[data-disabled="true"]')
      )
      .map((el) => {
        let parents = [];
        for (let p = el; p; p = p.parentElement) parents.unshift(p);
        let bg = [255, 255, 255];
        for (let p of parents)
          bg = blend(rgba(getComputedStyle(p).backgroundColor), bg);
        const fg = blend(rgba(getComputedStyle(el).color), bg);
        return {
          text: el.getAttribute("aria-label") || el.textContent.trim(),
          ratio: ratio(fg, bg),
        };
      });
  });
  const minimum = Math.min(...samples.map((sample) => sample.ratio));
  report.contrast.push({
    name,
    samples: samples.length,
    minimum,
    failures: samples.filter((sample) => sample.ratio < 4.5),
  });
  expect(samples.length).toBeGreaterThan(0);
  expect(samples.filter((sample) => sample.ratio < 4.5)).toEqual([]);
}
async function level(number, name) {
  await page
    .getByRole("button", { name: new RegExp(`${number}\\s*${name}`) })
    .click();
}
async function keyboardOpen(locator) {
  await locator.focus();
  await page.keyboard.press("Enter");
}
try {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.addScriptTag({ content: axe.source });
  await page
    .getByText("Accessibility requirements and verification", { exact: true })
    .click();
  await scan("Accessibility documentation");
  await page
    .getByText("Accessibility requirements and verification", { exact: true })
    .click();
  const atoms = await page.locator(".rail-lab-parts button").allTextContents();
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (theme) => document.documentElement.setAttribute("data-theme", theme),
      theme
    );
    await level(1, "Tokens");
    await scan(`${theme} / Tokens`);
    await level(2, "Atoms");
    for (let index = 0; index < atoms.length; index++) {
      await page.locator(".rail-lab-parts button").nth(index).click();
      await scan(`${theme} / Atom ${atoms[index].trim().replace(/\s+/g, " ")}`);
      if (atoms[index].trim().startsWith("Icon")) {
        await page
          .getByText("Semantic definitions for every rail icon", {
            exact: true,
          })
          .click();
        await scan(`${theme} / icon semantics catalog`);
        await page
          .getByText("Semantic definitions for every rail icon", {
            exact: true,
          })
          .click();
      }
    }
    for (const density of ["default", "compact", "dense"]) {
      await level(3, "Rows");
      await page
        .getByRole("combobox", { name: "Density preview" })
        .selectOption(density);
      await page
        .getByRole("checkbox", { name: "Listening", exact: true })
        .check();
      await page.getByRole("checkbox", { name: "Locked", exact: true }).check();
      await scan(`${theme} / Rows / ${density} / both status icons`);
      await contrast(`${theme} / Rows / ${density}`);
      await level(4, "Rail");
      await scan(`${theme} / Rail / ${density}`);
      await contrast(`${theme} / Rail / ${density}`);
      const geometry = await page
        .locator(
          "#rail-lab-navigation .rail-lab-target, #rail-lab-navigation .rail-lab-title, #rail-lab-navigation .rail-lab-documents-toggle"
        )
        .evaluateAll((elements) =>
          elements
            .filter((e) => !e.disabled)
            .map((e) => ({
              name: e.getAttribute("aria-label") || e.textContent,
              width: e.getBoundingClientRect().width,
              height: e.getBoundingClientRect().height,
            }))
        );
      expect(geometry.filter((g) => g.width < 24 || g.height < 24)).toEqual([]);
      check(`${theme} / ${density}: desktop target geometry at least 24px`);
    }
    for (const scenario of [
      "Writable",
      "Read-only",
      "Connector protected",
      "Capabilities available",
    ]) {
      await page
        .getByRole("combobox", { name: "Actions scenario" })
        .selectOption(scenario);
      await keyboardOpen(
        page.getByRole("button", {
          name: "Actions for Product direction",
          exact: true,
        })
      );
      await scan(`${theme} / file menu / ${scenario}`);
      await page.keyboard.press("Escape");
    }
    await page
      .getByRole("combobox", { name: "Actions scenario" })
      .selectOption("Writable");
    for (const content of ["Empty", "Loading", "Error"]) {
      await page
        .getByRole("combobox", { name: "File content" })
        .selectOption(content);
      await scan(`${theme} / ${content}`);
    }
    await page
      .getByRole("combobox", { name: "File content" })
      .selectOption("Populated");
  }
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "light")
  );
  await page
    .getByRole("combobox", { name: "Density preview" })
    .selectOption("compact");
  const railSearch = page.getByRole("searchbox", {
    name: "Search in Studio",
  });
  const pickerBox = await page
    .getByRole("combobox", { name: "Preview Space" })
    .boundingBox();
  const toolbarBox = await page
    .locator("#rail-lab-navigation .rail-lab-search-toolbar")
    .boundingBox();
  expect(Math.abs(pickerBox.x - toolbarBox.x)).toBeLessThan(1);
  expect(
    Math.abs(pickerBox.x + pickerBox.width - toolbarBox.x - toolbarBox.width)
  ).toBeLessThan(1);
  await keyboardOpen(
    page.getByRole("button", { name: "Space Explorer filters in Studio" })
  );
  await scan("Space Explorer filter categories");
  await page.getByRole("menuitem", { name: "Plans", exact: true }).click();
  await expect(
    page.getByRole("menu", { name: "Space Explorer filters" })
  ).not.toBeVisible();
  check(
    "Space picker / search toolbar edges align; Explorer filter menu exposes category navigation"
  );
  await railSearch.fill("Interview");
  await expect(
    page.getByRole("region", { name: "File search results" })
  ).toContainText("Interview summary");
  await scan("File name search results");
  await railSearch.fill("no-such-fixture");
  await expect(
    page.getByText("No matching file names. Try another search.")
  ).toBeVisible();
  await scan("File name search empty result");
  await railSearch.press("Escape");
  await expect(railSearch).toHaveValue("");
  check("File-name search results, no matches and Escape clearing");
  const title = page.getByRole("button", {
    name: "Product direction",
    exact: true,
  });
  await expect(title).toHaveAccessibleDescription(
    /^Text file, listening, locked/
  );
  await title.focus();
  await page.keyboard.press("Tab");
  const actions = page.getByRole("button", {
    name: "Actions for Product direction",
    exact: true,
  });
  await expect(actions).toBeFocused();
  await expect(actions).toHaveCSS("opacity", "1");
  check(
    "Tab reaches actions hidden at rest; focus reveals actions; file states have an accessible description"
  );
  await page.keyboard.press("Enter");
  await page.getByRole("menuitem", { name: /Rename/ }).focus();
  await page.keyboard.press("Enter");
  const rename = page.getByRole("textbox", { name: "Rename file" });
  await expect(rename).toBeFocused();
  await rename.fill("");
  await page.keyboard.press("Enter");
  await expect(rename).toBeVisible();
  await rename.fill("Changed name");
  await page.keyboard.press("Escape");
  await expect(title).toBeFocused();
  check(
    "Rename autofocus, blank-name rejection, Escape cancellation and focus return"
  );
  await keyboardOpen(actions);
  const move = page.getByRole("menuitem", { name: "Move…", exact: true });
  await move.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("menuitem", { name: "Move to Space…", exact: true })
  ).toBeVisible();
  expect(
    await move.evaluate((el) =>
      Boolean(document.getElementById(el.getAttribute("aria-controls")))
    )
  ).toBe(true);
  await scan("Move submenu");
  await page.keyboard.press("ArrowLeft");
  await expect(move).toBeFocused();
  await page.keyboard.press("Escape");
  check(
    "Lazy Move submenu mounts its controlled ID, opens with Right, returns focus with Left"
  );
  for (const submenu of ["Working status", "More"]) {
    await keyboardOpen(actions);
    const trigger = page.getByRole("menuitem", { name: submenu, exact: true });
    await trigger.focus();
    await page.keyboard.press("ArrowRight");
    await scan(`${submenu} submenu`);
    if (submenu === "More") {
      const versions = page.getByRole("menuitem", {
        name: "Version history",
        exact: true,
      });
      await versions.focus();
      await page.keyboard.press("ArrowRight");
      await expect(
        page.getByRole("menuitem", { name: "View versions", exact: true })
      ).toBeVisible();
      await scan("Version history nested submenu");
      await page.keyboard.press("ArrowLeft");
    }
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Escape");
  }
  check("Working status, More and nested Version history keyboard paths");

  const separator = page.getByRole("separator", {
    name: "Resize navigation rail",
  });
  await separator.focus();
  await page.keyboard.press("Home");
  await expect(separator).toHaveAttribute("aria-valuenow", "200");
  await page.keyboard.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", "216");
  await page.keyboard.press("End");
  await expect(separator).toHaveAttribute(
    "aria-valuenow",
    await separator.getAttribute("aria-valuemax")
  );
  await page.getByRole("slider", { name: "Rail width" }).fill("280");
  check(
    "Resize works without dragging: Home, End, ArrowRight, range alternative"
  );
  await keyboardOpen(page.getByRole("combobox", { name: "Preview Space" }));
  await page.getByRole("option", { name: "Add new" }).focus();
  await page.keyboard.press("Enter");
  const addSpace = page.getByRole("dialog", { name: "Add new Space" });
  await expect(addSpace).toBeVisible();
  await scan("Add Space dialog");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("combobox", { name: "Preview Space" })
  ).toBeFocused();
  await keyboardOpen(page.getByRole("button", { name: "Create preview file" }));
  await page
    .getByRole("menuitem", { name: "Create File", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const newFile = page.getByRole("textbox", { name: "New file name" });
  await expect(newFile).toBeFocused();
  await scan("Inline file creation");
  await newFile.fill("Accessible new file");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Accessible new file", exact: true })
  ).toBeVisible();
  check(
    "Space picker, Add Space dialog and file creation operate from the keyboard"
  );
  await page
    .getByRole("textbox", { name: "What would you change?" })
    .fill("Accessibility verification");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.locator(".rail-lab-status")).toHaveText(
    "Saved note on Rail."
  );
  await expect(page.locator(".rail-lab-status")).toHaveAttribute(
    "role",
    "status"
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export notes/ }).click();
  expect((await download).suggestedFilename()).toBe(
    "weft-navigation-rail-notes.md"
  );
  check(
    "Feedback save updates live status and export downloads without a runtime error"
  );
  await page
    .getByRole("combobox", { name: "File content" })
    .selectOption("Error");
  await keyboardOpen(page.getByRole("button", { name: "Retry", exact: true }));
  await expect(
    page.getByRole("region", { name: "Preview files" })
  ).toBeFocused();
  await expect(page.locator(".rail-lab-status")).toHaveText(
    "Files loaded. Focus returned to the file list."
  );
  check(
    "Retry restores focus to the loaded file region and updates live status"
  );
  for (const viewport of [
    { width: 320, height: 710 },
    { width: 390, height: 844 },
    { width: 800, height: 600 },
    { width: 320, height: 320 },
  ]) {
    await page.setViewportSize(viewport);
    await page
      .getByRole("combobox", { name: "Device preview" })
      .selectOption("Auto");
    await expect(
      page.getByRole("button", { name: "Open navigation" })
    ).toBeVisible();
    for (const density of ["default", "compact", "dense"]) {
      await page
        .getByRole("combobox", { name: "Density preview" })
        .selectOption(density);
      await keyboardOpen(page.getByRole("button", { name: "Open navigation" }));
      const dialog = page.getByRole("dialog", {
        name: "Space navigation",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveCSS("animation-name", "none");
      await scan(
        `Auto drawer / ${viewport.width} × ${viewport.height} / ${density}`
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
      await dialog.getByRole("button", { name: "Close", exact: true }).focus();
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement)
        )
      ).toBe(true);
      const targets = await dialog.locator("button").evaluateAll((elements) =>
        elements
          .filter((e) => !e.disabled)
          .map((e) => ({
            label: e.textContent || e.getAttribute("aria-label"),
            width: e.getBoundingClientRect().width,
            height: e.getBoundingClientRect().height,
          }))
      );
      expect(
        targets.every((t) => t.height >= 44 && t.width >= 44),
        JSON.stringify(targets.filter((t) => t.height < 44 || t.width < 44))
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "Open navigation" })
      ).toBeFocused();
      check(
        `Drawer ${viewport.width}×${viewport.height} / ${density}: no page overflow, focus contained, Escape closes and restores focus, minimum target geometry`
      );
    }
  }
  await page.setViewportSize({ width: 1490, height: 1091 });
  await page.locator("details.rail-lab-honesty").evaluate((element) => { element.open = true; });
  await page
    .getByText("Record feedback for Organization switching", { exact: true })
    .click();
  await scan("Expanded functionality audit and decision feedback");
  await page
    .getByText("Avalandra functionality coverage — gaps and decisions", {
      exact: true,
    })
    .click();
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await scan("Forced colors and reduced motion");
  // Restore keyboard modality after pointer-operated audit disclosure controls.
  await page.keyboard.press("Tab");
  await page
    .getByRole("button", { name: "Product direction", exact: true })
    .focus();
  expect(
    await page
      .locator(".rail-lab-row")
      .filter({
        has: page.getByRole("button", {
          name: "Product direction",
          exact: true,
        }),
      })
      .evaluate((el) => getComputedStyle(el).outlineStyle)
  ).not.toBe("none");
  await expect(
    page
      .locator('#rail-lab-navigation .rail-lab-row[data-current="true"]')
      .first()
  ).toHaveCSS("border-inline-start-width", "2px");
  check(
    "Forced-color mode preserves current marker and keyboard row outline; reduced motion enabled"
  );
  expect(report.errors).toEqual([]);
  expect(report.scans.flatMap((scan) => scan.violations)).toEqual([]);
} catch (error) {
  report.failure = error.stack;
  console.error(error);
  process.exitCode = 1;
} finally {
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  await browser.close();
  console.log(`Report: ${output}`);
}
