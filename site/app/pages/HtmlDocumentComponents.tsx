import React, {useState} from 'react';
import { HtmlLayoutGuidance } from './HtmlLayoutGuidance';
export { HtmlLayoutGuidance };
import * as D from '../../../src/ui/document-content';
import inventory from '../../../tooling/html-document-components.json';
import { PageTitle } from './shared';
import '../../../css/weft-components.css';

function AuthoringInventory(){return <div className="weft-doc"><D.DocumentHeading level={2}>HTML authoring guide</D.DocumentHeading>{inventory.authoringRules.map(rule=><D.DocumentSection key={rule.title} heading={rule.title} headingId={`guide-${rule.title.toLowerCase().replaceAll(' ','-')}`} headingLevel={3}><D.DocumentText>{rule.description}</D.DocumentText></D.DocumentSection>)}<D.DocumentHeading level={2}>Explore visual techniques</D.DocumentHeading><D.DocumentText>Try columns, cards, summary metrics, state badges, callouts, expandable panels, code, tables, images and diagrams. Mix techniques, adapt the examples, or create your own.</D.DocumentText><D.DocumentHeading level={2}>Using Weft in HTML</D.DocumentHeading><D.DocumentText>Use the Typography, Tokens and Components references in this design system to find reusable foundations. Pair foreground and background colors for the intended theme.</D.DocumentText></div>;}

export function HtmlDocumentComponents(){
 const [level,setLevel]=useState<'foundations'|'organisms'>('foundations');
 return <div><PageTitle eyebrow="HTML authoring" title="Build flexible HTML documents" summary="Compose supported HTML and CSS freely. Use Weft where it helps and choose the visual techniques your content needs."/>
 <nav aria-label="Authoring examples" style={{display:'flex',flexWrap:'wrap',gap:8,marginBlock:24}}>{(['foundations','organisms'] as const).map(item=><button key={item} type="button" aria-pressed={level===item} onClick={()=>setLevel(item)} style={{padding:'8px 12px',border:'1px solid var(--weft-rule)',borderBottom:level===item?'3px solid var(--weft-blue)':'3px solid transparent',color:level===item?'var(--weft-link)':'var(--weft-ink)',background:'var(--weft-paper)'}}>{{foundations:'Authoring guide',organisms:'Layout examples'}[item]}</button>)}</nav>
 {level==='foundations'?<AuthoringInventory/>:<HtmlLayoutGuidance/>}
 </div>;
}
