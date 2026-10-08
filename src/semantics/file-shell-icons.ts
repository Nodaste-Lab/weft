/** Semantic contract for file chrome. Consumers choose an intent, never a glyph.
 * These meanings are reserved within the file shell; changing one is a design-system change.
 * Icons are decorative: controls must retain their accessible names.
 */
import { MessageSquare, ClipboardCheck, Bold, Italic, Strikethrough, Code, List, ListOrdered, IndentIncrease, IndentDecrease, Quote, Minus, Link, Table, Undo, Redo, Heading1, Heading2, Pilcrow, Info, KanbanSquare, MousePointerSquareDashed, Crosshair, SquareCode, FilePlus, Pencil, Copy, FolderInput, History, Save, RotateCcw, Trash2, MoreHorizontal, Check, CloudOff, CircleAlert, LoaderCircle, Pin, Upload, Stamp, Clock, Archive } from 'lucide-react';

import { fileTypeIcons } from './file-type-icons';

export const fileShellIcons = Object.freeze({
  document: fileTypeIcons.document,
  image: fileTypeIcons.image,
  spreadsheet: fileTypeIcons.spreadsheet,
  presentation: fileTypeIcons.presentation,
  comments: MessageSquare,
  review: ClipboardCheck,
  bold: Bold,
  italic: Italic,
  strikethrough: Strikethrough,
  inlineCode: Code,
  bulletList: List,
  numberedList: ListOrdered,
  indent: IndentIncrease,
  outdent: IndentDecrease,
  quote: Quote,
  horizontalRule: Minus,
  link: Link,
  table: Table,
  undo: Undo,
  redo: Redo,
  heading1: Heading1,
  heading2: Heading2,
  paragraph: Pilcrow,
  fileInfo: Info,
  workingStatus: KanbanSquare,
  htmlFile: fileTypeIcons.htmlFile,
  selectElement: MousePointerSquareDashed,
  dropCommentPin: Crosshair,
  codeBlock: SquareCode,
  newFile: FilePlus,
  rename: Pencil,
  duplicate: Copy,
  move: FolderInput,
  versionHistory: History,
  saveVersion: Save,
  restoreVersion: RotateCcw,
  remove: Trash2,
  moreActions: MoreHorizontal,
  pinToSpace: Pin,
  publish: Upload,
  canonical: Stamp,
  defer: Clock,
  archive: Archive,
  saved: Check,
  offline: CloudOff,
  saveError: CircleAlert,
  saving: LoaderCircle,
 });
export type FileShellIconPurpose = keyof typeof fileShellIcons;
