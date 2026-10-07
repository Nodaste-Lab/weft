import * as React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../../../src/ui/dialog';
import { TextField } from '../../../src/ui/text-field';
import { Button } from '../../../src/ui/button';

/** Shared local-fixture creation flow; consumers own the Space list and selection. */
export function PreviewSpaceDialog({open,onOpenChange,existingNames,onCreate,triggerId}:{open:boolean;onOpenChange:(open:boolean)=>void;existingNames:string[];onCreate:(name:string)=>void;triggerId:string}) {
 const [name,setName]=React.useState('');
 const [error,setError]=React.useState('');
 const field=React.useRef<HTMLInputElement|HTMLTextAreaElement>(null);
 React.useEffect(()=>{if(open){setName('');setError('');}},[open]);
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent onCloseAutoFocus={event=>{event.preventDefault();requestAnimationFrame(()=>document.getElementById(triggerId)?.focus());}}>
 <DialogTitle>Add new Space</DialogTitle><DialogDescription>Create a Space in this local preview.</DialogDescription>
 <form noValidate onSubmit={event=>{event.preventDefault();const next=name.trim();if(!next||['Studio','Private','__add-space','__weft_add_space__',...existingNames].some(value=>value.toLocaleLowerCase()===next.toLocaleLowerCase())){setError('Enter a unique Space name.');field.current?.focus();return;}onCreate(next);onOpenChange(false);}}>
 <TextField ref={field} label="Space name (required)" required value={name} onChange={event=>{setName(event.target.value);setError('');}} error={error} description="Use a unique name. Studio, Private and existing names are unavailable." />
 <DialogFooter><Button type="button" variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit">Create Space</Button></DialogFooter>
 </form></DialogContent></Dialog>;
}
