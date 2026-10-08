import { AlignLeft, PanelTop, Sheet, Presentation, Image } from 'lucide-react';

/** File identity is shared by navigation and file chrome, never chosen by placement. */
export const fileTypeIcons = Object.freeze({
  document: AlignLeft,
  htmlFile: PanelTop,
  spreadsheet: Sheet,
  presentation: Presentation,
  image: Image,
});
