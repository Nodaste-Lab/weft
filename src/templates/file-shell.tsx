import * as React from 'react';
import { FileHeader, type FileHeaderProps } from '../ui/file-header';
import { FileShellPanels, FilePresence, FileAnnotationModes, FileToolbar, useFileAnnotationCursor, type FileShellPanel, type FilePanelPurpose, type FileParticipant, type FileAnnotationMode, type FileToolbarCommand } from '../ui/file-shell-controls';
export type FileShellCapabilities = { read:boolean; write:boolean; comment:boolean; review:boolean };
export type FileShellProps = {
 showHeader?:boolean;
 header: Omit<FileHeaderProps,'actions'|'onRename'|'icon'>;
 capabilities: FileShellCapabilities;
 onRename?: FileHeaderProps['onRename'];
 actions?:React.ReactNode;
 participants:readonly FileParticipant[];
 panels:readonly FileShellPanel[];
 activePanel:FilePanelPurpose|null;
 onPanelChange:(purpose:FilePanelPurpose|null)=>void;
 annotationMode:FileAnnotationMode|null;
 onAnnotationModeChange:(mode:FileAnnotationMode)=>void;
 commands:readonly FileToolbarCommand[];
 children:React.ReactNode;
};
/** Presentation-only template. No services, fixture defaults or inferred permission grants. */
export function FileShell({showHeader=true,header,capabilities,onRename,actions,participants,panels,activePanel,onPanelChange,annotationMode,onAnnotationModeChange,commands,children}:FileShellProps){
 const root=React.useRef<HTMLDivElement>(null);const surface=React.useRef<HTMLDivElement>(null);
 const html=header.fileKind==='htmlFile';const mode=capabilities.read&&capabilities.comment&&html?annotationMode:null;
 useFileAnnotationCursor(surface,root,mode);
 const available=capabilities.read?panels.filter(p=>p.purpose!=='review'||capabilities.review):[];
 const availablePurposes=available.map(p=>p.purpose).join(',');
 React.useEffect(()=>{if(activePanel&&!available.some(p=>p.purpose===activePanel))onPanelChange(null);},[activePanel,availablePurposes,onPanelChange]);
 const active=available.some(p=>p.purpose===activePanel)?activePanel:null;
 if(!capabilities.read)return <p>Access unavailable.</p>;
 return <div ref={root} className="weft-file-shell">{showHeader&&<FileHeader {...header} onRename={capabilities.write?onRename:undefined} actions={<>{html&&capabilities.comment&&capabilities.read&&<FileAnnotationModes mode={mode} onModeChange={onAnnotationModeChange}/>}<FilePresence participants={capabilities.read?participants:[]} label="Participants in this file session"/>{actions}</>}/>}{capabilities.read?<FileShellPanels panels={available} active={active} onActiveChange={onPanelChange} label="File side controls">{header.fileKind==='document'&&commands.length>0&&<FileToolbar commands={commands.map(c=>({...c,disabled:c.disabled||(!capabilities.write&&c.purpose!=='comments')||(!capabilities.comment&&c.purpose==='comments')}))} label="Text formatting"/>}<div ref={surface} className="weft-file-shell-surface" data-annotation-mode={mode??undefined}>{children}</div></FileShellPanels>:<p>Access unavailable.</p>}</div>;
}
