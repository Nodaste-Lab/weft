import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileTypeIcons } from '../file-type-icons';
import { fileShellIcons } from '../file-shell-icons';

describe('file shell semantic icon contract', () => {
  it('reserves a distinct glyph for each meaning', () => {
    expect(Object.isFrozen(fileShellIcons)).toBe(true);
    expect(new Set(Object.values(fileShellIcons)).size).toBe(Object.keys(fileShellIcons).length);
  });
  it('shares file identity with navigation', () => {
    expect(fileShellIcons.document).toBe(fileTypeIcons.document);
    expect(fileShellIcons.htmlFile).toBe(fileTypeIcons.htmlFile);
    expect(fileShellIcons.document.displayName).toBe('AlignLeft');
    expect(fileShellIcons.htmlFile.displayName).toBe('PanelTop');
    const navigation = readFileSync(new URL('../../ui/navigation-icon.tsx', import.meta.url), 'utf8');
    expect(navigation).toContain('text: fileTypeIcons.document');
    expect(navigation).toContain('html: fileTypeIcons.htmlFile');
  });
  it('locks the agreed annotation and panel meanings', () => {
    expect(Object.fromEntries(['selectElement', 'dropCommentPin', 'comments', 'workingStatus', 'review', 'fileInfo', 'versionHistory'].map(key => [key, fileShellIcons[key as keyof typeof fileShellIcons].displayName]))).toEqual({
      selectElement: 'SquareDashedMousePointer', dropCommentPin: 'Crosshair', comments: 'MessageSquare', workingStatus: 'SquareKanban', review: 'ClipboardCheck', fileInfo: 'Info', versionHistory: 'History',
    });
  });
  it('keeps shell consumers from independently importing glyphs', () => {
    for (const path of ['../../gallery/FileHeaderExample.tsx', '../../ui/file-header.tsx', '../navigation-action-label.tsx', '../../../site/app/pages/FileHeaderTemplate.tsx']) {
      const source = readFileSync(new URL(path, import.meta.url), 'utf8');
      expect(source).not.toMatch(/from\s+['"]lucide-react['"]/);
      expect(source).toContain('fileShellIcons');
    }
  });
});
