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

test('aria-label names a control', async ({ page }) => {
  const node = await axNode(page, '#nm-arialabel');
  // Not a known defect: this rung already works, and the assertion exists so a
  // labelling change cannot quietly remove it.
  await measure({
    key: 'naming/aria-label-only/name',
    shortfall: binary(node.name === 'Filter results'),
    evidence: `name ${JSON.stringify(node.name)}`,
    failure: 'aria-label no longer names the control.',
  });
});

test('a placeholder is not a name', async ({ page }) => {
  const node = await axNode(page, '#nm-placeholder');
  const placeholder = await page.locator('#nm-placeholder').getAttribute('placeholder');
  await measure({
    key: 'naming/placeholder-only/placeholder-is-not-a-name',
    shortfall: binary(node.name !== placeholder),
    evidence: `name ${JSON.stringify(node.name)}, placeholder ${JSON.stringify(placeholder)}`,
    // The failure has to name the control and say why, because the tool-based
    // check passes this case and a bare "expected true" would send the next
    // reader to axe.
    failure:
      '#nm-placeholder is named only by its placeholder. That satisfies the accessible-name ' +
      'computation and axe lists it under passes, but the name disappears the moment the user ' +
      'types. A placeholder is a format hint, never a name.',
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

  test('does not put punctuation in the name', async ({ page }) => {
    const node = await axNode(page, '#nm-required');
    const name = node.name ?? '';
    await measure({
      key: 'naming/required-marker/name-carries-no-marker-glyph',
      shortfall: binary(!name.includes('*')),
      evidence: `name ${JSON.stringify(name)}`,
      failure: 'The marker glyph is inside the accessible name, where it reads as punctuation.',
    });
  });
});
