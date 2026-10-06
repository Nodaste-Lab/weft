import type { Specimen } from './specimen-types';
import { actionsSpecimens } from './specimens/actions';
import { inputsSpecimens } from './specimens/inputs';
import { formsSpecimens } from './specimens/forms';
import { togglesSpecimens } from './specimens/toggles';
import { navigationSpecimens } from './specimens/navigation';
import { menusSpecimens } from './specimens/menus';
import { overlaySpecimens } from './specimens/overlay';
import { disclosureSpecimens } from './specimens/disclosure';
import { feedbackSpecimens } from './specimens/feedback';
import { data_displaySpecimens } from './specimens/data-display';
import { layoutSpecimens } from './specimens/layout';
import { typographySpecimens } from './specimens/typography';
import { mediaSpecimens } from './specimens/media';

/**
 * Specimens: how to render one instance of a component so the site can lay
 * out every variant (from props-snapshot.json) and every state, each labelled
 * with the code that produces it. One file per manifest category under
 * ./specimens/; src/gallery/__tests__/specimens.test.tsx renders every cell
 * and checks the axes against the contract.
 */
export const specimens: Record<string, Specimen> = {
  ...actionsSpecimens,
  ...inputsSpecimens,
  ...formsSpecimens,
  ...togglesSpecimens,
  ...navigationSpecimens,
  ...menusSpecimens,
  ...overlaySpecimens,
  ...disclosureSpecimens,
  ...feedbackSpecimens,
  ...data_displaySpecimens,
  ...layoutSpecimens,
  ...typographySpecimens,
  ...mediaSpecimens,
};
