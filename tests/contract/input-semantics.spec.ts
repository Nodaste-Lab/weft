/**
 * What the plain-CSS input surface exposes about itself.
 *
 * Read from Chromium's accessibility tree over CDP. That establishes EXPOSURE:
 * the name and description a browser computes and hands to assistive
 * technology. It establishes nothing about announcement — what a given screen
 * reader says, in what order, or whether it says anything at all, varies by
 * product and by setting, and this suite tests none of them. No assertion here
 * may be quoted as evidence that a user hears something.
 *
 * Paired with src/ui/__tests__ for the React layer. This file is the layer a
 * sandboxed panel iframe can actually reach, which is the one the audit found
 * thinner than the doctrine describing it.
 */
import { expect, test } from '@playwright/test';
import { SPECIMEN_PAGE, axNode } from './harness';
import { binary, measure } from './ratchet';

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

test('a visible label exposes the name its markup says', async ({ page }) => {
  const node = await axNode(page, '#nm-visible');
  await measure({
    key: 'naming/visible-label/name-matches-markup',
    shortfall: binary(node.name === 'Project name'),
    evidence: `name ${JSON.stringify(node.name)}`,
    failure: 'The exposed name is not the text the markup carries, in the case the markup uses it.',
  });
});

test('a group legend names its group', async ({ page }) => {
  const node = await axNode(page, '#nm-group');
  expect(node.role).toBe('group');
  await measure({
    key: 'naming/group-legend/name-matches-markup',
    shortfall: binary(node.name === 'Retention policy'),
    evidence: `name ${JSON.stringify(node.name)}`,
    failure: 'The group is exposed under a name the legend markup does not carry.',
  });
});

test('no control anywhere is named by its placeholder', async ({ page }) => {
  // Page-wide, not one specimen. The rule is "a placeholder is a format hint,
  // never a name", and a rule checked on the single control that exists to
  // demonstrate it is a demonstration, not a rule. Every control on the page
  // that carries a placeholder is checked, so adding a placeholder-named field
  // anywhere fails here.
  const withPlaceholder = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[placeholder]')].map((el) => ({
      id: el.id,
      placeholder: el.getAttribute('placeholder')!,
    })),
  );
  expect(withPlaceholder.length, 'no control on the page carries a placeholder').toBeGreaterThan(0);

  const named: string[] = [];
  const readings: string[] = [];
  for (const { id, placeholder } of withPlaceholder) {
    const node = await axNode(page, `#${id}`);
    readings.push(`#${id}: name ${JSON.stringify(node.name)}, placeholder ${JSON.stringify(placeholder)}`);
    if ((node.name ?? '').trim() === placeholder.trim()) named.push(`#${id}`);
  }

  await measure({
    key: 'naming/placeholder-only/placeholder-is-not-a-name',
    shortfall: named.length,
    evidence: readings.join('; '),
    // The failure has to name the control and say why, because the tool-based
    // check passes this case and a bare "expected true" would send the next
    // reader to axe.
    failure:
      `Named only by a placeholder: ${named.join(', ')}. That satisfies the accessible-name ` +
      'computation and axe lists it under passes, but the name disappears the moment the user ' +
      'types. A placeholder is a format hint, never a name.',
  });
});

test('the hidden-until-focused utility takes space only while focused', async ({ page }) => {
  const link = page.locator('#nm-skip');
  const at = async () => {
    const box = await link.boundingBox();
    return box ? Math.round(box.width * box.height) : 0;
  };
  const resting = await at();
  await link.focus();
  const focused = await at();
  await measure({
    key: 'naming/sr-only-focusable/reveals-on-focus',
    shortfall: binary(resting <= 1 && focused > 1),
    evidence: `${resting}px² at rest, ${focused}px² focused`,
    failure:
      'A skip-link-style usage has to be reachable and then visible once reached. It is either ' +
      'taking space at rest or staying invisible after focus.',
  });
});

test('an icon-only control is named by aria-label', async ({ page }) => {
  // The one rung of the ladder where aria-label is sanctioned. There is no text
  // to associate, and the glyph carries no name of its own.
  const node = await axNode(page, '#nm-icon');
  await measure({
    key: 'naming/aria-label-icon-only/name',
    shortfall: binary(node.name === 'Refresh results'),
    evidence: `name ${JSON.stringify(node.name)}`,
    failure: 'The icon-only control has lost the only name it can have.',
  });
});

test.describe('a hidden label names a control without showing one', () => {
  test('the name is the label text', async ({ page }) => {
    const node = await axNode(page, '#nm-hidden');
    await measure({
      key: 'naming/hidden-label/name',
      shortfall: binary(node.name === 'Filter results'),
      evidence: `name ${JSON.stringify(node.name)}`,
      failure: 'The hidden label no longer names its control.',
    });
  });

  test('the label occupies no layout space', async ({ page }) => {
    const label = page.locator('label[for="nm-hidden"]');
    const box = await label.boundingBox();
    const area = box ? box.width * box.height : 0;
    await measure({
      key: 'naming/hidden-label/occupies-no-layout-space',
      // Shortfall is the rendered area: a partly-hidden label is better than a
      // fully visible one, and the number says which.
      shortfall: Math.max(0, area - 1),
      evidence: `rendered box ${box ? `${box.width}x${box.height}` : 'none'} = ${area}px²`,
      failure: 'The label meant to be hidden is taking layout space.',
    });
  });

  test('the label stays reachable rather than being removed', async ({ page }) => {
    // Permanent guard on the shape of the eventual fix, not a defect: whatever
    // P3 ships must not reach for display:none or visibility:hidden, both of
    // which take the label out of the accessibility tree along with the layout.
    const styles = await page.locator('label[for="nm-hidden"]').evaluate((el) => {
      const s = getComputedStyle(el);
      return { display: s.display, visibility: s.visibility };
    });
    await measure({
      key: 'naming/hidden-label/not-removed-from-the-tree',
      shortfall: binary(styles.display !== 'none' && styles.visibility !== 'hidden'),
      evidence: `display ${styles.display}, visibility ${styles.visibility}`,
      failure:
        'display:none and visibility:hidden remove the label from the accessibility tree along ' +
        'with the layout, which is the opposite of a hidden label.',
    });
  });
});

test('help text is exposed as the field description', async ({ page }) => {
  const node = await axNode(page, '#nm-help');
  const description = node.description ?? '';
  await measure({
    key: 'naming/help-text/description-exposes-help',
    shortfall: binary(description.includes('Must be reachable over HTTPS.')),
    evidence: `description ${JSON.stringify(description)}`,
    failure: 'The help text is a sibling of the control and nothing associates the two.',
  });
});

test.describe('an error is exposed with the field', () => {
  test('the error copy reaches the description', async ({ page }) => {
    const node = await axNode(page, '#nm-error');
    const description = node.description ?? '';
    await measure({
      key: 'naming/error-text/description-exposes-error',
      shortfall: binary(description.includes('That address did not resolve.')),
      evidence: `description ${JSON.stringify(description)}`,
      failure: 'aria-invalid is exposed but the error copy is not part of the description.',
    });
  });

  test('the control carries aria-invalid', async ({ page }) => {
    const node = await axNode(page, '#nm-error');
    await measure({
      key: 'naming/error-text/aria-invalid',
      shortfall: binary(node.properties.invalid === 'true'),
      evidence: `invalid ${node.properties.invalid}`,
      failure: 'The control in error does not expose aria-invalid.',
    });
  });
});

test('a description carries each message exactly once', async ({ page }) => {
  const node = await axNode(page, '#nm-both');
  const description = node.description ?? '';
  const occurrences = (needle: string) => description.split(needle).length - 1;
  const messages = ['Whole days, 1 or more.', 'Zero is not a window.'];
  // Shortfall counts messages that are not present exactly once, so "missing
  // both" is worse than "one duplicated" and the ratchet can tell them apart.
  const wrong = messages.filter((m) => occurrences(m) !== 1);
  await measure({
    key: 'naming/help-then-error/description-carries-each-message-once',
    shortfall: wrong.length,
    evidence: `description ${JSON.stringify(description)}`,
    failure: `Not exposed exactly once: ${wrong.map((m) => `${JSON.stringify(m)} x${occurrences(m)}`).join(', ')}`,
  });
});

test.describe('the required marker', () => {
  test('marks the control as required', async ({ page }) => {
    const node = await axNode(page, '#nm-required');
    await measure({
      key: 'naming/required-marker/required-is-true',
      shortfall: binary(node.properties.required === true),
      evidence: `required ${node.properties.required}`,
      failure: 'The marker is decoration: the control does not expose a required state.',
    });
  });

  test('reads as words in the name, not punctuation and not one word', async ({ page }) => {
    const node = await axNode(page, '#nm-required');
    const name = node.name ?? '';
    // Two things, because the first fix produced the second bug. Removing the
    // glyph is not enough if the marker then fuses onto the label — the first
    // pass at this exposed "RETENTIONREQUIRED", one word, because
    // accessible-name computation concatenates text nodes and the markup had no
    // space between them.
    const problems: string[] = [];
    if (name.includes('*')) problems.push('the marker glyph is in the name');
    if (!/retention\s+required/i.test(name)) problems.push('the marker is not a separate word');
    await measure({
      key: 'naming/required-marker/name-carries-no-marker-glyph',
      shortfall: problems.length,
      evidence: `name ${JSON.stringify(name)}`,
      failure: `The required marker is not readable as text: ${problems.join('; ')}.`,
    });
  });
});
