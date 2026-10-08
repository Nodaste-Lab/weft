import * as React from "react";
import { fileShellIcons } from "./file-shell-icons";
const { newFile: FilePlus, htmlFile: FileCode, rename: Pencil, duplicate: Copy, move: FolderInput, link: Link, review: Review, versionHistory: History, saveVersion: Save, restoreVersion: RotateCcw, remove: Trash2, workingStatus: WorkingStatus, moreActions: MoreHorizontal } = fileShellIcons;
export const ActionLabel = ({label,purpose}:{label:string;purpose?:keyof typeof fileShellIcons}) => {
 const Icon = purpose ? fileShellIcons[purpose] : /^(New child|New File)/.test(label) ? FilePlus : /^HTML file/.test(label) ? FileCode : label==='Rename' ? Pencil : /^(Duplicate|Copy to)/.test(label) ? Copy : /^Move/.test(label) ? FolderInput : label==='Copy link' ? Link : label==='Mark reviewed' ? Review : /^(Version history|View versions)/.test(label) ? History : label==='Save version' ? Save : label==='Restore version' ? RotateCcw : /^Remove/.test(label) ? Trash2 : label==='Working status' ? WorkingStatus : label==='More' ? MoreHorizontal : null;
 return <>{Icon && <Icon size={16} aria-hidden="true" style={{flexShrink:0}}/>}<span>{label}</span></>;
};
