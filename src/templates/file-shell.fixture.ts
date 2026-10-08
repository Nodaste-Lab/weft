import type { FileParticipant, FileSavedVersion, FileRevision } from '../ui/file-shell-controls';
/** Fictional examples, never component defaults. */
export const fileShellParticipants:FileParticipant[]=[{id:'avery',name:'Avery Chen',initials:'AC',kind:'human'},{id:'jordan',name:'Jordan Lee',initials:'JL',kind:'agent'}];
export const fileShellVersions:FileSavedVersion[]=[{id:'snapshot-1',label:'Design checkpoint',revisionId:'revision-1',createdAt:'2026-10-01T10:00:00Z',creator:'Avery Chen',canonical:true},{id:'snapshot-2',label:'Updated proposal',revisionId:'revision-2',createdAt:'2026-10-02T10:00:00Z',creator:'Jordan Lee',current:true}];
export const fileShellRevisions:FileRevision[]=[{id:'revision-2',previousId:'revision-1',createdAt:'2026-10-02T10:00:00Z',creator:'Jordan Lee',current:true},{id:'revision-1',previousId:null,createdAt:'2026-10-01T10:00:00Z',creator:'Avery Chen',canonical:true}];
